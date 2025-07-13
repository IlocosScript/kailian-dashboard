import { News, TouristSpot } from '@/types';
import type {
  User,
  Appointment,
  IssueReport,
  BusinessPermitRequest,
  CivilRegistryRequest,
  PublicProject,
  CityService,
  DashboardStats,
  Notification,
  EmergencyHotline,
  Feedback,
  ServiceCategory,
} from '@/types';

// Helper functions for generating mock data
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getRandomPhoneNumber = (): string => {
  return `+639${getRandomInt(100000000, 999999999)}`;
};

const getRandomEmail = (firstName: string, lastName: string): string => {
  const domains = ['example.com', 'mail.com', 'test.org', 'demo.ph'];
  const domain = domains[getRandomInt(0, domains.length - 1)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

const getRandomAddress = (): string => {
  const streets = ['Main St', 'Oak Ave', 'Pine Ln', 'Elm Blvd', 'Maple Dr', 'Rizal St', 'Luna Ave'];
  const barangays = ['Barangay 1', 'Barangay 2', 'Poblacion', 'San Jose', 'Santa Maria'];
  const cities = ['Manila', 'Cebu City', 'Davao City', 'Quezon City', 'Makati'];
  return `${getRandomInt(1, 999)} ${streets[getRandomInt(0, streets.length - 1)]}, ${barangays[getRandomInt(0, barangays.length - 1)]}, ${cities[getRandomInt(0, cities.length - 1)]}`;
};

const getRandomCoordinates = (): string => {
  const lat = (Math.random() * (15 - 5) + 5).toFixed(4);
  const lng = (Math.random() * (125 - 115) + 115).toFixed(4);
  return `${lat},${lng}`;
};

const getRandomTime = (): string => {
  const hour = getRandomInt(1, 12);
  const minute = getRandomInt(0, 59);
  const ampm = getRandomInt(0, 1) === 0 ? 'AM' : 'PM';
  return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

const getRandomOperatingHours = (): string => {
  const startHour = getRandomInt(7, 10);
  const endHour = getRandomInt(17, 22);
  return `${startHour}:00 AM - ${endHour}:00 PM`;
};

const getRandomFee = (): number => {
  return parseFloat((Math.random() * 1000 + 50).toFixed(2));
};

const getRandomProcessingTime = (): string => {
  const days = getRandomInt(1, 10);
  return `${days} business day${days > 1 ? 's' : ''}`;
};

const getRandomRequiredDocuments = (): string[] => {
  const docs = ['Valid ID', 'Proof of Address', 'Application Form', 'Business Permit', 'Tax Clearance', 'Barangay Clearance'];
  const count = getRandomInt(1, 3);
  const selectedDocs = new Set<string>();
  while (selectedDocs.size < count) {
    selectedDocs.add(docs[getRandomInt(0, docs.length - 1)]);
  }
  return Array.from(selectedDocs);
};

const getRandomPexelsImage = (width: number, height: number, query?: string): string => {
  const queries = [
    'city', 'nature', 'people', 'architecture', 'festival', 'business', 'documents', 'office', 'emergency', 'feedback', 'service'
  ];
  const selectedQuery = query || queries[getRandomInt(0, queries.length - 1)];
  return `https://images.pexels.com/photos/${getRandomInt(100000, 2000000)}/pexels-photo-${getRandomInt(100000, 2000000)}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}`;
};

// First names and last names for more realistic data
const firstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Carmen', 'Luis', 'Rosa', 'Miguel', 'Elena', 'Carlos', 'Sofia', 'Antonio', 'Isabel', 'Manuel'];
const lastNames = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Gonzales', 'Rodriguez', 'Perez', 'Flores', 'Rivera', 'Gomez', 'Morales'];

const getRandomName = (): { firstName: string; lastName: string } => {
  return {
    firstName: firstNames[getRandomInt(0, firstNames.length - 1)],
    lastName: lastNames[getRandomInt(0, lastNames.length - 1)]
  };
};

// Generate mock users first (needed for other data)
export const mockUsers: User[] = Array.from({ length: 25 }).map((_, i) => {
  const { firstName, lastName } = getRandomName();
  const createdAt = getRandomDate(new Date(2023, 0, 1), new Date());
  return {
    id: generateUUID(),
    email: getRandomEmail(firstName, lastName),
    firstName: firstName,
    lastName: lastName,
    middleName: Math.random() > 0.5 ? getRandomString(6) : undefined,
    phoneNumber: getRandomPhoneNumber(),
    address: getRandomAddress(),
    dateOfBirth: getRandomDate(new Date(1970, 0, 1), new Date(2000, 0, 1)),
    isActive: Math.random() > 0.1,
    createdAt: createdAt,
    lastLoginAt: Math.random() > 0.3 ? getRandomDate(createdAt, new Date()) : undefined,
    profileImageUrl: Math.random() > 0.4 ? getRandomPexelsImage(100, 100, 'person') : undefined,
    emergencyContactName: Math.random() > 0.3 ? `${firstNames[getRandomInt(0, firstNames.length - 1)]} ${lastNames[getRandomInt(0, lastNames.length - 1)]}` : undefined,
    emergencyContactNumber: Math.random() > 0.3 ? getRandomPhoneNumber() : undefined,
  };
});

export const mockAppointments: Appointment[] = Array.from({ length: 30 }).map((_, i) => {
  const statuses: Appointment['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const paymentStatuses: Appointment['paymentStatus'][] = ['Paid', 'Pending', 'Refunded'];
  const serviceNames = ['Business Permit Application', 'Civil Registry Request', 'Tax Payment', 'Vehicle Registration', 'Building Permit', 'Health Certificate'];
  const serviceCategories = ['Permits', 'Documents', 'Payments', 'Transportation', 'Health', 'Construction'];
  const createdAt = getRandomDate(new Date(2024, 0, 1), new Date());
  const appointmentDate = getRandomDate(createdAt, new Date(2025, 0, 1));
  const status = statuses[getRandomInt(0, statuses.length - 1)];
  const completedAt = status === 'Completed' ? getRandomDate(appointmentDate, new Date()) : undefined;
  const { firstName, lastName } = getRandomName();

  return {
    id: generateUUID(),
    referenceNumber: `APP-${getRandomInt(10000, 99999)}`,
    appointmentDate: appointmentDate,
    appointmentTime: getRandomTime(),
    status: status,
    totalFee: getRandomFee(),
    paymentStatus: paymentStatuses[getRandomInt(0, paymentStatuses.length - 1)],
    serviceName: serviceNames[getRandomInt(0, serviceNames.length - 1)],
    serviceCategory: serviceCategories[getRandomInt(0, serviceCategories.length - 1)],
    applicantFirstName: firstName,
    applicantLastName: lastName,
    applicantContactNumber: getRandomPhoneNumber(),
    createdAt: createdAt,
    completedAt: completedAt,
  };
});

export const mockIssueReports: IssueReport[] = Array.from({ length: 20 }).map((_, i) => {
  const categories = ['Road Damage', 'Waste Management', 'Public Safety', 'Utilities', 'Noise Complaint', 'Street Lighting', 'Drainage'];
  const urgencyLevels: IssueReport['urgencyLevel'][] = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: IssueReport['status'][] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const priorities: IssueReport['priority'][] = ['Low', 'Medium', 'High'];
  const departments = ['Public Works', 'Sanitation', 'Police', 'Utilities Dept', 'Traffic Management'];
  const createdAt = getRandomDate(new Date(2024, 0, 1), new Date());
  const status = statuses[getRandomInt(0, statuses.length - 1)];
  const estimatedResolution = status === 'Open' || status === 'In Progress' ? getRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 30))) : undefined;

  const titles = [
    'Pothole on Main Street',
    'Broken streetlight',
    'Garbage collection missed',
    'Water leak reported',
    'Loud construction noise',
    'Damaged sidewalk',
    'Clogged drainage system'
  ];

  return {
    id: generateUUID(),
    referenceNumber: `IR-${getRandomInt(10000, 99999)}`,
    category: categories[getRandomInt(0, categories.length - 1)],
    urgencyLevel: urgencyLevels[getRandomInt(0, urgencyLevels.length - 1)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: `Detailed description of the issue reported by a citizen. This includes specific location details and the nature of the problem that needs to be addressed by the relevant department.`,
    location: getRandomAddress(),
    coordinates: getRandomCoordinates(),
    status: status,
    priority: priorities[getRandomInt(0, priorities.length - 1)],
    assignedDepartment: departments[getRandomInt(0, departments.length - 1)],
    estimatedResolution: estimatedResolution,
    createdAt: createdAt,
    photos: Array.from({ length: getRandomInt(0, 3) }).map(() => ({
      id: generateUUID(),
      url: getRandomPexelsImage(400, 300, 'problem'),
      uploadedAt: getRandomDate(createdAt, new Date()),
    })),
  };
});

export const mockBusinessPermitRequests: BusinessPermitRequest[] = Array.from({ length: 15 }).map((_, i) => {
  const serviceTypes = ['New Application', 'Renewal', 'Amendment'];
  const businessTypes = ['Retail Store', 'Restaurant', 'Consulting Firm', 'Manufacturing', 'Service Provider', 'Wholesale'];
  const statuses: BusinessPermitRequest['status'][] = ['Pending', 'Approved', 'Rejected', 'Under Review'];
  const createdAt = getRandomDate(new Date(2024, 0, 1), new Date());
  const user = mockUsers[getRandomInt(0, mockUsers.length - 1)];
  const businessType = businessTypes[getRandomInt(0, businessTypes.length - 1)];

  const businessNames = [
    'Golden Dragon Restaurant',
    'Tech Solutions Inc',
    'Sunrise Retail Store',
    'Metro Construction',
    'Fresh Market Grocery',
    'Elite Consulting Group'
  ];

  return {
    appointmentId: generateUUID(),
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    serviceType: serviceTypes[getRandomInt(0, serviceTypes.length - 1)],
    businessName: businessNames[getRandomInt(0, businessNames.length - 1)],
    businessType: businessType,
    businessAddress: getRandomAddress(),
    ownerName: `${user.firstName} ${user.lastName}`,
    tinNumber: `${getRandomInt(100, 999)}-${getRandomInt(100, 999)}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
    capitalInvestment: getRandomInt(100000, 5000000),
    status: statuses[getRandomInt(0, statuses.length - 1)],
    createdAt: createdAt,
    updatedAt: getRandomDate(createdAt, new Date()),
  };
});

export const mockCivilRegistryRequests: CivilRegistryRequest[] = Array.from({ length: 18 }).map((_, i) => {
  const documentTypes = ['Birth Certificate', 'Marriage Certificate', 'Death Certificate', 'Cenomar', 'Certificate of No Marriage'];
  const purposes = ['School Enrollment', 'Employment', 'Travel', 'Marriage', 'Inheritance', 'Visa Application', 'Bank Account'];
  const statuses: CivilRegistryRequest['status'][] = ['Pending', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled'];
  const createdAt = getRandomDate(new Date(2024, 0, 1), new Date());
  const user = mockUsers[getRandomInt(0, mockUsers.length - 1)];
  const status = statuses[getRandomInt(0, statuses.length - 1)];
  const registryDate = status === 'Completed' ? getRandomDate(new Date(1980, 0, 1), new Date(2020, 0, 1)) : undefined;

  return {
    appointmentId: generateUUID(),
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    documentType: documentTypes[getRandomInt(0, documentTypes.length - 1)],
    purpose: purposes[getRandomInt(0, purposes.length - 1)],
    numberOfCopies: getRandomInt(1, 5),
    registryNumber: status === 'Completed' ? `REG-${getRandomInt(100000, 999999)}` : undefined,
    registryDate: registryDate,
    registryPlace: status === 'Completed' ? getRandomAddress() : undefined,
    status: status,
    createdAt: createdAt,
    updatedAt: getRandomDate(createdAt, new Date()),
  };
});

export const mockPublicProjects: PublicProject[] = Array.from({ length: 12 }).map((_, i) => {
  const projectTypes = ['Infrastructure', 'Community Development', 'Environmental', 'Public Health', 'Education', 'Transportation'];
  const fundingSources = ['Local Government', 'National Grant', 'Private Donation', 'World Bank', 'ADB Loan'];
  const statuses: PublicProject['status'][] = ['Planning', 'In Progress', 'Completed', 'Delayed', 'Cancelled'];
  const createdAt = getRandomDate(new Date(2023, 0, 1), new Date(2024, 0, 1));
  const startDate = getRandomDate(createdAt, new Date(createdAt.getFullYear(), createdAt.getMonth() + 3, 1));
  const expectedEndDate = getRandomDate(new Date(startDate.getFullYear(), startDate.getMonth() + 6, 1), new Date(startDate.getFullYear() + 2, startDate.getMonth(), 1));
  const status = statuses[getRandomInt(0, statuses.length - 1)];
  const actualEndDate = status === 'Completed' ? getRandomDate(startDate, expectedEndDate) : undefined;
  const progress = status === 'Completed' ? 100 : (status === 'In Progress' ? getRandomInt(10, 90) : 0);

  const projectTitles = [
    'City Hall Renovation Project',
    'New Public Market Construction',
    'Road Widening Project Phase 2',
    'Community Health Center Upgrade',
    'Flood Control System Implementation',
    'Public School Building Construction',
    'Waste Management Facility',
    'Sports Complex Development',
    'Bridge Construction Project',
    'Water Treatment Plant Upgrade'
  ];

  return {
    id: i + 1,
    title: projectTitles[getRandomInt(0, projectTitles.length - 1)],
    description: `Comprehensive ${projectTypes[getRandomInt(0, projectTypes.length - 1)].toLowerCase()} project aimed at improving public services and infrastructure for the community. This project will benefit thousands of residents and enhance the quality of life in the area.`,
    cost: getRandomInt(1000000, 50000000),
    contractor: `${getRandomString(8)} Construction Corp`,
    status: status,
    progress: progress,
    startDate: startDate,
    expectedEndDate: expectedEndDate,
    actualEndDate: actualEndDate,
    location: getRandomAddress(),
    projectType: projectTypes[getRandomInt(0, projectTypes.length - 1)],
    fundingSource: fundingSources[getRandomInt(0, fundingSources.length - 1)],
    isPublic: Math.random() > 0.1,
    createdAt: createdAt,
    updatedAt: getRandomDate(createdAt, new Date()),
  };
});

export const mockServiceCategories: ServiceCategory[] = [
  {
    id: 1,
    name: 'Permits and Licenses',
    description: 'Business permits, building permits, and various licensing services',
    icon: 'file-text',
    isActive: true,
    createdAt: new Date(2023, 0, 1),
  },
  {
    id: 2,
    name: 'Civil Registry',
    description: 'Birth certificates, marriage certificates, and other civil documents',
    icon: 'award',
    isActive: true,
    createdAt: new Date(2023, 0, 1),
  },
  {
    id: 3,
    name: 'Tax and Payments',
    description: 'Property tax, business tax, and other government payments',
    icon: 'credit-card',
    isActive: true,
    createdAt: new Date(2023, 0, 1),
  },
  {
    id: 4,
    name: 'Health Services',
    description: 'Health certificates, medical services, and health programs',
    icon: 'heart',
    isActive: true,
    createdAt: new Date(2023, 0, 1),
  },
  {
    id: 5,
    name: 'Community Programs',
    description: 'Social services, community events, and public programs',
    icon: 'users',
    isActive: true,
    createdAt: new Date(2023, 0, 1),
  },
];

export const mockCityServices: CityService[] = Array.from({ length: 20 }).map((_, i) => {
  const category = mockServiceCategories[getRandomInt(0, mockServiceCategories.length - 1)];
  const createdAt = getRandomDate(new Date(2023, 0, 1), new Date());

  const servicesByCategory = {
    'Permits and Licenses': [
      'Business Permit Application',
      'Building Permit',
      'Occupancy Permit',
      'Signage Permit',
      'Excavation Permit'
    ],
    'Civil Registry': [
      'Birth Certificate Request',
      'Marriage Certificate Request',
      'Death Certificate Request',
      'Cenomar Request',
      'Certificate of No Marriage'
    ],
    'Tax and Payments': [
      'Real Property Tax Payment',
      'Business Tax Payment',
      'Community Tax Certificate',
      'Transfer Tax Payment',
      'Penalty Settlement'
    ],
    'Health Services': [
      'Health Certificate',
      'Sanitary Permit',
      'Medical Assistance',
      'Vaccination Services',
      'Health Screening'
    ],
    'Community Programs': [
      'Senior Citizen ID',
      'PWD ID Application',
      'Scholarship Application',
      'Livelihood Program',
      'Skills Training'
    ]
  };

  const services = servicesByCategory[category.name as keyof typeof servicesByCategory] || ['General Service'];
  const serviceName = services[getRandomInt(0, services.length - 1)];

  return {
    id: i + 1,
    categoryId: category.id,
    categoryName: category.name,
    name: serviceName,
    description: `Professional ${serviceName.toLowerCase()} service provided by the city government. Fast, reliable, and efficient processing with minimal requirements.`,
    fee: getRandomFee(),
    processingTime: getRandomProcessingTime(),
    requiredDocuments: getRandomRequiredDocuments(),
    officeLocation: `City Hall - ${category.name} Office`,
    contactNumber: getRandomPhoneNumber(),
    operatingHours: getRandomOperatingHours(),
    isActive: Math.random() > 0.05,
    createdAt: createdAt,
    updatedAt: getRandomDate(createdAt, new Date()),
  };
});

export const mockNotifications: Notification[] = Array.from({ length: 25 }).map((_, i) => {
  const types: Notification['type'][] = ['Info', 'Warning', 'Error', 'Success'];
  const createdAt = getRandomDate(new Date(2024, 5, 1), new Date());
  const expiresAt = Math.random() > 0.5 ? getRandomDate(createdAt, new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 1)) : undefined;

  const notifications = [
    { title: 'New appointment scheduled', message: 'Your appointment for business permit has been confirmed for tomorrow at 10:00 AM.' },
    { title: 'Payment reminder', message: 'Your property tax payment is due in 3 days. Please settle to avoid penalties.' },
    { title: 'Document ready for pickup', message: 'Your birth certificate is ready for pickup at the Civil Registry office.' },
    { title: 'System maintenance', message: 'The online portal will be under maintenance this weekend from 2:00 AM to 6:00 AM.' },
    { title: 'New service available', message: 'Online tax payment is now available through our digital platform.' },
  ];

  const notification = notifications[getRandomInt(0, notifications.length - 1)];

  return {
    id: generateUUID(),
    title: notification.title,
    message: notification.message,
    type: types[getRandomInt(0, types.length - 1)],
    isRead: Math.random() > 0.4,
    actionUrl: Math.random() > 0.3 ? '/admin/appointments' : undefined,
    createdAt: createdAt,
    expiresAt: expiresAt,
  };
});

export const mockEmergencyHotlines: EmergencyHotline[] = [
  {
    id: 1,
    title: 'Police Emergency Hotline',
    phoneNumber: '117',
    description: 'For immediate police assistance and emergency response',
    isEmergency: true,
    department: 'Philippine National Police',
    operatingHours: '24/7',
  },
  {
    id: 2,
    title: 'Fire Department',
    phoneNumber: '116',
    description: 'Fire emergency response and rescue operations',
    isEmergency: true,
    department: 'Bureau of Fire Protection',
    operatingHours: '24/7',
  },
  {
    id: 3,
    title: 'Medical Emergency',
    phoneNumber: '911',
    description: 'Medical emergency and ambulance services',
    isEmergency: true,
    department: 'Emergency Medical Services',
    operatingHours: '24/7',
  },
  {
    id: 4,
    title: 'Disaster Response',
    phoneNumber: '+639171234567',
    description: 'Natural disaster response and coordination',
    isEmergency: true,
    department: 'Disaster Risk Reduction Office',
    operatingHours: '24/7',
  },
  {
    id: 5,
    title: 'City Hall Information',
    phoneNumber: '+639181234567',
    description: 'General information and non-emergency inquiries',
    isEmergency: false,
    department: 'City Information Office',
    operatingHours: '8:00 AM - 5:00 PM',
  },
];

export const mockFeedback: Feedback[] = Array.from({ length: 15 }).map((_, i) => {
  const types: Feedback['type'][] = ['App', 'Service'];
  const categories = ['Bug Report', 'Feature Request', 'General Inquiry', 'Complaint', 'Suggestion', 'Compliment'];
  const statuses: Feedback['status'][] = ['New', 'Reviewed', 'Archived'];
  const createdAt = getRandomDate(new Date(2024, 0, 1), new Date());

  const comments = [
    'The app is very user-friendly and makes it easy to book appointments.',
    'I experienced some issues with the payment system. Please fix this.',
    'Great service! The staff was very helpful and professional.',
    'The waiting time was too long. Please improve the scheduling system.',
    'Love the new features! Keep up the good work.',
    'The website needs better mobile optimization.',
    'Excellent customer service. Very satisfied with the experience.',
  ];

  return {
    id: generateUUID(),
    type: types[getRandomInt(0, types.length - 1)],
    rating: getRandomInt(1, 5),
    comment: comments[getRandomInt(0, comments.length - 1)],
    category: categories[getRandomInt(0, categories.length - 1)],
    status: statuses[getRandomInt(0, statuses.length - 1)],
    createdAt: createdAt,
  };
});

export const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  activeAppointments: mockAppointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length,
  pendingIssues: mockIssueReports.filter(ir => ir.status === 'Open' || ir.status === 'In Progress').length,
  completedProjects: mockPublicProjects.filter(p => p.status === 'Completed').length,
  customerSatisfactionRating: 4.2,
  topServices: [
    { serviceName: 'Business Permit Application', usageCount: 156, category: 'Permits' },
    { serviceName: 'Birth Certificate Request', usageCount: 134, category: 'Civil Registry' },
    { serviceName: 'Property Tax Payment', usageCount: 98, category: 'Payments' },
  ],
};

// Legacy mock data (keeping existing structure)
export const mockNews: News[] = [
  {
    id: '1',
    title: 'New Tourism Campaign Launches',
    content: 'The city has launched a new tourism campaign to attract more visitors...',
    author: 'John Doe',
    publishedAt: '2024-01-15T10:30:00Z',
    status: 'published',
    imageUrl: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Local Festival Dates Announced',
    content: 'The annual summer festival will take place from July 15-17...',
    author: 'Jane Smith',
    publishedAt: '2024-01-14T14:20:00Z',
    status: 'published',
    imageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'New Walking Trail Opens',
    content: 'A scenic walking trail connecting downtown to the waterfront...',
    author: 'Mike Johnson',
    publishedAt: '2024-01-13T09:15:00Z',
    status: 'draft',
    imageUrl: 'https://images.pexels.com/photos/1236678/pexels-photo-1236678.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export const mockTouristSpots: TouristSpot[] = [
  {
    id: '1',
    name: 'Historic Downtown Square',
    description: 'Beautiful historic square with shops, restaurants, and cultural attractions.',
    location: 'Downtown District',
    category: 'Historical',
    rating: 4.5,
    imageUrl: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    createdAt: '2024-01-10T12:00:00Z'
  },
  {
    id: '2',
    name: 'Sunset Beach',
    description: 'Perfect spot for watching spectacular sunsets over the ocean.',
    location: 'Coastal Area',
    category: 'Beach',
    rating: 4.8,
    imageUrl: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    createdAt: '2024-01-08T16:30:00Z'
  },
  {
    id: '3',
    name: 'Mountain View Trail',
    description: 'Hiking trail with breathtaking mountain views and wildlife.',
    location: 'Mountain Region',
    category: 'Nature',
    rating: 4.3,
    imageUrl: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 40.7831, lng: -73.9712 },
    createdAt: '2024-01-05T08:45:00Z'
  }
];