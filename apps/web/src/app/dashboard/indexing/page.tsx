'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Globe,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Settings,
  BarChart3,
  Clock,
  Zap,
  Target,
  ExternalLink,
  Eye
} from 'lucide-react'

interface IndexedPage {
  url: string
  title: string
  status: 'indexed' | 'not_indexed' | 'pending' | 'error'
  lastChecked: string
  lastIndexed?: string
  priority: 'high' | 'medium' | 'low'
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

interface SitemapData {
  url: string
  pages: number
  lastSubmitted: string
  lastDownloaded: string
  status: 'valid' | 'invalid' | 'warning'
  errors?: string[]
}

export default function IndexingPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock indexed pages data
  const indexedPages: IndexedPage[] = [
    {
      url: 'https://nexus.app/',
      title: 'NEXUS - Complete Marketing Automation Platform',
      status: 'indexed',
      lastChecked: '2026-04-24T10:30:00Z',
      lastIndexed: '2026-04-24T08:15:00Z',
      priority: 'high',
      clicks: 1250,
      impressions: 15400,
      ctr: 8.1,
      position: 3.2
    },
    {
      url: 'https://nexus.app/features',
      title: 'Features - NEXUS Marketing Platform',
      status: 'indexed',
      lastChecked: '2026-04-24T10:30:00Z',
      lastIndexed: '2026-04-24T08:20:00Z',
      priority: 'high',
      clicks: 890,
      impressions: 12300,
      ctr: 7.2,
      position: 4.1
    },
    {
      url: 'https://nexus.app/pricing',
      title: 'Pricing Plans - NEXUS',
      status: 'indexed',
      lastChecked: '2026-04-24T10:30:00Z',
      lastIndexed: '2026-04-24T08:25:00Z',
      priority: 'high',
      clicks: 675,
      impressions: 9800,
      ctr: 6.9,
      position: 5.8
    },
    {
      url: 'https://nexus.app/blog/marketing-automation-guide',
      title: 'Complete Guide to Marketing Automation',
      status: 'pending',
      lastChecked: '2026-04-24T10:30:00Z',
      priority: 'medium',
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0
    },
    {
      url: 'https://nexus.app/case-studies/tech-startup',
      title: 'Tech Startup Success Story',
      status: 'not_indexed',
      lastChecked: '2026-04-23T15:45:00Z',
      priority: 'low',
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0
    }
  ]

  const sitemaps: SitemapData[] = [
    {
      url: 'https://nexus.app/sitemap.xml',
      pages: 147,
      lastSubmitted: '2026-04-24T09:00:00Z',
      lastDownloaded: '2026-04-24T10:00:00Z',
      status: 'valid'
    },
    {
      url: 'https://nexus.app/sitemap-blog.xml',
      pages: 89,
      lastSubmitted: '2026-04-24T09:15:00Z',
      lastDownloaded: '2026-04-24T10:15:00Z',
      status: 'valid'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'indexed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'not_indexed':
        return 'bg-red-100 text-red-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-500" />
      case 'not_indexed':
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSitemapStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'invalid':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPages = indexedPages.filter(page =>
    page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auto-Indexing & SEO</h1>
          <p className="text-gray-600">Monitor page indexing status and optimize for search engines.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Status
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Index Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Submit URLs
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {indexedPages.filter(p => p.status === 'indexed').length}
                </div>
                <div className="text-sm text-gray-600">Pages Indexed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {indexedPages.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending Index</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">4.2</div>
                <div className="text-sm text-gray-600">Avg. Position</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">8.7%</div>
                <div className="text-sm text-gray-600">Avg. CTR</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages">Indexed Pages</TabsTrigger>
          <TabsTrigger value="sitemaps">Sitemaps</TabsTrigger>
          <TabsTrigger value="crawling">Crawling Tools</TabsTrigger>
          <TabsTrigger value="analytics">Index Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                    <SelectItem value="indexed">Indexed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not_indexed">Not Indexed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pages Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Page
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SEO Metrics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPages.map((page, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="flex items-center">
                              <ExternalLink className="w-4 h-4 text-gray-400 mr-2" />
                              <a
                                href={page.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 truncate max-w-xs"
                              >
                                {page.url}
                              </a>
                            </div>
                            <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                              {page.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(page.status)}
                            <Badge className={`ml-2 ${getStatusColor(page.status)}`}>
                              {page.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getPriorityColor(page.priority)}>
                            {page.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {page.status === 'indexed' ? (
                            <div className="space-y-1">
                              <div>Pos: {page.position}</div>
                              <div>Clicks: {page.clicks}</div>
                              <div>CTR: {page.ctr}%</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {page.lastIndexed ?
                            new Date(page.lastIndexed).toLocaleDateString() :
                            new Date(page.lastChecked).toLocaleDateString()
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="w-4 h-4" />
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

        <TabsContent value="sitemaps" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sitemap Management</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sitemap
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sitemaps.map((sitemap, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">{sitemap.url}</div>
                          <div className="text-sm text-gray-600">
                            {sitemap.pages} pages • Last submitted: {new Date(sitemap.lastSubmitted).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Last downloaded: {new Date(sitemap.lastDownloaded).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getSitemapStatusColor(sitemap.status)}>
                        {sitemap.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Submit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sitemap Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Include Post Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Pages</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Posts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Products</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Update Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Always</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority Calculation</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="content">Content-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Sitemap
                  </Button>
                  <Button variant="outline">
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawling" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>URL Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>URLs to Submit (one per line)</Label>
                  <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
                    placeholder="https://nexus.app/new-page&#10;https://nexus.app/blog/new-post"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    Submit to Google
                  </Button>
                  <Button variant="outline">
                    Submit to Bing
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crawling Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Check robots.txt
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    Test Rich Results
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Page Speed Insights
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Mobile-Friendly Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">94.2%</div>
                    <div className="text-sm text-gray-600">Index Coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">2.3</div>
                    <div className="text-sm text-gray-600">Days to Index</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">98.7%</div>
                    <div className="text-sm text-gray-600">Successful Crawls</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Indexing Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pages Indexed (Last 30 Days)</span>
                    <span className="font-bold">142</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Indexing Speed</span>
                    <span className="font-bold">2.1 days</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Crawl Error Rate</span>
                    <span className="font-bold">1.3%</span>
                  </div>
                  <Progress value={13} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}