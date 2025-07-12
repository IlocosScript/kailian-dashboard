'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, NEWS_CATEGORIES } from '@/lib/api';
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

interface NewsFormProps {
  news?: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (news: Partial<NewsArticle>) => void;
}

export default function NewsForm({ news, open, onOpenChange, onSubmit }: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    fullContent: '',
    author: '',
    category: 'Local',
    location: '',
    expectedAttendees: '',
    imageUrl: '',
    isFeatured: false,
    isTrending: false,
    status: 'Published',
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        summary: news.summary || '',
        fullContent: news.fullContent || '',
        author: news.author || '',
        category: news.category || 'Local',
        location: news.location || '',
        expectedAttendees: news.expectedAttendees || '',
        imageUrl: news.imageUrl || '',
        isFeatured: news.isFeatured || false,
        isTrending: news.isTrending || false,
        status: news.status || 'Published',
        tags: news.tags || [],
      });
      setTagInput(news.tags?.join(', ') || '');
    } else {
      setFormData({
        title: '',
        summary: '',
        fullContent: '',
        author: '',
        category: 'Local',
        location: '',
        expectedAttendees: '',
        imageUrl: '',
        isFeatured: false,
        isTrending: false,
        status: 'Published',
        tags: [],
      });
      setTagInput('');
    }
  }, [news, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit({
      ...formData,
      tags,
    });
    
    onOpenChange(false);
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData({ ...formData, tags });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{news ? 'Edit News Article' : 'Add News Article'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedAttendees">Expected Attendees</Label>
              <Input
                id="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
                placeholder="e.g., 500+"
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
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => handleTagInputChange(e.target.value)}
              placeholder="tourism, local, event"
            />
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isFeatured: checked as boolean })
                }
              />
              <Label htmlFor="isFeatured">Featured Article</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isTrending"
                checked={formData.isTrending}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isTrending: checked as boolean })
                }
              />
              <Label htmlFor="isTrending">Trending Article</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              placeholder="Brief summary of the article..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullContent">Full Content</Label>
            <Textarea
              id="fullContent"
              value={formData.fullContent}
              onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
              rows={8}
              placeholder="Full article content..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {news ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}