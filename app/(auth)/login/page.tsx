"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email });
      
      // Use Supabase client directly instead of API route
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      // Fetch the user's role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (roleError) {
        console.error("Error fetching user role:", roleError);
      }

      const userRole = roleData?.role || null;
      console.log('Auth data:', { userRole });
      
      // Customize welcome message based on role
      let welcomeMessage = "Welcome back to Ekantik Studio!";
      if (userRole) {
        if (userRole === "admin") {
          welcomeMessage = "Welcome back, Admin! Accessing admin dashboard...";
        } else if (userRole === "instructor") {
          welcomeMessage = "Welcome back, Instructor! Accessing your dashboard...";
        } else {
          welcomeMessage = "Welcome back to Ekantik Studio!";
        }
      }

      toast({
        title: "Login successful",
        description: welcomeMessage,
      });
      
      // Determine the redirect path based on user role
      let targetPath = '/dashboard';
      if (userRole === 'admin') {
        targetPath = '/admin-dashboard';
      } else if (userRole === 'instructor') {
        targetPath = '/instructor-dashboard';
      } else if (returnUrl && returnUrl !== '/login') {
        targetPath = returnUrl;
      }
      
      console.log('Redirecting to:', targetPath);
      
      // Use router.push for navigation
      router.push(targetPath);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // Use Supabase client directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "demo@ekantikstudio.com",
        password: "demo123456",
      });

      if (error) {
        throw new Error(error.message || 'Demo login failed');
      }

      // Fetch the user's role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (roleError) {
        console.error("Error fetching user role:", roleError);
      }

      const userRole = roleData?.role || null;
      
      toast({
        title: "Demo login successful",
        description: "Welcome to the Ekantik Studio demo account!",
      });
      
      // Determine the redirect path based on user role
      let targetPath = '/dashboard';
      if (userRole === 'admin') {
        targetPath = '/admin-dashboard';
      } else if (userRole === 'instructor') {
        targetPath = '/instructor-dashboard';
      }
      
      // Use router.push for navigation
      router.push(targetPath);
    } catch (error: any) {
      toast({
        title: "Demo login failed",
        description: error.message || "An error occurred during demo login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{" "}
          <Link href="/" className="font-medium text-ekantik-600 hover:text-ekantik-500">
            return to the homepage
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-ekantik-600 hover:text-ekantik-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-ekantik-600 focus:ring-ekantik-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-ekantik-600 hover:bg-ekantik-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Demo Account
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-ekantik-600 hover:text-ekantik-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-ekantik-600 hover:text-ekantik-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-ekantik-600 hover:text-ekantik-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
