// Define manual types for all class-related entities

// Class types
export interface ClassType {
  id: string;
  name: string;
  title?: string; // Some APIs might expect this instead of name
  description: string | null;
  instructor_id: string | null;
  duration_minutes: number;
  capacity: number;
  level: ClassLevel;
  category: ClassCategory;
  image_url: string | null;
  active: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  price?: number;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  recurring?: boolean;
  recurring_pattern?: string | null;
}

// Class schedule types
export interface ClassScheduleType {
  id: string;
  class_id: string;
  date: string;
  time: string;
  location: string | null;
  created_at?: string;
  updated_at?: string;
}

// Class booking types
export interface ClassBookingType {
  id: string;
  schedule_id: string;
  user_id: string;
  status: BookingStatus;
  created_at?: string;
  updated_at?: string;
}

// Enums
export type ClassLevel = 'beginner' | 'intermediate' | 'advanced' | 'all levels';
export type ClassCategory = 'yoga' | 'meditation' | 'pilates' | 'fitness' | 'wellness';
export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlisted';

// Extended types with relationships
export interface ClassWithDetails extends ClassType {
  instructorName: string;
  schedulesCount: number;
  nextSchedule?: {
    id: string;
    date: string;
    time: string;
    location: string;
  };
  status: 'active' | 'cancelled' | 'full';
}

export interface ClassScheduleWithDetails extends ClassScheduleType {
  class?: ClassType;
  bookings?: ClassBookingType[];
  bookingsCount?: number;
}

export interface ClassBookingWithDetails extends ClassBookingType {
  user?: {
    id: string;
    email?: string;
    full_name?: string;
  };
  schedule?: ClassScheduleWithDetails;
}
