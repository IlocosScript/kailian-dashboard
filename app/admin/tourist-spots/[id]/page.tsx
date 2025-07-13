'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  MapPin, 
  Phone,
  Mail,
  Globe,
  Clock,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiService, TouristSpot, getImageUrl } from '@/lib/api';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';
import TouristSpotForm from '@/components/admin/tourist-spots/tourist-spot-form';

export default function ViewTouristSpotPage() {
  const params = useParams();
  const router = useRouter();
  const [spot, setSpot] = useState<TouristSpot | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate';
    loading: boolean;
  }>({
    open: false,
    type: 'activate',
    loading: false,
  });

  const spotId = params.id as string;

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getTouristSpotById(spotId);
        
        if (response.success) {
          setSpot(response.data);
        } else {
          setError(response.message || 'Failed to fetch tourist spot');
        }
      } catch (err) {
        setError('Failed to connect to the API');
        console.error('Error fetching tourist spot:', err);
      } finally {
        setLoading(false);
      }
    };

    if (spotId) {
      fetchSpot();
    }
  }, [spotId]);

  const handleActivate = async () => {
    setConfirmModal({
      open: true,
      type: 'activate',
      loading: false,
    });
  };

  const handleDeactivate = async () => {
    setConfirmModal({
      open: true,
      type: 'deactivate',
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    if (!spot) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      if (confirmModal.type === 'activate') {
        const response = await apiService.activateTouristSpot(spot.id);
        if (response.success) {
          // Refresh the spot data from the API
          const refreshResponse = await apiService.getTouristSpotById(spotId);
          if (refreshResponse.success) {
            setSpot(refreshResponse.data);
          }
          showToast.success('Tourist spot activated successfully');
        } else {
          throw new Error(response.message || 'Failed to activate tourist spot');
        }
      } else {
        const response = await apiService.deactivateTouristSpot(spot.id);
        if (response.success) {
          // Refresh the spot data from the API
          const refreshResponse = await apiService.getTouristSpotById(spotId);
          if (refreshResponse.success) {
            setSpot(refreshResponse.data);
          }
          showToast.success('Tourist spot deactivated successfully');
        } else {
          throw new Error(response.message || 'Failed to deactivate tourist spot');
        }
      }
      setConfirmModal({ open: false, type: 'activate', loading: false });
    } catch (err) {
      const action = confirmModal.type === 'activate' ? 'activate' : 'deactivate';
      showToast.error(`Failed to ${action} tourist spot`, {
        description: 'Please try again or contact support if the problem persists.',
      });
      setConfirmModal(prev => ({ ...prev, loading: false }));
      console.error(`Error ${action}ing tourist spot:`, err);
    }
  };

  const fetchSpot = async () => {
    try {
      const response = await apiService.getTouristSpotById(spotId);
      if (response.success) {
        setSpot(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error refreshing tourist spot data:', err);
    }
  };

  const getModalConfig = () => {
    const { type } = confirmModal;
    
    if (type === 'activate') {
      return {
        title: 'Activate Tourist Spot',
        description: `Are you sure you want to activate "${spot?.name}"? This will make it visible to all users.`,
        confirmText: 'Activate',
        variant: 'success' as const,
        icon: 'activate' as const,
      };
    } else {
      return {
        title: 'Deactivate Tourist Spot',
        description: `Are you sure you want to deactivate "${spot?.name}"? This will make it invisible to public users.`,
        confirmText: 'Deactivate',
        variant: 'warning' as const,
        icon: 'deactivate' as const,
      };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive mb-2">
                {error || 'Tourist spot not found'}
              </p>
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tourist Spots
        </Button>
        <div className="flex space-x-2">
          {spot.isActive === false && (
            <Button 
              onClick={handleActivate}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </Button>
          )}
          {spot.isActive === true && (
            <Button 
              onClick={handleDeactivate}
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
          )}
          <Button onClick={() => setEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Spot
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={spot.isActive === true ? 'default' : 'secondary'}>
                  {spot.isActive === true ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardTitle className="text-3xl">{spot.name}</CardTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{spot.location}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {spot.imageUrl && (
            <div className="w-full">
              <img 
                src={getImageUrl(spot.imageUrl, 'tourist-spots')} 
                alt={spot.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Contact Information</h4>
                <div className="space-y-2">
                  {spot.contactNumber && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{spot.contactNumber}</span>
                    </div>
                  )}
                  {spot.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{spot.email}</span>
                    </div>
                  )}
                  {spot.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a 
                        href={spot.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Operating Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Operating Details</h4>
                <div className="space-y-2">
                  {(spot.operatingHours || spot.openingHours) && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{spot.operatingHours || spot.openingHours}</span>
                    </div>
                  )}
                  {(spot.entranceFee || spot.entryFee) && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{spot.entranceFee || spot.entryFee}</span>
                    </div>
                  )}
                  {spot.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{spot.address}</span>
                    </div>
                  )}
                  {spot.coordinates && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Coordinates:</span>
                      <span className="text-sm text-gray-900">{spot.coordinates}</span>
                    </div>
                  )}
                  {spot.travelTime && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Travel Time:</span>
                      <span className="text-sm text-gray-900">{spot.travelTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Engagement */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Statistics</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Views:</span>
                    <span className="font-medium text-gray-900">{spot.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <span className="font-medium text-gray-900">{spot.rating}★</span>
                  </div>
                  {spot.createdAt && (
                    <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">{formatDate(spot.createdAt)}</span>
                    </div>
                  )}
                  {spot.updatedAt && (
                    <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Updated:</span>
                    <span className="text-sm text-gray-900">{formatDate(spot.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {spot.description && (
            <div className="space-y-4">
              <Separator />
              <div className="prose max-w-none">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {spot.description}
                </div>
              </div>
            </div>
          )}

          {(spot.tags || spot.highlights) && (spot.tags || spot.highlights).length > 0 && (
            <div className="space-y-3">
              <Separator />
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-gray-900">{spot.highlights ? 'Highlights' : 'Tags'}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {(spot.tags || spot.highlights).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      <ConfirmationModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
        onConfirm={handleConfirmAction}
        loading={confirmModal.loading}
        {...getModalConfig()}
      />

      <TouristSpotForm
        touristSpot={spot}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSubmit={async (spotData, imageFile, clearExistingImage) => {
          try {
            const response = await apiService.updateTouristSpot(spot.id, spotData, imageFile, clearExistingImage);
            if (response.success) {
              // Refresh the spot data from API
              const refreshResponse = await apiService.getTouristSpotById(spotId);
              if (refreshResponse.success) {
                setSpot(refreshResponse.data);
              }
              setEditModalOpen(false);
              showToast.success('Tourist spot updated successfully');
            } else {
              showToast.error('Failed to update tourist spot', {
                description: response.message || 'Please try again or contact support if the problem persists.',
              });
            }
          } catch (err) {
            showToast.error('Failed to update tourist spot', {
              description: err instanceof Error ? err.message : 'Please try again or contact support if the problem persists.',
            });
            console.error('Error updating tourist spot:', err);
          }
        }}
      />
    </div>
  );
}