"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CheckCircle2, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getClassById } from "@/lib/api/classes";
import { ClassType } from "@/lib/types";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("class");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const location = searchParams.get("location");
  
  const [classData, setClassData] = useState<ClassType | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    const fetchClassData = async () => {
      if (classId) {
        try {
          const data = await getClassById(classId);
          setClassData(data);
          
          // Generate a random booking ID
          setBookingId(`BK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
        } catch (error) {
          console.error("Error fetching class data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-ekantik-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">Loading booking details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!classId || !date || !time || !classData) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Information Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the booking information you're looking for. Please try booking again.
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

  const formattedDate = date ? format(new Date(date), "EEEE, MMMM d, yyyy") : "";
  const locationDisplay = location === "online" ? "Online" : "Ekantik Studio";

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto">
          <Link href={`/classes/${classId}`} className="flex items-center text-ekantik-600 hover:text-ekantik-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Class Details
          </Link>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Your spot for {classData.title} has been reserved.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="bg-ekantik-100 p-2 rounded-full mr-3">
                        <Calendar className="h-5 w-5 text-ekantik-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="text-gray-900">{formattedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-ekantik-100 p-2 rounded-full mr-3">
                        <Clock className="h-5 w-5 text-ekantik-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Time</p>
                        <p className="text-gray-900">{time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-ekantik-100 p-2 rounded-full mr-3">
                        <MapPin className="h-5 w-5 text-ekantik-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-900">{locationDisplay}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-ekantik-100 p-2 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ekantik-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Booking ID</p>
                        <p className="text-gray-900">{bookingId}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Information</h3>
                  <p className="text-gray-700 mb-2"><span className="font-medium">Class:</span> {classData.title}</p>
                  <p className="text-gray-700 mb-2"><span className="font-medium">Instructor:</span> {classData.instructor.name}</p>
                  <p className="text-gray-700 mb-2"><span className="font-medium">Duration:</span> {classData.duration} minutes</p>
                  <p className="text-gray-700"><span className="font-medium">Level:</span> {classData.level}</p>
                </div>
                
                {location === "online" && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Online Class Information</h3>
                    <p className="text-gray-700 mb-2">
                      You will receive an email with the link to join the online class 30 minutes before the start time.
                    </p>
                    <p className="text-gray-700">
                      Please ensure you have a stable internet connection and a quiet space for your practice.
                    </p>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                  <p className="text-gray-700">
                    You can cancel or reschedule your booking up to 12 hours before the class starts. 
                    Cancellations made less than 12 hours before the class will result in the loss of the class credit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/account/bookings">View My Bookings</Link>
            </Button>
            <Button asChild className="flex-1 bg-ekantik-600 hover:bg-ekantik-700">
              <Link href="/classes">Book Another Class</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
