'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { apiService, NewsArticle } from '@/lib/api';
import NewsTable from '@/components/admin/news/news-table';
import NewsForm from '@/components/admin/news/news-form';
import { showToast } from '@/lib/toast';

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
    // This function is now handled by the confirmation modal in NewsTable
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await apiService.deleteNews(id);
        if (response.success) {
          setNews(news.filter(item => item.id !== id));
          resolve();
        } else {
          reject(new Error(response.message || 'Failed to delete news'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handlePublishNews = async (id: number) => {
    // This function is now handled by the confirmation modal in NewsTable
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await apiService.publishNews(id);
        if (response.success) {
          setNews(news.map(item => 
            item.id === id 
              ? { ...item, status: 'Published' }
              : item
          ));
          resolve();
        } else {
          reject(new Error(response.message || 'Failed to publish news'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleUnpublishNews = async (id: number) => {
    // This function is now handled by the confirmation modal in NewsTable
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await apiService.unpublishNews(id);
        if (response.success) {
          setNews(news.map(item => 
            item.id === id 
              ? { ...item, status: 'Draft', publishedDate: '', publishedTime: '' }
              : item
          ));
          resolve();
        } else {
          reject(new Error(response.message || 'Failed to unpublish news'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSubmitNews = async (newsData: Partial<NewsArticle>, imageFile?: File, clearExistingImage?: boolean) => {
    try {
      let response;
      
      if (selectedNews) {
        // Update existing news
        response = await apiService.updateNews(selectedNews.id, newsData, imageFile, clearExistingImage);
        if (response.success) {
          setNews(news.map(item => 
            item.id === selectedNews.id 
              ? response.data
              : item
          ));
        }
      } else {
        // Create new news
        response = await apiService.createNews(newsData, imageFile);
        if (response.success) {
          setNews([response.data, ...news]);
        }
      }
      
      if (response.success) {
        setFormOpen(false);
        if (selectedNews) {
          showToast.success('News article updated successfully');
        } else {
          showToast.success('News article created successfully');
        }
      } else {
        const action = selectedNews ? 'update' : 'create';
        showToast.error(`Failed to ${action} news article`, {
          description: response.message || 'Please try again or contact support if the problem persists.',
        });
      }
    } catch (err) {
      const action = selectedNews ? 'update' : 'create';
      showToast.error(`Failed to ${action} news article`, {
        description: 'Please try again or contact support if the problem persists.',
      });
      console.error('Error saving news:', err);
    }
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
              onPublish={handlePublishNews}
              onUnpublish={handleUnpublishNews}
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