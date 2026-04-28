'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Settings,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Zap,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'

const AD_PLATFORMS = [
  { id: 'meta', name: 'Meta (Facebook)', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', color: 'bg-blue-600' },
  { id: 'google', name: 'Google Ads', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', color: 'bg-red-500' },
  { id: 'tiktok', name: 'TikTok Ads', icon: 'M12.525 2.67c1.53-.72 2.69-1.94 3.12-3.5-1.3.72-2.77 1.16-4.26 1.42-1.23-1.24-2.93-1.94-4.72-1.94-3.67 0-6.67 2.95-6.67 6.67 0 .52.06 1.02.15 1.5-5.55-.27-10.5-2.94-10.5-10.73 0-2.32.8-4.48 2.2-6.08-.52-.14-1.07-.22-1.64-.22-1.27 0-2.45.5-3.32 1.3-1.17-.69-2.64-1.08-4.12-1.08-1.48 0-2.95.4-4.12 1.08-.87-.8-2.05-1.3-3.32-1.3-.57 0-1.12.08-1.64.22 1.4-1.6 2.2-3.76 2.2-6.08 0-7.79-4.95-10.46-10.5-10.73-1.14-.18-2.24-.34-3.37-.49.97.78 1.74 1.7 2.34 2.8C.64 3.24 0 4.87 0 6.67c0 1.03.19 2.02.5 2.95 1.94.7 3.73 1.7 5.08 3.04-.55-.2-1.13-.32-1.74-.32-.44 0-.86.08-1.26.22.2.97.5 1.9.98 2.74-.7.17-1.43.27-2.2.27-.54 0-1.05-.06-1.54-.18.83.96 1.78 1.74 2.85 2.42 1.28.8 2.7 1.36 4.2 1.6-.68.57-1.45 1.04-2.25 1.38.94.34 1.92.53 2.94.53 5.52 0 8.54-4.57 8.54-8.54 0-.13 0-.25-.01-.38.73-.53 1.36-1.15 1.83-1.88z', color: 'bg-black' },
  { id: 'linkedin', name: 'LinkedIn Ads', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', color: 'bg-blue-700' },
  { id: 'snapchat', name: 'Snapchat Ads', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', color: 'bg-yellow-500' },
  { id: 'pinterest', name: 'Pinterest Ads', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', color: 'bg-red-600' },
]

const mockCampaigns = [
  { id: 1, name: 'Summer Sale 2026', platform: 'meta', status: 'active', budget: 2500, spent: 1890, impressions: 125000, clicks: 3200, conversions: 156, roas: 3.2 },
  { id: 2, name: 'Newsletter Q2', platform: 'google', status: 'active', budget: 500, spent: 320, impressions: 45000, clicks: 890, conversions: 45, roas: 2.8 },
  { id: 3, name: 'Product Launch', platform: 'tiktok', status: 'paused', budget: 5000, spent: 0, impressions: 0, clicks: 0, conversions: 0, roas: 0 },
]

const mockAccounts = [
  { id: 1, platform: 'meta', account_name: 'NEXUS Business', status: 'connected', currency: 'USD' },
  { id: 2, platform: 'google', account_name: 'NEXUS Ads', status: 'connected', currency: 'USD' },
]

const platformIcons: Record<string, string> = {
  meta: 'M',
  google: 'G',
  tiktok: 'T',
  linkedin: 'in',
  snapchat: 'S',
  pinterest: 'P',
}

export default function AdsPage() {
  const [connecting, setConnecting] = useState<string | null>(null)

  const platformColors: Record<string, string> = {
    meta: 'from-blue-500 to-blue-600',
    google: 'from-red-500 to-red-600',
    tiktok: 'from-slate-800 to-black',
    linkedin: 'from-blue-700 to-blue-800',
    snapchat: 'from-yellow-400 to-yellow-500',
    pinterest: 'from-red-600 to-red-700',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ads Manager</h1>
          <p className="text-slate-500 mt-1">Manage your advertising campaigns across all platforms.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <RefreshCw className="w-4 h-4 mr-2 text-blue-600" />
            Refresh
          </Button>
          <Link href="/dashboard/ads/campaigns">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                +12.5%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900">$8,540</div>
              <div className="text-sm text-slate-500">Total Spend (30d)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-50 rounded-xl">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                +8.3%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900">1.2M</div>
              <div className="text-sm text-slate-500">Impressions</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-pink-50 rounded-xl">
                <MousePointer className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                +5.2%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900">3.28%</div>
              <div className="text-sm text-slate-500">Click Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-green-50 rounded-xl">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                +15.7%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900">234</div>
              <div className="text-sm text-slate-500">Conversions</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Connected Accounts</h2>
          <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
            Add Account
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAccounts.map((account) => (
            <Card key={account.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-br",
                      platformColors[account.platform] || 'bg-slate-500'
                    )}>
                      {platformIcons[account.platform]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{account.account_name}</div>
                      <div className="text-sm text-slate-500 capitalize">{account.platform}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Connected</Badge>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{account.currency}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add new account card */}
          <Card className="border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[140px]">
              <div className="p-3 bg-slate-100 rounded-full mb-3">
                <Plus className="w-5 h-5 text-slate-400" />
              </div>
              <div className="font-medium text-slate-600">Connect Platform</div>
              <div className="text-sm text-slate-400">Add another ad account</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/dashboard/ads/analytics">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-slate-200 hover:bg-slate-50 hover:border-blue-300">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Analytics</span>
          </Button>
        </Link>
        <Link href="/dashboard/ads/audiences">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-slate-200 hover:bg-slate-50 hover:border-purple-300">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Audiences</span>
          </Button>
        </Link>
        <Link href="/dashboard/ads/rules">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-slate-200 hover:bg-slate-50 hover:border-amber-300">
            <Zap className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium">Rules</span>
          </Button>
        </Link>
        <Link href="/dashboard/ads/billing">
          <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 border-slate-200 hover:bg-slate-50 hover:border-green-300">
            <CreditCard className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Billing</span>
          </Button>
        </Link>
      </div>

      {/* Recent Campaigns */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-900">Recent Campaigns</CardTitle>
          <Link href="/dashboard/ads/campaigns">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </Link>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Spent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ROAS</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{campaign.name}</div>
                    <div className="text-sm text-slate-400">{campaign.conversions} conversions</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br",
                      platformColors[campaign.platform] || 'bg-slate-500'
                    )}>
                      {platformIcons[campaign.platform]}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn(
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">${campaign.budget.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-900 font-medium">${campaign.spent.toLocaleString()}</div>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "font-medium",
                      campaign.roas >= 3 ? 'text-green-600' : campaign.roas >= 2 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {campaign.roas}x
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}