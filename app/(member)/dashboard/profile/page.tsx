"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Save,
  X,
  BookOpen,
  CreditCard,
  LogOut,
  Menu,
  Bell
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { RoleGuard } from "@/components/auth/role-guard";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  birth_date: string | null;
  address: string | null;
  emergency_contact: string | null;
  bio: string | null;
  created_at: string;
}

interface Booking {
  id: string;
  class_id: string;
  user_id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
  class: {
    id: string;
    name: string;
    description: string | null;
    instructor_id: string;
    instructor: {
      id: string;
      full_name: string;
    };
  };
}

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('member-sidebar');
      const toggleButton = document.getElementById('member-sidebar-toggle');
      
      if (
        sidebar && 
        !sidebar.contains(event.target as Node) && 
        toggleButton && 
        !toggleButton.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: <Calendar className="h-5 w-5" /> },
    { name: "Classes", href: "/dashboard/classes", icon: <BookOpen className="h-5 w-5" /> },
    { name: "My Profile", href: "/dashboard/profile", icon: <User className="h-5 w-5" /> },
    { name: "Membership", href: "/dashboard/membership", icon: <CreditCard className="h-5 w-5" /> },
  ];

  const userInitials = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        setProfile(profileData);
        setFormData(profileData);
        
        // Fetch user's bookings with class details
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('class_bookings')
          .select(`
            *,
            class:class_id (
              id,
              name,
              description,
              instructor_id
            )
          `)
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });
          
        // If we have bookings, fetch the instructor details separately
        if (bookingsData && bookingsData.length > 0) {
          // Get unique instructor IDs
          const instructorIds = [...new Set(
            bookingsData
              .filter(booking => booking.class?.instructor_id)
              .map(booking => booking.class.instructor_id)
          )];
          
          if (instructorIds.length > 0) {
            // Fetch instructor profiles
            const { data: instructorProfiles } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', instructorIds);
              
            // Create a map of instructors
            const instructorMap = new Map();
            instructorProfiles?.forEach(profile => {
              instructorMap.set(profile.id, profile);
            });
            
            // Add instructor details to bookings
            bookingsData.forEach(booking => {
              if (booking.class?.instructor_id) {
                const instructor = instructorMap.get(booking.class.instructor_id);
                if (instructor) {
                  booking.class.instructor = instructor;
                }
              }
            });
          }
        }
        
        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
        } else {
          setBookings(bookingsData || []);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      // Update profile data
      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            upsert: true,
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        // Update profile with avatar URL
        const { error: avatarUpdateError } = await supabase
          .from('profiles')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', user.id);
        
        if (avatarUpdateError) {
          throw avatarUpdateError;
        }
        
        // Update local state
        setFormData(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      }
      
      // Refresh profile data
      const { data: refreshedProfile, error: refreshError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (refreshError) {
        throw refreshError;
      }
      
      setProfile(refreshedProfile);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string, classId: string) => {
    try {
      // Update booking status to cancelled
      const { error: updateError } = await supabase
        .from('class_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (updateError) {
        throw updateError;
      }

      // Get current booking count for this class
      const { count: currentBookingCount, error: countError } = await supabase
        .from('class_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', classId)
        .eq('status', 'confirmed');
        
      if (countError) {
        console.error('Error counting bookings:', countError);
      } else {
        // Update class status if it was full before
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('status, capacity')
          .eq('id', classId)
          .single();
          
        if (!classError && classData && classData.status === 'full') {
          // If class was full and now has space, update status
          if (currentBookingCount && classData.capacity && 
              currentBookingCount < classData.capacity) {
            await supabase
              .from('classes')
              .update({ status: 'active' })
              .eq('id', classId);
          }
        }
      }
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      toast({
        title: "Booking Cancelled",
        description: "Your class booking has been cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <RoleGuard allowedRoles={["user", "instructor", "admin"]}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar for mobile */}
        <div 
          id="member-sidebar"
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
              <Link href="/dashboard" className="flex items-center">
                <img src="/logo.svg" alt="Ekantik Studio" className="h-8 w-auto" />
              </Link>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || (pathname && pathname.startsWith(`${item.href}/`));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-ekantik-50 text-ekantik-600 dark:bg-gray-700 dark:text-ekantik-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className={`mr-3 ${isActive ? 'text-ekantik-500 dark:text-ekantik-400' : ''}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="p-4 border-t dark:border-gray-700">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <button
                    id="member-sidebar-toggle"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-80 overflow-y-auto">
                        <div className="p-3 text-sm">
                          <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar>
                          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Profile" />
                    ) : (
                      <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                    )}
                    <AvatarFallback>
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <div className="flex flex-col items-center">
                      <Label htmlFor="avatar" className="cursor-pointer text-sm text-primary">
                        Change Photo
                      </Label>
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      {isEditing ? (
                        <Input 
                          id="full_name" 
                          name="full_name" 
                          value={formData.full_name || ''} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center p-2 border rounded-md">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{profile?.full_name || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center p-2 border rounded-md">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{profile?.email || user?.email || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone || ''} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center p-2 border rounded-md">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{profile?.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birth_date">Date of Birth</Label>
                      {isEditing ? (
                        <Input 
                          id="birth_date" 
                          name="birth_date" 
                          type="date" 
                          value={formData.birth_date || ''} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center p-2 border rounded-md">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {profile?.birth_date 
                              ? format(new Date(profile.birth_date), 'PPP') 
                              : 'Not provided'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Textarea 
                        id="address" 
                        name="address" 
                        value={formData.address || ''} 
                        onChange={handleInputChange}
                        rows={2}
                      />
                    ) : (
                      <div className="p-2 border rounded-md">
                        <p>{profile?.address || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    {isEditing ? (
                      <Input 
                        id="emergency_contact" 
                        name="emergency_contact" 
                        value={formData.emergency_contact || ''} 
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md">
                        <p>{profile?.emergency_contact || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">About Me</Label>
                    {isEditing ? (
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={formData.bio || ''} 
                        onChange={handleInputChange}
                        rows={3}
                      />
                    ) : (
                      <div className="p-2 border rounded-md">
                        <p>{profile?.bio || 'No bio provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Class Bookings</CardTitle>
              <CardDescription>
                View and manage your upcoming and past class bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't booked any classes yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push('/dashboard/classes')}
                  >
                    Browse Classes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className={`p-1 ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-500' 
                          : booking.status === 'cancelled' 
                            ? 'bg-red-500' 
                            : 'bg-yellow-500'
                      }`}></div>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{booking.class?.name || 'Unknown Class'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.class?.description?.substring(0, 100)}
                              {booking.class?.description && booking.class.description.length > 100 ? '...' : ''}
                            </p>
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>
                                {booking.booking_date 
                                  ? format(new Date(booking.booking_date), 'PPP') 
                                  : 'Date not specified'}
                              </span>
                              <span className="mx-2">•</span>
                              <span>
                                {booking.booking_time 
                                  ? format(new Date(`2000-01-01T${booking.booking_time}`), 'p') 
                                  : 'Time not specified'}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <User className="mr-2 h-4 w-4" />
                              <span>
                                {booking.class?.instructor?.full_name || 'Unknown Instructor'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                            <Badge variant={
                              booking.status === 'confirmed' 
                                ? 'default' 
                                : booking.status === 'cancelled' 
                                  ? 'destructive' 
                                  : 'outline'
                            }>
                              {booking.status === 'confirmed' ? 'Confirmed' : 
                               booking.status === 'cancelled' ? 'Cancelled' : 
                               booking.status}
                            </Badge>
                            
                            {booking.status === 'confirmed' && (
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="mt-4"
                                onClick={() => handleCancelBooking(booking.id, booking.class_id)}
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
