'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Target,
  Globe,
  Sparkles,
  RefreshCw,
  Download,
  Copy,
  CheckCircle,
  Edit
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

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  url?: string
  author?: string
  published_date?: string
  word_count: number
  reading_time: number
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  tags: string[]
  seo_title?: string
  seo_description?: string
  canonical_url?: string
  featured_image?: string
  created_at: string
  updated_at: string
}

interface ExtractedContent {
  title: string
  content: string
  textContent: string
  excerpt: string
  url: string
  author?: string
  published_date?: string
  word_count: number
  reading_time: number
  images: Array<{
    src: string
    alt?: string
    title?: string
  }>
  site_name: string
  language: string
}

export default function ContentWriterPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('generate')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  // URL Extraction
  const [extractUrl, setExtractUrl] = useState('')
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  // Content Rewriting
  const [rewriteContent, setRewriteContent] = useState('')
  const [rewriteInstructions, setRewriteInstructions] = useState('')
  const [rewriteTone, setRewriteTone] = useState('')
  const [rewriteLength, setRewriteLength] = useState('')
  const [rewrittenContent, setRewrittenContent] = useState('')
  const [isRewriting, setIsRewriting] = useState(false)

  // Image Generation
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStyle, setImageStyle] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Article Creation
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    status: 'draft'
  })
  const [isCreatingArticle, setIsCreatingArticle] = useState(false)

  useEffect(() => {
    if (activeTab === 'articles') {
      fetchArticles()
    }
  }, [activeTab])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            setActiveTab('extract')
            break
          case '2':
            e.preventDefault()
            setActiveTab('rewrite')
            break
          case '3':
            e.preventDefault()
            setActiveTab('image')
            break
          case '4':
            e.preventDefault()
            setActiveTab('create')
            break
          case '5':
            e.preventDefault()
            setActiveTab('articles')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getArticles()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

    const handleExtractUrl = async () => {
      if (!extractUrl.trim()) {
        alert('Please enter a valid URL to extract content from.')
        return
      }

      // Basic URL validation
      try {
        new URL(extractUrl.trim())
      } catch {
        alert('Please enter a valid URL starting with http:// or https://')
        return
      }

      try {
        setIsExtracting(true)
        const data = await apiClient.extractArticle(extractUrl.trim())
        setExtractedContent(data)
        // Pre-populate article form
        setNewArticle({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          url: data.url,
          author: data.author,
          published_date: data.published_date,
          word_count: data.word_count,
          reading_time: data.reading_time,
          tags: [],
          status: 'draft'
        })
        // Switch to create tab for convenience
        setActiveTab('create')
      } catch (error) {
        console.error('Error extracting URL:', error)
        alert('Failed to extract content from URL. Please check the URL and ensure the site allows content extraction.')
      } finally {
        setIsExtracting(false)
      }
    }

  const handleRewriteContent = async () => {
    if (!rewriteContent.trim()) {
      alert('Please enter content to rewrite.')
      return
    }

    if (rewriteContent.trim().length < 10) {
      alert('Content must be at least 10 characters long.')
      return
    }

    try {
      setIsRewriting(true)
      const data = await apiClient.rewriteContent({
        content: rewriteContent,
        instructions: rewriteInstructions || undefined,
        tone: rewriteTone || undefined,
        length: rewriteLength || undefined
      })
      setRewrittenContent(data.rewritten_content)
    } catch (error) {
      console.error('Error rewriting content:', error)
      alert('Failed to rewrite content. Please check your API keys and try again.')
    } finally {
      setIsRewriting(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      alert('Please enter a description for the image.')
      return
    }

    if (imagePrompt.trim().length < 5) {
      alert('Image description must be at least 5 characters long.')
      return
    }

    try {
      setIsGeneratingImage(true)
      const data = await apiClient.generateImage({
        prompt: imagePrompt,
        style: imageStyle !== '' ? imageStyle : undefined
      })
      setGeneratedImage(data.image_url)
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate image. Please check your API keys and try again.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleCreateArticle = async () => {
    if (!newArticle.title?.trim()) {
      alert('Please enter a title for the article.')
      return
    }

    if (!newArticle.content?.trim()) {
      alert('Please enter content for the article.')
      return
    }

    if (newArticle.title.trim().length < 3) {
      alert('Title must be at least 3 characters long.')
      return
    }

    if (newArticle.content.trim().length < 10) {
      alert('Content must be at least 10 characters long.')
      return
    }

    try {
      setIsCreatingArticle(true)
      await apiClient.createArticle({
        title: newArticle.title.trim(),
        content: newArticle.content.trim(),
        excerpt: newArticle.excerpt?.trim() || undefined,
        tags: newArticle.tags?.filter(tag => tag.trim()) || [],
        status: newArticle.status
      })
      // Reset form
      setNewArticle({
        title: '',
        content: '',
        excerpt: '',
        tags: [],
        status: 'draft'
      })
      // Clear other form states
      setExtractedContent(null)
      setRewrittenContent('')
      setGeneratedImage('')
      // Refresh articles list
      fetchArticles()
      alert('Article created successfully!')
      setActiveTab('articles')
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Failed to create article. Please try again.')
    } finally {
      setIsCreatingArticle(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-nexus-green text-white'
      case 'draft':
        return 'bg-nexus-amber text-white'
      case 'archived':
        return 'bg-nexus-text-tertiary text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content Writer</h1>
          <p className="text-slate-500 mt-1">AI-powered content creation and management.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <Search className="w-4 h-4 mr-2 text-blue-600" />
            Library
          </Button>
          <Button onClick={() => setActiveTab('create')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1">
          <TabsTrigger value="extract" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">URL Extract</TabsTrigger>
          <TabsTrigger value="rewrite" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Rewrite</TabsTrigger>
          <TabsTrigger value="image" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Generate Image</TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Create Article</TabsTrigger>
          <TabsTrigger value="articles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="extract" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Globe className="w-5 h-5 mr-2 text-nexus-blue" />
                URL Content Extraction
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Extract clean, readable content from any webpage using advanced parsing and readability algorithms.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={extractUrl}
                  onChange={(e) => setExtractUrl(e.target.value)}
                  placeholder="https://example.com/article-url"
                  className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
                <Button
                  onClick={handleExtractUrl}
                  disabled={!extractUrl.trim() || isExtracting}
                  className="bg-nexus-blue hover:bg-nexus-accent text-white"
                >
                  {isExtracting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Extract
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {extractedContent && (
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Extracted Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-nexus-text-primary font-medium">Title</Label>
                    <p className="text-sm text-nexus-text-secondary mt-1">{extractedContent.title}</p>
                  </div>
                  <div>
                    <Label className="text-nexus-text-primary font-medium">Source</Label>
                    <p className="text-sm text-nexus-text-secondary mt-1">{extractedContent.site_name}</p>
                  </div>
                  <div>
                    <Label className="text-nexus-text-primary font-medium">Word Count</Label>
                    <p className="text-sm text-nexus-text-secondary mt-1">{extractedContent.word_count}</p>
                  </div>
                  <div>
                    <Label className="text-nexus-text-primary font-medium">Reading Time</Label>
                    <p className="text-sm text-nexus-text-secondary mt-1">{extractedContent.reading_time} minutes</p>
                  </div>
                </div>

                {extractedContent.excerpt && (
                  <div>
                    <Label className="text-nexus-text-primary font-medium">Excerpt</Label>
                    <p className="text-sm text-nexus-text-secondary mt-1 p-3 bg-nexus-bg-secondary rounded-lg">
                      {extractedContent.excerpt}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-nexus-text-primary font-medium">Content Preview</Label>
                  <div className="mt-2 p-4 bg-nexus-bg-secondary rounded-lg max-h-60 overflow-y-auto">
                    <div
                      className="text-sm text-nexus-text-primary prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: extractedContent.content.substring(0, 1000) + '...' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('create')}
                    className="border-nexus-border hover:bg-nexus-bg-secondary"
                  >
                    Use for Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rewrite" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Sparkles className="w-5 h-5 mr-2 text-nexus-violet" />
                AI Content Rewriting
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Rewrite existing content with custom instructions, tone, and length preferences.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-nexus-text-primary">Original Content</Label>
                <Textarea
                  value={rewriteContent}
                  onChange={(e) => setRewriteContent(e.target.value)}
                  placeholder="Paste your content here..."
                  rows={6}
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-nexus-text-primary">Instructions</Label>
                  <Input
                    value={rewriteInstructions}
                    onChange={(e) => setRewriteInstructions(e.target.value)}
                    placeholder="e.g., Make it more engaging"
                    className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  />
                </div>
                <div>
                  <Label className="text-nexus-text-primary">Tone</Label>
                  <Select value={rewriteTone} onValueChange={setRewriteTone}>
                    <SelectTrigger className="mt-1 border-nexus-border">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-nexus-text-primary">Length</Label>
                  <Select value={rewriteLength} onValueChange={setRewriteLength}>
                    <SelectTrigger className="mt-1 border-nexus-border">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shorter">Shorter</SelectItem>
                      <SelectItem value="same">Same length</SelectItem>
                      <SelectItem value="longer">Longer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleRewriteContent}
                disabled={!rewriteContent.trim() || isRewriting}
                className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white"
              >
                {isRewriting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Rewriting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Rewrite Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {rewrittenContent && (
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Rewritten Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-nexus-bg-secondary p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-nexus-text-primary">
                    {rewrittenContent}
                  </pre>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
                      <Copy className="w-4 h-4 mr-2 text-nexus-blue" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
                      <Download className="w-4 h-4 mr-2 text-nexus-blue" />
                      Export
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewArticle(prev => ({ ...prev, content: rewrittenContent }))
                      setActiveTab('create')
                    }}
                    className="bg-nexus-blue hover:bg-nexus-accent text-white"
                  >
                    Use for Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Image className="w-5 h-5 mr-2 text-nexus-green" />
                AI Image Generation
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Generate high-quality images for your content using AI.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-nexus-text-primary">Image Description</Label>
                <Textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  rows={3}
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <div>
                <Label className="text-nexus-text-primary">Style (Optional)</Label>
                <Select value={imageStyle} onValueChange={setImageStyle}>
                  <SelectTrigger className="mt-1 border-nexus-border">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    <SelectItem value="photorealistic">Photorealistic</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateImage}
                disabled={!imagePrompt.trim() || isGeneratingImage}
                className="w-full bg-nexus-green hover:bg-nexus-green/90 text-white"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedImage && (
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Generated Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img
                    src={generatedImage}
                    alt="Generated content"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
                      <Download className="w-4 h-4 mr-2 text-nexus-blue" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
                      <Copy className="w-4 h-4 mr-2 text-nexus-blue" />
                      Copy URL
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewArticle(prev => ({ ...prev, featured_image: generatedImage }))
                      setActiveTab('create')
                    }}
                    className="bg-nexus-blue hover:bg-nexus-accent text-white"
                  >
                    Use for Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <FileText className="w-5 h-5 mr-2 text-nexus-blue" />
                Create Article
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Create and publish articles with SEO optimization.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-nexus-text-primary">Title *</Label>
                  <Input
                    value={newArticle.title}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Article title"
                    className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  />
                </div>
                <div>
                  <Label className="text-nexus-text-primary">Status</Label>
                  <Select
                    value={newArticle.status}
                    onValueChange={(value: 'draft' | 'published' | 'archived') =>
                      setNewArticle(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="mt-1 border-nexus-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-nexus-text-primary">Excerpt</Label>
                <Textarea
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the article..."
                  rows={2}
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <div>
                <Label className="text-nexus-text-primary">Content *</Label>
                <Textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Article content..."
                  rows={10}
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <div>
                <Label className="text-nexus-text-primary">Tags (comma-separated)</Label>
                <Input
                  value={newArticle.tags?.join(', ')}
                  onChange={(e) => setNewArticle(prev => ({
                    ...prev,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  }))}
                  placeholder="tag1, tag2, tag3"
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <Button
                onClick={handleCreateArticle}
                disabled={!newArticle.title || !newArticle.content || isCreatingArticle}
                className="w-full bg-nexus-blue hover:bg-nexus-accent text-white"
              >
                {isCreatingArticle ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Article
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Your Articles</CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Manage and track your published content.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-nexus-blue" />
                  <span className="ml-2 text-nexus-text-secondary">Loading articles...</span>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Articles Yet</h3>
                  <p className="text-nexus-text-secondary mb-4">
                    Create your first article using the tools above.
                  </p>
                  <Button
                    onClick={() => setActiveTab('create')}
                    className="bg-nexus-blue hover:bg-nexus-accent text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Article
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article: Article) => (
                    <div key={article.id} className="p-4 border border-nexus-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-nexus-text-primary">{article.title}</h3>
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                      </div>

                      {article.excerpt && (
                        <p className="text-sm text-nexus-text-secondary mb-3">{article.excerpt}</p>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-nexus-text-tertiary">
                          <span>{article.word_count} words</span>
                          <span>{article.reading_time} min read</span>
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                            <Eye className="w-4 h-4 text-nexus-blue" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                            <Edit className="w-4 h-4 text-nexus-text-tertiary" />
                          </Button>
                        </div>
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs border-nexus-border">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}