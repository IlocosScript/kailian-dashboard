'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockEmergencyHotlines, EmergencyHotline } from '@/lib/mockData';
import HotlinesTable from '@/components/admin/hotlines/hotlines-table';
import HotlineForm from '@/components/admin/hotlines/hotline-form';
import { showToast } from '@/lib/toast';

export default function HotlinesPage() {
  const [hotlines, setHotlines] = useState<EmergencyHotline[]>(mockEmergencyHotlines);
  const [selectedHotline, setSelectedHotline] = useState<EmergencyHotline | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddHotline = () => {
    setSelectedHotline(null);
    setFormOpen(true);
  };

  const handleEditHotline = (hotline: EmergencyHotline) => {
    setSelectedHotline(hotline);
    setFormOpen(true);
  };

  const handleDeleteHotline = (id: number) => {
    setHotlines(hotlines.filter(hotline => hotline.id !== id));
    showToast.success('Emergency hotline deleted successfully');
  };

  const handleSubmitHotline = (hotlineData: Partial<EmergencyHotline>) => {
    if (selectedHotline) {
      // Update existing hotline
      setHotlines(hotlines.map(hotline => 
        hotline.id === selectedHotline.id 
          ? { ...hotline, ...hotlineData }
          : hotline
      ));
      showToast.success('Emergency hotline updated successfully');
    } else {
      // Create new hotline
      const newHotline: EmergencyHotline = {
        id: Math.max(...hotlines.map(h => h.id), 0) + 1,
        ...hotlineData
      } as EmergencyHotline;
      setHotlines([newHotline, ...hotlines]);
      showToast.success('Emergency hotline created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emergency Hotlines Management</h1>
          <p className="text-muted-foreground">
            Manage emergency contact numbers and hotlines
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddHotline}>
            <Plus className="mr-2 h-4 w-4" />
            Add Hotline
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Hotlines ({hotlines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <HotlinesTable
            hotlines={hotlines}
            onEdit={handleEditHotline}
            onDelete={handleDeleteHotline}
          />
        </CardContent>
      </Card>

      <HotlineForm
        hotline={selectedHotline}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitHotline}
      />
    </div>
  );
}