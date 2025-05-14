"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, ArrowRight, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useAuth } from "@/components/auth/auth-provider";
import { BookingType } from "@/lib/types";

// Mock data for bookings
const mockBookings: BookingType[] = [
  {
    id: "BK-1234",
    classId: "1",
    userId: "user-123",
    className: "Vinyasa Flow",
    instructorName: "Maya Patel",
    date: "2025-05-05",
    time: "07:00 AM",
    location: "studio",
    status: "upcoming",
    credits: 1,
    createdAt: "2025-05-01T10:30:00Z",
  },
  {
    id: "BK-2345",
    classId: "2",
    userId: "user-123",
    className: "Yin Yoga",
    instructorName: "David Chen",
    date: "2025-05-07",
    time: "06:00 PM",
    location: "online",
    status: "upcoming",
    credits: 1,
    createdAt: "2025-05-01T11:45:00Z",
  },
  {
    id: "BK-3456",
    classId: "3",
    userId: "user-123",
    className: "Meditation",
    instructorName: "Sarah Johnson",
    date: "2025-04-28",
    time: "09:00 AM",
    location: "studio",
    status: "completed",
    credits: 1,
    createdAt: "2025-04-25T14:20:00Z",
  },
  {
    id: "BK-4567",
    classId: "4",
    userId: "user-123",
    className: "Power Yoga",
    instructorName: "Alex Rodriguez",
    date: "2025-04-25",
    time: "04:30 PM",
    location: "studio",
    status: "completed",
    credits: 1,
    createdAt: "2025-04-22T09:15:00Z",
  },
  {
    id: "BK-5678",
    classId: "5",
    userId: "user-123",
    className: "Restorative Yoga",
    instructorName: "Emma Wilson",
    date: "2025-04-20",
    time: "07:30 PM",
    location: "online",
    status: "cancelled",
    credits: 1,
    createdAt: "2025-04-15T16:30:00Z",
  },
];

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [locationFilter, setLocationFilter] = useState("all");

  console.log('***** user', user)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real implementation, we would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('bookings')
        //   .select('*')
        //   .eq('user_id', user?.id)
        //   .order('date', { ascending: true });
        
        // if (error) throw error;
        // setBookings(data || []);

        // Using mock data for now
        setBookings(mockBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "upcoming" && booking.status !== "upcoming") return false;
    if (activeTab === "completed" && booking.status !== "completed") return false;
    if (activeTab === "cancelled" && booking.status !== "cancelled") return false;
    if (locationFilter !== "all" && booking.location !== locationFilter) return false;
    return true;
  });

  const handleCancelBooking = async (bookingId: string) => {
    // In a real implementation, we would update the booking status in Supabase
    // const { error } = await supabase
    //   .from('bookings')
    //   .update({ status: 'cancelled' })
    //   .eq('id', bookingId);
    
    // if (error) {
    //   console.error("Error cancelling booking:", error);
    //   return;
    // }

    // Update local state
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" } 
          : booking
      )
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-ekantik-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">Loading your bookings...</p>
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
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">Manage your class bookings and view your booking history</p>
            </div>
            <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
              <Link href="/classes">Book New Class</Link>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs 
                  defaultValue="upcoming" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === "upcoming" 
                      ? "You don't have any upcoming bookings." 
                      : activeTab === "completed" 
                        ? "You don't have any completed classes yet." 
                        : "You don't have any cancelled bookings."}
                  </p>
                  {activeTab === "upcoming" && (
                    <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                      <Link href="/classes">Browse Classes</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const bookingDate = new Date(booking.date);
                    const isUpcoming = booking.status === "upcoming";
                    const isPast = new Date(booking.date) < new Date();
                    
                    return (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-6 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 sm:mb-0">
                                  {booking.className}
                                </h3>
                                <Badge 
                                  className={`
                                    ${booking.status === "upcoming" ? "bg-blue-100 text-blue-800" : 
                                      booking.status === "completed" ? "bg-green-100 text-green-800" : 
                                      "bg-red-100 text-red-800"}
                                  `}
                                >
                                  {booking.status === "upcoming" ? "Upcoming" : 
                                    booking.status === "completed" ? "Completed" : 
                                    "Cancelled"}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-4">
                                Instructor: {booking.instructorName}
                              </p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-ekantik-600" />
                                  <span className="text-sm text-gray-700">
                                    {format(bookingDate, "EEE, MMM d, yyyy")}
                                  </span>
                                </div>
                                
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-ekantik-600" />
                                  <span className="text-sm text-gray-700">{booking.time}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-ekantik-600" />
                                  <span className="text-sm text-gray-700">
                                    {booking.location === "studio" ? "Ekantik Studio" : "Online"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Booking ID: {booking.id}
                          </div>
                          <div className="flex gap-2">
                            {isUpcoming && !isPast && (
                              <Button 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                            <Button 
                              asChild
                              variant="outline"
                              className="text-ekantik-600 hover:text-ekantik-700 hover:bg-ekantik-50"
                            >
                              <Link href={`/classes/${booking.classId}`}>
                                View Class
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
