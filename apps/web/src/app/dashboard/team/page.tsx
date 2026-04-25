'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building,
  Users,
  Settings,
  Shield,
  Mail,
  Phone,
  Globe,
  Palette,
  Save,
  UserPlus,
  Trash2
} from 'lucide-react'

// Mock organization data
const organization = {
  id: '1',
  name: 'Acme Corporation',
  domain: 'acme.com',
  logo: null,
  description: 'Leading technology company focused on digital transformation.',
  industry: 'Technology',
  size: '100-500',
  website: 'https://acme.com',
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Business St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'USA',
  },
  settings: {
    timezone: 'PST',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    whiteLabel: false,
    customDomain: null,
  },
}

const teamMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@acme.com',
    role: 'owner',
    avatar: null,
    status: 'active',
    joinedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    role: 'admin',
    avatar: null,
    status: 'active',
    joinedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@acme.com',
    role: 'member',
    avatar: null,
    status: 'active',
    joinedAt: '2026-03-15T00:00:00Z',
  },
]

export default function OrganizationPage() {
  const { user } = useAuth()
  const [orgData, setOrgData] = useState({
    id: '1',
    name: 'Nexus Organization',
    domain: 'nexus.demo',
    logo: null,
    description: 'All-in-one SaaS platform for modern businesses.',
    industry: 'Technology',
    size: '10-50',
    website: 'https://nexus.app',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA',
    },
    settings: {
      timezone: 'PST',
      currency: 'USD',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      whiteLabel: false,
      customDomain: null,
    },
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // In real app, this would save to API
    console.log('Saving organization:', orgData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setOrgData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }))
  }

  const handleSettingsChange = (field: string, value: string) => {
    setOrgData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Organization Settings</h1>
          <p className="text-nexus-text-secondary">Manage your organization's information and team.</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-nexus-border hover:bg-nexus-bg-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-nexus-blue hover:bg-nexus-accent text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-nexus-blue hover:bg-nexus-accent text-white"
            >
              Edit Organization
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Organization Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={orgData.logo || ''} alt={orgData.name} />
                    <AvatarFallback className="text-2xl">
                      <Building className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{orgData.name}</h2>
                  <p className="text-gray-600 mb-4">{orgData.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      {orgData.website}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {orgData.domain}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {orgData.size} employees
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      {orgData.industry}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={orgData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={orgData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={orgData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={orgData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Input
                    id="size"
                    value={orgData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={orgData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={orgData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={orgData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={orgData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP/Postal Code</Label>
                  <Input
                    id="zip"
                    value={orgData.address.zip}
                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={orgData.address.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar || ''} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        member.role === 'owner' ? 'default' :
                        member.role === 'admin' ? 'secondary' : 'outline'
                      }>
                        {member.role}
                      </Badge>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Organization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={orgData.settings.timezone}
                    onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PST">Pacific Standard Time</option>
                    <option value="EST">Eastern Standard Time</option>
                    <option value="CST">Central Standard Time</option>
                    <option value="MST">Mountain Standard Time</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={orgData.settings.currency}
                    onChange={(e) => handleSettingsChange('currency', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="CAD">Canadian Dollar (C$)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">White Label</h3>
                  <p className="text-sm text-gray-600">Remove NEXUS branding from your account</p>
                </div>
                <input
                  type="checkbox"
                  checked={orgData.settings.whiteLabel}
                  onChange={(e) => handleSettingsChange('whiteLabel', e.target.checked.toString())}
                  disabled={!isEditing}
                  className="rounded"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Billing</h3>
                <p className="text-gray-600 mb-4">
                  Billing settings are managed at the account level. Contact your account administrator for billing changes.
                </p>
                <Button variant="outline">Contact Administrator</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}