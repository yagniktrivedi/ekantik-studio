"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";

interface ClassBookingFormProps {
  classId: string;
}

export default function ClassBookingForm({ classId }: ClassBookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("studio");
  const [isBooking, setIsBooking] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    time?: string;
  }>({});
  const { user } = useAuth();
  const router = useRouter();

  const availableTimes = [
    "07:00 AM",
    "09:00 AM",
    "12:00 PM",
    "04:30 PM",
    "06:00 PM",
    "07:30 PM",
  ];

  const validateForm = (): boolean => {
    const newErrors: {date?: string; time?: string} = {};
    let isValid = true;

    if (!date) {
      newErrors.date = "Please select a date";
      isValid = false;
    }

    if (!time) {
      newErrors.time = "Please select a time";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBookClass = async () => {
    if (!user) {
      toast.error("Please login to book a class");
      router.push(`/login?returnUrl=/classes/${classId}`);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsBooking(true);

    try {
      // Simulate API call for booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would call the Supabase API here
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .insert({
      //     class_id: classId,
      //     user_id: user.id,
      //     date: format(date, 'yyyy-MM-dd'),
      //     time,
      //     location
      //   });
      // if (error) throw error;
      
      toast.success("Class booked successfully!");
      
      // Redirect to confirmation page
      router.push(`/booking-confirmation?class=${classId}&date=${format(date, 'yyyy-MM-dd')}&time=${time}&location=${location}`);
    } catch (error) {
      console.error("Error booking class:", error);
      toast.error("Failed to book class. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                errors.date && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                setErrors(prev => ({ ...prev, date: undefined }));
              }}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.date}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Time
        </label>
        <Select 
          value={time} 
          onValueChange={(value) => {
            setTime(value);
            setErrors(prev => ({ ...prev, time: undefined }));
          }}
        >
          <SelectTrigger className={cn("w-full", errors.time && "border-red-500")}>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {availableTimes.map((t) => (
              <SelectItem key={t} value={t}>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-2 text-ekantik-500" />
                  {t}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.time && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.time}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="studio">
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-2 text-ekantik-500" />
                Ekantik Studio
              </div>
            </SelectItem>
            <SelectItem value="online">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2 text-ekantik-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                Online
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gray-50 border-ekantik-100">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Class Credits</span>
            <span className="text-sm font-medium">1 Credit</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Your Balance</span>
            <span className="text-sm font-medium text-ekantik-600">
              {user ? "10 Credits" : "Login to check"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full bg-ekantik-600 hover:bg-ekantik-700 text-white"
        onClick={handleBookClass}
        disabled={isBooking}
      >
        {isBooking ? (
          <>
            <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Booking...
          </>
        ) : (
          "Book Class"
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-2">
        By booking this class, you agree to our cancellation policy.
        Classes can be cancelled up to 12 hours before the scheduled time.
      </p>
    </div>
  );
}
