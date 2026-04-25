'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Mail,
  Send,
  Users,
  Target,
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  subject: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  recipients: number
  sent: number
  opened: number
  clicked: number
  scheduledFor?: string
  sentAt?: string
  openRate: number
  clickRate: number
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  category: string
  thumbnail: string
  usage: number
}

export default function EmailMarketingPage() {
  const [selectedTab, setSelectedTab] = useState('campaigns')

  // Mock campaign data
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Welcome Series',
      subject: 'Welcome to NEXUS - Your Marketing Journey Begins',
      status: 'sent',
      recipients: 1250,
      sent: 1250,
      opened: 387,
      clicked: 98,
      sentAt: '2026-04-20T10:00:00Z',
      openRate: 31.0,
      clickRate: 7.8
    },
    {
      id: '2',
      name: 'Product Launch',
      subject: '🚀 Introducing Our New AI Features',
      status: 'scheduled',
      recipients: 8750,
      sent: 0,
      opened: 0,
      clicked: 0,
      scheduledFor: '2026-04-25T09:00:00Z',
      openRate: 0,
      clickRate: 0
    },
    {
      id: '3',
      name: 'Monthly Newsletter',
      subject: 'April 2026: Marketing Trends & Tips',
      status: 'sending',
      recipients: 5600,
      sent: 2340,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0
    },
    {
      id: '4',
      name: 'Re-engagement Campaign',
      subject: 'We Miss You! Special Offers Inside',
      status: 'draft',
      recipients: 2340,
      sent: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0
    }
  ]

  const templates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to [Company Name]',
      category: 'Onboarding',
      thumbnail: '/api/placeholder/200/150',
      usage: 145
    },
    {
      id: '2',
      name: 'Product Launch',
      subject: 'Introducing Our New [Product]',
      category: 'Promotional',
      thumbnail: '/api/placeholder/200/150',
      usage: 89
    },
    {
      id: '3',
      name: 'Newsletter',
      subject: '[Month] Newsletter: [Topic]',
      category: 'Newsletter',
      thumbnail: '/api/placeholder/200/150',
      usage: 234
    },
    {
      id: '4',
      name: 'Re-engagement',
      subject: 'We Miss You!',
      category: 'Re-engagement',
      thumbnail: '/api/placeholder/200/150',
      usage: 67
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'sending':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'sending':
        return <Send className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-yellow-500" />
      case 'draft':
        return <Mail className="w-4 h-4 text-gray-500" />
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Mail className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600">Create, send, and track email campaigns to engage your audience.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Manage Lists
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{campaigns.length}</div>
                <div className="text-sm text-gray-600">Total Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.sent, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Emails Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(campaigns.filter(c => c.sent > 0).reduce((sum, c) => sum + c.openRate, 0) / campaigns.filter(c => c.sent > 0).length)}%
                </div>
                <div className="text-sm text-gray-600">Avg. Open Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(campaigns.filter(c => c.sent > 0).reduce((sum, c) => sum + c.clickRate, 0) / campaigns.filter(c => c.sent > 0).length)}%
                </div>
                <div className="text-sm text-gray-600">Avg. Click Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search campaigns..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(campaign.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.subject}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{campaign.recipients.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Recipients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{campaign.sent.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{campaign.opened}</div>
                      <div className="text-xs text-gray-600">Opened</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">{campaign.clicked}</div>
                      <div className="text-xs text-gray-600">Clicked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{campaign.openRate}%</div>
                      <div className="text-xs text-gray-600">Open Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {campaign.sentAt && `Sent ${new Date(campaign.sentAt).toLocaleDateString()}`}
                      {campaign.scheduledFor && `Scheduled for ${new Date(campaign.scheduledFor).toLocaleDateString()}`}
                      {!campaign.sentAt && !campaign.scheduledFor && 'Draft campaign'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10 w-64"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.subject}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{template.category}</Badge>
                      <span className="text-xs text-gray-500">{template.usage} uses</span>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        Use
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Automation Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Welcome Series',
                    description: 'Automated onboarding emails for new subscribers',
                    status: 'active',
                    enrolled: 1250,
                    completed: 890,
                    openRate: 42.3
                  },
                  {
                    name: 'Re-engagement Flow',
                    description: 'Win back inactive subscribers',
                    status: 'active',
                    enrolled: 450,
                    completed: 123,
                    openRate: 38.7
                  },
                  {
                    name: 'Product Launch Sequence',
                    description: 'Build hype for new product releases',
                    status: 'paused',
                    enrolled: 2100,
                    completed: 0,
                    openRate: 0
                  }
                ].map((workflow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                        <Badge className={
                          workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                          workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Enrolled:</span>
                          <span className="font-medium ml-1">{workflow.enrolled}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-medium ml-1">{workflow.completed}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Open Rate:</span>
                          <span className="font-medium ml-1">{workflow.openRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        Edit Flow
                      </Button>
                      <Button variant="outline" size="sm">
                        View Stats
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">24,567</div>
                    <div className="text-sm text-gray-600">Total Subscribers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">18,234</div>
                    <div className="text-sm text-gray-600">Active Subscribers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">+12.3%</div>
                    <div className="text-sm text-gray-600">Growth Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscriber Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'High-Value Customers', count: 3456, growth: 8.9 },
                  { name: 'Recent Subscribers', count: 5678, growth: 15.2 },
                  { name: 'Engaged Users', count: 8923, growth: 5.6 },
                  { name: 'At-Risk Churn', count: 1234, growth: -12.3 },
                  { name: 'Inactive Users', count: 4567, growth: -8.7 }
                ].map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{segment.name}</div>
                      <div className="text-sm text-gray-600">{segment.count.toLocaleString()} subscribers</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        segment.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {segment.growth > 0 ? '+' : ''}{segment.growth}%
                      </div>
                      <div className="text-xs text-gray-600">vs last month</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}