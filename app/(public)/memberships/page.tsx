import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

// Mock membership data
const memberships = [
  {
    id: "1",
    name: "Drop-In",
    description: "Perfect for occasional visitors or those wanting to try our classes",
    price: 20,
    interval: "per class",
    features: [
      "Access to any single class",
      "No commitment required",
      "Includes all studio amenities",
      "Online booking available",
      "Valid for 24 hours from purchase"
    ],
    popular: false,
    credits: 1
  },
  {
    id: "2",
    name: "Class Pack",
    description: "Ideal for regular practitioners who want flexibility",
    price: 100,
    interval: "for 6 classes",
    features: [
      "6 class credits",
      "Valid for 3 months",
      "Priority booking",
      "Access to all regular classes",
      "Includes all studio amenities",
      "Unused credits can be shared"
    ],
    popular: true,
    credits: 6
  },
  {
    id: "3",
    name: "Monthly Unlimited",
    description: "For dedicated yogis who practice frequently",
    price: 150,
    interval: "per month",
    features: [
      "Unlimited classes",
      "Month-to-month commitment",
      "Priority booking",
      "10% discount on workshops",
      "Access to member-only events",
      "Free mat storage"
    ],
    popular: false,
    credits: "unlimited"
  },
  {
    id: "4",
    name: "Annual Membership",
    description: "Our best value for committed practitioners",
    price: 1500,
    interval: "per year",
    features: [
      "Unlimited classes",
      "Two free guest passes",
      "15% discount on workshops",
      "20% discount on store items",
      "Priority booking for special events",
      "Free mat storage",
      "Exclusive member events"
    ],
    popular: false,
    credits: "unlimited"
  }
];

export default function MembershipsPage() {
  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-ekantik-50 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Membership Options
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Choose the perfect membership to support your yoga journey. 
                From drop-in classes to unlimited access, we have options for every lifestyle.
              </p>
              <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-700">
                No hidden fees, just straightforward options to support your practice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {memberships.map((membership) => (
                <Card 
                  key={membership.id} 
                  className={`flex flex-col h-full ${
                    membership.popular 
                      ? "border-ekantik-600 shadow-lg relative" 
                      : "border-gray-200"
                  }`}
                >
                  {membership.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-ekantik-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pb-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {membership.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {membership.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ${membership.price}
                      </span>
                      <span className="text-gray-600 ml-2">
                        {membership.interval}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {membership.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-ekantik-600" />
                          </div>
                          <p className="ml-3 text-gray-700">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      asChild
                      className={`w-full ${
                        membership.popular 
                          ? "bg-ekantik-600 hover:bg-ekantik-700" 
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      <Link href={`/account/purchase?membership=${membership.id}`}>
                        Get Started
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Membership Benefits
              </h2>
              <p className="text-xl text-gray-700">
                All memberships include these core benefits to enhance your experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="bg-ekantik-100 p-4 rounded-full inline-flex mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ekantik-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h3>
                <p className="text-gray-700">
                  Book classes up to 2 weeks in advance, cancel up to 12 hours before class, 
                  and enjoy the flexibility to attend any class that fits your schedule.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="bg-ekantik-100 p-4 rounded-full inline-flex mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ekantik-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Facilities</h3>
                <p className="text-gray-700">
                  Enjoy access to our beautiful studio spaces, changing rooms with showers, 
                  complimentary tea, filtered water, and all necessary props for your practice.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="bg-ekantik-100 p-4 rounded-full inline-flex mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ekantik-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Events</h3>
                <p className="text-gray-700">
                  Connect with like-minded individuals through our community events, 
                  workshops, and member socials that foster growth and connection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-700">
                  Everything you need to know about our membership options
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How do I use my class credits?
                  </h3>
                  <p className="text-gray-700">
                    Class credits are automatically applied when you book a class through our website or mobile app. 
                    You'll see your remaining credits in your account dashboard, and you'll be notified when your 
                    credits are running low.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I freeze my membership?
                  </h3>
                  <p className="text-gray-700">
                    Yes, monthly and annual memberships can be frozen for up to 30 days per year (60 days for annual members). 
                    Simply log into your account or contact us at least 7 days before you'd like the freeze to begin.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What is your cancellation policy?
                  </h3>
                  <p className="text-gray-700">
                    You can cancel a class up to 12 hours before it starts without losing your credit. 
                    For monthly memberships, you can cancel anytime with 30 days' notice. Annual memberships 
                    can be cancelled with a 60-day notice period.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I share my membership or class pack with someone else?
                  </h3>
                  <p className="text-gray-700">
                    Class packs can be shared with one designated friend or family member. Monthly and annual 
                    memberships are non-transferable and can only be used by the registered member.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-ekantik-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-xl text-ekantik-100 mb-8">
                Join our community today and transform your practice with Ekantik Studio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-white text-ekantik-600 hover:bg-ekantik-50"
                >
                  <Link href="/account/register">
                    Create Account
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-ekantik-700"
                >
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
