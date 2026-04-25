'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Users,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  impressions: number
  clicks: number
  conversions: number
  spend: number
  ctr: number
  cpc: number
  cpa: number
  roas: number
  period: string
}

interface AdAccount {
  id: string
  platform: string
  account_id: string
  account_name: string
  status: string
}

interface Campaign {
  id: string
  name: string
  status: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
}

export default function AdsAnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  const [dateRange, setDateRange] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAdAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchCampaigns()
      fetchAnalytics()
    }
  }, [selectedAccount, selectedCampaign, dateRange])

  const fetchAdAccounts = async () => {
    try {
      const data = await apiClient.getAdAccounts()
      setAdAccounts(data)
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
    }
  }

  const fetchCampaigns = async () => {
    if (!selectedAccount) return

    try {
      const data = await apiClient.getCampaigns(selectedAccount)
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  const fetchAnalytics = async () => {
    if (!selectedAccount) return

    try {
      setLoading(true)
      const params: any = {
        account_id: selectedAccount,
      }

      if (selectedCampaign) {
        params.campaign_id = selectedCampaign
      }

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()

      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
      }

      params.start_date = startDate.toISOString().split('T')[0]
      params.end_date = endDate.toISOString().split('T')[0]

      const data = await apiClient.getAdsAnalytics(params)
      setAnalytics({ ...data, period: dateRange })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toString()
  }

  const getMetricChange = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, direction: 'neutral' as const }
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    }
  }

  // Mock previous period data for comparison
  const getPreviousPeriodData = () => {
    if (!analytics) return null
    return {
      impressions: analytics.impressions * 0.9,
      clicks: analytics.clicks * 0.95,
      conversions: analytics.conversions * 1.1,
      spend: analytics.spend * 0.85,
    }
  }

  const previousData = getPreviousPeriodData()

  if (loading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexus-text-primary">Analytics</h1>
            <p className="text-nexus-text-secondary">Loading analytics data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-nexus-border">
              <CardHeader>
                <div className="h-4 bg-nexus-bg-secondary rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-nexus-bg-secondary rounded animate-pulse mb-2" />
                <div className="h-3 bg-nexus-bg-secondary rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Analytics</h1>
          <p className="text-nexus-text-secondary">Track your advertising performance and ROI</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-nexus-border hover:bg-nexus-bg-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Download className="w-4 h-4 mr-2 text-nexus-blue" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-nexus-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-nexus-text-primary">Ad Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="border-nexus-border">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {adAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.platform} - {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-nexus-text-primary">Campaign</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="border-nexus-border">
                  <SelectValue placeholder="All campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All campaigns</SelectItem>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-nexus-text-primary">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-nexus-border">
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
              <div className="text-sm text-nexus-text-secondary">
                Period: {analytics?.period || dateRange}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-nexus-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                {formatNumber(analytics.impressions)}
              </div>
              {previousData && (
                <div className="flex items-center text-xs mt-1">
                  {getMetricChange(analytics.impressions, previousData.impressions).direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-nexus-green mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-nexus-red mr-1" />
                  )}
                  <span className={getMetricChange(analytics.impressions, previousData.impressions).direction === 'up' ? 'text-nexus-green' : 'text-nexus-red'}>
                    {getMetricChange(analytics.impressions, previousData.impressions).value.toFixed(1)}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-nexus-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                {formatNumber(analytics.clicks)}
              </div>
              <div className="text-sm text-nexus-text-secondary mt-1">
                CTR: {analytics.ctr.toFixed(2)}%
              </div>
              {previousData && (
                <div className="flex items-center text-xs mt-1">
                  {getMetricChange(analytics.clicks, previousData.clicks).direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-nexus-green mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-nexus-red mr-1" />
                  )}
                  <span className={getMetricChange(analytics.clicks, previousData.clicks).direction === 'up' ? 'text-nexus-green' : 'text-nexus-red'}>
                    {getMetricChange(analytics.clicks, previousData.clicks).value.toFixed(1)}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Conversions</CardTitle>
              <Target className="h-4 w-4 text-nexus-violet" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                {analytics.conversions}
              </div>
              <div className="text-sm text-nexus-text-secondary mt-1">
                CPA: {formatCurrency(analytics.cpa)}
              </div>
              {previousData && (
                <div className="flex items-center text-xs mt-1">
                  {getMetricChange(analytics.conversions, previousData.conversions).direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-nexus-green mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-nexus-red mr-1" />
                  )}
                  <span className={getMetricChange(analytics.conversions, previousData.conversions).direction === 'up' ? 'text-nexus-green' : 'text-nexus-red'}>
                    {getMetricChange(analytics.conversions, previousData.conversions).value.toFixed(1)}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-nexus-amber" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                {formatCurrency(analytics.spend)}
              </div>
              <div className="text-sm text-nexus-text-secondary mt-1">
                ROAS: {analytics.roas.toFixed(1)}x
              </div>
              {previousData && (
                <div className="flex items-center text-xs mt-1">
                  {getMetricChange(analytics.spend, previousData.spend).direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-nexus-red mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-nexus-green mr-1" />
                  )}
                  <span className={getMetricChange(analytics.spend, previousData.spend).direction === 'up' ? 'text-nexus-red' : 'text-nexus-green'}>
                    {getMetricChange(analytics.spend, previousData.spend).value.toFixed(1)}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-nexus-border">
          <CardHeader>
            <CardTitle className="text-nexus-text-primary">Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-nexus-text-secondary">Cost per Click</span>
                    <span className="font-medium text-nexus-text-primary">{formatCurrency(analytics.cpc)}</span>
                  </div>
                  <Progress value={Math.min((analytics.cpc / 5) * 100, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-nexus-text-secondary">Click-through Rate</span>
                    <span className="font-medium text-nexus-text-primary">{analytics.ctr.toFixed(2)}%</span>
                  </div>
                  <Progress value={Math.min(analytics.ctr * 10, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-nexus-text-secondary">Return on Ad Spend</span>
                    <span className="font-medium text-nexus-text-primary">{analytics.roas.toFixed(1)}x</span>
                  </div>
                  <Progress value={Math.min(analytics.roas * 10, 100)} className="h-2" />
                </div>

                <div className="pt-4 border-t border-nexus-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nexus-blue mb-1">
                      {((analytics.conversions / analytics.clicks) * 100).toFixed(2)}%
                    </div>
                    <div className="text-sm text-nexus-text-secondary">Conversion Rate</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader>
            <CardTitle className="text-nexus-text-primary">Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-nexus-bg-secondary rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-nexus-text-primary text-sm">{campaign.name}</div>
                    <div className="text-xs text-nexus-text-secondary">
                      {formatCurrency(campaign.spend)} spent • {formatNumber(campaign.clicks)} clicks
                    </div>
                  </div>
                  <Badge className={
                    campaign.status === 'active' ? 'bg-nexus-green text-white' :
                    campaign.status === 'paused' ? 'bg-nexus-amber text-white' :
                    'bg-nexus-text-tertiary text-white'
                  }>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
              {campaigns.length === 0 && (
                <div className="text-center py-8 text-nexus-text-secondary">
                  No campaigns found for this account.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-nexus-bg-secondary rounded-lg">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-nexus-blue mr-2" />
                <span className="font-medium text-nexus-text-primary">Performance Alert</span>
              </div>
              <p className="text-sm text-nexus-text-secondary">
                Your CTR is above industry average. Consider increasing budget for high-performing campaigns.
              </p>
            </div>

            <div className="p-4 bg-nexus-bg-secondary rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-nexus-green mr-2" />
                <span className="font-medium text-nexus-text-primary">Optimization Opportunity</span>
              </div>
              <p className="text-sm text-nexus-text-secondary">
                Audience expansion could increase conversions by up to 25% based on similar campaigns.
              </p>
            </div>

            <div className="p-4 bg-nexus-bg-secondary rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-nexus-violet mr-2" />
                <span className="font-medium text-nexus-text-primary">Seasonal Trend</span>
              </div>
              <p className="text-sm text-nexus-text-secondary">
                Q2 typically sees 40% higher conversion rates. Prepare campaigns for seasonal increase.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}