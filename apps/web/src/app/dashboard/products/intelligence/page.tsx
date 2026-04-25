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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Eye,
  Users,
  DollarSign,
  ShoppingCart,
  Search,
  Filter,
  Download,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react'

interface IntelligenceData {
  keyword: string
  searchVolume: number
  competition: 'Low' | 'Medium' | 'High'
  trend: 'up' | 'down' | 'stable'
  cpc: number
  opportunity: 'High' | 'Medium' | 'Low'
  relatedProducts: number
}

interface CompetitorAnalysis {
  competitor: string
  marketShare: number
  products: number
  revenue: number
  growth: number
  strengths: string[]
  weaknesses: string[]
}

interface MarketTrend {
  category: string
  growth: number
  demand: 'High' | 'Medium' | 'Low'
  seasonality: string
  emerging: boolean
}

export default function ProductIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')

  // Mock intelligence data
  const keywordIntelligence: IntelligenceData[] = [
    {
      keyword: 'wireless earbuds',
      searchVolume: 45000,
      competition: 'High',
      trend: 'up',
      cpc: 2.45,
      opportunity: 'Medium',
      relatedProducts: 1250
    },
    {
      keyword: 'smart home devices',
      searchVolume: 32000,
      competition: 'Medium',
      trend: 'up',
      cpc: 3.12,
      opportunity: 'High',
      relatedProducts: 890
    },
    {
      keyword: 'sustainable fashion',
      searchVolume: 28000,
      competition: 'Low',
      trend: 'up',
      cpc: 1.89,
      opportunity: 'High',
      relatedProducts: 567
    },
    {
      keyword: 'AI productivity tools',
      searchVolume: 18000,
      competition: 'Medium',
      trend: 'up',
      cpc: 4.23,
      opportunity: 'High',
      relatedProducts: 234
    },
    {
      keyword: 'eco friendly cleaning',
      searchVolume: 15000,
      competition: 'Low',
      trend: 'stable',
      cpc: 1.67,
      opportunity: 'Medium',
      relatedProducts: 445
    }
  ]

  const competitorAnalysis: CompetitorAnalysis[] = [
    {
      competitor: 'TechCorp',
      marketShare: 15.2,
      products: 2340,
      revenue: 2500000,
      growth: 12.3,
      strengths: ['Brand Recognition', 'Product Quality', 'Customer Service'],
      weaknesses: ['High Pricing', 'Limited Customization', 'Slow Shipping']
    },
    {
      competitor: 'InnovateLabs',
      marketShare: 8.7,
      products: 1890,
      revenue: 1800000,
      growth: 18.9,
      strengths: ['Innovation', 'Agile Development', 'Customer Feedback'],
      weaknesses: ['Small Market Share', 'Limited Resources', 'New Brand']
    },
    {
      competitor: 'MarketLeader Inc',
      marketShare: 22.1,
      products: 3450,
      revenue: 4200000,
      growth: 5.2,
      strengths: ['Market Dominance', 'Distribution Network', 'Brand Trust'],
      weaknesses: ['Slow Innovation', 'Legacy Systems', 'High Overhead']
    }
  ]

  const marketTrends: MarketTrend[] = [
    {
      category: 'AI & Machine Learning',
      growth: 34.7,
      demand: 'High',
      seasonality: 'Year-round',
      emerging: true
    },
    {
      category: 'Sustainable Products',
      growth: 28.9,
      demand: 'High',
      seasonality: 'Spring/Summer peak',
      emerging: true
    },
    {
      category: 'Remote Work Tools',
      growth: 22.3,
      demand: 'Medium',
      seasonality: 'Q4 peak',
      emerging: false
    },
    {
      category: 'Health & Wellness',
      growth: 19.8,
      demand: 'High',
      seasonality: 'January peak',
      emerging: true
    },
    {
      category: 'Smart Home Devices',
      growth: 16.4,
      demand: 'Medium',
      seasonality: 'Holiday peak',
      emerging: false
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

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'Low':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Low':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300"></div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Intelligence</h1>
          <p className="text-gray-600">AI-powered market analysis and competitive intelligence.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-gray-600">Keywords Analyzed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">23.4%</div>
                <div className="text-sm text-gray-600">Market Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">$2.84</div>
                <div className="text-sm text-gray-600">Avg CPC</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lightbulb className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-gray-600">Opportunities Found</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keywords">Keyword Intelligence</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-6">
          {/* Keyword Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search keywords..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="health">Health & Beauty</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Intelligence Table */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Intelligence Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordIntelligence.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{keyword.keyword}</h3>
                        {getTrendIcon(keyword.trend)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Volume: {keyword.searchVolume.toLocaleString()}</span>
                        <span>CPC: ${keyword.cpc}</span>
                        <span>Products: {keyword.relatedProducts}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getCompetitionColor(keyword.competition)}>
                        {keyword.competition}
                      </Badge>
                      <Badge className={getOpportunityColor(keyword.opportunity)}>
                        {keyword.opportunity} Opportunity
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
              <CardTitle>Competitor Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competitorAnalysis.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{competitor.competitor}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {competitor.marketShare}% Market Share
                        </Badge>
                        <div className={`flex items-center space-x-1 ${
                          competitor.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {getTrendIcon(competitor.growth > 0 ? 'up' : 'down')}
                          <span className="font-medium">
                            {competitor.growth > 0 ? '+' : ''}{competitor.growth}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{competitor.products}</div>
                        <div className="text-sm text-gray-600">Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${(competitor.revenue / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{competitor.marketShare}%</div>
                        <div className="text-sm text-gray-600">Market Share</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{competitor.growth}%</div>
                        <div className="text-sm text-gray-600">Growth</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Weaknesses</h4>
                        <ul className="space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4 border-t mt-4">
                      <Button variant="outline" size="sm">
                        View Products
                      </Button>
                      <Button variant="outline" size="sm">
                        SWOT Analysis
                      </Button>
                      <Button variant="outline" size="sm">
                        Price Comparison
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends & Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{trend.category}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getDemandColor(trend.demand)}>
                            {trend.demand} Demand
                          </Badge>
                          {trend.emerging && (
                            <Badge className="bg-green-100 text-green-800">
                              Emerging
                            </Badge>
                          )}
                          <span className="text-sm text-gray-600">{trend.seasonality}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          trend.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trend.growth > 0 ? '+' : ''}{trend.growth}%
                        </div>
                        <div className="text-sm text-gray-600">Growth</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI & Machine Learning</span>
                    <span className="font-bold text-green-600">+34.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sustainable Products</span>
                    <span className="font-bold text-green-600">+28.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Remote Work Tools</span>
                    <span className="font-bold text-green-600">+22.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '56%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Health & Wellness</span>
                    <span className="font-bold text-green-600">+19.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      insight: 'Wireless earbuds market expected to grow 45% YoY',
                      confidence: 92,
                      impact: 'High',
                      type: 'trend'
                    },
                    {
                      insight: 'Competitor pricing 15% below market average',
                      confidence: 87,
                      impact: 'Medium',
                      type: 'opportunity'
                    },
                    {
                      insight: 'Seasonal demand peak in Q4 for electronics',
                      confidence: 95,
                      impact: 'High',
                      type: 'forecast'
                    },
                    {
                      insight: 'New market entry barrier lowered by 30%',
                      confidence: 78,
                      impact: 'Medium',
                      type: 'analysis'
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {item.type === 'trend' ? (
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                          ) : item.type === 'opportunity' ? (
                            <Lightbulb className="w-5 h-5 text-green-500" />
                          ) : item.type === 'forecast' ? (
                            <BarChart3 className="w-5 h-5 text-purple-500" />
                          ) : (
                            <Target className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{item.insight}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>Confidence: {item.confidence}%</span>
                            <Badge className={getOpportunityColor(item.impact)}>
                              {item.impact} Impact
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actionable Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium text-blue-900">Launch Product Line</h3>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">
                      Based on market analysis, launch sustainable electronics line targeting eco-conscious consumers.
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600">Est. ROI: 340%</span>
                      <Button size="sm" variant="outline">
                        Plan Launch
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <h3 className="font-medium text-green-900">Price Optimization</h3>
                    </div>
                    <p className="text-green-800 text-sm mb-3">
                      Adjust pricing strategy for wireless earbuds to match competitor positioning while maintaining margins.
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600">Potential revenue: +$45K</span>
                      <Button size="sm" variant="outline">
                        Optimize Pricing
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <h3 className="font-medium text-purple-900">Market Expansion</h3>
                    </div>
                    <p className="text-purple-800 text-sm mb-3">
                      Expand into health & wellness category with 28% growth potential and low competition.
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-purple-600">Market size: $2.1B</span>
                      <Button size="sm" variant="outline">
                        Explore Market
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}