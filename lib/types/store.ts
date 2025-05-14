// Store Product Types

export type ProductCategory = 
  | 'yoga-mats'
  | 'props'
  | 'clothing'
  | 'accessories'
  | 'books'
  | 'gift-cards'
  | 'digital';

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  attributes: {
    [key: string]: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: ProductCategory;
  tags: string[];
  featured: boolean;
  bestseller: boolean;
  new: boolean;
  rating: number;
  reviews: ProductReview[];
  variants?: ProductVariant[];
  attributes?: {
    [key: string]: string;
  };
  relatedProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  attributes?: {
    [key: string]: string;
  };
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
