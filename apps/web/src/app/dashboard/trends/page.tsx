'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Globe,
  Zap,
  ExternalLink,
  Loader2,
  Target,
  Hash,
  Calendar,
  ArrowUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface Trend {
  id?: string
  title: string
  description?: string
  category?: string
  region?: string
  search_volume?: number
  momentum?: number
  score?: number
  source?: string
  source_icon?: string
  trend_date?: string
  status?: string
  url?: string
  image?: string
}

const REGIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' }
]

const CATEGORIES = [
  { value: '0', label: 'All Categories' },
  { value: '0', label: 'Technology' },
  { value: '1', label: 'Business' },
  { value: '2', label: 'Entertainment' },
  { value: '3', label: 'Sports' },
  { value: '4', label: 'Science' },
  { value: '5', label: 'Health' },
  { value: '6', label: 'Politics' }
]

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState('global')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('US')
  const [selectedCategory, setSelectedCategory] = useState('0')
  const [sortBy, setSortBy] = useState<'score' | 'volume' | 'momentum'>('score')
  const [lastSync, setLastSync] = useState<string | null>(null)

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true)
      const region = selectedRegion
      const category = selectedCategory
      const data = await apiClient.getGlobalTrends(region, category)
      setTrends(data.trends || [])
      setLastSync(new Date().toISOString())
    } catch (error) {
      console.error('Error fetching trends:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedRegion, selectedCategory])

  useEffect(() => {
    fetchTrends()
  }, [fetchTrends])

  const handleSync = async () => {
    try {
      setSyncing(true)
      await apiClient.syncTrends()
      await fetchTrends()
    } catch (error) {
      console.error('Error syncing trends:', error)
    } finally {
      setSyncing(false)
    }
  }

  const filteredTrends = trends.filter(trend =>
    trend.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trend.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedTrends = [...filteredTrends].sort((a, b) => {
    if (sortBy === 'volume') return (b.search_volume || 0) - (a.search_volume || 0)
    if (sortBy === 'momentum') return (b.momentum || 0) - (a.momentum || 0)
    return (b.score || 0) - (a.score || 0)
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getMomentumColor = (momentum: number) => {
    if (momentum > 30) return 'text-green-600'
    if (momentum > 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Trend Discovery</h1>
          <p className="text-nexus-text-secondary mt-1">
            Real-time trends from Google, Reddit, Hacker News, Twitter, YouTube & News
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync Trends
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search trends..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
        >
          {REGIONS.map(region => (
            <option key={region.value} value={region.value}>{region.label}</option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
        >
          <option value="score">Sort by Score</option>
          <option value="volume">Sort by Volume</option>
          <option value="momentum">Sort by Momentum</option>
        </select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Trends
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            My Business Trends
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Keyword Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-nexus-blue" />
            </div>
          ) : sortedTrends.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center">
                <TrendingUp className="w-16 h-16 mx-auto text-nexus-text-tertiary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Trends Found</h3>
                <p className="text-nexus-text-secondary mb-4">
                  Try adjusting your filters or sync the latest trends.
                </p>
                <Button onClick={handleSync} disabled={syncing}>
                  <RefreshCw className={cn("w-4 h-4 mr-2", syncing && "animate-spin")} />
                  Sync Trends Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedTrends.map((trend, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{trend.source_icon}</span>
                        <Badge variant="outline" className="text-xs">
                          {trend.source}
                        </Badge>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-sm font-semibold",
                        getScoreColor(trend.score || 0)
                      )}>
                        {trend.score || 0}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 line-clamp-2">{trend.title}</h3>
                    {trend.description && (
                      <p className="text-sm text-nexus-text-secondary mb-3 line-clamp-2">
                        {trend.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4 text-nexus-text-tertiary" />
                          {formatVolume(trend.search_volume || 0)}
                        </span>
                        <span className={cn("flex items-center gap-1", getMomentumColor(trend.momentum || 0))}>
                          {trend.momentum && trend.momentum > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {trend.momentum || 0}%
                        </span>
                      </div>
                      {trend.url && (
                        <a
                          href={trend.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-nexus-blue hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {trend.category && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {trend.category}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business-Specific Trends</CardTitle>
              <CardDescription>
                Trends matched to your business profile, industry, and keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-nexus-text-secondary">
                <Target className="w-16 h-16 mx-auto text-nexus-text-tertiary mb-4" />
                <p>Connect your business profile to see relevant trends.</p>
                <Button className="mt-4">
                  Go to Business Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Trend Tracking</CardTitle>
              <CardDescription>
                Track search volume and momentum for specific keywords over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter keyword to track..."
                    className="flex-1"
                  />
                  <Button className="bg-nexus-blue hover:bg-nexus-blue/90">
                    <Zap className="w-4 h-4 mr-2" />
                    Track
                  </Button>
                </div>
                <div className="p-8 text-center border-2 border-dashed rounded-lg">
                  <BarChart3 className="w-12 h-12 mx-auto text-nexus-text-tertiary mb-2" />
                  <p className="text-nexus-text-secondary">
                    Add keywords to track their search volume over time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastSync && (
        <div className="mt-4 text-center text-sm text-nexus-text-tertiary">
          Last synced: {new Date(lastSync).toLocaleString()}
        </div>
      )}
    </div>
  )
}