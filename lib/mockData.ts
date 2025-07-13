import { News, TouristSpot } from '@/types';

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