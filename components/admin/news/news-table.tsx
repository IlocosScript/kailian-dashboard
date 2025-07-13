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

interface NewsTableProps {
  news: NewsArticle[];
  onEdit: (news: NewsArticle) => void;
  onDelete: (id: number) => void;
  onPublish: (id: number) => void;
  onUnpublish: (id: number) => void;
}

export default function NewsTable({ news, onEdit, onDelete, onPublish, onUnpublish }: NewsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

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
                  <div className="font-medium">
                    <TruncatedText text={item.title} maxLength={50} />
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
                        <DropdownMenuItem onClick={() => onPublish(item.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {item.status === 'Published' && (
                        <DropdownMenuItem 
                          onClick={() => {
                            if (confirm('Are you sure you want to unpublish this article? This will make it invisible to public users.')) {
                              onUnpublish(item.id);
                            }
                          }}
                          className="text-orange-600"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Unpublish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete(item.id)}
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
    </div>
  );
}