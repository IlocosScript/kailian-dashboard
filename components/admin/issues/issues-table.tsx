'use client';

import { useState } from 'react';
import { IssueReport } from '@/lib/mockData';
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
import { MoreHorizontal, Search, Edit, Trash2, MapPin, AlertTriangle } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface IssuesTableProps {
  issues: IssueReport[];
  onEdit: (issue: IssueReport) => void;
  onDelete: (id: string) => void;
}

export default function IssuesTable({ issues, onEdit, onDelete }: IssuesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    issue: IssueReport | null;
    loading: boolean;
  }>({
    open: false,
    issue: null,
    loading: false,
  });

  const filteredIssues = issues.filter(issue =>
    issue.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.location.toLowerCase().includes(searchTerm.toLowerCase())
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
      'Reported': 'bg-yellow-500',
      'In Progress': 'bg-blue-500',
      'Resolved': 'bg-green-500',
      'Closed': 'bg-gray-500',
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyColors: Record<string, string> = {
      'Low': 'bg-green-500',
      'Medium': 'bg-yellow-500',
      'High': 'bg-red-500',
      'Critical': 'bg-red-700',
    };
    
    return (
      <Badge className={urgencyColors[urgency] || 'bg-gray-500'}>
        {urgency}
      </Badge>
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.issue) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.issue.id);
      setConfirmModal({ open: false, issue: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete issue report');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (issue: IssueReport) => {
    setConfirmModal({
      open: true,
      issue,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issue reports..."
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
              <TableHead>Reference</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <div className="font-medium">
                    {issue.referenceNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{issue.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {issue.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{issue.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">{issue.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getUrgencyBadge(issue.urgencyLevel)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(issue.status)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(issue.createdAt)}
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
                      <DropdownMenuItem onClick={() => onEdit(issue)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(issue)}
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
            {filteredIssues.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No issue reports found</p>
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
        title="Delete Issue Report"
        description={`Are you sure you want to delete issue report "${confirmModal.issue?.referenceNumber}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}