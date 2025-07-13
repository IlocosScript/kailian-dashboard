  mockUsers,
  mockAppointments,
  mockIssueReports,
  mockBusinessPermitRequests,
  mockCivilRegistryRequests,
  mockPublicProjects,
  mockCityServices,
  mockServiceCategories,
  mockNotifications,
  mockEmergencyHotlines,
  mockFeedback,
  mockDashboardStats,
} from './mockData';
import type {
  User,
  Appointment,
  IssueReport,
  BusinessPermitRequest,
  CivilRegistryRequest,
  PublicProject,
  CityService,
  ServiceCategory,
  Notification,
  EmergencyHotline,
  Feedback,
  DashboardStats,
} from '@/types';
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
        const errorData = await response.json().catch(() => ({ 
          message: `HTTP error! status: ${response.status}`,
          success: false 
        }));
        console.error('API error response:', errorData);
        return {
          success: false,
          data: {} as T,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errors: errorData.errors
        };
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: {} as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
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
        return {
          success: false,
          data: {} as T,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errors: errorData.errors
        };
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: {} as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
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
        return {
          success: false,
          data: {} as T,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errors: errorData.errors
        };
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: {} as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
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
    
    // Add optional fields only if they have non-empty values
    if (newsData.summary && newsData.summary.trim()) formData.append('summary', newsData.summary);
    if (newsData.expectedAttendees && newsData.expectedAttendees.trim()) formData.append('expectedAttendees', newsData.expectedAttendees);
    if (newsData.tags && newsData.tags.length > 0) {
      formData.append('tags', newsData.tags.join(','));
    }
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return this.requestWithFormData<NewsArticle>('/api/news/with-image', 'POST', formData);
  }

  async updateNews(id: number, newsData: Partial<NewsArticle>, imageFile?: File, clearExistingImage?: boolean): Promise<ApiResponse<NewsArticle>> {
    const formData = new FormData();
    
    // Add required fields - these must always be present
    formData.append('title', newsData.title || '');
    formData.append('fullContent', newsData.fullContent || '');
    formData.append('location', newsData.location || '');
    formData.append('category', newsData.category || 'Festival');
    formData.append('author', newsData.author || '');
    formData.append('status', newsData.status || 'Draft');
    formData.append('isFeatured', (newsData.isFeatured || false).toString());
    formData.append('isTrending', (newsData.isTrending || false).toString());
    
    // Add optional fields - always append to explicitly communicate their state
    formData.append('summary', newsData.summary || '');
    formData.append('expectedAttendees', newsData.expectedAttendees || '');
    if (newsData.tags !== undefined) {
      formData.append('tags', (newsData.tags || []).join(','));
    }
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Add clearImage flag if image should be removed
    if (clearExistingImage) {
      formData.append('clearImage', 'true');
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
        return {
          success: false,
          data: {} as NewsArticle,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errors: errorData.errors
        };
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: {} as NewsArticle,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
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
        return {
          success: false,
          data: {} as NewsArticle,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errors: errorData.errors
        };
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: {} as NewsArticle,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async getFeaturedNews(): Promise<ApiResponse<NewsArticle[]>> {
    return this.request<NewsArticle[]>('/api/news/featured');
  }

  async getTrendingNews(): Promise<ApiResponse<NewsArticle[]>> {
    return this.request<NewsArticle[]>('/api/news/trending');
  }

  // Mock API methods for new data types (simulating API calls with mock data)
  async getUsers(params?: {
    page?: number;
    pageSize?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<User>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredUsers = [...mockUsers];
    
    if (params?.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === params.isActive);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedUsers,
      message: 'Users retrieved successfully',
      totalCount: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / pageSize),
      currentPage: page,
    };
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = mockUsers.find(u => u.id === id);
    
    if (user) {
      return {
        success: true,
        data: user,
        message: 'User retrieved successfully',
      };
    } else {
      return {
        success: false,
        data: {} as User,
        message: 'User not found',
      };
    }
  }

  async getAppointments(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Appointment>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredAppointments = [...mockAppointments];
    
    if (params?.status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === params.status);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedAppointments,
      message: 'Appointments retrieved successfully',
      totalCount: filteredAppointments.length,
      totalPages: Math.ceil(filteredAppointments.length / pageSize),
      currentPage: page,
    };
  }

  async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const appointment = mockAppointments.find(a => a.id === id);
    
    if (appointment) {
      return {
        success: true,
        data: appointment,
        message: 'Appointment retrieved successfully',
      };
    } else {
      return {
        success: false,
        data: {} as Appointment,
        message: 'Appointment not found',
      };
    }
  }

  async getIssueReports(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    category?: string;
  }): Promise<PaginatedResponse<IssueReport>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredReports = [...mockIssueReports];
    
    if (params?.status) {
      filteredReports = filteredReports.filter(report => report.status === params.status);
    }
    
    if (params?.category) {
      filteredReports = filteredReports.filter(report => report.category === params.category);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedReports,
      message: 'Issue reports retrieved successfully',
      totalCount: filteredReports.length,
      totalPages: Math.ceil(filteredReports.length / pageSize),
      currentPage: page,
    };
  }

  async getIssueReportById(id: string): Promise<ApiResponse<IssueReport>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const report = mockIssueReports.find(r => r.id === id);
    
    if (report) {
      return {
        success: true,
        data: report,
        message: 'Issue report retrieved successfully',
      };
    } else {
      return {
        success: false,
        data: {} as IssueReport,
        message: 'Issue report not found',
      };
    }
  }

  async getBusinessPermitRequests(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<BusinessPermitRequest>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredRequests = [...mockBusinessPermitRequests];
    
    if (params?.status) {
      filteredRequests = filteredRequests.filter(req => req.status === params.status);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedRequests,
      message: 'Business permit requests retrieved successfully',
      totalCount: filteredRequests.length,
      totalPages: Math.ceil(filteredRequests.length / pageSize),
      currentPage: page,
    };
  }

  async getCivilRegistryRequests(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<CivilRegistryRequest>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredRequests = [...mockCivilRegistryRequests];
    
    if (params?.status) {
      filteredRequests = filteredRequests.filter(req => req.status === params.status);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedRequests,
      message: 'Civil registry requests retrieved successfully',
      totalCount: filteredRequests.length,
      totalPages: Math.ceil(filteredRequests.length / pageSize),
      currentPage: page,
    };
  }

  async getPublicProjects(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<PublicProject>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredProjects = [...mockPublicProjects];
    
    if (params?.status) {
      filteredProjects = filteredProjects.filter(project => project.status === params.status);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedProjects,
      message: 'Public projects retrieved successfully',
      totalCount: filteredProjects.length,
      totalPages: Math.ceil(filteredProjects.length / pageSize),
      currentPage: page,
    };
  }

  async getPublicProjectById(id: number): Promise<ApiResponse<PublicProject>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = mockPublicProjects.find(p => p.id === id);
    
    if (project) {
      return {
        success: true,
        data: project,
        message: 'Public project retrieved successfully',
      };
    } else {
      return {
        success: false,
        data: {} as PublicProject,
        message: 'Public project not found',
      };
    }
  }

  async getCityServices(params?: {
    page?: number;
    pageSize?: number;
    categoryId?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<CityService>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredServices = [...mockCityServices];
    
    if (params?.categoryId) {
      filteredServices = filteredServices.filter(service => service.categoryId === params.categoryId);
    }
    
    if (params?.isActive !== undefined) {
      filteredServices = filteredServices.filter(service => service.isActive === params.isActive);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedServices,
      message: 'City services retrieved successfully',
      totalCount: filteredServices.length,
      totalPages: Math.ceil(filteredServices.length / pageSize),
      currentPage: page,
    };
  }

  async getServiceCategories(): Promise<ApiResponse<ServiceCategory[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: mockServiceCategories,
      message: 'Service categories retrieved successfully',
    };
  }

  async getNotifications(params?: {
    page?: number;
    pageSize?: number;
    isRead?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredNotifications = [...mockNotifications];
    
    if (params?.isRead !== undefined) {
      filteredNotifications = filteredNotifications.filter(notif => notif.isRead === params.isRead);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedNotifications,
      message: 'Notifications retrieved successfully',
      totalCount: filteredNotifications.length,
      totalPages: Math.ceil(filteredNotifications.length / pageSize),
      currentPage: page,
    };
  }

  async getEmergencyHotlines(): Promise<ApiResponse<EmergencyHotline[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: mockEmergencyHotlines,
      message: 'Emergency hotlines retrieved successfully',
    };
  }

  async getFeedback(params?: {
    page?: number;
    pageSize?: number;
    type?: string;
    status?: string;
  }): Promise<PaginatedResponse<Feedback>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredFeedback = [...mockFeedback];
    
    if (params?.type) {
      filteredFeedback = filteredFeedback.filter(fb => fb.type === params.type);
    }
    
    if (params?.status) {
      filteredFeedback = filteredFeedback.filter(fb => fb.status === params.status);
    }
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedFeedback,
      message: 'Feedback retrieved successfully',
      totalCount: filteredFeedback.length,
      totalPages: Math.ceil(filteredFeedback.length / pageSize),
      currentPage: page,
    };
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      data: mockDashboardStats,
      message: 'Dashboard statistics retrieved successfully',
    };
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

  async createTouristSpot(spotData: Partial<TouristSpot>, imageFile?: File): Promise<ApiResponse<TouristSpot>> {
    const formData = new FormData();
    
    // Add required fields
    if (spotData.name) formData.append('name', spotData.name);
    if (spotData.description) formData.append('description', spotData.description);
    if (spotData.location) formData.append('location', spotData.location);
    if (spotData.address) formData.append('address', spotData.address);
    formData.append('isActive', (spotData.isActive !== false).toString());
    
    // Add optional fields only if they have non-empty values
    if (spotData.rating !== undefined) formData.append('rating', spotData.rating.toString());
    if (spotData.coordinates && spotData.coordinates.trim()) formData.append('coordinates', spotData.coordinates);
    if (spotData.openingHours && spotData.openingHours.trim()) formData.append('openingHours', spotData.openingHours);
    if (spotData.entryFee && spotData.entryFee.trim()) formData.append('entryFee', spotData.entryFee);
    if (spotData.travelTime && spotData.travelTime.trim()) formData.append('travelTime', spotData.travelTime);
    if (spotData.highlights && spotData.highlights.length > 0) {
      formData.append('highlights', spotData.highlights.join(','));
    }
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return this.requestWithFormData<TouristSpot>('/api/touristspot/with-image', 'POST', formData);
  }

  async updateTouristSpot(id: number, spotData: Partial<TouristSpot>, imageFile?: File, clearExistingImage?: boolean): Promise<ApiResponse<TouristSpot>> {
    const formData = new FormData();
    
    // Add required fields - these must always be present
    formData.append('name', spotData.name || '');
    formData.append('description', spotData.description || '');
    formData.append('location', spotData.location || '');
    formData.append('address', spotData.address || '');
    formData.append('isActive', (spotData.isActive !== false).toString());
    
    // Add optional fields
    if (spotData.rating !== undefined) formData.append('rating', spotData.rating.toString());
    formData.append('coordinates', spotData.coordinates || '');
    formData.append('openingHours', spotData.openingHours || '');
    formData.append('entryFee', spotData.entryFee || '');
    formData.append('travelTime', spotData.travelTime || '');
    if (spotData.highlights !== undefined) {
      formData.append('highlights', (spotData.highlights || []).join(','));
    }
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Add clearImage flag if image should be removed
    if (clearExistingImage) {
      formData.append('clearImage', 'true');
    }
    
    return this.requestWithFormData<TouristSpot>(`/api/touristspot/${id}/with-image`, 'PUT', formData);
  }

  async deleteTouristSpot(id: number): Promise<ApiResponse<{}>> {
    return this.deleteRequest<{}>(`/api/touristspot/${id}`);
  }

  async activateTouristSpot(id: number): Promise<ApiResponse<TouristSpot>> {
    try {
      console.log(`Making PATCH request to: ${BASE_URL}/api/touristspot/${id}/activate`);
      const response = await fetch(`${BASE_URL}/api/touristspot/${id}/activate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`HTTP error! status: ${response.status}`, errorData);
        return {
          success: false,
          data: {} as TouristSpot,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errors: errorData.errors
        };
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: {} as TouristSpot,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async deactivateTouristSpot(id: number): Promise<ApiResponse<TouristSpot>> {
    try {
      console.log(`Making PATCH request to: ${BASE_URL}/api/touristspot/${id}/deactivate`);
      const response = await fetch(`${BASE_URL}/api/touristspot/${id}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`HTTP error! status: ${response.status}`, errorData);
        return {
          success: false,
          data: {} as TouristSpot,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errors: errorData.errors
        };
      }
      
      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: {} as TouristSpot,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
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
  location: string;
  address: string;
  coordinates?: string;
  openingHours?: string;
  entryFee?: string;
  rating: number;
  travelTime?: string;
  viewCount: number;
  coordinates?: string;
  openingHours?: string;
  entryFee?: string;
  highlights: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // Legacy fields for backward compatibility
  contactNumber?: string;
  email?: string;
  website?: string;
  operatingHours?: string;
  entranceFee?: string;
  tags?: string[];
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

import {
export type NewsCategory = typeof NEWS_CATEGORIES[number];