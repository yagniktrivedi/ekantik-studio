"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Users, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  User as UserIcon
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { RoleGuard } from "@/components/auth/role-guard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Define interfaces for the data structure
interface Instructor {
  id: string;
  name: string;
  avatar?: string;
}

interface ClassData {
  id: string;
  name: string;
  description: string | null;
  instructor_id: string;
  duration_minutes: number;
  capacity: number;
  level: string;
  category: string;
  image_url: string | null;
  active: boolean;
  status: string;
  start_date?: string;
  start_time?: string;
  location?: string;
}

interface ClassWithDetails extends ClassData {
  instructor: Instructor;
  booked: number;
  date: string; // Formatted date + time for display
}

interface ClassFilters {
  search: string;
  level: string;
  category: string;
  instructor: string;
  date: Date | undefined;
}

export default function MemberClassesPage() {
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassWithDetails | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [filters, setFilters] = useState<ClassFilters>({
    search: "",
    level: "all",
    category: "all",
    instructor: "all",
    date: undefined
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to fetch classes from Supabase
  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      
      // Get current date in ISO format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString().split('T')[0];
      
      // Fetch active classes directly from the classes table
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('active', true)
        .eq('status', 'active')
        .gte('start_date', todayISO)
        .order('start_date', { ascending: true });

      console.log('*****classData', classesData)
      // console.log('*****classesError', classesError)
      if (classesError) {
        throw classesError;
      }

      if (!classesData || classesData.length === 0) {
        setClasses([]);
        setFilteredClasses([]);
        setIsLoading(false);
        return;
      }

      // Fetch instructors
      const instructorIds = [...new Set(classesData.map(cls => cls.instructor_user_id))];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', instructorIds);

      if (profilesError) {
        throw profilesError;
      }

      // Get all confirmed bookings for these classes
      const { data: bookings, error: bookingsError } = await supabase
        .from('class_bookings')
        .select('class_id')
        .in('class_id', classesData.map(c => c.id))
        .eq('status', 'confirmed');

      if (bookingsError) {
        throw bookingsError;
      }

      // Create a map of booking counts by counting occurrences of each class_id
      const bookingCounts = new Map();
      classesData.forEach(c => bookingCounts.set(c.id, 0)); // Initialize with 0
      
      bookings?.forEach(booking => {
        const currentCount = bookingCounts.get(booking.class_id) || 0;
        bookingCounts.set(booking.class_id, currentCount + 1);
      });

      // Create a map of instructors
      const instructorMap = new Map();
     
      profiles?.forEach(profile => {
        instructorMap.set(profile.id, {
          id: profile.id,
          name: `${profile.full_name  }`,
          avatar: profile.avatar_url
        });
      });

      // Combine class data with instructor details
      const classesWithDetails: ClassWithDetails[] = classesData.map(classData => {
        const instructor = instructorMap.get(classData.instructor_id) || {
          id: classData.instructor_id,
          name: 'Unknown Instructor'
        };
        
        const booked = bookingCounts.get(classData.id) || 0;
        
        // Format date and time for display
        const dateTime = classData.start_date && classData.start_time 
          ? `${classData.start_date}T${classData.start_time}` 
          : new Date().toISOString();
        
        return {
          ...classData,
          instructor,
          date: dateTime,
          booked,
          location: classData.location || 'Main Studio'
        };
      });

      setClasses(classesWithDetails);
      setFilteredClasses(classesWithDetails);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to load classes. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch classes data
  useEffect(() => {
    fetchClasses();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...classes];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(cls => 
        cls.name.toLowerCase().includes(searchLower) || 
        cls.description.toLowerCase().includes(searchLower) ||
        cls.instructor.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply level filter
    if (filters.level !== "all") {
      result = result.filter(cls => cls.level === filters.level || cls.level === "all");
    }
    
    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(cls => cls.category === filters.category);
    }
    
    // Apply instructor filter
    if (filters.instructor !== "all") {
      result = result.filter(cls => cls.instructor.id === filters.instructor);
    }
    
    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      result = result.filter(cls => {
        const classDate = new Date(cls.date);
        return (
          classDate.getFullYear() === filterDate.getFullYear() &&
          classDate.getMonth() === filterDate.getMonth() &&
          classDate.getDate() === filterDate.getDate()
        );
      });
    }
    
    setFilteredClasses(result);
  }, [filters, classes]);

  // Handle booking a class
  const handleBookClass = async () => {
    if (!selectedClass || !user) return;
    
    setIsBooking(true);
    console.log('Booking class:', selectedClass);
    console.log('User:', user);
    
    try {
      // Format the date and time for the API
      const classDate = new Date(selectedClass.start_date);
      const formattedDate = format(classDate, 'yyyy-MM-dd');
      const formattedTime = format(selectedClass.start_date, 'HH:mm:ss');
      
      console.log('Formatted date:', formattedDate);
      console.log('Formatted time:', formattedTime);
      
      // Insert booking directly into Supabase
      const { data, error } = await supabase
        .from('class_bookings')
        .insert({
          class_id: selectedClass.id,
          user_id: user.id,
          booking_date: formattedDate,
          booking_time: formattedTime,
          location: selectedClass.location || 'Main Studio',
          status: 'confirmed'
        })
        .select();
        
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already booked this class');
        }
        throw error;
      }
      
      // For backward compatibility with the existing code, create a response object
      const responseData = {
        id: data?.[0]?.id,
        waitlisted: false
      };
      
      console.log("Booking response:", responseData);
      
      // If successfully booked
      toast({
        title: "Class Booked",
        description: `You've successfully booked ${selectedClass.name} with ${selectedClass.instructor.name}.`,
      });
      
      setIsBookingDialogOpen(false);
      
      // Refresh the classes list to update availability
      if (selectedClass.booked < selectedClass.capacity) {
        const updatedClasses = classes.map(cls => {
          if (cls.id === selectedClass.id) {
            return {
              ...cls,
              booked: cls.booked + 1
            };
          }
          return cls;
        });
        setClasses(updatedClasses);
        setFilteredClasses(prev => prev.map(cls => {
          if (cls.id === selectedClass.id) {
            return {
              ...cls,
              booked: cls.booked + 1
            };
          }
          return cls;
        }));
      }
      
      // Refresh classes data after booking
      fetchClasses();
    } catch (error: any) {
      console.error('Error booking class:', error);
      toast({
        title: "Booking Failed",
        description: error?.message || "Failed to book the class. Please try again.",
        variant: "destructive",
      });
    } finally {
      
      setIsBooking(false);
    }
  };

  // Get unique instructors for filter
  const instructors = Array.from(new Set(classes.map(cls => cls.instructor.id)))
    .map(id => {
      const cls = classes.find(c => c.instructor.id === id);
      return cls ? cls.instructor : null;
    })
    .filter(Boolean);

  // Get unique categories for filter
  const categories = Array.from(new Set(classes.map(cls => cls.category)));

  return (
    <RoleGuard allowedRoles={["user", "instructor", "admin"]}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Browse Classes</h1>
        
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Find Your Perfect Class</CardTitle>
            <CardDescription>Filter classes by your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search classes..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              
              <Select
                value={filters.level}
                onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Class Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.instructor}
                onValueChange={(value) => setFilters(prev => ({ ...prev, instructor: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Instructors</SelectItem>
                  {instructors.map((instructor: any) => (
                    <SelectItem key={instructor.id} value={instructor.id}>{instructor.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="md:col-span-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {filters.date ? format(filters.date, "PPP") : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={filters.date}
                        onSelect={(date) => setFilters(prev => ({ ...prev, date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {filters.date && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, date: undefined }))}
                      className="ml-2"
                    >
                      Clear Date
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => setFilters({
                    search: "",
                    level: "all",
                    category: "all",
                    instructor: "all",
                    date: undefined
                  })}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Classes List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ekantik-600"></div>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No Classes Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your filters to find more classes
            </p>
            <Button 
              onClick={() => setFilters({
                search: "",
                level: "all",
                category: "all",
                instructor: "all",
                date: undefined
              })}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-ekantik-600 to-ekantik-800 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-white text-ekantik-800 hover:bg-gray-100">
                        {cls.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-white mt-2">{cls.name}</h3>
                    </div>
                    <Badge className={
                      cls.level === "beginner" 
                        ? "bg-green-100 text-green-800" 
                        : cls.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : cls.level === "advanced"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }>
                      {cls.level === "all" ? "All Levels" : cls.level}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={cls.instructor.avatar} alt={cls.instructor.name} />
                      <AvatarFallback>{cls.instructor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{cls.instructor.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {cls.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {new Date(cls.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {new Date(cls.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{cls.duration} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{cls.booked}/{cls.capacity} spots</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSelectedClass(cls);
                      setIsBookingDialogOpen(true);
                    }}
                    disabled={cls.booked >= cls.capacity}
                  >
                    {cls.booked >= cls.capacity ? "Class Full" : "Book Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Class Booking Dialog */}
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent>
            {selectedClass && (
              <>
                <DialogHeader>
                  <DialogTitle>Book Class: {selectedClass.name}</DialogTitle>
                  <DialogDescription>
                    Confirm your booking for this class
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={selectedClass.instructor.avatar} alt={selectedClass.instructor.name} />
                      <AvatarFallback>{selectedClass.instructor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedClass.instructor.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {new Date(selectedClass.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {new Date(selectedClass.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{selectedClass.duration} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{selectedClass.booked}/{selectedClass.capacity} spots</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Booking Details</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      This class will use 1 credit from your membership. Please arrive 10 minutes before the class starts.
                    </p>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reminder"
                        className="h-4 w-4 rounded border-gray-300 text-ekantik-600 focus:ring-ekantik-500"
                        defaultChecked
                      />
                      <label htmlFor="reminder" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        Send me a reminder 1 hour before class
                      </label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBookClass} disabled={isBooking}>
                    {isBooking ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-ekantik-50">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
