const BASE_URL = 'https://alisto.gregdoesdev.xyz';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

// API service class
class ApiService {
  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // News API methods
  async getNews(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
  }): Promise<PaginatedResponse<NewsArticle>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.isFeatured !== undefined) searchParams.append('isFeatured', params.isFeatured.toString());
    if (params?.isTrending !== undefined) searchParams.append('isTrending', params.isTrending.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/api/news${queryString ? `?${queryString}` : ''}`;
    
    return this.request<NewsArticle[]>(endpoint);
  }

  async getNewsById(id: string): Promise<ApiResponse<NewsArticle>> {
    return this.request<NewsArticle>(`/api/news/${id}`);
  }

  async getFeaturedNews(): Promise<ApiResponse<NewsArticle[]>> {
    return this.request<NewsArticle[]>('/api/news/featured');
  }

  async getTrendingNews(): Promise<ApiResponse<NewsArticle[]>> {
    return this.request<NewsArticle[]>('/api/news/trending');
  }

  // Tourist Spots API methods
  async getTouristSpots(params?: {
    page?: number;
    pageSize?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<TouristSpot>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/api/touristspot${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TouristSpot[]>(endpoint);
  }

  async getTouristSpotById(id: string): Promise<ApiResponse<TouristSpot>> {
    return this.request<TouristSpot>(`/api/touristspot/${id}`);
  }
}

// News Article interface based on API documentation
export interface NewsArticle {
  id: number;
  title: string;
  summary?: string;
  fullContent?: string;
  imageUrl?: string;
  publishedDate?: string;
  publishedTime?: string;
  location: string;
  expectedAttendees?: string;
  category: string;
  author: string;
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  viewCount: number;
  status: string;
}

// Tourist Spot interface based on API documentation
export interface TouristSpot {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  location: string;
  coordinates?: string;
  address: string;
  openingHours?: string;
  entryFee?: string;
  highlights: string[];
  travelTime?: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Export singleton instance
export const apiService = new ApiService();

// Helper function to get full image URL
export const getImageUrl = (imageUrl?: string, type: 'news' | 'tourist-spots' = 'news'): string => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // If it starts with /uploads, prepend base URL
  if (imageUrl.startsWith('/uploads')) {
    return `${BASE_URL}${imageUrl}`;
  }
  
  // Otherwise, construct the full URL
  return `${BASE_URL}/uploads/${type}/${imageUrl}`;
};

// News categories from API documentation
export const NEWS_CATEGORIES = [
  'Local',
  'National',
  'International',
  'Sports',
  'Entertainment',
  'Technology',
  'Business',
  'Health',
  'Education',
  'Environment',
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];