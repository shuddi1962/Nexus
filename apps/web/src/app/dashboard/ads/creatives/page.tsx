'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Image,
  Video,
  FileText,
  Upload,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react'

interface Creative {
  id: string
  name: string
  type: 'image' | 'video' | 'carousel' | 'text'
  platform: string
  campaign_id?: string
  status: 'active' | 'draft' | 'archived'
  format: string
  dimensions?: string
  file_size?: number
  url?: string
  content?: any
  performance: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
  }
  tags: string[]
  created_at: string
}

export default function CreativesPage() {
  const { user } = useAuth()
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAdAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchCreatives()
    }
  }, [selectedAccount, selectedType, selectedStatus])

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

  const fetchCreatives = async () => {
    if (!selectedAccount) return

    try {
      setLoading(true)
      const params: any = {}

      if (selectedType) params.type = selectedType
      if (selectedStatus) params.status = selectedStatus

      const data = await apiClient.getCreatives(selectedAccount, params)
      setCreatives(data.creatives || [])
    } catch (error) {
      console.error('Error fetching creatives:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCreatives()
  }

  const filteredCreatives = creatives.filter(creative =>
    creative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creative.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleCreative = (creativeId: string) => {
    setSelectedCreatives(prev =>
      prev.includes(creativeId)
        ? prev.filter(id => id !== creativeId)
        : [...prev, creativeId]
    )
  }

  const toggleAllCreatives = () => {
    setSelectedCreatives(
      selectedCreatives.length === creatives.length
        ? []
        : creatives.map(creative => creative.id)
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'carousel':
        return <Image className="w-5 h-5" />
      case 'text':
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && !creatives.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexus-text-primary">Creative Library</h1>
            <p className="text-nexus-text-secondary">Loading creatives...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Creative Library</h1>
          <p className="text-nexus-text-secondary">Manage your ad creatives, images, videos, and text content.</p>
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
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="border-nexus-border hover:bg-nexus-bg-secondary">
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Creative
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-nexus-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary h-4 w-4" />
                <Input
                  placeholder="Search creatives..."
                  className="pl-10 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-40 border-nexus-border">
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32 border-nexus-border">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 border-nexus-border">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCreatives.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedCreatives.length} creative{selectedCreatives.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
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

      {/* Creatives Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreatives.map((creative) => (
            <Card key={creative.id} className="hover:shadow-lg transition-shadow border-nexus-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCreatives.includes(creative.id)}
                      onChange={() => toggleCreative(creative.id)}
                      className="rounded border-nexus-border"
                    />
                    <div className="text-nexus-text-secondary">{getTypeIcon(creative.type)}</div>
                    <div className="text-lg">{getPlatformIcon(creative.platform)}</div>
                  </div>
                  <Badge className={getStatusColor(creative.status)}>
                    {creative.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Creative Preview */}
                <div className="aspect-video bg-nexus-bg-secondary rounded-lg flex items-center justify-center">
                  {creative.type === 'image' || creative.type === 'carousel' ? (
                    <Image className="w-8 h-8 text-nexus-text-tertiary" />
                  ) : creative.type === 'video' ? (
                    <Video className="w-8 h-8 text-nexus-text-tertiary" />
                  ) : (
                    <FileText className="w-8 h-8 text-nexus-text-tertiary" />
                  )}
                </div>

                {/* Creative Info */}
                <div>
                  <h3 className="font-medium text-nexus-text-primary line-clamp-2">{creative.name}</h3>
                  <p className="text-sm text-nexus-text-secondary">{creative.format}</p>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-nexus-text-tertiary">Impressions</div>
                    <div className="font-semibold text-nexus-text-primary">{(creative.performance?.impressions ?? 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-nexus-text-tertiary">Clicks</div>
                    <div className="font-semibold text-nexus-text-primary">{creative.performance?.clicks ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-nexus-text-tertiary">CTR</div>
                    <div className="font-semibold text-nexus-text-primary">{creative.performance?.ctr?.toFixed(2) ?? '0.00'}%</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {creative.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs border-nexus-border">
                      {tag}
                    </Badge>
                  ))}
                  {creative.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs border-nexus-border">
                      +{creative.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-nexus-border">
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <Eye className="w-4 h-4 mr-2 text-nexus-blue" />
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <MoreHorizontal className="w-4 h-4 text-nexus-text-tertiary" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card className="border-nexus-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-nexus-border bg-nexus-bg">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCreatives.length === filteredCreatives.length}
                        onChange={toggleAllCreatives}
                        className="rounded border-nexus-border"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
                      Creative
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nexus-text-tertiary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-nexus-border">
                  {filteredCreatives.map((creative) => (
                    <tr key={creative.id} className="hover:bg-nexus-bg-secondary">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCreatives.includes(creative.id)}
                          onChange={() => toggleCreative(creative.id)}
                          className="rounded border-nexus-border"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-nexus-text-secondary mr-3">{getTypeIcon(creative.type)}</div>
                          <div>
                            <div className="text-sm font-medium text-nexus-text-primary">
                              {creative.name}
                            </div>
                            <div className="text-sm text-nexus-text-secondary">
                              {creative.format} • {creative.dimensions || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="capitalize border-nexus-border">
                          {creative.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getPlatformIcon(creative.platform)}</span>
                          <span className="text-sm text-nexus-text-primary">{creative.platform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(creative.status)}>
                          {creative.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-nexus-text-tertiary">Imp.</div>
                            <div className="font-semibold text-nexus-text-primary">{(creative.performance?.impressions ?? 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-nexus-text-tertiary">Clicks</div>
                            <div className="font-semibold text-nexus-text-primary">{creative.performance?.clicks ?? 0}</div>
                          </div>
                          <div>
                            <div className="text-nexus-text-tertiary">CTR</div>
                            <div className="font-semibold text-nexus-text-primary">{creative.performance?.ctr?.toFixed(2) ?? '0.00'}%</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                            <Eye className="w-4 h-4 text-nexus-blue" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                            <Edit className="w-4 h-4 text-nexus-text-tertiary" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                            <Copy className="w-4 h-4 text-nexus-text-tertiary" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                            <MoreHorizontal className="w-4 h-4 text-nexus-text-tertiary" />
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
      )}

      {filteredCreatives.length === 0 && !loading && (
        <Card className="border-nexus-border">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Creatives Found</h3>
            <p className="text-nexus-text-secondary mb-6">
              {selectedAccount ? 'No creatives found for this account. Upload your first creative to get started.' : 'Select an ad account to view creatives.'}
            </p>
            {selectedAccount && (
              <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Creative
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {filteredCreatives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-nexus-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Image className="w-8 h-8 text-nexus-blue mr-3" />
                <div>
                  <div className="text-2xl font-bold text-nexus-text-primary">
                    {filteredCreatives.filter(c => c.type === 'image' || c.type === 'carousel').length}
                  </div>
                  <div className="text-sm text-nexus-text-secondary">Image Creatives</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Video className="w-8 h-8 text-nexus-green mr-3" />
                <div>
                  <div className="text-2xl font-bold text-nexus-text-primary">
                    {filteredCreatives.filter(c => c.type === 'video').length}
                  </div>
                  <div className="text-sm text-nexus-text-secondary">Video Creatives</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-nexus-violet mr-3" />
                <div>
                  <div className="text-2xl font-bold text-nexus-text-primary">
                    {filteredCreatives.filter(c => c.type === 'text').length}
                  </div>
                  <div className="text-sm text-nexus-text-secondary">Text Creatives</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-nexus-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-nexus-amber mr-3" />
                <div>
                  <div className="text-2xl font-bold text-nexus-text-primary">
                    {(filteredCreatives.reduce((sum, c) => sum + (c.performance?.impressions ?? 0), 0) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-nexus-text-secondary">Total Impressions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}