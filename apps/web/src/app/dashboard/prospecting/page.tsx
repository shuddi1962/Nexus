'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Building,
  Target,
  Filter,
  Download,
  Upload,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  MessageSquare
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  jobTitle: string
  location: string
  linkedinUrl?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected'
  source: string
  score: number
  lastActivity: string
  tags: string[]
}

export default function ProspectingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  // Mock leads data
  const leads: Lead[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@techstartup.com',
      company: 'TechFlow Solutions',
      jobTitle: 'VP of Operations',
      location: 'San Francisco, CA',
      linkedinUrl: 'linkedin.com/in/sarahjohnson',
      status: 'qualified',
      source: 'LinkedIn',
      score: 85,
      lastActivity: '2026-04-20T10:30:00Z',
      tags: ['Tech', 'Operations', 'High Priority']
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'm.chen@financecorp.com',
      company: 'Global Finance Corp',
      jobTitle: 'CTO',
      location: 'New York, NY',
      linkedinUrl: 'linkedin.com/in/michaelchen',
      status: 'contacted',
      source: 'Website',
      score: 78,
      lastActivity: '2026-04-19T14:15:00Z',
      tags: ['Finance', 'Technology', 'Enterprise']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@retailplus.com',
      company: 'Retail Plus',
      jobTitle: 'Marketing Director',
      location: 'Austin, TX',
      linkedinUrl: 'linkedin.com/in/emilyrodriguez',
      status: 'new',
      source: 'Google Maps',
      score: 65,
      lastActivity: '2026-04-18T09:45:00Z',
      tags: ['Retail', 'Marketing', 'SME']
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@consulting.com',
      company: 'Strategic Consulting LLC',
      jobTitle: 'Managing Partner',
      location: 'Chicago, IL',
      status: 'rejected',
      source: 'LinkedIn',
      score: 45,
      lastActivity: '2026-04-17T16:20:00Z',
      tags: ['Consulting', 'Strategy', 'Low Priority']
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@healthcare.com',
      company: 'MedTech Solutions',
      jobTitle: 'COO',
      location: 'Boston, MA',
      linkedinUrl: 'linkedin.com/in/lisathompson',
      status: 'qualified',
      source: 'Industry Event',
      score: 92,
      lastActivity: '2026-04-16T11:30:00Z',
      tags: ['Healthcare', 'Operations', 'VIP']
    }
  ]

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const toggleAllLeads = () => {
    setSelectedLeads(
      selectedLeads.length === filteredLeads.length
        ? []
        : filteredLeads.map(lead => lead.id)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'contacted':
        return 'bg-blue-100 text-blue-800'
      case 'new':
        return 'bg-yellow-100 text-yellow-800'
      case 'converted':
        return 'bg-purple-100 text-purple-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prospecting</h1>
          <p className="text-gray-600">Find and qualify leads for your sales pipeline.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Leads
          </Button>
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Find Leads
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{leads.length}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {leads.filter(l => l.status === 'qualified').length}
                </div>
                <div className="text-sm text-gray-600">Qualified</div>
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
                  {Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)}
                </div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {leads.filter(l => l.status === 'contacted' || l.status === 'qualified').length}
                </div>
                <div className="text-sm text-gray-600">Contacted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Outreach</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Status</option>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Converted</option>
                    <option>Rejected</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Sources</option>
                    <option>LinkedIn</option>
                    <option>Website</option>
                    <option>Google Maps</option>
                    <option>Industry Event</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedLeads.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Qualified
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leads Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                          onChange={toggleAllLeads}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => toggleLead(lead.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            {lead.linkedinUrl && (
                              <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                LinkedIn Profile
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                            <div className="text-sm text-gray-500">{lead.jobTitle}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                lead.score >= 80 ? 'bg-green-500' :
                                lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{lead.source}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.lastActivity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outreach Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Tech Startup Outreach',
                    status: 'active',
                    sent: 245,
                    opened: 89,
                    replied: 12,
                    converted: 3
                  },
                  {
                    name: 'Enterprise Warm Leads',
                    status: 'scheduled',
                    sent: 0,
                    opened: 0,
                    replied: 0,
                    converted: 0
                  },
                  {
                    name: 'Industry Event Follow-up',
                    status: 'completed',
                    sent: 156,
                    opened: 67,
                    replied: 23,
                    converted: 8
                  }
                ].map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        Sent: {campaign.sent} | Opened: {campaign.opened} | Replied: {campaign.replied} | Converted: {campaign.converted}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {campaign.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">23.4%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Mail className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-gray-600">Emails Sent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageSquare className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm text-gray-600">Responses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lead Sources Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { source: 'LinkedIn', leads: 45, qualified: 28, converted: 8, rate: 17.8 },
                  { source: 'Website', leads: 32, qualified: 19, converted: 5, rate: 15.6 },
                  { source: 'Google Maps', leads: 28, qualified: 12, converted: 3, rate: 10.7 },
                  { source: 'Industry Events', leads: 18, qualified: 15, converted: 6, rate: 33.3 }
                ].map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{source.source}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {source.leads} leads • {source.qualified} qualified • {source.converted} converted
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {source.rate}% rate
                    </Badge>
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