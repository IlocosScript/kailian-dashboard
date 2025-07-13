'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  Star,
  TrendingUp,
  Tag,
  Send,
  Archive
} from 'lucide-react';
import { apiService, NewsArticle, getImageUrl } from '@/lib/api';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { showToast } from '@/lib/toast';

export default function ViewNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'publish' | 'unpublish';
    loading: boolean;
  }>({
    open: false,
    type: 'publish',
    loading: false,
  });

  const newsId = params.id as string;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getNewsById(newsId);
        
        if (response.success) {
          setNews(response.data);
        } else {
          setError(response.message || 'Failed to fetch news article');
        }
      } catch (err) {
        setError('Failed to connect to the API');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  const handlePublish = async () => {
    setConfirmModal({
      open: true,
      type: 'publish',
      loading: false,
    });
  };

  const handleUnpublish = async () => {
    setConfirmModal({
      open: true,
      type: 'unpublish',
      loading: false,
    });
  };

  const handleConfirmAction = async () => {
    if (!news) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      if (confirmModal.type === 'publish') {
        const response = await apiService.publishNews(news.id);
        if (response.success) {
          // Refresh the entire news data from API
          await fetchNews();
          showToast.success('News article published successfully');
        } else {
          throw new Error(response.message || 'Failed to publish news');
        }
      } else {
        const response = await apiService.unpublishNews(news.id);
        if (response.success) {
          // Refresh the entire news data from API
          await fetchNews();
          showToast.success('News article unpublished successfully');
        } else {
          throw new Error(response.message || 'Failed to unpublish news');
        }
      }
      setConfirmModal({ open: false, type: 'publish', loading: false });
    } catch (err) {
      const action = confirmModal.type === 'publish' ? 'publish' : 'unpublish';
      showToast.error(`Failed to ${action} article`, {
        description: 'Please try again or contact support if the problem persists.',
      });
      setConfirmModal(prev => ({ ...prev, loading: false }));
      console.error(`Error ${action}ing news:`, err);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await apiService.getNewsById(newsId);
      if (response.success) {
        setNews(response.data);
      }
    } catch (err) {
      console.error('Error refreshing news data:', err);
    }
  };

  const getModalConfig = () => {
    const { type } = confirmModal;
    
    if (type === 'publish') {
      return {
        title: 'Publish News Article',
        description: `Are you sure you want to publish "${news?.title}"? This will make it visible to all users.`,
        confirmText: 'Publish',
        variant: 'success' as const,
        icon: 'publish' as const,
      };
    } else {
      return {
        title: 'Unpublish News Article',
        description: `Are you sure you want to unpublish "${news?.title}"? This will make it invisible to public users.`,
        confirmText: 'Unpublish',
        variant: 'warning' as const,
        icon: 'unpublish' as const,
      };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not set';
    return timeString;
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive mb-2">
                {error || 'News article not found'}
              </p>
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to News
        </Button>
        <div className="flex space-x-2">
          {news.status !== 'Published' && (
            <Button 
              onClick={handlePublish}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Publish
            </Button>
          )}
          {news.status === 'Published' && (
            <Button 
              onClick={handleUnpublish}
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <Archive className="mr-2 h-4 w-4" />
              Unpublish
            </Button>
          )}
          <Button onClick={() => router.push(`/admin/news/${newsId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Article (Page)
          </Button>
          <Button onClick={() => setEditModalOpen(true)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Article (Modal)
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {getStatusBadge(news)}
                <Badge variant="outline">{news.category}</Badge>
              </div>
              <CardTitle className="text-3xl">{news.title}</CardTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>By {news.author}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {news.imageUrl && (
            <div className="w-full">
              <img 
                src={getImageUrl(news.imageUrl, 'news')} 
                alt={news.title}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Publication Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Publication</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{formatDate(news.publishedDate)}</span>
                    {news.publishedTime && (
                      <>
                        <Clock className="h-4 w-4 text-gray-500 ml-2" />
                        <span className="text-sm text-gray-900">{formatTime(news.publishedTime)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Event Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Event Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{news.location}</span>
                  </div>
                  {news.expectedAttendees && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Expected:</span>
                      <span className="text-sm text-gray-900">{news.expectedAttendees}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Engagement */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Engagement</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Views:</span>
                    <span className="font-medium text-gray-900">{news.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Content Section */}
          {news.fullContent && (
            <div className="space-y-4">
              <Separator />
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {news.fullContent}
                </div>
              </div>
            </div>
          )}

          {news.tags && news.tags.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-gray-900">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      <ConfirmationModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
        onConfirm={handleConfirmAction}
        loading={confirmModal.loading}
        {...getModalConfig()}
      />

      <NewsForm
        news={news}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSubmit={async (newsData, imageFile) => {
          try {
            const response = await apiService.updateNews(news.id, newsData, imageFile);
            if (response.success) {
              await fetchNews(); // Refresh the news data
              setEditModalOpen(false);
              showToast.success('News article updated successfully');
            } else {
              showToast.error('Failed to update news article', {
                description: response.message || 'Please try again or contact support if the problem persists.',
              });
            }
          } catch (err) {
            showToast.error('Failed to update news article', {
              description: 'Please try again or contact support if the problem persists.',
            });
            console.error('Error updating news:', err);
          }
        }}
      />
    </div>
  );
}