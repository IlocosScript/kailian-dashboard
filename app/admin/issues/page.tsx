'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockIssueReports, IssueReport } from '@/lib/mockData';
import IssuesTable from '@/components/admin/issues/issues-table';
import IssueForm from '@/components/admin/issues/issue-form';
import { showToast } from '@/lib/toast';

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueReport[]>(mockIssueReports);
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddIssue = () => {
    setSelectedIssue(null);
    setFormOpen(true);
  };

  const handleEditIssue = (issue: IssueReport) => {
    setSelectedIssue(issue);
    setFormOpen(true);
  };

  const handleDeleteIssue = (id: string) => {
    setIssues(issues.filter(issue => issue.id !== id));
    showToast.success('Issue report deleted successfully');
  };

  const handleSubmitIssue = (issueData: Partial<IssueReport>) => {
    if (selectedIssue) {
      // Update existing issue
      setIssues(issues.map(issue => 
        issue.id === selectedIssue.id 
          ? { ...issue, ...issueData }
          : issue
      ));
      showToast.success('Issue report updated successfully');
    } else {
      // Create new issue
      const newIssue: IssueReport = {
        id: Date.now().toString(),
        referenceNumber: `ISS-${new Date().getFullYear()}-${String(issues.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        photos: [],
        ...issueData
      } as IssueReport;
      setIssues([newIssue, ...issues]);
      showToast.success('Issue report created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issue Reports Management</h1>
          <p className="text-muted-foreground">
            Manage citizen issue reports and complaints
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddIssue}>
            <Plus className="mr-2 h-4 w-4" />
            Add Issue Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Issue Reports ({issues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <IssuesTable
            issues={issues}
            onEdit={handleEditIssue}
            onDelete={handleDeleteIssue}
          />
        </CardContent>
      </Card>

      <IssueForm
        issue={selectedIssue}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitIssue}
      />
    </div>
  );
}