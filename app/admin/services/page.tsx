'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockCityServices, CityService } from '@/lib/mockData';
import ServicesTable from '@/components/admin/services/services-table';
import ServiceForm from '@/components/admin/services/service-form';
import { showToast } from '@/lib/toast';

export default function ServicesPage() {
  const [services, setServices] = useState<CityService[]>(mockCityServices);
  const [selectedService, setSelectedService] = useState<CityService | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddService = () => {
    setSelectedService(null);
    setFormOpen(true);
  };

  const handleEditService = (service: CityService) => {
    setSelectedService(service);
    setFormOpen(true);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    showToast.success('City service deleted successfully');
  };

  const handleSubmitService = (serviceData: Partial<CityService>) => {
    if (selectedService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === selectedService.id 
          ? { ...service, ...serviceData, updatedAt: new Date() }
          : service
      ));
      showToast.success('City service updated successfully');
    } else {
      // Create new service
      const newService: CityService = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...serviceData
      } as CityService;
      setServices([newService, ...services]);
      showToast.success('City service created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">City Services Management</h1>
          <p className="text-muted-foreground">
            Manage city services catalog and requirements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddService}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesTable
            services={services}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        </CardContent>
      </Card>

      <ServiceForm
        service={selectedService}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitService}
      />
    </div>
  );
}