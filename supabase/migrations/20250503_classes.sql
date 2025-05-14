-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all levels')),
  category TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  recurring BOOLEAN DEFAULT false,
  recurring_pattern TEXT,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for classes table
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can do everything on classes" 
  ON public.classes 
  FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Instructors can view all classes
CREATE POLICY "Instructors can view all classes" 
  ON public.classes 
  FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'instructor'
  ));

-- Instructors can update their own classes
CREATE POLICY "Instructors can update their own classes" 
  ON public.classes 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.instructors i
      JOIN public.user_roles ur ON i.user_id = ur.user_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'instructor'
      AND i.id = instructor_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.instructors i
      JOIN public.user_roles ur ON i.user_id = ur.user_id
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'instructor'
      AND i.id = instructor_id
    )
  );

-- Regular users can view scheduled and not cancelled classes
CREATE POLICY "Users can view active classes" 
  ON public.classes 
  FOR SELECT 
  TO authenticated 
  USING (status = 'scheduled');

-- Anonymous users can view scheduled classes
CREATE POLICY "Anonymous users can view scheduled classes" 
  ON public.classes 
  FOR SELECT 
  TO anon 
  USING (status = 'scheduled');

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS classes_instructor_id_idx ON public.classes(instructor_id);
CREATE INDEX IF NOT EXISTS classes_start_time_idx ON public.classes(start_time);
CREATE INDEX IF NOT EXISTS classes_status_idx ON public.classes(status);
