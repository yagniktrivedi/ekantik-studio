"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  X
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
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
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

interface ClassType {
  id: string;
  name: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  level: string;
  category: string;
  duration: number;
  capacity: number;
  booked: number;
  date: string;
  status: string;
  location?: string;
}

interface ClassFilters {
  search: string;
  level: string;
  category: string;
  instructor: string;
  date: Date | undefined;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
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

  // Fetch classes data
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Fetch classes from the database
        const { data, error } = await supabase
          .from('classes')
          .select('*');
        
        if (error) throw error;
        
        // Transform the data to match our ClassType interface
        const transformedClasses = data.map((cls: any) => ({
          id: cls.id,
          name: cls.name,
          description: cls.description || "Join us for this amazing class at Ekantik Studio.",
          instructor: {
            id: cls.instructor_id || "1",
            name: cls.instructor_name || "Ekantik Instructor",
            avatar: cls.instructor_avatar || "/placeholder-avatar.jpg"
          },
          level: cls.level || "all",
          category: cls.category || "Yoga",
          duration: cls.duration || 60,
          capacity: cls.capacity || 10,
          booked: cls.booked || 0,
          date: cls.date || new Date().toISOString(),
          status: "upcoming",
          location: cls.location || "studio"
        }));
        
        setClasses(transformedClasses);
        setFilteredClasses(transformedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
        // Use mock data as fallback
        setClasses(getMockClasses());
        setFilteredClasses(getMockClasses());
      } finally {
        setIsLoading(false);
      }
    };

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
    
    try {
      // Call the booking API endpoint
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: selectedClass.id,
          userId: user.id,
          className: selectedClass.name,
          date: new Date(selectedClass.date).toISOString(),
          time: format(new Date(selectedClass.date), 'HH:mm:ss'),
          location: selectedClass.location || 'studio',
          instructorId: selectedClass.instructor.id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book class');
      }
      
      console.log("Booking response:", data);
      
      if (data.waitlisted) {
        // If added to waitlist
        toast({
          title: "Added to Waitlist",
          description: `You've been added to the waitlist at position ${data.position} for ${selectedClass.name}.`,
        });
      } else {
        // If successfully booked
        toast({
          title: "Class Booked",
          description: `You've successfully booked ${selectedClass.name} with ${selectedClass.instructor.name}.`,
        });
      }
      
      setIsBookingDialogOpen(false);
      
      // Refresh the classes list to update availability
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

  // Function to get remaining spots
  const getRemainingSpots = (cls: ClassType) => {
    return Math.max(0, cls.capacity - cls.booked);
  };

  // Mock data for classes
  function getMockClasses(): ClassType[] {
    return [
      {
        id: "1",
        name: "Vinyasa Flow",
        description: "A dynamic practice that connects breath with movement through a flowing sequence of poses.",
        instructor: {
          id: "1",
          name: "Maya Johnson",
          avatar: "/instructors/maya.jpg"
        },
        level: "intermediate",
        category: "Vinyasa",
        duration: 60,
        capacity: 15,
        booked: 8,
        date: "2025-05-10T10:00:00Z",
        status: "upcoming",
        location: "studio"
      },
      {
        id: "2",
        name: "Gentle Yoga",
        description: "A slower-paced class focusing on relaxation, stretching, and mindfulness.",
        instructor: {
          id: "2",
          name: "David Singh",
          avatar: "/instructors/david.jpg"
        },
        level: "beginner",
        category: "Hatha",
        duration: 45,
        capacity: 20,
        booked: 12,
        date: "2025-05-11T09:00:00Z",
        status: "upcoming",
        location: "studio"
      },
      {
        id: "3",
        name: "Power Yoga",
        description: "A vigorous, fitness-based approach to vinyasa-style yoga.",
        instructor: {
          id: "3",
          name: "Alex Williams",
          avatar: "/instructors/alex.jpg"
        },
        level: "advanced",
        category: "Power",
        duration: 75,
        capacity: 12,
        booked: 12,
        date: "2025-05-09T18:00:00Z",
        status: "upcoming",
        location: "studio"
      },
      {
        id: "4",
        name: "Yin Yoga",
        description: "A slow-paced style of yoga with poses held for longer periods of time.",
        instructor: {
          id: "4",
          name: "Sophia Rodriguez",
          avatar: "/instructors/sophia.jpg"
        },
        level: "all",
        category: "Yin",
        duration: 90,
        capacity: 15,
        booked: 7,
        date: "2025-05-12T19:00:00Z",
        status: "upcoming",
        location: "online"
      },
      {
        id: "5",
        name: "Meditation",
        description: "Guided meditation sessions to calm the mind and reduce stress.",
        instructor: {
          id: "2",
          name: "David Singh",
          avatar: "/instructors/david.jpg"
        },
        level: "all",
        category: "Meditation",
        duration: 30,
        capacity: 20,
        booked: 5,
        date: "2025-05-08T07:00:00Z",
        status: "upcoming",
        location: "online"
      }
    ];
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
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
                        className="ml-2"
                        onClick={() => setFilters(prev => ({ ...prev, date: undefined }))}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear date</span>
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
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-ekantik-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-gray-600">Loading classes...</p>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
              <p className="text-gray-600 mb-6">
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
                className="bg-ekantik-600 hover:bg-ekantik-700"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((cls) => {
                const classDate = new Date(cls.date);
                const remainingSpots = getRemainingSpots(cls);
                const isFull = remainingSpots === 0;
                
                return (
                  <Card key={cls.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{cls.name}</CardTitle>
                          <CardDescription className="mt-1">{cls.category}</CardDescription>
                        </div>
                        <Badge className={`${cls.level === 'beginner' ? 'bg-green-100 text-green-800' : cls.level === 'intermediate' ? 'bg-blue-100 text-blue-800' : cls.level === 'advanced' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {cls.level.charAt(0).toUpperCase() + cls.level.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cls.description}</p>
                      
                      <div className="flex items-center mb-3">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={cls.instructor.avatar} alt={cls.instructor.name} />
                          <AvatarFallback>
                            <UserIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{cls.instructor.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-ekantik-600" />
                          <span className="text-xs text-gray-600">
                            {format(classDate, "EEE, MMM d")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-ekantik-600" />
                          <span className="text-xs text-gray-600">
                            {format(classDate, "h:mm a")} • {cls.duration} min
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-ekantik-600" />
                          <span className="text-xs text-gray-600">
                            {isFull ? (
                              <span className="text-red-600 font-medium">Class Full</span>
                            ) : (
                              `${remainingSpots} spot${remainingSpots !== 1 ? 's' : ''} left`
                            )}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {cls.location === 'studio' ? 'In Studio' : 'Online'}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 pt-3">
                      <Button 
                        className="w-full bg-ekantik-600 hover:bg-ekantik-700"
                        onClick={() => {
                          setSelectedClass(cls);
                          setIsBookingDialogOpen(true);
                        }}
                      >
                        {isFull ? "Join Waitlist" : "Book Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Booking Confirmation Dialog */}
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Booking</DialogTitle>
                <DialogDescription>
                  Please review the details before confirming your booking.
                </DialogDescription>
              </DialogHeader>
              
              {selectedClass && (
                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{selectedClass.name}</h3>
                      <p className="text-sm text-gray-600">{selectedClass.category}</p>
                    </div>
                    <Badge className={`${selectedClass.level === 'beginner' ? 'bg-green-100 text-green-800' : selectedClass.level === 'intermediate' ? 'bg-blue-100 text-blue-800' : selectedClass.level === 'advanced' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedClass.level.charAt(0).toUpperCase() + selectedClass.level.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={selectedClass.instructor.avatar} alt={selectedClass.instructor.name} />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{selectedClass.instructor.name}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-ekantik-600" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(selectedClass.date), "EEE, MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-ekantik-600" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(selectedClass.date), "h:mm a")} • {selectedClass.duration} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-ekantik-600" />
                    <span className="text-sm text-gray-600">
                      {getRemainingSpots(selectedClass) === 0 ? (
                        <span className="text-red-600 font-medium">
                          This class is full. You will be added to the waitlist.
                        </span>
                      ) : (
                        `${getRemainingSpots(selectedClass)} spot${getRemainingSpots(selectedClass) !== 1 ? 's' : ''} remaining`
                      )}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      By booking this class, you agree to our cancellation policy. Please cancel at least 2 hours before the class if you cannot attend.
                    </p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBookClass} 
                  disabled={isBooking}
                  className="bg-ekantik-600 hover:bg-ekantik-700"
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    selectedClass && getRemainingSpots(selectedClass) === 0 
                      ? "Join Waitlist" 
                      : "Confirm Booking"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </>
  );
}
