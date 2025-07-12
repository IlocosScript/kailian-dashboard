import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, MapPin, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total News',
      value: '24',
      change: '+12%',
      icon: Newspaper,
    },
    {
      title: 'Tourist Spots',
      value: '18',
      change: '+3%',
      icon: MapPin,
    },
    {
      title: 'Monthly Visitors',
      value: '12.5K',
      change: '+23%',
      icon: Users,
    },
    {
      title: 'Engagement Rate',
      value: '84%',
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
        {stats.map((stat) => (
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
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New Tourism Campaign Launches</p>
                  <p className="text-xs text-muted-foreground">Published 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Local Festival Dates Announced</p>
                  <p className="text-xs text-muted-foreground">Published 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New Walking Trail Opens</p>
                  <p className="text-xs text-muted-foreground">Draft</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Tourist Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sunset Beach</p>
                  <p className="text-xs text-muted-foreground">Coastal Area</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">4.8★</p>
                  <p className="text-xs text-muted-foreground">1,234 visits</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Historic Downtown Square</p>
                  <p className="text-xs text-muted-foreground">Downtown District</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">4.5★</p>
                  <p className="text-xs text-muted-foreground">987 visits</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mountain View Trail</p>
                  <p className="text-xs text-muted-foreground">Mountain Region</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">4.3★</p>
                  <p className="text-xs text-muted-foreground">756 visits</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}