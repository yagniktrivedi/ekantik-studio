"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for dashboard stats
const mockStats = {
  totalBookings: 128,
  totalMembers: 342,
  totalRevenue: 15840,
  activeClasses: 24,
  recentBookings: [
    { id: 1, name: "Aisha Patel", class: "Vinyasa Flow", date: "2025-05-01T10:00:00", status: "confirmed" },
    { id: 2, name: "James Wilson", class: "Meditation", date: "2025-05-01T14:00:00", status: "confirmed" },
    { id: 3, name: "Emma Thompson", class: "Aerial Yoga", date: "2025-05-02T09:00:00", status: "pending" },
    { id: 4, name: "Michael Chen", class: "Power Yoga", date: "2025-05-02T18:00:00", status: "confirmed" },
    { id: 5, name: "Sophia Rodriguez", class: "Yin Yoga", date: "2025-05-03T16:00:00", status: "confirmed" },
  ],
  upcomingClasses: [
    { id: 1, name: "Vinyasa Flow", instructor: "Maya Johnson", time: "Today, 10:00 AM", attendees: 12, capacity: 15 },
    { id: 2, name: "Meditation", instructor: "David Singh", time: "Today, 2:00 PM", attendees: 8, capacity: 20 },
    { id: 3, name: "Aerial Yoga", instructor: "Leila Patel", time: "Tomorrow, 9:00 AM", attendees: 6, capacity: 8 },
    { id: 4, name: "Power Yoga", instructor: "Alex Williams", time: "Tomorrow, 6:00 PM", attendees: 14, capacity: 15 },
  ],
  recentSales: [
    { id: 1, product: "Monthly Membership", customer: "Emma Thompson", amount: 89.99, date: "2025-05-01T09:23:00" },
    { id: 2, product: "Yoga Mat - Premium", customer: "James Wilson", amount: 45.00, date: "2025-05-01T11:45:00" },
    { id: 3, product: "10-Class Pack", customer: "Sophia Rodriguez", amount: 120.00, date: "2025-05-01T14:12:00" },
    { id: 4, product: "Meditation Cushion", customer: "Michael Chen", amount: 35.50, date: "2025-05-01T16:30:00" },
  ]
};

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch data from Supabase here
        // For now, we'll use the mock data with a slight delay to simulate loading
        setTimeout(() => {
          setStats(mockStats);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin-dashboard/reports">View Reports</Link>
          </Button>
          <Button asChild>
            <Link href="/admin-dashboard/classes/new">Create Class</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span>+2.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span>+12.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span>+8.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
              <span>-1 from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest class and event bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {stats.recentBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center justify-between p-4 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{booking.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.class}</p>
                      </div>
                      <div className="flex items-center">
                        <span 
                          className={`px-2 py-1 rounded text-xs mr-2 ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <p className="text-xs text-muted-foreground">{formatDate(booking.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/admin-dashboard/bookings">
                    View all bookings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>
                  Classes scheduled for today and tomorrow
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {stats.upcomingClasses.map((cls) => (
                    <div 
                      key={cls.id} 
                      className="flex items-center justify-between p-4 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{cls.time}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.attendees}/{cls.capacity} attendees
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/admin-dashboard/classes">
                    View all classes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Latest purchases from the store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {stats.recentSales.map((sale) => (
                  <div 
                    key={sale.id} 
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{sale.product}</p>
                      <p className="text-sm text-muted-foreground">{sale.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(sale.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(sale.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/admin-dashboard/store">
                  View all sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                Manage class and event bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">
                Detailed booking management will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Track revenue and product sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">
                Detailed sales analytics will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>
                Manage your studio's classes and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-6 text-muted-foreground">
                Detailed class management will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
