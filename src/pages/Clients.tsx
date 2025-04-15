import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

// Sample client data type
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinedDate: string;
}

// Sample data
const data: Client[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'Active', joinedDate: '2023-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', status: 'Inactive', joinedDate: '2023-02-20' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '345-678-9012', status: 'Active', joinedDate: '2023-03-10' },
  // Add more sample data as needed
];

const columnHelper = createColumnHelper<Client>();

export default function Clients() {
  const handleAddClient = () => {
    // Handle adding a new client
    console.log('Add client clicked');
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          info.getValue() === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('joinedDate', {
      header: 'Joined Date',
      cell: info => info.getValue(),
    }),
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <DataTable 
        data={data} 
        columns={columns} 
        searchPlaceholder="Search clients..." 
        addButtonText="Add Client"
        onAddClick={handleAddClient}
      />
    </div>
  );
}