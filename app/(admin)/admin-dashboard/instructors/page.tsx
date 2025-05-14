"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink
} from "lucide-react";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";

// Mock data for instructors
interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  image: string;
  status: "active" | "inactive" | "on leave";
  social_media: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
  classes_count: number;
  joined_date: string;
}

const mockInstructors: Instructor[] = [
  {
    id: "1",
    name: "Maya Johnson",
    email: "maya@ekantikstudio.com",
    phone: "+1 (555) 123-4567",
    bio: "Maya is a certified yoga instructor with over 10 years of experience. She specializes in Vinyasa Flow and Prenatal Yoga.",
    specialties: ["Vinyasa Flow", "Prenatal Yoga", "Meditation"],
    certifications: ["RYT-500", "Prenatal Yoga Certification", "Mindfulness Meditation"],
    image: "/instructors/maya-johnson.jpg",
    status: "active",
    social_media: {
      instagram: "@maya_yoga",
      facebook: "mayajohnsonyoga",
      website: "https://mayajohnson.com"
    },
    classes_count: 8,
    joined_date: "2020-03-15T00:00:00Z"
  },
  {
    id: "2",
    name: "David Singh",
    email: "david@ekantikstudio.com",
    phone: "+1 (555) 234-5678",
    bio: "David is passionate about making yoga accessible to everyone. He teaches Gentle Yoga and Meditation classes.",
    specialties: ["Hatha Yoga", "Meditation", "Yoga for Seniors"],
    certifications: ["RYT-200", "Meditation Teacher Training", "Yoga for Aging"],
    image: "/instructors/david-singh.jpg",
    status: "active",
    social_media: {
      instagram: "@david_yoga",
      facebook: "davidsinghyoga",
      twitter: "@davidyoga"
    },
    classes_count: 6,
    joined_date: "2021-01-10T00:00:00Z"
  },
  {
    id: "3",
    name: "Alex Williams",
    email: "alex@ekantikstudio.com",
    phone: "+1 (555) 345-6789",
    bio: "Alex is a former athlete who brings strength and dynamism to his Power Yoga and Ashtanga classes.",
    specialties: ["Power Yoga", "Ashtanga", "Yoga for Athletes"],
    certifications: ["RYT-500", "Ashtanga Certification", "Sports Yoga Specialist"],
    image: "/instructors/alex-williams.jpg",
    status: "active",
    social_media: {
      instagram: "@alex_power_yoga",
      website: "https://alexwilliamsyoga.com"
    },
    classes_count: 5,
    joined_date: "2021-06-20T00:00:00Z"
  },
  {
    id: "4",
    name: "Sophia Rodriguez",
    email: "sophia@ekantikstudio.com",
    phone: "+1 (555) 456-7890",
    bio: "Sophia specializes in Yin Yoga and Yoga Nidra, focusing on deep relaxation and stress relief.",
    specialties: ["Yin Yoga", "Yoga Nidra", "Restorative Yoga"],
    certifications: ["RYT-300", "Yin Yoga Certification", "Yoga Nidra Training"],
    image: "/instructors/sophia-rodriguez.jpg",
    status: "active",
    social_media: {
      instagram: "@sophia_yin_yoga",
      facebook: "sophiarodriguezyoga"
    },
    classes_count: 7,
    joined_date: "2022-02-05T00:00:00Z"
  },
  {
    id: "5",
    name: "Leila Patel",
    email: "leila@ekantikstudio.com",
    phone: "+1 (555) 567-8901",
    bio: "Leila is our aerial yoga specialist, bringing creativity and playfulness to her classes.",
    specialties: ["Aerial Yoga", "Kids Yoga", "Acro Yoga"],
    certifications: ["RYT-200", "Aerial Yoga Certification", "Kids Yoga Training"],
    image: "/instructors/leila-patel.jpg",
    status: "on leave",
    social_media: {
      instagram: "@leila_aerial",
      facebook: "leilapatelyoga",
      twitter: "@leilayoga"
    },
    classes_count: 4,
    joined_date: "2022-09-15T00:00:00Z"
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james@ekantikstudio.com",
    phone: "+1 (555) 678-9012",
    bio: "James focuses on alignment and proper technique in his Iyengar-inspired classes.",
    specialties: ["Iyengar Yoga", "Alignment", "Yoga Therapy"],
    certifications: ["RYT-500", "Iyengar Yoga Certification", "Yoga Therapy Training"],
    image: "/instructors/james-wilson.jpg",
    status: "inactive",
    social_media: {
      website: "https://jameswilsonyoga.com"
    },
    classes_count: 0,
    joined_date: "2023-01-10T00:00:00Z"
  }
];

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch data from Supabase here
        // For now, we'll use the mock data with a slight delay to simulate loading
        setTimeout(() => {
          setInstructors(mockInstructors);
          setFilteredInstructors(mockInstructors);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setIsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...instructors];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (instructor) => 
          instructor.name.toLowerCase().includes(query) || 
          instructor.email.toLowerCase().includes(query) || 
          instructor.bio.toLowerCase().includes(query) ||
          instructor.specialties.some(s => s.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(instructor => instructor.status === statusFilter);
    }
    
    // Apply specialty filter
    if (specialtyFilter !== "all") {
      result = result.filter(instructor => 
        instructor.specialties.includes(specialtyFilter)
      );
    }
    
    setFilteredInstructors(result);
  }, [instructors, searchQuery, statusFilter, specialtyFilter]);

  const handleDeleteInstructor = async (id: string) => {
    try {
      // In a real implementation, we would delete from Supabase here
      // For now, we'll just update the UI
      setInstructors(instructors.filter(instructor => instructor.id !== id));
      toast({
        title: "Instructor deleted",
        description: "The instructor has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting instructor:", error);
      toast({
        title: "Error",
        description: "Failed to delete the instructor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setInstructorToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setInstructorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getAllSpecialties = () => {
    const specialties = instructors.flatMap(instructor => instructor.specialties);
    //@ts-ignore
    return ["all", ...new Set(specialties)];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "on leave":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Instructors</h1>
          <p className="text-muted-foreground">
            Manage your studio's instructors and their profiles
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/admin-dashboard/instructors/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Instructor
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Instructor Management</CardTitle>
          <CardDescription>
            View, create, edit, and delete instructor profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-1 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {getAllSpecialties().filter(s => s !== "all").map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ekantik-600"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Specialties</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstructors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No instructors found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInstructors.map((instructor) => (
                      <TableRow key={instructor.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={instructor.image} alt={instructor.name} />
                              <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{instructor.name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                                {instructor.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="truncate max-w-[120px]">{instructor.email}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{instructor.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {instructor.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {instructor.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{instructor.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{instructor.classes_count}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeColor(instructor.status)}`}>
                            {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(instructor.joined_date)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/instructors/${instructor.id}`}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/instructors/${instructor.id}/classes`}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  View Classes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/instructors/${instructor.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => confirmDelete(instructor.id)}
                                className="text-red-600 focus:text-red-600"
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
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredInstructors.length} of {instructors.length} instructors
          </div>
        </CardFooter>
      </Card>

      {/* Instructor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredInstructors.slice(0, 3).map((instructor) => (
          <Card key={instructor.id} className="overflow-hidden">
            <div className="relative h-40 bg-gradient-to-r from-ekantik-100 to-ekantik-200">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800">
                  <AvatarImage src={instructor.image} alt={instructor.name} />
                  <AvatarFallback className="text-xl">{getInitials(instructor.name)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <CardContent className="pt-12 pb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{instructor.name}</h3>
                <p className="text-sm text-muted-foreground">{instructor.specialties.join(" • ")}</p>
              </div>
              <p className="text-sm text-center line-clamp-3 mb-4">{instructor.bio}</p>
              <div className="flex justify-center space-x-2 mb-4">
                {instructor.social_media.instagram && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://instagram.com/${instructor.social_media.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {instructor.social_media.facebook && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://facebook.com/${instructor.social_media.facebook}`} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {instructor.social_media.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://twitter.com/${instructor.social_media.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {instructor.social_media.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={instructor.social_media.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/instructors/${instructor.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/instructors/${instructor.id}/edit`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this instructor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => instructorToDelete && handleDeleteInstructor(instructorToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
