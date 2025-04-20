import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface DeleteModalProps {
  title?: string;
  description?: string;
  triggerButton?: React.ReactNode;
  onDelete: () => void;
  isDeleting?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title = 'Are you sure?',
  description = 'This action cannot be undone. This will permanently delete this item.',
  triggerButton,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;