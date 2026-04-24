'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Search,
  Wand2,
  FileText,
  Image,
  Video,
  Link,
  Hash,
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share,
  Calendar,
  Clock,
  Target
} from 'lucide-react'

interface ContentIdea {
  id: string
  title: string
  description: string
  type: 'article' | 'social' | 'video' | 'image'
  status: 'draft' | 'published' | 'scheduled'
  platform?: string
  scheduledDate?: string
  performance?: {
    views: number
    likes: number
    shares: number
    comments: number
  }
}

export default function ContentWriterPage() {
  const [contentType, setContentType] = useState<'article' | 'social' | 'video'>('article')
  const [topic, setTopic] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const contentIdeas: ContentIdea[] = [
    {
      id: '1',
      title: 'The Future of AI in Business',
      description: 'Exploring how artificial intelligence is transforming modern business operations',
      type: 'article',
      status: 'published',
      platform: 'blog',
      performance: {
        views: 2500,
        likes: 120,
        shares: 45,
        comments: 28
      }
    },
    {
      id: '2',
      title: '5 Ways to Boost Your Social Media Engagement',
      description: 'Proven strategies for increasing audience interaction on social platforms',
      type: 'social',
      status: 'scheduled',
      platform: 'linkedin',
      scheduledDate: '2026-04-25',
    },
    {
      id: '3',
      title: 'Product Demo: NEXUS CRM Features',
      description: 'Showcase the key features and benefits of our CRM platform',
      type: 'video',
      status: 'draft',
      platform: 'youtube',
    }
  ]

  const handleGenerateContent = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    // Simulate AI content generation
    setTimeout(() => {
      let content = ''

      if (contentType === 'article') {
        content = `# ${topic}

## Introduction

In today's rapidly evolving digital landscape, ${topic.toLowerCase()} has become a critical factor for business success. This comprehensive guide explores the key aspects, best practices, and future trends that every business leader should understand.

## Key Benefits

### 1. Improved Efficiency
${topic} streamlines operations and reduces manual processes by up to 70%. Organizations implementing these strategies see immediate improvements in productivity and resource allocation.

### 2. Enhanced Customer Experience
By leveraging ${topic.toLowerCase()}, businesses can provide personalized experiences that resonate with their target audience, leading to higher satisfaction rates and increased loyalty.

### 3. Competitive Advantage
Early adopters of ${topic.toLowerCase()} gain significant advantages over competitors still relying on traditional methods. This forward-thinking approach positions businesses as industry leaders.

## Implementation Strategy

### Step 1: Assessment and Planning
Begin by conducting a thorough assessment of your current processes and identifying areas where ${topic.toLowerCase()} can provide the most impact.

### Step 2: Technology Selection
Choose the right tools and platforms that align with your business objectives and technical requirements.

### Step 3: Team Training and Change Management
Ensure your team is properly trained and prepared for the transition to maintain productivity throughout the implementation process.

## Future Outlook

The landscape of ${topic.toLowerCase()} continues to evolve rapidly. Businesses that stay informed and adapt quickly will be best positioned to capitalize on emerging opportunities and maintain their competitive edge.

## Conclusion

${topic} represents a fundamental shift in how businesses operate and compete. By embracing these changes and implementing best practices, organizations can achieve sustainable growth and long-term success in an increasingly digital world.`
      } else if (contentType === 'social') {
        content = `🚀 Exciting News: ${topic}

Did you know that ${topic.toLowerCase()} can revolutionize your business operations? Here are 3 key insights:

1️⃣ **Efficiency Boost**: Reduce manual processes by up to 70%
2️⃣ **Cost Savings**: Lower operational costs through automation
3️⃣ **Scalability**: Grow your business without proportional increases in overhead

💡 Pro tip: Start small with pilot projects to demonstrate ROI before full implementation.

What are your thoughts on ${topic.toLowerCase()}? Share in the comments below!

#BusinessGrowth #Innovation #DigitalTransformation`
      } else if (contentType === 'video') {
        content = `VIDEO SCRIPT: ${topic}

[Opening Scene - Energetic music, dynamic graphics]

NARRATOR: "Are you ready to transform your business with ${topic}?"

[Cut to expert speaking]

EXPERT: "${topic} isn't just a trend—it's the future of business operations."

[Show statistics and graphics]

KEY POINTS:
• 70% efficiency improvement
• 40% cost reduction
• 300% faster scaling

[Customer testimonial clips]

CUSTOMER: "${topic} completely changed how we operate. Game-changing!"

[Call to action]

NARRATOR: "Ready to get started? Visit nexus-platform.com today!"

[Closing graphics with contact info]

VIDEO LENGTH: 2:30
RECOMMENDED PLATFORMS: YouTube, LinkedIn, Company Website`
      }

      setGeneratedContent(content)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Writer</h1>
          <p className="text-gray-600">AI-powered content creation for articles, social media, and videos.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Content Library
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Generator */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="w-5 h-5 mr-2" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Content Type</Label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="article">Article/Blog</option>
                    <option value="social">Social Media</option>
                    <option value="video">Video Script</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <Label className="text-sm font-medium">Topic or Keyword</Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter your content topic..."
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateContent}
                disabled={!topic.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate {contentType === 'article' ? 'Article' : contentType === 'social' ? 'Post' : 'Script'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content */}
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {generatedContent}
                  </pre>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <Button size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Content Library & Ideas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentIdeas.map((idea) => (
                  <div key={idea.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {idea.title}
                      </h3>
                      <Badge
                        variant={
                          idea.status === 'published' ? 'default' :
                          idea.status === 'scheduled' ? 'secondary' : 'outline'
                        }
                        className="text-xs ml-2 flex-shrink-0"
                      >
                        {idea.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="capitalize">{idea.type}</span>
                      {idea.platform && <span>{idea.platform}</span>}
                    </div>
                    {idea.performance && (
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {idea.performance.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {idea.performance.likes}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Image className="w-4 h-4 mr-2" />
                Generate Images
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="w-4 h-4 mr-2" />
                Create Video
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Hash className="w-4 h-4 mr-2" />
                Hashtag Generator
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Posts
              </Button>
            </CardContent>
          </Card>

          {/* Content Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Content</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="font-semibold text-green-600">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scheduled</span>
                  <span className="font-semibold text-blue-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Engagement</span>
                  <span className="font-semibold">4.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}