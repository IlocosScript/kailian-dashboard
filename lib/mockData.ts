// Mock data for all entities
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
  status: string;
  totalFee: number;
  paymentStatus: string;
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
  urgencyLevel: string;
  title: string;
  description: string;
  location: string;
  coordinates?: string;
  status: string;
  priority: string;
  assignedDepartment?: string;
  estimatedResolution?: Date;
  createdAt: Date;
  photos: Array<{
    id: string;
    url: string;
    uploadedAt: Date;
  }>;
}

export interface BusinessPermit {
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
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CivilRegistry {
  appointmentId: string;
  userId: string;
  userName: string;
  documentType: string;
  purpose: string;
  numberOfCopies: number;
  registryNumber?: string;
  registryDate?: Date;
  registryPlace?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicProject {
  id: number;
  title: string;
  description?: string;
  cost: number;
  contractor: string;
  status: string;
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
  type: string;
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
  type: string;
  rating: number;
  comment?: string;
  category?: string;
  status: string;
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

// Mock Data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'juan.delacruz@email.com',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    phoneNumber: '+63 912 345 6789',
    address: '123 Rizal Street, Barangay San Jose, Quezon City',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2024-01-20'),
    emergencyContactName: 'Maria Dela Cruz',
    emergencyContactNumber: '+63 912 345 6790'
  },
  {
    id: '2',
    email: 'maria.santos@email.com',
    firstName: 'Maria',
    lastName: 'Santos',
    middleName: 'Garcia',
    phoneNumber: '+63 917 234 5678',
    address: '456 Bonifacio Avenue, Barangay Central, Manila',
    dateOfBirth: new Date('1985-03-15'),
    isActive: true,
    createdAt: new Date('2024-01-10'),
    lastLoginAt: new Date('2024-01-19')
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    referenceNumber: 'APT-2024-001',
    appointmentDate: new Date('2024-01-25'),
    appointmentTime: '09:00 AM',
    status: 'Confirmed',
    totalFee: 500,
    paymentStatus: 'Paid',
    serviceName: 'Business Permit Application',
    serviceCategory: 'Business Services',
    applicantFirstName: 'Juan',
    applicantLastName: 'Dela Cruz',
    applicantContactNumber: '+63 912 345 6789',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    referenceNumber: 'APT-2024-002',
    appointmentDate: new Date('2024-01-26'),
    appointmentTime: '02:00 PM',
    status: 'Pending',
    totalFee: 200,
    paymentStatus: 'Pending',
    serviceName: 'Birth Certificate Request',
    serviceCategory: 'Civil Registry',
    applicantFirstName: 'Maria',
    applicantLastName: 'Santos',
    applicantContactNumber: '+63 917 234 5678',
    createdAt: new Date('2024-01-21')
  }
];

export const mockIssueReports: IssueReport[] = [
  {
    id: '1',
    referenceNumber: 'ISS-2024-001',
    category: 'Infrastructure',
    urgencyLevel: 'High',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues and potential vehicle damage',
    location: 'Main Street corner Rizal Avenue',
    status: 'In Progress',
    priority: 'High',
    assignedDepartment: 'Public Works',
    estimatedResolution: new Date('2024-01-30'),
    createdAt: new Date('2024-01-18'),
    photos: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
        uploadedAt: new Date('2024-01-18')
      }
    ]
  },
  {
    id: '2',
    referenceNumber: 'ISS-2024-002',
    category: 'Utilities',
    urgencyLevel: 'Medium',
    title: 'Streetlight Not Working',
    description: 'Streetlight has been out for 3 days, affecting visibility at night',
    location: 'Bonifacio Street near the park',
    status: 'Reported',
    priority: 'Medium',
    createdAt: new Date('2024-01-19'),
    photos: []
  }
];

export const mockBusinessPermits: BusinessPermit[] = [
  {
    appointmentId: '1',
    userId: '1',
    userName: 'Juan Dela Cruz',
    serviceType: 'New Business Permit',
    businessName: 'Juan\'s Sari-Sari Store',
    businessType: 'Retail',
    businessAddress: '123 Rizal Street, Barangay San Jose',
    ownerName: 'Juan Dela Cruz',
    tinNumber: '123-456-789-000',
    capitalInvestment: 50000,
    status: 'Under Review',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21')
  }
];

export const mockCivilRegistry: CivilRegistry[] = [
  {
    appointmentId: '2',
    userId: '2',
    userName: 'Maria Santos',
    documentType: 'Birth Certificate',
    purpose: 'Employment Requirements',
    numberOfCopies: 2,
    registryNumber: 'BC-2024-001',
    registryDate: new Date('1985-03-15'),
    registryPlace: 'Manila City',
    status: 'Processing',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
];

export const mockPublicProjects: PublicProject[] = [
  {
    id: 1,
    title: 'Road Widening Project - Main Street',
    description: 'Expansion of Main Street to accommodate increased traffic flow',
    cost: 5000000,
    contractor: 'ABC Construction Corp',
    status: 'In Progress',
    progress: 65,
    startDate: new Date('2023-12-01'),
    expectedEndDate: new Date('2024-03-31'),
    location: 'Main Street (Km 1-3)',
    projectType: 'Infrastructure',
    fundingSource: 'National Budget',
    isPublic: true,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 2,
    title: 'Community Health Center Construction',
    description: 'New health facility to serve Barangay Central residents',
    cost: 8000000,
    contractor: 'XYZ Builders Inc',
    status: 'Planning',
    progress: 15,
    startDate: new Date('2024-02-01'),
    expectedEndDate: new Date('2024-12-31'),
    location: 'Barangay Central',
    projectType: 'Healthcare',
    fundingSource: 'Local Budget',
    isPublic: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  }
];

export const mockCityServices: CityService[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: 'Business Services',
    name: 'Business Permit Application',
    description: 'Apply for new business permit or renewal',
    fee: 500,
    processingTime: '5-7 business days',
    requiredDocuments: ['Valid ID', 'Barangay Clearance', 'Tax Identification Number'],
    officeLocation: 'City Hall - 2nd Floor, Business Permits Office',
    contactNumber: '+63 2 123 4567',
    operatingHours: '8:00 AM - 5:00 PM (Monday to Friday)',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    categoryId: 2,
    categoryName: 'Civil Registry',
    name: 'Birth Certificate Request',
    description: 'Request certified copy of birth certificate',
    fee: 200,
    processingTime: '3-5 business days',
    requiredDocuments: ['Valid ID', 'Proof of relationship (if not the registrant)'],
    officeLocation: 'City Hall - 1st Floor, Civil Registry Office',
    contactNumber: '+63 2 123 4568',
    operatingHours: '8:00 AM - 5:00 PM (Monday to Friday)',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Appointment Confirmed',
    message: 'Your appointment for Business Permit Application has been confirmed for January 25, 2024 at 9:00 AM',
    type: 'appointment',
    isRead: false,
    actionUrl: '/appointments/1',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Issue Report Update',
    message: 'Your reported pothole issue has been assigned to Public Works department',
    type: 'issue',
    isRead: true,
    actionUrl: '/issues/1',
    createdAt: new Date('2024-01-19')
  }
];

export const mockEmergencyHotlines: EmergencyHotline[] = [
  {
    id: 1,
    title: 'Police Emergency',
    phoneNumber: '117',
    description: 'For immediate police assistance and emergency response',
    isEmergency: true,
    department: 'Philippine National Police',
    operatingHours: '24/7'
  },
  {
    id: 2,
    title: 'Fire Department',
    phoneNumber: '116',
    description: 'Fire emergency and rescue services',
    isEmergency: true,
    department: 'Bureau of Fire Protection',
    operatingHours: '24/7'
  },
  {
    id: 3,
    title: 'City Hall Main Office',
    phoneNumber: '+63 2 123 4567',
    description: 'General inquiries and city services information',
    isEmergency: false,
    department: 'City Government',
    operatingHours: '8:00 AM - 5:00 PM (Monday to Friday)'
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    type: 'App',
    rating: 4,
    comment: 'The app is very helpful for booking appointments. Could use better navigation.',
    category: 'User Experience',
    status: 'Reviewed',
    createdAt: new Date('2024-01-18')
  },
  {
    id: '2',
    type: 'Service',
    rating: 5,
    comment: 'Excellent service at the Business Permits office. Staff was very helpful.',
    category: 'Business Services',
    status: 'New',
    createdAt: new Date('2024-01-19')
  }
];

export const mockServiceCategories: ServiceCategory[] = [
  {
    id: 1,
    name: 'Business Services',
    description: 'Business permits, licenses, and related services',
    icon: 'briefcase',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Civil Registry',
    description: 'Birth certificates, marriage certificates, and civil documents',
    icon: 'file-text',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 3,
    name: 'Health Services',
    description: 'Health certificates, medical services, and health programs',
    icon: 'heart',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1250,
  activeAppointments: 45,
  pendingIssues: 12,
  completedProjects: 8,
  customerSatisfactionRating: 4.2,
  topServices: [
    {
      serviceName: 'Business Permit Application',
      usageCount: 156,
      category: 'Business Services'
    },
    {
      serviceName: 'Birth Certificate Request',
      usageCount: 134,
      category: 'Civil Registry'
    },
    {
      serviceName: 'Health Certificate',
      usageCount: 89,
      category: 'Health Services'
    }
  ]
};