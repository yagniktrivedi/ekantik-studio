import { supabase } from "@/lib/supabase/client";
import { ClassType, InstructorType } from "@/lib/types";

// Mock data for development purposes
// In a real application, this would be fetched from Supabase
const mockInstructors: InstructorType[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    specialization: "Vinyasa Flow & Meditation",
    bio: "Sarah has been practicing yoga for over 15 years and teaching for 10. She specializes in Vinyasa Flow and meditation techniques, helping students find balance and inner peace.",
    certifications: ["RYT-500", "Meditation Teacher Training", "Yin Yoga Certification"],
  },
  {
    id: "2",
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    specialization: "Ashtanga & Power Yoga",
    bio: "Michael discovered yoga during his career as a professional athlete. Now, he combines his athletic background with traditional yoga practices to create dynamic and challenging classes.",
    certifications: ["RYT-200", "Power Yoga Certification", "Sports Therapy"],
  },
  {
    id: "3",
    name: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    specialization: "Yin Yoga & Restorative",
    bio: "Emma specializes in slow-paced practices that promote deep relaxation and healing. Her classes focus on gentle movements, breathwork, and mindfulness techniques.",
    certifications: ["RYT-300", "Restorative Yoga", "Yoga Nidra"],
  },
];

const mockClasses: ClassType[] = [
  {
    id: "1",
    title: "Morning Vinyasa Flow",
    description: "Start your day with an energizing Vinyasa Flow class that will awaken your body and mind. This class focuses on linking breath with movement, building strength, and improving flexibility.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "vinyasa",
    level: "intermediate",
    duration: 60,
    credits: 1,
    location: "Ekantik Studio",
    instructor: mockInstructors[0],
    benefits: [
      "Increased energy and vitality",
      "Improved strength and flexibility",
      "Reduced stress and anxiety",
      "Enhanced mind-body connection"
    ],
    whatToBring: [
      "Yoga mat",
      "Water bottle",
      "Comfortable clothing",
      "Small towel"
    ],
    capacity: 20,
    availableSpots: 8,
  },
  {
    id: "2",
    title: "Gentle Yin Yoga",
    description: "A slow-paced style of yoga with postures that are held for longer periods of time. Yin Yoga targets the deep connective tissues and fascia in the body, promoting flexibility and relaxation.",
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1526&q=80",
    category: "yin",
    level: "all-levels",
    duration: 75,
    credits: 1,
    location: "Ekantik Studio",
    instructor: mockInstructors[2],
    benefits: [
      "Improved flexibility and joint mobility",
      "Reduced stress and anxiety",
      "Better sleep quality",
      "Balanced energy flow in the body"
    ],
    whatToBring: [
      "Yoga mat",
      "Comfortable clothing",
      "Blanket or shawl",
      "Yoga blocks (provided if needed)"
    ],
    capacity: 15,
    availableSpots: 5,
  },
  {
    id: "3",
    title: "Power Yoga",
    description: "A dynamic, fitness-based approach to vinyasa-style yoga. This class builds strength, flexibility and stamina as you move through a series of powerful postures and sequences.",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "vinyasa",
    level: "advanced",
    duration: 60,
    credits: 1,
    location: "Ekantik Studio",
    instructor: mockInstructors[1],
    benefits: [
      "Increased strength and endurance",
      "Improved cardiovascular health",
      "Enhanced mental focus",
      "Stress reduction"
    ],
    whatToBring: [
      "Yoga mat",
      "Water bottle",
      "Towel",
      "Comfortable athletic clothing"
    ],
    capacity: 18,
    availableSpots: 3,
  },
  {
    id: "4",
    title: "Meditation & Breathwork",
    description: "A gentle class focusing on meditation techniques and breathwork (pranayama) to calm the mind, reduce stress, and increase mental clarity and focus.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "meditation",
    level: "beginner",
    duration: 45,
    credits: 1,
    location: "Online",
    instructor: mockInstructors[0],
    benefits: [
      "Reduced stress and anxiety",
      "Improved mental clarity and focus",
      "Better sleep quality",
      "Enhanced emotional well-being"
    ],
    whatToBring: [
      "Comfortable cushion or chair",
      "Blanket",
      "Quiet space",
      "Notebook (optional)"
    ],
    capacity: 25,
    availableSpots: 15,
  },
  {
    id: "5",
    title: "Restorative Yoga",
    description: "A therapeutic style of yoga that uses props to support the body in gentle postures held for extended periods. This practice promotes deep relaxation and healing.",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "restorative",
    level: "all-levels",
    duration: 90,
    credits: 1,
    location: "Ekantik Studio",
    instructor: mockInstructors[2],
    benefits: [
      "Deep relaxation and stress relief",
      "Improved sleep quality",
      "Reduced muscle tension",
      "Balanced nervous system"
    ],
    whatToBring: [
      "Yoga mat",
      "Comfortable clothing",
      "Blanket",
      "Eye pillow (optional)"
    ],
    capacity: 12,
    availableSpots: 6,
  },
  {
    id: "6",
    title: "Ashtanga Basics",
    description: "An introduction to the Ashtanga yoga system, focusing on the fundamental postures and breathing techniques of the Primary Series.",
    image: "https://images.unsplash.com/photo-1593810450967-f9c42742e3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "ashtanga",
    level: "intermediate",
    duration: 75,
    credits: 1,
    location: "Ekantik Studio",
    instructor: mockInstructors[1],
    benefits: [
      "Improved strength and flexibility",
      "Enhanced focus and discipline",
      "Detoxification",
      "Stress reduction"
    ],
    whatToBring: [
      "Yoga mat",
      "Water bottle",
      "Towel",
      "Comfortable clothing"
    ],
    capacity: 15,
    availableSpots: 7,
  },
];

/**
 * Get all classes
 * @returns Promise<ClassType[]>
 */
export async function getAllClasses(): Promise<ClassType[]> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('classes')
    //   .select('*, instructor:instructors(*)')
    
    // if (error) throw error;
    // return data as ClassType[];
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockClasses);
      }, 800); // Simulate network delay
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
}

/**
 * Get a class by ID
 * @param id - The class ID
 * @returns Promise<ClassType | null>
 */
export async function getClassById(id: string): Promise<ClassType | null> {
  try {
    console.log('Fetching class by ID:', id);
    // Fetch the class data without the instructor relationship
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();
    
    console.log('Class data:', data);
    console.log('Class error:', error);
    if (error) throw error;
    
    // Cast data to any to avoid TypeScript errors with property access
    const dbData = data as any;
    
    // If we have an instructor_user_id, fetch the instructor data
    let instructorData = null;
    if (dbData.instructor_user_id) {
      const { data: instructor, error: instructorError } = await supabase
        .from('instructors')
        .select('*')
        .eq('user_id', dbData.instructor_user_id)
        .single();
      
      if (!instructorError && instructor) {
        // Map the database instructor data to match the InstructorType interface
        instructorData = {
          id: instructor.id,
          name: instructor.name || '',
          image: instructor.image_url || '',
          specialization: instructor.specialties?.join(', ') || '',
          bio: instructor.bio || '',
          certifications: instructor.certifications || [],
        };
        console.log('Mapped instructor data:', instructorData);
      } else {
        console.log('Instructor error:', instructorError);
      }
    }
    
    // Transform the data to match the ClassType interface
    const classData: ClassType = {
      id: dbData.id,
      title: dbData.name || dbData.title || '',
      description: dbData.description || '',
      image: dbData.image_url || '',
      category: dbData.category || 'yoga',
      level: (dbData.level as "beginner" | "intermediate" | "advanced" | "all-levels") || 'all-levels',
      duration: dbData.duration || dbData.duration_minutes || 60,
      credits: 1, // Default value
      location: dbData.location || 'Ekantik Studio',
      // Use the separately fetched instructor data or fall back to mock data
      instructor: instructorData || mockInstructors[0],
      benefits: [
        "Increased energy and vitality",
        "Improved strength and flexibility",
        "Reduced stress and anxiety"
      ],
      whatToBring: [
        "Yoga mat",
        "Water bottle",
        "Comfortable clothing"
      ],
      capacity: dbData.capacity || 15,
      availableSpots: dbData.capacity ? Math.floor(dbData.capacity * 0.4) : 6
      // Note: We've removed price, image_url, status, instructor_id, and start_time
      // as they're not part of the ClassType interface
    };
    
    // Store additional data for debugging
    console.log('Additional class data:', {
      price: dbData.price || 0,
      image_url: dbData.image_url || null,
      status: dbData.status || 'active',
      instructor_id: dbData.instructor_user_id || dbData.instructor_id || null,
      start_time: dbData.start_time || ''
    });
    
    return classData;
    
    // For now, return mock data
    /*
        return new Promise((resolve) => {
      setTimeout(() => {
        const classData = mockClasses.find(c => c.id === id) || null;
        resolve(classData);
      }, 500); // Simulate network delay
    });
    */

  } catch (error) {
    console.error(`Error fetching class with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get related classes based on category and excluding the current class
 * @param currentClassId - The current class ID to exclude
 * @param category - The category to filter by
 * @returns Promise<ClassType[]>
 */
export async function getRelatedClasses(currentClassId: string, category: string): Promise<ClassType[]> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('classes')
    //   .select('*, instructor:instructors(*)')
    //   .eq('category', category)
    //   .neq('id', currentClassId)
    //   .limit(3);
    
    // if (error) throw error;
    // return data as ClassType[];
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const relatedClasses = mockClasses
          .filter(c => c.category === category && c.id !== currentClassId)
          .slice(0, 3);
        resolve(relatedClasses);
      }, 600); // Simulate network delay
    });
  } catch (error) {
    console.error('Error fetching related classes:', error);
    throw error;
  }
}

/**
 * Get all instructors
 * @returns Promise<InstructorType[]>
 */
export async function getAllInstructors(): Promise<InstructorType[]> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('instructors')
    //   .select('*');
    
    // if (error) throw error;
    // return data as InstructorType[];
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInstructors);
      }, 700); // Simulate network delay
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
}

/**
 * Get an instructor by ID
 * @param id - The instructor ID
 * @returns Promise<InstructorType | null>
 */
export async function getInstructorById(id: string): Promise<InstructorType | null> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('instructors')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    
    // if (error) {
    //   console.error('Error fetching instructor:', error)
    //   return null
    // }
    
    // return data
    
    // For now, use mock data
    const instructor = mockInstructors.find(i => i.id === id);
    
    if (!instructor) {
      return null;
    }
    
    return instructor;
  } catch (error) {
    console.error('Error fetching instructor:', error);
    return null;
  }
}

/**
 * Get classes taught by a specific instructor
 * @param instructorId - The instructor ID
 * @returns Promise<ClassType[]>
 */
export async function getInstructorClasses(instructorId: string): Promise<ClassType[]> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('classes')
    //   .select('*, instructor:instructors(*)')
    //   .eq('instructor_id', instructorId)
    
    // if (error) {
    //   console.error('Error fetching instructor classes:', error)
    //   return []
    // }
    
    // return data
    
    // For now, use mock data
    const instructorClasses = mockClasses.filter(c => c.instructor.id === instructorId);
    return instructorClasses;
  } catch (error) {
    console.error('Error fetching instructor classes:', error);
    return [];
  }
}
