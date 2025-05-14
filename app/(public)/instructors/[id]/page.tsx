import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Instagram, Facebook, Globe, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getInstructorById, getInstructorClasses } from "@/lib/api/classes";
import { InstructorType, ClassType } from "@/lib/types";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const instructor = await getInstructorById(params.id);
  
  if (!instructor) {
    return {
      title: "Instructor Not Found | Ekantik Studio",
    };
  }
  
  return {
    title: `${instructor.name} | Ekantik Studio Instructors`,
    description: `Learn more about ${instructor.name}, ${instructor.specialization} instructor at Ekantik Studio.`,
  };
}

export default async function InstructorDetailPage({ params }: Props) {
  const instructor = await getInstructorById(params.id);
  
  if (!instructor) {
    notFound();
  }
  
  const instructorClasses = await getInstructorClasses(params.id);
  
  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 pt-8">
          <Button
            asChild
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <Link href="/instructors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Instructors
            </Link>
          </Button>
        </div>
        
        {/* Instructor Profile Header */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Instructor Image */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-ekantik-100">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Social Media Links */}
                <div className="mt-6 flex justify-center space-x-4">
                  {instructor.socialMedia?.instagram && (
                    <a 
                      href={instructor.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-ekantik-600 transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {instructor.socialMedia?.facebook && (
                    <a 
                      href={instructor.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-ekantik-600 transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {instructor.socialMedia?.website && (
                    <a 
                      href={instructor.socialMedia.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-ekantik-600 transition-colors"
                    >
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Instructor Info */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {instructor.name}
                </h1>
                <p className="text-xl text-ekantik-600 font-medium mb-4">
                  {instructor.title || instructor.specialization}
                </p>
                
                {/* Specialties */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {instructor.specialties?.map((specialty: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                      {specialty}
                    </Badge>
                  )) || (
                    <Badge variant="outline" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                      {instructor.specialization}
                    </Badge>
                  )}
                </div>
                
                {/* Bio */}
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700 mb-4">{instructor.bio}</p>
                  
                  {instructor.philosophy && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Teaching Philosophy</h3>
                      <p className="text-gray-700">{instructor.philosophy}</p>
                    </div>
                  )}
                </div>
                
                {/* Certifications */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Certifications & Training</h3>
                  <ul className="space-y-2">
                    {instructor.certifications?.map((cert: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-ekantik-100 flex items-center justify-center mr-3 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-ekantik-600"></div>
                        </div>
                        <span className="text-gray-700">{cert}</span>
                      </li>
                    )) || (
                      <li className="text-gray-700">200-Hour Yoga Teacher Training</li>
                    )}
                  </ul>
                </div>
                
                {/* CTA */}
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                    <Link href={`/classes?instructor=${instructor.id}`}>
                      View Classes
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50">
                    <Link href="/contact?subject=Private Session">
                      Book Private Session
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Classes & Workshops Tabs */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="classes" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="classes">Upcoming Classes</TabsTrigger>
                  <TabsTrigger value="workshops">Workshops & Events</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="classes">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Classes with {instructor.name}
                  </h2>
                  
                  {instructorClasses.length > 0 ? (
                    <div className="space-y-4">
                      {instructorClasses.map((classItem: ClassType) => (
                        <Card key={classItem.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className="w-full md:w-1/4 bg-ekantik-100 aspect-video md:aspect-auto">
                                <img
                                  src={classItem.image}
                                  alt={classItem.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-6 md:w-3/4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                      {classItem.name}
                                    </h3>
                                    <p className="text-ekantik-600 font-medium">
                                      {classItem.category}
                                    </p>
                                  </div>
                                  <div className="mt-2 md:mt-0">
                                    <Badge className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                                      {classItem.level}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 mb-6 line-clamp-2">
                                  {classItem.description}
                                </p>
                                
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div className="flex items-center space-x-6 mb-4 md:mb-0">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                      <span className="text-sm text-gray-700">
                                        {classItem.schedule?.[0]?.day || "Monday"}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                      <span className="text-sm text-gray-700">
                                        {classItem.schedule?.[0]?.time || "18:00 - 19:15"}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <Button asChild size="sm" className="bg-ekantik-600 hover:bg-ekantik-700">
                                    <Link href={`/classes/${classItem.id}`}>
                                      View Details
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-6">No upcoming classes scheduled at this time.</p>
                      <Button asChild variant="outline" className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50">
                        <Link href="/classes">
                          Browse All Classes
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="workshops">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Workshops & Events with {instructor.name}
                  </h2>
                  
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-6">No upcoming workshops or events scheduled at this time.</p>
                    <Button asChild variant="outline" className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50">
                      <Link href="/events">
                        Browse All Events
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Student Testimonials
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 italic mb-6">
                      "{instructor.name}'s classes are the perfect balance of challenge and nurturing. 
                      I've grown so much in my practice under their guidance."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-ekantik-100 flex items-center justify-center mr-3">
                        <span className="text-ekantik-600 font-bold">AK</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Alex Kim</p>
                        <p className="text-sm text-gray-500">Student for 2 years</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 italic mb-6">
                      "I appreciate how {instructor.name} makes complex poses accessible with clear 
                      instructions and modifications. Every class feels like a personal journey."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-ekantik-100 flex items-center justify-center mr-3">
                        <span className="text-ekantik-600 font-bold">LM</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Lisa Martinez</p>
                        <p className="text-sm text-gray-500">Student for 1 year</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Private Sessions CTA */}
        <section className="py-16 bg-ekantik-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Book a Private Session
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Work one-on-one with {instructor.name} to deepen your practice, 
                address specific needs, or prepare for special events.
              </p>
              <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                <Link href={`/contact?subject=Private Session with ${instructor.name}`}>
                  Inquire About Private Sessions
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
