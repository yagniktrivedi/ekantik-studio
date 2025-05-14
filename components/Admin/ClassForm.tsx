"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { createClass, updateClass, YogaClass } from "@/lib/supabase/classes";
import { getActiveInstructors, Instructor } from "@/lib/supabase/instructors";

// Form schema
const classFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  instructor_id: z.string().min(1, "Please select an instructor"),
  duration_minutes: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  level: z.enum(["beginner", "intermediate", "advanced", "all levels"]),
  category: z.string().min(1, "Please select a category"),
  start_date: z.date(),
  // start_time: z.string(),
  recurring: z.boolean().default(false),
  recurring_pattern: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["scheduled", "cancelled", "completed"]).default("scheduled"),
  image_url: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

// Categories for yoga classes
const yogaCategories = [
  "Vinyasa Flow",
  "Hatha Yoga",
  "Yin Yoga",
  "Restorative Yoga",
  "Power Yoga",
  "Ashtanga Yoga",
  "Kundalini Yoga",
  "Prenatal Yoga",
  "Aerial Yoga",
  "Hot Yoga",
  "Meditation",
  "Yoga Nidra",
  "Kids Yoga",
  "Chair Yoga",
  "Yoga Therapy",
  "Workshop",
  "Special Event",
];

interface ClassFormProps {
  initialData?: YogaClass;
  isEditing?: boolean;
}

export function ClassForm({ initialData, isEditing = false }: ClassFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values or existing class data
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || "",
          instructor_id: initialData.instructor_id || "",
          duration_minutes: initialData.duration_minutes,
          capacity: initialData.capacity,
          price: initialData.price,
          level: initialData.level as "beginner" | "intermediate" | "advanced" | "all levels",
          category: initialData.category,
          start_date: new Date(initialData.start_time),
          start_time: format(new Date(initialData.start_time), "HH:mm"),
          recurring: initialData.recurring,
          recurring_pattern: initialData.recurring_pattern || "",
          location: initialData.location,
          status: initialData.status as "scheduled" | "cancelled" | "completed",
          image_url: initialData.image_url || "",
        }
      : {
          title: "",
          description: "",
          instructor_id: "",
          duration_minutes: 60,
          capacity: 15,
          price: 15,
          level: "all levels",
          category: "",
          start_date: new Date(),
          start_time: "09:00",
          recurring: false,
          recurring_pattern: "",
          location: "Main Studio",
          status: "scheduled",
          image_url: "",
        },
  });

  // Fetch active instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data, error } = await getActiveInstructors();
        if (error) throw error;
        if (data) setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        toast({
          title: "Error",
          description: "Failed to load instructors. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchInstructors();
  }, [toast]);

  const onSubmit = async (values: ClassFormValues) => {
    console.log('Form values:', values);
    setIsLoading(true);
    try {
      // Combine date and time into ISO string
      const startDateTime = new Date(values.start_date);
      const [hours, minutes] = values.start_time.split(":").map(Number);
      startDateTime.setHours(hours, minutes);
      
      // Calculate end time based on duration
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + values.duration_minutes);
      
      const classData = {
        title: values.title,
        description: values.description,
        instructor_id: values.instructor_id,
        duration_minutes: values.duration_minutes,
        capacity: values.capacity,
        price: values.price,
        level: values.level,
        category: values.category,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        recurring: values.recurring,
        recurring_pattern: values.recurring_pattern,
        location: values.location,
        status: values.status,
        image_url: values.image_url,
      };

      if (isEditing && initialData) {
        // Update existing class
        const { error } = await updateClass(initialData.id, classData);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Class updated successfully.",
        });
      } else {
        // Create new class
        console.log('Creating new class with data:', classData);  
        // const { error } = await createClass(classData);
        // console.log('Create class result:', { error });
        // if (error) throw error;
        toast({
          title: "Success",
          description: "Class created successfully.",
        });
      }

      // Redirect back to classes list
      router.push("/admin-dashboard/classes");
      router.refresh();
    } catch (error) {
      console.error("Error saving class:", error);
      toast({
        title: "Error",
        description: "Failed to save class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Title</FormLabel>
                <FormControl>
                  <Input placeholder="Vinyasa Flow" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Instructor */}
          <FormField
            control={form.control}
            name="instructor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A flowing sequence of postures that synchronizes breath with movement..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min={15} step={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Capacity */}
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Level */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yogaCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time */}
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input type="time" {...field} />
                    <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Main Studio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Recurring */}
          <FormField
            control={form.control}
            name="recurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Recurring Class</FormLabel>
                  <FormDescription>
                    Is this a recurring class?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Recurring Pattern (only shown if recurring is true) */}
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often does this class repeat?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Image URL */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  URL for the class image (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin-dashboard/classes")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Class" : "Create Class"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
