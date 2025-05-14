import { Product, ProductCategory, Cart } from "@/lib/types/store";

// Mock products data
const mockProducts: Product[] = [
  {
    id: "prod_01",
    name: "Premium Yoga Mat",
    slug: "premium-yoga-mat",
    description: "Our premium yoga mat provides excellent grip and cushioning for your practice. Made from eco-friendly materials, this mat is perfect for all styles of yoga.",
    shortDescription: "Eco-friendly yoga mat with excellent grip and cushioning.",
    price: 85,
    compareAtPrice: 95,
    currency: "GBP",
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1593164842264-854604db2260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    category: "yoga-mats",
    tags: ["yoga", "mat", "eco-friendly", "premium"],
    featured: true,
    bestseller: true,
    new: false,
    rating: 4.8,
    reviews: [
      {
        id: "rev_01",
        userId: "user_01",
        userName: "Sarah J.",
        userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        comment: "This mat is amazing! Great grip and very comfortable for my daily practice.",
        date: "2025-04-15"
      }
    ],
    variants: [
      {
        id: "var_01",
        name: "Blue",
        price: 85,
        sku: "YM-PREM-BLU",
        inventory: 15,
        attributes: {
          color: "Blue"
        }
      },
      {
        id: "var_02",
        name: "Purple",
        price: 85,
        sku: "YM-PREM-PUR",
        inventory: 8,
        attributes: {
          color: "Purple"
        }
      }
    ],
    attributes: {
      material: "Natural rubber and eco-friendly PU",
      thickness: "5mm",
      dimensions: "183cm x 68cm",
      weight: "2.5kg"
    },
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-04-20T14:30:00Z"
  },
  {
    id: "prod_02",
    name: "Cork Yoga Block Set",
    slug: "cork-yoga-block-set",
    description: "Our cork yoga blocks provide stable support for your practice. Made from sustainable cork, these blocks are durable, lightweight, and perfect for all levels of practitioners.",
    shortDescription: "Sustainable cork yoga blocks for stable support.",
    price: 28,
    currency: "GBP",
    images: [
      "https://images.unsplash.com/photo-1558017487-06bf9f82613a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    category: "props",
    tags: ["yoga", "props", "blocks", "cork", "sustainable"],
    featured: false,
    bestseller: true,
    new: false,
    rating: 4.7,
    reviews: [
      {
        id: "rev_02",
        userId: "user_02",
        userName: "Michael T.",
        userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        comment: "Great quality blocks! The cork material provides excellent grip and stability.",
        date: "2025-03-28"
      }
    ],
    attributes: {
      material: "Sustainable cork",
      dimensions: "23cm x 15cm x 10cm",
      weight: "0.5kg each",
      quantity: "Set of 2"
    },
    createdAt: "2025-02-10T09:15:00Z",
    updatedAt: "2025-04-15T11:45:00Z"
  },
  {
    id: "prod_03",
    name: "Organic Cotton Yoga Strap",
    slug: "organic-cotton-yoga-strap",
    description: "Our organic cotton yoga strap helps you deepen stretches and improve flexibility. Perfect for beginners and experienced practitioners alike.",
    shortDescription: "Organic cotton strap to deepen stretches and improve flexibility.",
    price: 15,
    currency: "GBP",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1520&q=80"
    ],
    category: "props",
    tags: ["yoga", "props", "strap", "organic", "cotton"],
    featured: false,
    bestseller: false,
    new: true,
    rating: 4.5,
    reviews: [],
    variants: [
      {
        id: "var_03",
        name: "Natural",
        price: 15,
        sku: "YS-ORG-NAT",
        inventory: 25,
        attributes: {
          color: "Natural"
        }
      },
      {
        id: "var_04",
        name: "Black",
        price: 15,
        sku: "YS-ORG-BLK",
        inventory: 20,
        attributes: {
          color: "Black"
        }
      }
    ],
    attributes: {
      material: "100% organic cotton",
      length: "240cm",
      width: "3.8cm"
    },
    createdAt: "2025-03-05T14:20:00Z",
    updatedAt: "2025-04-10T09:30:00Z"
  },
  {
    id: "prod_04",
    name: "Meditation Cushion",
    slug: "meditation-cushion",
    description: "Our meditation cushion provides comfortable support for your meditation practice. Filled with organic buckwheat hulls, it conforms to your body for optimal comfort and stability.",
    shortDescription: "Comfortable cushion for meditation practice.",
    price: 45,
    currency: "GBP",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    category: "props",
    tags: ["meditation", "cushion", "zafu", "buckwheat"],
    featured: true,
    bestseller: false,
    new: false,
    rating: 4.9,
    reviews: [
      {
        id: "rev_03",
        userId: "user_03",
        userName: "Emma W.",
        userAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        comment: "This cushion has transformed my meditation practice. So comfortable!",
        date: "2025-04-02"
      }
    ],
    variants: [
      {
        id: "var_05",
        name: "Indigo",
        price: 45,
        sku: "MC-BW-IND",
        inventory: 12,
        attributes: {
          color: "Indigo"
        }
      },
      {
        id: "var_06",
        name: "Sage",
        price: 45,
        sku: "MC-BW-SAG",
        inventory: 8,
        attributes: {
          color: "Sage"
        }
      }
    ],
    attributes: {
      material: "Organic cotton cover, buckwheat hull filling",
      dimensions: "33cm diameter, 15cm height",
      weight: "1.2kg"
    },
    createdAt: "2025-01-20T11:30:00Z",
    updatedAt: "2025-04-05T16:45:00Z"
  },
  {
    id: "prod_05",
    name: "Yoga Practice Journal",
    slug: "yoga-practice-journal",
    description: "Track your yoga journey with our beautifully designed practice journal. Includes space for recording poses, reflections, and progress.",
    shortDescription: "Journal to track your yoga journey and progress.",
    price: 22,
    currency: "GBP",
    images: [
      "https://images.unsplash.com/photo-1598520106830-8c45c2035460?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    category: "books",
    tags: ["journal", "yoga", "mindfulness", "practice"],
    featured: false,
    bestseller: false,
    new: true,
    rating: 4.6,
    reviews: [],
    attributes: {
      pages: "120 pages",
      dimensions: "21cm x 15cm",
      material: "Recycled paper, hardcover"
    },
    createdAt: "2025-03-15T13:45:00Z",
    updatedAt: "2025-04-18T10:20:00Z"
  },
  {
    id: "prod_06",
    name: "Ekantik Gift Card",
    slug: "ekantik-gift-card",
    description: "Give the gift of wellness with an Ekantik Studio gift card. Perfect for classes, workshops, or store purchases.",
    shortDescription: "Gift card for Ekantik Studio services and products.",
    price: 50,
    currency: "GBP",
    images: [
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    category: "gift-cards",
    tags: ["gift", "gift card", "present"],
    featured: true,
    bestseller: true,
    new: false,
    rating: 5,
    reviews: [],
    variants: [
      {
        id: "var_07",
        name: "£50 Gift Card",
        price: 50,
        sku: "GC-50",
        inventory: 999,
        attributes: {
          value: "50"
        }
      },
      {
        id: "var_08",
        name: "£100 Gift Card",
        price: 100,
        sku: "GC-100",
        inventory: 999,
        attributes: {
          value: "100"
        }
      },
      {
        id: "var_09",
        name: "£200 Gift Card",
        price: 200,
        sku: "GC-200",
        inventory: 999,
        attributes: {
          value: "200"
        }
      }
    ],
    attributes: {
      format: "Digital or physical",
      validity: "Valid for 12 months"
    },
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-04-01T15:30:00Z"
  }
];

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('products')
    //   .select('*');
    
    // if (error) throw error;
    // return data as Product[];
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 500); // Simulate network delay
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('products')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    
    // if (error) throw error;
    // return data as Product;
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id) || null;
        resolve(product);
      }, 300); // Simulate network delay
    });
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('products')
    //   .select('*')
    //   .eq('slug', slug)
    //   .single();
    
    // if (error) throw error;
    // return data as Product;
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.slug === slug) || null;
        resolve(product);
      }, 300); // Simulate network delay
    });
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('products')
    //   .select('*')
    //   .eq('category', category);
    
    // if (error) throw error;
    // return data as Product[];
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = mockProducts.filter(p => p.category === category);
        resolve(products);
      }, 400); // Simulate network delay
    });
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // In a real application, we would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('products')
    //   .select('*')
    //   .eq('featured', true);
    
    // if (error) throw error;
    // return data as Product[];
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = mockProducts.filter(p => p.featured);
        resolve(products);
      }, 400); // Simulate network delay
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

// Get related products
export async function getRelatedProducts(productId: string): Promise<Product[]> {
  try {
    // In a real implementation, we would fetch related products based on the product's category or tags
    // For now, just return a few random products that aren't the current one
    return new Promise((resolve) => {
      setTimeout(() => {
        const otherProducts = mockProducts.filter(p => p.id !== productId);
        const randomProducts = otherProducts.sort(() => 0.5 - Math.random()).slice(0, 3);
        resolve(randomProducts);
      }, 400); // Simulate network delay
    });
  } catch (error) {
    console.error(`Error fetching related products for product ${productId}:`, error);
    throw error;
  }
}
