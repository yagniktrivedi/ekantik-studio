import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MapPin, Filter, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { 
  getAllEvents, 
  getFeaturedEvents, 
  getUpcomingEvents,
  getAllEventCategories 
} from "@/lib/api/events";
import { EventType, EventCategoryType } from "@/lib/types/events";

export const metadata: Metadata = {
  title: "Events & Workshops | Ekantik Studio",
  description: "Join our yoga workshops, retreats, and special events at Ekantik Studio.",
};

export default async function EventsPage() {
  const allEvents = await getAllEvents();
  const featuredEvents = await getFeaturedEvents();
  const upcomingEvents = await getUpcomingEvents();
  const categories = await getAllEventCategories();
  
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

  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-ekantik-50 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <PageHeader
              title="Events & Workshops"
              description="Deepen your practice with our special events, workshops, and retreats"
            />
            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search events..." 
                  className="pl-10 py-6 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        {featuredEvents.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Featured Events
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-ekantik-600 hover:bg-ekantik-700 text-white">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Badge variant="outline" className="mr-2">
                          {event.category}
                        </Badge>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDateRange(event.startDate, event.endDate)}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/events/${event.slug}`}
                          className="hover:text-ekantik-600 transition-colors"
                        >
                          {event.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-700 mb-4 flex-grow">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-col space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          {event.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-ekantik-600 font-semibold">
                          {event.earlyBirdPrice && new Date(event.earlyBirdEndDate!) > new Date() ? (
                            <div>
                              <span className="text-lg">£{event.earlyBirdPrice}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">£{event.price}</span>
                            </div>
                          ) : (
                            <span className="text-lg">£{event.price}</span>
                          )}
                        </div>
                        
                        <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                          <Link href={`/events/${event.slug}`}>
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

        {/* Main Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Sidebar */}
              <div className="lg:col-span-3">
                <div className="sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Filter Events
                  </h3>
                  
                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Categories</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="all-categories" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="all-categories" className="ml-2 text-gray-700">
                          All Categories
                        </label>
                      </div>
                      
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`category-${category.id}`} 
                            className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                            {category.name} ({category.count})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Date Range */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Date Range</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="date-all" 
                          name="date-range" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="date-all" className="ml-2 text-gray-700">
                          All Upcoming
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="date-month" 
                          name="date-range" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300"
                        />
                        <label htmlFor="date-month" className="ml-2 text-gray-700">
                          This Month
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="date-3months" 
                          name="date-range" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300"
                        />
                        <label htmlFor="date-3months" className="ml-2 text-gray-700">
                          Next 3 Months
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="date-custom" 
                          name="date-range" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300"
                        />
                        <label htmlFor="date-custom" className="ml-2 text-gray-700">
                          Custom Range
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Price Range</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="price-all" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="price-all" className="ml-2 text-gray-700">
                          All Prices
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="price-under50" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                        />
                        <label htmlFor="price-under50" className="ml-2 text-gray-700">
                          Under £50
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="price-50-100" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                        />
                        <label htmlFor="price-50-100" className="ml-2 text-gray-700">
                          £50 - £100
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="price-100-200" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                        />
                        <label htmlFor="price-100-200" className="ml-2 text-gray-700">
                          £100 - £200
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="price-over200" 
                          className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                        />
                        <label htmlFor="price-over200" className="ml-2 text-gray-700">
                          Over £200
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-ekantik-600 hover:bg-ekantik-700">
                    Apply Filters
                  </Button>
                </div>
              </div>
              
              {/* Events List */}
              <div className="lg:col-span-9">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                    Upcoming Events
                  </h2>
                  
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2">Sort by:</span>
                    <select className="border-gray-300 rounded-md text-gray-700 text-sm focus:ring-ekantik-600 focus:border-ekantik-600">
                      <option value="date-asc">Date (Soonest)</option>
                      <option value="date-desc">Date (Latest)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                    </select>
                  </div>
                </div>
                
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-8">
                    {upcomingEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 lg:w-1/4">
                              <div className="aspect-video md:h-full relative overflow-hidden">
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-gray-800/80 text-white">
                                    {event.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="p-6 md:w-2/3 lg:w-3/4">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                <Link 
                                  href={`/events/${event.slug}`}
                                  className="hover:text-ekantik-600 transition-colors"
                                >
                                  {event.title}
                                </Link>
                              </h3>
                              
                              <div className="flex flex-wrap gap-y-2 mb-3">
                                <div className="flex items-center text-sm text-gray-700 mr-4">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                  {formatDateRange(event.startDate, event.endDate)}
                                </div>
                                <div className="flex items-center text-sm text-gray-700 mr-4">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  {event.time}
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                  {event.location}
                                </div>
                              </div>
                              
                              <p className="text-gray-700 mb-4">
                                {event.description}
                              </p>
                              
                              <div className="flex flex-wrap items-center justify-between mt-auto">
                                <div>
                                  <div className="text-ekantik-600 font-semibold">
                                    {event.earlyBirdPrice && new Date(event.earlyBirdEndDate!) > new Date() ? (
                                      <div>
                                        <span className="text-lg">£{event.earlyBirdPrice}</span>
                                        <span className="text-sm text-gray-500 line-through ml-2">£{event.price}</span>
                                        <span className="ml-2 text-sm text-green-600">Early Bird</span>
                                      </div>
                                    ) : (
                                      <span className="text-lg">£{event.price}</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    {event.spotsLeft <= 5 ? (
                                      <span className="text-amber-600">Only {event.spotsLeft} spots left</span>
                                    ) : (
                                      <span>{event.spotsLeft} spots available</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="mt-4 md:mt-0">
                                  <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                                    <Link href={`/events/${event.slug}`}>
                                      View Details
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-700 mb-6">
                      There are no events matching your current filters. Please try adjusting your search criteria.
                    </p>
                    <Button variant="outline" className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50">
                      Clear Filters
                    </Button>
                  </div>
                )}
                
                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Host an Event CTA */}
        <section className="py-16 bg-ekantik-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Interested in Hosting an Event?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Ekantik Studio offers a beautiful space for yoga workshops, wellness events, and retreats. 
                Our venue is available for qualified instructors and wellness practitioners.
              </p>
              <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                <Link href="/contact?subject=Venue Rental">
                  Inquire About Venue Rental
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-ekantik-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated on New Events
              </h2>
              <p className="text-xl text-ekantik-100 mb-8">
                Subscribe to our newsletter to be the first to know about upcoming workshops, retreats, and special offers.
              </p>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-md flex-grow"
                  required
                />
                <Button className="bg-white text-ekantik-600 hover:bg-ekantik-50 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-ekantik-200 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
