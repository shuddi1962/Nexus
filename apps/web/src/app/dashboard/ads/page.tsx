'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
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
  AlertTriangle,
  CheckCircle,
  Settings,
  ExternalLink,
  Loader2,
  RefreshCw,
  BarChart3,
  Zap,
  CreditCard
} from 'lucide-react'


interface AdAccount {
  id: string
  platform: string
  account_id: string
  account_name: string
  status: string
  currency: string
  connected_at: string
  synced_at?: string
}

export default function AdsPage() {
  const { user } = useAuth()
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    fetchAdAccounts()
    fetchAnalytics()
  }, [])

  const fetchAdAccounts = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getAdAccounts()
      setAdAccounts(data)
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const data = await apiClient.getAdsAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const handleConnectAccount = async (platform: string) => {
    try {
      setConnecting(platform)
      const response = await apiClient.connectAdAccount(platform)

      // Open OAuth URL in new window
      window.open(response.oauth_url, '_blank', 'width=600,height=700')

      // Refresh accounts after a delay
      setTimeout(() => {
        fetchAdAccounts()
        setConnecting(null)
      }, 2000)
    } catch (error) {
      console.error('Error connecting ad account:', error)
      setConnecting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-nexus-green text-white'
      case 'disconnected':
        return 'bg-nexus-red text-white'
      case 'error':
        return 'bg-nexus-red text-white'
      case 'pending':
        return 'bg-nexus-amber text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'meta':
        return '📘'
      case 'google':
        return '🔍'
      case 'tiktok':
        return '🎵'
      case 'twitter':
        return '🐦'
      case 'linkedin':
        return '💼'
      case 'snapchat':
        return '👻'
      case 'pinterest':
        return '📌'
      case 'youtube':
        return '📺'
      case 'amazon':
        return '📦'
      default:
        return '📢'
    }
  }


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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Ads Manager</h1>
          <p className="text-nexus-text-secondary">Manage your advertising campaigns across all platforms.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-nexus-border hover:bg-nexus-bg-secondary"
            onClick={() => fetchAnalytics()}
          >
            <RefreshCw className="w-4 h-4 mr-2 text-nexus-blue" />
            Refresh Data
          </Button>
          <Button
            variant="outline"
            className="border-nexus-border hover:bg-nexus-bg-secondary"
          >
            <Settings className="w-4 h-4 mr-2 text-nexus-blue" />
            Settings
          </Button>
          <Link href="/dashboard/ads/campaigns">
          <Link href="/dashboard/ads/campaigns">
            <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
              <Plus className="w-4 h-4 mr-2" />
              Manage Campaigns
            </Button>
          </Link>
          </Link>
        </div>
      </div>

      {/* Account Connections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-nexus-border">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-nexus-bg-secondary rounded animate-pulse" />
                  <div className="h-4 bg-nexus-bg-secondary rounded w-20 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-nexus-bg-secondary rounded w-32 animate-pulse" />
                  <div className="h-4 bg-nexus-bg-secondary rounded w-24 animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-3 bg-nexus-bg-secondary rounded animate-pulse" />
                    <div className="h-3 bg-nexus-bg-secondary rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : adAccounts.length === 0 ? (
          // No accounts connected
          <Card className="border-nexus-border md:col-span-3">
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Ad Accounts Connected</h3>
              <p className="text-nexus-text-secondary mb-6">Connect your advertising accounts to start managing campaigns.</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Meta', 'Google', 'TikTok', 'Twitter', 'LinkedIn', 'Snapchat'].map((platform) => (
                  <Button
                    key={platform}
                    variant="outline"
                    className="border-nexus-border hover:bg-nexus-bg-secondary"
                    onClick={() => handleConnectAccount(platform.toLowerCase())}
                    disabled={connecting === platform.toLowerCase()}
                  >
                    {connecting === platform.toLowerCase() ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <span className="mr-2">{getPlatformIcon(platform.toLowerCase())}</span>
                    )}
                    Connect {platform}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          adAccounts.map((account) => (
            <Card key={account.id} className="border-nexus-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-nexus-text-primary">
                  <span className="text-lg mr-2">{getPlatformIcon(account.platform)}</span>
                  {account.platform}
                </CardTitle>
                <Badge className={getStatusColor(account.status)}>
                  {account.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-nexus-text-primary">{account.account_name}</p>
                    <p className="text-xs text-nexus-text-tertiary">ID: {account.account_id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-nexus-text-secondary">Currency</p>
                      <p className="font-semibold text-nexus-text-primary">{account.currency}</p>
                    </div>
                    <div>
                      <p className="text-nexus-text-secondary">Status</p>
                      <p className="font-semibold text-nexus-text-primary capitalize">{account.status}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-nexus-border">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-nexus-text-tertiary">Connected</span>
                      <span className="text-xs text-nexus-text-tertiary">
                        {new Date(account.connected_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border hover:bg-nexus-bg-secondary"
                    onClick={() => fetchAnalytics()}
                  >
                    <Eye className="w-4 h-4 mr-2 text-nexus-blue" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Overall Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-nexus-text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                ${analytics.spend?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-nexus-text-secondary">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-nexus-text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                {(analytics.impressions / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-nexus-text-secondary">
                Total reach
              </p>
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Click Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-nexus-text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                {analytics.ctr?.toFixed(2) || '0.00'}%
              </div>
              <p className="text-xs text-nexus-text-secondary">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>

          <Card className="border-nexus-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-primary">Conversions</CardTitle>
              <Target className="h-4 w-4 text-nexus-text-tertiary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text-primary">
                {analytics.conversions || 0}
              </div>
              <p className="text-xs text-nexus-text-secondary">
                Goal completions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Campaigns */}
      <Card className="border-nexus-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-nexus-text-primary">Campaign Performance</CardTitle>
          <Link href="/dashboard/ads/analytics">
            <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <BarChart3 className="w-4 h-4 mr-2 text-nexus-blue" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard/ads/rules">
            <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <Zap className="w-4 h-4 mr-2 text-nexus-violet" />
              Rules
            </Button>
          </Link>
          <Link href="/dashboard/ads/payments">
            <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <CreditCard className="w-4 h-4 mr-2 text-nexus-green" />
              Payments
            </Button>
          </Link>
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Settings className="w-4 h-4 mr-2 text-nexus-blue" />
            Settings
          </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Target className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Campaigns Yet</h3>
            <p className="text-nexus-text-secondary mb-6">
              Connect an ad account and create your first campaign to start advertising.
            </p>
            <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}