"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  Users,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassForm from "./components/class-form";
import { ScheduleForm } from "./components/schedule-form";
import { ClassType } from "@/lib/supabase/class-types";

// Interface for classes with additional data
interface ClassWithDetails extends ClassType {
  instructorName: string;
  schedulesCount: number;
  nextSchedule?: {
    id: string;
    date: string;
    time: string;
    location: string;
  };
  status: "active" | "cancelled" | "full";
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        // Fetch classes without trying to join with a non-existent instructors table
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select(`
            *
          `);

        if (classesError) {
          console.error("Error fetching classes:", classesError);
          throw classesError;
        }
        
        if (!classesData) {
          setClasses([]);
          setFilteredClasses([]);
          setIsLoading(false);
          return;
        }

        // Fetch next schedule for each class
        const classesWithDetails: ClassWithDetails[] = await Promise.all(
          classesData.map(async (classItem) => {
            // Fetch instructor details separately
            let instructorName = 'Unknown Instructor';
            if (classItem.instructor_id) {
              try {
                // Try to fetch from profiles table first
                const { data: profileData, error: profileError } = await supabase
                  .from('profiles')
                  .select('full_name, email')
                  .eq('id', classItem.instructor_id)
                  .single();
                  
                if (!profileError && profileData) {
                  instructorName = profileData.full_name || profileData.email || 'Unknown Instructor';
                } else {
                  // If profiles doesn't exist, use a shortened UUID
                  instructorName = `Instructor ${classItem.instructor_id.substring(0, 8)}`;
                }
              } catch (error) {
                console.error('Error fetching instructor profile:', error);
                // Use a shortened UUID as fallback
                instructorName = `Instructor ${classItem.instructor_id.substring(0, 8)}`;
              }
            }

            // No need to fetch schedules as they're now part of the class data

            // Get booking count to determine if class is full
            let status: 'active' | 'cancelled' | 'full' = classItem.active ? 'active' : 'cancelled';
            
            // Get booking count directly from class_bookings using class_id
            const { data: bookingsData, error: bookingsError } = await supabase
              .from('class_bookings')
              .select('id', { count: 'exact' })
              .eq('class_id', classItem.id)
              .eq('status', 'confirmed');

            if (bookingsError) {
              console.error("Error fetching bookings count:", bookingsError);
            }

            // If class is at capacity, mark as full
            const bookingsCount = bookingsData ? bookingsData.length : 0;
            if (bookingsCount && classItem.capacity && bookingsCount >= classItem.capacity) {
              status = 'full';
            }

            return {
              ...classItem,
              instructorName,
              schedulesCount: 0, // No longer using schedules count
              nextSchedule: classItem.start_date ? {
                id: classItem.id,
                date: classItem.start_date,
                time: classItem.start_time || '00:00:00',
                location: classItem.location || 'Main Studio',
              } : undefined,
              status,
            };
          })
        );

        setClasses(classesWithDetails);
        setFilteredClasses(classesWithDetails);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [toast]);

  useEffect(() => {
    // Apply filters and search
    let result = [...classes];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (cls) => 
          cls.name.toLowerCase().includes(query) || 
          cls.description?.toLowerCase().includes(query) || 
          cls.instructorName.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(cls => cls.category === categoryFilter);
    }
    
    // Apply level filter
    if (levelFilter !== "all") {
      result = result.filter(cls => cls.level === levelFilter);
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(cls => cls.status === statusFilter);
    }
    
    setFilteredClasses(result);
  }, [classes, searchQuery, categoryFilter, levelFilter, statusFilter]);

  const handleDeleteClass = async (id: string) => {
    try {
      // First delete all schedules associated with this class
      const { error: schedulesError } = await supabase
        .from('class_schedules')
        .delete()
        .eq('class_id', id);
      
      if (schedulesError) throw schedulesError;
      
      // Then delete the class itself
      const { error: classError } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
        
      if (classError) throw classError;
      
      // Update the UI
      setClasses(classes.filter(cls => cls.id !== id));
      toast({
        title: "Class deleted",
        description: "The class has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting class:", error);
      toast({
        title: "Error",
        description: "Failed to delete the class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setClassToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getUniqueCategories = () => {
    const categories = classes.map(cls => cls.category).filter(Boolean);
    return ["all", ...new Set(categories)];
  };

  const formatNextSchedule = (nextSchedule?: { date: string; time: string }) => {
    if (!nextSchedule) return "No upcoming schedule";
    
    const formattedDate = format(new Date(nextSchedule.date), "MMM d, yyyy");
    return `${formattedDate} at ${nextSchedule.time}`;
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
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "full":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">
            Manage your studio's classes and schedules
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/admin-dashboard/classes/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Class
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>
            View, create, edit, and delete classes for your studio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-1 gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().filter(c => c !== "all").map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Instructor</TableHead>
                      <TableHead className="hidden lg:table-cell">Level</TableHead>
                      <TableHead className="hidden xl:table-cell">Category</TableHead>
                      <TableHead className="hidden lg:table-cell">Next Session</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Loading classes...
                        </TableCell>
                      </TableRow>
                    ) : filteredClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No classes found. Try adjusting your filters or create a new class.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClasses.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell>{cls.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{cls.instructorName}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge className={getLevelBadgeColor(cls.level || 'all')}>
                              {cls.level ? cls.level.charAt(0).toUpperCase() + cls.level.slice(1) : 'All Levels'}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">{cls.category}</TableCell>
                          <TableCell className="hidden lg:table-cell">{formatNextSchedule(cls.nextSchedule)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(cls.status)}>
                              {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin-dashboard/classes/${cls.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Class
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin-dashboard/classes/${cls.id}/schedule`}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedules ({cls.schedulesCount})
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => confirmDelete(cls.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="cards" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-10">
                  <p>Loading classes...</p>
                </div>
              ) : filteredClasses.length === 0 ? (
                <div className="text-center py-10">
                  <p>No classes found. Try adjusting your filters or create a new class.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.map((cls) => (
                    <Card key={cls.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{cls.name}</CardTitle>
                            <CardDescription>{cls.category}</CardDescription>
                          </div>
                          <Badge className={getStatusBadgeColor(cls.status)}>
                            {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{cls.description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Instructor</p>
                            <p className="text-sm text-muted-foreground">{cls.instructorName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Level</p>
                            <p className="text-sm text-muted-foreground">{cls.level ? cls.level.charAt(0).toUpperCase() + cls.level.slice(1) : 'All Levels'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">{cls.duration} minutes</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Capacity</p>
                            <p className="text-sm text-muted-foreground">{cls.capacity} students</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Price</p>
                            <p className="text-sm text-muted-foreground">£{cls.price}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <Badge className={getStatusBadgeColor(cls.status)}>
                              {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Next Schedule</p>
                          <p className="text-sm text-muted-foreground">{formatNextSchedule(cls.nextSchedule)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Total Schedules</p>
                          <p className="text-sm text-muted-foreground">{cls.schedulesCount} {cls.schedulesCount === 1 ? 'session' : 'sessions'}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" asChild>
                          <Link href={`/admin-dashboard/classes/${cls.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" asChild>
                            <Link href={`/admin-dashboard/classes/${cls.id}/schedule`}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedules ({cls.schedulesCount})
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => confirmDelete(cls.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone.
              All schedules associated with this class will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => classToDelete && handleDeleteClass(classToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
