'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Zap,
  AlertTriangle
} from 'lucide-react'

// Mock analytics data
const analyticsData = {
  overview: {
    totalSpend: 45230.50,
    totalImpressions: 4250000,
    totalClicks: 22150,
    totalConversions: 542,
    ctr: 0.52,
    cpc: 2.04,
    cpa: 83.46,
    roas: 3.8,
  },
  performanceByPlatform: [
    {
      platform: 'Meta',
      spend: 22150.25,
      impressions: 2100000,
      clicks: 11500,
      conversions: 280,
      ctr: 0.55,
      cpc: 1.93,
      roas: 4.2,
      trend: 'up',
    },
    {
      platform: 'Google',
      spend: 15680.75,
      impressions: 1500000,
      clicks: 7800,
      conversions: 195,
      ctr: 0.52,
      cpc: 2.01,
      roas: 3.5,
      trend: 'up',
    },
    {
      platform: 'TikTok',
      spend: 7399.50,
      impressions: 650000,
      clicks: 2850,
      conversions: 67,
      ctr: 0.44,
      cpc: 2.60,
      roas: 3.2,
      trend: 'down',
    },
  ],
  campaignPerformance: [
    {
      name: 'Q2 Product Launch',
      platform: 'Meta',
      spend: 12500,
      impressions: 950000,
      clicks: 5200,
      conversions: 125,
      ctr: 0.55,
      cpc: 2.40,
      roas: 4.8,
      status: 'excellent',
    },
    {
      name: 'Brand Awareness 2026',
      platform: 'Google',
      spend: 8900,
      impressions: 720000,
      clicks: 3800,
      conversions: 95,
      ctr: 0.53,
      cpc: 2.34,
      roas: 3.6,
      status: 'good',
    },
    {
      name: 'Holiday Sale',
      platform: 'Meta',
      spend: 15600,
      impressions: 1250000,
      clicks: 6800,
      conversions: 165,
      ctr: 0.54,
      cpc: 2.29,
      roas: 4.2,
      status: 'excellent',
    },
  ],
  timeSeriesData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    spend: [8500, 9200, 11100, 12800, 14200, 15600],
    impressions: [650000, 720000, 890000, 1020000, 1180000, 1350000],
    clicks: [3250, 3600, 4450, 5100, 5900, 6750],
    conversions: [65, 72, 89, 102, 118, 135],
  },
  topPerformingCreatives: [
    {
      name: 'Hero Image - Product Demo',
      type: 'image',
      impressions: 125000,
      clicks: 875,
      ctr: 0.70,
      conversions: 28,
    },
    {
      name: 'Video - Customer Testimonial',
      type: 'video',
      impressions: 98000,
      clicks: 637,
      ctr: 0.65,
      conversions: 22,
    },
    {
      name: 'Carousel - Feature Showcase',
      type: 'carousel',
      impressions: 156000,
      clicks: 1014,
      ctr: 0.65,
      conversions: 31,
    },
  ],
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'average':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600">Comprehensive insights into your advertising performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="meta">Meta</option>
            <option value="google">Google</option>
            <option value="tiktok">TikTok</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalSpend)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalImpressions)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              +8.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.ctr}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              +0.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.roas}x</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              +0.3x from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Platform */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.performanceByPlatform.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {platform.platform === 'Meta' ? '📘' :
                     platform.platform === 'Google' ? '🔍' : '🎵'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{platform.platform}</h3>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(platform.spend)} spent
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div>
                    <div className="text-gray-600">Impressions</div>
                    <div className="font-semibold">{formatNumber(platform.impressions)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Clicks</div>
                    <div className="font-semibold">{platform.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">CTR</div>
                    <div className="font-semibold">{platform.ctr}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">ROAS</div>
                    <div className="font-semibold flex items-center">
                      {platform.roas}x
                      {getTrendIcon(platform.trend)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.campaignPerformance.map((campaign, index) => (
                <div key={campaign.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.platform}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(campaign.spend)}</div>
                    <div className={`text-sm ${getStatusColor(campaign.status)}`}>
                      ROAS: {campaign.roas}x
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Creatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPerformingCreatives.map((creative, index) => (
                <div key={creative.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-600">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-1">{creative.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{creative.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{creative.ctr}% CTR</div>
                    <div className="text-sm text-gray-600">
                      {creative.conversions} conv.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Trends (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Monthly Spend</h3>
              <div className="space-y-1">
                {analyticsData.timeSeriesData.labels.map((month, index) => (
                  <div key={month} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{month}</span>
                    <span className="font-medium">{formatCurrency(analyticsData.timeSeriesData.spend[index])}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Impressions</h3>
              <div className="space-y-1">
                {analyticsData.timeSeriesData.labels.map((month, index) => (
                  <div key={month} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{month}</span>
                    <span className="font-medium">{formatNumber(analyticsData.timeSeriesData.impressions[index])}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Clicks</h3>
              <div className="space-y-1">
                {analyticsData.timeSeriesData.labels.map((month, index) => (
                  <div key={month} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{month}</span>
                    <span className="font-medium">{analyticsData.timeSeriesData.clicks[index].toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Conversions</h3>
              <div className="space-y-1">
                {analyticsData.timeSeriesData.labels.map((month, index) => (
                  <div key={month} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{month}</span>
                    <span className="font-medium">{analyticsData.timeSeriesData.conversions[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Performance Opportunity</h3>
                    <p className="text-sm text-green-700">
                      Q2 Product Launch campaign is performing 25% above target. Consider increasing budget by $2,500.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">Optimization Suggestion</h3>
                    <p className="text-sm text-blue-700">
                      TikTok campaign CTR is 12% below average. Try updating creative with trending audio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Budget Alert</h3>
                    <p className="text-sm text-yellow-700">
                      Holiday Sale campaign has spent 78% of monthly budget. Monitor closely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-purple-800">Audience Insight</h3>
                    <p className="text-sm text-purple-700">
                      25-34 age group shows 40% higher conversion rate. Consider audience expansion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}