'use client';

import { useState, useEffect } from 'react';
import { PublicProject } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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

interface ProjectFormProps {
  project?: PublicProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (project: Partial<PublicProject>) => void;
}

const statusOptions = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
const projectTypes = ['Infrastructure', 'Healthcare', 'Education', 'Transportation', 'Environment', 'Technology', 'Housing'];
const fundingSources = ['National Budget', 'Local Budget', 'Private Partnership', 'International Aid', 'Loans'];

export default function ProjectForm({ project, open, onOpenChange, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: 0,
    contractor: '',
    status: 'Planning',
    progress: 0,
    startDate: '',
    expectedEndDate: '',
    actualEndDate: '',
    location: '',
    projectType: 'Infrastructure',
    fundingSource: 'Local Budget',
    isPublic: true,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        cost: project.cost,
        contractor: project.contractor,
        status: project.status,
        progress: project.progress || 0,
        startDate: project.startDate.toISOString().split('T')[0],
        expectedEndDate: project.expectedEndDate ? project.expectedEndDate.toISOString().split('T')[0] : '',
        actualEndDate: project.actualEndDate ? project.actualEndDate.toISOString().split('T')[0] : '',
        location: project.location || '',
        projectType: project.projectType,
        fundingSource: project.fundingSource,
        isPublic: project.isPublic,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        cost: 0,
        contractor: '',
        status: 'Planning',
        progress: 0,
        startDate: '',
        expectedEndDate: '',
        actualEndDate: '',
        location: '',
        projectType: 'Infrastructure',
        fundingSource: 'Local Budget',
        isPublic: true,
      });
    }
  }, [project, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate),
      expectedEndDate: formData.expectedEndDate ? new Date(formData.expectedEndDate) : undefined,
      actualEndDate: formData.actualEndDate ? new Date(formData.actualEndDate) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractor">Contractor *</Label>
              <Input
                id="contractor"
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (₱) *</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => setFormData({ ...formData, projectType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fundingSource">Funding Source</Label>
              <Select
                value={formData.fundingSource}
                onValueChange={(value) => setFormData({ ...formData, fundingSource: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fundingSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Main Street (Km 1-3)"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expectedEndDate">Expected End Date</Label>
              <Input
                id="expectedEndDate"
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actualEndDate">Actual End Date</Label>
              <Input
                id="actualEndDate"
                type="date"
                value={formData.actualEndDate}
                onChange={(e) => setFormData({ ...formData, actualEndDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isPublic: checked as boolean })
              }
            />
            <Label htmlFor="isPublic">Public Project (visible to citizens)</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}