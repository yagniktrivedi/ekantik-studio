export interface GalleryImageType {
  id: string;
  title: string;
  description?: string;
  src: string;
  alt: string;
  category: string;
  tags: string[];
  featured?: boolean;
  width: number;
  height: number;
  createdAt: string;
}

export interface GalleryCategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}
