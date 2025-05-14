import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  try {
    const { email, password, fullName } = await request.json();
    
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }
    
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }
    
    if (authData.user) {
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          email: email,
        });
      
      if (profileError) {
        // Log the error but don't fail the request
        console.error('Profile creation error:', profileError);
      }
      
      // Create user role record (default to "user")
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'user',
        });
      
      if (roleError) {
        // Log the error but don't fail the request
        console.error('User role creation error:', roleError);
      }
      
      return NextResponse.json(
        { 
          user: authData.user,
          message: 'Account created successfully. Please check your email to verify your account.'
        },
        { status: 201 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
