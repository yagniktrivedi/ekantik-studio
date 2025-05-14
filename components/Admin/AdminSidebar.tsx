"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import EkantikLogo from "@/components/ui/logo";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  Users,
  Book,
  ShoppingBag,
  FileText,
  Image,
  Calendar,
  Instagram,
  BarChart,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  Grid3X3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    // Update active section based on pathname
    const path = pathname.split("/").filter(Boolean);
    if (path.length > 1 && path[0] === "admin") {
      setActiveSection(path[1]);
    } else if (path.length === 1 && path[0] === "admin") {
      setActiveSection("dashboard");
    }
  }, [pathname]);

  const menuItems = [
    {
      label: "Main",
      items: [
        {
          title: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          title: "Management Hub",
          path: "/admin/management",
          icon: Grid3X3,
          badge: null,
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          title: "Classes",
          path: "/admin/classes",
          icon: CalendarDays,
          badge: { text: "15", variant: "default" },
        },
        {
          title: "Instructors",
          path: "/admin/instructors",
          icon: User,
          badge: { text: "4", variant: "default" },
        },
        {
          title: "Bookings",
          path: "/admin/bookings",
          icon: Book,
          badge: { text: "New", variant: "success" },
        },
        {
          title: "Store",
          path: "/admin/store",
          icon: ShoppingBag,
          badge: { text: "3", variant: "warning" },
        },
        {
          title: "Blog",
          path: "/admin/blog",
          icon: FileText,
          badge: null,
        },
        {
          title: "Gallery",
          path: "/admin/gallery",
          icon: Image,
          badge: null,
        },
        {
          title: "Events",
          path: "/admin/events",
          icon: Calendar,
          badge: null,
        },
        {
          title: "Social Media",
          path: "/admin/social",
          icon: Instagram,
          badge: null,
        },
        {
          title: "Users",
          path: "/admin/users",
          icon: Users,
          badge: null,
        },
      ],
    },
    {
      label: "Analysis",
      items: [
        {
          title: "Reports",
          path: "/admin/reports",
          icon: BarChart,
          badge: null,
        },
        {
          title: "Notifications",
          path: "/admin/notifications",
          icon: Bell,
          badge: { text: "3", variant: "danger" },
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          title: "Settings",
          path: "/admin/settings",
          icon: Settings,
          badge: null,
        },
        {
          title: "Help & Support",
          path: "/admin/help",
          icon: HelpCircle,
          badge: null,
        },
      ],
    },
  ];

  const getBadgeVariant = (variant: string) => {
    switch(variant) {
      case "success": return "bg-green-500 hover:bg-green-600";
      case "warning": return "bg-yellow-500 hover:bg-yellow-600";
      case "danger": return "bg-red-500 hover:bg-red-600";
      default: return "bg-ekantik-500 hover:bg-ekantik-600";
    }
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center px-3 py-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ekantik-100 animate-pulse">
            <EkantikLogo size={24} />
          </div>
          <div className="ml-2">
            <span className="text-lg font-semibold text-sidebar-foreground">
              Ekantik Admin
            </span>
            <p className="text-xs text-sidebar-foreground/70">Studio Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group, index) => (
          <SidebarGroup key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      href={item.path}
                      className={isActive(item.path) ? "data-active=true" : ""}
                    >
                      <item.icon className="shrink-0" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge className={cn("ml-auto text-xs", getBadgeVariant(item.badge.variant))}>
                          {item.badge.text}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <Link 
            href="/logout"
            className="flex items-center justify-center gap-2 w-full p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
