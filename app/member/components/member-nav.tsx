"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  User, 
  Calendar, 
  CreditCard, 
  Settings,
  BookOpen
} from "lucide-react";

interface MemberNavProps {
  className?: string;
}

export function MemberNav({ className }: MemberNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/member/dashboard",
      icon: Home,
    },
    {
      name: "Profile",
      href: "/member/profile",
      icon: User,
    },
    {
      name: "Classes",
      href: "/member/classes",
      icon: Calendar,
    },
    {
      name: "Membership",
      href: "/member/membership",
      icon: CreditCard,
    },
    {
      name: "Settings",
      href: "/member/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
