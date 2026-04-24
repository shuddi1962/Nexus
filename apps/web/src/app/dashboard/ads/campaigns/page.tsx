import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Play,
  Pause,
  Copy,
  Trash2,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target
} from 'lucide-react'

// Mock campaigns data
const campaigns = [
  {
    id: '1',
    name: 'Q2 Product Launch',
    platform: 'Meta',
    objective: 'Conversions',
    status: 'active',
    budget: 5000,
    spent: 2340.50,
    impressions: 450000,
    clicks: 2850,
    ctr: 0.63,
    cpc: 0.82,
    conversions: 45,
    costPerConversion: 52.01,
    roas: 3.2,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    performance: 'excellent',
  },
  {
    id: '2',
    name: 'Brand Awareness 2026',
    platform: 'Google',
    objective: 'Awareness',
    status: 'active',
    budget: 3000,
    spent: 1850.75,
    impressions: 320000,
    clicks: 2100,
    ctr: 0.66,
    cpc: 0.88,
    conversions: 28,
    costPerConversion: 66.10,
    roas: 2.8,
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    performance: 'good',
  },
  {
    id: '3',
    name: 'Holiday Sale',
    platform: 'Meta',
    objective: 'Sales',
    status: 'paused',
    budget: 8000,
    spent: 4560.25,
    impressions: 780000,
    clicks: 4200,
    ctr: 0.54,
    cpc: 1.09,
    conversions: 89,
    costPerConversion: 51.24,
    roas: 4.1,
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    performance: 'excellent',
  },
  {
    id: '4',
    name: 'Retargeting Campaign',
    platform: 'TikTok',
    objective: 'Traffic',
    status: 'draft',
    budget: 2000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    conversions: 0,
    costPerConversion: 0,
    roas: 0,
    startDate: null,
    endDate: null,
    performance: 'unknown',
  },
]

export default function CampaignsPage() {
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCampaigns = campaigns.filter(campaign =>
    statusFilter === 'all' || campaign.status === statusFilter
  )

  const toggleCampaign = (campaignId: string) => {
    setSelectedCampaigns(prev =>
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    )
  }

  const toggleAllCampaigns = () => {
    setSelectedCampaigns(
      selectedCampaigns.length === filteredCampaigns.length
        ? []
        : filteredCampaigns.map(campaign => campaign.id)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Meta':
        return '📘'
      case 'Google':
        return '🔍'
      case 'TikTok':
        return '🎵'
      default:
        return '📢'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage and optimize your advertising campaigns.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCampaigns.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedCampaigns.length} campaign{selectedCampaigns.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                      onChange={toggleAllCampaigns}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={() => toggleCampaign(campaign.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-3">{getPlatformIcon(campaign.platform)}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {campaign.objective} • {campaign.platform}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="w-24 h-1" />
                        <div className="text-xs text-gray-500">
                          {((campaign.spent / campaign.budget) * 100).toFixed(0)}% used
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">CTR</div>
                          <div className={getPerformanceColor(campaign.performance)}>
                            {campaign.ctr}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">CPC</div>
                          <div className={getPerformanceColor(campaign.performance)}>
                            ${campaign.cpc}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Conv.</div>
                          <div className="font-medium text-gray-900">
                            {campaign.conversions}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">ROAS</div>
                          <div className={getPerformanceColor(campaign.performance)}>
                            {campaign.roas}x
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {filteredCampaigns.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MousePointer className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {(campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">Avg CTR</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Conversions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}