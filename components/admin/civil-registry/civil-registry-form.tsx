'use client';

import { useState, useEffect } from 'react';
import { CivilRegistry } from '@/lib/mockData';
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

interface CivilRegistryFormProps {
  civilRegistry?: CivilRegistry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (registry: Partial<CivilRegistry>) => void;
}

const documentTypes = ['Birth Certificate', 'Marriage Certificate', 'Death Certificate', 'Certificate of No Marriage Record (CENOMAR)'];
const statusOptions = ['Pending', 'Processing', 'Completed', 'Rejected'];

export default function CivilRegistryForm({ civilRegistry, open, onOpenChange, onSubmit }: CivilRegistryFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    documentType: 'Birth Certificate',
    purpose: '',
    numberOfCopies: 1,
    registryNumber: '',
    registryDate: '',
    registryPlace: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (civilRegistry) {
      setFormData({
        userId: civilRegistry.userId,
        userName: civilRegistry.userName,
        documentType: civilRegistry.documentType,
        purpose: civilRegistry.purpose,
        numberOfCopies: civilRegistry.numberOfCopies,
        registryNumber: civilRegistry.registryNumber || '',
        registryDate: civilRegistry.registryDate ? civilRegistry.registryDate.toISOString().split('T')[0] : '',
        registryPlace: civilRegistry.registryPlace || '',
        status: civilRegistry.status,
      });
    } else {
      setFormData({
        userId: '',
        userName: '',
        documentType: 'Birth Certificate',
        purpose: '',
        numberOfCopies: 1,
        registryNumber: '',
        registryDate: '',
        registryPlace: '',
        status: 'Pending',
      });
    }
  }, [civilRegistry, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      registryDate: formData.registryDate ? new Date(formData.registryDate) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{civilRegistry ? 'Edit Registry Request' : 'Add Registry Request'}</DialogTitle>
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
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={formData.documentType}
                onValueChange={(value) => setFormData({ ...formData, documentType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
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
              <Label htmlFor="purpose">Purpose *</Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g., Employment Requirements"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numberOfCopies">Number of Copies</Label>
              <Input
                id="numberOfCopies"
                type="number"
                min="1"
                max="10"
                value={formData.numberOfCopies}
                onChange={(e) => setFormData({ ...formData, numberOfCopies: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registryNumber">Registry Number</Label>
              <Input
                id="registryNumber"
                value={formData.registryNumber}
                onChange={(e) => setFormData({ ...formData, registryNumber: e.target.value })}
                placeholder="e.g., BC-2024-001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registryDate">Registry Date</Label>
              <Input
                id="registryDate"
                type="date"
                value={formData.registryDate}
                onChange={(e) => setFormData({ ...formData, registryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registryPlace">Registry Place</Label>
              <Input
                id="registryPlace"
                value={formData.registryPlace}
                onChange={(e) => setFormData({ ...formData, registryPlace: e.target.value })}
                placeholder="e.g., Manila City"
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
              {civilRegistry ? 'Update Request' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}