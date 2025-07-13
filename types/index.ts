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

// New data types based on DTOs
export interface User {
  id: string;
  externalId?: string;
  authProvider?: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
  address: string;
  dateOfBirth?: Date;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  profileImageUrl?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  totalFee: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  serviceName: string;
  serviceCategory: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantContactNumber: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface IssueReport {
  id: string;
  referenceNumber: string;
  category: string;
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  location: string;
  coordinates?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  assignedDepartment?: string;
  estimatedResolution?: Date;
  createdAt: Date;
  photos: Array<{
    id: string;
    url: string;
    uploadedAt: Date;
  }>;
}

export interface BusinessPermitRequest {
  appointmentId: string;
  userId: string;
  userName: string;
  serviceType: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  ownerName: string;
  tinNumber?: string;
  capitalInvestment?: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  createdAt: Date;
  updatedAt: Date;
}

export interface CivilRegistryRequest {
  appointmentId: string;
  userId: string;
  userName: string;
  documentType: string;
  purpose: string;
  numberOfCopies: number;
  registryNumber?: string;
  registryDate?: Date;
  registryPlace?: string;
  status: 'Pending' | 'Processing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicProject {
  id: number;
  title: string;
  description?: string;
  cost: number;
  contractor: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'Delayed' | 'Cancelled';
  progress?: number;
  startDate: Date;
  expectedEndDate?: Date;
  actualEndDate?: Date;
  location?: string;
  projectType: string;
  fundingSource: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CityService {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string;
  fee: number;
  processingTime: string;
  requiredDocuments: string[];
  officeLocation: string;
  contactNumber?: string;
  operatingHours: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  activeAppointments: number;
  pendingIssues: number;
  completedProjects: number;
  customerSatisfactionRating: number;
  topServices: Array<{
    serviceName: string;
    usageCount: number;
    category: string;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface EmergencyHotline {
  id: number;
  title: string;
  phoneNumber: string;
  description: string;
  isEmergency: boolean;
  department: string;
  operatingHours: string;
}

export interface Feedback {
  id: string;
  type: 'App' | 'Service';
  rating: number;
  comment?: string;
  category?: string;
  status: 'New' | 'Reviewed' | 'Archived';
  createdAt: Date;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
}