'use client';

import { useState, useEffect } from 'react';
import { Notification } from '@/lib/mockData';
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

interface NotificationFormProps {
  notification?: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (notification: Partial<Notification>) => void;
}

const notificationTypes = ['appointment', 'issue', 'system', 'reminder'];

export default function NotificationForm({ notification, open, onOpenChange, onSubmit }: NotificationFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system',
    isRead: false,
    actionUrl: '',
    expiresAt: '',
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        actionUrl: notification.actionUrl || '',
        expiresAt: notification.expiresAt ? notification.expiresAt.toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        message: '',
        type: 'system',
        isRead: false,
        actionUrl: '',
        expiresAt: '',
      });
    }
  }, [notification, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{notification ? 'Edit Notification' : 'Add Notification'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              required
            />
          </div>

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
                {notificationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actionUrl">Action URL</Label>
            <Input
              id="actionUrl"
              value={formData.actionUrl}
              onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
              placeholder="/appointments/123"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expires At</Label>
            <Input
              id="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRead"
              checked={formData.isRead}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isRead: checked as boolean })
              }
            />
            <Label htmlFor="isRead">Mark as Read</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {notification ? 'Update Notification' : 'Create Notification'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}