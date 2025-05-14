"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstructorType } from "@/lib/types";

interface InstructorCardProps {
  instructor: InstructorType;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-1/3">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h3 className="text-xl font-semibold text-ekantik-900 mb-1">
              {instructor.name}
            </h3>
            <p className="text-ekantik-600 text-sm mb-3">{instructor.specialization}</p>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {instructor.bio}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {instructor.certifications.map((cert, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {cert}
                </span>
              ))}
            </div>
            
            <Button asChild variant="outline" size="sm">
              <Link href={`/instructors/${instructor.id}`}>
                View Full Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
