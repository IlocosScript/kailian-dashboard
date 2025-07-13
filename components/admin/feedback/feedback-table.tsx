'use client';

import { useState } from 'react';
import { Feedback } from '@/lib/mockData';
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
import { MoreHorizontal, Search, Edit, Trash2, Star, MessageSquare } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface FeedbackTableProps {
  feedback: Feedback[];
  onEdit: (feedback: Feedback) => void;
  onDelete: (id: string) => void;
}

export default function FeedbackTable({ feedback, onEdit, onDelete }: FeedbackTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    feedback: Feedback | null;
    loading: boolean;
  }>({
    open: false,
    feedback: null,
    loading: false,
  });

  const filteredFeedback = feedback.filter(item =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.comment && item.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      'App': 'bg-blue-500',
      'Service': 'bg-green-500',
    };
    
    return (
      <Badge className={typeColors[type] || 'bg-gray-500'}>
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'New': 'bg-blue-500',
      'Reviewed': 'bg-green-500',
      'Resolved': 'bg-purple-500',
      'Dismissed': 'bg-gray-500',
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm">({rating})</span>
      </div>
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.feedback) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.feedback.id);
      setConfirmModal({ open: false, feedback: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete feedback');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (feedbackItem: Feedback) => {
    setConfirmModal({
      open: true,
      feedback: feedbackItem,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
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
              <TableHead>Type</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {getTypeBadge(item.type)}
                </TableCell>
                <TableCell>
                  {renderStars(item.rating)}
                </TableCell>
                <TableCell>
                  {item.category && (
                    <Badge variant="outline">{item.category}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.comment ? (
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm max-w-xs truncate">{item.comment}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No comment</span>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(item.createdAt)}
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
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(item)}
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
            {filteredFeedback.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No feedback found</p>
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
        title="Delete Feedback"
        description={`Are you sure you want to delete this ${confirmModal.feedback?.type} feedback? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}