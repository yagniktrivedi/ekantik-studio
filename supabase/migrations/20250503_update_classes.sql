-- Update classes table to match the form schema and ensure compatibility with the instructor view

-- Check if classes table exists, if not create it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'classes') THEN
    -- Create the classes table if it doesn't exist with all fields needed by the form
    CREATE TABLE public.classes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      capacity INTEGER NOT NULL DEFAULT 15,
      level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all levels')),
      category TEXT NOT NULL CHECK (category IN ('yoga', 'meditation', 'pilates', 'fitness', 'wellness')),
      image_url TEXT,
      active BOOLEAN DEFAULT TRUE,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- If the table exists, ensure it has all the necessary columns for the form
    -- Core fields from the form schema
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'name') THEN
      ALTER TABLE public.classes ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed Class';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'description') THEN
      ALTER TABLE public.classes ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'instructor_id') THEN
      ALTER TABLE public.classes ADD COLUMN instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'duration_minutes') THEN
      ALTER TABLE public.classes ADD COLUMN duration_minutes INTEGER NOT NULL DEFAULT 60;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'capacity') THEN
      ALTER TABLE public.classes ADD COLUMN capacity INTEGER NOT NULL DEFAULT 15;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'level') THEN
      ALTER TABLE public.classes ADD COLUMN level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all levels'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'category') THEN
      ALTER TABLE public.classes ADD COLUMN category TEXT NOT NULL DEFAULT 'yoga' CHECK (category IN ('yoga', 'meditation', 'pilates', 'fitness', 'wellness'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'image_url') THEN
      ALTER TABLE public.classes ADD COLUMN image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'active') THEN
      ALTER TABLE public.classes ADD COLUMN active BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'status') THEN
      ALTER TABLE public.classes ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'created_at') THEN
      ALTER TABLE public.classes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'classes' AND column_name = 'updated_at') THEN
      ALTER TABLE public.classes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END IF;

  -- Update the instructor_id foreign key to reference auth.users
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'classes' AND column_name = 'instructor_id'
  ) THEN
    -- Drop the existing foreign key if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'classes_instructor_id_fkey' 
      AND table_name = 'classes'
    ) THEN
      ALTER TABLE public.classes DROP CONSTRAINT classes_instructor_id_fkey;
    END IF;
    
    -- Add the foreign key to auth.users
    ALTER TABLE public.classes
      ADD CONSTRAINT classes_instructor_id_fkey
      FOREIGN KEY (instructor_id)
      REFERENCES auth.users(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

-- Set up Row Level Security (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create policies (drop first to avoid duplicates)
DROP POLICY IF EXISTS "Admins can do everything on classes" ON public.classes;
CREATE POLICY "Admins can do everything on classes" 
  ON public.classes 
  FOR ALL 
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Instructors can view their classes" ON public.classes;
CREATE POLICY "Instructors can view their classes" 
  ON public.classes 
  FOR SELECT 
  TO authenticated
  USING (instructor_id = auth.uid() OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'instructor'));

DROP POLICY IF EXISTS "Public can view active classes" ON public.classes;
CREATE POLICY "Public can view active classes" 
  ON public.classes 
  FOR SELECT 
  TO anon, authenticated
  USING (active = true AND status = 'active');

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the classes table
DROP TRIGGER IF EXISTS set_classes_updated_at ON public.classes;
CREATE TRIGGER set_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create class_schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for class_schedules
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for class_schedules
DROP POLICY IF EXISTS "Admins can do everything on class_schedules" ON public.class_schedules;
CREATE POLICY "Admins can do everything on class_schedules" 
  ON public.class_schedules 
  FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Instructors can view all class schedules
DROP POLICY IF EXISTS "Instructors can view all class_schedules" ON public.class_schedules;
CREATE POLICY "Instructors can view all class_schedules" 
  ON public.class_schedules 
  FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'instructor'
  ));

-- Public users can view class schedules for active classes
DROP POLICY IF EXISTS "Public users can view class_schedules for active classes" ON public.class_schedules;
CREATE POLICY "Public users can view class_schedules for active classes" 
  ON public.class_schedules 
  FOR SELECT 
  TO anon 
  USING (EXISTS (
    SELECT 1 FROM public.classes 
    WHERE classes.id = class_schedules.class_id AND classes.active = TRUE AND classes.status = 'active'
  ));

-- Create trigger for the class_schedules table
DROP TRIGGER IF EXISTS set_class_schedules_updated_at ON public.class_schedules;
CREATE TRIGGER set_class_schedules_updated_at
BEFORE UPDATE ON public.class_schedules
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create class_bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.class_schedules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlisted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(schedule_id, user_id)
);

-- Set up RLS for class_bookings
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for class_bookings
DROP POLICY IF EXISTS "Admins can do everything on class_bookings" ON public.class_bookings;
CREATE POLICY "Admins can do everything on class_bookings" 
  ON public.class_bookings 
  FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Users can view their own bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.class_bookings;
CREATE POLICY "Users can view their own bookings" 
  ON public.class_bookings 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

-- Users can insert their own bookings
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.class_bookings;
CREATE POLICY "Users can insert their own bookings" 
  ON public.class_bookings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Users can update their own bookings
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.class_bookings;
CREATE POLICY "Users can update their own bookings" 
  ON public.class_bookings 
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Create trigger for the class_bookings table
DROP TRIGGER IF EXISTS set_class_bookings_updated_at ON public.class_bookings;
CREATE TRIGGER set_class_bookings_updated_at
BEFORE UPDATE ON public.class_bookings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
