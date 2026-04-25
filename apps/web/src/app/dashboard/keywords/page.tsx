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
  Search,
  Plus,
  Globe,
  Target,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  Settings,
  Zap
} from 'lucide-react'

interface KeywordData {
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: number
  competition: 'Low' | 'Medium' | 'High'
  trend: 'up' | 'down' | 'stable'
  position?: number
  url?: string
}

interface Backlink {
  url: string
  domain: string
  da: number
  pa: number
  type: 'dofollow' | 'nofollow'
  anchor: string
  firstSeen: string
  lastSeen: string
  status: 'active' | 'lost' | 'broken'
}

export default function KeywordsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])

  // Mock keyword data
  const keywords: KeywordData[] = [
    {
      keyword: 'marketing automation',
      searchVolume: 12100,
      difficulty: 67,
      cpc: 45.20,
      competition: 'High',
      trend: 'up',
      position: 3,
      url: 'https://nexus.app/marketing-automation'
    },
    {
      keyword: 'lead generation software',
      searchVolume: 8800,
      difficulty: 54,
      cpc: 38.90,
      competition: 'Medium',
      trend: 'up',
      position: 7,
      url: 'https://nexus.app/lead-generation'
    },
    {
      keyword: 'crm platform',
      searchVolume: 16200,
      difficulty: 71,
      cpc: 52.10,
      competition: 'High',
      trend: 'stable',
      position: 2,
      url: 'https://nexus.app/crm'
    },
    {
      keyword: 'sales automation',
      searchVolume: 5900,
      difficulty: 43,
      cpc: 29.80,
      competition: 'Medium',
      trend: 'up',
      position: 5,
      url: 'https://nexus.app/sales-automation'
    },
    {
      keyword: 'email marketing tool',
      searchVolume: 14100,
      difficulty: 58,
      cpc: 41.30,
      competition: 'High',
      trend: 'down',
      position: 4,
      url: 'https://nexus.app/email-marketing'
    }
  ]

  const backlinks: Backlink[] = [
    {
      url: 'https://techcrunch.com/startups/nexus-platform-review',
      domain: 'techcrunch.com',
      da: 98,
      pa: 85,
      type: 'dofollow',
      anchor: 'marketing automation platform',
      firstSeen: '2026-03-15',
      lastSeen: '2026-04-24',
      status: 'active'
    },
    {
      url: 'https://venturebeat.com/business/nexus-saas-review',
      domain: 'venturebeat.com',
      da: 92,
      pa: 78,
      type: 'dofollow',
      anchor: 'Nexus platform',
      firstSeen: '2026-03-20',
      lastSeen: '2026-04-24',
      status: 'active'
    },
    {
      url: 'https://forbes.com/sites/best-marketing-tools-2026',
      domain: 'forbes.com',
      da: 96,
      pa: 82,
      type: 'dofollow',
      anchor: 'top marketing automation',
      firstSeen: '2026-04-01',
      lastSeen: '2026-04-24',
      status: 'active'
    }
  ]

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'Low':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return 'text-red-600'
    if (difficulty >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300"></div>
    }
  }

  const getBacklinkStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-yellow-100 text-yellow-800'
      case 'broken':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keywords & Backlinks</h1>
          <p className="text-gray-600">Track keyword rankings and monitor backlink profile.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Keywords
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-gray-600">Tracked Keywords</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-gray-600">Backlinks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">8.5</div>
                <div className="text-sm text-gray-600">Avg. Position</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">92</div>
                <div className="text-sm text-gray-600">Domain Authority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keywords">Keyword Tracking</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-6">
          {/* Keyword Research */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Research</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Enter keyword to research..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select defaultValue="google">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="bing">Bing</SelectItem>
                    <SelectItem value="yahoo">Yahoo</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Research
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracked Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Tracked Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {keyword.position && (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">#{keyword.position}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{keyword.keyword}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>Vol: {keyword.searchVolume.toLocaleString()}</span>
                          <span className={getDifficultyColor(keyword.difficulty)}>
                            Diff: {keyword.difficulty}%
                          </span>
                          <span>CPC: ${keyword.cpc}</span>
                          <Badge className={getCompetitionColor(keyword.competition)}>
                            {keyword.competition}
                          </Badge>
                        </div>
                        {keyword.url && (
                          <div className="flex items-center space-x-2 mt-2">
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 truncate">{keyword.url}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(keyword.trend)}
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-6">
          {/* Backlink Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">142</div>
                  <div className="text-sm text-gray-600">Dofollow Links</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">14</div>
                  <div className="text-sm text-gray-600">Nofollow Links</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">89.2</div>
                  <div className="text-sm text-gray-600">Avg. Domain Authority</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backlinks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Backlink Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backlinks.map((backlink, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900 truncate max-w-md">{backlink.url}</div>
                          <div className="text-sm text-gray-600">{backlink.domain}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span>DA: <strong>{backlink.da}</strong></span>
                        <span>PA: <strong>{backlink.pa}</strong></span>
                        <Badge variant="outline">{backlink.type}</Badge>
                        <span className="text-gray-500">Anchor: "{backlink.anchor}"</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>First seen: {backlink.firstSeen}</span>
                        <span>Last seen: {backlink.lastSeen}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getBacklinkStatusColor(backlink.status)}>
                        {backlink.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    competitor: 'HubSpot',
                    sharedKeywords: 45,
                    betterRanked: 23,
                    worseRanked: 22,
                    avgPosition: 8.4,
                    overlap: 67
                  },
                  {
                    competitor: 'ActiveCampaign',
                    sharedKeywords: 38,
                    betterRanked: 18,
                    worseRanked: 20,
                    avgPosition: 9.2,
                    overlap: 58
                  },
                  {
                    competitor: 'Mailchimp',
                    sharedKeywords: 52,
                    betterRanked: 31,
                    worseRanked: 21,
                    avgPosition: 7.8,
                    overlap: 72
                  }
                ].map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{competitor.competitor}</h3>
                      <Badge variant="secondary">{competitor.overlap}% overlap</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{competitor.sharedKeywords}</div>
                        <div className="text-xs text-gray-600">Shared Keywords</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{competitor.betterRanked}</div>
                        <div className="text-xs text-gray-600">Better Ranked</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{competitor.worseRanked}</div>
                        <div className="text-xs text-gray-600">Worse Ranked</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{competitor.avgPosition}</div>
                        <div className="text-xs text-gray-600">Avg Position</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{competitor.overlap}%</div>
                        <div className="text-xs text-gray-600">Overlap</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        View Keyword Gaps
                      </Button>
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