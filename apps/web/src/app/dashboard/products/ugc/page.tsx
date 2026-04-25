'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Video,
  Play,
  Pause,
  Download,
  Upload,
  Share2,
  Heart,
  MessageSquare,
  Eye,
  TrendingUp,
  Users,
  Target,
  Zap,
  Filter,
  Search,
  Star,
  ThumbsUp,
  BarChart3
} from 'lucide-react'

interface UGCContent {
  id: string
  creator: string
  platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter'
  type: 'video' | 'image' | 'story'
  content: string
  engagement: number
  reach: number
  conversions: number
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
  thumbnail: string
  createdAt: string
}

interface Campaign {
  id: string
  name: string
  status: 'active' | 'completed' | 'draft'
  budget: number
  reach: number
  engagement: number
  conversions: number
  ugcCount: number
  platforms: string[]
}

export default function UGCAdsPage() {
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  // Mock UGC content data
  const ugcContent: UGCContent[] = [
    {
      id: '1',
      creator: '@fitness_guru',
      platform: 'tiktok',
      type: 'video',
      content: 'Amazing workout routine! 💪 #fitness #workout',
      engagement: 125000,
      reach: 500000,
      conversions: 234,
      sentiment: 'positive',
      tags: ['fitness', 'workout', 'motivation'],
      thumbnail: '/api/placeholder/200/300',
      createdAt: '2026-04-24T10:30:00Z'
    },
    {
      id: '2',
      creator: '@beauty_expert',
      platform: 'instagram',
      type: 'image',
      content: 'Loving this new skincare routine! ✨ #skincare #beauty',
      engagement: 89000,
      reach: 245000,
      conversions: 145,
      sentiment: 'positive',
      tags: ['skincare', 'beauty', 'selfcare'],
      thumbnail: '/api/placeholder/200/200',
      createdAt: '2026-04-23T14:15:00Z'
    },
    {
      id: '3',
      creator: '@tech_reviewer',
      platform: 'youtube',
      type: 'video',
      content: 'Unboxing the latest smartphone! 📱 #tech #review',
      engagement: 67000,
      reach: 180000,
      conversions: 89,
      sentiment: 'neutral',
      tags: ['tech', 'review', 'smartphone'],
      thumbnail: '/api/placeholder/200/150',
      createdAt: '2026-04-22T09:45:00Z'
    },
    {
      id: '4',
      creator: '@foodie_adventures',
      platform: 'instagram',
      type: 'story',
      content: 'Best coffee in town! ☕ #coffee #foodie',
      engagement: 45000,
      reach: 120000,
      conversions: 67,
      sentiment: 'positive',
      tags: ['coffee', 'foodie', 'cafe'],
      thumbnail: '/api/placeholder/200/200',
      createdAt: '2026-04-21T16:20:00Z'
    }
  ]

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Fitness Challenge',
      status: 'active',
      budget: 15000,
      reach: 2500000,
      engagement: 89000,
      conversions: 1234,
      ugcCount: 45,
      platforms: ['tiktok', 'instagram', 'youtube']
    },
    {
      id: '2',
      name: 'Beauty Product Launch',
      status: 'completed',
      budget: 25000,
      reach: 1800000,
      engagement: 67000,
      conversions: 987,
      ugcCount: 32,
      platforms: ['instagram', 'tiktok']
    },
    {
      id: '3',
      name: 'Tech Gadget Review',
      status: 'draft',
      budget: 10000,
      reach: 0,
      engagement: 0,
      conversions: 0,
      ugcCount: 0,
      platforms: ['youtube', 'twitter']
    }
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return '🎵'
      case 'instagram':
        return '📷'
      case 'youtube':
        return '📺'
      case 'twitter':
        return '🐦'
      default:
        return '📱'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-pink-100 text-pink-800'
      case 'instagram':
        return 'bg-purple-100 text-purple-800'
      case 'youtube':
        return 'bg-red-100 text-red-800'
      case 'twitter':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredContent = ugcContent.filter(content =>
    selectedPlatform === 'all' || content.platform === selectedPlatform
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UGC Ads & Influencer Marketing</h1>
          <p className="text-gray-600">Leverage user-generated content for authentic marketing campaigns.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Content
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Find Creators
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Video className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{ugcContent.length}</div>
                <div className="text-sm text-gray-600">UGC Pieces</div>
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
                  {(ugcContent.reduce((sum, content) => sum + content.reach, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Total Reach</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ThumbsUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {(ugcContent.reduce((sum, content) => sum + content.engagement, 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Total Engagement</div>
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
                  {ugcContent.reduce((sum, content) => sum + content.conversions, 0)}
                </div>
                <div className="text-sm text-gray-600">Conversions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">UGC Content</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search content..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* UGC Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                    <img
                      src={content.thumbnail}
                      alt={content.content}
                      className="w-full h-full object-cover"
                    />
                    {content.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="text-2xl">{getPlatformIcon(content.platform)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{content.creator}</span>
                      <Badge className={getSentimentColor(content.sentiment)}>
                        {content.sentiment}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{content.content}</p>

                    <div className="flex flex-wrap gap-1">
                      {content.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {content.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{content.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pt-2 border-t">
                      <div className="text-center">
                        <div className="font-medium">{(content.engagement / 1000).toFixed(1)}K</div>
                        <div>Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{(content.reach / 1000).toFixed(0)}K</div>
                        <div>Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{content.conversions}</div>
                        <div>Conversions</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Repurpose
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>UGC Campaigns</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <span className="text-sm text-gray-600">{campaign.ugcCount} pieces of UGC</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${campaign.budget.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Budget</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {(campaign.reach / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-gray-600">Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {(campaign.engagement / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-600">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {campaign.conversions}
                        </div>
                        <div className="text-xs text-gray-600">Conversions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">
                          {((campaign.conversions / campaign.reach) * 100).toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-600">Conv. Rate</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {campaign.platforms.map((platform, index) => (
                          <Badge key={index} className={getPlatformColor(platform)} variant="secondary">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Content
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit Campaign
                        </Button>
                        <Button size="sm">
                          Boost Performance
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Influencer Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Sarah Fitness',
                    handle: '@sarahfit',
                    platform: 'tiktok',
                    followers: 250000,
                    engagement: 8.5,
                    niche: 'Fitness',
                    location: 'Los Angeles, CA',
                    verified: true
                  },
                  {
                    name: 'Beauty Glow',
                    handle: '@beautyglow',
                    platform: 'instagram',
                    followers: 180000,
                    engagement: 6.2,
                    niche: 'Beauty',
                    location: 'New York, NY',
                    verified: true
                  },
                  {
                    name: 'Tech Reviews',
                    handle: '@techguru',
                    platform: 'youtube',
                    followers: 95000,
                    engagement: 12.1,
                    niche: 'Technology',
                    location: 'San Francisco, CA',
                    verified: false
                  }
                ].map((creator, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{creator.name}</span>
                          <span className="text-sm text-gray-600">{creator.handle}</span>
                          <span className="text-lg">{getPlatformIcon(creator.platform)}</span>
                          {creator.verified && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{creator.followers.toLocaleString()} followers</span>
                          <span>{creator.engagement}% engagement</span>
                          <span>{creator.niche}</span>
                          <span>{creator.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Message
                      </Button>
                      <Button size="sm">
                        Invite to Campaign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">4.2x</div>
                    <div className="text-sm text-gray-600">Engagement Multiplier</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">67%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">$3.45</div>
                    <div className="text-sm text-gray-600">Cost per Conversion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>UGC Performance by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { platform: 'TikTok', content: 45, engagement: 125000, conversions: 234, rate: 8.2 },
                  { platform: 'Instagram', content: 32, engagement: 89000, conversions: 156, rate: 6.7 },
                  { platform: 'YouTube', content: 18, engagement: 67000, conversions: 89, rate: 12.1 },
                  { platform: 'Twitter', content: 12, engagement: 23000, conversions: 45, rate: 4.5 }
                ].map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getPlatformIcon(platform.platform.toLowerCase())}</span>
                      <div>
                        <div className="font-medium text-gray-900">{platform.platform}</div>
                        <div className="text-sm text-gray-600">{platform.content} pieces of content</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{(platform.engagement / 1000).toFixed(1)}K</div>
                        <div className="text-gray-600">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{platform.conversions}</div>
                        <div className="text-gray-600">Conversions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-purple-600">{platform.rate}%</div>
                        <div className="text-gray-600">Conv. Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}