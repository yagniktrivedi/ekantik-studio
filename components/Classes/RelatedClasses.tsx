"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRelatedClasses } from "@/lib/api/classes";
import { ClassType } from "@/lib/types";

interface RelatedClassesProps {
  currentClassId: string;
  category: string;
}

export default function RelatedClasses({ currentClassId, category }: RelatedClassesProps) {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedClasses = async () => {
      try {
        const data = await getRelatedClasses(currentClassId, category);
        setClasses(data);
      } catch (error) {
        console.error("Error fetching related classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedClasses();
  }, [currentClassId, category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No related classes found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="relative h-48 w-full">
            <Image
              src={classItem.image}
              alt={classItem.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90 text-ekantik-900">
                {classItem.category}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-ekantik-900 mb-2">
              {classItem.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {classItem.description}
            </p>
            <p className="text-sm text-ekantik-600">
              {classItem.duration} min • {classItem.level}
            </p>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full bg-ekantik-600 hover:bg-ekantik-700">
              <Link href={`/classes/${classItem.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
