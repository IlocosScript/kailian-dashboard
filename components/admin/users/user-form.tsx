'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserFormProps {
  user?: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: Partial<User>) => void;
}

export default function UserForm({ user, open, onOpenChange, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    isActive: true,
    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
        isActive: user.isActive,
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactNumber: user.emergencyContactNumber || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        isActive: true,
        emergencyContactName: '',
        emergencyContactNumber: '',
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
              <Input
                id="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
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
            <Label htmlFor="isActive">Active User</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}