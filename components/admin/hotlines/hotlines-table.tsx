'use client';

import { useState } from 'react';
import { EmergencyHotline } from '@/lib/mockData';
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
import { MoreHorizontal, Search, Edit, Trash2, Phone, Clock, Building } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface HotlinesTableProps {
  hotlines: EmergencyHotline[];
  onEdit: (hotline: EmergencyHotline) => void;
  onDelete: (id: number) => void;
}

export default function HotlinesTable({ hotlines, onEdit, onDelete }: HotlinesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    hotline: EmergencyHotline | null;
    loading: boolean;
  }>({
    open: false,
    hotline: null,
    loading: false,
  });

  const filteredHotlines = hotlines.filter(hotline =>
    hotline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotline.phoneNumber.includes(searchTerm) ||
    hotline.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotline.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelete = async () => {
    if (!confirmModal.hotline) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.hotline.id);
      setConfirmModal({ open: false, hotline: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete hotline');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (hotline: EmergencyHotline) => {
    setConfirmModal({
      open: true,
      hotline,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hotlines..."
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
              <TableHead>Title</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Operating Hours</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHotlines.map((hotline) => (
              <TableRow key={hotline.id}>
                <TableCell>
                  <div className="font-medium">{hotline.title}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-mono">{hotline.phoneNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>{hotline.department}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs truncate">
                    {hotline.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={hotline.isEmergency ? 'destructive' : 'secondary'}>
                    {hotline.isEmergency ? 'Emergency' : 'General'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm">{hotline.operatingHours}</span>
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
                      <DropdownMenuItem onClick={() => onEdit(hotline)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(hotline)}
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
            {filteredHotlines.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No hotlines found</p>
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
        title="Delete Hotline"
        description={`Are you sure you want to delete the hotline "${confirmModal.hotline?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}