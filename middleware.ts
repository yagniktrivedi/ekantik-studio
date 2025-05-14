import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next();
  
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Create the Supabase client
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();
  
  // Log for debugging
  console.log(`Middleware running for path: ${path}, session exists: ${!!session}`);
  
  // Handle protected routes
  if (path.startsWith('/admin-dashboard')) {
    // If no session, redirect to login
    if (!session) {
      // Add the returnUrl parameter to redirect back after login
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('returnUrl', path);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check for admin role
    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      
      console.log('Admin check:', { roleData, error });
      
      if (error || !roleData || roleData.role !== 'admin') {
        // If not an admin, redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    } catch (err) {
      console.error('Error checking admin role:', err);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  } else if (path.startsWith('/dashboard')) {
    // If no session, redirect to login
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('returnUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  } else if (path === '/login' || path === '/signup') {
    // If already logged in, redirect to appropriate dashboard
    if (session) {
      try {
        // Fetch the user's role
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (!error && roleData) {
          if (roleData.role === 'admin') {
            return NextResponse.redirect(new URL('/admin-dashboard', req.url));
          } else if (roleData.role === 'instructor') {
            return NextResponse.redirect(new URL('/instructor-dashboard', req.url));
          } else {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        } else {
          // Default to regular dashboard if role not found
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (err) {
        console.error('Error in middleware role check:', err);
        // Default to dashboard if there's an error
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }
  
  return res;
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    // Auth routes
    '/(auth)/:path*',
    // Protected routes
    '/dashboard/:path*',
    '/admin-dashboard/:path*',
    '/instructor-dashboard/:path*',
    '/api/:path*',
  ],
};
