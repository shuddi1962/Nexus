'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Calendar,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MessageSquare,
  Image,
  Video,
  Hash,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react'

interface SocialPost {
  id: string
  content: string
  platforms: string[]
  scheduledDate: string
  scheduledTime: string
  status: 'draft' | 'scheduled' | 'published'
  media?: {
    type: 'image' | 'video'
    url: string
  }
  hashtags: string[]
  performance?: {
    likes: number
    comments: number
    shares: number
    views: number
  }
}

export default function SocialPlannerPage() {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      content: '🚀 Exciting news! Our new AI-powered CRM is now live. Transform your customer relationships with intelligent automation. #CRM #AI #BusinessGrowth',
      platforms: ['linkedin', 'twitter'],
      scheduledDate: '2026-04-25',
      scheduledTime: '09:00',
      status: 'scheduled',
      hashtags: ['CRM', 'AI', 'BusinessGrowth'],
      performance: {
        likes: 45,
        comments: 12,
        shares: 8,
        views: 1200
      }
    },
    {
      id: '2',
      content: 'Did you know? Companies using AI see 70% improvement in customer satisfaction. Ready to join the AI revolution? #ArtificialIntelligence #CustomerSuccess',
      platforms: ['facebook', 'instagram'],
      scheduledDate: '2026-04-26',
      scheduledTime: '14:30',
      status: 'draft',
      hashtags: ['ArtificialIntelligence', 'CustomerSuccess']
    },
    {
      id: '3',
      content: 'Behind the scenes: Our team working on the next generation of business tools. Innovation never stops! #TeamWork #Innovation #Tech',
      platforms: ['instagram', 'linkedin'],
      scheduledDate: '2026-04-24',
      scheduledTime: '16:00',
      status: 'published',
      hashtags: ['TeamWork', 'Innovation', 'Tech'],
      media: {
        type: 'image',
        url: '/team-photo.jpg'
      },
      performance: {
        likes: 89,
        comments: 23,
        shares: 15,
        views: 2100
      }
    }
  ])

  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledDate: '',
    scheduledTime: '',
    hashtags: [] as string[]
  })

  const [activeTab, setActiveTab] = useState('planner')

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' }
  ]

  const togglePlatform = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const addHashtag = (hashtag: string) => {
    if (hashtag && !newPost.hashtags.includes(hashtag)) {
      setNewPost(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag]
      }))
    }
  }

  const removeHashtag = (hashtag: string) => {
    setNewPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }))
  }

  const createPost = () => {
    if (!newPost.content.trim()) return

    const post: SocialPost = {
      id: Date.now().toString(),
      content: newPost.content,
      platforms: newPost.platforms,
      scheduledDate: newPost.scheduledDate,
      scheduledTime: newPost.scheduledTime,
      status: newPost.scheduledDate ? 'scheduled' : 'draft',
      hashtags: newPost.hashtags
    }

    setPosts(prev => [post, ...prev])
    setNewPost({
      content: '',
      platforms: [],
      scheduledDate: '',
      scheduledTime: '',
      hashtags: []
    })
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    if (!platform) return null
    const Icon = platform.icon
    return <Icon className="w-4 h-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Social Media Planner</h1>
          <p className="text-slate-500 mt-1">Plan, schedule, and manage your social media content.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            Calendar View
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
          <TabsTrigger value="planner" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Content Planner</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Analytics</TabsTrigger>
          <TabsTrigger value="hashtags" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Hashtag Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="space-y-6">
          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newPost.content.length}/280 characters
                </div>
              </div>

              {/* Platforms */}
              <div>
                <Label>Platforms</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={newPost.platforms.includes(platform.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => togglePlatform(platform.id)}
                      className="flex items-center space-x-1"
                    >
                      <platform.icon className="w-4 h-4" />
                      <span>{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Schedule Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPost.scheduledDate}
                    onChange={(e) => setNewPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Schedule Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newPost.scheduledTime}
                    onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <Label>Hashtags</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {newPost.hashtags.map((hashtag) => (
                    <Badge key={hashtag} variant="secondary" className="cursor-pointer" onClick={() => removeHashtag(hashtag)}>
                      #{hashtag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add hashtag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addHashtag((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add hashtag..."]') as HTMLInputElement
                      if (input?.value) {
                        addHashtag(input.value)
                        input.value = ''
                      }
                    }}
                  >
                    <Hash className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={createPost} disabled={!newPost.content.trim()} className="w-full">
                {newPost.scheduledDate ? 'Schedule Post' : 'Save as Draft'}
              </Button>
            </CardContent>
          </Card>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {post.platforms.map((platform) => (
                          <div key={platform} className="text-gray-600">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.scheduledDate} at {post.scheduledTime}
                      </div>
                    </div>

                    <p className="text-gray-900 mb-3">{post.content}</p>

                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((hashtag) => (
                          <Badge key={hashtag} variant="outline" className="text-xs">
                            #{hashtag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {post.performance && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.performance.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.performance.comments}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-4 h-4 mr-1" />
                          {post.performance.shares}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.performance.views}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">45.2K</div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-gray-600">Total Likes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">234</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Share2 className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm text-gray-600">Shares</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { platform: 'Instagram', followers: 12500, engagement: 4.2, posts: 45 },
                  { platform: 'LinkedIn', followers: 8900, engagement: 3.8, posts: 32 },
                  { platform: 'Facebook', followers: 15600, engagement: 2.9, posts: 28 },
                  { platform: 'Twitter', followers: 6700, engagement: 5.1, posts: 67 },
                ].map((platform) => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">
                        {platform.platform === 'Instagram' ? '📸' :
                         platform.platform === 'LinkedIn' ? '💼' :
                         platform.platform === 'Facebook' ? '📘' : '🐦'}
                      </div>
                      <div>
                        <h3 className="font-medium">{platform.platform}</h3>
                        <p className="text-sm text-gray-600">{platform.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{platform.engagement}% engagement</div>
                      <div className="text-sm text-gray-600">{platform.posts} posts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hashtag Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic">Content Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter your content topic..."
                  className="mt-1"
                />
              </div>
              <Button className="w-full">
                <Hash className="w-4 h-4 mr-2" />
                Generate Hashtags
              </Button>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Suggested Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    '#BusinessGrowth', '#DigitalMarketing', '#Entrepreneurship',
                    '#Innovation', '#TechTrends', '#Leadership', '#Startups',
                    '#MarketingTips', '#BusinessStrategy', '#TechNews'
                  ].map((hashtag) => (
                    <Badge key={hashtag} variant="outline" className="cursor-pointer hover:bg-blue-50">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trending Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { tag: '#AI', trend: '+25%', volume: '2.1M' },
                  { tag: '#DigitalTransformation', trend: '+18%', volume: '890K' },
                  { tag: '#BusinessIntelligence', trend: '+12%', volume: '567K' },
                  { tag: '#Automation', trend: '+15%', volume: '1.2M' },
                  { tag: '#SaaS', trend: '+8%', volume: '756K' },
                ].map((item) => (
                  <div key={item.tag} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{item.tag}</span>
                      <span className="text-sm text-gray-600 ml-2">{item.volume} posts</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {item.trend}
                    </Badge>
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