'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockCivilRegistry, CivilRegistry } from '@/lib/mockData';
import CivilRegistryTable from '@/components/admin/civil-registry/civil-registry-table';
import CivilRegistryForm from '@/components/admin/civil-registry/civil-registry-form';
import { showToast } from '@/lib/toast';

export default function CivilRegistryPage() {
  const [civilRegistry, setCivilRegistry] = useState<CivilRegistry[]>(mockCivilRegistry);
  const [selectedRegistry, setSelectedRegistry] = useState<CivilRegistry | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddRegistry = () => {
    setSelectedRegistry(null);
    setFormOpen(true);
  };

  const handleEditRegistry = (registry: CivilRegistry) => {
    setSelectedRegistry(registry);
    setFormOpen(true);
  };

  const handleDeleteRegistry = (appointmentId: string) => {
    setCivilRegistry(civilRegistry.filter(registry => registry.appointmentId !== appointmentId));
    showToast.success('Civil registry request deleted successfully');
  };

  const handleSubmitRegistry = (registryData: Partial<CivilRegistry>) => {
    if (selectedRegistry) {
      // Update existing registry
      setCivilRegistry(civilRegistry.map(registry => 
        registry.appointmentId === selectedRegistry.appointmentId 
          ? { ...registry, ...registryData, updatedAt: new Date() }
          : registry
      ));
      showToast.success('Civil registry request updated successfully');
    } else {
      // Create new registry
      const newRegistry: CivilRegistry = {
        appointmentId: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...registryData
      } as CivilRegistry;
      setCivilRegistry([newRegistry, ...civilRegistry]);
      showToast.success('Civil registry request created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Civil Registry Management</h1>
          <p className="text-muted-foreground">
            Manage civil document requests and processing
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddRegistry}>
            <Plus className="mr-2 h-4 w-4" />
            Add Registry Request
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Registry Requests ({civilRegistry.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CivilRegistryTable
            civilRegistry={civilRegistry}
            onEdit={handleEditRegistry}
            onDelete={handleDeleteRegistry}
          />
        </CardContent>
      </Card>

      <CivilRegistryForm
        civilRegistry={selectedRegistry}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitRegistry}
      />
    </div>
  );
}