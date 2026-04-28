'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiClient } from '@/lib/api'
import {
  Plus, Calendar, Clock, Instagram, Facebook, Twitter, Linkedin, Youtube,
  MessageSquare, Image, Video, Hash, TrendingUp, Eye, Heart, Share2, MessageCircle
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
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    hashtags: '',
  })
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getSocialPosts()
        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching social posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || newPost.platforms.length === 0) return

    try {
      setIsCreating(true)
      const post = await apiClient.createSocialPost({
        content: newPost.content,
        platforms: newPost.platforms,
      })
      setPosts([post, ...posts])
      setNewPost({ content: '', platforms: [], hashtags: '' })
    } catch (error) {
      console.error('Error creating social post:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading posts...</div>
      </div>
    )
  }

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter(p => p.status === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Social Media Planner</h1>
          <p className="text-nexus-text-secondary">Schedule and manage your social media content.</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-nexus-blue hover:bg-nexus-accent text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['all', 'published', 'scheduled', 'draft'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'bg-nexus-blue text-white' : 'border-nexus-border'}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Create Post Modal */}
      {isCreating && (
        <Card className="border-nexus-blue bg-nexus-blue-light">
          <CardHeader>
            <CardTitle>Create Social Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What's on your mind?"
                rows={4}
                className="border-nexus-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex gap-2 flex-wrap">
                {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map((platform) => (
                  <Badge
                    key={platform}
                    variant={newPost.platforms.includes(platform) ? 'default' : 'outline'}
                    className={`cursor-pointer ${newPost.platforms.includes(platform) ? 'bg-nexus-blue' : 'border-nexus-border'}`}
                    onClick={() => {
                      const platforms = newPost.platforms.includes(platform)
                        ? newPost.platforms.filter(p => p !== platform)
                        : [...newPost.platforms, platform]
                      setNewPost({ ...newPost, platforms })
                    }}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={!newPost.content.trim() || newPost.platforms.length === 0}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <p className="text-nexus-text-secondary">No posts yet. Create your first social post to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-nexus-text-primary mb-2">{post.content}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.platforms.map((platform: string) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                      <Badge className={
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {post.status}
                      </Badge>
                    </div>
                    {post.performance && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-nexus-text-secondary">
                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.performance.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.performance.comments}</span>
                        <span className="flex items-center gap-1"><Share2 className="w-4 h-4" /> {post.performance.shares}</span>
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {post.performance.views}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
