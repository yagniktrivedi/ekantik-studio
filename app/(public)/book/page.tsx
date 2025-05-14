"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle, ArrowLeft, User, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getClassById } from "@/lib/api/classes";
import { ClassType } from "@/lib/types";

export default function BookPage() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("class");
  const router = useRouter();
  const { user } = useAuth();
  
  const [classData, setClassData] = useState<ClassType | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("09:00");
  const [location, setLocation] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    time?: string;
  }>({});
  
  // Format time to be human-readable (e.g., "09:00 AM")
  const formatTimeToAmPm = (timeString: string): string => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  useEffect(() => {
    const fetchClassData = async () => {
      if (classId) {
        try {
          const data = await getClassById(classId);
          setClassData(data);
          
          // Set default values based on class data
          if (data) {
            // Set default location from class data
            setLocation(data.location || "studio");
            
            // Set default time from class start_time if available
            if (data.start_time) {
              const formattedTime = formatTimeToAmPm(data.start_time);
              setTime(formattedTime);
            }
          }
        } catch (error) {
          console.error("Error fetching class data:", error);
          toast.error("Failed to load class information");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

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
      router.push(`/login?returnUrl=/book?class=${classId}`);
      return;
    }

    if (!validateForm() || !classData) {
      return;
    }

    setIsBooking(true);

    try {
      // Call the booking API endpoint
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId,
          userId: user.id,
          className: classData.title,
          date: format(date!, 'yyyy-MM-dd'),
          time,
          location,
          instructorId: classData.instructor?.id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book class');
      }
      
      console.log("Booking response:", data);
      
      if (data.waitlisted) {
        // If added to waitlist
        toast.success(`You've been added to the waitlist at position ${data.position}`);
        
        // Redirect to confirmation page with waitlist info
        router.push(`/booking-confirmation?class=${classId}&date=${format(date!, 'yyyy-MM-dd')}&time=${time}&location=${location}&waitlisted=true&position=${data.position}`);
      } else {
        // If successfully booked
        toast.success("Class booked successfully!");
        
        // Redirect to confirmation page
        router.push(`/booking-confirmation?class=${classId}&date=${format(date!, 'yyyy-MM-dd')}&time=${time}&location=${location}`);
      }
    } catch (error: any) {
      console.error("Error booking class:", error);
      
      // Provide more specific error message if possible
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to book class. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-ekantik-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">Loading class details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!classData) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Class Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the class you're looking for. Please try browsing our available classes.
            </p>
            <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
              <Link href="/classes">Browse Classes</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <Link href={`/classes/${classId}`} className="flex items-center text-ekantik-600 hover:text-ekantik-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Class Details
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Class</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="md:w-1/3">
                      <div className="relative h-[200px] rounded-lg overflow-hidden">
                        <Image 
                          src={classData.image} 
                          alt={classData.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-xl font-semibold text-ekantik-900 mb-2">{classData.title}</h2>
                      <p className="text-gray-600 text-sm mb-4">{classData.description.substring(0, 120)}...</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-2 text-ekantik-600" />
                          <span>{classData.duration} minutes</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <User className="h-4 w-4 mr-2 text-ekantik-600" />
                          <span>{classData.instructor.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <BarChart className="h-4 w-4 mr-2 text-ekantik-600" />
                          <span>{classData.level}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-ekantik-600" />
                          <span>{classData.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => {
                              // Disable dates before today
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              
                              // If class has a start_date, disable dates before that
                              if (classData?.start_date) {
                                const startDate = new Date(classData.start_date);
                                startDate.setHours(0, 0, 0, 0);
                                return date < startDate;
                              }
                              
                              return date < today;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          {[
                            "07:00 AM",
                            "09:00 AM",
                            "12:00 PM",
                            "04:30 PM",
                            "06:00 PM",
                            "07:30 PM"
                          ].map((t) => (
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
                        <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="p-3 border rounded-md flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 text-ekantik-600" />
                      {location === "online" ? "Online" : location}
                    </div>
                    
                    {location === "online" && (
                      <p className="text-sm text-gray-500 mt-2">
                        You will receive an email with the link to join the online class 30 minutes before the start time.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class</span>
                      <span className="font-medium">{classData.title}</span>
                    </div>
                    {date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">{format(date, "EEEE, MMM d")}</span>
                      </div>
                    )}
                    {time && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium">{time}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">
                        {location === "online" ? "Online" : "Ekantik Studio"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instructor</span>
                      <span className="font-medium">{classData.instructor.name}</span>
                    </div>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class Credits</span>
                      <span className="font-medium">{classData.credits} Credit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Balance</span>
                      <span className="font-medium text-ekantik-600">
                        {user ? "10 Credits" : "Login to check"}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-ekantik-600 hover:bg-ekantik-700 text-white"
                    onClick={handleBookClass}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    By booking this class, you agree to our cancellation policy.
                    Classes can be cancelled up to 12 hours before the scheduled time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
