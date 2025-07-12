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
  Tag
} from 'lucide-react';
import { apiService, NewsArticle, getImageUrl } from '@/lib/api';

export default function ViewNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <Button onClick={() => router.push(`/admin/news?edit=${newsId}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Article
        </Button>
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
              {news.summary && (
                <p className="text-lg text-muted-foreground">{news.summary}</p>
              )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Author:</span>
              <span>{news.author}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(news.publishedDate)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Time:</span>
              <span>{formatTime(news.publishedTime)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Views:</span>
              <span>{news.viewCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              <span>{news.location}</span>
            </div>
            
            {news.expectedAttendees && (
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Expected Attendees:</span>
                <span>{news.expectedAttendees}</span>
              </div>
            )}
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tags:</span>
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

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Full Content</h3>
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {news.fullContent}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}