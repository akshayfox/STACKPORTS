import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup, updateGroup } from '@/services/groupService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Group } from '@/types/group';
import GroupForm from '../group-form';

interface GroupModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedGroup: Partial<Group> | null;
}

const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  setIsOpen,
  selectedGroup,
}) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Group> }) =>
      updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsOpen(false);
    },
  });

  const handleSubmit = (values: Partial<Group>) => {
    if (selectedGroup?._id) {
      updateMutation.mutate({ id: selectedGroup._id.toString(), data: values });
    } else {
      createMutation.mutate(values as Omit<Group, '_id'>);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
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
  );
};

export default GroupModal;
