'use client';

import { useState, useEffect } from 'react';
import { ServiceCategory } from '@/lib/mockData';
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

interface CategoryFormProps {
  category?: ServiceCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: Partial<ServiceCategory>) => void;
}

export default function CategoryForm({ category, open, onOpenChange, onSubmit }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        isActive: category.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        isActive: true,
      });
    }
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              placeholder="Brief description of the category"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., briefcase, file-text, heart"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isActive: checked as boolean })
              }
            />
            <Label htmlFor="isActive">Active Category</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}