import { EventType, EventCategoryType } from "../types/events";

// Mock events data
const events: EventType[] = [
  {
    id: "1",
    title: "Summer Solstice Yoga Retreat",
    slug: "summer-solstice-yoga-retreat",
    description: "Celebrate the longest day of the year with a rejuvenating yoga retreat in the heart of the Cotswolds.",
    longDescription: `
      <p>Join us for a transformative weekend retreat to celebrate the summer solstice. This special event combines yoga, meditation, and nature connection to honor the peak of the sun's energy and the abundance of summer.</p>
      
      <p>Set in the beautiful Cotswolds countryside, this retreat offers a perfect balance of energizing and restorative practices. Morning sessions will harness the vibrant solar energy with dynamic yoga flows, while evening practices will invite deep relaxation and reflection.</p>
      
      <p>Throughout the weekend, you'll enjoy:</p>
      <ul>
        <li>Daily yoga and meditation sessions led by our senior instructors</li>
        <li>Special solstice ceremony and fire ritual</li>
        <li>Guided nature walks and forest bathing</li>
        <li>Delicious, locally-sourced vegetarian meals</li>
        <li>Comfortable accommodation in a historic country house</li>
        <li>Free time to explore the stunning surroundings</li>
      </ul>
      
      <p>Whether you're a seasoned yogi or relatively new to the practice, this retreat offers a supportive environment to deepen your connection to yourself, nature, and the rhythms of the seasons.</p>
      
      <p>Space is limited to ensure a intimate and personalized experience, so early booking is recommended.</p>
    `,
    image: "/images/events/summer-retreat.jpg",
    startDate: "2025-06-20",
    endDate: "2025-06-22",
    time: "Arrival from 4pm Friday, departure 2pm Sunday",
    location: "Meadowview Manor, Cotswolds",
    price: 495,
    earlyBirdPrice: 425,
    earlyBirdEndDate: "2025-05-15",
    capacity: 20,
    spotsLeft: 8,
    instructors: [
      {
        id: "1",
        name: "Maya Patel",
        image: "/images/instructors/maya-patel.jpg"
      },
      {
        id: "3",
        name: "David Chen",
        image: "/images/instructors/david-chen.jpg"
      }
    ],
    category: "Retreats",
    tags: ["yoga", "meditation", "retreat", "summer", "nature"],
    featured: true,
    benefits: [
      "Deepen your yoga and meditation practice",
      "Connect with nature and the seasonal rhythms",
      "Rest and recharge in beautiful surroundings",
      "Build community with like-minded practitioners",
      "Enjoy nourishing, healthy meals"
    ],
    requirements: [
      "Suitable for all levels, from beginners to advanced practitioners",
      "Please bring your own yoga mat and comfortable clothing",
      "Let us know of any dietary requirements in advance"
    ],
    includedItems: [
      "2 nights accommodation",
      "All meals and refreshments",
      "All yoga and meditation sessions",
      "Guided nature walks",
      "Solstice ceremony materials"
    ]
  },
  {
    id: "2",
    title: "Yin & Restorative Workshop",
    slug: "yin-restorative-workshop",
    description: "A deeply nurturing afternoon of slow, supported postures to release tension and promote healing.",
    longDescription: `
      <p>In our fast-paced modern world, finding time to slow down and truly rest is essential for our wellbeing. This special workshop combines the practices of Yin and Restorative yoga to offer a deeply nurturing experience for body and mind.</p>
      
      <p>Yin yoga works deeply into the connective tissues through long-held, passive poses, while Restorative yoga uses props to fully support the body, allowing for complete relaxation. Together, these practices create a powerful antidote to stress and busyness.</p>
      
      <p>During this 3-hour workshop, you'll:</p>
      <ul>
        <li>Learn the principles and benefits of both Yin and Restorative yoga</li>
        <li>Experience a carefully sequenced practice targeting different areas of the body</li>
        <li>Discover how to use props effectively for maximum support and comfort</li>
        <li>Explore breathing techniques to enhance relaxation</li>
        <li>Enjoy an extended guided relaxation to close the practice</li>
      </ul>
      
      <p>This workshop is perfect for anyone feeling stressed, fatigued, or in need of deep rest. It's also ideal for those recovering from illness or injury, or simply looking to balance more active yoga practices.</p>
      
      <p>All props will be provided, and no previous yoga experience is necessary. Please wear comfortable, warm clothing as the body temperature can drop during these slow practices.</p>
    `,
    image: "/images/events/yin-workshop.jpg",
    startDate: "2025-05-18",
    endDate: "2025-05-18",
    time: "2:00 PM - 5:00 PM",
    location: "Ekantik Studio, Main Practice Room",
    price: 45,
    capacity: 15,
    spotsLeft: 6,
    instructors: [
      {
        id: "2",
        name: "Sarah Johnson",
        image: "/images/instructors/sarah-johnson.jpg"
      }
    ],
    category: "Workshops",
    tags: ["yin yoga", "restorative", "relaxation", "stress relief"],
    benefits: [
      "Release deep-held tension in the body",
      "Calm the nervous system and reduce stress",
      "Improve flexibility and joint mobility",
      "Enhance quality of sleep",
      "Learn techniques to practice at home"
    ],
    requirements: [
      "No previous yoga experience required",
      "Suitable for all levels",
      "Please wear warm, comfortable clothing",
      "Arrive 10-15 minutes early to settle in"
    ],
    includedItems: [
      "All props (bolsters, blankets, blocks, straps)",
      "Herbal tea after the workshop",
      "Handout with practice suggestions"
    ]
  },
  {
    id: "3",
    title: "Introduction to Meditation",
    slug: "introduction-to-meditation",
    description: "A four-week course for beginners to establish a sustainable meditation practice.",
    longDescription: `
      <p>Meditation is one of the most valuable skills you can develop for your mental and emotional wellbeing. This four-week course is designed specifically for beginners who want to establish a regular meditation practice but don't know where to start.</p>
      
      <p>Each week builds progressively on the previous session, giving you a comprehensive foundation in meditation techniques and principles. The course is practical and accessible, with plenty of guided practice and time for questions.</p>
      
      <p>Weekly topics include:</p>
      <ul>
        <li><strong>Week 1:</strong> Foundations of Meditation - Posture, breath awareness, and creating a sustainable practice</li>
        <li><strong>Week 2:</strong> Working with the Busy Mind - Techniques for focus and dealing with distractions</li>
        <li><strong>Week 3:</strong> Heart-Centered Practices - Cultivating compassion and loving-kindness</li>
        <li><strong>Week 4:</strong> Integrating Meditation into Daily Life - Short practices and mindfulness in action</li>
      </ul>
      
      <p>By the end of the course, you'll have:</p>
      <ul>
        <li>Experience with several different meditation techniques</li>
        <li>Tools to work with common challenges like restlessness and sleepiness</li>
        <li>A clear understanding of how to establish a home practice</li>
        <li>Resources for continuing your meditation journey</li>
      </ul>
      
      <p>This course is taught by David Chen, our experienced meditation instructor who specializes in making ancient practices accessible to modern practitioners.</p>
    `,
    image: "/images/events/meditation-course.jpg",
    startDate: "2025-05-07",
    endDate: "2025-05-28",
    time: "7:00 PM - 8:30 PM (Wednesdays)",
    location: "Ekantik Studio, Meditation Room",
    price: 95,
    earlyBirdPrice: 80,
    earlyBirdEndDate: "2025-04-23",
    capacity: 12,
    spotsLeft: 5,
    instructors: [
      {
        id: "3",
        name: "David Chen",
        image: "/images/instructors/david-chen.jpg"
      }
    ],
    category: "Courses",
    tags: ["meditation", "beginners", "mindfulness", "mental health"],
    benefits: [
      "Reduce stress and anxiety",
      "Improve focus and concentration",
      "Develop greater self-awareness",
      "Learn to respond rather than react to challenges",
      "Create a sustainable personal practice"
    ],
    requirements: [
      "No previous meditation experience necessary",
      "Commitment to attend all four sessions",
      "10-15 minutes daily for home practice",
      "Bring a notebook for reflections"
    ],
    includedItems: [
      "Meditation cushions and props",
      "Course handbook with weekly practices",
      "Recorded guided meditations for home practice",
      "Herbal tea after each session"
    ]
  },
  {
    id: "4",
    title: "Yoga for Athletes Workshop",
    slug: "yoga-for-athletes-workshop",
    description: "Learn how yoga can enhance athletic performance, prevent injuries, and speed recovery.",
    longDescription: `
      <p>Whether you're a runner, cyclist, swimmer, or team sport player, yoga can be a game-changer for your athletic performance. This specialized workshop is designed specifically for athletes looking to incorporate yoga into their training regimen.</p>
      
      <p>Led by Michael Roberts, who has worked with professional athletes and sports teams, this workshop focuses on the specific needs of active individuals. You'll learn how yoga can help you improve flexibility, build functional strength, enhance recovery, and develop mental focus.</p>
      
      <p>The workshop includes:</p>
      <ul>
        <li>A targeted yoga practice addressing common areas of tightness in athletes</li>
        <li>Sport-specific modifications and variations</li>
        <li>Recovery techniques to use after training or competition</li>
        <li>Breathing exercises for performance enhancement</li>
        <li>Mental focus and visualization practices</li>
      </ul>
      
      <p>You'll also receive a take-home sequence that can be adapted to different training phases and time constraints, making it easy to incorporate yoga into your existing routine.</p>
      
      <p>This workshop is suitable for athletes of all levels, from weekend warriors to competitive performers. No previous yoga experience is required - just bring an open mind and be ready to move!</p>
    `,
    image: "/images/events/athletes-workshop.jpg",
    startDate: "2025-06-08",
    endDate: "2025-06-08",
    time: "1:00 PM - 4:00 PM",
    location: "Ekantik Studio, Main Practice Room",
    price: 50,
    capacity: 20,
    spotsLeft: 12,
    instructors: [
      {
        id: "5",
        name: "Michael Roberts",
        image: "/images/instructors/michael-roberts.jpg"
      }
    ],
    category: "Workshops",
    tags: ["yoga", "athletes", "sports", "performance", "recovery"],
    benefits: [
      "Improve flexibility in key areas for your sport",
      "Enhance recovery between training sessions",
      "Prevent common sport-specific injuries",
      "Develop mental focus for competition",
      "Learn techniques to use pre and post-workout"
    ],
    requirements: [
      "No yoga experience necessary",
      "Please bring your own mat if you have one",
      "Wear comfortable athletic clothing",
      "Bring a water bottle and small towel"
    ],
    includedItems: [
      "Comprehensive handout with sport-specific sequences",
      "Access to online follow-along videos",
      "Post-workshop refreshments"
    ]
  },
  {
    id: "5",
    title: "Ayurveda & Yoga Weekend",
    slug: "ayurveda-yoga-weekend",
    description: "Discover your unique constitution and learn personalized yoga and lifestyle practices for optimal wellbeing.",
    longDescription: `
      <p>Ayurveda, the sister science of yoga, offers a personalized approach to health and wellness based on your unique constitution or "dosha." This special weekend workshop combines the wisdom of Ayurveda with tailored yoga practices to help you create balance in body and mind.</p>
      
      <p>Led by Emma Wilson, who specializes in Ayurvedic wellness, this workshop will introduce you to the fundamental principles of Ayurveda and how they can be applied to your yoga practice and daily life.</p>
      
      <p>Over the course of the weekend, you'll:</p>
      <ul>
        <li>Discover your unique Ayurvedic constitution (Vata, Pitta, Kapha)</li>
        <li>Learn how to recognize imbalances in your system</li>
        <li>Experience yoga practices tailored to each dosha</li>
        <li>Explore Ayurvedic daily routines for optimal health</li>
        <li>Learn about seasonal eating and simple Ayurvedic recipes</li>
        <li>Create a personalized wellness plan to take home</li>
      </ul>
      
      <p>Each day includes both theory and practice, with plenty of time for questions and personalized guidance. You'll come away with practical tools to apply Ayurvedic wisdom to your modern life.</p>
      
      <p>This workshop is suitable for anyone interested in a holistic approach to health and wellness. No previous knowledge of Ayurveda is required.</p>
    `,
    image: "/images/events/ayurveda-weekend.jpg",
    startDate: "2025-07-12",
    endDate: "2025-07-13",
    time: "10:00 AM - 4:00 PM (both days)",
    location: "Ekantik Studio",
    price: 175,
    earlyBirdPrice: 150,
    earlyBirdEndDate: "2025-06-12",
    capacity: 18,
    spotsLeft: 15,
    instructors: [
      {
        id: "4",
        name: "Emma Wilson",
        image: "/images/instructors/emma-wilson.jpg"
      }
    ],
    category: "Workshops",
    tags: ["ayurveda", "yoga", "wellness", "holistic health"],
    featured: true,
    benefits: [
      "Understand your unique mind-body constitution",
      "Learn personalized yoga practices for your type",
      "Discover dietary guidelines that support your wellbeing",
      "Establish daily routines for optimal health",
      "Create sustainable wellness habits"
    ],
    requirements: [
      "No previous knowledge of Ayurveda required",
      "Please bring a yoga mat, notebook, and water bottle",
      "Wear comfortable clothing for practice",
      "Come with an open mind and curiosity"
    ],
    includedItems: [
      "Ayurvedic constitution assessment",
      "Comprehensive workshop manual",
      "Ayurvedic lunch on both days",
      "Herbal teas and snacks",
      "Take-home personalized wellness plan"
    ]
  }
];

// Mock event categories
const eventCategories: EventCategoryType[] = [
  {
    id: "1",
    name: "Workshops",
    slug: "workshops",
    description: "Dive deeper into specific aspects of yoga and wellness",
    count: 15
  },
  {
    id: "2",
    name: "Retreats",
    slug: "retreats",
    description: "Immersive multi-day experiences in beautiful locations",
    count: 4
  },
  {
    id: "3",
    name: "Courses",
    slug: "courses",
    description: "Progressive learning over multiple sessions",
    count: 6
  },
  {
    id: "4",
    name: "Special Events",
    slug: "special-events",
    description: "Celebrations, community gatherings, and unique offerings",
    count: 8
  }
];

// API Functions
export async function getAllEvents() {
  // In a real app, this would fetch from Supabase
  return events;
}

export async function getFeaturedEvents() {
  // In a real app, this would fetch from Supabase
  return events.filter(event => event.featured);
}

export async function getUpcomingEvents(limit?: number) {
  // In a real app, this would fetch from Supabase
  const today = new Date().toISOString().split('T')[0];
  const upcoming = events
    .filter(event => event.startDate >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getEventBySlug(slug: string) {
  // In a real app, this would fetch from Supabase
  return events.find(event => event.slug === slug) || null;
}

export async function getEventById(id: string) {
  // In a real app, this would fetch from Supabase
  return events.find(event => event.id === id) || null;
}

export async function getEventsByCategory(categorySlug: string) {
  // In a real app, this would fetch from Supabase
  const category = eventCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return events.filter(event => event.category === category.name);
}

export async function getEventsByInstructor(instructorId: string) {
  // In a real app, this would fetch from Supabase
  return events.filter(event => 
    event.instructors.some(instructor => instructor.id === instructorId)
  );
}

export async function getAllEventCategories() {
  // In a real app, this would fetch from Supabase
  return eventCategories;
}

export async function searchEvents(query: string) {
  // In a real app, this would use a more sophisticated search algorithm
  const lowerCaseQuery = query.toLowerCase();
  
  return events.filter(event => 
    event.title.toLowerCase().includes(lowerCaseQuery) || 
    event.description.toLowerCase().includes(lowerCaseQuery) || 
    (event.longDescription && event.longDescription.toLowerCase().includes(lowerCaseQuery)) ||
    event.category.toLowerCase().includes(lowerCaseQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
}
