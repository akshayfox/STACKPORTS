import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import GroupForm from '@/components/GroupForm';

// Define the Group type
interface Group {
  _id?: string;
  name: string;
  description?: string;
  clientId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API functions for CRUD operations
const fetchGroups = async (): Promise<{ groups: Group[] }> => {
  const response = await fetch('/api/groups');
  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }
  return response.json();
};

const createGroup = async (group: Omit<Group, '_id'>): Promise<Group> => {
  const response = await fetch('/api/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(group),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create group');
  }
  
  return response.json();
};

const updateGroup = async (group: Group): Promise<Group> => {
  const response = await fetch(`/api/groups/${group._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(group),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update group');
  }
  
  return response.json();
};

const deleteGroup = async (id: string): Promise<void> => {
  const response = await fetch(`/api/groups/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete group');
  }
};

export default function Groups() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  const queryClient = useQueryClient();
  
  // Query for fetching groups
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
  });
  
  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsOpen(false);
    },
    onError: (error) => {
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsOpen(false);
    },
    onError: (error) => {
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error) => {
    },
  });
  
  // Handle form submission
  const handleSubmit = (data: Group) => {
    if (selectedGroup?._id) {
      updateMutation.mutate({ ...data, _id: selectedGroup._id });
    } else {
      createMutation.mutate(data);
    }
  };
  
  // Handle add group button click
  const handleAddGroup = () => {
    setSelectedGroup(null);
    setIsOpen(true);
  };
  
  // Handle edit group button click
  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsOpen(true);
  };
  
  // Handle delete group button click
  const handleDeleteGroup = (id: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      deleteMutation.mutate(id);
    }
  };
  
  // Define table columns
  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const group = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditGroup(group)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteGroup(group._id!)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable 
          data={groups?.groups || []} 
          columns={columns} 
          searchPlaceholder="Search groups..." 
          onAddClick={handleAddGroup}
          addButtonText="Add Group"
        />
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup?._id ? 'Edit Group' : 'Add New Group'}
            </DialogTitle>
          </DialogHeader>
          <GroupForm 
            initialValues={selectedGroup || {}}
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}