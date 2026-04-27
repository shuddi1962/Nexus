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
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Key,
  Save,
  Camera
} from 'lucide-react'

// Mock user data
const userProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@nexus.demo',
  phone: '+1 (555) 123-4567',
  avatar: null,
  role: 'owner',
  plan: 'agency',
  company: 'Acme Corp',
  jobTitle: 'CEO',
  location: 'San Francisco, CA',
  timezone: 'PST',
  bio: 'Experienced entrepreneur focused on digital transformation and business growth.',
  joinedAt: '2026-01-15T00:00:00Z',
  lastLogin: '2026-04-24T10:30:00Z',
  emailVerified: true,
  twoFactorEnabled: false,
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    id: user?.id || '1',
    name: user?.name || 'User',
    email: user?.email || 'user@nexus.demo',
    phone: '+1 (555) 123-4567',
    avatar: user?.avatar || null,
    role: user?.role || 'owner',
    plan: user?.plan || 'starter',
    company: 'Nexus User',
    jobTitle: 'User',
    location: 'San Francisco, CA',
    timezone: 'PST',
    bio: 'Nexus platform user focused on business growth.',
    joinedAt: '2026-01-15T00:00:00Z',
    lastLogin: '2026-04-24T10:30:00Z',
    emailVerified: user?.email_verified || false,
    twoFactorEnabled: false,
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // In real app, this would save to API

    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Profile Settings</h1>
          <p className="text-nexus-text-secondary">Manage your account information and preferences.</p>
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
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Overview */}
          <Card className="border-nexus-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar || ''} alt={profile.name} />
                    <AvatarFallback className="text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-nexus-blue hover:bg-nexus-accent"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-nexus-text-primary">{profile.name}</h2>
                    <Badge className="bg-nexus-bg-secondary text-nexus-text-primary border-nexus-border">{profile.role}</Badge>
                    <Badge className="bg-nexus-blue-light text-nexus-blue border border-nexus-blue">{profile.plan} plan</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-nexus-text-secondary">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {profile.email}
                      {profile.emailVerified && (
                        <Badge className="ml-2 text-xs bg-nexus-green text-white border-nexus-green">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      {profile.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {formatDate(profile.joinedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={profile.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    {profile.twoFactorEnabled ? 'Enabled' : 'Not configured'}
                  </p>
                </div>
                <Button variant="outline">
                  {profile.twoFactorEnabled ? 'Manage' : 'Enable'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Active Sessions</h3>
                  <p className="text-sm text-gray-600">2 active sessions</p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Email notifications', description: 'Receive email updates about your account' },
                { label: 'Push notifications', description: 'Get notified about important updates' },
                { label: 'Marketing emails', description: 'Receive tips and product updates' },
                { label: 'Weekly reports', description: 'Get weekly activity summaries' },
                { label: 'Security alerts', description: 'Important security notifications' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-gray-600">{profile.plan} plan</p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Method</h3>
                    <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
                  </div>
                  <Button variant="outline">Update Payment</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Billing History</h3>
                    <p className="text-sm text-gray-600">View past invoices and payments</p>
                  </div>
                  <Button variant="outline">View History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}