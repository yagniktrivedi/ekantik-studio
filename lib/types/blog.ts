export interface BlogPostType {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    image: string;
    role?: string;
  };
  categories: string[];
  tags: string[];
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
}

export interface BlogCategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface BlogTagType {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BlogCommentType {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    image?: string;
  };
  content: string;
  createdAt: string;
  replies?: BlogCommentType[];
}
