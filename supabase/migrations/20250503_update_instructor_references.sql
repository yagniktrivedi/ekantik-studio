-- This migration updates the database to handle instructors through the user_roles table
-- instead of requiring a separate instructors table

-- First, check if instructor_id column exists and rename it if it does
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'instructor_id') THEN
    ALTER TABLE public.classes
      RENAME COLUMN instructor_id TO instructor_user_id;
      
    -- Update any foreign key constraints
    ALTER TABLE public.classes
      DROP CONSTRAINT IF EXISTS classes_instructor_id_fkey;
      
    -- Add a foreign key to auth.users
    ALTER TABLE public.classes
      ADD CONSTRAINT classes_instructor_user_id_fkey
      FOREIGN KEY (instructor_user_id)
      REFERENCES auth.users(id)
      ON DELETE SET NULL;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'instructor_user_id') THEN
    -- If neither column exists, add instructor_user_id
    ALTER TABLE public.classes
      ADD COLUMN instructor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- Create a view to provide backward compatibility for code that expects an instructors table
DROP VIEW IF EXISTS public.instructors;
CREATE OR REPLACE VIEW public.instructors AS
SELECT 
  u.id,
  u.id as user_id,
  COALESCE(p.full_name, u.email) as name,
  u.email,
  p.phone,
  p.bio,
  '{}' as specialties,
  '{}' as certifications,
  p.avatar_url as image_url,
  'active' as status,
  '{}'::jsonb as social_media,
  0 as classes_count,
  u.created_at as joined_date,
  u.created_at,
  COALESCE(p.updated_at, u.created_at) as updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'instructor';

-- Create a function to handle inserts to the instructors view
DROP FUNCTION IF EXISTS public.handle_instructor_insert();
CREATE OR REPLACE FUNCTION public.handle_instructor_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a user if one doesn't exist
  INSERT INTO auth.users (email, password, email_confirmed_at)
  VALUES (NEW.email, gen_random_uuid()::text, now())
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO NEW.user_id;
  
  -- If we didn't get a user_id, find the existing one
  IF NEW.user_id IS NULL THEN
    SELECT id INTO NEW.user_id FROM auth.users WHERE email = NEW.email;
  END IF;
  
  -- Add the instructor role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'instructor')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Update or create profile
  INSERT INTO public.profiles (id, full_name, email, phone, bio, avatar_url)
  VALUES (
    NEW.user_id,
    NEW.name,
    NEW.email,
    NEW.phone,
    NEW.bio,
    NEW.image_url
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    bio = EXCLUDED.bio,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for the instructors view
DROP TRIGGER IF EXISTS instructors_insert_trigger ON public.instructors;
CREATE TRIGGER instructors_insert_trigger
INSTEAD OF INSERT ON public.instructors
FOR EACH ROW
EXECUTE FUNCTION public.handle_instructor_insert();

-- Create a function to handle updates to the instructors view
DROP FUNCTION IF EXISTS public.handle_instructor_update();
CREATE OR REPLACE FUNCTION public.handle_instructor_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile
  UPDATE public.profiles
  SET 
    full_name = NEW.name,
    email = NEW.email,
    phone = NEW.phone,
    bio = NEW.bio,
    avatar_url = NEW.image_url,
    updated_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for updates to the instructors view
DROP TRIGGER IF EXISTS instructors_update_trigger ON public.instructors;
CREATE TRIGGER instructors_update_trigger
INSTEAD OF UPDATE ON public.instructors
FOR EACH ROW
EXECUTE FUNCTION public.handle_instructor_update();

-- Create a function to handle deletes from the instructors view
DROP FUNCTION IF EXISTS public.handle_instructor_delete();
CREATE OR REPLACE FUNCTION public.handle_instructor_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove the instructor role
  DELETE FROM public.user_roles
  WHERE user_id = OLD.user_id AND role = 'instructor';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for deletes from the instructors view
DROP TRIGGER IF EXISTS instructors_delete_trigger ON public.instructors;
CREATE TRIGGER instructors_delete_trigger
INSTEAD OF DELETE ON public.instructors
FOR EACH ROW
EXECUTE FUNCTION public.handle_instructor_delete();
