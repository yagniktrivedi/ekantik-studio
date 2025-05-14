"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "instructor" | "user")[];
};

export default function ProtectedRoute({
  children,
  allowedRoles = ["admin", "instructor"],
}: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Add debugging to understand the auth state
    console.log('Protected route auth state:', { 
      user: !!user, 
      role, 
      isLoading, 
      pathname,
      allowedRoles 
    });
    
    if (!isLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (role && !allowedRoles.includes(role)) {
        console.log(`User role ${role} not allowed, redirecting to unauthorized`);
        router.push("/unauthorized");
      } else {
        console.log('User authenticated and authorized');
      }
    }
  }, [user, role, isLoading, router, pathname, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-ekantik-500 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user || (role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
