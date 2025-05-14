"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Database } from "@/lib/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AppRole[];
  fallbackPath?: string;
}

/**
 * A component that restricts access to children based on user role
 * 
 * @param children - The content to render if the user has the required role
 * @param allowedRoles - Array of roles that are allowed to access the content
 * @param fallbackPath - Where to redirect if the user doesn't have the required role
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = "/unauthorized",
}) => {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is loaded
    if (isLoading) return;

    // If no user, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // If user doesn't have an allowed role, redirect to fallback
    if (!role || !allowedRoles.includes(role)) {
      router.push(fallbackPath);
    }
  }, [user, role, isLoading, router, allowedRoles, fallbackPath]);

  // Show nothing while loading or if user doesn't have permission
  if (isLoading || !user || !role || !allowedRoles.includes(role)) {
    return null;
  }

  // User has permission, render children
  return <>{children}</>;
};
