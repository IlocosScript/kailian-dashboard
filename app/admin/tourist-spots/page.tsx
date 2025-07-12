'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { apiService, TouristSpot } from '@/lib/api';
import TouristSpotsTable from '@/components/admin/tourist-spots/tourist-spots-table';
import TouristSpotForm from '@/components/admin/tourist-spots/tourist-spot-form';

export default function TouristSpotsPage() {
  const [touristSpots, setTouristSpots] = useState<TouristSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTouristSpots = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTouristSpots({ pageSize: 50 });
      
      if (response.success) {
        setTouristSpots(response.data);
      } else {
        setError(response.message || 'Failed to fetch tourist spots');
      }
    } catch (err) {
      setError('Failed to connect to the API');
      console.error('Error fetching tourist spots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTouristSpots();
  }, []);

  const handleAddSpot = () => {
    setSelectedSpot(null);
    setFormOpen(true);
  };

  const handleEditSpot = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setFormOpen(true);
  };

  const handleDeleteSpot = (id: number) => {
    // Note: This is client-side only since the API doesn't support DELETE
    setTouristSpots(touristSpots.filter(spot => spot.id !== id));
  };

  const handleSubmitSpot = (spotData: Partial<TouristSpot>) => {
    // Note: This is client-side only since the API doesn't support POST/PUT
    if (selectedSpot) {
      // Update existing spot
      setTouristSpots(touristSpots.map(spot => 
        spot.id === selectedSpot.id 
          ? { ...selectedSpot, ...spotData }
          : spot
      ));
    } else {
      // Add new spot (client-side only)
      const newSpot: TouristSpot = {
        id: Date.now(),
        name: spotData.name || '',
        description: spotData.description || '',
        imageUrl: spotData.imageUrl || '',
        rating: spotData.rating || 0,
        location: spotData.location || '',
        coordinates: spotData.coordinates,
        address: spotData.address || '',
        openingHours: spotData.openingHours,
        entryFee: spotData.entryFee,
        highlights: spotData.highlights || [],
        travelTime: spotData.travelTime,
        isActive: spotData.isActive !== false,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTouristSpots([newSpot, ...touristSpots]);
    }
    setFormOpen(false);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tourist Spots Management</h1>
            <p className="text-muted-foreground">
              Manage your tourist destinations and attractions
            </p>
          </div>
          <Button onClick={fetchTouristSpots} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive mb-2">Failed to load tourist spots</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchTouristSpots} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tourist Spots Management</h1>
          <p className="text-muted-foreground">
            Manage your tourist destinations and attractions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchTouristSpots} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddSpot}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tourist Spot
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tourist Spots ({touristSpots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                  <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-24" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-20" />
                </div>
              ))}
            </div>
          ) : (
            <TouristSpotsTable
              touristSpots={touristSpots}
              onEdit={handleEditSpot}
              onDelete={handleDeleteSpot}
            />
          )}
        </CardContent>
      </Card>

      <TouristSpotForm
        touristSpot={selectedSpot}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitSpot}
      />
    </div>
  );
}