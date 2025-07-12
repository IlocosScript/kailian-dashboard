'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { TouristSpot } from '@/types';
import { mockTouristSpots } from '@/lib/mockData';
import TouristSpotsTable from '@/components/admin/tourist-spots/tourist-spots-table';
import TouristSpotForm from '@/components/admin/tourist-spots/tourist-spot-form';

export default function TouristSpotsPage() {
  const [touristSpots, setTouristSpots] = useState<TouristSpot[]>(mockTouristSpots);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddSpot = () => {
    setSelectedSpot(null);
    setFormOpen(true);
  };

  const handleEditSpot = (spot: TouristSpot) => {
    setSelectedSpot(spot);
    setFormOpen(true);
  };

  const handleDeleteSpot = (id: string) => {
    setTouristSpots(touristSpots.filter(spot => spot.id !== id));
  };

  const handleSubmitSpot = (spotData: Omit<TouristSpot, 'id'>) => {
    if (selectedSpot) {
      // Update existing spot
      setTouristSpots(touristSpots.map(spot => 
        spot.id === selectedSpot.id 
          ? { ...spotData, id: selectedSpot.id }
          : spot
      ));
    } else {
      // Add new spot
      const newSpot: TouristSpot = {
        ...spotData,
        id: Date.now().toString(),
      };
      setTouristSpots([newSpot, ...touristSpots]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tourist Spots Management</h1>
          <p className="text-muted-foreground">
            Manage your tourist destinations and attractions
          </p>
        </div>
        <Button onClick={handleAddSpot}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tourist Spot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tourist Spots ({touristSpots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TouristSpotsTable
            touristSpots={touristSpots}
            onEdit={handleEditSpot}
            onDelete={handleDeleteSpot}
          />
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