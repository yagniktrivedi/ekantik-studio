import { supabase } from "./client";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type Instructor = Database['public']['Tables']['instructors']['Row'];
export type InstructorInsert = Database['public']['Tables']['instructors']['Insert'];
export type InstructorUpdate = Database['public']['Tables']['instructors']['Update'];

export interface InstructorFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  certifications: string[];
  image_url?: string;
  status: "active" | "inactive" | "on leave";
  social_media: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

export async function getInstructors(): Promise<{ data: Instructor[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .order('name');
  
  return { data, error };
}

export async function getInstructorById(id: string): Promise<{ data: Instructor | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
}

export async function createInstructor(instructorData: InstructorFormData): Promise<{ data: Instructor | null; error: PostgrestError | null }> {
  const insertData: InstructorInsert = {
    name: instructorData.name,
    email: instructorData.email,
    phone: instructorData.phone || null,
    bio: instructorData.bio || null,
    specialties: instructorData.specialties,
    certifications: instructorData.certifications,
    image_url: instructorData.image_url || null,
    status: instructorData.status,
    social_media: instructorData.social_media,
  };

  const { data, error } = await supabase
    .from('instructors')
    .insert(insertData)
    .select()
    .single();
  
  return { data, error };
}

export async function updateInstructor(id: string, instructorData: Partial<InstructorFormData>): Promise<{ data: Instructor | null; error: PostgrestError | null }> {
  const updateData: InstructorUpdate = {};
  
  if (instructorData.name !== undefined) updateData.name = instructorData.name;
  if (instructorData.email !== undefined) updateData.email = instructorData.email;
  if (instructorData.phone !== undefined) updateData.phone = instructorData.phone;
  if (instructorData.bio !== undefined) updateData.bio = instructorData.bio;
  if (instructorData.specialties !== undefined) updateData.specialties = instructorData.specialties;
  if (instructorData.certifications !== undefined) updateData.certifications = instructorData.certifications;
  if (instructorData.image_url !== undefined) updateData.image_url = instructorData.image_url;
  if (instructorData.status !== undefined) updateData.status = instructorData.status;
  if (instructorData.social_media !== undefined) updateData.social_media = instructorData.social_media;

  const { data, error } = await supabase
    .from('instructors')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteInstructor(id: string): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase
    .from('instructors')
    .delete()
    .eq('id', id);
  
  return { error };
}

export async function getActiveInstructors(): Promise<{ data: Instructor[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('status', 'active')
    .order('name');
  
  return { data, error };
}
