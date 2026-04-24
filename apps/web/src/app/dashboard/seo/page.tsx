'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Download,
  Target,
  BarChart3,
  Link,
  FileText,
  Image,
  Zap
} from 'lucide-react'

interface SEOIssue {
  type: 'error' | 'warning' | 'success'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  url?: string
}

interface KeywordData {
  keyword: string
  volume: number
  difficulty: number
  position: number
  trend: 'up' | 'down' | 'stable'
  cpc: number
}

export default function SEOEnginePage() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  // Mock SEO data
  const seoIssues: SEOIssue[] = [
    {
      type: 'error',
      title: 'Missing Meta Description',
      description: 'Pages are missing meta descriptions, which can impact click-through rates.',
      impact: 'high',
      url: '/products'
    },
    {
      type: 'warning',
      title: 'Slow Page Load Speed',
      description: 'Some pages take longer than 3 seconds to load, affecting user experience.',
      impact: 'medium',
      url: '/blog'
    },
    {
      type: 'success',
      title: 'Mobile-Friendly Design',
      description: 'All pages are properly optimized for mobile devices.',
      impact: 'high'
    },
    {
      type: 'error',
      title: 'Broken Internal Links',
      description: 'Found 3 broken internal links that need to be fixed.',
      impact: 'medium',
      url: '/about'
    }
  ]

  const keywords: KeywordData[] = [
    { keyword: 'business crm', volume: 5400, difficulty: 65, position: 3, trend: 'up', cpc: 8.50 },
    { keyword: 'ai automation', volume: 8100, difficulty: 72, position: 5, trend: 'up', cpc: 12.30 },
    { keyword: 'saas platform', volume: 12100, difficulty: 78, position: 7, trend: 'stable', cpc: 15.20 },
    { keyword: 'digital marketing tools', volume: 3600, difficulty: 55, position: 2, trend: 'up', cpc: 6.80 },
    { keyword: 'customer management', volume: 2900, difficulty: 48, position: 1, trend: 'up', cpc: 5.40 }
  ]

  const backlinks = [
    { url: 'techcrunch.com/article', domainAuthority: 89, type: 'dofollow', status: 'active' },
    { url: 'forbes.com/business-news', domainAuthority: 92, type: 'dofollow', status: 'active' },
    { url: 'businessinsider.com/tech', domainAuthority: 85, type: 'nofollow', status: 'active' },
    { url: 'venturebeat.com/ai-news', domainAuthority: 78, type: 'dofollow', status: 'broken' },
    { url: 'techrepublic.com/software', domainAuthority: 82, type: 'dofollow', status: 'active' }
  ]

  const handleAnalyze = () => {
    if (!websiteUrl.trim()) return

    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResults({
        score: 78,
        pages: 45,
        indexed: 42,
        issues: seoIssues.length
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return null
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Engine</h1>
          <p className="text-gray-600">Comprehensive SEO analysis and optimization tools.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            AI Optimize
          </Button>
        </div>
      </div>

      {/* Website Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Website Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Site
                  </>
                )}
              </Button>
            </div>
          </div>

          {analysisResults && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analysisResults.score}</div>
                <div className="text-sm text-gray-600">SEO Score</div>
                <Progress value={analysisResults.score} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analysisResults.pages}</div>
                <div className="text-sm text-gray-600">Total Pages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{analysisResults.indexed}</div>
                <div className="text-sm text-gray-600">Indexed Pages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{analysisResults.issues}</div>
                <div className="text-sm text-gray-600">Issues Found</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="issues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoIssues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getIssueIcon(issue.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{issue.title}</h3>
                        <Badge className={getImpactColor(issue.impact)}>
                          {issue.impact} impact
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                      {issue.url && (
                        <div className="flex items-center text-blue-600 text-sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {issue.url}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Fix Issue
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">#{keyword.position}</div>
                        <div className={`text-sm ${keyword.trend === 'up' ? 'text-green-600' : keyword.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                          {keyword.trend === 'up' ? '↗' : keyword.trend === 'down' ? '↘' : '→'}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{keyword.keyword}</h3>
                        <div className="text-sm text-gray-600">
                          Volume: {keyword.volume.toLocaleString()} | CPC: ${keyword.cpc}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                      <Progress value={keyword.difficulty} className="w-24 mb-1" />
                      <div className="text-xs text-gray-500">{keyword.difficulty}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { keyword: 'business automation tools', volume: 2900, difficulty: 45, opportunity: 'high' },
                  { keyword: 'ai customer service', volume: 4100, difficulty: 58, opportunity: 'high' },
                  { keyword: 'saas metrics', volume: 1800, difficulty: 35, opportunity: 'medium' },
                  { keyword: 'digital workflow', volume: 2200, difficulty: 42, opportunity: 'medium' }
                ].map((opp, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{opp.keyword}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {opp.volume.toLocaleString()} searches
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={opp.opportunity === 'high' ? 'default' : 'secondary'}>
                        {opp.opportunity} opportunity
                      </Badge>
                      <Button variant="outline" size="sm">
                        Target
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backlink Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">247</div>
                  <div className="text-sm text-gray-600">Total Backlinks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">189</div>
                  <div className="text-sm text-gray-600">Dofollow Links</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">42.3</div>
                  <div className="text-sm text-gray-600">Avg Domain Authority</div>
                </div>
              </div>

              <div className="space-y-3">
                {backlinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        link.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-sm">{link.url}</div>
                        <div className="text-xs text-gray-600">
                          DA: {link.domainAuthority} | {link.type}
                        </div>
                      </div>
                    </div>
                    <Badge variant={link.type === 'dofollow' ? 'default' : 'secondary'}>
                      {link.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="page-url">Page URL</Label>
                  <Input
                    id="page-url"
                    placeholder="https://yourwebsite.com/page"
                    className="mt-1"
                  />
                </div>
                <Button className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Analyze Content
                </Button>

                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-medium">Content Suggestions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Good title length (45 characters)
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Add more internal links
                    </div>
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-4 h-4 mr-2" />
                      Missing alt text on images
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page Speed</span>
                    <Badge className="bg-green-100 text-green-800">Good (2.1s)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile-Friendly</span>
                    <Badge className="bg-green-100 text-green-800">Yes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Structured Data</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Core Web Vitals</span>
                    <Badge className="bg-green-100 text-green-800">Good</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}