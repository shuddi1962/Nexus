'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiClient } from '@/lib/api'
import {
  Plus, Calendar, Clock, Instagram, Facebook, Twitter, Linkedin, Youtube,
  MessageSquare, Image, Video, Hash, TrendingUp, Loader2, Sparkles, Send,
  Check, Copy, RefreshCw, Palette, FileText, HashIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialPost {
  id: string
  content: string
  platforms: string[]
  scheduled_date?: string
  scheduled_time?: string
  status: 'draft' | 'scheduled' | 'published'
  hashtags?: string[]
  cta?: string
  template_type?: string
}

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

const TEMPLATES = [
  { type: 'product_showcase', name: 'Product Showcase', icon: Image },
  { type: 'educational', name: 'Educational', icon: FileText },
  { type: 'promotional', name: 'Promotional', icon: Sparkles },
  { type: 'engagement', name: 'Engagement', icon: MessageSquare },
  { type: 'testimonial', name: 'Testimonial', icon: Check },
  { type: 'behind_scenes', name: 'Behind the Scenes', icon: Image },
  { type: 'trending', name: 'News / Trend Reactive', icon: TrendingUp },
  { type: 'howto', name: 'How-To / Tips', icon: FileText },
  { type: 'seasonal', name: 'Seasonal / Event', icon: Calendar },
  { type: 'comparison', name: 'Comparison', icon: FileText },
  { type: 'faq', name: 'FAQ', icon: MessageSquare },
  { type: 'new_arrival', name: 'New Arrival', icon: Sparkles },
]

export default function SocialPlannerPage() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('studio')
  
  const [selectedTemplate, setSelectedTemplate] = useState('product_showcase')
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedPost, setGeneratedPost] = useState<SocialPost | null>(null)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const fetchPosts = async () => {
    try {
      const data = await apiClient.getSocialPosts()
      setPosts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      const result = await apiClient.generatePost({
        template_type: selectedTemplate,
        platform: selectedPlatform,
        custom_prompt: customPrompt,
        num_posts: 1,
      })

      if (result.posts && result.posts.length > 0) {
        setGeneratedPost(result.posts[0])
        setHashtags(result.posts[0].hashtags || [])
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleQueue = async () => {
    if (!generatedPost) return
    
    try {
      await apiClient.queuePosts([generatedPost], scheduledDate, scheduledTime)
      setGeneratedPost(null)
      setHashtags([])
      fetchPosts()
    } catch (error) {
      console.error('Queue error:', error)
    }
  }

  const handleResearchHashtags = async () => {
    try {
      const result = await apiClient.researchHashtags(selectedPlatform)
      if (result.hashtags) {
        setHashtags(result.hashtags.map((h: any) => h.tag))
      }
    } catch (error) {
      console.error('Hashtag research error:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold">Social Studio</h1>
        <p className="text-nexus-text-secondary">
          AI-powered social media post generation with {selectedPlatform}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="studio" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Studio
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            All Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="studio" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-nexus-violet" />
                  Generate Post
                </CardTitle>
                <CardDescription>Select template and platform to generate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Post Template</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map((template) => {
                      const Icon = template.icon
                      return (
                        <button
                          key={template.type}
                          onClick={() => setSelectedTemplate(template.type)}
                          className={cn(
                            "p-3 rounded-lg border text-left transition-colors",
                            selectedTemplate === template.type
                              ? "border-nexus-blue bg-nexus-blue-light"
                              : "border-nexus-border hover:border-nexus-border-strong"
                          )}
                        >
                          <Icon className="w-4 h-4 mb-1" />
                          <div className="text-xs font-medium">{template.name}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Platform</Label>
                  <div className="flex gap-2">
                    {['instagram', 'facebook', 'twitter', 'linkedin'].map((platform) => {
                      const Icon = PLATFORM_ICONS[platform] || Instagram
                      return (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          className={cn(
                            "flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors",
                            selectedPlatform === platform
                              ? "border-nexus-blue bg-nexus-blue-light"
                              : "border-nexus-border hover:border-nexus-border-strong"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm capitalize">{platform}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Custom Instructions (Optional)</Label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Add any custom instructions..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-nexus-violet hover:bg-nexus-violet/90"
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate with AI
                </Button>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="mb-0">Hashtags</Label>
                    <Button variant="ghost" size="sm" onClick={handleResearchHashtags}>
                      <HashIcon className="w-4 h-4 mr-1" />
                      Research
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.length === 0 ? (
                      <div className="text-sm text-nexus-text-tertiary p-2">
                        Generate a post or research hashtags
                      </div>
                    ) : (
                      hashtags.slice(0, 10).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Post Preview
                </CardTitle>
                <CardDescription>Preview your generated post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPost ? (
                  <>
                    <div className="p-4 bg-nexus-bg-secondary rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          selectedPlatform === 'instagram' ? 'bg-pink-100' :
                          selectedPlatform === 'facebook' ? 'bg-blue-100' :
                          selectedPlatform === 'twitter' ? 'bg-sky-100' :
                          'bg-blue-100'
                        )}>
                          {(() => {
                            const Icon = PLATFORM_ICONS[selectedPlatform] || Instagram
                            return <Icon className="w-4 h-4" />
                          })()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Your Business</div>
                          <div className="text-xs text-nexus-text-tertiary capitalize">{selectedPlatform}</div>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{generatedPost.content}</p>
                      {hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hashtags.slice(0, 5).map((tag, index) => (
                            <span key={index} className="text-xs text-nexus-blue">{tag} </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Schedule Date</Label>
                        <Input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Schedule Time</Label>
                        <Input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleQueue}
                      disabled={!scheduledDate || !scheduledTime}
                      className="w-full bg-nexus-blue hover:bg-nexus-blue/90"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Post
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPost.content + '\n' + hashtags.join(' '))
                      }}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12 text-nexus-text-tertiary">
                    <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a template and click "Generate with AI" to create your post</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>View your scheduled posts calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-medium text-sm py-2 bg-nexus-bg-secondary rounded">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="min-h-[80px] p-2 border rounded-lg text-sm">
                    <div className="font-medium">{i + 1}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-nexus-blue" />
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-nexus-text-tertiary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                <p className="text-nexus-text-secondary mb-4">
                  Create your first post using the AI Studio tab
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1">
                        {post.platforms?.map((platform) => {
                          const Icon = PLATFORM_ICONS[platform] || Instagram
                          return <Icon key={platform} className="w-4 h-4" />
                        })}
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      )}>
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-3">{post.content}</p>
                    {post.scheduled_date && (
                      <div className="mt-2 text-xs text-nexus-text-tertiary">
                        {post.scheduled_date} {post.scheduled_time}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}