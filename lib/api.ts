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
      console.log(`Making API request to: ${BASE_URL}${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async requestWithFormData<T>(endpoint: string, method: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      console.log(`Making ${method} request to: ${BASE_URL}${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`HTTP error! status: ${response.status}`, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async deleteRequest<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      console.log(`Making DELETE request to: ${BASE_URL}${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`HTTP error! status: ${response.status}`, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
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

  async createNews(newsData: Partial<NewsArticle>, imageFile?: File): Promise<ApiResponse<NewsArticle>> {
    const formData = new FormData();
    
    // Add required fields
    if (newsData.title) formData.append('title', newsData.title);
    if (newsData.fullContent) formData.append('fullContent', newsData.fullContent);
    if (newsData.location) formData.append('location', newsData.location);
    if (newsData.category) formData.append('category', newsData.category);
    if (newsData.author) formData.append('author', newsData.author);
    formData.append('isFeatured', (newsData.isFeatured || false).toString());
    formData.append('isTrending', (newsData.isTrending || false).toString());
    formData.append('status', newsData.status || 'Draft');
    
    // Add optional fields
    if (newsData.summary) formData.append('summary', newsData.summary);
    if (newsData.publishedDate) formData.append('publishedDate', newsData.publishedDate);
    if (newsData.publishedTime) formData.append('publishedTime', newsData.publishedTime);
    if (newsData.expectedAttendees) formData.append('expectedAttendees', newsData.expectedAttendees);
    if (newsData.tags && newsData.tags.length > 0) {
      formData.append('tags', newsData.tags.join(','));
    }
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return this.requestWithFormData<NewsArticle>('/api/news/with-image', 'POST', formData);
  }

  async updateNews(id: number, newsData: Partial<NewsArticle>, imageFile?: File): Promise<ApiResponse<NewsArticle>> {
    const formData = new FormData();
    
    // Add all fields, including empty strings to prevent backend errors
    if (newsData.title !== undefined) formData.append('title', newsData.title);
    if (newsData.summary !== undefined) formData.append('summary', newsData.summary);
    if (newsData.fullContent !== undefined) formData.append('fullContent', newsData.fullContent);
    if (newsData.location !== undefined) formData.append('location', newsData.location);
    if (newsData.category !== undefined) formData.append('category', newsData.category);
    if (newsData.author !== undefined) formData.append('author', newsData.author);
    if (newsData.publishedDate !== undefined) formData.append('publishedDate', newsData.publishedDate);
    if (newsData.publishedTime !== undefined) formData.append('publishedTime', newsData.publishedTime);
    if (newsData.expectedAttendees !== undefined) formData.append('expectedAttendees', newsData.expectedAttendees);
    if (newsData.isFeatured !== undefined) formData.append('isFeatured', newsData.isFeatured.toString());
    if (newsData.isTrending !== undefined) formData.append('isTrending', newsData.isTrending.toString());
    if (newsData.status !== undefined) formData.append('status', newsData.status);
    if (newsData.tags !== undefined) {
      formData.append('tags', (newsData.tags || []).join(','));
    }
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return this.requestWithFormData<NewsArticle>(`/api/news/${id}/with-image`, 'PUT', formData);
  }

  async deleteNews(id: number): Promise<ApiResponse<{}>> {
    return this.deleteRequest<{}>(`/api/news/${id}`);
  }

  async publishNews(id: number): Promise<ApiResponse<NewsArticle>> {
    try {
      console.log(`Making PATCH request to: ${BASE_URL}/api/news/${id}/publish`);
      const response = await fetch(`${BASE_URL}/api/news/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`HTTP error! status: ${response.status}`, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async unpublishNews(id: number): Promise<ApiResponse<NewsArticle>> {
    try {
      console.log(`Making PATCH request to: ${BASE_URL}/api/news/${id}/unpublish`);
      const response = await fetch(`${BASE_URL}/api/news/${id}/unpublish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`HTTP error! status: ${response.status}`, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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
  'Festival',
  'Infrastructure', 
  'Health',
  'Education',
  'Environment',
  'Culture',
  'Technology',
  'Sports',
  'Government',
  'Emergency',
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];