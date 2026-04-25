'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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

interface ContactFormProps {
  trigger?: React.ReactNode
  contact?: Contact
  onSubmit?: (data: Contact) => void
  onSuccess?: () => void
}

export function ContactForm({ trigger, contact, onSubmit, onSuccess }: ContactFormProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    position: contact?.position || '',
    tags: contact?.tags || [],
    notes: contact?.notes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (contact) {
        // Update existing contact
        await apiClient.updateContact(contact.id, formData)
      } else {
        // Create new contact
        await apiClient.createContact(formData)
      }

      onSubmit?.(formData as Contact)
      onSuccess?.()
      setOpen(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        tags: [],
        notes: '',
      })
    } catch (error) {
      console.error('Error saving contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Contact</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-nexus-text-primary">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-nexus-text-primary">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-nexus-text-primary">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-nexus-text-primary">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="text-nexus-text-primary">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder="e.g. CEO, Marketing Manager"
              className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-nexus-text-primary">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              placeholder="Additional notes about this contact..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-nexus-border hover:bg-nexus-bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-nexus-blue hover:bg-nexus-accent text-white"
              disabled={loading}
            >
              {loading ? 'Saving...' : (contact ? 'Update Contact' : 'Add Contact')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}