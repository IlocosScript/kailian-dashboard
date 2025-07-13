'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockBusinessPermits, BusinessPermit } from '@/lib/mockData';
import BusinessPermitsTable from '@/components/admin/business-permits/business-permits-table';
import BusinessPermitForm from '@/components/admin/business-permits/business-permit-form';
import { showToast } from '@/lib/toast';

export default function BusinessPermitsPage() {
  const [businessPermits, setBusinessPermits] = useState<BusinessPermit[]>(mockBusinessPermits);
  const [selectedPermit, setSelectedPermit] = useState<BusinessPermit | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddPermit = () => {
    setSelectedPermit(null);
    setFormOpen(true);
  };

  const handleEditPermit = (permit: BusinessPermit) => {
    setSelectedPermit(permit);
    setFormOpen(true);
  };

  const handleDeletePermit = (appointmentId: string) => {
    setBusinessPermits(businessPermits.filter(permit => permit.appointmentId !== appointmentId));
    showToast.success('Business permit deleted successfully');
  };

  const handleSubmitPermit = (permitData: Partial<BusinessPermit>) => {
    if (selectedPermit) {
      // Update existing permit
      setBusinessPermits(businessPermits.map(permit => 
        permit.appointmentId === selectedPermit.appointmentId 
          ? { ...permit, ...permitData, updatedAt: new Date() }
          : permit
      ));
      showToast.success('Business permit updated successfully');
    } else {
      // Create new permit
      const newPermit: BusinessPermit = {
        appointmentId: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...permitData
      } as BusinessPermit;
      setBusinessPermits([newPermit, ...businessPermits]);
      showToast.success('Business permit created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Permits Management</h1>
          <p className="text-muted-foreground">
            Manage business permit applications and approvals
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddPermit}>
            <Plus className="mr-2 h-4 w-4" />
            Add Business Permit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Business Permits ({businessPermits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <BusinessPermitsTable
            businessPermits={businessPermits}
            onEdit={handleEditPermit}
            onDelete={handleDeletePermit}
          />
        </CardContent>
      </Card>

      <BusinessPermitForm
        businessPermit={selectedPermit}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitPermit}
      />
    </div>
  );
}