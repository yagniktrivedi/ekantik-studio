"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for yoga classes
interface YogaClass {
  id: string;
  name: string;
  description: string;
  instructor: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  category: string;
  duration: number;
  capacity: number;
  price: number;
  date: string;
  time: string;
  day: string;
  status: "available" | "few spots" | "full";
}

const mockClasses: YogaClass[] = [
  {
    id: "1",
    name: "Vinyasa Flow",
    description: "A dynamic practice that connects breath with movement through a flowing sequence of poses.",
    instructor: "Maya Johnson",
    level: "intermediate",
    category: "Vinyasa",
    duration: 60,
    capacity: 15,
    price: 18,
    date: "2025-05-03",
    time: "10:00",
    day: "Monday",
    status: "available"
  },
  {
    id: "2",
    name: "Gentle Yoga",
    description: "A slower-paced class focusing on relaxation, stretching, and mindfulness.",
    instructor: "David Singh",
    level: "beginner",
    category: "Hatha",
    duration: 45,
    capacity: 20,
    price: 15,
    date: "2025-05-03",
    time: "09:00",
    day: "Tuesday",
    status: "available"
  },
  {
    id: "3",
    name: "Power Yoga",
    description: "A vigorous, fitness-based approach to vinyasa-style yoga.",
    instructor: "Alex Williams",
    level: "advanced",
    category: "Power",
    duration: 75,
    capacity: 12,
    price: 22,
    date: "2025-05-03",
    time: "18:00",
    day: "Monday",
    status: "few spots"
  },
  {
    id: "4",
    name: "Yin Yoga",
    description: "A slow-paced style of yoga with poses held for longer periods of time.",
    instructor: "Sophia Rodriguez",
    level: "all",
    category: "Yin",
    duration: 90,
    capacity: 15,
    price: 20,
    date: "2025-05-04",
    time: "19:00",
    day: "Tuesday",
    status: "available"
  },
  {
    id: "5",
    name: "Aerial Yoga",
    description: "A modern form of yoga utilizing a hammock or yoga swing to perform poses.",
    instructor: "Leila Patel",
    level: "intermediate",
    category: "Aerial",
    duration: 60,
    capacity: 8,
    price: 25,
    date: "2025-05-05",
    time: "11:00",
    day: "Saturday",
    status: "full"
  },
  {
    id: "6",
    name: "Meditation",
    description: "Guided meditation sessions to calm the mind and reduce stress.",
    instructor: "David Singh",
    level: "all",
    category: "Meditation",
    duration: 30,
    capacity: 20,
    price: 12,
    date: "2025-05-06",
    time: "07:00",
    day: "Monday",
    status: "available"
  },
  {
    id: "7",
    name: "Prenatal Yoga",
    description: "Specially designed yoga for expectant mothers to support their changing bodies.",
    instructor: "Maya Johnson",
    level: "all",
    category: "Prenatal",
    duration: 60,
    capacity: 10,
    price: 20,
    date: "2025-05-07",
    time: "11:00",
    day: "Wednesday",
    status: "available"
  }
];

export default function SchedulePage() {
  const [classes, setClasses] = useState<YogaClass[]>(mockClasses);
  const [filteredClasses, setFilteredClasses] = useState<YogaClass[]>(mockClasses);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [view, setView] = useState<string>("list");

  // Get current week days
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    return {
      date: format(day, "yyyy-MM-dd"),
      day: format(day, "EEEE"),
      display: format(day, "EEE dd MMM")
    };
  });

  useEffect(() => {
    filterClasses();
  }, [selectedCategory, selectedLevel, selectedDay]);

  const filterClasses = () => {
    let filtered = [...classes];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(cls => cls.category === selectedCategory);
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter(cls => cls.level === selectedLevel);
    }

    if (selectedDay !== "all") {
      filtered = filtered.filter(cls => cls.day === selectedDay);
    }

    setFilteredClasses(filtered);
  };

  const getUniqueCategories = () => {
    const categories = classes.map(cls => cls.category);
    // @ts-ignore
    return ["all", ...new Set(categories)];
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "few spots":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "full":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
        <p className="text-muted-foreground mt-2">
          Browse our weekly class schedule and book your spot today.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your class search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getUniqueCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Day</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          <Tabs defaultValue="list" value={view} onValueChange={setView} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="space-y-4">
              {filteredClasses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No classes found with the selected filters.</p>
                </div>
              ) : (
                filteredClasses.map(cls => (
                  <Card key={cls.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold">{cls.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{cls.description}</p>
                            </div>
                            <Badge className={getLevelBadgeColor(cls.level)}>
                              {cls.level.charAt(0).toUpperCase() + cls.level.slice(1)}
                            </Badge>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{cls.day}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{cls.time} ({cls.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">With {cls.instructor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusBadgeColor(cls.status)}>
                                {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-between items-center">
                            <div>
                              <span className="text-lg font-bold">£{cls.price}</span>
                              <span className="text-muted-foreground text-sm"> / class</span>
                            </div>
                            <Link href={`/book?class=${cls.id}`} passHref>
                              <Button disabled={cls.status === "full"}>
                                {cls.status === "full" ? "Full" : "Book Now"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => (
                  <div key={day.date} className="text-center">
                    <div className="font-medium">{day.display}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => {
                  const dayClasses = classes.filter(cls => cls.day === day.day);
                  return (
                    <div key={day.date} className="border rounded-md p-2 min-h-[200px]">
                      {dayClasses.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                          No classes
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dayClasses.map(cls => (
                            <div key={cls.id} className="p-2 bg-muted rounded-md text-sm">
                              <div className="font-medium">{cls.name}</div>
                              <div className="text-xs text-muted-foreground">{cls.time}</div>
                              <div className="mt-1 flex justify-between items-center">
                                <Badge className={getStatusBadgeColor(cls.status)} variant="outline">
                                  {cls.status}
                                </Badge>
                                <Link href={`/book?class=${cls.id}`} passHref>
                                  <Button size="sm" variant="ghost" disabled={cls.status === "full"}>
                                    Book
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
