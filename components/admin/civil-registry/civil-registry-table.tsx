'use client';

import { useState } from 'react';
import { CivilRegistry } from '@/lib/mockData';
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
import { MoreHorizontal, Search, Edit, Trash2, FileText, Hash } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface CivilRegistryTableProps {
  civilRegistry: CivilRegistry[];
  onEdit: (registry: CivilRegistry) => void;
  onDelete: (appointmentId: string) => void;
}

export default function CivilRegistryTable({ civilRegistry, onEdit, onDelete }: CivilRegistryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    registry: CivilRegistry | null;
    loading: boolean;
  }>({
    open: false,
    registry: null,
    loading: false,
  });

  const filteredRegistry = civilRegistry.filter(registry =>
    registry.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registry.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (registry.registryNumber && registry.registryNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Completed': 'bg-green-500',
      'Processing': 'bg-blue-500',
      'Pending': 'bg-yellow-500',
      'Rejected': 'bg-red-500',
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.registry) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.registry.appointmentId);
      setConfirmModal({ open: false, registry: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete civil registry request');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (registry: CivilRegistry) => {
    setConfirmModal({
      open: true,
      registry,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search registry requests..."
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
              <TableHead>Document Type</TableHead>
              <TableHead>Requestor</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Registry Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistry.map((registry) => (
              <TableRow key={registry.appointmentId}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{registry.documentType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{registry.userName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{registry.purpose}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{registry.numberOfCopies}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {registry.registryNumber && (
                      <div className="flex items-center space-x-1 text-xs">
                        <Hash className="h-3 w-3" />
                        <span>{registry.registryNumber}</span>
                      </div>
                    )}
                    {registry.registryDate && (
                      <div className="text-xs text-muted-foreground">
                        {formatDate(registry.registryDate)}
                      </div>
                    )}
                    {registry.registryPlace && (
                      <div className="text-xs text-muted-foreground">
                        {registry.registryPlace}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(registry.status)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(registry.createdAt)}
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
                      <DropdownMenuItem onClick={() => onEdit(registry)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(registry)}
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
            {filteredRegistry.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No registry requests found</p>
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
        title="Delete Registry Request"
        description={`Are you sure you want to delete the ${confirmModal.registry?.documentType} request for "${confirmModal.registry?.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}