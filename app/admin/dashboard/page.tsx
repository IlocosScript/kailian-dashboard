'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  Building, 
  Star,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import { mockDashboardStats } from '@/lib/mockData';

export default function DashboardPage() {
  const stats = mockDashboardStats;

  const dashboardCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Appointments',
      value: stats.activeAppointments.toString(),
      change: '+8%',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Pending Issues',
      value: stats.pendingIssues.toString(),
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects.toString(),
      change: '+15%',
      icon: Building,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your city management dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {card.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Customer Satisfaction</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.customerSatisfactionRating}/5.0
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on recent feedback and service ratings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Top Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topServices.map((service, index) => (
                <div key={service.serviceName} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{service.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{service.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.usageCount}</p>
                    <p className="text-xs text-muted-foreground">requests</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment confirmed</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Issue report submitted</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Pending Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Review business permits</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Process civil registry</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resolve issue reports</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                Create new appointment
              </button>
              <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                Add new user
              </button>
              <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                Generate reports
              </button>
              <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                View analytics
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}