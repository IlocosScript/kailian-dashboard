'use client';

import { useState } from 'react';
import { User } from '@/lib/mockData';
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
import { MoreHorizontal, Search, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    user: User | null;
    loading: boolean;
  }>({
    open: false,
    user: null,
    loading: false,
  });

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm)
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.user) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.user.id);
      setConfirmModal({ open: false, user: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete user');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (user: User) => {
    setConfirmModal({
      open: true,
      user,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.middleName} {user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {user.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs truncate">
                    {user.address}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
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
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(user)}
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
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
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
        title="Delete User"
        description={`Are you sure you want to delete "${confirmModal.user?.firstName} ${confirmModal.user?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}