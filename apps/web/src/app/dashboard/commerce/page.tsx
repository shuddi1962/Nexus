'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  BarChart3,
  Target,
  ShoppingCart,
  DollarSign,
  Users,
  Eye,
  Star,
  ExternalLink,
  RefreshCw,
  Lightbulb,
  Zap,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface ProductResult {
  title: string
  price: number
  original_price?: number
  currency: string
  rating: number
  review_count: number
  seller: string
  url: string
  image_url: string
  platform: string
  availability: 'in_stock' | 'out_of_stock' | 'limited'
  tags: string[]
}

interface MarketTrends {
  overall_trend: 'growing' | 'declining' | 'stable'
  growth_rate: number
  emerging_trends: string[]
  consumer_behavior: {
    average_order_value: number
    preferred_channels: string[]
  }
}

export default function CommercePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('research')
  const [loading, setLoading] = useState(false)

  // Product Research
  const [researchQuery, setResearchQuery] = useState('')
  const [researchPlatform, setResearchPlatform] = useState<'amazon' | 'shopify' | 'etsy' | 'ebay' | 'aliexpress'>('amazon')
  const [researchResults, setResearchResults] = useState<ProductResult[]>([])
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null)
  const [isResearching, setIsResearching] = useState(false)

  // Market Trends
  const [selectedCategory, setSelectedCategory] = useState('')
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [marketTrends, setMarketTrends] = useState<MarketTrends | null>(null)
  const [isAnalyzingTrends, setIsAnalyzingTrends] = useState(false)

  // Ad Intelligence
  const [intelligenceKeyword, setIntelligenceKeyword] = useState('')
  const [intelligencePlatform, setIntelligencePlatform] = useState<'google' | 'facebook' | 'tiktok' | 'pinterest'>('google')
  const [adIntelligence, setAdIntelligence] = useState<any>(null)
  const [isGettingIntelligence, setIsGettingIntelligence] = useState(false)

  useEffect(() => {
    if (activeTab === 'trends') {
      fetchMarketTrends()
    }
  }, [activeTab, selectedCategory, timeframe])

  const handleProductResearch = async () => {
    if (!researchQuery.trim()) return

    try {
      setIsResearching(true)
      const data = await apiClient.performProductResearch(researchQuery, researchPlatform)
      setResearchResults(data.results || [])
      setMarketAnalysis(data.analysis)
    } catch (error) {
      console.error('Error performing product research:', error)
      alert('Failed to perform product research. Please check your API keys and try again.')
    } finally {
      setIsResearching(false)
    }
  }

  const fetchMarketTrends = async () => {
    try {
      setIsAnalyzingTrends(true)
      const data = await apiClient.getMarketTrends({
        category: selectedCategory,
        timeframe,
        region: 'US'
      })
      setMarketTrends(data.trends)
    } catch (error) {
      console.error('Error fetching market trends:', error)
      // Fallback to mock data
      setMarketTrends({
        overall_trend: 'growing',
        growth_rate: 12.5,
        emerging_trends: ['Sustainable products', 'AI-powered features', 'Personalization'],
        consumer_behavior: {
          average_order_value: 89.50,
          preferred_channels: ['Online stores', 'Social commerce', 'Marketplaces']
        }
      })
    } finally {
      setIsAnalyzingTrends(false)
    }
  }

  const handleAdIntelligence = async () => {
    try {
      setIsGettingIntelligence(true)
      const data = await apiClient.getAdIntelligence({
        keyword: intelligenceKeyword,
        platform: intelligencePlatform,
        timeframe: '30d'
      })
      setAdIntelligence(data.intelligence)
    } catch (error) {
      console.error('Error getting ad intelligence:', error)
      alert('Failed to get ad intelligence. Please check your API keys and try again.')
    } finally {
      setIsGettingIntelligence(false)
    }
  }

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'amazon':
        return '📦'
      case 'shopify':
        return '🛒'
      case 'etsy':
        return '🧵'
      case 'ebay':
        return '🔨'
      case 'aliexpress':
        return '🚚'
      default:
        return '🛍️'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'growing':
        return <TrendingUp className="w-4 h-4 text-nexus-green" />
      case 'down':
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-nexus-red" />
      default:
        return <Minus className="w-4 h-4 text-nexus-text-tertiary" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Commerce Intelligence</h1>
          <p className="text-nexus-text-secondary">Product research, market analysis, and competitive intelligence tools.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Download className="w-4 h-4 mr-2 text-nexus-blue" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="research">Product Research</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="intelligence">Ad Intelligence</TabsTrigger>
          <TabsTrigger value="ugc">UGC Ads</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Search className="w-5 h-5 mr-2 text-nexus-blue" />
                Product Research & Competitive Analysis
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Research products across multiple platforms and analyze market positioning.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label className="text-nexus-text-primary">Product or Keyword</Label>
                  <Input
                    value={researchQuery}
                    onChange={(e) => setResearchQuery(e.target.value)}
                    placeholder="e.g., wireless headphones, smart watch, coffee maker"
                    className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  />
                </div>
                <div>
                  <Label className="text-nexus-text-primary">Platform</Label>
                  <Select value={researchPlatform} onValueChange={(value: any) => setResearchPlatform(value)}>
                    <SelectTrigger className="mt-1 border-nexus-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="etsy">Etsy</SelectItem>
                      <SelectItem value="ebay">eBay</SelectItem>
                      <SelectItem value="aliexpress">AliExpress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleProductResearch}
                disabled={!researchQuery.trim() || isResearching}
                className="w-full bg-nexus-blue hover:bg-nexus-accent text-white"
              >
                {isResearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Researching Products...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Research Products
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {researchResults.length > 0 && (
            <>
              {/* Market Analysis Overview */}
              {marketAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="border-nexus-border">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <ShoppingCart className="w-8 h-8 text-nexus-blue mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-nexus-text-primary">
                            {marketAnalysis.market_overview.total_products}
                          </div>
                          <div className="text-sm text-nexus-text-secondary">Products Found</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-border">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <DollarSign className="w-8 h-8 text-nexus-green mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-nexus-text-primary">
                            {formatCurrency(marketAnalysis.market_overview.average_price)}
                          </div>
                          <div className="text-sm text-nexus-text-secondary">Average Price</div>
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
                            {marketAnalysis.competitive_analysis.price_positioning}
                          </div>
                          <div className="text-sm text-nexus-text-secondary">Price Position</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-border">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-nexus-amber mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-nexus-text-primary">
                            {marketAnalysis.market_overview.top_sellers.length}
                          </div>
                          <div className="text-sm text-nexus-text-secondary">Top Sellers</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Product Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {researchResults.map((product, index) => (
                  <Card key={index} className="border-nexus-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPlatformIcon(product.platform)}</span>
                          <Badge variant="outline" className="border-nexus-border">
                            {product.platform}
                          </Badge>
                        </div>
                        <Badge className={
                          product.availability === 'in_stock' ? 'bg-nexus-green text-white' :
                          product.availability === 'limited' ? 'bg-nexus-amber text-white' :
                          'bg-nexus-red text-white'
                        }>
                          {product.availability.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="aspect-square bg-nexus-bg-secondary rounded-lg mb-3 flex items-center justify-center">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="max-w-full max-h-full object-contain rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Product'
                          }}
                        />
                      </div>

                      <h3 className="font-medium text-nexus-text-primary mb-2 line-clamp-2">
                        {product.title}
                      </h3>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-nexus-amber text-nexus-amber" />
                          <span className="text-sm text-nexus-text-primary">{product.rating}</span>
                          <span className="text-sm text-nexus-text-secondary">
                            ({formatNumber(product.review_count)})
                          </span>
                        </div>
                        <span className="text-sm text-nexus-text-secondary">{product.seller}</span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-nexus-text-primary">
                            {formatCurrency(product.price, product.currency)}
                          </span>
                          {product.original_price && (
                            <span className="text-sm text-nexus-text-secondary line-through ml-2">
                              {formatCurrency(product.original_price, product.currency)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs border-nexus-border">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-nexus-border hover:bg-nexus-bg-secondary"
                        onClick={() => window.open(product.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2 text-nexus-blue" />
                        View Product
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Market Recommendations */}
              {marketAnalysis && (
                <Card className="border-nexus-border">
                  <CardHeader>
                    <CardTitle className="text-nexus-text-primary flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-nexus-amber" />
                      Market Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-nexus-text-primary mb-3">Pricing Strategy</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-nexus-text-secondary">Suggested Price Range:</span>
                            <span className="text-nexus-text-primary font-medium">
                              {formatCurrency(marketAnalysis.recommendations.suggested_price_range.min)} - {formatCurrency(marketAnalysis.recommendations.suggested_price_range.max)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-nexus-text-secondary">Market Position:</span>
                            <span className="text-nexus-text-primary font-medium capitalize">
                              {marketAnalysis.competitive_analysis.price_positioning}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-nexus-text-primary mb-3">Target Categories</h4>
                        <div className="flex flex-wrap gap-1">
                          {marketAnalysis.recommendations.optimal_categories.map((category: string, index: number) => (
                            <Badge key={index} className="bg-nexus-blue text-white">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-nexus-text-primary mb-3">Marketing Angles</h4>
                        <ul className="space-y-1">
                          {marketAnalysis.recommendations.marketing_angles.map((angle: string, index: number) => (
                            <li key={index} className="text-sm text-nexus-text-secondary flex items-center">
                              <Target className="w-4 h-4 text-nexus-green mr-2" />
                              {angle}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-nexus-text-primary mb-3">Market Gaps</h4>
                        <ul className="space-y-1">
                          {marketAnalysis.competitive_analysis.market_gaps.map((gap: string, index: number) => (
                            <li key={index} className="text-sm text-nexus-text-secondary flex items-center">
                              <Zap className="w-4 h-4 text-nexus-violet mr-2" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <LineChart className="w-5 h-5 mr-2 text-nexus-green" />
                Market Trends Analysis
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Track market trends, consumer behavior, and emerging opportunities.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-nexus-text-primary">Category (Optional)</Label>
                  <Input
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    placeholder="e.g., electronics, fashion, home goods"
                    className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  />
                </div>
                <div>
                  <Label className="text-nexus-text-primary">Timeframe</Label>
                  <Select value={timeframe} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setTimeframe(value)}>
                    <SelectTrigger className="mt-1 border-nexus-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={fetchMarketTrends}
                    disabled={isAnalyzingTrends}
                    className="w-full bg-nexus-green hover:bg-nexus-green/90 text-white"
                  >
                    {isAnalyzingTrends ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analyze Trends
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {marketTrends && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Overview */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Market Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-nexus-text-secondary">Overall Trend</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(marketTrends.overall_trend)}
                      <span className="font-medium text-nexus-text-primary capitalize">
                        {marketTrends.overall_trend}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-nexus-text-secondary">Growth Rate</span>
                    <span className={`font-medium ${marketTrends.growth_rate > 0 ? 'text-nexus-green' : 'text-nexus-red'}`}>
                      {marketTrends.growth_rate > 0 ? '+' : ''}{marketTrends.growth_rate}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-nexus-text-secondary">Avg Order Value</span>
                    <span className="font-medium text-nexus-text-primary">
                      {formatCurrency(marketTrends.consumer_behavior.average_order_value)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Emerging Trends */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Emerging Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketTrends.emerging_trends.map((trend, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-nexus-bg-secondary rounded-lg">
                        <TrendingUp className="w-5 h-5 text-nexus-violet" />
                        <span className="text-nexus-text-primary">{trend}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Consumer Behavior */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Consumer Behavior</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-nexus-text-secondary mb-2">Preferred Channels</div>
                      <div className="flex flex-wrap gap-1">
                        {marketTrends.consumer_behavior.preferred_channels.map((channel, index) => (
                          <Badge key={index} className="bg-nexus-blue text-white">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seasonality */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Seasonal Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-nexus-text-secondary mb-2">Peak Months</div>
                      <div className="flex flex-wrap gap-1">
                        {['November', 'December'].map((month, index) => (
                          <Badge key={index} className="bg-nexus-green text-white">
                            {month}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-nexus-text-secondary mb-2">Slow Months</div>
                      <div className="flex flex-wrap gap-1">
                        {['January', 'February'].map((month, index) => (
                          <Badge key={index} className="bg-nexus-amber text-white">
                            {month}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Activity className="w-5 h-5 mr-2 text-nexus-violet" />
                Ad Intelligence & Market Insights
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Get detailed insights on advertising performance, audience behavior, and competitive landscape.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-nexus-text-primary">Keyword (Optional)</Label>
                  <Input
                    value={intelligenceKeyword}
                    onChange={(e) => setIntelligenceKeyword(e.target.value)}
                    placeholder="e.g., wireless headphones"
                    className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  />
                </div>
                <div>
                  <Label className="text-nexus-text-primary">Platform</Label>
                  <Select value={intelligencePlatform} onValueChange={(value: any) => setIntelligencePlatform(value)}>
                    <SelectTrigger className="mt-1 border-nexus-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="facebook">Facebook Ads</SelectItem>
                      <SelectItem value="tiktok">TikTok Ads</SelectItem>
                      <SelectItem value="pinterest">Pinterest Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAdIntelligence}
                    disabled={isGettingIntelligence}
                    className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                  >
                    {isGettingIntelligence ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 mr-2" />
                        Get Intelligence
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {adIntelligence && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Performance */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-nexus-text-secondary">Best Performing Platform</span>
                      <Badge className="bg-nexus-green text-white">
                        {adIntelligence.platform_insights.best_performing_platform}
                      </Badge>
                    </div>

                    <div>
                      <div className="text-sm text-nexus-text-secondary mb-2">Audience Engagement Rates</div>
                      <div className="space-y-2">
                        {Object.entries(adIntelligence.platform_insights.audience_engagement_rates).map(([platform, rate]) => (
                          <div key={platform} className="flex items-center justify-between">
                            <span className="text-sm text-nexus-text-primary capitalize">{platform}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={rate as number} className="w-16 h-2" />
                              <span className="text-sm font-medium text-nexus-text-primary">{rate as number}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audience Insights */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Audience Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-nexus-text-secondary mb-2">Top Age Groups</div>
                      <div className="flex flex-wrap gap-1">
                        {adIntelligence.audience_insights.demographics.age_groups.map((age: string, index) => (
                          <Badge key={index} className="bg-nexus-blue text-white">
                            {age}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-nexus-text-secondary mb-2">Gender Distribution</div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-nexus-blue rounded"></div>
                          <span className="text-sm text-nexus-text-primary">
                            Male: {adIntelligence.audience_insights.demographics.gender_distribution.male}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-nexus-violet rounded"></div>
                          <span className="text-sm text-nexus-text-primary">
                            Female: {adIntelligence.audience_insights.demographics.gender_distribution.female}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-nexus-text-secondary mb-2">Top Interests</div>
                      <div className="flex flex-wrap gap-1">
                        {adIntelligence.audience_insights.interests.map((interest, index) => (
                          <Badge key={index} variant="outline" className="border-nexus-border">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Recommendations */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Budget Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(adIntelligence.recommendations.optimal_budget_allocation).map(([platform, percentage]) => (
                      <div key={platform} className="flex items-center justify-between">
                        <span className="text-sm text-nexus-text-primary capitalize">{platform}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={percentage as number} className="w-20 h-2" />
                          <span className="text-sm font-medium text-nexus-text-primary">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Creative Suggestions */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Creative Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {adIntelligence.recommendations.creative_suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-nexus-bg-secondary rounded-lg">
                        <Lightbulb className="w-5 h-5 text-nexus-amber mt-0.5" />
                        <span className="text-sm text-nexus-text-primary">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ugc" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Zap className="w-5 h-5 mr-2 text-nexus-amber" />
                UGC Ads Creation
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Create authentic user-generated content style advertisements for maximum engagement.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">UGC Ads Coming Soon</h3>
                <p className="text-nexus-text-secondary mb-6">
                  Advanced UGC ad creation with AI-powered content generation and automated campaign management.
                </p>
                <Button className="bg-nexus-amber hover:bg-nexus-amber/90 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Enable UGC Ads
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}