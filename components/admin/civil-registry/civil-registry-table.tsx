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
import { MoreHorizontal, Search, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface CivilRegistryTableProps {
  civilRegistries: CivilRegistry[];
  onEdit: (entry: CivilRegistry) => void;
  onDelete: (appointmentId: string) => void;
}

export default function CivilRegistryTable({ civilRegistries, onEdit, onDelete }: CivilRegistryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    entry: CivilRegistry | null;
    loading: boolean;
  }>({
    open: false,
    entry: null,
    loading: false,
  });

  const filteredEntries = civilRegistries.filter(entry =>
    entry.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.purpose.toLowerCase().includes(searchTerm.toLowerCase())
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
      'Pending': 'bg-yellow-500',
      'Processing': 'bg-blue-500',
      'Ready for Pickup': 'bg-green-500',
      'Completed': 'bg-green-600',
      'Cancelled': 'bg-red-500',
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.entry) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.entry.appointmentId);
      setConfirmModal({ open: false, entry: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete civil registry entry');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (entry: CivilRegistry) => {
    setConfirmModal({
      open: true,
      entry,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search civil registry entries..."
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
              <TableHead>Appointment ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.appointmentId}>
                <TableCell>
                  <div className="font-medium">
                    {entry.appointmentId}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {entry.userId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>{entry.documentType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{entry.purpose}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.numberOfCopies}</Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(entry.status)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                    {entry.registryDate && (
                      <div className="text-xs text-muted-foreground">
                        Registry: {formatDate(entry.registryDate)}
                      </div>
                    )}
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
                      <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(entry)}
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
            {filteredEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No civil registry entries found</p>
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
        title="Delete Civil Registry Entry"
        description={`Are you sure you want to delete the civil registry entry for "${confirmModal.entry?.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}