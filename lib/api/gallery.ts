import { GalleryImageType, GalleryCategoryType } from "../types/gallery";

// Mock gallery images data
const galleryImages: GalleryImageType[] = [
  {
    id: "1",
    title: "Main Studio Space",
    description: "Our spacious main studio with natural light and bamboo flooring",
    src: "/images/gallery/studio-1.jpg",
    alt: "Ekantik Studio main yoga room with bamboo flooring and large windows",
    category: "Studio",
    tags: ["studio", "interior", "space"],
    featured: true,
    width: 1200,
    height: 800,
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Meditation Room",
    description: "Peaceful meditation space with cushions and soft lighting",
    src: "/images/gallery/meditation-room.jpg",
    alt: "Meditation room with floor cushions and ambient lighting",
    category: "Studio",
    tags: ["meditation", "interior", "space"],
    width: 1200,
    height: 800,
    createdAt: "2025-01-15T10:05:00Z"
  },
  {
    id: "3",
    title: "Vinyasa Flow Class",
    description: "Students practicing in our morning Vinyasa Flow class",
    src: "/images/gallery/vinyasa-class.jpg",
    alt: "Group of students in downward dog pose during a Vinyasa class",
    category: "Classes",
    tags: ["class", "vinyasa", "group"],
    featured: true,
    width: 1200,
    height: 800,
    createdAt: "2025-02-10T09:30:00Z"
  },
  {
    id: "4",
    title: "Yin Yoga Session",
    description: "Deep stretching in our evening Yin Yoga class",
    src: "/images/gallery/yin-class.jpg",
    alt: "Students in supported forward fold during Yin Yoga class",
    category: "Classes",
    tags: ["class", "yin", "group"],
    width: 1200,
    height: 800,
    createdAt: "2025-02-12T18:30:00Z"
  },
  {
    id: "5",
    title: "Summer Solstice Retreat",
    description: "Group photo from our Summer Solstice Retreat in the Cotswolds",
    src: "/images/gallery/retreat-group.jpg",
    alt: "Group of retreat participants in a garden setting",
    category: "Events",
    tags: ["retreat", "group", "outdoor"],
    featured: true,
    width: 1200,
    height: 800,
    createdAt: "2025-06-21T12:00:00Z"
  },
  {
    id: "6",
    title: "Ayurveda Workshop",
    description: "Learning about Ayurvedic principles in our weekend workshop",
    src: "/images/gallery/ayurveda-workshop.jpg",
    alt: "Instructor demonstrating Ayurvedic herbs and preparations",
    category: "Events",
    tags: ["workshop", "ayurveda", "learning"],
    width: 1200,
    height: 800,
    createdAt: "2025-03-15T14:00:00Z"
  },
  {
    id: "7",
    title: "Maya Teaching",
    description: "Our founder Maya guiding students through a sequence",
    src: "/images/gallery/maya-teaching.jpg",
    alt: "Maya demonstrating a yoga pose to a class",
    category: "Instructors",
    tags: ["instructor", "teaching", "class"],
    featured: true,
    width: 1200,
    height: 800,
    createdAt: "2025-02-05T10:30:00Z"
  },
  {
    id: "8",
    title: "David's Meditation Session",
    description: "David leading a guided meditation session",
    src: "/images/gallery/david-meditation.jpg",
    alt: "David seated in front of a meditation class",
    category: "Instructors",
    tags: ["instructor", "meditation", "class"],
    width: 1200,
    height: 800,
    createdAt: "2025-02-08T17:00:00Z"
  },
  {
    id: "9",
    title: "Studio Reception",
    description: "Our welcoming reception area and retail space",
    src: "/images/gallery/reception.jpg",
    alt: "Reception desk and retail area with yoga props and products",
    category: "Studio",
    tags: ["reception", "interior", "retail"],
    width: 1200,
    height: 800,
    createdAt: "2025-01-15T10:10:00Z"
  },
  {
    id: "10",
    title: "Changing Facilities",
    description: "Clean and modern changing rooms and shower facilities",
    src: "/images/gallery/changing-room.jpg",
    alt: "Changing room with lockers and benches",
    category: "Studio",
    tags: ["facilities", "interior"],
    width: 1200,
    height: 800,
    createdAt: "2025-01-15T10:15:00Z"
  },
  {
    id: "11",
    title: "Community Lounge",
    description: "Relaxing community space for before and after classes",
    src: "/images/gallery/lounge.jpg",
    alt: "Comfortable seating area with tea station",
    category: "Studio",
    tags: ["lounge", "interior", "community"],
    width: 1200,
    height: 800,
    createdAt: "2025-01-15T10:20:00Z"
  },
  {
    id: "12",
    title: "Aerial Yoga Class",
    description: "Students exploring inversions in our Aerial Yoga class",
    src: "/images/gallery/aerial-yoga.jpg",
    alt: "Students hanging in silk hammocks during aerial yoga",
    category: "Classes",
    tags: ["class", "aerial", "group"],
    featured: true,
    width: 1200,
    height: 800,
    createdAt: "2025-02-15T15:30:00Z"
  },
  {
    id: "13",
    title: "Prenatal Yoga",
    description: "Specialized prenatal yoga class for expectant mothers",
    src: "/images/gallery/prenatal-yoga.jpg",
    alt: "Group of pregnant women in a modified yoga pose",
    category: "Classes",
    tags: ["class", "prenatal", "specialized"],
    width: 1200,
    height: 800,
    createdAt: "2025-02-18T11:00:00Z"
  },
  {
    id: "14",
    title: "Kids Yoga Fun",
    description: "Children enjoying our weekend kids yoga program",
    src: "/images/gallery/kids-yoga.jpg",
    alt: "Children in playful yoga poses with an instructor",
    category: "Classes",
    tags: ["class", "kids", "family"],
    width: 1200,
    height: 800,
    createdAt: "2025-02-22T10:00:00Z"
  },
  {
    id: "15",
    title: "Full Moon Ceremony",
    description: "Special full moon meditation and sound healing event",
    src: "/images/gallery/full-moon-event.jpg",
    alt: "Group meditation with candles during full moon ceremony",
    category: "Events",
    tags: ["event", "ceremony", "meditation"],
    width: 1200,
    height: 800,
    createdAt: "2025-04-23T20:00:00Z"
  },
  {
    id: "16",
    title: "Yoga Teacher Training",
    description: "Students in our 200-hour yoga teacher training program",
    src: "/images/gallery/teacher-training.jpg",
    alt: "Teacher training students practicing teaching skills",
    category: "Events",
    tags: ["training", "education", "group"],
    width: 1200,
    height: 800,
    createdAt: "2025-05-10T09:00:00Z"
  },
  {
    id: "17",
    title: "Sarah's Restorative Class",
    description: "Sarah guiding students through restorative poses",
    src: "/images/gallery/sarah-teaching.jpg",
    alt: "Sarah adjusting a student in a restorative pose",
    category: "Instructors",
    tags: ["instructor", "restorative", "adjustment"],
    width: 1200,
    height: 800,
    createdAt: "2025-02-10T19:30:00Z"
  },
  {
    id: "18",
    title: "Michael's Strength Workshop",
    description: "Michael teaching advanced arm balances",
    src: "/images/gallery/michael-workshop.jpg",
    alt: "Michael demonstrating an arm balance pose",
    category: "Instructors",
    tags: ["instructor", "workshop", "advanced"],
    width: 1200,
    height: 800,
    createdAt: "2025-02-25T16:00:00Z"
  },
  {
    id: "19",
    title: "Studio Exterior",
    description: "The beautiful exterior of our studio building",
    src: "/images/gallery/exterior.jpg",
    alt: "Exterior view of Ekantik Studio building",
    category: "Studio",
    tags: ["exterior", "building", "architecture"],
    width: 1200,
    height: 800,
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "20",
    title: "Garden Meditation Space",
    description: "Our peaceful garden area for outdoor practice",
    src: "/images/gallery/garden.jpg",
    alt: "Zen garden with seating areas for outdoor meditation",
    category: "Studio",
    tags: ["garden", "outdoor", "meditation"],
    featured: true,
    width: 1200,
    height: 800,
    createdAt: "2025-01-15T10:25:00Z"
  },
  {
    id: "21",
    title: "Partner Yoga Workshop",
    description: "Students exploring connection through partner yoga",
    src: "/images/gallery/partner-yoga.jpg",
    alt: "Pairs of students practicing partner yoga poses",
    category: "Classes",
    tags: ["class", "partner", "workshop"],
    width: 1200,
    height: 800,
    createdAt: "2025-03-05T18:00:00Z"
  },
  {
    id: "22",
    title: "Yoga Nidra Session",
    description: "Deep relaxation in our popular Yoga Nidra class",
    src: "/images/gallery/yoga-nidra.jpg",
    alt: "Students lying in savasana with props during Yoga Nidra",
    category: "Classes",
    tags: ["class", "relaxation", "nidra"],
    width: 1200,
    height: 800,
    createdAt: "2025-03-08T20:00:00Z"
  },
  {
    id: "23",
    title: "Autumn Equinox Gathering",
    description: "Community celebration of the autumn equinox",
    src: "/images/gallery/autumn-event.jpg",
    alt: "Group gathered in a circle during autumn equinox event",
    category: "Events",
    tags: ["event", "seasonal", "community"],
    width: 1200,
    height: 800,
    createdAt: "2025-09-22T18:00:00Z"
  },
  {
    id: "24",
    title: "Wellness Market",
    description: "Local vendors at our monthly wellness market",
    src: "/images/gallery/wellness-market.jpg",
    alt: "Stalls with wellness products and visitors browsing",
    category: "Events",
    tags: ["event", "market", "community"],
    width: 1200,
    height: 800,
    createdAt: "2025-03-20T11:00:00Z"
  }
];

// Mock gallery categories
const galleryCategories: GalleryCategoryType[] = [
  {
    id: "1",
    name: "Studio",
    slug: "studio",
    description: "Our beautiful studio spaces and facilities",
    count: 6
  },
  {
    id: "2",
    name: "Classes",
    slug: "classes",
    description: "Images from our regular classes and specialized sessions",
    count: 7
  },
  {
    id: "3",
    name: "Events",
    slug: "events",
    description: "Workshops, retreats, and special events",
    count: 6
  },
  {
    id: "4",
    name: "Instructors",
    slug: "instructors",
    description: "Our talented team of instructors in action",
    count: 5
  }
];

// API Functions
export async function getAllGalleryImages() {
  // In a real app, this would fetch from Supabase
  return galleryImages;
}

export async function getFeaturedGalleryImages() {
  // In a real app, this would fetch from Supabase
  return galleryImages.filter(image => image.featured);
}

export async function getGalleryImagesByCategory(categorySlug: string) {
  // In a real app, this would fetch from Supabase
  const category = galleryCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return galleryImages.filter(image => image.category === category.name);
}

export async function getGalleryImagesByTag(tag: string) {
  // In a real app, this would fetch from Supabase
  return galleryImages.filter(image => image.tags.includes(tag));
}

export async function getAllGalleryCategories() {
  // In a real app, this would fetch from Supabase
  return galleryCategories;
}

export async function getGalleryImageById(id: string) {
  // In a real app, this would fetch from Supabase
  return galleryImages.find(image => image.id === id) || null;
}
