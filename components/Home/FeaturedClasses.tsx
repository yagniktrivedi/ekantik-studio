"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClasses } from "@/lib/supabase/classes";
import { YogaClass } from "@/lib/supabase/classes";
import { useToast } from "@/components/ui/use-toast";

// Categories for filtering
const classCategories = [
  "All",
  "yoga",
  "meditation",
  "pilates",
  "fitness",
  "wellness"
];

export default function FeaturedClasses() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchClasses() {
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
          setClasses(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchClasses();
  }, [toast]);
  
  const filteredClasses = activeCategory === "All" 
    ? classes 
    : classes.filter(cls => cls.category === activeCategory);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Classes</h2>
            <p className="text-muted-foreground mt-2">
              Discover our most popular yoga and wellness classes
            </p>
          </div>
          <Button asChild variant="link" className="mt-2 md:mt-0">
            <Link href="/classes">
              View All Classes
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="flex flex-wrap h-auto bg-transparent p-0 mb-6">
            {classCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className="data-[state=active]:bg-ekantik-100 data-[state=active]:text-ekantik-900 dark:data-[state=active]:bg-ekantik-900/20 dark:data-[state=active]:text-ekantik-100 rounded-full px-4 py-2 mr-2 mb-2"
              >
                {category === 'yoga' ? 'Yoga' : 
                 category === 'meditation' ? 'Meditation' : 
                 category === 'pilates' ? 'Pilates' : 
                 category === 'fitness' ? 'Fitness' : 
                 category === 'wellness' ? 'Wellness' : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-ekantik-500 border-t-transparent"></div>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No classes found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                  <Link key={cls.id} href={`/classes/${cls.id}`}>
                    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                      <div className="aspect-video relative overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-cover bg-center" 
                          style={{ 
                            backgroundImage: `url(${cls.image_url || '/images/classes/default.jpg'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white text-black font-medium">
                            {cls.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{cls.name || 'Unnamed Class'}</h3>
                          <span className="font-medium text-ekantik-600">${cls.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {cls.description || 'No description available'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{cls.duration_minutes} min</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{cls.capacity} spots</span>
                          </div>
                          <span className="text-ekantik-600 font-medium">{cls.level}</span>
                        </div>
                        <div className="mt-3 text-sm font-medium">
                          {/* We'll need to fetch instructor details separately or join in the query */}
                          Instructor: {cls.instructor_id ? 'View details' : 'Not assigned'}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/classes">
              Explore All Classes
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
