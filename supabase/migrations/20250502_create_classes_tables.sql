-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL, -- in minutes
  capacity INTEGER NOT NULL,
  level VARCHAR(50) NOT NULL, -- beginner, intermediate, advanced
  category VARCHAR(50) NOT NULL, -- yoga, meditation, etc.
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class schedules table
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255) NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50), -- daily, weekly, etc.
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class bookings table
CREATE TABLE IF NOT EXISTS class_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_schedule_id UUID REFERENCES class_schedules(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled, attended
  membership_id UUID, -- Will reference memberships table once it's created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_schedule_id) -- Prevent duplicate bookings
);

-- Create class waitlist table
CREATE TABLE IF NOT EXISTS class_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_schedule_id UUID REFERENCES class_schedules(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_schedule_id) -- Prevent duplicate waitlist entries
);

-- Create RLS policies for classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Admin and instructors can manage classes
CREATE POLICY "Admins can manage classes"
  ON classes
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin')
    )
  );

-- Instructors can view and manage their own classes
CREATE POLICY "Instructors can manage their own classes"
  ON classes
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'instructor'
    ) AND instructor_id = auth.uid()
  );

-- All authenticated users can view classes
CREATE POLICY "All users can view classes"
  ON classes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create RLS policies for class schedules
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;

-- Admin and instructors can manage class schedules
CREATE POLICY "Admins can manage class schedules"
  ON class_schedules
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin')
    )
  );

-- Instructors can manage schedules for their classes
CREATE POLICY "Instructors can manage their class schedules"
  ON class_schedules
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN classes c ON c.instructor_id = ur.user_id
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'instructor'
      AND c.id = class_schedules.class_id
    )
  );

-- All authenticated users can view class schedules
CREATE POLICY "All users can view class schedules"
  ON class_schedules
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create RLS policies for class bookings
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

-- Users can manage their own bookings
CREATE POLICY "Users can manage their own bookings"
  ON class_bookings
  USING (user_id = auth.uid());

-- Admins can manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON class_bookings
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Instructors can view bookings for their classes
CREATE POLICY "Instructors can view bookings for their classes"
  ON class_bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN classes c ON c.instructor_id = ur.user_id
      JOIN class_schedules cs ON cs.class_id = c.id
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'instructor'
      AND cs.id = class_bookings.class_schedule_id
    )
  );

-- Create RLS policies for class waitlist
ALTER TABLE class_waitlist ENABLE ROW LEVEL SECURITY;

-- Users can manage their own waitlist entries
CREATE POLICY "Users can manage their own waitlist entries"
  ON class_waitlist
  USING (user_id = auth.uid());

-- Admins can manage all waitlist entries
CREATE POLICY "Admins can manage all waitlist entries"
  ON class_waitlist
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Instructors can view waitlist for their classes
CREATE POLICY "Instructors can view waitlist for their classes"
  ON class_waitlist
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN classes c ON c.instructor_id = ur.user_id
      JOIN class_schedules cs ON cs.class_id = c.id
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'instructor'
      AND cs.id = class_waitlist.class_schedule_id
    )
  );

-- Create functions and triggers
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at
BEFORE UPDATE ON class_schedules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_bookings_updated_at
BEFORE UPDATE ON class_bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
