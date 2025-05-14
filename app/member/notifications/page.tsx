"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  MessageCircle, 
  Tag, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Trash2
} from "lucide-react";

// Mock notification data
const mockNotifications = [
  {
    id: "notif_1",
    type: "class_reminder",
    title: "Upcoming Class: Vinyasa Flow",
    message: "Your class starts tomorrow at 10:00 AM with Maya Johnson.",
    date: "2025-05-01T10:00:00Z",
    read: false
  },
  {
    id: "notif_2",
    type: "promotion",
    title: "Summer Special Offer",
    message: "Get 20% off on our Summer Wellness Package. Limited time offer!",
    date: "2025-04-29T14:30:00Z",
    read: true
  },
  {
    id: "notif_3",
    type: "system",
    title: "Membership Renewal",
    message: "Your membership will renew automatically in 7 days.",
    date: "2025-04-28T09:15:00Z",
    read: false
  },
  {
    id: "notif_4",
    type: "class_change",
    title: "Class Schedule Change",
    message: "Your Meditation class on May 5th has been rescheduled to 6:00 PM.",
    date: "2025-04-27T16:45:00Z",
    read: true
  },
  {
    id: "notif_5",
    type: "message",
    title: "New Message from Admin",
    message: "We've updated our studio policies. Please review the changes.",
    date: "2025-04-25T11:20:00Z",
    read: true
  },
  {
    id: "notif_6",
    type: "class_reminder",
    title: "Upcoming Class: Gentle Yoga",
    message: "Your class starts tomorrow at 9:00 AM with David Singh.",
    date: "2025-04-24T09:00:00Z",
    read: true
  },
  {
    id: "notif_7",
    type: "system",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    date: "2025-04-22T15:10:00Z",
    read: true
  }
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // In a real app, you would fetch notifications from Supabase
    // For now, we'll use the mock data
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications;
    } else if (activeTab === "unread") {
      return notifications.filter(notif => !notif.read);
    } else {
      return notifications.filter(notif => notif.type === activeTab);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "class_reminder":
      case "class_change":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "promotion":
        return <Tag className="h-5 w-5 text-purple-500" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "message":
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <RoleGuard allowedRoles={["user", "instructor", "admin"]}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Stay updated with your classes, membership, and studio news
            </p>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
            <Button variant="outline" onClick={clearAllNotifications}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ekantik-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full md:w-auto md:inline-flex">
                <TabsTrigger value="all" className="relative">
                  All
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-ekantik-500 hover:bg-ekantik-600">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="class_reminder">Classes</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="promotion">Offers</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {getFilteredNotifications().length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bell className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {activeTab === "all" 
                        ? "You don't have any notifications yet." 
                        : activeTab === "unread" 
                          ? "You've read all your notifications." 
                          : `You don't have any ${activeTab.replace('_', ' ')} notifications.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredNotifications().map((notification) => (
                      <Card 
                        key={notification.id} 
                        className={`transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{notification.title}</h3>
                                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDate(notification.date)}
                                  </div>
                                  {!notification.read && (
                                    <Badge className="mt-2 bg-blue-500 hover:bg-blue-600">New</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end mt-4 space-x-2">
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as Read
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  Delete
                                </Button>
                                {notification.type === "class_reminder" && (
                                  <Button size="sm">
                                    View Class
                                  </Button>
                                )}
                                {notification.type === "promotion" && (
                                  <Button size="sm">
                                    View Offer
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
