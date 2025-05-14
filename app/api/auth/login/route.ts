import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Create the Supabase client with the correct cookies implementation
    // This pattern is recommended for Next.js App Router to handle cookies properly
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    
    // Authenticate the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    

    console.log('******Login API response:', {data, error});
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Fetch the user's role from the user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();
    
    if (roleError) {
      console.error('Error fetching user role:', roleError);
      // Continue without role information
    }
    
    // Determine the appropriate redirect URL based on role
    let redirectUrl = '/dashboard';
    if (roleData?.role) {
      if (roleData.role === 'admin') {
        redirectUrl = '/admin-dashboard'; // Admin dashboard
      } else if (roleData.role === 'instructor') {
        redirectUrl = '/instructor-dashboard'; // Instructor dashboard
      } else {
        redirectUrl = '/dashboard'; // Regular user dashboard
      }
    }
    
    // Create a response object
    const response = NextResponse.json(
      { 
        user: data.user,
        session: data.session,
        role: roleData?.role || null,
        redirectUrl
      },
      { status: 200 }
    );
    
    // Log the response for debugging
    console.log('******Login response:', { userRole: roleData?.role, redirectUrl });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
