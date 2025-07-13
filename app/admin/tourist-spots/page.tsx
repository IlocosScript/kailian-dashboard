'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { ApiService, TouristSpot } from '@/lib/api';
import TouristSpotsTable from '@/components/admin/tourist-spots/tourist-spots-table';
import TouristSpotForm from '@/components/admin/tourist-spots/tourist-spot-form';
import { showToast } from '@/lib/toast';

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
      const response = await ApiService.getTouristSpots({ pageSize: 50 });
      
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
    // This function is now handled by the confirmation modal in TouristSpotsTable
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await ApiService.deleteTouristSpot(id);
        if (response.success) {
          setTouristSpots(touristSpots.filter(spot => spot.id !== id));
          resolve();
        } else {
          reject(new Error(response.message || 'Failed to delete tourist spot'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleActivateSpot = async (id: number) => {
    // This function is now handled by the confirmation modal in TouristSpotsTable
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await ApiService.activateTouristSpot(id);
        if (response.success) {
          setTouristSpots(touristSpots.map(spot => 
            spot.id === id 
              ? { ...spot, isActive: true }
              : spot
          ));
          // Refresh the entire list to ensure data consistency
          await fetchTouristSpots();
          resolve();
        } else {
          reject(new Error(response.message || 'Failed to activate tourist spot'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleDeactivateSpot = async (id: number) => {
    // This function is now handled by the confirmation modal in TouristSpotsTable
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await ApiService.deactivateTouristSpot(id);
        if (response.success) {
          setTouristSpots(touristSpots.map(spot => 
            spot.id === id 
              ? { ...spot, isActive: false }
              : spot
          ));
          // Refresh the entire list to ensure data consistency
          await fetchTouristSpots();
          resolve();
        } else {
          reject(new Error(response.message || 'Failed to deactivate tourist spot'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSubmitSpot = async (spotData: Partial<TouristSpot>, imageFile?: File, clearExistingImage?: boolean) => {
    try {
      let response;
      
      if (selectedSpot) {
        // Update existing spot
        response = await ApiService.updateTouristSpot(selectedSpot.id, spotData, imageFile, clearExistingImage);
        if (response.success) {
          setTouristSpots(touristSpots.map(spot => 
            spot.id === selectedSpot.id 
              ? response.data
              : spot
          ));
        }
      } else {
        // Create new spot
        response = await ApiService.createTouristSpot(spotData, imageFile);
        if (response.success) {
          setTouristSpots([response.data, ...touristSpots]);
        }
      }
      
      if (response.success) {
        setFormOpen(false);
        if (selectedSpot) {
          showToast.success('Tourist spot updated successfully');
        } else {
          showToast.success('Tourist spot created successfully');
        }
      } else {
        const action = selectedSpot ? 'update' : 'create';
        showToast.error(`Failed to ${action} tourist spot`, {
          description: response.message || 'Please try again or contact support if the problem persists.',
        });
      }
    } catch (err) {
      const action = selectedSpot ? 'update' : 'create';
      showToast.error(`Failed to ${action} tourist spot`, {
        description: 'Please try again or contact support if the problem persists.',
      });
      console.error('Error saving tourist spot:', err);
    }
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
              onActivate={handleActivateSpot}
              onDeactivate={handleDeactivateSpot}
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