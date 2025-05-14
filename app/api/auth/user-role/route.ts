import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch the user's role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return NextResponse.json(
        { error: roleError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { role: roleData?.role || null },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if the current user is an admin
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    if (adminCheckError || adminCheck?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can modify user roles' },
        { status: 403 }
      );
    }
    
    // Get the user ID and role from the request
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }
    
    // Validate the role
    if (!['admin', 'instructor', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: admin, instructor, user' },
        { status: 400 }
      );
    }
    
    // Check if the user already has a role
    const { data: existingRole, error: existingRoleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    let result;
    
    if (existingRole) {
      // Update the existing role
      result = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);
    } else {
      // Create a new role entry
      result = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
    }
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: `User role updated to ${role}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
