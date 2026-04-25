'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
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
  Star,
  Loader2
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  tags?: string[]
  notes?: string
  created_at: string
  updated_at: string
  user_id: string
}

export function ContactsTable() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [sortField, setSortField] = useState<'name' | 'email' | 'company' | 'created_at'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getContacts()
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await apiClient.deleteContact(id)
        setContacts(contacts.filter(contact => contact.id !== id))
      } catch (error) {
        console.error('Error deleting contact:', error)
      }
    }
  }

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
        : contacts.map((contact: Contact) => contact.id)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-nexus-green/10 text-nexus-green border border-nexus-green/20'
      case 'inactive':
        return 'bg-nexus-text-tertiary/10 text-nexus-text-tertiary border border-nexus-text-tertiary/20'
      default:
        return 'bg-nexus-blue/10 text-nexus-blue border border-nexus-blue/20'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-nexus-border bg-nexus-bg-secondary">
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedContacts.length === contacts.length}
                onChange={toggleAllContacts}
                className="rounded border-nexus-border"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
              Last Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
              Tags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-nexus-surface divide-y divide-nexus-border">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-nexus-blue mr-2" />
                  <span className="text-nexus-text-secondary">Loading contacts...</span>
                </div>
              </td>
            </tr>
          ) : contacts.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="text-nexus-text-secondary">
                  No contacts found. <button className="text-nexus-blue hover:underline">Add your first contact</button>
                </div>
              </td>
            </tr>
          ) : (
            contacts.map((contact: Contact) => (
              <tr key={contact.id} className="hover:bg-nexus-bg-secondary">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleContact(contact.id)}
                    className="rounded border-nexus-border"
                  />
                </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatar || ''} alt={contact.name} />
                    <AvatarFallback>
                      {contact.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-nexus-text-primary">
                      {contact.name}
                    </div>
                    <div className="text-sm text-nexus-text-secondary">
                      {contact.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-nexus-text-primary">{contact.company}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor('active')}>
                  Active
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-nexus-text-secondary">
                {new Date(contact.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <Mail className="h-4 w-4 text-nexus-text-tertiary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <Phone className="h-4 w-4 text-nexus-text-tertiary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <MessageSquare className="h-4 w-4 text-nexus-text-tertiary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <Edit className="h-4 w-4 text-nexus-text-tertiary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-nexus-bg-secondary"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4 text-nexus-red" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
        </tbody>
      </table>
    </div>
  )
}