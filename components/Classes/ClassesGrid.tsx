"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User } from "lucide-react";
import { getClasses } from "@/lib/supabase/classes";
import { YogaClass } from "@/lib/supabase/classes";
import { useClassFilters } from "./ClassesFilter";
import { useToast } from "@/components/ui/use-toast";

// Custom class type to handle both title and name fields
interface ClassWithFallbacks {
  id: string;
  name?: string;
  title?: string;
  description?: string | null;
  instructor_id?: string | null;
  duration_minutes?: number;
  duration?: number;
  capacity?: number;
  price?: number;
  level?: string;
  category?: string;
  start_time?: string;
  location?: string | null;
  image_url?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ClassesGrid() {
  const [allClasses, setAllClasses] = useState<ClassWithFallbacks[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassWithFallbacks[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters, isFiltered } = useClassFilters();
  const { toast } = useToast();

  console.log('ClassesGrid allClasses:', filteredClasses);

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const { data, error } = await getClasses();
        
        if (error) {
          console.error("Error fetching classes:", error);
          toast({
            title: "Error",
            description: "Failed to load classes. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          setAllClasses(data as ClassWithFallbacks[]);
          setFilteredClasses(data as ClassWithFallbacks[]);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [toast]);
  
  // Apply filters whenever filters change
  useEffect(() => {
    if (!allClasses.length) return;
    
    const filtered = allClasses.filter(classItem => {
      // Filter by category
      if (filters.categories.length > 0 && !filters.categories.includes(classItem.category || '')) {
        return false;
      }
      
      // Filter by level
      if (filters.levels.length > 0 && !filters.levels.includes(classItem.level || '')) {
        return false;
      }
      
      // Filter by duration
      if (filters.durations.length > 0 && !filters.durations.some(d => {
        const duration = parseInt(d);
        const classDuration = classItem.duration_minutes || classItem.duration || 0;
        // Check if duration_minutes is within a range (e.g., 30-45, 45-60, 60-90)
        if (d === '30' && classDuration <= 30) return true;
        if (d === '45' && classDuration > 30 && classDuration <= 45) return true;
        if (d === '60' && classDuration > 45 && classDuration <= 60) return true;
        if (d === '90' && classDuration > 60 && classDuration <= 90) return true;
        if (d === '120' && classDuration > 90) return true;
        return false;
      })) {
        return false;
      }
      
      // Filter by location
      if (filters.locations.length > 0) {
        const locationMatch = filters.locations.some(loc => {
          if (loc === 'studio' && classItem.location?.includes('Studio')) return true;
          if (loc === 'online' && classItem.location?.toLowerCase().includes('online')) return true;
          return false;
        });
        if (!locationMatch) return false;
      }
      
      // Filter by price range
      if ((classItem.price || 0) < filters.priceRange[0] || (classItem.price || 0) > filters.priceRange[1]) {
        return false;
      }
      
      return true;
    });
    
    setFilteredClasses(filtered);
  }, [filters, allClasses]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredClasses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No classes found</h3>
        <p className="text-gray-500 mt-2">
          {isFiltered ? "Try adjusting your filters or check back later." : "No classes are currently available."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredClasses.map((classItem) => (
        <Card key={classItem.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="relative h-48 w-full">
            {classItem.image_url ? (
              <Image
                src={classItem.image_url}
                alt={classItem.title || classItem.name || 'Yoga class'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8QfZYvQAAAABJRU5ErkJggg=="
              />
            ) : (
              <div className="h-full w-full bg-ekantik-100 flex items-center justify-center">
                <span className="text-ekantik-600">No image available</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <Badge variant="secondary" className="bg-white/90 text-ekantik-900">
                {classItem.category}
              </Badge>
              <Badge variant="secondary" className="bg-ekantik-600/90 text-white">
                {classItem.level}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold text-ekantik-900 mb-2">
              {classItem.name || classItem.title || 'Unnamed Class'}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {classItem.description || 'No description available'}
            </p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-ekantik-600" />
                <span>{classItem.duration_minutes || classItem.duration || 60} minutes</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-ekantik-600" />
                <span>{classItem.location || 'Location TBD'}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-ekantik-600" />
                <span>Instructor ID: {classItem.instructor_id || 'Not assigned'}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button asChild variant="outline" className="w-1/2">
              <Link href={`/classes/${classItem.id}`}>Details</Link>
            </Button>
            <Button asChild className="w-1/2 bg-ekantik-600 hover:bg-ekantik-700">
              <Link href={`/book?class=${classItem.id}`}>Book Now</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
