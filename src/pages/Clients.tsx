import  { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import { Client } from '@/types/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, deleteClient } from '@/services/clientService';
import { Button } from '@/components/ui/button';
import { DeleteIcon, Edit, FileText, MoreVertical} from 'lucide-react';
import ClientModal from '@/components/modal/ClientModal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

export default function Clients() {
  const navigate=useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Partial<Client> | null>(null);
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  console.log(clients)



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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/form/${client.template._id}`)}>
                <FileText className="mr-2 h-4 w-4" />
                View Form
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteMutation.mutate(client._id)}
                disabled={deleteMutation.isPending}
                className="text-red-600 focus:text-red-600"
              >
                <DeleteIcon className="mr-2 h-4 w-4" />

                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable 
          data={clients || []} 
          columns={columns} 
          searchPlaceholder="Search clients..." 
          onAddClick={handleAddClient}
          addButtonText="Add Client"
        />
      )}
  
      <ClientModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        selectedClient={selectedClient} 
      />
    </div>
  );
}