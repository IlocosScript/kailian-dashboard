// Legacy types for backward compatibility
export interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
  imageUrl?: string;
}

export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  rating: number;
  imageUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

// Re-export API types for consistency
export type { NewsArticle, TouristSpot as ApiTouristSpot } from '@/lib/api';