'use client';

import { useState, useEffect } from 'react';
import { TouristSpot } from '@/lib/api';
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

interface TouristSpotFormProps {
  touristSpot?: TouristSpot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (spot: Partial<TouristSpot>) => void;
}

export default function TouristSpotForm({ touristSpot, open, onOpenChange, onSubmit }: TouristSpotFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    rating: 0,
    imageUrl: '',
    coordinates: '',
    openingHours: '',
    entryFee: '',
    travelTime: '',
    isActive: true,
    highlights: [] as string[],
  });

  const [highlightsInput, setHighlightsInput] = useState('');

  useEffect(() => {
    if (touristSpot) {
      setFormData({
        name: touristSpot.name || '',
        description: touristSpot.description || '',
        location: touristSpot.location || '',
        address: touristSpot.address || '',
        rating: touristSpot.rating || 0,
        imageUrl: touristSpot.imageUrl || '',
        coordinates: touristSpot.coordinates || '',
        openingHours: touristSpot.openingHours || '',
        entryFee: touristSpot.entryFee || '',
        travelTime: touristSpot.travelTime || '',
        isActive: touristSpot.isActive !== false,
        highlights: touristSpot.highlights || [],
      });
      setHighlightsInput(touristSpot.highlights?.join(', ') || '');
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        address: '',
        rating: 0,
        imageUrl: '',
        coordinates: '',
        openingHours: '',
        entryFee: '',
        travelTime: '',
        isActive: true,
        highlights: [],
      });
      setHighlightsInput('');
    }
  }, [touristSpot, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const highlights = highlightsInput
      .split(',')
      .map(highlight => highlight.trim())
      .filter(highlight => highlight.length > 0);

    onSubmit({
      ...formData,
      highlights,
    });
    
    onOpenChange(false);
  };

  const handleHighlightsInputChange = (value: string) => {
    setHighlightsInput(value);
    const highlights = value
      .split(',')
      .map(highlight => highlight.trim())
      .filter(highlight => highlight.length > 0);
    setFormData({ ...formData, highlights });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{touristSpot ? 'Edit Tourist Spot' : 'Add Tourist Spot'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
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
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Input
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="6:00 AM - 10:00 PM"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee</Label>
              <Input
                id="entryFee"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                placeholder="Free or ₱50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelTime">Travel Time</Label>
              <Input
                id="travelTime"
                value={formData.travelTime}
                onChange={(e) => setFormData({ ...formData, travelTime: e.target.value })}
                placeholder="15 minutes from city center"
              />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights">Highlights (comma-separated)</Label>
            <Input
              id="highlights"
              value={highlightsInput}
              onChange={(e) => handleHighlightsInputChange(e.target.value)}
              placeholder="Walking trails, Playground, Picnic areas"
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
            <Label htmlFor="isActive">Active (visible to public)</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {touristSpot ? 'Update Spot' : 'Create Spot'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}