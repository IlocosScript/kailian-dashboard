'use client';

import { useState } from 'react';
import { BusinessPermit } from '@/lib/mockData';
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
import { MoreHorizontal, Search, Edit, Trash2, Building, DollarSign } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface BusinessPermitsTableProps {
  businessPermits: BusinessPermit[];
  onEdit: (permit: BusinessPermit) => void;
  onDelete: (appointmentId: string) => void;
}

export default function BusinessPermitsTable({ businessPermits, onEdit, onDelete }: BusinessPermitsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    permit: BusinessPermit | null;
    loading: boolean;
  }>({
    open: false,
    permit: null,
    loading: false,
  });

  const filteredPermits = businessPermits.filter(permit =>
    permit.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Approved': 'bg-green-500',
      'Under Review': 'bg-yellow-500',
      'Pending': 'bg-blue-500',
      'Rejected': 'bg-red-500',
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.permit) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.permit.appointmentId);
      setConfirmModal({ open: false, permit: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete business permit');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (permit: BusinessPermit) => {
    setConfirmModal({
      open: true,
      permit,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search business permits..."
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
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Investment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermits.map((permit) => (
              <TableRow key={permit.appointmentId}>
                <TableCell>
                  <div>
                    <div className="font-medium">{permit.businessName}</div>
                    <div className="text-sm text-muted-foreground">
                      {permit.serviceType}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{permit.ownerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {permit.userName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{permit.businessType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs truncate">
                    {permit.businessAddress}
                  </div>
                </TableCell>
                <TableCell>
                  {permit.capitalInvestment && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>₱{permit.capitalInvestment.toLocaleString()}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(permit.status)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(permit.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(permit)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(permit)}
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
            {filteredPermits.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No business permits found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmationModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
        onConfirm={handleConfirmDelete}
        loading={confirmModal.loading}
        title="Delete Business Permit"
        description={`Are you sure you want to delete the business permit for "${confirmModal.permit?.businessName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}