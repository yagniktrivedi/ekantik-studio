export interface EventType {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  image: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  price: number;
  earlyBirdPrice?: number;
  earlyBirdEndDate?: string;
  capacity: number;
  spotsLeft: number;
  instructors: {
    id: string;
    name: string;
    image: string;
  }[];
  category: string;
  tags: string[];
  featured?: boolean;
  benefits?: string[];
  requirements?: string[];
  includedItems?: string[];
}

export interface EventCategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface EventRegistrationType {
  id: string;
  eventId: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentAmount: number;
  paymentMethod?: string;
  notes?: string;
}
