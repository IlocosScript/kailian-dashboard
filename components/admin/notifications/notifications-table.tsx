'use client';

import { useState } from 'react';
import { Notification } from '@/lib/mockData';
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
import { MoreHorizontal, Search, Edit, Trash2, Bell, ExternalLink } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface NotificationsTableProps {
  notifications: Notification[];
  onEdit: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export default function NotificationsTable({ notifications, onEdit, onDelete }: NotificationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    notification: Notification | null;
    loading: boolean;
  }>({
    open: false,
    notification: null,
    loading: false,
  });

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      'appointment': 'bg-blue-500',
      'issue': 'bg-orange-500',
      'system': 'bg-purple-500',
      'reminder': 'bg-green-500',
    };
    
    return (
      <Badge className={typeColors[type] || 'bg-gray-500'}>
        {type}
      </Badge>
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.notification) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.notification.id);
      setConfirmModal({ open: false, notification: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete notification');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (notification: Notification) => {
    setConfirmModal({
      open: true,
      notification,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
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
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action URL</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">{notification.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs truncate">
                    {notification.message}
                  </div>
                </TableCell>
                <TableCell>
                  {getTypeBadge(notification.type)}
                </TableCell>
                <TableCell>
                  <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                    {notification.isRead ? 'Read' : 'Unread'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {notification.actionUrl && (
                    <div className="flex items-center space-x-1">
                      <ExternalLink className="h-3 w-3" />
                      <span className="text-sm truncate max-w-xs">{notification.actionUrl}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(notification.createdAt)}
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
                      <DropdownMenuItem onClick={() => onEdit(notification)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(notification)}
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
            {filteredNotifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No notifications found</p>
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
        title="Delete Notification"
        description={`Are you sure you want to delete the notification "${confirmModal.notification?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}