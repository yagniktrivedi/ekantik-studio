"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MembershipCTA() {
  return (
    <section className="py-16 bg-ekantik-600 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Join Our Yoga Community
            </h2>
            <p className="text-ekantik-100 mb-6">
              Become a member of Ekantik Studio and transform your practice with unlimited access to our classes, 
              exclusive workshops, and a supportive community of like-minded individuals.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <Check className="h-5 w-5 text-ekantik-200" />
                </div>
                <p className="text-ekantik-100">
                  <span className="font-medium text-white">Unlimited Classes</span> - Access all regular classes with no restrictions
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <Check className="h-5 w-5 text-ekantik-200" />
                </div>
                <p className="text-ekantik-100">
                  <span className="font-medium text-white">Member Discounts</span> - Save on workshops, retreats, and store purchases
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <Check className="h-5 w-5 text-ekantik-200" />
                </div>
                <p className="text-ekantik-100">
                  <span className="font-medium text-white">Priority Booking</span> - Reserve your spot in popular classes before they fill up
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <Check className="h-5 w-5 text-ekantik-200" />
                </div>
                <p className="text-ekantik-100">
                  <span className="font-medium text-white">Community Events</span> - Join exclusive member-only events and gatherings
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/memberships">
                  View Membership Options
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10 border-white">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img 
                src="/images/membership/yoga-community.jpg" 
                alt="Yoga Community" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-900/90 p-6 rounded-lg shadow-lg max-w-xs">
              <p className="font-bold text-ekantik-600 dark:text-ekantik-400 text-xl mb-2">
                Starting from $89/month
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Flexible membership options to fit your schedule and budget. No long-term commitments required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
