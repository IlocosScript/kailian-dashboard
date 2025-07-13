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

// New CRUD module types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'update' | 'alert' | 'event';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  publishedAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'draft';
  targetAudience: 'all' | 'residents' | 'businesses' | 'visitors';
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'utilities' | 'safety' | 'environment' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  location: string;
  estimatedResolution?: string;
  resolvedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'licensing' | 'permits' | 'utilities' | 'social' | 'health' | 'other';
  department: string;
  processingTime: string;
  fee: string;
  requirements: string[];
  isOnline: boolean;
  status: 'active' | 'inactive' | 'maintenance';
  contactInfo: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  serviceType: string;
  appointmentDate: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  assignedTo: string;
  notes?: string;
  createdAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  type: 'information' | 'permit' | 'complaint' | 'suggestion' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'completed';
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  submittedAt: string;
  assignedTo?: string;
  estimatedCompletion?: string;
  completedAt?: string;
  documents?: string[];
}