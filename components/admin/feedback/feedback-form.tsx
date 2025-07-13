'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/lib/mockData';
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

interface FeedbackFormProps {
  feedback?: Feedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: Partial<Feedback>) => void;
}

const feedbackTypes = ['App', 'Service'];
const statusOptions = ['New', 'Reviewed', 'Resolved', 'Dismissed'];

export default function FeedbackForm({ feedback, open, onOpenChange, onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    type: 'App',
    rating: 5,
    comment: '',
    category: '',
    status: 'New',
  });

  useEffect(() => {
    if (feedback) {
      setFormData({
        type: feedback.type,
        rating: feedback.rating,
        comment: feedback.comment || '',
        category: feedback.category || '',
        status: feedback.status,
      });
    } else {
      setFormData({
        type: 'App',
        rating: 5,
        comment: '',
        category: '',
        status: 'New',
      });
    }
  }, [feedback, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{feedback ? 'Edit Feedback' : 'Add Feedback'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., User Experience, Business Services"
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

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              placeholder="User feedback comment..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {feedback ? 'Update Feedback' : 'Create Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}