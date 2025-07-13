'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockServiceCategories, ServiceCategory } from '@/lib/mockData';
import CategoriesTable from '@/components/admin/categories/categories-table';
import CategoryForm from '@/components/admin/categories/category-form';
import { showToast } from '@/lib/toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>(mockServiceCategories);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEditCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    showToast.success('Service category deleted successfully');
  };

  const handleSubmitCategory = (categoryData: Partial<ServiceCategory>) => {
    if (selectedCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === selectedCategory.id 
          ? { ...category, ...categoryData }
          : category
      ));
      showToast.success('Service category updated successfully');
    } else {
      // Create new category
      const newCategory: ServiceCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        createdAt: new Date(),
        ...categoryData
      } as ServiceCategory;
      setCategories([newCategory, ...categories]);
      showToast.success('Service category created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Categories Management</h1>
          <p className="text-muted-foreground">
            Manage service categories and organization
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriesTable
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </CardContent>
      </Card>

      <CategoryForm
        category={selectedCategory}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
}