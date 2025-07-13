'use client';

import { useState, useEffect } from 'react';
import { BusinessPermit } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BusinessPermitFormProps {
  businessPermit?: BusinessPermit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (permit: Partial<BusinessPermit>) => void;
}

const serviceTypes = ['New Business Permit', 'Business Permit Renewal', 'Business Permit Amendment'];
const businessTypes = ['Retail', 'Restaurant', 'Service', 'Manufacturing', 'Wholesale', 'Professional', 'Other'];
const statusOptions = ['Pending', 'Under Review', 'Approved', 'Rejected'];

export default function BusinessPermitForm({ businessPermit, open, onOpenChange, onSubmit }: BusinessPermitFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    serviceType: 'New Business Permit',
    businessName: '',
    businessType: 'Retail',
    businessAddress: '',
    ownerName: '',
    tinNumber: '',
    capitalInvestment: 0,
    status: 'Pending',
  });

  useEffect(() => {
    if (businessPermit) {
      setFormData({
        userId: businessPermit.userId,
        userName: businessPermit.userName,
        serviceType: businessPermit.serviceType,
        businessName: businessPermit.businessName,
        businessType: businessPermit.businessType,
        businessAddress: businessPermit.businessAddress,
        ownerName: businessPermit.ownerName,
        tinNumber: businessPermit.tinNumber || '',
        capitalInvestment: businessPermit.capitalInvestment || 0,
        status: businessPermit.status,
      });
    } else {
      setFormData({
        userId: '',
        userName: '',
        serviceType: 'New Business Permit',
        businessName: '',
        businessType: 'Retail',
        businessAddress: '',
        ownerName: '',
        tinNumber: '',
        capitalInvestment: 0,
        status: 'Pending',
      });
    }
  }, [businessPermit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{businessPermit ? 'Edit Business Permit' : 'Add Business Permit'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name *</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address *</Label>
            <Input
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tinNumber">TIN Number</Label>
              <Input
                id="tinNumber"
                value={formData.tinNumber}
                onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                placeholder="123-456-789-000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capitalInvestment">Capital Investment (₱)</Label>
              <Input
                id="capitalInvestment"
                type="number"
                min="0"
                value={formData.capitalInvestment}
                onChange={(e) => setFormData({ ...formData, capitalInvestment: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {businessPermit ? 'Update Permit' : 'Create Permit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}