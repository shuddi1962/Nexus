'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Eye,
  MousePointer,
  Mail,
  MessageSquare,
  Calendar,
  Download,
  Share,
  Filter,
  RefreshCw,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  CheckCircle,
  AlertTriangle,
  PieChart,
  LineChart,
  Activity,
  Settings
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: any
  color: string
}

interface ReportData {
  period: string
  metrics: {
    users: number
    revenue: number
    conversions: number
    engagement: number
    satisfaction: number
  }
  channels: {
    name: string
    users: number
    revenue: number
    conversion: number
  }[]
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedReport, setSelectedReport] = useState('overview')

  // Mock data for comprehensive reporting
  const metrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: '12,847',
      change: 12.5,
      trend: 'up',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Revenue',
      value: '$89,432',
      change: 8.2,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Conversions',
      value: '2,156',
      change: -2.1,
      trend: 'down',
      icon: Target,
      color: 'text-purple-500'
    },
    {
      title: 'Engagement Rate',
      value: '67.8%',
      change: 5.3,
      trend: 'up',
      icon: Activity,
      color: 'text-orange-500'
    },
    {
      title: 'Page Views',
      value: '156,789',
      change: 15.7,
      trend: 'up',
      icon: Eye,
      color: 'text-indigo-500'
    },
    {
      title: 'Avg. Session',
      value: '4m 32s',
      change: -0.8,
      trend: 'down',
      icon: Clock,
      color: 'text-red-500'
    }
  ]

  const reportData: ReportData[] = [
    {
      period: 'Jan 2026',
      metrics: {
        users: 8543,
        revenue: 45230,
        conversions: 1234,
        engagement: 68.5,
        satisfaction: 4.6
      },
      channels: [
        { name: 'Organic Search', users: 3200, revenue: 18500, conversion: 12.3 },
        { name: 'Paid Ads', users: 2100, revenue: 12400, conversion: 8.9 },
        { name: 'Social Media', users: 1800, revenue: 8900, conversion: 15.2 },
        { name: 'Email', users: 1200, revenue: 4300, conversion: 22.1 },
        { name: 'Direct', users: 243, revenue: 1130, conversion: 18.7 }
      ]
    },
    {
      period: 'Feb 2026',
      metrics: {
        users: 9234,
        revenue: 52100,
        conversions: 1456,
        engagement: 71.2,
        satisfaction: 4.7
      },
      channels: [
        { name: 'Organic Search', users: 3800, revenue: 22100, conversion: 13.1 },
        { name: 'Paid Ads', users: 2400, revenue: 14200, conversion: 9.2 },
        { name: 'Social Media', users: 2100, revenue: 10200, conversion: 16.8 },
        { name: 'Email', users: 1400, revenue: 5200, conversion: 24.3 },
        { name: 'Direct', users: 534, revenue: 2400, conversion: 19.5 }
      ]
    },
    {
      period: 'Mar 2026',
      metrics: {
        users: 10890,
        revenue: 63400,
        conversions: 1789,
        engagement: 69.8,
        satisfaction: 4.5
      },
      channels: [
        { name: 'Organic Search', users: 4200, revenue: 25300, conversion: 11.8 },
        { name: 'Paid Ads', users: 2800, revenue: 16800, conversion: 9.8 },
        { name: 'Social Media', users: 2400, revenue: 11800, conversion: 17.4 },
        { name: 'Email', users: 1600, revenue: 6300, conversion: 25.6 },
        { name: 'Direct', users: 890, revenue: 3200, conversion: 20.1 }
      ]
    },
    {
      period: 'Apr 2026',
      metrics: {
        users: 12847,
        revenue: 89432,
        conversions: 2156,
        engagement: 67.8,
        satisfaction: 4.4
      },
      channels: [
        { name: 'Organic Search', users: 4800, revenue: 32100, conversion: 13.5 },
        { name: 'Paid Ads', users: 3200, revenue: 24100, conversion: 10.1 },
        { name: 'Social Media', users: 2800, revenue: 16800, conversion: 18.2 },
        { name: 'Email', users: 1900, revenue: 9200, conversion: 26.8 },
        { name: 'Direct', users: 1147, revenue: 7232, conversion: 21.3 }
      ]
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const exportReport = (format: string) => {
    // In real app, this would trigger a download
    console.log(`Exporting report in ${format} format`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 text-sm sm:text-base">Comprehensive business intelligence and performance insights.</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
                {getTrendIcon(metric.trend)}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <div className={`flex items-center text-sm ${
                  metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.period}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{data.metrics.users.toLocaleString()} users</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(data.metrics.users / 15000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.period}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{formatCurrency(data.metrics.revenue)}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(data.metrics.revenue / 100000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData[reportData.length - 1].channels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-gray-900">{channel.name}</div>
                        <div className="text-sm text-gray-600">{channel.users.toLocaleString()} users</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-green-600">{formatCurrency(channel.revenue)}</div>
                        <div className="text-gray-600">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-purple-600">{channel.conversion}%</div>
                        <div className="text-gray-600">Conversion</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">12,847</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <User className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">8,923</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">+15.2%</div>
                    <div className="text-sm text-gray-600">Growth Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">By Device</h4>
                  <div className="space-y-3">
                    {[
                      { device: 'Desktop', percentage: 65, count: 8345 },
                      { device: 'Mobile', percentage: 28, count: 3596 },
                      { device: 'Tablet', percentage: 7, count: 906 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.device}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">By Location</h4>
                  <div className="space-y-3">
                    {[
                      { location: 'United States', percentage: 42, count: 5393 },
                      { location: 'United Kingdom', percentage: 18, count: 2310 },
                      { location: 'Germany', percentage: 12, count: 1540 },
                      { location: 'Canada', percentage: 8, count: 1027 },
                      { location: 'Others', percentage: 20, count: 2577 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.location}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">$89,432</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">$41.50</div>
                    <div className="text-sm text-gray-600">Avg. Revenue Per User</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">18.7%</div>
                    <div className="text-sm text-gray-600">Revenue Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Product/Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { product: 'NEXUS Pro Plan', revenue: 45230, percentage: 50.6, growth: 12.3 },
                  { product: 'NEXUS Agency Plan', revenue: 23410, percentage: 26.2, growth: 8.7 },
                  { product: 'Content Creation Add-on', revenue: 12340, percentage: 13.8, growth: 24.5 },
                  { product: 'White-label Service', revenue: 5670, percentage: 6.3, growth: -2.1 },
                  { product: 'Consulting Services', revenue: 1782, percentage: 2.0, growth: 15.8 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.product}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatCurrency(item.revenue)} • {item.percentage}% of total
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className={`text-sm font-medium ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                      <div className="w-24">
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Mail className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">94.2%</div>
                    <div className="text-sm text-gray-600">Email Open Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MousePointer className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">23.8%</div>
                    <div className="text-sm text-gray-600">Click Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">8.9%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-orange-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">$2.84</div>
                    <div className="text-sm text-gray-600">Cost per Acquisition</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Q1 Product Launch', spent: 15420, impressions: 245000, clicks: 8200, conversions: 328, roi: 3.2 },
                  { name: 'Lead Gen Campaign', spent: 8900, impressions: 167000, clicks: 5800, conversions: 203, roi: 2.8 },
                  { name: 'Brand Awareness', spent: 12300, impressions: 456000, clicks: 12400, conversions: 89, roi: 1.9 },
                  { name: 'Retargeting Ads', spent: 6750, impressions: 98000, clicks: 4200, conversions: 168, roi: 4.1 }
                ].map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">Spent: {formatCurrency(campaign.spent)}</span>
                        <span className={`font-medium ${campaign.roi > 3 ? 'text-green-600' : campaign.roi > 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          ROI: {campaign.roi}x
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{campaign.impressions.toLocaleString()}</div>
                        <div className="text-gray-600">Impressions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{campaign.clicks.toLocaleString()}</div>
                        <div className="text-gray-600">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-purple-600">{campaign.conversions}</div>
                        <div className="text-gray-600">Conversions</div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <Monitor className="w-8 h-8 text-blue-500 mr-3" />
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
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-gray-600">Active Issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Largest Contentful Paint (LCP)</span>
                    <span className="font-bold text-green-600">1.2s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-xs text-gray-600">Target: <2.5s</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>First Input Delay (FID)</span>
                    <span className="font-bold text-green-600">45ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <div className="text-xs text-gray-600">Target: <100ms</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cumulative Layout Shift (CLS)</span>
                    <span className="font-bold text-green-600">0.05</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <div className="text-xs text-gray-600">Target: <0.1</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { component: 'API Response Time', status: 'healthy', value: '120ms', threshold: '<500ms' },
                  { component: 'Database Connections', status: 'healthy', value: '98%', threshold: '>95%' },
                  { component: 'Cache Hit Rate', status: 'warning', value: '87%', threshold: '>90%' },
                  { component: 'Error Rate', status: 'healthy', value: '0.02%', threshold: '<1%' },
                  { component: 'CPU Usage', status: 'healthy', value: '45%', threshold: '<80%' },
                  { component: 'Memory Usage', status: 'warning', value: '78%', threshold: '<80%' }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{metric.component}</div>
                      <div className="text-sm text-gray-600">Threshold: {metric.threshold}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        metric.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {metric.status}
                      </div>
                      <span className="font-medium">{metric.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={() => exportReport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}