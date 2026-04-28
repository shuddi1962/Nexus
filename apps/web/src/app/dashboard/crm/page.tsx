'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Mail, Phone, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockContacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', company: 'Acme Corp', status: 'active', lastContact: '2 hours ago' },
  { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', phone: '+1 234 567 891', company: 'TechCorp', status: 'active', lastContact: '1 day ago' },
  { id: 3, name: 'Bob Johnson', email: 'bob@startup.io', phone: '+1 234 567 892', company: 'Startup Inc', status: 'lead', lastContact: '3 days ago' },
  { id: 4, name: 'Alice Williams', email: 'alice@enterprise.com', phone: '+1 234 567 893', company: 'Enterprise Co', status: 'customer', lastContact: '1 week ago' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@smallbiz.com', phone: '+1 234 567 894', company: 'SmallBiz LLC', status: 'inactive', lastContact: '2 weeks ago' },
]

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  lead: 'bg-blue-100 text-blue-700',
  customer: 'bg-purple-100 text-purple-700',
  inactive: 'bg-slate-100 text-slate-600',
}

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelectContact = (id: number) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts & CRM</h1>
          <p className="text-slate-500 mt-1">Manage your contacts and customer relationships.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <Upload className="w-4 h-4 mr-2 text-blue-600" />
            Import
          </Button>
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2 text-blue-600" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Contacts', value: '1,247', change: '+12%', color: 'blue' },
          { title: 'New This Month', value: '156', change: '+8%', color: 'green' },
          { title: 'Active Conversations', value: '89', change: '7%', color: 'purple' },
          { title: 'Qualified Leads', value: '342', change: '27%', color: 'pink' },
        ].map((stat, index) => (
          <Card key={index} className="border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{stat.title}</span>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  stat.color === 'blue' && "bg-blue-50 text-blue-600",
                  stat.color === 'green' && "bg-green-50 text-green-600",
                  stat.color === 'purple' && "bg-purple-50 text-purple-600",
                  stat.color === 'pink' && "bg-pink-50 text-pink-600",
                )}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search contacts by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                <Filter className="w-4 h-4 mr-2 text-blue-600" />
                Filters
              </Button>
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Contact</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleSelectContact(contact.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{contact.name}</div>
                        <div className="text-sm text-slate-500">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="w-4 h-4" />
                      {contact.company}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("font-medium", statusColors[contact.status])}>
                      {contact.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{contact.lastContact}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                        <Mail className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                        <Phone className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredContacts.length}</span> of <span className="font-medium">{mockContacts.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-600">1</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}