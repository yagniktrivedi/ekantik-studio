"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPreview() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="/images/about/studio-preview.jpg" 
                alt="Ekantik Studio" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-lg overflow-hidden border-4 border-white dark:border-gray-950 shadow-lg hidden md:block">
              <img 
                src="/images/about/yoga-detail.jpg" 
                alt="Yoga Practice" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Studio</h2>
            <p className="text-muted-foreground mb-6">
              Ekantik Studio is a sanctuary for mind, body, and spirit in the heart of the Cotswolds. 
              Our studio offers a peaceful retreat where you can disconnect from the outside world and 
              reconnect with yourself through the practice of yoga and meditation.
            </p>
            <p className="text-muted-foreground mb-6">
              Founded in 2020 by a collective of passionate yoga practitioners, our mission is to create 
              an inclusive community where everyone can explore and deepen their practice, regardless of 
              experience or background.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/about">
                  Learn More About Us
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
