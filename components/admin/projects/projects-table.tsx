'use client';

import { useState } from 'react';
import { PublicProject } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { MoreHorizontal, Search, Edit, Trash2, Building, DollarSign, Calendar } from 'lucide-react';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface ProjectsTableProps {
  projects: PublicProject[];
  onEdit: (project: PublicProject) => void;
  onDelete: (id: number) => void;
}

export default function ProjectsTable({ projects, onEdit, onDelete }: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    project: PublicProject | null;
    loading: boolean;
  }>({
    open: false,
    project: null,
    loading: false,
  });

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase()))
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
      'Completed': 'bg-green-500',
      'In Progress': 'bg-blue-500',
      'Planning': 'bg-yellow-500',
      'On Hold': 'bg-orange-500',
      'Cancelled': 'bg-red-500',
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.project) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      await onDelete(confirmModal.project.id);
      setConfirmModal({ open: false, project: null, loading: false });
    } catch (error) {
      showToast.error('Failed to delete project');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (project: PublicProject) => {
    setConfirmModal({
      open: true,
      project,
      loading: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
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
              <TableHead>Project Title</TableHead>
              <TableHead>Contractor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{project.title}</div>
                    {project.location && (
                      <div className="text-sm text-muted-foreground">
                        {project.location}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{project.contractor}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.projectType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>₱{project.cost.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={project.progress || 0} className="w-16" />
                    <div className="text-xs text-center">{project.progress || 0}%</div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(project.status)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>Start: {formatDate(project.startDate)}</span>
                    </div>
                    {project.expectedEndDate && (
                      <div className="text-xs text-muted-foreground">
                        End: {formatDate(project.expectedEndDate)}
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
                      <DropdownMenuItem onClick={() => onEdit(project)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal(project)}
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
            {filteredProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No projects found</p>
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
        title="Delete Project"
        description={`Are you sure you want to delete the project "${confirmModal.project?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        icon="delete"
      />
    </div>
  );
}