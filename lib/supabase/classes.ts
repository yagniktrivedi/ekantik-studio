import { supabase } from "./client";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type YogaClass = Database['public']['Tables']['classes']['Row'];
export type YogaClassInsert = Database['public']['Tables']['classes']['Insert'];
export type YogaClassUpdate = Database['public']['Tables']['classes']['Update'];

// Extended type to include new fields that might not be in the database types yet
export interface YogaClassExtended extends YogaClass {
  start_date?: string | null;
}

export interface ClassFormData {
  title: string;
  description?: string | null;
  instructor_id: string;
  duration_minutes: number;
  capacity: number;
  price: number;
  level: "beginner" | "intermediate" | "advanced" | "all levels";
  category: string;
  start_time?: string | null;
  start_date?: string | null;
  recurring: boolean;
  recurring_pattern?: string | null;
  location?: string | null;
  status: "active" | "inactive" | "cancelled" | "scheduled" | "completed";
  image_url?: string | null;
}

// Function to upload image to Supabase Storage and get public URL
export async function uploadClassImage(file: File) {
  console.log('uploadClassImage', file);
  
  // Define bucket name - this should match the bucket you created in Supabase dashboard
  const bucketName = 'classes';
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    // First, ensure we're signed in with an anonymous session if not already authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No session found, signing in anonymously...');
      // Sign in anonymously if no session exists
      await supabase.auth.signInAnonymously();
      console.log('Signed in anonymously');
    }
    
    // Now try to upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to overwrite if file exists
      });
    
    console.log('image upload', {data, error});

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const imgUrl1 = 'https://ztvgjiocgphuqvnmpdnh.supabase.co/storage/v1/object/' + data.fullPath;
    console.log('imgUrl1', imgUrl1);
    return imgUrl1;

    /*
        // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('publicUrl', publicUrl);
    
    // Fix the URL format to ensure it works with Supabase's storage service
    const fixedUrl = publicUrl.replace('/object/', '/object/public/');
    console.log('fixedUrl', fixedUrl);

    return fixedUrl;
    */

  } catch (error) {
    console.error('Error in uploadClassImage:', error);
    return null;
  }
}


// https://ztvgjiocgphuqvnmpdnh.supabase.co/storage/v1/object/classes/4x7h1pu06wx_1746343789873.jpg
export async function getClasses(): Promise<{ data: YogaClass[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getClassById(id: string): Promise<{ data: YogaClass | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

export async function getClassesByInstructor(instructorId: string): Promise<{ data: YogaClass[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function createClass(classData: ClassFormData, imageFile?: File): Promise<{ data: YogaClass | null; error: PostgrestError | null }> {
  // If an image file is provided, upload it first
  if (imageFile) {
    const imageUrl = await uploadClassImage(imageFile);
    if (imageUrl) {
      classData.image_url = imageUrl;
    }
  }

  // Create an object that matches the database schema
  const insertData: any = {
    name: classData.title,
    description: classData.description || null,
    instructor_user_id: classData.instructor_id,
    duration: classData.duration_minutes,
    capacity: classData.capacity,
    price: classData.price,
    level: classData.level,
    category: classData.category,
    start_time: classData.start_time || null,
    start_date: classData.start_date || null,
    recurring: classData.recurring,
    recurring_pattern: classData.recurring_pattern || null,
    location: classData.location || null,
    status: classData.status,
    image_url: classData.image_url || null
  };

  const { data, error } = await supabase
    .from('classes')
    .insert([insertData])
    .select()
    .single();
  console.log('Created class:', data)
  console.log('Created class error:', error)
  return { data, error };
}

export async function updateClass(id: string, classData: Partial<ClassFormData>, imageFile?: File): Promise<{ data: YogaClass | null; error: PostgrestError | null }> {
  // If an image file is provided, upload it first
  if (imageFile) {
    const imageUrl = await uploadClassImage(imageFile);
    if (imageUrl) {
      classData.image_url = imageUrl;
    }
  }

  // Create an object that matches the database schema
  const updateData: any = {};
  
  if (classData.title !== undefined) updateData.name = classData.title;
  if (classData.description !== undefined) updateData.description = classData.description;
  if (classData.instructor_id !== undefined) updateData.instructor_id = classData.instructor_id;
  if (classData.duration_minutes !== undefined) updateData.duration = classData.duration_minutes;
  if (classData.capacity !== undefined) updateData.capacity = classData.capacity;
  if (classData.price !== undefined) updateData.price = classData.price;
  if (classData.level !== undefined) updateData.level = classData.level;
  if (classData.category !== undefined) updateData.category = classData.category;
  if (classData.start_time !== undefined) updateData.start_time = classData.start_time;
  if (classData.start_date !== undefined) updateData.start_date = classData.start_date;
  if (classData.recurring !== undefined) updateData.recurring = classData.recurring;
  if (classData.recurring_pattern !== undefined) updateData.recurring_pattern = classData.recurring_pattern;
  if (classData.location !== undefined) updateData.location = classData.location;
  if (classData.status !== undefined) updateData.status = classData.status;
  if (classData.image_url !== undefined) updateData.image_url = classData.image_url;

  const { data, error } = await supabase
    .from('classes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteClass(id: string): Promise<{ success: boolean; error: PostgrestError | null }> {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);

  return { success: !error, error };
}
