'use client'

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
  Users,
  MapPin,
  Target,
  Eye,
  MousePointer
} from 'lucide-react'

// Mock ad sets data
const adSets = [
  {
    id: '1',
    name: 'US Desktop Users 25-45',
    campaign: 'Q2 Product Launch',
    platform: 'Meta',
    status: 'active',
    budget: 1500,
    spent: 780.50,
    impressions: 145000,
    clicks: 950,
    ctr: 0.66,
    cpc: 0.82,
    conversions: 18,
    reach: 125000,
    frequency: 1.16,
    targeting: {
      location: 'United States',
      age: '25-45',
      device: 'Desktop',
      interests: ['Technology', 'Business'],
    },
  },
  {
    id: '2',
    name: 'Mobile Retargeting',
    campaign: 'Q2 Product Launch',
    platform: 'Meta',
    status: 'active',
    budget: 1200,
    spent: 650.25,
    impressions: 98000,
    clicks: 720,
    ctr: 0.73,
    cpc: 0.90,
    conversions: 15,
    reach: 85000,
    frequency: 1.15,
    targeting: {
      location: 'United States',
      device: 'Mobile',
      retargeting: 'Website visitors',
    },
  },
  {
    id: '3',
    name: 'Google Search - Brand Terms',
    campaign: 'Brand Awareness 2026',
    platform: 'Google',
    status: 'active',
    budget: 800,
    spent: 420.75,
    impressions: 75000,
    clicks: 580,
    ctr: 0.77,
    cpc: 0.73,
    conversions: 12,
    reach: 68000,
    frequency: 1.10,
    targeting: {
      location: 'United States',
      keywords: ['nexus platform', 'business software'],
      matchType: 'Exact',
    },
  },
  {
    id: '4',
    name: 'Lookalike Audience',
    campaign: 'Holiday Sale',
    platform: 'Meta',
    status: 'paused',
    budget: 2000,
    spent: 1200.00,
    impressions: 200000,
    clicks: 1400,
    ctr: 0.70,
    cpc: 0.86,
    conversions: 35,
    reach: 180000,
    frequency: 1.11,
    targeting: {
      location: 'United States',
      audience: 'Lookalike - Past purchasers',
      interests: ['E-commerce', 'Shopping'],
    },
  },
]

export default function AdSetsPage() {
  const [selectedAdSets, setSelectedAdSets] = useState<string[]>([])

  const toggleAdSet = (adSetId: string) => {
    setSelectedAdSets(prev =>
      prev.includes(adSetId)
        ? prev.filter(id => id !== adSetId)
        : [...prev, adSetId]
    )
  }

  const toggleAllAdSets = () => {
    setSelectedAdSets(
      selectedAdSets.length === adSets.length
        ? []
        : adSets.map(adSet => adSet.id)
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
          <h1 className="text-2xl font-bold text-gray-900">Ad Sets</h1>
          <p className="text-gray-600">Manage your ad targeting and audience settings.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Ad Set
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search ad sets..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Campaigns</option>
                <option>Q2 Product Launch</option>
                <option>Brand Awareness 2026</option>
                <option>Holiday Sale</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Platforms</option>
                <option>Meta</option>
                <option>Google</option>
                <option>TikTok</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAdSets.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedAdSets.length} ad set{selectedAdSets.length > 1 ? 's' : ''} selected
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
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ad Sets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adSets.map((adSet) => (
          <Card key={adSet.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedAdSets.includes(adSet.id)}
                    onChange={() => toggleAdSet(adSet.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="text-lg">{getPlatformIcon(adSet.platform)}</div>
                  <div>
                    <CardTitle className="text-lg">{adSet.name}</CardTitle>
                    <p className="text-sm text-gray-600">{adSet.campaign}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(adSet.status)}>
                  {adSet.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Budget Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">
                    {formatCurrency(adSet.spent)} / {formatCurrency(adSet.budget)}
                  </span>
                </div>
                <Progress value={(adSet.spent / adSet.budget) * 100} className="h-2" />
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Impressions</div>
                  <div className="font-semibold">{adSet.impressions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Clicks</div>
                  <div className="font-semibold">{adSet.clicks}</div>
                </div>
                <div>
                  <div className="text-gray-600">CTR</div>
                  <div className="font-semibold">{adSet.ctr}%</div>
                </div>
                <div>
                  <div className="text-gray-600">CPC</div>
                  <div className="font-semibold">${adSet.cpc}</div>
                </div>
                <div>
                  <div className="text-gray-600">Reach</div>
                  <div className="font-semibold">{adSet.reach.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Frequency</div>
                  <div className="font-semibold">{adSet.frequency}x</div>
                </div>
              </div>

              {/* Targeting Summary */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Targeting</h4>
                <div className="flex flex-wrap gap-2">
                  {adSet.targeting.location && (
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {adSet.targeting.location}
                    </Badge>
                  )}
                  {adSet.targeting.age && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Age {adSet.targeting.age}
                    </Badge>
                  )}
                  {adSet.targeting.device && (
                    <Badge variant="outline" className="text-xs">
                      📱 {adSet.targeting.device}
                    </Badge>
                  )}
                  {adSet.targeting.retargeting && (
                    <Badge variant="outline" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      {adSet.targeting.retargeting}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Ads
                  </Button>
                  <Button variant="outline" size="sm">
                    <MousePointer className="w-4 h-4 mr-2" />
                    Performance
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{adSets.filter(s => s.status === 'active').length}</div>
                <div className="text-sm text-gray-600">Active Ad Sets</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {(adSets.reduce((sum, s) => sum + s.impressions, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Impressions</div>
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
                  {(adSets.reduce((sum, s) => sum + s.ctr, 0) / adSets.length).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">Average CTR</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {(adSets.reduce((sum, s) => sum + s.reach, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Reach</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}