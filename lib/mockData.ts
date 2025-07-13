import { News, TouristSpot, Announcement, Issue, Service, Appointment, Request } from '@/types';

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

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'City Hall Closure Notice',
    content: 'City Hall will be closed on December 25th for Christmas Day.',
    type: 'notice',
    priority: 'medium',
    author: 'Admin Office',
    publishedAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-12-26T00:00:00Z',
    status: 'active',
    targetAudience: 'all'
  },
  {
    id: '2',
    title: 'New Public Transportation Route',
    content: 'A new bus route connecting downtown to the airport is now available.',
    type: 'update',
    priority: 'high',
    author: 'Transportation Dept',
    publishedAt: '2024-01-14T14:30:00Z',
    status: 'active',
    targetAudience: 'residents'
  }
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the intersection of Main St and 1st Ave.',
    category: 'infrastructure',
    priority: 'high',
    status: 'open',
    reportedBy: 'John Citizen',
    reportedAt: '2024-01-15T09:30:00Z',
    assignedTo: 'Public Works',
    location: 'Main St & 1st Ave',
    estimatedResolution: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Broken Streetlight',
    description: 'Streetlight not working on Oak Avenue, creating safety concerns.',
    category: 'utilities',
    priority: 'medium',
    status: 'in-progress',
    reportedBy: 'Jane Smith',
    reportedAt: '2024-01-14T18:45:00Z',
    assignedTo: 'Electrical Dept',
    location: 'Oak Avenue',
    estimatedResolution: '2024-01-18T00:00:00Z'
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Business License Application',
    description: 'Apply for a new business license or renew existing license.',
    category: 'licensing',
    department: 'Business Affairs',
    processingTime: '5-7 business days',
    fee: '$150',
    requirements: ['Valid ID', 'Business Plan', 'Proof of Address'],
    isOnline: true,
    status: 'active',
    contactInfo: 'business@city.gov'
  },
  {
    id: '2',
    name: 'Waste Collection Schedule',
    description: 'Regular waste and recycling collection service for residential areas.',
    category: 'utilities',
    department: 'Sanitation',
    processingTime: 'Weekly',
    fee: 'Included in taxes',
    requirements: ['Proper waste sorting', 'Bins placed curbside'],
    isOnline: false,
    status: 'active',
    contactInfo: 'sanitation@city.gov'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Building Permit Consultation',
    description: 'Consultation for residential building permit application.',
    applicantName: 'Robert Johnson',
    applicantEmail: 'robert.j@email.com',
    applicantPhone: '555-0123',
    serviceType: 'Building Permits',
    appointmentDate: '2024-01-20T10:00:00Z',
    duration: 60,
    status: 'scheduled',
    assignedTo: 'Building Inspector',
    notes: 'Bring architectural plans and property documents',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    title: 'Tax Assessment Review',
    description: 'Review of property tax assessment for 2024.',
    applicantName: 'Maria Garcia',
    applicantEmail: 'maria.g@email.com',
    applicantPhone: '555-0456',
    serviceType: 'Tax Services',
    appointmentDate: '2024-01-22T14:00:00Z',
    duration: 45,
    status: 'confirmed',
    assignedTo: 'Tax Assessor',
    notes: 'Bring property deed and recent tax statements',
    createdAt: '2024-01-14T11:20:00Z'
  }
];

export const mockRequests: Request[] = [
  {
    id: '1',
    title: 'Freedom of Information Request',
    description: 'Request for public records regarding city budget allocation for 2023.',
    type: 'information',
    priority: 'medium',
    status: 'pending',
    requesterName: 'David Wilson',
    requesterEmail: 'david.w@email.com',
    requesterPhone: '555-0789',
    submittedAt: '2024-01-15T16:45:00Z',
    assignedTo: 'Legal Department',
    estimatedCompletion: '2024-01-25T00:00:00Z',
    documents: ['Budget_Request_Form.pdf']
  },
  {
    id: '2',
    title: 'Special Event Permit',
    description: 'Request for permit to hold community festival in Central Park.',
    type: 'permit',
    priority: 'high',
    status: 'approved',
    requesterName: 'Community Events Org',
    requesterEmail: 'events@community.org',
    requesterPhone: '555-0321',
    submittedAt: '2024-01-10T09:15:00Z',
    assignedTo: 'Parks & Recreation',
    estimatedCompletion: '2024-01-30T00:00:00Z',
    documents: ['Event_Plan.pdf', 'Insurance_Certificate.pdf']
  }
];