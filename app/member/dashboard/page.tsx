"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  Users, 
  CreditCard, 
  Bell, 
  BookOpen,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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

// Mock data for upcoming classes
const upcomingClasses = [
  {
    id: "1",
    name: "Vinyasa Flow",
    instructor: "Maya Johnson",
    date: "2025-05-03T10:00:00Z",
    duration: 60,
  },
  {
    id: "2",
    name: "Gentle Yoga",
    instructor: "David Singh",
    date: "2025-05-05T09:00:00Z",
    duration: 45,
  },
  {
    id: "3",
    name: "Meditation",
    instructor: "David Singh",
    date: "2025-05-07T07:00:00Z",
    duration: 30,
  }
];

// Mock data for membership
const membershipData = {
  type: "Monthly Unlimited",
  status: "active",
  startDate: "2025-04-01",
  endDate: "2025-05-01",
  classesRemaining: null,
  autoRenew: true
};

export default function MemberDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;
      
      try {
        // First check if profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          // If profile doesn't exist, create one
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: user.id,
                  email: user.email,
                  full_name: user.user_metadata?.full_name || '',
                  avatar_url: user.user_metadata?.avatar_url || null
                }
              ])
              .select()
              .single();
              
            if (createError) throw createError;
            setUserProfile(newProfile);
          } else {
            throw error;
          }
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "Could not load your profile. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [user]);

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
    { name: "Dashboard", href: "/member/dashboard", icon: <Calendar className="h-5 w-5" /> },
    { name: "My Classes", href: "/member/classes", icon: <BookOpen className="h-5 w-5" /> },
    { name: "My Profile", href: "/member/profile", icon: <User className="h-5 w-5" /> },
    { name: "Membership", href: "/member/membership", icon: <CreditCard className="h-5 w-5" /> },
  ];

  const userInitials = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

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
              <Link href="/member/dashboard" className="flex items-center">
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
                  const isActive = window.location.pathname === item.href || window.location.pathname.startsWith(`${item.href}/`);
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
                          <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "User"} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/member/profile">
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

          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-ekantik-600 to-ekantik-800 rounded-lg shadow-lg mb-8 overflow-hidden">
                <div className="px-6 py-8 md:px-10 md:py-12">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Welcome to Ekantik Studio, {user?.user_metadata?.full_name || 'Member'}!
                  </h1>
                  <p className="text-ekantik-100 text-lg max-w-3xl">
                    Your journey to wellness begins here. Explore classes, manage your membership, 
                    and track your progress all in one place.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Membership Card */}
                <Card className="md:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Your Membership</CardTitle>
                    <CardDescription>Current plan details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Plan</span>
                        <span className="font-medium">{membershipData.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {membershipData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Renewal</span>
                        <span className="font-medium">{membershipData.endDate}</span>
                      </div>
                      {membershipData.classesRemaining !== null && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Classes Left</span>
                          <span className="font-medium">{membershipData.classesRemaining}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Membership
                    </Button>
                  </CardFooter>
                </Card>

                {/* Upcoming Classes */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Upcoming Classes</CardTitle>
                    <CardDescription>Your next scheduled sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingClasses.length > 0 ? (
                        upcomingClasses.map((cls) => (
                          <div key={cls.id} className="flex items-start space-x-4 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                            <div className="bg-ekantik-100 dark:bg-ekantik-900/30 p-2 rounded-md">
                              <Calendar className="h-5 w-5 text-ekantik-600 dark:text-ekantik-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{cls.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {cls.instructor} • {new Date(cls.date).toLocaleDateString()} • {new Date(cls.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{cls.duration} min</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500 dark:text-gray-400">No upcoming classes</p>
                          <Button variant="link" className="mt-2">
                            Browse classes
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Book a New Class
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Wellness Journey */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Wellness Journey</CardTitle>
                  <CardDescription>Track your progress and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="bg-ekantik-100 dark:bg-ekantik-900/30 p-3 rounded-full mb-3">
                        <Calendar className="h-6 w-6 text-ekantik-600 dark:text-ekantik-400" />
                      </div>
                      <h3 className="text-xl font-bold">12</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Classes Attended</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="bg-ekantik-100 dark:bg-ekantik-900/30 p-3 rounded-full mb-3">
                        <Clock className="h-6 w-6 text-ekantik-600 dark:text-ekantik-400" />
                      </div>
                      <h3 className="text-xl font-bold">8.5</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hours Practiced</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="bg-ekantik-100 dark:bg-ekantik-900/30 p-3 rounded-full mb-3">
                        <BookOpen className="h-6 w-6 text-ekantik-600 dark:text-ekantik-400" />
                      </div>
                      <h3 className="text-xl font-bold">3</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Class Types Tried</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
