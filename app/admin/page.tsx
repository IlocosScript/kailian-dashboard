'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, MapPin, Users, TrendingUp } from 'lucide-react';
import { apiService, NewsArticle, TouristSpot, getImageUrl } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNews: 0,
    totalTouristSpots: 0,
    monthlyVisitors: 0,
    engagementRate: 0,
  });
  const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
  const [popularSpots, setPopularSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch news and tourist spots data
        const [newsResponse, spotsResponse, featuredNewsResponse] = await Promise.all([
          apiService.getNews({ pageSize: 5 }),
          apiService.getTouristSpots({ pageSize: 5, isActive: true }),
          apiService.getFeaturedNews(),
        ]);

        if (newsResponse.success) {
          setRecentNews(newsResponse.data);
          setStats(prev => ({ ...prev, totalNews: newsResponse.data.length }));
        }

        if (spotsResponse.success) {
          // Sort by view count for popular spots
          const sortedSpots = spotsResponse.data.sort((a, b) => b.viewCount - a.viewCount);
          setPopularSpots(sortedSpots);
          setStats(prev => ({ ...prev, totalTouristSpots: spotsResponse.data.length }));
        }

        // Calculate total visitors from tourist spots
        if (spotsResponse.success) {
          const totalVisitors = spotsResponse.data.reduce((sum, spot) => sum + spot.viewCount, 0);
          setStats(prev => ({ 
            ...prev, 
            monthlyVisitors: totalVisitors,
            engagementRate: Math.round((featuredNewsResponse.data?.length || 0) / Math.max(newsResponse.data.length, 1) * 100)
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (article: NewsArticle) => {
    if (article.isFeatured) return 'bg-blue-500';
    if (article.isTrending) return 'bg-green-500';
    if (article.status === 'Published') return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getStatusLabel = (article: NewsArticle) => {
    if (article.isFeatured) return 'Featured';
    if (article.isTrending) return 'Trending';
    return article.status;
  };

  const dashboardStats = [
    {
      title: 'Total News',
      value: loading ? '...' : stats.totalNews.toString(),
      change: '+12%',
      icon: Newspaper,
    },
    {
      title: 'Tourist Spots',
      value: loading ? '...' : stats.totalTouristSpots.toString(),
      change: '+3%',
      icon: MapPin,
    },
    {
      title: 'Total Views',
      value: loading ? '...' : `${(stats.monthlyVisitors / 1000).toFixed(1)}K`,
      change: '+23%',
      icon: Users,
    },
    {
      title: 'Featured Rate',
      value: loading ? '...' : `${stats.engagementRate}%`,
      change: '+8%',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your tourism management dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent News</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentNews.slice(0, 3).map((article) => (
                  <div key={article.id} className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(article)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getStatusLabel(article)} • {formatDate(article.publishedDate)}
                      </p>
                    </div>
                  </div>
                ))}
                {recentNews.length === 0 && (
                  <p className="text-sm text-muted-foreground">No news articles found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Tourist Spots</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-12" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {popularSpots.slice(0, 3).map((spot) => (
                  <div key={spot.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{spot.name}</p>
                      <p className="text-xs text-muted-foreground">{spot.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{spot.rating}★</p>
                      <p className="text-xs text-muted-foreground">{spot.viewCount.toLocaleString()} views</p>
                    </div>
                  </div>
                ))}
                {popularSpots.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tourist spots found</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}