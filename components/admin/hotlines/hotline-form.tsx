'use client';

import { useState, useEffect } from 'react';
import { EmergencyHotline } from '@/lib/mockData';
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

interface HotlineFormProps {
  hotline?: EmergencyHotline | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (hotline: Partial<EmergencyHotline>) => void;
}

export default function HotlineForm({ hotline, open, onOpenChange, onSubmit }: HotlineFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    phoneNumber: '',
    description: '',
    isEmergency: false,
    department: '',
    operatingHours: '',
  });

  useEffect(() => {
    if (hotline) {
      setFormData({
        title: hotline.title,
        phoneNumber: hotline.phoneNumber,
        description: hotline.description,
        isEmergency: hotline.isEmergency,
        department: hotline.department,
        operatingHours: hotline.operatingHours,
      });
    } else {
      setFormData({
        title: '',
        phoneNumber: '',
        description: '',
        isEmergency: false,
        department: '',
        operatingHours: '',
      });
    }
  }, [hotline, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{hotline ? 'Edit Hotline' : 'Add Hotline'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Police Emergency"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="117 or +63 2 123 4567"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Philippine National Police"
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
              placeholder="Brief description of the service"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operatingHours">Operating Hours *</Label>
            <Input
              id="operatingHours"
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
              placeholder="24/7 or 8:00 AM - 5:00 PM"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isEmergency"
              checked={formData.isEmergency}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isEmergency: checked as boolean })
              }
            />
            <Label htmlFor="isEmergency">Emergency Hotline</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {hotline ? 'Update Hotline' : 'Create Hotline'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}