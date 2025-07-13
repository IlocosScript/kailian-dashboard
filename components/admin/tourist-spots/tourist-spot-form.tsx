'use client';

import { useState, useEffect } from 'react';
import { TouristSpot, apiService, getImageUrl } from '@/lib/api';
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
import { Upload, X, Loader2 } from 'lucide-react';

interface TouristSpotFormProps {
  touristSpot?: TouristSpot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (spot: Partial<TouristSpot>, imageFile?: File, clearExistingImage?: boolean) => void;
}

export default function TouristSpotForm({ touristSpot, open, onOpenChange, onSubmit }: TouristSpotFormProps) {
  const [isLoadingFullData, setIsLoadingFullData] = useState(false);
  const [fullSpotData, setFullSpotData] = useState<TouristSpot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    contactNumber: '',
    email: '',
    website: '',
    operatingHours: '',
    entranceFee: '',
    isActive: true,
    tags: [] as string[],
  });

  const [tagsInput, setTagsInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [clearExistingImage, setClearExistingImage] = useState(false);

  useEffect(() => {
    const fetchFullSpotData = async () => {
      if (touristSpot && touristSpot.id && open) {
        setIsLoadingFullData(true);
        try {
          console.log('Fetching full tourist spot data for ID:', touristSpot.id);
          const response = await apiService.getTouristSpotById(touristSpot.id.toString());
          if (response.success) {
            console.log('Full tourist spot data received:', response.data);
            setFullSpotData(response.data);
          } else {
            console.error('Failed to fetch full tourist spot data:', response.message);
            // Fallback to using the provided spot data
            setFullSpotData(touristSpot);
          }
        } catch (error) {
          console.error('Error fetching full tourist spot data:', error);
          // Fallback to using the provided spot data
          setFullSpotData(touristSpot);
        } finally {
          setIsLoadingFullData(false);
        }
      } else if (touristSpot) {
        // If no ID (new spot) or not open, use provided data directly
        setFullSpotData(touristSpot);
      } else {
        setFullSpotData(null);
      }
    };

    fetchFullSpotData();
  }, [touristSpot, open]);

  useEffect(() => {
    const spotToUse = fullSpotData || touristSpot;
    
    if (spotToUse) {
      console.log('Tourist spot data being used in form:', spotToUse);
      
      setFormData({
        name: spotToUse.name || '',
        description: spotToUse.description || '',
        location: spotToUse.location || '',
        address: spotToUse.address || '',
        contactNumber: spotToUse.contactNumber || '',
        email: spotToUse.email || '',
        website: spotToUse.website || '',
        operatingHours: spotToUse.operatingHours || spotToUse.openingHours || '',
        entranceFee: spotToUse.entranceFee || spotToUse.entryFee || '',
        isActive: spotToUse.isActive !== false,
        tags: spotToUse.tags || spotToUse.highlights || [],
      });
      
      setTagsInput((spotToUse.tags || spotToUse.highlights || []).join(', ') || '');
      // Set image preview with full URL for existing spots
      if (spotToUse.imageUrl) {
        setImagePreview(getImageUrl(spotToUse.imageUrl, 'tourist-spots'));
      } else {
        setImagePreview('');
      }
      setImageFile(null);
      setClearExistingImage(false);
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        address: '',
        contactNumber: '',
        email: '',
        website: '',
        operatingHours: '',
        entranceFee: '',
        isActive: true,
        tags: [],
      });
      setTagsInput('');
      setImagePreview('');
      setImageFile(null);
      setClearExistingImage(false);
    }
  }, [fullSpotData, touristSpot, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    await onSubmit({
      ...formData,
      tags,
    }, imageFile || undefined, clearExistingImage);
    
    setIsSubmitting(false);
  };

  const handleTagsInputChange = (value: string) => {
    setTagsInput(value);
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
  };

  // Show loading state while fetching full data
  if (isLoadingFullData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Loading Tourist Spot Data...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Fetching full tourist spot details...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{(fullSpotData || touristSpot) ? 'Edit Tourist Spot' : 'Add Tourist Spot'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoadingFullData}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={isLoadingFullData}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={isLoadingFullData}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+63 912 345 6789"
                disabled={isLoadingFullData}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@touristspot.com"
                disabled={isLoadingFullData}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.touristspot.com"
                disabled={isLoadingFullData}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input
                id="operatingHours"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="6:00 AM - 10:00 PM"
                disabled={isLoadingFullData}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entranceFee">Entrance Fee</Label>
            <Input
              id="entranceFee"
              value={formData.entranceFee}
              onChange={(e) => setFormData({ ...formData, entranceFee: e.target.value })}
              placeholder="Free or ₱50"
              disabled={isLoadingFullData}
            />
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

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => handleTagsInputChange(e.target.value)}
              placeholder="beach, hiking, family-friendly"
              disabled={isLoadingFullData}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isActive: checked as boolean })
              }
              disabled={isLoadingFullData}
            />
            <Label htmlFor="isActive">Active (visible to public)</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              disabled={isLoadingFullData}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingFullData}>
              {isSubmitting ? 'Saving...' : (touristSpot ? 'Update Spot' : 'Create Spot')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}