'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Globe,
  Link,
  BarChart3,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Target,
  Zap,
  Shield,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface Backlink {
  id: string
  source_url: string
  target_url: string
  anchor_text: string
  domain_authority: number
  page_authority: number
  trust_flow: number
  citation_flow: number
  link_type: 'dofollow' | 'nofollow' | 'ugc' | 'sponsored'
  link_status: 'active' | 'broken' | 'redirected'
  first_seen: string
  last_seen: string
  lost_date?: string
}

interface BacklinkProfile {
  domain: string
  total_backlinks: number
  unique_domains: number
  domain_authority: number
  trust_flow: number
  citation_flow: number
  toxic_links: number
  broken_links: number
  new_links_this_month: number
  lost_links_this_month: number
  top_anchors: Array<{
    anchor: string
    count: number
    percentage: number
  }>
  referring_domains: Array<{
    domain: string
    backlinks: number
    authority: number
  }>
  link_velocity: {
    monthly: number[]
    trend: 'increasing' | 'decreasing' | 'stable'
  }
}

export default function BacklinksPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  // Domain analysis
  const [domain, setDomain] = useState('')
  const [backlinkProfile, setBacklinkProfile] = useState<BacklinkProfile | null>(null)
  const [backlinks, setBacklinks] = useState<Backlink[]>([])
  const [analyzing, setAnalyzing] = useState(false)

  // Filters
  const [linkTypeFilter, setLinkTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [domainFilter, setDomainFilter] = useState('')

  useEffect(() => {
    // Load any existing backlink data
    loadExistingData()
  }, [])

  const loadExistingData = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration - would load from API
      setBacklinkProfile({
        domain: 'example.com',
        total_backlinks: 1250,
        unique_domains: 340,
        domain_authority: 45,
        trust_flow: 32,
        citation_flow: 28,
        toxic_links: 12,
        broken_links: 8,
        new_links_this_month: 45,
        lost_links_this_month: 12,
        top_anchors: [
          { anchor: 'example', count: 120, percentage: 9.6 },
          { anchor: 'website', count: 95, percentage: 7.6 },
          { anchor: 'company', count: 78, percentage: 6.2 },
          { anchor: 'services', count: 65, percentage: 5.2 },
          { anchor: 'contact', count: 52, percentage: 4.2 }
        ],
        referring_domains: [
          { domain: 'techcrunch.com', backlinks: 45, authority: 92 },
          { domain: 'forbes.com', backlinks: 32, authority: 94 },
          { domain: 'businessinsider.com', backlinks: 28, authority: 88 },
          { domain: 'venturebeat.com', backlinks: 24, authority: 85 },
          { domain: 'techrepublic.com', backlinks: 18, authority: 82 }
        ],
        link_velocity: {
          monthly: [12, 18, 24, 31, 28, 35, 42, 38, 45, 52, 48, 45],
          trend: 'increasing'
        }
      })

      setBacklinks([
        {
          id: '1',
          source_url: 'https://techcrunch.com/article-about-us',
          target_url: 'https://example.com',
          anchor_text: 'innovative company',
          domain_authority: 92,
          page_authority: 78,
          trust_flow: 85,
          citation_flow: 82,
          link_type: 'dofollow',
          link_status: 'active',
          first_seen: '2024-01-15',
          last_seen: '2026-04-25'
        },
        {
          id: '2',
          source_url: 'https://forbes.com/business-spotlight',
          target_url: 'https://example.com/services',
          anchor_text: 'our services',
          domain_authority: 94,
          page_authority: 82,
          trust_flow: 88,
          citation_flow: 85,
          link_type: 'dofollow',
          link_status: 'active',
          first_seen: '2024-02-20',
          last_seen: '2026-04-25'
        },
        {
          id: '3',
          source_url: 'https://venturebeat.com/startup-profile',
          target_url: 'https://example.com',
          anchor_text: 'startup',
          domain_authority: 85,
          page_authority: 72,
          trust_flow: 75,
          citation_flow: 78,
          link_type: 'dofollow',
          link_status: 'active',
          first_seen: '2024-03-10',
          last_seen: '2026-04-25'
        },
        {
          id: '4',
          source_url: 'https://broken-link-site.com/old-article',
          target_url: 'https://example.com/blog/post',
          anchor_text: 'blog post',
          domain_authority: 25,
          page_authority: 15,
          trust_flow: 12,
          citation_flow: 18,
          link_type: 'nofollow',
          link_status: 'broken',
          first_seen: '2024-06-01',
          last_seen: '2026-03-15',
          lost_date: '2026-03-15'
        },
        {
          id: '5',
          source_url: 'https://spam-site.com/directory',
          target_url: 'https://example.com',
          anchor_text: 'example',
          domain_authority: 15,
          page_authority: 8,
          trust_flow: 5,
          citation_flow: 12,
          link_type: 'dofollow',
          link_status: 'active',
          first_seen: '2025-11-20',
          last_seen: '2026-04-25'
        }
      ])
    } catch (error) {
      console.error('Error loading backlink data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDomainAnalysis = async () => {
    if (!domain.trim()) return

    try {
      setAnalyzing(true)
      // Call API for domain analysis
      const data = await apiClient.getBacklinks(domain.trim())
      setBacklinkProfile(data.profile)
      setBacklinks(data.backlinks || [])
    } catch (error) {
      console.error('Error analyzing domain:', error)
      // Fallback to mock data for demo
      loadExistingData()
    } finally {
      setAnalyzing(false)
    }
  }

  const filteredBacklinks = backlinks.filter(link => {
    const matchesType = linkTypeFilter === 'all' || link.link_type === linkTypeFilter
    const matchesStatus = statusFilter === 'all' || link.link_status === statusFilter
    const matchesDomain = !domainFilter || link.source_url.includes(domainFilter)

    return matchesType && matchesStatus && matchesDomain
  })

  const getLinkTypeColor = (type: string) => {
    switch (type) {
      case 'dofollow':
        return 'bg-nexus-green text-white'
      case 'nofollow':
        return 'bg-nexus-amber text-white'
      case 'ugc':
        return 'bg-nexus-blue text-white'
      case 'sponsored':
        return 'bg-nexus-violet text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-nexus-green text-white'
      case 'broken':
        return 'bg-nexus-red text-white'
      case 'redirected':
        return 'bg-nexus-amber text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  const getAuthorityColor = (score: number) => {
    if (score >= 80) return 'text-nexus-green'
    if (score >= 60) return 'text-nexus-blue'
    if (score >= 40) return 'text-nexus-amber'
    return 'text-nexus-red'
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Backlink Analysis</h1>
          <p className="text-nexus-text-secondary">Monitor and analyze your backlink profile for SEO insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Download className="w-4 h-4 mr-2 text-nexus-blue" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Domain Analysis Input */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="flex items-center text-nexus-text-primary">
            <Search className="w-5 h-5 mr-2 text-nexus-blue" />
            Domain Backlink Analysis
          </CardTitle>
          <p className="text-sm text-nexus-text-secondary">
            Enter a domain to analyze its backlink profile and identify opportunities.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
            />
            <Button
              onClick={handleDomainAnalysis}
              disabled={!domain.trim() || analyzing}
              className="bg-nexus-blue hover:bg-nexus-accent text-white"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Domain
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {backlinkProfile && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
            <TabsTrigger value="domains">Referring Domains</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-nexus-border">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Link className="w-8 h-8 text-nexus-blue mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-nexus-text-primary">
                        {formatNumber(backlinkProfile.total_backlinks)}
                      </div>
                      <div className="text-sm text-nexus-text-secondary">Total Backlinks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-nexus-border">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Globe className="w-8 h-8 text-nexus-green mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-nexus-text-primary">
                        {backlinkProfile.unique_domains}
                      </div>
                      <div className="text-sm text-nexus-text-secondary">Unique Domains</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-nexus-border">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="w-8 h-8 text-nexus-violet mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-nexus-text-primary">
                        {backlinkProfile.domain_authority}
                      </div>
                      <div className="text-sm text-nexus-text-secondary">Domain Authority</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-nexus-border">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-nexus-amber mr-3" />
                    <div>
                      <div className={`text-2xl font-bold ${backlinkProfile.link_velocity.trend === 'increasing' ? 'text-nexus-green' : backlinkProfile.link_velocity.trend === 'decreasing' ? 'text-nexus-red' : 'text-nexus-text-primary'}`}>
                        {backlinkProfile.new_links_this_month - backlinkProfile.lost_links_this_month > 0 ? '+' : ''}
                        {backlinkProfile.new_links_this_month - backlinkProfile.lost_links_this_month}
                      </div>
                      <div className="text-sm text-nexus-text-secondary">Monthly Change</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Link Quality Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Link Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-nexus-text-secondary">Trust Flow</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={backlinkProfile.trust_flow} className="w-20 h-2" />
                      <span className={`font-medium ${getAuthorityColor(backlinkProfile.trust_flow)}`}>
                        {backlinkProfile.trust_flow}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-nexus-text-secondary">Citation Flow</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={backlinkProfile.citation_flow} className="w-20 h-2" />
                      <span className={`font-medium ${getAuthorityColor(backlinkProfile.citation_flow)}`}>
                        {backlinkProfile.citation_flow}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-nexus-text-secondary">Toxic Links</span>
                    <span className={`font-medium ${backlinkProfile.toxic_links > 0 ? 'text-nexus-red' : 'text-nexus-green'}`}>
                      {backlinkProfile.toxic_links}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-nexus-text-secondary">Broken Links</span>
                    <span className={`font-medium ${backlinkProfile.broken_links > 0 ? 'text-nexus-red' : 'text-nexus-green'}`}>
                      {backlinkProfile.broken_links}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-nexus-text-secondary">New Links</span>
                      <span className="font-medium text-nexus-green">+{backlinkProfile.new_links_this_month}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-nexus-text-secondary">Lost Links</span>
                      <span className="font-medium text-nexus-red">-{backlinkProfile.lost_links_this_month}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-nexus-text-secondary">Net Growth</span>
                      <span className={`font-medium ${backlinkProfile.new_links_this_month - backlinkProfile.lost_links_this_month > 0 ? 'text-nexus-green' : 'text-nexus-red'}`}>
                        {backlinkProfile.new_links_this_month - backlinkProfile.lost_links_this_month > 0 ? '+' : ''}
                        {backlinkProfile.new_links_this_month - backlinkProfile.lost_links_this_month}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-nexus-text-secondary">Trend</span>
                      <Badge className={
                        backlinkProfile.link_velocity.trend === 'increasing' ? 'bg-nexus-green text-white' :
                        backlinkProfile.link_velocity.trend === 'decreasing' ? 'bg-nexus-red text-white' :
                        'bg-nexus-text-tertiary text-white'
                      }>
                        {backlinkProfile.link_velocity.trend}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Anchor Texts */}
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Top Anchor Texts</CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Most common anchor texts used in your backlinks.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backlinkProfile.top_anchors.map((anchor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-nexus-bg-secondary rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-nexus-text-primary">#{index + 1}</span>
                        <span className="text-nexus-text-primary">"{anchor.anchor}"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-nexus-text-secondary">{anchor.count} links</span>
                        <Badge variant="outline" className="border-nexus-border">
                          {anchor.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backlinks" className="space-y-6">
            {/* Filters */}
            <Card className="border-nexus-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-nexus-text-primary">Link Type</Label>
                    <Select value={linkTypeFilter} onValueChange={setLinkTypeFilter}>
                      <SelectTrigger className="mt-1 border-nexus-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="dofollow">Dofollow</SelectItem>
                        <SelectItem value="nofollow">Nofollow</SelectItem>
                        <SelectItem value="ugc">UGC</SelectItem>
                        <SelectItem value="sponsored">Sponsored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-nexus-text-primary">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="mt-1 border-nexus-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="broken">Broken</SelectItem>
                        <SelectItem value="redirected">Redirected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-nexus-text-primary">Filter by Domain</Label>
                    <Input
                      value={domainFilter}
                      onChange={(e) => setDomainFilter(e.target.value)}
                      placeholder="Filter by referring domain..."
                      className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backlinks List */}
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">
                  Backlinks ({filteredBacklinks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBacklinks.map((link) => (
                    <div key={link.id} className="p-4 border border-nexus-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <ExternalLink className="w-5 h-5 text-nexus-blue" />
                          <div>
                            <a
                              href={link.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-nexus-blue hover:underline font-medium"
                            >
                              {new URL(link.source_url).hostname}
                            </a>
                            <p className="text-sm text-nexus-text-secondary">
                              → {link.target_url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLinkTypeColor(link.link_type)}>
                            {link.link_type}
                          </Badge>
                          <Badge className={getStatusColor(link.link_status)}>
                            {link.link_status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-nexus-text-tertiary">Anchor Text</div>
                          <div className="font-medium text-nexus-text-primary">"{link.anchor_text}"</div>
                        </div>
                        <div>
                          <div className="text-sm text-nexus-text-tertiary">Domain Authority</div>
                          <div className={`font-medium ${getAuthorityColor(link.domain_authority)}`}>
                            {link.domain_authority}/100
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-nexus-text-tertiary">Trust Flow</div>
                          <div className={`font-medium ${getAuthorityColor(link.trust_flow)}`}>
                            {link.trust_flow}/100
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-nexus-text-tertiary">First Seen</div>
                          <div className="font-medium text-nexus-text-primary">
                            {new Date(link.first_seen).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {link.lost_date && (
                        <div className="flex items-center space-x-2 text-sm text-nexus-red">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Lost on {new Date(link.lost_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains" className="space-y-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Top Referring Domains</CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Domains that link to your site most frequently.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backlinkProfile.referring_domains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-nexus-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-nexus-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-nexus-text-primary">{domain.domain}</div>
                          <div className="text-sm text-nexus-text-secondary">
                            {domain.backlinks} backlinks
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-medium ${getAuthorityColor(domain.authority)}`}>
                          DA: {domain.authority}/100
                        </div>
                        <div className="text-sm text-nexus-text-secondary">
                          Domain Authority
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="flex items-center text-nexus-text-primary">
                  <Zap className="w-5 h-5 mr-2 text-nexus-amber" />
                  Link Building Opportunities
                </CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Identified opportunities to improve your backlink profile.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-nexus-green/10 border border-nexus-green/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-nexus-green mt-0.5" />
                      <div>
                        <h4 className="font-medium text-nexus-text-primary">Strong Authority Links</h4>
                        <p className="text-sm text-nexus-text-secondary mt-1">
                          You have {backlinkProfile.referring_domains.filter(d => d.authority >= 80).length} high-authority domains linking to you.
                          Focus on maintaining these relationships.
                        </p>
                      </div>
                    </div>
                  </div>

                  {backlinkProfile.toxic_links > 0 && (
                    <div className="p-4 bg-nexus-red/10 border border-nexus-red/20 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-nexus-red mt-0.5" />
                        <div>
                          <h4 className="font-medium text-nexus-text-primary">Toxic Links Detected</h4>
                          <p className="text-sm text-nexus-text-secondary mt-1">
                            {backlinkProfile.toxic_links} potentially harmful links found. Consider disavowing these to protect your SEO.
                          </p>
                          <Button size="sm" className="mt-2 bg-nexus-red hover:bg-nexus-red/90 text-white">
                            View Toxic Links
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {backlinkProfile.broken_links > 0 && (
                    <div className="p-4 bg-nexus-amber/10 border border-nexus-amber/20 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-nexus-amber mt-0.5" />
                        <div>
                          <h4 className="font-medium text-nexus-text-primary">Broken Links</h4>
                          <p className="text-sm text-nexus-text-secondary mt-1">
                            {backlinkProfile.broken_links} broken backlinks detected. These may hurt your SEO - consider reaching out to fix them.
                          </p>
                          <Button size="sm" className="mt-2 bg-nexus-amber hover:bg-nexus-amber/90 text-white">
                            View Broken Links
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-nexus-blue/10 border border-nexus-blue/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-nexus-blue mt-0.5" />
                      <div>
                        <h4 className="font-medium text-nexus-text-primary">Link Building Opportunities</h4>
                        <p className="text-sm text-nexus-text-secondary mt-1">
                          Based on your current profile, here are potential link building opportunities:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-nexus-text-secondary">
                          <li>• Guest posting on authority sites in your niche</li>
                          <li>• Industry partnerships and collaborations</li>
                          <li>• Content that naturally attracts links</li>
                          <li>• Broken link building opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}