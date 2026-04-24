'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Edit,
  Trash2,
  Star
} from 'lucide-react'

// Mock data for demonstration
const contacts = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    status: 'active',
    lastContact: '2 days ago',
    tags: ['VIP', 'Enterprise'],
    avatar: null,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@techstartup.com',
    phone: '+1 (555) 987-6543',
    company: 'Tech Startup Inc',
    status: 'active',
    lastContact: '1 week ago',
    tags: ['Lead', 'SaaS'],
    avatar: null,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@consulting.com',
    phone: '+1 (555) 456-7890',
    company: 'Johnson Consulting',
    status: 'inactive',
    lastContact: '3 months ago',
    tags: ['Prospect'],
    avatar: null,
  },
  {
    id: '4',
    name: 'Alice Wilson',
    email: 'alice.wilson@retail.com',
    phone: '+1 (555) 234-5678',
    company: 'Retail Solutions',
    status: 'active',
    lastContact: '5 hours ago',
    tags: ['Customer', 'E-commerce'],
    avatar: null,
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@finance.com',
    phone: '+1 (555) 345-6789',
    company: 'Financial Services LLC',
    status: 'active',
    lastContact: '1 day ago',
    tags: ['VIP', 'Finance'],
    avatar: null,
  },
]

export function ContactsTable() {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const toggleAllContacts = () => {
    setSelectedContacts(
      selectedContacts.length === contacts.length
        ? []
        : contacts.map(contact => contact.id)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedContacts.length === contacts.length}
                onChange={toggleAllContacts}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => toggleContact(contact.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatar || ''} alt={contact.name} />
                    <AvatarFallback>
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{contact.company}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor(contact.status)}>
                  {contact.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {contact.lastContact}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}