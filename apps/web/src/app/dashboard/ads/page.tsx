import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  AlertTriangle,
  CheckCircle,
  Settings,
  ExternalLink
} from 'lucide-react'

// Mock ad account data
const adAccounts = [
  {
    id: '1',
    platform: 'Meta',
    accountId: '123456789',
    accountName: 'NEXUS Marketing',
    status: 'connected',
    balance: 2500.00,
    currency: 'USD',
    campaigns: 12,
    totalSpend: 15420.50,
    impressions: 2450000,
    clicks: 12850,
    conversions: 342,
  },
  {
    id: '2',
    platform: 'Google',
    accountId: '987654321',
    accountName: 'NEXUS Search Ads',
    status: 'connected',
    balance: 1800.00,
    currency: 'USD',
    campaigns: 8,
    totalSpend: 8750.25,
    impressions: 1800000,
    clicks: 9200,
    conversions: 198,
  },
  {
    id: '3',
    platform: 'TikTok',
    accountId: '456789123',
    accountName: 'NEXUS TikTok Ads',
    status: 'disconnected',
    balance: 0,
    currency: 'USD',
    campaigns: 0,
    totalSpend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
  },
]

// Mock campaign data
const recentCampaigns = [
  {
    id: '1',
    name: 'Q2 Product Launch',
    platform: 'Meta',
    status: 'active',
    budget: 5000,
    spent: 2340.50,
    impressions: 450000,
    clicks: 2850,
    ctr: 0.63,
    cpc: 0.82,
    conversions: 45,
    roas: 3.2,
  },
  {
    id: '2',
    name: 'Brand Awareness 2026',
    platform: 'Google',
    status: 'active',
    budget: 3000,
    spent: 1850.75,
    impressions: 320000,
    clicks: 2100,
    ctr: 0.66,
    cpc: 0.88,
    conversions: 28,
    roas: 2.8,
  },
  {
    id: '3',
    name: 'Holiday Sale',
    platform: 'Meta',
    status: 'paused',
    budget: 8000,
    spent: 4560.25,
    impressions: 780000,
    clicks: 4200,
    ctr: 0.54,
    cpc: 1.09,
    conversions: 89,
    roas: 4.1,
  },
]

export default function AdsPage() {
  const totalSpend = adAccounts.reduce((sum, account) => sum + account.totalSpend, 0)
  const totalImpressions = adAccounts.reduce((sum, account) => sum + account.impressions, 0)
  const totalClicks = adAccounts.reduce((sum, account) => sum + account.clicks, 0)
  const totalConversions = adAccounts.reduce((sum, account) => sum + account.conversions, 0)
  const overallCTR = totalClicks / totalImpressions * 100
  const overallCPC = totalSpend / totalClicks

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ads Manager</h1>
          <p className="text-gray-600">Manage your advertising campaigns across all platforms.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Account Connections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <span className="text-lg mr-2">{getPlatformIcon(account.platform)}</span>
                {account.platform}
              </CardTitle>
              <Badge
                variant={account.status === 'connected' ? 'default' : 'secondary'}
                className={account.status === 'connected' ? 'bg-green-100 text-green-800' : ''}
              >
                {account.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{account.accountName}</p>
                  <p className="text-xs text-gray-500">ID: {account.accountId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Balance</p>
                    <p className="font-semibold">${account.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Campaigns</p>
                    <p className="font-semibold">{account.campaigns}</p>
                  </div>
                </div>

                {account.status === 'connected' ? (
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open {account.platform}
                  </Button>
                ) : (
                  <Button size="sm" className="w-full">
                    Connect Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
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
            <div className="text-2xl font-bold">{(totalImpressions / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallCTR.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              +15.7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button variant="outline">
              View All Campaigns
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getPlatformIcon(campaign.platform)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.platform} • {campaign.status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="text-gray-600">Spent</p>
                    <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="w-16 h-1 mt-1" />
                  </div>
                  <div>
                    <p className="text-gray-600">CTR</p>
                    <p className="font-semibold">{campaign.ctr}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CPC</p>
                    <p className="font-semibold">${campaign.cpc}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ROAS</p>
                    <p className="font-semibold">{campaign.roas}x</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Daily Budget Utilization</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Campaign Performance</span>
                <span className="text-sm font-medium text-green-600">+12.5%</span>
              </div>
              <Progress value={85} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-medium text-green-600">+8.3%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alerts & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Budget Alert</p>
                  <p className="text-xs text-yellow-700">Q2 Product Launch campaign is 85% through budget</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Performance Boost</p>
                  <p className="text-xs text-blue-700">Holiday Sale campaign exceeded ROAS target by 25%</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Optimization Complete</p>
                  <p className="text-xs text-green-700">AI recommendations applied to 3 campaigns</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}