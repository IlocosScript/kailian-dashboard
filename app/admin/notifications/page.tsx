'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockNotifications, Notification } from '@/lib/mockData';
import NotificationsTable from '@/components/admin/notifications/notifications-table';
import NotificationForm from '@/components/admin/notifications/notification-form';
import { showToast } from '@/lib/toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddNotification = () => {
    setSelectedNotification(null);
    setFormOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormOpen(true);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    showToast.success('Notification deleted successfully');
  };

  const handleSubmitNotification = (notificationData: Partial<Notification>) => {
    if (selectedNotification) {
      // Update existing notification
      setNotifications(notifications.map(notification => 
        notification.id === selectedNotification.id 
          ? { ...notification, ...notificationData }
          : notification
      ));
      showToast.success('Notification updated successfully');
    } else {
      // Create new notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        createdAt: new Date(),
        isRead: false,
        ...notificationData
      } as Notification;
      setNotifications([newNotification, ...notifications]);
      showToast.success('Notification created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications Management</h1>
          <p className="text-muted-foreground">
            Manage system notifications and alerts
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddNotification}>
            <Plus className="mr-2 h-4 w-4" />
            Add Notification
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsTable
            notifications={notifications}
            onEdit={handleEditNotification}
            onDelete={handleDeleteNotification}
          />
        </CardContent>
      </Card>

      <NotificationForm
        notification={selectedNotification}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitNotification}
      />
    </div>
  );
}