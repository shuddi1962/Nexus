import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Eye
} from 'lucide-react'

// Mock creatives data
const creatives = [
  {
    id: '1',
    name: 'Product Launch Hero Image',
    type: 'image',
    platform: 'Meta',
    campaign: 'Q2 Product Launch',
    status: 'active',
    format: 'Single image',
    dimensions: '1200x628',
    fileSize: '2.1 MB',
    url: '/placeholder-image.jpg',
    performance: {
      impressions: 45000,
      clicks: 285,
      ctr: 0.63,
    },
    tags: ['hero', 'product', 'launch'],
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Brand Video - 15s',
    type: 'video',
    platform: 'Meta',
    campaign: 'Brand Awareness 2026',
    status: 'active',
    format: 'Video',
    dimensions: '1920x1080',
    fileSize: '45.8 MB',
    url: '/placeholder-video.mp4',
    duration: '00:15',
    performance: {
      impressions: 32000,
      clicks: 210,
      ctr: 0.66,
    },
    tags: ['brand', 'video', 'awareness'],
    createdAt: '2026-04-02T14:30:00Z',
  },
  {
    id: '3',
    name: 'Testimonial Carousel',
    type: 'carousel',
    platform: 'Meta',
    campaign: 'Holiday Sale',
    status: 'active',
    format: 'Carousel',
    dimensions: '1200x628',
    fileSize: '8.3 MB',
    url: '/placeholder-carousel.jpg',
    slides: 3,
    performance: {
      impressions: 78000,
      clicks: 420,
      ctr: 0.54,
    },
    tags: ['testimonial', 'carousel', 'social proof'],
    createdAt: '2026-03-15T09:15:00Z',
  },
  {
    id: '4',
    name: 'Search Ad Headline',
    type: 'text',
    platform: 'Google',
    campaign: 'Brand Awareness 2026',
    status: 'active',
    format: 'Text ad',
    headline: 'NEXUS - All-in-One Business Platform',
    description: 'Replace 55+ tools with one powerful platform. Start your free trial today.',
    performance: {
      impressions: 7500,
      clicks: 58,
      ctr: 0.77,
    },
    tags: ['search', 'brand', 'text'],
    createdAt: '2026-04-03T11:45:00Z',
  },
  {
    id: '5',
    name: 'TikTok Product Demo',
    type: 'video',
    platform: 'TikTok',
    campaign: 'Product Launch',
    status: 'draft',
    format: 'Vertical video',
    dimensions: '1080x1920',
    fileSize: '28.4 MB',
    url: '/placeholder-tiktok.mp4',
    duration: '00:30',
    performance: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    tags: ['tiktok', 'demo', 'vertical'],
    createdAt: '2026-04-10T16:20:00Z',
  },
]

export default function CreativesPage() {
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creative Library</h1>
          <p className="text-gray-600">Manage your ad creatives, images, videos, and text content.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Creative
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
                  placeholder="Search creatives..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Types</option>
                <option>Image</option>
                <option>Video</option>
                <option>Carousel</option>
                <option>Text</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Platforms</option>
                <option>Meta</option>
                <option>Google</option>
                <option>TikTok</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
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
          {creatives.map((creative) => (
            <Card key={creative.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCreatives.includes(creative.id)}
                      onChange={() => toggleCreative(creative.id)}
                      className="rounded border-gray-300"
                    />
                    <div className="text-gray-600">{getTypeIcon(creative.type)}</div>
                    <div className="text-lg">{getPlatformIcon(creative.platform)}</div>
                  </div>
                  <Badge className={getStatusColor(creative.status)}>
                    {creative.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Creative Preview */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {creative.type === 'image' || creative.type === 'carousel' ? (
                    <Image className="w-8 h-8 text-gray-400" />
                  ) : creative.type === 'video' ? (
                    <Video className="w-8 h-8 text-gray-400" />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Creative Info */}
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-2">{creative.name}</h3>
                  <p className="text-sm text-gray-600">{creative.campaign}</p>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-600">Impressions</div>
                    <div className="font-semibold">{creative.performance.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Clicks</div>
                    <div className="font-semibold">{creative.performance.clicks}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">CTR</div>
                    <div className="font-semibold">{creative.performance.ctr}%</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {creative.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {creative.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{creative.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCreatives.length === creatives.length}
                        onChange={toggleAllCreatives}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creative
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {creatives.map((creative) => (
                    <tr key={creative.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCreatives.includes(creative.id)}
                          onChange={() => toggleCreative(creative.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-gray-600 mr-3">{getTypeIcon(creative.type)}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {creative.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {creative.format} • {creative.dimensions || creative.headline?.substring(0, 30) + '...'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="capitalize">
                          {creative.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getPlatformIcon(creative.platform)}</span>
                          <span className="text-sm text-gray-900">{creative.platform}</span>
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
                            <div className="text-gray-600">Imp.</div>
                            <div className="font-semibold">{creative.performance.impressions.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Clicks</div>
                            <div className="font-semibold">{creative.performance.clicks}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">CTR</div>
                            <div className="font-semibold">{creative.performance.ctr}%</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
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
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Image className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {creatives.filter(c => c.type === 'image' || c.type === 'carousel').length}
                </div>
                <div className="text-sm text-gray-600">Image Creatives</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Video className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {creatives.filter(c => c.type === 'video').length}
                </div>
                <div className="text-sm text-gray-600">Video Creatives</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {creatives.filter(c => c.type === 'text').length}
                </div>
                <div className="text-sm text-gray-600">Text Creatives</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {(creatives.reduce((sum, c) => sum + c.performance.impressions, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Impressions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}