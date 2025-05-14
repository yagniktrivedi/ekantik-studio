"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    role: "Member since 2022",
    image: "/images/testimonials/emma.jpg",
    content: "Ekantik Studio has transformed my yoga practice. The instructors are incredibly knowledgeable and supportive, and the studio has such a peaceful atmosphere. I leave every class feeling refreshed and centered.",
    rating: 5
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Member since 2023",
    image: "/images/testimonials/james.jpg",
    content: "As someone who was intimidated by yoga, I found Ekantik Studio to be incredibly welcoming. The beginner classes helped me build confidence, and now I attend regularly. It's become an essential part of my wellness routine.",
    rating: 5
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    role: "Member since 2021",
    image: "/images/testimonials/sophia.jpg",
    content: "The aerial yoga classes at Ekantik are exceptional! The instructors make complex poses accessible and ensure everyone feels safe. I've gained strength and flexibility I never thought possible.",
    rating: 5
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Member since 2022",
    image: "/images/testimonials/michael.jpg",
    content: "I joined Ekantik for the meditation classes and stayed for everything else. The mindfulness techniques I've learned have helped me manage stress and improve focus in all areas of my life.",
    rating: 5
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Member since 2023",
    image: "/images/testimonials/aisha.jpg",
    content: "The prenatal yoga classes were exactly what I needed during my pregnancy. The instructor was attentive to my needs and helped me stay active safely. I'm now continuing with the mom & baby classes!",
    rating: 5
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplay(true), 10000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section className="py-16 bg-ekantik-50 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Members Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our community about their experiences at Ekantik Studio
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-none shadow-lg bg-white dark:bg-gray-800">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="mr-4">
                          <Avatar className="h-14 w-14 border-2 border-ekantik-100">
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                        <div className="ml-auto">
                          <Quote className="h-10 w-10 text-ekantik-100" />
                        </div>
                      </div>
                      <p className="text-lg italic">{testimonial.content}</p>
                      <div className="flex mt-6">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-8 bg-ekantik-500"
                    : "w-2.5 bg-ekantik-200"
                }`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
