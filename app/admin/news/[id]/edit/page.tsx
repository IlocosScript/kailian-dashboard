'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { apiService, NewsArticle } from '@/lib/api';
import NewsForm from '@/components/admin/news/news-form';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const handleSubmitNews = async (newsData: Partial<NewsArticle>, imageFile?: File) => {
    if (!news) return;
    
    try {
      setSaving(true);
      const response = await apiService.updateNews(news.id, newsData, imageFile);
      
      if (response.success) {
        // Navigate back to view page after successful update
        router.push(`/admin/news/${newsId}`);
      } else {
        setError(response.message || 'Failed to update news');
      }
    } catch (err) {
      setError('Failed to update news');
      console.error('Error updating news:', err);
    } finally {
      setSaving(false);
    }
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
        <Button variant="outline" onClick={() => router.push(`/admin/news/${newsId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to View
        </Button>
        <div className="text-sm text-muted-foreground">
          Editing: {news.title}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit News Article</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsForm
            news={news}
            open={true}
            onOpenChange={() => {}} // Not used in this context
            onSubmit={handleSubmitNews}
          />
        </CardContent>
      </Card>
    </div>
  );
}