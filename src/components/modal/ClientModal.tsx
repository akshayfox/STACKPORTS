import React from 'react';
import { Client } from '@/types/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient, updateClient } from '@/services/clientService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ClientForm from '@/components/ClientForm';

interface ClientModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedClient: Partial<Client> | null;
}

const ClientModal: React.FC<ClientModalProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedClient 
}) => {
  const queryClient = useQueryClient();

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

  const handleSubmit = (values: Partial<Client>) => {
    if (selectedClient?._id) {
      updateMutation.mutate({ id: selectedClient._id, data: values });
    } else {
      createMutation.mutate(values as Omit<Client, '_id'>);
    }
  };

  return (
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
  );
};

export default ClientModal;