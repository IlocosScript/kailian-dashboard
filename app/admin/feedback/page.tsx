'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockFeedback, Feedback } from '@/lib/mockData';
import FeedbackTable from '@/components/admin/feedback/feedback-table';
import FeedbackForm from '@/components/admin/feedback/feedback-form';
import { showToast } from '@/lib/toast';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddFeedback = () => {
    setSelectedFeedback(null);
    setFormOpen(true);
  };

  const handleEditFeedback = (feedbackItem: Feedback) => {
    setSelectedFeedback(feedbackItem);
    setFormOpen(true);
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedback(feedback.filter(item => item.id !== id));
    showToast.success('Feedback deleted successfully');
  };

  const handleSubmitFeedback = (feedbackData: Partial<Feedback>) => {
    if (selectedFeedback) {
      // Update existing feedback
      setFeedback(feedback.map(item => 
        item.id === selectedFeedback.id 
          ? { ...item, ...feedbackData }
          : item
      ));
      showToast.success('Feedback updated successfully');
    } else {
      // Create new feedback
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        createdAt: new Date(),
        ...feedbackData
      } as Feedback;
      setFeedback([newFeedback, ...feedback]);
      showToast.success('Feedback created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Management</h1>
          <p className="text-muted-foreground">
            Manage user feedback and service ratings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddFeedback}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feedback
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Feedback ({feedback.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackTable
            feedback={feedback}
            onEdit={handleEditFeedback}
            onDelete={handleDeleteFeedback}
          />
        </CardContent>
      </Card>

      <FeedbackForm
        feedback={selectedFeedback}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
}