import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getEventBySlug, getUpcomingEvents } from "@/lib/api/events";
import { EventType } from "@/lib/types/events";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  
  if (!event) {
    return {
      title: "Event Not Found | Ekantik Studio",
    };
  }
  
  return {
    title: `${event.title} | Ekantik Studio Events`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);
  
  if (!event) {
    notFound();
  }
  
  const relatedEvents = await getUpcomingEvents(3);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (startDate === endDate) {
      return formatDate(startDate);
    }
    
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Check if early bird pricing is still available
  const isEarlyBirdAvailable = event.earlyBirdPrice && event.earlyBirdEndDate && new Date(event.earlyBirdEndDate) > new Date();

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
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Events
            </Link>
          </Button>
        </div>
        
        {/* Event Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Event Image */}
            <div className="lg:col-span-2">
              <div className="aspect-video rounded-lg overflow-hidden bg-ekantik-100">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Event Info & Booking */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <Badge className="mb-4">
                  {event.category}
                </Badge>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-ekantik-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Date</h3>
                      <p className="text-gray-700">{formatDateRange(event.startDate, event.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-ekantik-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Time</h3>
                      <p className="text-gray-700">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-ekantik-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Location</h3>
                      <p className="text-gray-700">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-ekantik-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Capacity</h3>
                      <p className="text-gray-700">
                        {event.spotsLeft <= 5 ? (
                          <span className="text-amber-600">Only {event.spotsLeft} spots left out of {event.capacity}</span>
                        ) : (
                          <span>{event.spotsLeft} spots available out of {event.capacity}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Price</span>
                    <div>
                      {isEarlyBirdAvailable ? (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-ekantik-600">£{event.earlyBirdPrice}</div>
                          <div className="text-sm">
                            <span className="text-gray-500 line-through">£{event.price}</span>
                            <span className="text-green-600 ml-2">Early Bird Price</span>
                          </div>
                          <div className="text-xs text-gray-500">Early bird ends {formatDate(event.earlyBirdEndDate!)}</div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-ekantik-600">£{event.price}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-ekantik-600 hover:bg-ekantik-700 mb-3">
                  Book Now
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Secure checkout. Full refund available up to 7 days before the event.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Event Details Tabs */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="instructors">Instructors</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-6">
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: event.longDescription || '' }} />
                    
                    {event.benefits && event.benefits.length > 0 && (
                      <div className="mt-8">
                        <h3>What You'll Gain</h3>
                        <ul>
                          {event.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {event.requirements && event.requirements.length > 0 && (
                      <div className="mt-8">
                        <h3>What to Know</h3>
                        <ul>
                          {event.requirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {event.includedItems && event.includedItems.length > 0 && (
                      <div className="mt-8">
                        <h3>What's Included</h3>
                        <ul>
                          {event.includedItems.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="instructors" className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Meet Your Instructors
                  </h2>
                  
                  <div className="space-y-8">
                    {event.instructors.map((instructor) => (
                      <div key={instructor.id} className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="w-32 h-32 rounded-full overflow-hidden shrink-0">
                          <img
                            src={instructor.image}
                            alt={instructor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center md:text-left">
                            {instructor.name}
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {instructor.id === "1" 
                              ? "Maya is the founder of Ekantik Studio and has been teaching yoga for over 15 years. She specializes in Vinyasa and Hatha yoga, with a focus on alignment and mindful movement."
                              : instructor.id === "2"
                              ? "Sarah is a senior instructor at Ekantik Studio with expertise in Yin and Restorative yoga. Her classes emphasize deep relaxation and stress relief."
                              : instructor.id === "3"
                              ? "David is our meditation specialist with over a decade of experience in mindfulness practices. He makes meditation accessible and practical for modern life."
                              : instructor.id === "4"
                              ? "Emma combines her knowledge of yoga and Ayurveda to create holistic wellness experiences. She specializes in personalized practices for different body types."
                              : "Michael is a former athlete who specializes in yoga for strength and mobility. His classes are dynamic and focus on functional movement patterns."
                            }
                          </p>
                          <div className="flex justify-center md:justify-start">
                            <Button asChild variant="outline" className="text-ekantik-600 border-ekantik-200 hover:bg-ekantik-50">
                              <Link href={`/instructors/${instructor.id}`}>
                                View Full Profile
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="faq" className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        What should I bring?
                      </h3>
                      <p className="text-gray-700">
                        Please bring your own yoga mat if you have one (we have extras if needed), comfortable clothing appropriate for movement, a water bottle, and any personal items you may need.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        What is your cancellation policy?
                      </h3>
                      <p className="text-gray-700">
                        We offer full refunds for cancellations made at least 7 days before the event. Cancellations within 7 days may receive a studio credit or transfer to another event, at our discretion.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Is this event suitable for beginners?
                      </h3>
                      <p className="text-gray-700">
                        Please check the event description for specific level recommendations. Many of our events are designed for all levels, with modifications offered for beginners and more advanced practitioners.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Can I use my membership for this event?
                      </h3>
                      <p className="text-gray-700">
                        Regular studio memberships do not typically include special events, workshops, or retreats. However, members often receive discounts on these offerings. Please contact us for details.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        What if I have dietary restrictions?
                      </h3>
                      <p className="text-gray-700">
                        For events that include meals, we can accommodate most dietary needs with advance notice. Please let us know your requirements when booking.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar - Tags & Share */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-white text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Share This Event
                </h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span className="sr-only">Instagram</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span className="sr-only">Copy Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              What Participants Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-6">
                    "The {event.category.toLowerCase()} was transformative. The instructors were knowledgeable and supportive, and I left with practical tools I use daily."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-ekantik-100 flex items-center justify-center mr-3">
                      <span className="text-ekantik-600 font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Jane Doe</p>
                      <p className="text-sm text-gray-500">Previous participant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-6">
                    "I was hesitant to sign up as a beginner, but I'm so glad I did. The environment was welcoming and I learned so much in just one day."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-ekantik-100 flex items-center justify-center mr-3">
                      <span className="text-ekantik-600 font-bold">MS</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Michael Smith</p>
                      <p className="text-sm text-gray-500">Previous participant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-6">
                    "The attention to detail was impressive. From the quality of instruction to the venue and materials provided, everything exceeded my expectations."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-ekantik-100 flex items-center justify-center mr-3">
                      <span className="text-ekantik-600 font-bold">AK</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Aisha Khan</p>
                      <p className="text-sm text-gray-500">Previous participant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                You May Also Like
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {relatedEvents.filter(e => e.id !== event.id).slice(0, 3).map((relatedEvent: EventType) => (
                  <Card key={relatedEvent.id} className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={relatedEvent.image}
                        alt={relatedEvent.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gray-800/80 text-white">
                          {relatedEvent.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDateRange(relatedEvent.startDate, relatedEvent.endDate)}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/events/${relatedEvent.slug}`}
                          className="hover:text-ekantik-600 transition-colors"
                        >
                          {relatedEvent.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-700 text-sm mb-4 flex-grow">
                        {relatedEvent.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-semibold text-ekantik-600">£{relatedEvent.earlyBirdPrice || relatedEvent.price}</span>
                        <Button asChild variant="outline" className="text-ekantik-600 border-ekantik-200 hover:bg-ekantik-50">
                          <Link href={`/events/${relatedEvent.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="py-16 bg-ekantik-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Join This Event?
              </h2>
              <p className="text-xl text-ekantik-100 mb-8">
                Secure your spot today and embark on a transformative experience with Ekantik Studio.
              </p>
              <Button className="bg-white text-ekantik-600 hover:bg-ekantik-50">
                Book Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
