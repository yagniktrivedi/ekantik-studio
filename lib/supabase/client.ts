import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

/**
 * Supabase client for client-side usage
 * Use this in client components
 * 
 * Using createClientComponentClient instead of createClient
 * to properly handle cookies in Next.js App Router
 */
export const supabase = createClientComponentClient<Database>();
