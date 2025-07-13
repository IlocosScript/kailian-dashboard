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
import { Upload, X } from 'lucide-react';

interface NewsFormProps {
  news?: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (news: Partial<NewsArticle>, imageFile?: File) => void;
}

export default function NewsForm({ news, open, onOpenChange, onSubmit }: NewsFormProps) {
  const isEmbedded = open === true && onOpenChange === (() => {});
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    fullContent: '',
    author: '',
    category: 'Festival',
    location: '',
    expectedAttendees: '',
    publishedDate: '',
    publishedTime: '',
    isFeatured: false,
    isTrending: false,
    tags: [] as string[],
    status: 'Draft',
  });

  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        summary: news.summary || '',
        fullContent: news.fullContent || '',
        author: news.author || '',
        category: news.category || 'Festival',
        location: news.location || '',
        expectedAttendees: news.expectedAttendees || '',
        publishedDate: news.publishedDate || '',
        publishedTime: news.publishedTime || '',
        isFeatured: news.isFeatured || false,
        isTrending: news.isTrending || false,
        tags: news.tags || [],
        status: news.status || 'Draft',
      });
      setTagInput(news.tags?.join(', ') || '');
      setImagePreview(news.imageUrl || '');
      setImageFile(null);
    } else {
      setFormData({
        title: '',
        summary: '',
        fullContent: '',
        author: '',
        category: 'Festival',
        location: '',
        expectedAttendees: '',
        publishedDate: '',
        publishedTime: '',
        isFeatured: false,
        isTrending: false,
        tags: [],
        status: 'Draft',
      });
      setTagInput('');
      setImagePreview('');
      setImageFile(null);
    }
  }, [news, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    await onSubmit({
      ...formData,
      tags,
    }, imageFile || undefined);
    
    setIsSubmitting(false);
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData({ ...formData, tags });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // If embedded (not in a dialog), render the form directly
  if (isEmbedded) {
    return (
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
            <Label htmlFor="publishedDate">Published Date</Label>
            <Input
              id="publishedDate"
              type="date"
              value={formData.publishedDate}
              onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="publishedTime">Published Time</Label>
            <Input
              id="publishedTime"
              type="time"
              value={formData.publishedTime}
              onChange={(e) => setFormData({ ...formData, publishedTime: e.target.value })}
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
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => handleTagInputChange(e.target.value)}
              placeholder="tourism, local, event"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image Upload</Label>
          <div className="space-y-2">
            {imagePreview && (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
          </div>
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
          <Label htmlFor="fullContent">Full Content *</Label>
          <Textarea
            id="fullContent"
            value={formData.fullContent}
            onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
            rows={8}
            placeholder="Full article content..."
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    );
  }

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
              <Label htmlFor="publishedDate">Published Date</Label>
              <Input
                id="publishedDate"
                type="date"
                value={formData.publishedDate}
                onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publishedTime">Published Time</Label>
              <Input
                id="publishedTime"
                type="time"
                value={formData.publishedTime}
                onChange={(e) => setFormData({ ...formData, publishedTime: e.target.value })}
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
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => handleTagInputChange(e.target.value)}
                placeholder="tourism, local, event"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image Upload</Label>
            <div className="space-y-2">
              {imagePreview && (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
            </div>
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
            <Label htmlFor="fullContent">Full Content *</Label>
            <Textarea
              id="fullContent"
              value={formData.fullContent}
              onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
              rows={8}
              placeholder="Full article content..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {news ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}