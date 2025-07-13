'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/lib/mockData';
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

interface AppointmentFormProps {
  appointment?: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (appointment: Partial<Appointment>) => void;
}

const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const paymentStatusOptions = ['Pending', 'Paid', 'Failed'];
const serviceCategories = ['Business Services', 'Civil Registry', 'Health Services', 'Building Permits'];

export default function AppointmentForm({ appointment, open, onOpenChange, onSubmit }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    status: 'Pending',
    totalFee: 0,
    paymentStatus: 'Pending',
    serviceName: '',
    serviceCategory: '',
    applicantFirstName: '',
    applicantLastName: '',
    applicantContactNumber: '',
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        appointmentDate: appointment.appointmentDate.toISOString().split('T')[0],
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        totalFee: appointment.totalFee,
        paymentStatus: appointment.paymentStatus,
        serviceName: appointment.serviceName,
        serviceCategory: appointment.serviceCategory,
        applicantFirstName: appointment.applicantFirstName,
        applicantLastName: appointment.applicantLastName,
        applicantContactNumber: appointment.applicantContactNumber,
      });
    } else {
      setFormData({
        appointmentDate: '',
        appointmentTime: '',
        status: 'Pending',
        totalFee: 0,
        paymentStatus: 'Pending',
        serviceName: '',
        serviceCategory: '',
        applicantFirstName: '',
        applicantLastName: '',
        applicantContactNumber: '',
      });
    }
  }, [appointment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      appointmentDate: new Date(formData.appointmentDate),
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment ? 'Edit Appointment' : 'Add Appointment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicantFirstName">First Name *</Label>
              <Input
                id="applicantFirstName"
                value={formData.applicantFirstName}
                onChange={(e) => setFormData({ ...formData, applicantFirstName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="applicantLastName">Last Name *</Label>
              <Input
                id="applicantLastName"
                value={formData.applicantLastName}
                onChange={(e) => setFormData({ ...formData, applicantLastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicantContactNumber">Contact Number *</Label>
            <Input
              id="applicantContactNumber"
              value={formData.applicantContactNumber}
              onChange={(e) => setFormData({ ...formData, applicantContactNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceCategory">Service Category *</Label>
              <Select
                value={formData.serviceCategory}
                onValueChange={(value) => setFormData({ ...formData, serviceCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input
                id="serviceName"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date *</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment Time *</Label>
              <Input
                id="appointmentTime"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                placeholder="e.g., 09:00 AM"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalFee">Total Fee (₱)</Label>
              <Input
                id="totalFee"
                type="number"
                min="0"
                value={formData.totalFee}
                onChange={(e) => setFormData({ ...formData, totalFee: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {appointment ? 'Update Appointment' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}