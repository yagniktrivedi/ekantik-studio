"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  CreditCard,
  Calendar,
  Clock,
  Tag,
  Download,
  Filter
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";

// Mock data for members
interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership_type: "monthly" | "annual" | "class-pack" | "none";
  membership_status: "active" | "expired" | "pending" | "cancelled";
  membership_start_date?: string;
  membership_end_date?: string;
  classes_remaining?: number;
  total_classes_attended: number;
  total_bookings: number;
  total_spent: number;
  image?: string;
  joined_date: string;
  notes?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Emma Thompson",
    email: "emma@example.com",
    phone: "+1 (555) 123-4567",
    membership_type: "monthly",
    membership_status: "active",
    membership_start_date: "2025-04-01T00:00:00Z",
    membership_end_date: "2025-05-01T00:00:00Z",
    total_classes_attended: 24,
    total_bookings: 28,
    total_spent: 349.97,
    joined_date: "2024-10-15T00:00:00Z",
    notes: "Prefers evening classes. Interested in aerial yoga.",
    emergency_contact: {
      name: "John Thompson",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse"
    }
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 (555) 234-5678",
    membership_type: "annual",
    membership_status: "active",
    membership_start_date: "2025-01-15T00:00:00Z",
    membership_end_date: "2026-01-15T00:00:00Z",
    total_classes_attended: 45,
    total_bookings: 50,
    total_spent: 899.99,
    joined_date: "2024-01-15T00:00:00Z",
    notes: "Attends morning classes regularly. Interested in meditation workshops."
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    email: "sophia@example.com",
    phone: "+1 (555) 345-6789",
    membership_type: "class-pack",
    membership_status: "active",
    classes_remaining: 6,
    total_classes_attended: 14,
    total_bookings: 20,
    total_spent: 240.00,
    joined_date: "2025-02-20T00:00:00Z"
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 (555) 456-7890",
    membership_type: "monthly",
    membership_status: "expired",
    membership_start_date: "2025-03-01T00:00:00Z",
    membership_end_date: "2025-04-01T00:00:00Z",
    total_classes_attended: 8,
    total_bookings: 10,
    total_spent: 129.99,
    joined_date: "2025-03-01T00:00:00Z"
  },
  {
    id: "5",
    name: "Olivia Johnson",
    email: "olivia@example.com",
    phone: "+1 (555) 567-8901",
    membership_type: "none",
    membership_status: "cancelled",
    total_classes_attended: 3,
    total_bookings: 3,
    total_spent: 60.00,
    joined_date: "2025-01-05T00:00:00Z",
    notes: "Attended a few drop-in classes. Expressed interest in monthly membership."
  },
  {
    id: "6",
    name: "Ethan Davis",
    email: "ethan@example.com",
    phone: "+1 (555) 678-9012",
    membership_type: "class-pack",
    membership_status: "active",
    classes_remaining: 3,
    total_classes_attended: 7,
    total_bookings: 10,
    total_spent: 150.00,
    joined_date: "2025-03-10T00:00:00Z"
  },
  {
    id: "7",
    name: "Ava Martinez",
    email: "ava@example.com",
    phone: "+1 (555) 789-0123",
    membership_type: "annual",
    membership_status: "active",
    membership_start_date: "2024-12-01T00:00:00Z",
    membership_end_date: "2025-12-01T00:00:00Z",
    total_classes_attended: 32,
    total_bookings: 35,
    total_spent: 899.99,
    joined_date: "2024-12-01T00:00:00Z",
    emergency_contact: {
      name: "Carlos Martinez",
      phone: "+1 (555) 234-5678",
      relationship: "Father"
    }
  },
  {
    id: "8",
    name: "Noah Taylor",
    email: "noah@example.com",
    phone: "+1 (555) 890-1234",
    membership_type: "monthly",
    membership_status: "pending",
    total_classes_attended: 0,
    total_bookings: 0,
    total_spent: 89.99,
    joined_date: "2025-04-28T00:00:00Z",
    notes: "New member. First class scheduled for May 2."
  },
  {
    id: "9",
    name: "Isabella Brown",
    email: "isabella@example.com",
    phone: "+1 (555) 901-2345",
    membership_type: "class-pack",
    membership_status: "expired",
    classes_remaining: 0,
    total_classes_attended: 10,
    total_bookings: 10,
    total_spent: 150.00,
    joined_date: "2025-01-20T00:00:00Z"
  },
  {
    id: "10",
    name: "William Lee",
    email: "william@example.com",
    phone: "+1 (555) 012-3456",
    membership_type: "monthly",
    membership_status: "active",
    membership_start_date: "2025-04-15T00:00:00Z",
    membership_end_date: "2025-05-15T00:00:00Z",
    total_classes_attended: 5,
    total_bookings: 8,
    total_spent: 129.99,
    joined_date: "2025-04-15T00:00:00Z"
  }
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [membershipTypeFilter, setMembershipTypeFilter] = useState("all");
  const [membershipStatusFilter, setMembershipStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch data from Supabase here
        // For now, we'll use the mock data with a slight delay to simulate loading
        setTimeout(() => {
          setMembers(mockMembers);
          setFilteredMembers(mockMembers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching members:", error);
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...members];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (member) => 
          member.name.toLowerCase().includes(query) || 
          member.email.toLowerCase().includes(query) || 
          member.phone.includes(query)
      );
    }
    
    // Apply membership type filter
    if (membershipTypeFilter !== "all") {
      result = result.filter(member => member.membership_type === membershipTypeFilter);
    }
    
    // Apply membership status filter
    if (membershipStatusFilter !== "all") {
      result = result.filter(member => member.membership_status === membershipStatusFilter);
    }
    
    setFilteredMembers(result);
  }, [members, searchQuery, membershipTypeFilter, membershipStatusFilter]);

  const handleDeleteMember = async (id: string) => {
    try {
      // In a real implementation, we would delete from Supabase here
      // For now, we'll just update the UI
      setMembers(members.filter(member => member.id !== id));
      toast({
        title: "Member deleted",
        description: "The member has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: "Failed to delete the member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setMemberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getMembershipStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getMembershipTypeBadgeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "annual":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "class-pack":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "none":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
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

  const getMembershipTypeLabel = (type: string) => {
    switch (type) {
      case "monthly":
        return "Monthly Membership";
      case "annual":
        return "Annual Membership";
      case "class-pack":
        return "Class Pack";
      case "none":
        return "No Membership";
      default:
        return type;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage your studio's members and their memberships
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin-dashboard/members/import">
              <Download className="mr-2 h-4 w-4" />
              Import
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin-dashboard/members/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Member
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Members</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                View, create, edit, and delete member profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-1 gap-4">
                  <Select value={membershipTypeFilter} onValueChange={setMembershipTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Membership Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="class-pack">Class Pack</SelectItem>
                      <SelectItem value="none">No Membership</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={membershipStatusFilter} onValueChange={setMembershipStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
                        <TableHead>Member</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expiry / Remaining</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No members found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={member.image} alt={member.name} />
                                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                                    {member.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getMembershipTypeBadgeColor(member.membership_type)}`}>
                                {getMembershipTypeLabel(member.membership_type)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getMembershipStatusBadgeColor(member.membership_status)}`}>
                                {member.membership_status.charAt(0).toUpperCase() + member.membership_status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {member.membership_type === "class-pack" ? (
                                <span>{member.classes_remaining} classes</span>
                              ) : member.membership_end_date ? (
                                <span>{formatDate(member.membership_end_date)}</span>
                              ) : (
                                <span>N/A</span>
                              )}
                            </TableCell>
                            <TableCell>{member.total_classes_attended}</TableCell>
                            <TableCell>{formatDate(member.joined_date)}</TableCell>
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
                                    <Link href={`/dashboard/members/${member.id}`}>
                                      <CreditCard className="mr-2 h-4 w-4" />
                                      View Profile
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/members/${member.id}/bookings`}>
                                      <Calendar className="mr-2 h-4 w-4" />
                                      View Bookings
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/members/${member.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => confirmDelete(member.id)}
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
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </CardFooter>
          </Card>

          {/* Member Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {members.filter(m => m.membership_status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {members.filter(m => {
                    const joinedDate = new Date(m.joined_date);
                    const now = new Date();
                    return joinedDate.getMonth() === now.getMonth() && 
                           joinedDate.getFullYear() === now.getFullYear();
                  }).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {members.filter(m => {
                    if (!m.membership_end_date) return false;
                    const endDate = new Date(m.membership_end_date);
                    const now = new Date();
                    const diffTime = endDate.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays > 0 && diffDays <= 7;
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
              <CardDescription>
                Members with active memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Active members table would go here - similar to the main table but filtered */}
              <p className="text-center py-6 text-muted-foreground">
                This tab would display only active members
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Memberships</CardTitle>
              <CardDescription>
                Members with expired memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Expired members table would go here */}
              <p className="text-center py-6 text-muted-foreground">
                This tab would display only members with expired memberships
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Members</CardTitle>
              <CardDescription>
                Members with pending memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pending members table would go here */}
              <p className="text-center py-6 text-muted-foreground">
                This tab would display only members with pending memberships
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be undone.
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
              onClick={() => memberToDelete && handleDeleteMember(memberToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
