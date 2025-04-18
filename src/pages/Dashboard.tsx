import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Sample data for recent clients
const recentClients = [
  { id: 1, name: 'Acme Corporation', date: '2023-10-15', status: 'active' },
  { id: 2, name: 'Globex Industries', date: '2023-10-12', status: 'active' },
  { id: 3, name: 'Wayne Enterprises', date: '2023-10-10', status: 'pending' },
  { id: 4, name: 'Stark Industries', date: '2023-10-08', status: 'active' },
  { id: 5, name: 'Umbrella Corp', date: '2023-10-05', status: 'inactive' },
];

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +20.1% <ArrowUpRight className="h-4 w-4 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +18.2% <ArrowUpRight className="h-4 w-4 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ID Cards Generated</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +7.4% <ArrowUpRight className="h-4 w-4 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                -2.5% <ArrowDownRight className="h-4 w-4 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>
              Latest client registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Client Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date Added</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{client.name}</td>
                      <td className="px-4 py-3">{new Date(client.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          client.status === 'active' ? 'bg-green-100 text-green-800' :
                          client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-xs">View</button>
                          <button className="text-blue-600 hover:text-blue-800 text-xs">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent ID Cards</CardTitle>
              <CardDescription>
                Recently generated ID cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((id) => (
                  <div key={id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-12 h-12 rounded bg-gray-200 mr-4 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">ID Card #{1000 + id}</h4>
                      <p className="text-xs text-gray-500">Generated on {new Date(Date.now() - id * 86400000).toLocaleDateString()}</p>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Add Client</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <CreditCard className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Create ID Card</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <Activity className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">View Reports</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Billing</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}