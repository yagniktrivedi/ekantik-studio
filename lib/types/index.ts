// Instructor Type
export interface InstructorType {
  id: string;
  name: string;
  image: string;
  specialization: string;
  title?: string; // Job title (e.g., "Senior Yoga Instructor")
  specialties?: string[]; // Array of specialties (e.g., ["Vinyasa", "Meditation"])
  bio: string;
  certifications: string[];
  classes?: ClassType[];
  email?: string;
  phone?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

// Class Type
export interface ClassType {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "all-levels";
  duration: number; // in minutes
  credits: number;
  location: string;
  instructor: InstructorType;
  benefits: string[];
  whatToBring: string[];
  capacity: number;
  availableSpots?: number;
  schedule?: ScheduleType[];
}

// Schedule Type
export interface ScheduleType {
  id: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: "studio" | "online";
  availableSpots: number;
  bookedSpots: number;
  isFullyBooked: boolean;
}

// Booking Type
export interface BookingType {
  id: string;
  userId: string;
  classId: string;
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: "studio" | "online";
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

// Membership Type
export interface MembershipType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  credits: number;
  benefits: string[];
  isPopular?: boolean;
}

// User Membership Type
export interface UserMembershipType {
  id: string;
  userId: string;
  membershipId: string;
  membership: MembershipType;
  startDate: string;
  endDate: string;
  creditsRemaining: number;
  status: "active" | "expired" | "cancelled";
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}
