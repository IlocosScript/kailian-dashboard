'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { News } from '@/types';
import { mockNews } from '@/lib/mockData';
import NewsTable from '@/components/admin/news/news-table';
import NewsForm from '@/components/admin/news/news-form';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>(mockNews);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddNews = () => {
    setSelectedNews(null);
    setFormOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setSelectedNews(newsItem);
    setFormOpen(true);
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter(item => item.id !== id));
  };

  const handleSubmitNews = (newsData: Omit<News, 'id'>) => {
    if (selectedNews) {
      // Update existing news
      setNews(news.map(item => 
        item.id === selectedNews.id 
          ? { ...newsData, id: selectedNews.id }
          : item
      ));
    } else {
      // Add new news
      const newNews: News = {
        ...newsData,
        id: Date.now().toString(),
      };
      setNews([newNews, ...news]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">
            Manage your tourism news and articles
          </p>
        </div>
        <Button onClick={handleAddNews}>
          <Plus className="mr-2 h-4 w-4" />
          Add News
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All News ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsTable
            news={news}
            onEdit={handleEditNews}
            onDelete={handleDeleteNews}
          />
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