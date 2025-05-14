"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassType, ClassLevel, ClassCategory } from "@/lib/supabase/class-types";
import { createClass, updateClass } from "@/lib/supabase/classes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Dummy instructor data for fallback
const dummyInstructors = [
  { id: "550e8400-e29b-41d4-a716-446655440000", name: "Maya Johnson" },
  { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", name: "David Singh" },
  // { id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8", name: "Leila Patel" },
  // { id: "6ba7b812-9dad-11d1-80b4-00c04fd430c8", name: "Alex Williams" },
  // { id: "6ba7b813-9dad-11d1-80b4-00c04fd430c8", name: "Sarah Thompson" },
];

// Form schema
const classFormSchema = z.object({
  title: z.string().min(3, {
    message: "Class name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  instructor_id: z.string().uuid({
    message: "Please select an instructor.",
  }),
  duration_minutes: z.coerce.number().min(15, {
    message: "Duration must be at least 15 minutes.",
  }),
  capacity: z.coerce.number().min(1, {
    message: "Capacity must be at least 1.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  level: z.enum(["beginner", "intermediate", "advanced", "all levels"]),
  category: z.enum(["yoga", "meditation", "pilates", "fitness", "wellness"]),
  image_url: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["active", "inactive", "cancelled", "scheduled", "completed"]).default("active"),
  recurring: z.boolean().default(false),
  recurring_pattern: z.string().optional(),
  start_time: z.string().optional(),
  start_date: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export default function ClassForm({ initialData, onSuccess }: ClassFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [instructors, setInstructors] = useState<{ id: string; name: string }[]>(dummyInstructors);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  console.log('*********instructors ', instructors);

  // Helper function to convert date and time to ISO timestamp
  const combineDateTime = (date: string, time: string): string => {
    if (!date || !time) return "";
    try {
      // Create a date object from the date string
      const dateObj = new Date(date);
      // Extract hours and minutes from time string (format: HH:MM)
      const [hours, minutes] = time.split(':').map(Number);
      // Set the hours and minutes
      dateObj.setHours(hours, minutes, 0, 0);
      // Return ISO string
      return dateObj.toISOString();
    } catch (error) {
      console.error('Error combining date and time:', error);
      return "";
    }
  };

  // State for handling date and time separately in the UI
  const [timeValue, setTimeValue] = useState("");

  // When initialData changes, extract time from timestamp
  useEffect(() => {
    if (initialData?.start_time) {
      try {
        const date = new Date(initialData.start_time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setTimeValue(`${hours}:${minutes}`);
      } catch (error) {
        console.error('Error parsing start_time:', error);
      }
    }
  }, [initialData]);

  // Initialize form with default values or initial data if editing
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: initialData ? {
      title: initialData.title || initialData.name || "",
      description: initialData.description || "",
      instructor_id: initialData.instructor_id || "",
      duration_minutes: initialData.duration_minutes || 60,
      capacity: initialData.capacity || 15,
      price: initialData.price || 0,
      level: initialData.level || "beginner",
      category: initialData.category || "yoga",
      image_url: initialData.image_url || "",
      location: initialData.location || "",
      status: initialData.status || "active",
      recurring: initialData.recurring || false,
      recurring_pattern: initialData.recurring_pattern || "",
      start_time: initialData.start_time || "",
      start_date: initialData.start_date || "",
    } : {
      title: "",
      description: "",
      instructor_id: "",
      duration_minutes: 60,
      capacity: 15,
      price: 0,
      level: "beginner" as ClassLevel,
      category: "yoga" as ClassCategory,
      image_url: "",
      location: "",
      status: "active",
      recurring: false,
      recurring_pattern: "",
      start_time: "",
      start_date: "",
    },
  });

  // Set image preview if initialData has an image_url
  useEffect(() => {
    if (initialData?.image_url) {
      setImagePreview(initialData.image_url);
    }
  }, [initialData]);

  // Define the fetchInstructors function outside the useEffect
  async function fetchInstructors() {
    try {
      // First, try to fetch instructors from user_roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('role', 'instructor');
        
      if (roleError) {
        console.error('Error fetching instructor roles:', roleError);
        throw roleError;
      }
      console.log('Fetched instructor roles:', roleData);
      
      if (roleData && roleData.length > 0) {
        // Now fetch user details from profiles table if it exists
        try {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', roleData.map(role => role.user_id));
            
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            throw profilesError;
          }
          
          if (profilesData && profilesData.length > 0) {
            const formattedInstructors = profilesData.map(profile => ({
              id: profile.id,
              name: profile.full_name || profile.email || 'Unknown Instructor'
            }));
            
            setInstructors(formattedInstructors);
            return;
          }
        } catch (error) {
          console.error('Error processing profiles:', error);
        }
      }
      
      // Fallback: Try to fetch from instructors table directly
      try {
        const { data: instructorsData, error: instructorsError } = await supabase
          .from('instructors')
          .select('id, name');
          
        if (instructorsError) {
          console.error('Error fetching instructors table:', instructorsError);
          throw instructorsError;
        }
        
        if (instructorsData && instructorsData.length > 0) {
          setInstructors(instructorsData);
          return;
        }
      } catch (error) {
        console.error('Error processing instructors table:', error);
      }
      
      // If we get here, use dummy data
      console.log('Using dummy instructor data as fallback');
      setInstructors(dummyInstructors);
      
    } catch (error) {
      console.error('Error in fetchInstructors:', error);
      setInstructors(dummyInstructors);
    }
  }

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors();
  }, []);


  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle time change separately
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
    
    // Update the form's start_time with the combined date and time
    const date = form.getValues('start_date');
    if (date && e.target.value) {
      const timestamp = combineDateTime(date, e.target.value);
      form.setValue('start_time', timestamp);
    }
  };

  // Handle date change to also update the timestamp
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('start_date', e.target.value);
    
    // Update the form's start_time with the combined date and time
    if (e.target.value && timeValue) {
      const timestamp = combineDateTime(e.target.value, timeValue);
      form.setValue('start_time', timestamp);
    }
  };

  // Form submission handler
  async function onSubmit(values: ClassFormValues) {
    console.log('*********values ', values);
    setIsLoading(true);
    
    try {
      // Ensure we have a proper timestamp for start_time
      if (values.start_date && timeValue) {
        values.start_time = combineDateTime(values.start_date, timeValue);
      }
      
      if (initialData) {
        // Update existing class
        const { data, error } = await updateClass(initialData.id, values, imageFile || undefined);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Class updated",
          description: `${values.title} has been updated successfully.`,
        });
      } else {
        // Create new class
        const { data, error } = await createClass(values, imageFile || undefined);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Class created",
          description: `${values.title} has been created successfully.`,
        });
      }
      
      // Reset form if creating a new class
      if (!initialData) {
        form.reset();
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      
      // Navigate back to classes list
      router.push("/admin-dashboard/classes");
      router.refresh();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting class form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input placeholder="Vinyasa Flow" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your yoga class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="instructor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an instructor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The instructor who will teach this class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A flowing sequence of poses that synchronizes breath with movement..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Describe what students can expect from this class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min={15} {...field} />
                </FormControl>
                <FormDescription>
                  How long the class will last.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  Maximum number of students allowed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (£)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  The price for this class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Studio A" {...field} />
                </FormControl>
                <FormDescription>
                  Where the class will be held.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The experience level required for this class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="meditation">Meditation</SelectItem>
                    <SelectItem value="pilates">Pilates</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The type of class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current status of the class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    value={timeValue}
                    onChange={handleTimeChange}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  When the class starts.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      handleDateChange(e);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  The date when the class starts.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Recurring Class
                  </FormLabel>
                  <FormDescription>
                    Does this class repeat on a regular schedule?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {form.watch("recurring") && (
            <FormField
              control={form.control}
              name="recurring_pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurring Pattern</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often the class repeats.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <div className="col-span-1 md:col-span-2 space-y-4">
            <FormLabel>Class Image</FormLabel>
            <div className="flex flex-col space-y-4">
              {imagePreview && (
                <div className="relative w-full h-48 overflow-hidden rounded-md">
                  <Image 
                    src={imagePreview} 
                    alt="Class preview" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
              )}
              <Input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="cursor-pointer"
              />
              <FormDescription>
                Upload an image to represent this class. Recommended size: 1200x800px.
              </FormDescription>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin-dashboard/classes")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update Class" : "Create Class"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
