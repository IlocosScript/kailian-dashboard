'use client';

import { useState, useEffect } from 'react';
import { CityService } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ServiceFormProps {
  service?: CityService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (service: Partial<CityService>) => void;
}

export default function ServiceForm({ service, open, onOpenChange, onSubmit }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    categoryId: 1,
    categoryName: '',
    name: '',
    description: '',
    fee: 0,
    processingTime: '',
    requiredDocuments: [] as string[],
    officeLocation: '',
    contactNumber: '',
    operatingHours: '',
    isActive: true,
  });

  const [documentsInput, setDocumentsInput] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        categoryId: service.categoryId,
        categoryName: service.categoryName,
        name: service.name,
        description: service.description,
        fee: service.fee,
        processingTime: service.processingTime,
        requiredDocuments: service.requiredDocuments,
        officeLocation: service.officeLocation,
        contactNumber: service.contactNumber || '',
        operatingHours: service.operatingHours,
        isActive: service.isActive,
      });
      setDocumentsInput(service.requiredDocuments.join(', '));
    } else {
      setFormData({
        categoryId: 1,
        categoryName: '',
        name: '',
        description: '',
        fee: 0,
        processingTime: '',
        requiredDocuments: [],
        officeLocation: '',
        contactNumber: '',
        operatingHours: '',
        isActive: true,
      });
      setDocumentsInput('');
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredDocuments = documentsInput
      .split(',')
      .map(doc => doc.trim())
      .filter(doc => doc.length > 0);

    onSubmit({
      ...formData,
      requiredDocuments,
    });
  };

  const handleDocumentsInputChange = (value: string) => {
    setDocumentsInput(value);
    const documents = value
      .split(',')
      .map(doc => doc.trim())
      .filter(doc => doc.length > 0);
    setFormData({ ...formData, requiredDocuments: documents });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name *</Label>
              <Input
                id="categoryName"
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                placeholder="e.g., Business Services"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fee">Fee (₱) *</Label>
              <Input
                id="fee"
                type="number"
                min="0"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="processingTime">Processing Time *</Label>
              <Input
                id="processingTime"
                value={formData.processingTime}
                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                placeholder="e.g., 5-7 business days"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredDocuments">Required Documents (comma-separated)</Label>
            <Input
              id="requiredDocuments"
              value={documentsInput}
              onChange={(e) => handleDocumentsInputChange(e.target.value)}
              placeholder="Valid ID, Barangay Clearance, TIN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="officeLocation">Office Location *</Label>
            <Input
              id="officeLocation"
              value={formData.officeLocation}
              onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
              placeholder="e.g., City Hall - 2nd Floor, Business Permits Office"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+63 2 123 4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours *</Label>
              <Input
                id="operatingHours"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="8:00 AM - 5:00 PM (Monday to Friday)"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isActive: checked as boolean })
              }
            />
            <Label htmlFor="isActive">Active Service</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {service ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}