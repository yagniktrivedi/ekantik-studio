-- Script to add instructors to the system

-- First, we need to create user accounts for the instructors
-- Note: In a real production environment, you would use Supabase Auth UI or API to create users
-- This is a simplified approach for development purposes

-- Function to create users and add them as instructors
CREATE OR REPLACE FUNCTION add_instructor(email TEXT, password TEXT, full_name TEXT)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Generate a UUID for the new user
  new_user_id := gen_random_uuid();
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    email,
    crypt(password, gen_salt('bf')),  -- Encrypt the password
    NOW(),                           -- Email confirmed
    '{"provider":"email","providers":["email"]}'::jsonb,  -- App metadata
    jsonb_build_object('full_name', full_name),  -- User metadata with full name
    NOW(),
    NOW()
  );

  -- Insert into profiles table if it exists
  -- This assumes you have a profiles table that stores additional user info
  BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (new_user_id, full_name, email);
  EXCEPTION WHEN OTHERS THEN
    -- If profiles table doesn't exist or has different structure, just continue
    RAISE NOTICE 'Could not insert into profiles table: %', SQLERRM;
  END;

  -- Insert into user_roles as instructor
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'instructor');

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add instructors
SELECT add_instructor('maya.johnson@ekantikstudio.com', 'instructor123', 'Maya Johnson');
SELECT add_instructor('david.singh@ekantikstudio.com', 'instructor123', 'David Singh');
SELECT add_instructor('leila.patel@ekantikstudio.com', 'instructor123', 'Leila Patel');
SELECT add_instructor('alex.williams@ekantikstudio.com', 'instructor123', 'Alex Williams');
SELECT add_instructor('sarah.thompson@ekantikstudio.com', 'instructor123', 'Sarah Thompson');

-- Clean up the function when done
DROP FUNCTION add_instructor;

-- If you need to check the instructors
-- SELECT u.id, u.email, p.full_name, r.role 
-- FROM auth.users u 
-- JOIN public.user_roles r ON u.id = r.user_id
-- LEFT JOIN public.profiles p ON u.id = p.id
-- WHERE r.role = 'instructor';
