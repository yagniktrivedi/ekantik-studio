"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: "admin" | "instructor" | "user" | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  signOut: async () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<"admin" | "instructor" | "user" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Effect for auth state changes
  useEffect(() => {
    let mounted = true;
    
    // Initial session check
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && mounted) {
          setUser(session.user);
          setSession(session);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        // Handle different auth events
        if (event === 'SIGNED_IN') {
          if (newSession) {
            setUser(newSession.user);
            setSession(newSession);
            // Don't navigate here - the login page will handle redirection
          }
        } else if (event === 'TOKEN_REFRESHED') {
          if (newSession) {
            setUser(newSession.user);
            setSession(newSession);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setRole(null);
          router.push('/login');
        } else if (event === 'USER_UPDATED') {
          if (newSession) {
            setUser(newSession.user);
            setSession(newSession);
          }
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Separate effect for fetching user role
  useEffect(() => {
    let mounted = true;
    
    const fetchUserRole = async () => {
      if (!user) {
        if (mounted) setRole(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          return;
        }

        if (data && mounted) {
          setRole(data.role);
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
      }
    };

    fetchUserRole();
    
    return () => {
      mounted = false;
    };
  }, [user?.id]); // Only re-run when user ID changes, not the entire user object

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
      router.push("/login");
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, role, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
