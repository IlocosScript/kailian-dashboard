'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockAnnouncements } from '@/lib/mockData';
import { Announcement } from '@/types';
import AnnouncementsTable from '@/components/admin/announcements/announcements-table';
import AnnouncementForm from '@/components/admin/announcements/announcement-form';
import { showToast } from '@/lib/toast';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddAnnouncement = () => {
    setSelectedAnnouncement(null);
    setFormOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormOpen(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(item => item.id !== id));
    showToast.success('Announcement deleted successfully');
  };

  const handleSubmitAnnouncement = (announcementData: Partial<Announcement>) => {
    if (selectedAnnouncement) {
      // Update existing announcement
      setAnnouncements(announcements.map(item => 
        item.id === selectedAnnouncement.id 
          ? { ...item, ...announcementData }
          : item
      ));
      showToast.success('Announcement updated successfully');
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        publishedAt: new Date().toISOString(),
        status: 'active',
        ...announcementData
      } as Announcement;
      setAnnouncements([newAnnouncement, ...announcements]);
      showToast.success('Announcement created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements Management</h1>
          <p className="text-muted-foreground">
            Manage public announcements and notices
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddAnnouncement}>
            <Plus className="mr-2 h-4 w-4" />
            Add Announcement
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Announcements ({announcements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementsTable
            announcements={announcements}
            onEdit={handleEditAnnouncement}
            onDelete={handleDeleteAnnouncement}
          />
        </CardContent>
      </Card>

      <AnnouncementForm
        announcement={selectedAnnouncement}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitAnnouncement}
      />
    </div>
  );
}