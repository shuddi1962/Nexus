'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ContactsTable } from '@/components/crm/contacts-table'
import { ContactForm } from '@/components/crm/contact-form'
import { Plus, Search, Filter, Download, Upload } from 'lucide-react'

export default function CRMPage() {
  const contactsTableRef = useRef<{ refreshContacts: () => void } | null>(null)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Contacts & CRM</h1>
          <p className="text-nexus-text-secondary">Manage your contacts and customer relationships.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Upload className="w-4 h-4 mr-2 text-nexus-blue" />
            Import
          </Button>
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Download className="w-4 h-4 mr-2 text-nexus-blue" />
            Export
          </Button>
          <ContactForm
            trigger={
              <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            }
            onSuccess={() => {
              // This will be handled by the ContactsTable component refreshing itself
              window.location.reload()
            }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">1,247</div>
            <p className="text-xs text-nexus-text-secondary">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">156</div>
            <p className="text-xs text-nexus-text-secondary">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Active Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">89</div>
            <p className="text-xs text-nexus-text-secondary">
              7% of total contacts
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">342</div>
            <p className="text-xs text-nexus-text-secondary">
              27% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-nexus-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary h-4 w-4" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-10 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
                <Filter className="w-4 h-4 mr-2 text-nexus-blue" />
                Filters
              </Button>
              <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="border-nexus-border">
        <CardContent className="p-0">
          <ContactsTable />
        </CardContent>
      </Card>
    </div>
  )
}