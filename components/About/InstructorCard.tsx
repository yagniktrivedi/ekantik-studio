"use client";

import Link from "next/link";
import { Instagram, Facebook, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InstructorType } from "@/lib/types";

interface InstructorCardProps {
  instructor: InstructorType;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={instructor.image}
          alt={instructor.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{instructor.name}</h3>
        <p className="text-ekantik-600 font-medium mb-3">{instructor.title || instructor.specialization}</p>
        
        <div className="mb-4 flex flex-wrap gap-2">
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
        
        <p className="text-gray-700 text-sm mb-6 flex-grow">{instructor.bio.substring(0, 120)}...</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex space-x-2">
            {instructor.socialMedia?.instagram && (
              <a 
                href={instructor.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-ekantik-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
            )}
            {instructor.socialMedia?.facebook && (
              <a 
                href={instructor.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-ekantik-600 transition-colors"
              >
                <Facebook size={18} />
              </a>
            )}
            {instructor.socialMedia?.website && (
              <a 
                href={instructor.socialMedia.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-ekantik-600 transition-colors"
              >
                <Globe size={18} />
              </a>
            )}
          </div>
          
          <Button 
            asChild
            variant="outline" 
            className="text-ekantik-600 border-ekantik-200 hover:bg-ekantik-50"
          >
            <Link href={`/instructors/${instructor.id}`}>
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
