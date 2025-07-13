'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockUsers, User } from '@/lib/mockData';
import UsersTable from '@/components/admin/users/users-table';
import UserForm from '@/components/admin/users/user-form';
import { showToast } from '@/lib/toast';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    showToast.success('User deleted successfully');
  };

  const handleSubmitUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userData }
          : user
      ));
      showToast.success('User updated successfully');
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        createdAt: new Date(),
        isActive: true,
        ...userData
      } as User;
      setUsers([newUser, ...users]);
      showToast.success('User created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their profiles
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserForm
        user={selectedUser}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitUser}
      />
    </div>
  );
}