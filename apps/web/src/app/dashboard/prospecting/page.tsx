'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient } from '@/lib/api'
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
  MessageSquare,
  DollarSign,
  Globe,
  Settings
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

interface Campaign {
  id: string
  name: string
  status: string
  leadsCount?: number
}

export default function ProspectingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLeads()
    loadCampaigns()
  }, [])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getScrapedLeads()
      if (data.data) {
        setLeads(data.data)
      }
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCampaigns = async () => {
    try {
      const data = await apiClient.getProspectingCampaigns()
      if (data.data) {
        setCampaigns(data.data)
      }
    } catch (error) {
      console.error('Error loading campaigns:', error)
    }
  }

  const handleScrapeLeads = async () => {
    try {
      setLoading(true)
      await apiClient.scrapeLeads({
        source: 'linkedin',
        query: searchQuery
      })
      alert('Lead scraping job queued!')
      loadLeads()
    } catch (error) {
      console.error('Error scraping leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
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

      <Tabs defaultValue="discovery" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-6">
          {/* Data Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'LinkedIn Sales Navigator', icon: Users, count: 1247, status: 'connected' },
              { name: 'Google Maps', icon: MapPin, count: 892, status: 'connected' },
              { name: 'ZoomInfo', icon: Building, count: 3456, status: 'connected' },
              { name: 'Hunter.io', icon: Mail, count: 567, status: 'error' },
              { name: 'Apify Web Scraper', icon: Globe, count: 234, status: 'connected' },
              { name: 'Industry Events', icon: Users, count: 189, status: 'connected' },
              { name: 'Website Visitors', icon: Globe, count: 756, status: 'connected' },
              { name: 'Social Media', icon: MessageSquare, count: 1234, status: 'connected' }
            ].map((source, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <source.icon className={`w-5 h-5 ${source.status === 'connected' ? 'text-green-500' : 'text-red-500'}`} />
                    <Badge className={source.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {source.status}
                    </Badge>
                  </div>
                  <div className="font-medium text-sm">{source.name}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{source.count.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">leads found</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search & Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Lead Discovery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Size</SelectItem>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="City, State, Country" />
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input placeholder="CEO, CTO, Manager..." />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Search Leads
                </Button>
                <Button variant="outline">
                  Save Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Discoveries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Lead Discoveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.company} • {lead.jobTitle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{lead.source}</Badge>
                          <span className="text-sm text-gray-500">{lead.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enrich
                      </Button>
                      <Button size="sm">
                        Add to Pipeline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrichment" className="space-y-6">
          {/* Enrichment Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Social Profile Enrichment', icon: Users, status: 'active', enriched: 1247 },
              { name: 'Company Data', icon: Building, status: 'active', enriched: 892 },
              { name: 'Contact Verification', icon: CheckCircle, status: 'active', enriched: 756 },
              { name: 'Lead Scoring', icon: Target, status: 'active', enriched: 645 },
              { name: 'Intent Data', icon: AlertTriangle, status: 'error', enriched: 234 },
              { name: 'Technology Stack', icon: Settings, status: 'active', enriched: 567 }
            ].map((tool, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <tool.icon className={`w-5 h-5 ${tool.status === 'active' ? 'text-green-500' : 'text-red-500'}`} />
                    <Badge className={tool.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {tool.status}
                    </Badge>
                  </div>
                  <div className="font-medium text-sm">{tool.name}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{tool.enriched.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">leads enriched</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enrichment Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Enrichment Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.filter(l => l.status === 'new').slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.company} • {lead.jobTitle}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{lead.source}</Badge>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-600">75% enriched</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Complete Enrichment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Scoring Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Scoring Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rule: 'Job Title contains "CEO" or "CTO"', points: 25, matches: 45 },
                  { rule: 'Company size > 500 employees', points: 20, matches: 123 },
                  { rule: 'Recent funding > $10M', points: 15, matches: 67 },
                  { rule: 'Active on LinkedIn (posted this month)', points: 10, matches: 234 },
                  { rule: 'Visited pricing page', points: 8, matches: 89 },
                  { rule: 'Downloaded whitepaper', points: 5, matches: 156 }
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{rule.rule}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {rule.matches} leads match • +{rule.points} points
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Scoring Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outreach" className="space-y-6">
          {/* Outreach Sequences */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Outreach Sequences</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Sequence
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Tech Startup Cold Outreach',
                    status: 'active',
                    steps: 5,
                    sent: 245,
                    opened: 89,
                    replied: 12,
                    converted: 3,
                    channels: ['email', 'linkedin']
                  },
                  {
                    name: 'Enterprise Warm Leads',
                    status: 'scheduled',
                    steps: 7,
                    sent: 0,
                    opened: 0,
                    replied: 0,
                    converted: 0,
                    channels: ['email', 'phone']
                  },
                  {
                    name: 'Industry Event Follow-up',
                    status: 'completed',
                    steps: 4,
                    sent: 156,
                    opened: 67,
                    replied: 23,
                    converted: 8,
                    channels: ['email', 'linkedin']
                  }
                ].map((sequence, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{sequence.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={
                            sequence.status === 'active' ? 'bg-green-100 text-green-800' :
                            sequence.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {sequence.status}
                          </Badge>
                          <span className="text-sm text-gray-600">{sequence.steps} steps</span>
                          <div className="flex space-x-1">
                            {sequence.channels.map((channel, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {sequence.sent} sent • {sequence.opened} opened • {sequence.replied} replied
                        </div>
                        <div className="text-sm text-gray-600">
                          {sequence.converted} converted ({sequence.sent > 0 ? Math.round((sequence.converted / sequence.sent) * 100) : 0}%)
                        </div>
                      </div>
                    </div>

                    {/* Sequence Steps Preview */}
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: sequence.steps }, (_, i) => (
                        <div key={i} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            i === 0 ? 'bg-blue-500 text-white' :
                            i < sequence.sent ? 'bg-green-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {i + 1}
                          </div>
                          {i < sequence.steps - 1 && (
                            <div className={`w-6 h-0.5 ${
                              i < sequence.sent - 1 ? 'bg-green-500' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        Step 1: Initial Email • Step 2: LinkedIn Connect • Step 3: Follow-up Email • Step 4: Phone Call • Step 5: Final Email
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Edit Sequence
                        </Button>
                        <Button variant="outline" size="sm">
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* A/B Testing */}
          <Card>
            <CardHeader>
              <CardTitle>A/B Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    test: 'Email Subject Lines',
                    variantA: '"Unlock 300% More Leads"',
                    variantB: '"How We Generated 10,000+ Leads"',
                    winner: 'A',
                    improvement: '+23%'
                  },
                  {
                    test: 'LinkedIn Message',
                    variantA: 'Personalized connection request',
                    variantB: 'Generic connection request',
                    winner: 'A',
                    improvement: '+45%'
                  },
                  {
                    test: 'Call Script Opening',
                    variantA: 'Question-based opening',
                    variantB: 'Value-based opening',
                    winner: 'B',
                    improvement: '+18%'
                  }
                ].map((test, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{test.test}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-blue-600">Variant A (Winner)</div>
                        <div className="text-sm bg-blue-50 p-2 rounded">{test.variantA}</div>
                        <div className="text-xs text-green-600">+{test.improvement} improvement</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600">Variant B</div>
                        <div className="text-sm bg-gray-50 p-2 rounded">{test.variantB}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create A/B Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Pipeline Stages */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { stage: 'Discovery', count: 245, color: 'bg-blue-500' },
              { stage: 'Contacted', count: 89, color: 'bg-yellow-500' },
              { stage: 'Qualified', count: 34, color: 'bg-purple-500' },
              { stage: 'Proposal', count: 12, color: 'bg-orange-500' },
              { stage: 'Closed Won', count: 8, color: 'bg-green-500' }
            ].map((stage, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className={`w-3 h-3 ${stage.color} rounded-full mb-2`}></div>
                  <div className="font-medium text-sm">{stage.stage}</div>
                  <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
                  <div className="text-xs text-gray-600">leads</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pipeline Automation */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    trigger: 'Lead reaches Qualified stage',
                    action: 'Send proposal email template',
                    delay: '2 hours',
                    active: true
                  },
                  {
                    trigger: 'Lead opens email 3 times',
                    action: 'Move to Proposal stage',
                    delay: 'Immediate',
                    active: true
                  },
                  {
                    trigger: 'Lead replies to email',
                    action: 'Create task for sales rep',
                    delay: 'Immediate',
                    active: true
                  },
                  {
                    trigger: 'Lead not contacted in 7 days',
                    action: 'Send follow-up reminder',
                    delay: '7 days',
                    active: false
                  }
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium">When: {rule.trigger}</div>
                      <div className="text-sm text-gray-600">Then: {rule.action} (Delay: {rule.delay})</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Automation Rule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Pipeline Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Pipeline Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    lead: 'Sarah Johnson',
                    action: 'Moved to Qualified stage',
                    user: 'John Smith',
                    time: '2 hours ago',
                    stage: 'Qualified'
                  },
                  {
                    lead: 'Mike Chen',
                    action: 'Proposal email sent',
                    user: 'Auto',
                    time: '4 hours ago',
                    stage: 'Proposal'
                  },
                  {
                    lead: 'Emily Rodriguez',
                    action: 'Marked as Closed Won',
                    user: 'Lisa Wong',
                    time: '1 day ago',
                    stage: 'Closed Won'
                  },
                  {
                    lead: 'David Kim',
                    action: 'Added to pipeline',
                    user: 'John Smith',
                    time: '2 days ago',
                    stage: 'Discovery'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.lead}</div>
                      <div className="text-sm text-gray-600">{activity.action}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{activity.user}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">98.7%</div>
                    <div className="text-sm text-gray-600">GDPR Compliant</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <XCircle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-gray-600">DNC Violations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-gray-600">Pending Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DNC Management */}
          <Card>
            <CardHeader>
              <CardTitle>Do Not Contact (DNC) Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Global DNC List', entries: 124567, lastUpdated: '2026-04-20', status: 'active' },
                  { name: 'FTC DNC Registry', entries: 234890, lastUpdated: '2026-04-19', status: 'active' },
                  { name: 'CAN-SPAM Registry', entries: 45623, lastUpdated: '2026-04-18', status: 'active' },
                  { name: 'Custom Suppression List', entries: 892, lastUpdated: '2026-04-15', status: 'active' }
                ].map((list, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{list.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {list.entries.toLocaleString()} entries • Last updated: {new Date(list.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {list.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to DNC List
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GDPR Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data Retention Policy</Label>
                    <Select defaultValue="2years">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                        <SelectItem value="5years">5 Years</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Consent Management</Label>
                    <Select defaultValue="doubleoptin">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="singleoptin">Single Opt-in</SelectItem>
                        <SelectItem value="doubleoptin">Double Opt-in</SelectItem>
                        <SelectItem value="confirmed">Confirmed Opt-in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Automated Data Deletion</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Right to Access Requests</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Portability</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Privacy Policy Compliance</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Lead added to DNC list',
                    user: 'System',
                    timestamp: '2026-04-24T14:30:00Z',
                    details: 'Auto-added due to unsubscribe request'
                  },
                  {
                    action: 'GDPR data deletion request',
                    user: 'John Smith',
                    timestamp: '2026-04-23T11:15:00Z',
                    details: 'Processed for lead ID: 12345'
                  },
                  {
                    action: 'CAN-SPAM compliance check',
                    user: 'System',
                    timestamp: '2026-04-22T09:00:00Z',
                    details: 'All emails compliant - 98.7% pass rate'
                  },
                  {
                    action: 'FTC registry sync',
                    user: 'System',
                    timestamp: '2026-04-21T02:00:00Z',
                    details: 'Added 1,234 new DNC entries'
                  }
                ].map((log, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{log.action}</div>
                      <div className="text-sm text-gray-600">{log.details}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {log.user} • {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-orange-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">$45.2K</div>
                    <div className="text-sm text-gray-600">Revenue Generated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead Sources Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { source: 'LinkedIn', leads: 45, qualified: 28, converted: 8, rate: 17.8, revenue: 12400 },
                  { source: 'Website', leads: 32, qualified: 19, converted: 5, rate: 15.6, revenue: 8900 },
                  { source: 'Google Maps', leads: 28, qualified: 12, converted: 3, rate: 10.7, revenue: 5600 },
                  { source: 'Industry Events', leads: 18, qualified: 15, converted: 6, rate: 33.3, revenue: 18900 }
                ].map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <span className="font-medium">{source.source}</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {source.leads} leads • {source.qualified} qualified • {source.converted} converted
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{source.rate}%</div>
                        <div className="text-xs text-gray-600">Conv. Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">${source.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          ${(source.revenue / source.converted).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-600">Avg Deal</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Return on Investment (ROI)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Revenue Generated</span>
                    <span className="font-bold">$45,200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Prospecting Cost</span>
                    <span className="font-bold">$8,400</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-medium">Net Profit</span>
                    <span className="font-bold text-green-600">$36,800</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">ROI</span>
                    <span className="font-bold text-green-600">437%</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-800 font-medium">Excellent ROI Performance</span>
                  </div>
                  <p className="text-green-700 text-sm mt-2">
                    Your prospecting efforts are generating $4.37 for every $1 invested.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outreach Sequence Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Outreach Sequence Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    sequence: 'Tech Startup Cold Outreach',
                    sent: 245,
                    opened: 89,
                    clicked: 34,
                    replied: 12,
                    converted: 3,
                    revenue: 12400
                  },
                  {
                    sequence: 'Enterprise Warm Leads',
                    sent: 156,
                    opened: 67,
                    clicked: 23,
                    replied: 8,
                    converted: 2,
                    revenue: 8900
                  },
                  {
                    sequence: 'Industry Event Follow-up',
                    sent: 98,
                    opened: 76,
                    clicked: 45,
                    replied: 18,
                    converted: 6,
                    revenue: 23400
                  }
                ].map((seq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">{seq.sequence}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{seq.sent}</div>
                        <div className="text-xs text-gray-600">Sent</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{seq.opened}</div>
                        <div className="text-xs text-gray-600">Opened ({Math.round((seq.opened/seq.sent)*100)}%)</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{seq.clicked}</div>
                        <div className="text-xs text-gray-600">Clicked ({Math.round((seq.clicked/seq.sent)*100)}%)</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{seq.replied}</div>
                        <div className="text-xs text-gray-600">Replied ({Math.round((seq.replied/seq.sent)*100)}%)</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">{seq.converted}</div>
                        <div className="text-xs text-gray-600">Converted ({Math.round((seq.converted/seq.sent)*100)}%)</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-600">${seq.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Data Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>DNC Compliance Rate</span>
                    <span className="font-bold text-green-600">99.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Email Deliverability</span>
                    <span className="font-bold text-green-600">97.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '97.2%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Accuracy</span>
                    <span className="font-bold text-blue-600">94.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94.5%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}