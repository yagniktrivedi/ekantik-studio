-- Drop the class_waitlist table (if it exists)
DROP TABLE IF EXISTS class_waitlist;

-- Drop the class_bookings table (if it exists)
DROP TABLE IF EXISTS class_bookings;

-- Drop the class_schedules table (if it exists)
DROP TABLE IF EXISTS class_schedules;

-- Create the simplified class_bookings table
CREATE TABLE IF NOT EXISTS class_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  end_time TIME,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled, attended, waitlisted
  waitlist_position INTEGER,
  membership_id UUID, -- Will reference memberships table once it's created
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_id, booking_date, booking_time) -- Prevent duplicate bookings
);

-- Create index for faster queries
CREATE INDEX idx_class_bookings_class_id ON class_bookings(class_id);
CREATE INDEX idx_class_bookings_user_id ON class_bookings(user_id);
CREATE INDEX idx_class_bookings_date ON class_bookings(booking_date);
CREATE INDEX idx_class_bookings_status ON class_bookings(status);

-- Add a function to check class availability
CREATE OR REPLACE FUNCTION check_class_availability(p_class_id UUID, p_booking_date DATE, p_booking_time TIME)
RETURNS INTEGER AS $$
DECLARE
  v_capacity INTEGER;
  v_booked INTEGER;
BEGIN
  -- Get class capacity
  SELECT capacity INTO v_capacity FROM classes WHERE id = p_class_id;
  
  -- Get number of confirmed bookings
  SELECT COUNT(*) INTO v_booked 
  FROM class_bookings 
  WHERE class_id = p_class_id 
    AND booking_date = p_booking_date 
    AND booking_time = p_booking_time
    AND status = 'confirmed';
  
  -- Return available spots
  RETURN v_capacity - v_booked;
END;
$$ LANGUAGE plpgsql;
