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
  Globe,
  Search,
  Plus,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Target,
  Users,
  DollarSign
} from 'lucide-react'

interface Site {
  id: string
  name: string
  url: string
  status: 'active' | 'maintenance' | 'error'
  type: 'blog' | 'landing' | 'ecommerce' | 'business'
  visitors: number
  bounceRate: number
  avgSession: number
  conversions: number
  lastUpdated: string
  seoScore: number
}

interface SEOIssue {
  id: string
  page: string
  issue: string
  severity: 'critical' | 'warning' | 'info'
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  status: 'open' | 'fixed' | 'ignored'
}

export default function SitesPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  // Mock sites data
  const sites: Site[] = [
    {
      id: '1',
      name: 'NEXUS Marketing Blog',
      url: 'https://blog.nexus.app',
      status: 'active',
      type: 'blog',
      visitors: 15420,
      bounceRate: 42.3,
      avgSession: 185,
      conversions: 234,
      lastUpdated: '2026-04-24T10:30:00Z',
      seoScore: 87
    },
    {
      id: '2',
      name: 'NEXUS Landing Page',
      url: 'https://nexus.app/landing',
      status: 'active',
      type: 'landing',
      visitors: 28340,
      bounceRate: 38.7,
      avgSession: 142,
      conversions: 1456,
      lastUpdated: '2026-04-24T09:45:00Z',
      seoScore: 92
    },
    {
      id: '3',
      name: 'NEXUS Store',
      url: 'https://store.nexus.app',
      status: 'maintenance',
      type: 'ecommerce',
      visitors: 8940,
      bounceRate: 51.2,
      avgSession: 298,
      conversions: 89,
      lastUpdated: '2026-04-23T14:20:00Z',
      seoScore: 78
    },
    {
      id: '4',
      name: 'NEXUS Business Site',
      url: 'https://business.nexus.app',
      status: 'active',
      type: 'business',
      visitors: 12340,
      bounceRate: 35.8,
      avgSession: 234,
      conversions: 456,
      lastUpdated: '2026-04-24T08:15:00Z',
      seoScore: 89
    }
  ]

  const seoIssues: SEOIssue[] = [
    {
      id: '1',
      page: '/blog/marketing-automation-guide',
      issue: 'Missing meta description',
      severity: 'warning',
      impact: 'medium',
      recommendation: 'Add a compelling meta description under 160 characters',
      status: 'open'
    },
    {
      id: '2',
      page: '/pricing',
      issue: 'Page title too long',
      severity: 'info',
      impact: 'low',
      recommendation: 'Shorten title to under 60 characters for better display',
      status: 'open'
    },
    {
      id: '3',
      page: '/features',
      issue: 'Missing alt text on images',
      severity: 'critical',
      impact: 'high',
      recommendation: 'Add descriptive alt text to all images for accessibility',
      status: 'fixed'
    },
    {
      id: '4',
      page: '/contact',
      issue: 'Slow loading time',
      severity: 'warning',
      impact: 'medium',
      recommendation: 'Optimize images and reduce server response time',
      status: 'open'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800'
      case 'landing':
        return 'bg-purple-100 text-purple-800'
      case 'ecommerce':
        return 'bg-green-100 text-green-800'
      case 'business':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSEOColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Manager</h1>
          <p className="text-gray-600">Monitor and optimize your websites and landing pages.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Data
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Site
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{sites.length}</div>
                <div className="text-sm text-gray-600">Total Sites</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {sites.reduce((sum, site) => sum + site.visitors, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Visitors</div>
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
                  {sites.reduce((sum, site) => sum + site.conversions, 0)}
                </div>
                <div className="text-sm text-gray-600">Conversions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(sites.reduce((sum, site) => sum + site.seoScore, 0) / sites.length)}
                </div>
                <div className="text-sm text-gray-600">Avg. SEO Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sites" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sites">My Sites</TabsTrigger>
          <TabsTrigger value="seo">SEO Issues</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-6">
          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{site.name}</CardTitle>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {site.url}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(site.type)}>
                      {site.type}
                    </Badge>
                    <span className={`text-sm font-medium ${getSEOColor(site.seoScore)}`}>
                      SEO: {site.seoScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Visitors:</span>
                      <div className="font-semibold">{site.visitors.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Bounce Rate:</span>
                      <div className="font-semibold">{site.bounceRate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg. Session:</span>
                      <div className="font-semibold">{formatTime(site.avgSession)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Conversions:</span>
                      <div className="font-semibold">{site.conversions}</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(site.lastUpdated).toLocaleDateString()}
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedSite(site.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          {/* SEO Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">
                      {seoIssues.filter(i => i.severity === 'critical').length}
                    </div>
                    <div className="text-sm text-gray-600">Critical Issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">
                      {seoIssues.filter(i => i.severity === 'warning').length}
                    </div>
                    <div className="text-sm text-gray-600">Warnings</div>
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
                      {seoIssues.filter(i => i.status === 'fixed').length}
                    </div>
                    <div className="text-sm text-gray-600">Fixed Issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Issues List */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Issues & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoIssues.map((issue) => (
                  <div key={issue.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {issue.severity === 'critical' ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : issue.severity === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{issue.issue}</h3>
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline">
                          {issue.impact} impact
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Page:</strong> {issue.page}
                      </div>
                      <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <Badge className={
                        issue.status === 'fixed' ? 'bg-green-100 text-green-800' :
                        issue.status === 'ignored' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {issue.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Fix
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO Tools */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Search className="w-6 h-6" />
                  <span className="text-sm">Keyword Research</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Target className="w-6 h-6" />
                  <span className="text-sm">Meta Tag Generator</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Page Speed Test</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-sm">SEO Audit</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">1.8s</div>
                    <div className="text-sm text-gray-600">Avg. Load Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">99.2%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">$2.34</div>
                    <div className="text-sm text-gray-600">Cost per Visit</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Site Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Site Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sites.map((site) => (
                  <div key={site.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{site.name}</h3>
                      <Badge className={getStatusColor(site.status)}>
                        {site.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Load Time</div>
                        <div className="font-semibold">1.2s</div>
                      </div>
                      <div>
                        <div className="text-gray-600">First Paint</div>
                        <div className="font-semibold">0.8s</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Lighthouse Score</div>
                        <div className="font-semibold">92</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Core Web Vitals</div>
                        <div className="font-semibold text-green-600">Pass</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monitoring Frequency</Label>
                    <Select defaultValue="5min">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1min">Every minute</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="1hour">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Alert Thresholds</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (5xx errors)</SelectItem>
                        <SelectItem value="medium">Medium (4xx + 5xx)</SelectItem>
                        <SelectItem value="high">High (3xx + 4xx + 5xx)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Uptime monitoring</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL certificate monitoring</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Broken link detection</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Performance monitoring</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    site: 'NEXUS Store',
                    alert: 'High response time detected',
                    severity: 'warning',
                    time: '2026-04-24T14:30:00Z'
                  },
                  {
                    site: 'NEXUS Blog',
                    alert: 'SSL certificate expires in 30 days',
                    severity: 'info',
                    time: '2026-04-24T12:15:00Z'
                  },
                  {
                    site: 'NEXUS Landing',
                    alert: 'Broken link detected on /pricing',
                    severity: 'warning',
                    time: '2026-04-24T10:45:00Z'
                  }
                ].map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {alert.severity === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{alert.site}</div>
                        <div className="text-sm text-gray-600">{alert.alert}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(alert.time).toLocaleString()}
                      </div>
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