'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, NEWS_CATEGORIES, ApiService } from '@/lib/api';
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
import { getImageUrl } from '@/lib/api';
import { Upload, X, Loader2 } from 'lucide-react';

interface NewsFormProps {
  news?: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (news: Partial<NewsArticle>, imageFile?: File, clearExistingImage?: boolean) => void;
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
  const [clearExistingImage, setClearExistingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFullData, setIsLoadingFullData] = useState(false);
  const [fullNewsData, setFullNewsData] = useState<NewsArticle | null>(null);

  useEffect(() => {
    const fetchFullNewsData = async () => {
      if (news && news.id && open) {
        setIsLoadingFullData(true);
        try {
          console.log('Fetching full news data for ID:', news.id);
          const response = await ApiService.getNewsById(news.id.toString());
          if (response.success) {
            console.log('Full news data received:', response.data);
            setFullNewsData(response.data);
          } else {
            console.error('Failed to fetch full news data:', response.message);
            // Fallback to using the provided news data
            setFullNewsData(news);
          }
        } catch (error) {
          console.error('Error fetching full news data:', error);
          // Fallback to using the provided news data
          setFullNewsData(news);
        } finally {
          setIsLoadingFullData(false);
        }
      } else if (news) {
        // If no ID (new article) or not open, use provided data directly
        setFullNewsData(news);
      } else {
        setFullNewsData(null);
      }
    };

    fetchFullNewsData();
  }, [news, open]);

  useEffect(() => {
    const newsToUse = fullNewsData || news;
    
    if (newsToUse) {
      console.log('News data being used in form:', newsToUse);
      console.log('fullContent value:', newsToUse.fullContent);
      console.log('content value:', (newsToUse as any).content);
      
      setFormData({
        title: newsToUse.title || '',
        summary: newsToUse.summary || '',
        fullContent: newsToUse.fullContent || (newsToUse as any).content || '',
        author: newsToUse.author || '',
        category: newsToUse.category || 'Festival',
        location: newsToUse.location || '',
        expectedAttendees: newsToUse.expectedAttendees || '',
        publishedDate: '',
        publishedTime: '',
        isFeatured: newsToUse.isFeatured || false,
        isTrending: newsToUse.isTrending || false,
        tags: newsToUse.tags || [],
        status: newsToUse.status || 'Draft',
      });
      
      console.log('Form data set:', {
        title: newsToUse.title || '',
        fullContent: newsToUse.fullContent || (newsToUse as any).content || '',
      });
      
      setTagInput(newsToUse.tags?.join(', ') || '');
      // Set image preview with full URL for existing news
      if (newsToUse.imageUrl) {
        setImagePreview(getImageUrl(newsToUse.imageUrl, 'news'));
      } else {
        setImagePreview('');
      }
      setImageFile(null);
      setClearExistingImage(false);
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
      setClearExistingImage(false);
    }
  }, [fullNewsData, news, open]);

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
    }, imageFile || undefined, clearExistingImage);
    
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
    setClearExistingImage(true);
    setClearExistingImage(true);
  };

  // Show loading state while fetching full data
  if (isLoadingFullData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Loading Article Data...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Fetching full article content...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If embedded (not in a dialog), render the form directly
  if (isEmbedded) {
    return (
      <div className="space-y-6">
        {isLoadingFullData && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading full article content...</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isLoadingFullData}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              disabled={isLoadingFullData}
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
              disabled={isLoadingFullData}
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
              disabled={isLoadingFullData}
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
              disabled={isLoadingFullData}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => handleTagInputChange(e.target.value)}
              placeholder="tourism, local, event"
              disabled={isLoadingFullData}
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
                  disabled={isLoadingFullData}
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
                disabled={isLoadingFullData}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                disabled={isLoadingFullData}
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
              disabled={isLoadingFullData}
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
              disabled={isLoadingFullData}
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
            disabled={isLoadingFullData}
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
            disabled={isLoadingFullData}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.history.back()}
            disabled={isLoadingFullData}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        </form>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{(fullNewsData || news) ? 'Edit News Article' : 'Add News Article'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isLoadingFullData}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                disabled={isLoadingFullData}
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
                disabled={isLoadingFullData}
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
                disabled={isLoadingFullData}
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
                disabled={isLoadingFullData}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => handleTagInputChange(e.target.value)}
                placeholder="tourism, local, event"
                disabled={isLoadingFullData}
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
                    disabled={isLoadingFullData}
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
                  disabled={isLoadingFullData}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  disabled={isLoadingFullData}
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
                disabled={isLoadingFullData}
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
                disabled={isLoadingFullData}
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
              disabled={isLoadingFullData}
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
              disabled={isLoadingFullData}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingFullData}>
              {isSubmitting ? 'Saving...' : (news ? 'Update Article' : 'Create Article')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}