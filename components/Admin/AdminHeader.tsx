"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bell, User, ChevronDown, Search, Settings, 
  LogOut, MessageSquare, CheckSquare, AlertCircle
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AdminHeader = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Low inventory alert",
      message: "Yoga mats are running low (3 remaining)",
      time: "5 min ago",
      read: false
    },
    {
      id: 2,
      type: "message",
      title: "New message from customer",
      message: "Question about Vinyasa Flow class time",
      time: "30 min ago",
      read: false
    },
    {
      id: 3,
      type: "success",
      title: "New booking confirmed",
      message: "John Smith booked Hatha Yoga for tomorrow",
      time: "1 hour ago",
      read: false
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setNotificationCount(Math.max(0, notificationCount - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setNotificationCount(0);
  };

  return (
    <header className="h-16 border-b px-6 flex items-center justify-between bg-white">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-gray-800">Ekantik Admin</h1>
      </div>
      
      <div className="hidden md:flex relative max-w-md flex-1 mx-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search..." 
          className="pl-10 bg-gray-50 border-gray-200"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative animate-fade-in">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Notifications</h3>
              {notificationCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs h-auto py-1"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-[300px] overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No new notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors",
                      !notification.read && "bg-purple-50/50"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {notification.type === "alert" && (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        {notification.type === "message" && (
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                        )}
                        {notification.type === "success" && (
                          <CheckSquare className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" className="text-sm w-full justify-center" asChild>
                <Link href="/admin/notifications">View all notifications</Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-ekantik-500 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline">Admin User</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="w-10 h-10 rounded-full bg-ekantik-500 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Admin User</span>
                <span className="text-xs text-gray-500">admin@ekantik.com</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-red-500">
              <Link href="/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
