'use client';

import { useState } from 'react';
import { NewsArticle, getImageUrl } from '@/lib/api';
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
import { MoreHorizontal, Search, Edit, Trash2, Eye, Star, TrendingUp } from 'lucide-react';
import { Send, Archive } from 'lucide-react';
import { TruncatedText } from '@/components/ui/truncated-text';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

interface NewsTableProps {
  news: NewsArticle[];
  onEdit: (news: NewsArticle) => void;
  onDelete: (id: number) => void;
  onPublish: (id: number) => void;
  onUnpublish: (id: number) => void;
}

export default function NewsTable({ news, onEdit, onDelete, onPublish, onUnpublish }: NewsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'delete' | 'publish' | 'unpublish';
    item: NewsArticle | null;
    loading: boolean;
  }>({
    open: false,
    type: 'delete',
    item: null,
    loading: false,
  });

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (article: NewsArticle) => {
    if (article.isFeatured) {
      return <Badge className="bg-blue-500"><Star className="w-3 h-3 mr-1" />Featured</Badge>;
    }
    if (article.isTrending) {
      return <Badge className="bg-green-500"><TrendingUp className="w-3 h-3 mr-1" />Trending</Badge>;
    }
    return <Badge variant={article.status === 'Published' ? 'default' : 'secondary'}>{article.status}</Badge>;
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.item) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      switch (confirmModal.type) {
        case 'delete':
          await onDelete(confirmModal.item.id);
          showToast.success('News article deleted successfully');
          break;
        case 'publish':
          await onPublish(confirmModal.item.id);
          showToast.success('News article published successfully');
          break;
        case 'unpublish':
          await onUnpublish(confirmModal.item.id);
          showToast.success('News article unpublished successfully');
          break;
      }
      setConfirmModal({ open: false, type: 'delete', item: null, loading: false });
    } catch (error) {
      showToast.error(`Failed to ${confirmModal.type} article`, {
        description: 'Please try again or contact support if the problem persists.',
      });
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openConfirmModal = (type: 'delete' | 'publish' | 'unpublish', item: NewsArticle) => {
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
          title: 'Delete News Article',
          description: `Are you sure you want to delete "${item?.title}"? This action cannot be undone.`,
          confirmText: 'Delete',
          variant: 'destructive' as const,
          icon: 'delete' as const,
        };
      case 'publish':
        return {
          title: 'Publish News Article',
          description: `Are you sure you want to publish "${item?.title}"? This will make it visible to all users.`,
          confirmText: 'Publish',
          variant: 'success' as const,
          icon: 'publish' as const,
        };
      case 'unpublish':
        return {
          title: 'Unpublish News Article',
          description: `Are you sure you want to unpublish "${item?.title}"? This will make it invisible to public users.`,
          confirmText: 'Unpublish',
          variant: 'warning' as const,
          icon: 'unpublish' as const,
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
            placeholder="Search news..."
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
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNews.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {item.imageUrl && (
                      <img 
                        src={getImageUrl(item.imageUrl, 'news')} 
                        alt={item.title}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="font-medium">
                        <TruncatedText text={item.title} maxLength={50} />
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <TruncatedText text={item.author} showInitials={true} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(item)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{item.viewCount.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = `/admin/news/${item.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {item.status !== 'Published' && (
                        <DropdownMenuItem onClick={() => openConfirmModal('publish', item)}>
                          <Send className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {item.status === 'Published' && (
                        <DropdownMenuItem 
                          onClick={() => openConfirmModal('unpublish', item)}
                          className="text-orange-600"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Unpublish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => openConfirmModal('delete', item)}
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
            {filteredNews.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No news articles found</p>
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