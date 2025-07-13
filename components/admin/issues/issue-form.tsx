'use client';

import { useState, useEffect } from 'react';
import { IssueReport } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface IssueFormProps {
  issue?: IssueReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (issue: Partial<IssueReport>) => void;
}

const categoryOptions = ['Infrastructure', 'Utilities', 'Public Safety', 'Environment', 'Transportation', 'Health', 'Other'];
const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];
const statusOptions = ['Reported', 'In Progress', 'Resolved', 'Closed'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

export default function IssueForm({ issue, open, onOpenChange, onSubmit }: IssueFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    urgencyLevel: 'Medium',
    title: '',
    description: '',
    location: '',
    coordinates: '',
    status: 'Reported',
    priority: 'Medium',
    assignedDepartment: '',
    estimatedResolution: '',
  });

  useEffect(() => {
    if (issue) {
      setFormData({
        category: issue.category,
        urgencyLevel: issue.urgencyLevel,
        title: issue.title,
        description: issue.description,
        location: issue.location,
        coordinates: issue.coordinates || '',
        status: issue.status,
        priority: issue.priority,
        assignedDepartment: issue.assignedDepartment || '',
        estimatedResolution: issue.estimatedResolution ? issue.estimatedResolution.toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        category: '',
        urgencyLevel: 'Medium',
        title: '',
        description: '',
        location: '',
        coordinates: '',
        status: 'Reported',
        priority: 'Medium',
        assignedDepartment: '',
        estimatedResolution: '',
      });
    }
  }, [issue, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      estimatedResolution: formData.estimatedResolution ? new Date(formData.estimatedResolution) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{issue ? 'Edit Issue Report' : 'Add Issue Report'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select
                value={formData.urgencyLevel}
                onValueChange={(value) => setFormData({ ...formData, urgencyLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((urgency) => (
                    <SelectItem key={urgency} value={urgency}>
                      {urgency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
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
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordinates</Label>
              <Input
                id="coordinates"
                value={formData.coordinates}
                onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                placeholder="14.5995,120.9842"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedDepartment">Assigned Department</Label>
              <Input
                id="assignedDepartment"
                value={formData.assignedDepartment}
                onChange={(e) => setFormData({ ...formData, assignedDepartment: e.target.value })}
                placeholder="e.g., Public Works"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedResolution">Estimated Resolution</Label>
              <Input
                id="estimatedResolution"
                type="date"
                value={formData.estimatedResolution}
                onChange={(e) => setFormData({ ...formData, estimatedResolution: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {issue ? 'Update Issue Report' : 'Create Issue Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}