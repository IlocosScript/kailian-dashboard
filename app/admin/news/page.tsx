'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { apiService, NewsArticle } from '@/lib/api';
import NewsTable from '@/components/admin/news/news-table';
import NewsForm from '@/components/admin/news/news-form';

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getNews({ pageSize: 50 });
      
      if (response.success) {
        setNews(response.data);
      } else {
        setError(response.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Failed to connect to the API');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAddNews = () => {
    setSelectedNews(null);
    setFormOpen(true);
  };

  const handleEditNews = (newsItem: NewsArticle) => {
    setSelectedNews(newsItem);
    setFormOpen(true);
  };

  const handleDeleteNews = (id: number) => {
    // Note: This is client-side only since the API doesn't support DELETE
    setNews(news.filter(item => item.id !== id));
  };

  const handleSubmitNews = (newsData: Partial<NewsArticle>) => {
    // Note: This is client-side only since the API doesn't support POST/PUT
    if (selectedNews) {
      // Update existing news
      setNews(news.map(item => 
        item.id === selectedNews.id 
          ? { ...selectedNews, ...newsData }
          : item
      ));
    } else {
      // Add new news (client-side only)
      const newNews: NewsArticle = {
        id: Date.now(),
        title: newsData.title || '',
        summary: newsData.summary,
        fullContent: newsData.fullContent,
        imageUrl: newsData.imageUrl,
        publishedDate: new Date().toISOString().split('T')[0],
        publishedTime: new Date().toTimeString().split(' ')[0],
        location: newsData.location || '',
        expectedAttendees: newsData.expectedAttendees,
        category: newsData.category || 'Local',
        author: newsData.author || '',
        tags: newsData.tags || [],
        isFeatured: newsData.isFeatured || false,
        isTrending: newsData.isTrending || false,
        viewCount: 0,
        status: newsData.status || 'Published',
      };
      setNews([newNews, ...news]);
    }
    setFormOpen(false);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">News Management</h1>
            <p className="text-muted-foreground">
              Manage your tourism news and articles
            </p>
          </div>
          <Button onClick={fetchNews} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive mb-2">Failed to load news</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchNews} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Try Again
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
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">
            Manage your tourism news and articles
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchNews} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddNews}>
            <Plus className="mr-2 h-4 w-4" />
            Add News
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All News ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                  <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-24" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-20" />
                </div>
              ))}
            </div>
          ) : (
            <NewsTable
              news={news}
              onEdit={handleEditNews}
              onDelete={handleDeleteNews}
            />
          )}
        </CardContent>
      </Card>

      <NewsForm
        news={selectedNews}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitNews}
      />
    </div>
  );
}