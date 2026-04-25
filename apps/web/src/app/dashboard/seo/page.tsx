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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Target,
  Zap,
  RefreshCw,
  Download,
  Share,
  Eye,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface SEOAudit {
  audit_id: string
  url: string
  audit_type: string
  results: {
    score: number
    issues: Array<{
      type: 'error' | 'warning' | 'info'
      category: string
      message: string
      impact: 'high' | 'medium' | 'low'
    }>
    recommendations: Array<{
      category: string
      action: string
      priority: 'high' | 'medium' | 'low'
    }>
    technical_seo: any
    content_seo: any
    performance: any
  }
  created_at: string
}

interface KeywordData {
  keyword: string
  search_volume: number
  competition: number
  cpc: number
  trend: 'up' | 'down' | 'stable'
  difficulty: number
}

export default function SEOEnginePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('audit')
  const [audits, setAudits] = useState<SEOAudit[]>([])
  const [loading, setLoading] = useState(false)

  // Site Audit
  const [auditUrl, setAuditUrl] = useState('')
  const [auditType, setAuditType] = useState<'quick' | 'full' | 'technical' | 'content'>('full')
  const [currentAudit, setCurrentAudit] = useState<SEOAudit | null>(null)
  const [isAuditing, setIsAuditing] = useState(false)

  // Keyword Analysis
  const [keywords, setKeywords] = useState('')
  const [keywordResults, setKeywordResults] = useState<KeywordData[]>([])
  const [isAnalyzingKeywords, setIsAnalyzingKeywords] = useState(false)

  // Indexing
  const [indexUrl, setIndexUrl] = useState('')
  const [selectedEngines, setSelectedEngines] = useState<string[]>(['google', 'bing'])
  const [isIndexing, setIsIndexing] = useState(false)

  useEffect(() => {
    if (activeTab === 'history') {
      fetchAudits()
    }
  }, [activeTab])

  const fetchAudits = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getAudits()
      setAudits(data.audits || [])
    } catch (error) {
      console.error('Error fetching audits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSiteAudit = async () => {
    if (!auditUrl.trim()) return

    try {
      setIsAuditing(true)
      const data = await apiClient.performSiteAudit(auditUrl.trim(), auditType)
      setCurrentAudit(data)
    } catch (error) {
      console.error('Error performing site audit:', error)
      alert('Failed to perform site audit. Please check your API keys and try again.')
    } finally {
      setIsAuditing(false)
    }
  }

  const handleKeywordAnalysis = async () => {
    if (!keywords.trim()) return

    const keywordList = keywords.split('\n').map(k => k.trim()).filter(k => k)
    if (keywordList.length === 0) return

    try {
      setIsAnalyzingKeywords(true)
      const data = await apiClient.analyzeKeywords(keywordList)
      setKeywordResults(data.keywords || [])
    } catch (error) {
      console.error('Error analyzing keywords:', error)
      alert('Failed to analyze keywords. Please check your API keys and try again.')
    } finally {
      setIsAnalyzingKeywords(false)
    }
  }

  const handleIndexing = async () => {
    if (!indexUrl.trim()) return

    try {
      setIsIndexing(true)
      await apiClient.submitForIndexing(indexUrl.trim(), selectedEngines)
      alert('URL submitted for indexing successfully!')
      setIndexUrl('')
    } catch (error) {
      console.error('Error submitting for indexing:', error)
      alert('Failed to submit URL for indexing.')
    } finally {
      setIsIndexing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-nexus-green'
    if (score >= 60) return 'text-nexus-amber'
    return 'text-nexus-red'
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-nexus-red" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-nexus-amber" />
      case 'info':
        return <CheckCircle className="w-4 h-4 text-nexus-blue" />
      default:
        return <CheckCircle className="w-4 h-4 text-nexus-text-tertiary" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-nexus-red text-white'
      case 'medium':
        return 'bg-nexus-amber text-white'
      case 'low':
        return 'bg-nexus-green text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
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
          <h1 className="text-2xl font-bold text-nexus-text-primary">SEO Engine</h1>
          <p className="text-nexus-text-secondary">Comprehensive SEO analysis and optimization tools.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Download className="w-4 h-4 mr-2 text-nexus-blue" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="audit">Site Audit</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="indexing">Indexing</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Search className="w-5 h-5 mr-2 text-nexus-blue" />
                Site Audit
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Comprehensive SEO audit of your website including technical, content, and performance analysis.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label className="text-nexus-text-primary">Website URL</Label>
                  <Input
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  />
                </div>
                <div>
                  <Label className="text-nexus-text-primary">Audit Type</Label>
                  <Select value={auditType} onValueChange={(value: 'quick' | 'full' | 'technical' | 'content') => setAuditType(value)}>
                    <SelectTrigger className="mt-1 border-nexus-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Quick Scan</SelectItem>
                      <SelectItem value="full">Full Audit</SelectItem>
                      <SelectItem value="technical">Technical Only</SelectItem>
                      <SelectItem value="content">Content Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSiteAudit}
                disabled={!auditUrl.trim() || isAuditing}
                className="w-full bg-nexus-blue hover:bg-nexus-accent text-white"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Performing Audit...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Run SEO Audit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {currentAudit && (
            <div className="space-y-6">
              {/* Audit Score */}
              <Card className="border-nexus-border">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(currentAudit.results.score)}`}>
                      {currentAudit.results.score}
                    </div>
                    <div className="text-sm text-nexus-text-secondary mt-2">
                      SEO Score out of 100
                    </div>
                    <div className="mt-4">
                      <Progress value={currentAudit.results.score} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issues */}
                <Card className="border-nexus-border">
                  <CardHeader>
                    <CardTitle className="text-nexus-text-primary">Issues Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentAudit.results.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border border-nexus-border rounded-lg">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="font-medium text-nexus-text-primary">{issue.message}</div>
                            <div className="text-sm text-nexus-text-secondary">
                              Category: {issue.category} • Impact: {issue.impact}
                            </div>
                          </div>
                        </div>
                      ))}
                      {currentAudit.results.issues.length === 0 && (
                        <div className="text-center py-8 text-nexus-text-secondary">
                          No issues found! Your site looks good.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="border-nexus-border">
                  <CardHeader>
                    <CardTitle className="text-nexus-text-primary">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentAudit.results.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 border border-nexus-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-nexus-text-primary capitalize">{rec.category}</span>
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-nexus-text-secondary">{rec.action}</p>
                        </div>
                      ))}
                      {currentAudit.results.recommendations.length === 0 && (
                        <div className="text-center py-8 text-nexus-text-secondary">
                          No recommendations available.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Technical SEO */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Technical SEO</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-nexus-bg-secondary rounded-lg">
                      <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${currentAudit.results.technical_seo.has_ssl ? 'text-nexus-green' : 'text-nexus-red'}`} />
                      <div className="text-sm font-medium text-nexus-text-primary">SSL</div>
                      <div className="text-xs text-nexus-text-secondary">
                        {currentAudit.results.technical_seo.has_ssl ? 'Enabled' : 'Missing'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-nexus-bg-secondary rounded-lg">
                      <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${currentAudit.results.technical_seo.has_canonical ? 'text-nexus-green' : 'text-nexus-amber'}`} />
                      <div className="text-sm font-medium text-nexus-text-primary">Canonical</div>
                      <div className="text-xs text-nexus-text-secondary">
                        {currentAudit.results.technical_seo.has_canonical ? 'Present' : 'Missing'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-nexus-bg-secondary rounded-lg">
                      <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${currentAudit.results.technical_seo.has_robots ? 'text-nexus-green' : 'text-nexus-amber'}`} />
                      <div className="text-sm font-medium text-nexus-text-primary">Robots</div>
                      <div className="text-xs text-nexus-text-secondary">
                        {currentAudit.results.technical_seo.has_robots ? 'Present' : 'Missing'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-nexus-bg-secondary rounded-lg">
                      <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${currentAudit.results.technical_seo.has_sitemap ? 'text-nexus-green' : 'text-nexus-amber'}`} />
                      <div className="text-sm font-medium text-nexus-text-primary">Sitemap</div>
                      <div className="text-xs text-nexus-text-secondary">
                        {currentAudit.results.technical_seo.has_sitemap ? 'Present' : 'Missing'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Target className="w-5 h-5 mr-2 text-nexus-violet" />
                Keyword Analysis
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Analyze keyword search volume, competition, and difficulty using professional SEO tools.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-nexus-text-primary">Keywords (one per line)</Label>
                <Textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords to analyze..."
                  rows={6}
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <Button
                onClick={handleKeywordAnalysis}
                disabled={!keywords.trim() || isAnalyzingKeywords}
                className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white"
              >
                {isAnalyzingKeywords ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Analyze Keywords
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {keywordResults.length > 0 && (
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Keyword Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keywordResults.map((keyword, index) => (
                    <div key={index} className="p-4 border border-nexus-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-nexus-text-primary">{keyword.keyword}</h3>
                        <div className="flex items-center space-x-2">
                          {keyword.trend === 'up' ? (
                            <ArrowUp className="w-4 h-4 text-nexus-green" />
                          ) : keyword.trend === 'down' ? (
                            <ArrowDown className="w-4 h-4 text-nexus-red" />
                          ) : (
                            <Minus className="w-4 h-4 text-nexus-text-tertiary" />
                          )}
                          <Badge className={
                            keyword.difficulty < 30 ? 'bg-nexus-green text-white' :
                            keyword.difficulty < 70 ? 'bg-nexus-amber text-white' :
                            'bg-nexus-red text-white'
                          }>
                            {keyword.difficulty}/100
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-nexus-text-tertiary">Search Volume</div>
                          <div className="font-semibold text-nexus-text-primary">
                            {formatNumber(keyword.search_volume)}
                          </div>
                        </div>
                        <div>
                          <div className="text-nexus-text-tertiary">Competition</div>
                          <div className="font-semibold text-nexus-text-primary">
                            {(keyword.competition * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-nexus-text-tertiary">CPC</div>
                          <div className="font-semibold text-nexus-text-primary">
                            ${keyword.cpc.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-nexus-text-tertiary">Difficulty</div>
                          <div className="font-semibold text-nexus-text-primary">
                            {keyword.difficulty}/100
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="indexing" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Zap className="w-5 h-5 mr-2 text-nexus-amber" />
                Search Engine Indexing
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Submit your URLs directly to Google and Bing for faster indexing.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-nexus-text-primary">URL to Index</Label>
                <Input
                  value={indexUrl}
                  onChange={(e) => setIndexUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <div>
                <Label className="text-nexus-text-primary">Search Engines</Label>
                <div className="flex space-x-4 mt-2">
                  {[
                    { id: 'google', label: 'Google', icon: '🔍' },
                    { id: 'bing', label: 'Bing', icon: '🔎' }
                  ].map(engine => (
                    <label key={engine.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEngines.includes(engine.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEngines(prev => [...prev, engine.id])
                          } else {
                            setSelectedEngines(prev => prev.filter(id => id !== engine.id))
                          }
                        }}
                        className="rounded border-nexus-border"
                      />
                      <span className="text-lg">{engine.icon}</span>
                      <span className="text-nexus-text-primary">{engine.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleIndexing}
                disabled={!indexUrl.trim() || selectedEngines.length === 0 || isIndexing}
                className="w-full bg-nexus-amber hover:bg-nexus-amber/90 text-white"
              >
                {isIndexing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Submit for Indexing
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Globe className="w-5 h-5 mr-2 text-nexus-green" />
                Backlink Analysis
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Analyze your backlink profile and track new backlinks.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">Backlink Analysis</h3>
                <p className="text-nexus-text-secondary mb-6">
                  Advanced backlink analysis coming soon. This will include domain authority, anchor text analysis, and new backlink discovery.
                </p>
                <Button className="bg-nexus-green hover:bg-nexus-green/90 text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  Enable Backlink Tracking
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Audit History</CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                View your previous SEO audits and track improvements over time.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-nexus-blue" />
                  <span className="ml-2 text-nexus-text-secondary">Loading audits...</span>
                </div>
              ) : audits.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Audits Yet</h3>
                  <p className="text-nexus-text-secondary mb-6">
                    Run your first SEO audit to start tracking your website's performance.
                  </p>
                  <Button
                    onClick={() => setActiveTab('audit')}
                    className="bg-nexus-blue hover:bg-nexus-accent text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Run First Audit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {audits.map((audit) => (
                    <div key={audit.audit_id} className="p-4 border border-nexus-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-nexus-blue" />
                          <span className="font-medium text-nexus-text-primary">{audit.url}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="capitalize border-nexus-border">
                            {audit.audit_type}
                          </Badge>
                          <div className={`text-lg font-bold ${getScoreColor(audit.results.score)}`}>
                            {audit.results.score}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-nexus-text-secondary">
                        <span>{audit.results.issues.length} issues found</span>
                        <span>{new Date(audit.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}