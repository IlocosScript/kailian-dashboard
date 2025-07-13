'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockPublicProjects, PublicProject } from '@/lib/mockData';
import ProjectsTable from '@/components/admin/projects/projects-table';
import ProjectForm from '@/components/admin/projects/project-form';
import { showToast } from '@/lib/toast';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<PublicProject[]>(mockPublicProjects);
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddProject = () => {
    setSelectedProject(null);
    setFormOpen(true);
  };

  const handleEditProject = (project: PublicProject) => {
    setSelectedProject(project);
    setFormOpen(true);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
    showToast.success('Public project deleted successfully');
  };

  const handleSubmitProject = (projectData: Partial<PublicProject>) => {
    if (selectedProject) {
      // Update existing project
      setProjects(projects.map(project => 
        project.id === selectedProject.id 
          ? { ...project, ...projectData, updatedAt: new Date() }
          : project
      ));
      showToast.success('Public project updated successfully');
    } else {
      // Create new project
      const newProject: PublicProject = {
        id: Math.max(...projects.map(p => p.id), 0) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...projectData
      } as PublicProject;
      setProjects([newProject, ...projects]);
      showToast.success('Public project created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Public Projects Management</h1>
          <p className="text-muted-foreground">
            Manage public infrastructure and development projects
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddProject}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectsTable
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        </CardContent>
      </Card>

      <ProjectForm
        project={selectedProject}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitProject}
      />
    </div>
  );
}