"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
// Import auth components with relative paths to avoid module resolution issues
import { useAuth } from "../../../components/auth/auth-provider";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          {user 
            ? `You don't have permission to access this page. This area requires higher privileges than your current role (${role || "user"}).`
            : "You need to be logged in to access this page."}
        </p>
        
        <div className="space-y-3">
          {user ? (
            <>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-full">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Link>
              </Button>
            </>
          )}
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please contact the administrator at{" "}
          <a href="mailto:admin@ekantikstudio.com" className="text-ekantik-600 hover:text-ekantik-700">
            admin@ekantikstudio.com
          </a>
        </p>
      </div>
    </div>
  );
}
