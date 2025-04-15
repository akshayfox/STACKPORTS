import React, { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import { Client } from '@/types/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, updateClient, deleteClient } from '@/services/clientService';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ClientForm from '@/components/ClientForm';

export default function Clients() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Partial<Client> | null>(null);
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  console.log(clients)

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => 
      updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsOpen(true);
  };

  const handleSubmit = (values: Partial<Client>) => {
    if (selectedClient?._id) {
      updateMutation.mutate({ id: selectedClient._id, data: values });
    } else {
      createMutation.mutate(values as Omit<Client, '_id'>);
    }
  };

  const columnHelper = createColumnHelper<Client>();

  const columns = [
    columnHelper.accessor('fullname', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('place', {
      header: 'Place',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('contact', {
      header: 'Contact',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('grouptitle', {
      header: 'Group',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    }),
    columnHelper.accessor('_id', {
      header: 'Actions',
      cell: info => {
        const client = info.row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditClient(client)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the client.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteMutation.mutate(client._id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    }),
  ];

  // In your Clients.tsx file, update the return statement:
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable 
          data={clients?.clients || []} 
          columns={columns} 
          searchPlaceholder="Search clients..." 
          onAddClick={handleAddClient}
          addButtonText="Add Client"
        />
      )}
  
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClient?._id ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>
          <ClientForm 
            initialValues={selectedClient || {}}
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}