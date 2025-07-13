import {
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
  mockNews,
  mockTouristSpots,
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
  News,
  TouristSpot,
} from '@/types';

// Re-export types for components
export type NewsArticle = News;
export type { TouristSpot };

// News categories constant
export const NEWS_CATEGORIES = [
  'Festival',
  'Tourism',
  'Local Event',
  'Government',
  'Community',
  'Business',
  'Culture',
  'Sports',
  'Education',
  'Health'
];

// Image URL utility function
export const getImageUrl = (imagePath: string, type: 'news' | 'tourist-spots'): string => {
  // For mock data, the imagePath is already a full URL from Pexels
  // In a real implementation, this would construct the proper URL based on type and path
  return imagePath;
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  success: boolean;
  message?: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  private static async simulateApiCall<T>(data: T, delayMs: number = 300): Promise<ApiResponse<T>> {
    await delay(delayMs);
    return {
      data,
      success: true,
      message: 'Success'
    };
  }

  private static async simulatePaginatedCall<T>(
    data: T[],
    page: number = 1,
    limit: number = 10,
    delayMs: number = 300
  ): Promise<PaginatedResponse<T>> {
    await delay(delayMs);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
      success: true,
      message: 'Success'
    };
  }

  // News API methods
  static async getNews(page: number = 1, limit: number = 10): Promise<PaginatedResponse<News>> {
    return this.simulatePaginatedCall(mockNews, page, limit);
  }

  static async getNewsById(id: string): Promise<ApiResponse<News | null>> {
    const news = mockNews.find(n => n.id === id);
    return this.simulateApiCall(news || null);
  }

  static async createNews(news: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<News>> {
    const newNews: News = {
      ...news,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockNews.unshift(newNews);
    return this.simulateApiCall(newNews);
  }

  static async updateNews(id: string, updates: Partial<News>): Promise<ApiResponse<News | null>> {
    const index = mockNews.findIndex(n => n.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockNews[index] = {
      ...mockNews[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.simulateApiCall(mockNews[index]);
  }

  static async deleteNews(id: string): Promise<ApiResponse<boolean>> {
    const index = mockNews.findIndex(n => n.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockNews.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // Tourist Spots API methods
  static async getTouristSpots(page: number = 1, limit: number = 10): Promise<PaginatedResponse<TouristSpot>> {
    return this.simulatePaginatedCall(mockTouristSpots, page, limit);
  }

  static async getTouristSpotById(id: string): Promise<ApiResponse<TouristSpot | null>> {
    const spot = mockTouristSpots.find(s => s.id === id);
    return this.simulateApiCall(spot || null);
  }

  static async createTouristSpot(spot: Omit<TouristSpot, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<TouristSpot>> {
    const newSpot: TouristSpot = {
      ...spot,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTouristSpots.unshift(newSpot);
    return this.simulateApiCall(newSpot);
  }

  static async updateTouristSpot(id: string, updates: Partial<TouristSpot>): Promise<ApiResponse<TouristSpot | null>> {
    const index = mockTouristSpots.findIndex(s => s.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockTouristSpots[index] = {
      ...mockTouristSpots[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.simulateApiCall(mockTouristSpots[index]);
  }

  static async deleteTouristSpot(id: string): Promise<ApiResponse<boolean>> {
    const index = mockTouristSpots.findIndex(s => s.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockTouristSpots.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // Users API methods
  static async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    return this.simulatePaginatedCall(mockUsers, page, limit);
  }

  static async getUserById(id: string): Promise<ApiResponse<User | null>> {
    const user = mockUsers.find(u => u.id === id);
    return this.simulateApiCall(user || null);
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User | null>> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockUsers[index] = {
      ...mockUsers[index],
      ...updates,
    };
    return this.simulateApiCall(mockUsers[index]);
  }

  static async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockUsers.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // Appointments API methods
  static async getAppointments(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Appointment>> {
    return this.simulatePaginatedCall(mockAppointments, page, limit);
  }

  static async getAppointmentById(id: string): Promise<ApiResponse<Appointment | null>> {
    const appointment = mockAppointments.find(a => a.id === id);
    return this.simulateApiCall(appointment || null);
  }

  static async updateAppointment(id: string, updates: Partial<Appointment>): Promise<ApiResponse<Appointment | null>> {
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...updates,
    };
    return this.simulateApiCall(mockAppointments[index]);
  }

  static async deleteAppointment(id: string): Promise<ApiResponse<boolean>> {
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockAppointments.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // Issue Reports API methods
  static async getIssueReports(page: number = 1, limit: number = 10): Promise<PaginatedResponse<IssueReport>> {
    return this.simulatePaginatedCall(mockIssueReports, page, limit);
  }

  static async getIssueReportById(id: string): Promise<ApiResponse<IssueReport | null>> {
    const report = mockIssueReports.find(r => r.id === id);
    return this.simulateApiCall(report || null);
  }

  static async updateIssueReport(id: string, updates: Partial<IssueReport>): Promise<ApiResponse<IssueReport | null>> {
    const index = mockIssueReports.findIndex(r => r.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockIssueReports[index] = {
      ...mockIssueReports[index],
      ...updates,
    };
    return this.simulateApiCall(mockIssueReports[index]);
  }

  static async deleteIssueReport(id: string): Promise<ApiResponse<boolean>> {
    const index = mockIssueReports.findIndex(r => r.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockIssueReports.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // Business Permit Requests API methods
  static async getBusinessPermitRequests(page: number = 1, limit: number = 10): Promise<PaginatedResponse<BusinessPermitRequest>> {
    return this.simulatePaginatedCall(mockBusinessPermitRequests, page, limit);
  }

  static async getBusinessPermitRequestById(id: string): Promise<ApiResponse<BusinessPermitRequest | null>> {
    const request = mockBusinessPermitRequests.find(r => r.appointmentId === id);
    return this.simulateApiCall(request || null);
  }

  static async updateBusinessPermitRequest(id: string, updates: Partial<BusinessPermitRequest>): Promise<ApiResponse<BusinessPermitRequest | null>> {
    const index = mockBusinessPermitRequests.findIndex(r => r.appointmentId === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockBusinessPermitRequests[index] = {
      ...mockBusinessPermitRequests[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.simulateApiCall(mockBusinessPermitRequests[index]);
  }

  // Civil Registry Requests API methods
  static async getCivilRegistryRequests(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CivilRegistryRequest>> {
    return this.simulatePaginatedCall(mockCivilRegistryRequests, page, limit);
  }

  static async getCivilRegistryRequestById(id: string): Promise<ApiResponse<CivilRegistryRequest | null>> {
    const request = mockCivilRegistryRequests.find(r => r.appointmentId === id);
    return this.simulateApiCall(request || null);
  }

  static async updateCivilRegistryRequest(id: string, updates: Partial<CivilRegistryRequest>): Promise<ApiResponse<CivilRegistryRequest | null>> {
    const index = mockCivilRegistryRequests.findIndex(r => r.appointmentId === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockCivilRegistryRequests[index] = {
      ...mockCivilRegistryRequests[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.simulateApiCall(mockCivilRegistryRequests[index]);
  }

  // Public Projects API methods
  static async getPublicProjects(page: number = 1, limit: number = 10): Promise<PaginatedResponse<PublicProject>> {
    return this.simulatePaginatedCall(mockPublicProjects, page, limit);
  }

  static async getPublicProjectById(id: number): Promise<ApiResponse<PublicProject | null>> {
    const project = mockPublicProjects.find(p => p.id === id);
    return this.simulateApiCall(project || null);
  }

  static async updatePublicProject(id: number, updates: Partial<PublicProject>): Promise<ApiResponse<PublicProject | null>> {
    const index = mockPublicProjects.findIndex(p => p.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockPublicProjects[index] = {
      ...mockPublicProjects[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.simulateApiCall(mockPublicProjects[index]);
  }

  static async deletePublicProject(id: number): Promise<ApiResponse<boolean>> {
    const index = mockPublicProjects.findIndex(p => p.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockPublicProjects.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // City Services API methods
  static async getCityServices(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CityService>> {
    return this.simulatePaginatedCall(mockCityServices, page, limit);
  }

  static async getCityServiceById(id: number): Promise<ApiResponse<CityService | null>> {
    const service = mockCityServices.find(s => s.id === id);
    return this.simulateApiCall(service || null);
  }

  static async updateCityService(id: number, updates: Partial<CityService>): Promise<ApiResponse<CityService | null>> {
    const index = mockCityServices.findIndex(s => s.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockCityServices[index] = {
      ...mockCityServices[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.simulateApiCall(mockCityServices[index]);
  }

  static async deleteCityService(id: number): Promise<ApiResponse<boolean>> {
    const index = mockCityServices.findIndex(s => s.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockCityServices.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // Service Categories API methods
  static async getServiceCategories(): Promise<ApiResponse<ServiceCategory[]>> {
    return this.simulateApiCall(mockServiceCategories);
  }

  static async getServiceCategoryById(id: number): Promise<ApiResponse<ServiceCategory | null>> {
    const category = mockServiceCategories.find(c => c.id === id);
    return this.simulateApiCall(category || null);
  }

  static async updateServiceCategory(id: number, updates: Partial<ServiceCategory>): Promise<ApiResponse<ServiceCategory | null>> {
    const index = mockServiceCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockServiceCategories[index] = {
      ...mockServiceCategories[index],
      ...updates,
    };
    return this.simulateApiCall(mockServiceCategories[index]);
  }

  // Notifications API methods
  static async getNotifications(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Notification>> {
    return this.simulatePaginatedCall(mockNotifications, page, limit);
  }

  static async markNotificationAsRead(id: string): Promise<ApiResponse<boolean>> {
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockNotifications[index].isRead = true;
    return this.simulateApiCall(true);
  }

  static async deleteNotification(id: string): Promise<ApiResponse<boolean>> {
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index === -1) {
      return this.simulateApiCall(false);
    }
    
    mockNotifications.splice(index, 1);
    return this.simulateApiCall(true);
  }

  // Emergency Hotlines API methods
  static async getEmergencyHotlines(): Promise<ApiResponse<EmergencyHotline[]>> {
    return this.simulateApiCall(mockEmergencyHotlines);
  }

  static async getEmergencyHotlineById(id: number): Promise<ApiResponse<EmergencyHotline | null>> {
    const hotline = mockEmergencyHotlines.find(h => h.id === id);
    return this.simulateApiCall(hotline || null);
  }

  static async updateEmergencyHotline(id: number, updates: Partial<EmergencyHotline>): Promise<ApiResponse<EmergencyHotline | null>> {
    const index = mockEmergencyHotlines.findIndex(h => h.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockEmergencyHotlines[index] = {
      ...mockEmergencyHotlines[index],
      ...updates,
    };
    return this.simulateApiCall(mockEmergencyHotlines[index]);
  }

  // Feedback API methods
  static async getFeedback(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Feedback>> {
    return this.simulatePaginatedCall(mockFeedback, page, limit);
  }

  static async getFeedbackById(id: string): Promise<ApiResponse<Feedback | null>> {
    const feedback = mockFeedback.find(f => f.id === id);
    return this.simulateApiCall(feedback || null);
  }

  static async updateFeedback(id: string, updates: Partial<Feedback>): Promise<ApiResponse<Feedback | null>> {
    const index = mockFeedback.findIndex(f => f.id === id);
    if (index === -1) {
      return this.simulateApiCall(null);
    }
    
    mockFeedback[index] = {
      ...mockFeedback[index],
      ...updates,
    };
    return this.simulateApiCall(mockFeedback[index]);
  }

  // Dashboard Stats API methods
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.simulateApiCall(mockDashboardStats);
  }
}

export const apiService = ApiService;