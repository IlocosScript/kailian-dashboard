'use client';

import { useState } from 'react';
import { TouristSpot, getImageUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Edit, Trash2, Star, Eye, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { TruncatedText } from '@/components/ui/truncated-text';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface TouristSpotsTableProps {
  touristSpots: TouristSpot[];
  onEdit: (spot: TouristSpot) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
}

export default function TouristSpotsTable({ touristSpots, onEdit, onDelete, onActivate, onDeactivate }: TouristSpotsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'delete' | 'activate' | 'deactivate';
    item: TouristSpot | null;
    loading: boolean;
  }>({
    open: false,
    type: 'delete',
    item: null,
    loading: false,
  });

  const filteredSpots = touristSpots.filter(spot =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.item) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      switch (confirmModal.type) {
        case 'delete':
          await onDelete(confirmModal.item.id);
          showToast.success('Tourist spot deleted successfully');
          break;
        case 'activate':
          await onActivate(confirmModal.item.id);
          showToast.success('Tourist spot activated successfully');
          break;
        case 'deactivate':
          await onDeactivate(confirmModal.item.id);
          showToast.success('Tourist spot deactivated successfully');
          break;
      }
      setConfirmModal({ open: false, type: 'delete', item: null, loading: false });
    } catch (error) {
      showToast.error(`Failed to ${confirmModal.type} tourist spot`, {
        description: 'Please try again or contact support if the problem persists.',
      });
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (type: 'delete' | 'activate' | 'deactivate', item: TouristSpot) => {
    setConfirmModal({
      open: true,
      type,
      item,
      loading: false,
    });
  };

  const getModalConfig = () => {
    const { type, item } = confirmModal;
    
    switch (type) {
      case 'delete':
        return {
          title: 'Delete Tourist Spot',
          description: `Are you sure you want to delete "${item?.name}"? This action cannot be undone.`,
          confirmText: 'Delete',
          variant: 'destructive' as const,
          icon: 'delete' as const,
        };
      case 'activate':
        return {
          title: 'Activate Tourist Spot',
          description: `Are you sure you want to activate "${item?.name}"? This will make it visible to all users.`,
          confirmText: 'Activate',
          variant: 'success' as const,
          icon: 'activate' as const,
        };
      case 'deactivate':
        return {
          title: 'Deactivate Tourist Spot',
          description: `Are you sure you want to deactivate "${item?.name}"? This will make it invisible to public users.`,
          confirmText: 'Deactivate',
          variant: 'warning' as const,
          icon: 'deactivate' as const,
        };
      default:
        return {
          title: 'Confirm Action',
          description: 'Are you sure you want to proceed?',
          confirmText: 'Confirm',
          variant: 'default' as const,
          icon: 'warning' as const,
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tourist spots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
             
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpots.map((spot) => (
              <TableRow key={spot.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {spot.imageUrl && (
                      <img 
                        src={getImageUrl(spot.imageUrl, 'tourist-spots')} 
                        alt={spot.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="font-medium">
                        <TruncatedText text={spot.name} maxLength={30} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <TruncatedText text={spot.description} maxLength={40} />
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm">
                        <TruncatedText text={spot.location} maxLength={20} />
                      </div>
                      {spot.address && (
                        <div className="text-xs text-muted-foreground">
                          <TruncatedText text={spot.address} maxLength={25} />
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {spot.contactNumber && (
                      <div>
                        <TruncatedText text={spot.contactNumber} maxLength={15} />
                      </div>
                    )}
                    {spot.email && (
                      <div className="text-xs text-muted-foreground">
                        <TruncatedText text={spot.email} maxLength={20} />
                      </div>
                    )}
                    {!spot.contactNumber && !spot.email && (
                      <div className="text-xs text-muted-foreground">
                        No contact info
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{spot.viewCount.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={spot.isActive === true ? 'default' : 'secondary'} className={spot.isActive === true ? 'bg-green-600 hover:bg-green-700' : ''}>
                    {spot.isActive === true ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{spot.createdAt ? formatDate(spot.createdAt) : 'Unknown'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = `/admin/tourist-spots/${spot.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(spot)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {spot.isActive === false && (
                        <DropdownMenuItem onClick={() => openConfirmModal('activate', spot)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      {spot.isActive === true && (
                        <DropdownMenuItem 
                          onClick={() => openConfirmModal('deactivate', spot)}
                          className="text-orange-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal('delete', spot)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredSpots.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No tourist spots found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmationModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
        onConfirm={handleConfirmAction}
        loading={confirmModal.loading}
        {...getModalConfig()}
      />
    </div>
  );
}