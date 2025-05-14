"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addHours } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { ClassScheduleInsert, ClassScheduleUpdate, RecurrencePattern } from "@/lib/supabase/class-types";

// Form schema
const scheduleFormSchema = z.object({
  class_id: z.string().uuid({
    message: "Please select a class.",
  }),
  start_date: z.date({
    required_error: "Please select a date.",
  }),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.enum(["daily", "weekly", "biweekly", "monthly"]).optional(),
  recurrence_end_date: z.date().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
  scheduleId?: string;
  classId?: string;
  onSuccess?: () => void;
}

export function ScheduleForm({ scheduleId, classId, onSuccess }: ScheduleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();
  
  // Initialize form with default values
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      class_id: classId || "",
      start_date: new Date(),
      start_time: "09:00",
      location: "Main Studio",
      is_recurring: false,
    },
  });

  const watchIsRecurring = form.watch("is_recurring");

  // Fetch classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('id, name');
          
        if (error) throw error;
        
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    fetchClasses();
  }, [toast]);

  // Fetch schedule data if editing
  useEffect(() => {
    if (scheduleId) {
      async function fetchScheduleData() {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('class_schedules')
            .select('*')
            .eq('id', scheduleId)
            .single();
            
          if (error) throw error;
          
          // Parse dates and times
          const startDate = new Date(data.start_time);
          const startTime = format(startDate, "HH:mm");
          
          // Set form values
          form.reset({
            class_id: data.class_id,
            start_date: startDate,
            start_time: startTime,
            location: data.location,
            is_recurring: data.is_recurring,
            recurrence_pattern: data.recurrence_pattern as RecurrencePattern,
            recurrence_end_date: data.recurrence_end_date ? new Date(data.recurrence_end_date) : undefined,
          });
        } catch (error) {
          console.error('Error fetching schedule data:', error);
          toast({
            title: "Error",
            description: "Failed to load schedule data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchScheduleData();
    }
  }, [scheduleId, form, toast]);

  // Form submission handler
  async function onSubmit(values: ScheduleFormValues) {
    setIsLoading(true);
    
    try {
      // Combine date and time for start_time
      const [hours, minutes] = values.start_time.split(':').map(Number);
      const startTime = new Date(values.start_date);
      startTime.setHours(hours, minutes, 0, 0);
      
      // Calculate end_time based on class duration
      let endTime = new Date(startTime);
      
      // Get class duration
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('duration')
        .eq('id', values.class_id)
        .single();
        
      if (classError) throw classError;
      
      // Add class duration to start time to get end time
      endTime = addHours(startTime, classData.duration / 60);
      
      if (scheduleId) {
        // Update existing schedule
        const { error } = await supabase
          .from('class_schedules')
          .update({
            class_id: values.class_id,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            location: values.location,
            is_recurring: values.is_recurring,
            recurrence_pattern: values.is_recurring ? values.recurrence_pattern : null,
            recurrence_end_date: values.is_recurring && values.recurrence_end_date 
              ? values.recurrence_end_date.toISOString() 
              : null,
          })
          .eq('id', scheduleId);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Schedule updated successfully.",
        });
      } else {
        // Create new schedule
        const { error } = await supabase
          .from('class_schedules')
          .insert([{
            class_id: values.class_id,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            location: values.location,
            is_recurring: values.is_recurring,
            recurrence_pattern: values.is_recurring ? values.recurrence_pattern : null,
            recurrence_end_date: values.is_recurring && values.recurrence_end_date 
              ? values.recurrence_end_date.toISOString() 
              : null,
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Schedule created successfully.",
        });
        
        // Reset form for new entry
        form.reset();
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Error",
        description: "Failed to save schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="class_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
                disabled={!!classId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The class for this schedule.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full pl-3 text-left font-normal"
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
                <FormDescription>
                  The date when this class will take place.
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
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <Input type="time" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  The time when this class will start (24-hour format).
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
                  <Input placeholder="Main Studio" {...field} />
                </FormControl>
                <FormDescription>
                  Where this class will take place.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_recurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Recurring Class
                  </FormLabel>
                  <FormDescription>
                    This class repeats on a regular schedule.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        {watchIsRecurring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <FormField
              control={form.control}
              name="recurrence_pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence Pattern</FormLabel>
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
                    How often this class repeats.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recurrence_end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick an end date</span>
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
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When this recurring class ends (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {scheduleId ? "Updating..." : "Create Schedule"}
              </>
            ) : (
              scheduleId ? "Update Schedule" : "Create Schedule"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
