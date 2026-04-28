'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Video,
  Wand2,
  Download,
  Play,
  Pause,
  RefreshCw,
  Save,
  Share,
  Link,
  Type,
  Image as ImageIcon,
  Music,
  Scissors,
  Sparkles,
  Zap,
  Clock,
  Globe,
  Settings,
  Trash2
} from 'lucide-react'

interface VideoScene {
  id: string
  content: string
  visual_type: 'image' | 'video' | 'text' | 'animation'
  visual_url?: string
  duration: number
  voiceover_text: string
  transition: string
  order: number
}

interface GeneratedVideo {
  id: string
  source_type: 'url' | 'article' | 'text'
  source_url?: string
  source_text?: string
  title: string
  duration: number
  resolution: string
  style: string
  voice: string
  scenes: VideoScene[]
  video_url: string
  thumbnail_url: string
  created_at: string
}

export default function ArticleToVideoPage() {
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Input state
  const [inputType, setInputType] = useState<'url' | 'article' | 'text'>('url')
  const [articleUrl, setArticleUrl] = useState('')
  const [articleText, setArticleText] = useState('')
  const [title, setTitle] = useState('')

  // Video parameters
  const [duration, setDuration] = useState([60])
  const [resolution, setResolution] = useState('1080p')
  const [style, setStyle] = useState('modern')
  const [voice, setVoice] = useState('natural')
  const [includeMusic, setIncludeMusic] = useState(true)
  const [includeCaptions, setIncludeCaptions] = useState(true)

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null)

  // Video library
  const [videoLibrary, setVideoLibrary] = useState<GeneratedVideo[]>([])

  // Playback
  const [isPlaying, setIsPlaying] = useState(false)

  const styles = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-like quality' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' },
    { id: 'dynamic', name: 'Dynamic', description: 'High energy and motion' },
    { id: 'corporate', name: 'Corporate', description: 'Professional business' },
    { id: 'educational', name: 'Educational', description: 'Clear and informative' }
  ]

  const voices = [
    { id: 'natural', name: 'Natural', language: 'English' },
    { id: 'professional', name: 'Professional', language: 'English' },
    { id: 'casual', name: 'Casual', language: 'English' },
    { id: 'energetic', name: 'Energetic', language: 'English' },
    { id: 'calm', name: 'Calm', language: 'English' },
    { id: 'dramatic', name: 'Dramatic', language: 'English' }
  ]

  const resolutions = [
    { id: '720p', name: '720p HD', width: 1280, height: 720 },
    { id: '1080p', name: '1080p Full HD', width: 1920, height: 1080 },
    { id: '4k', name: '4K UHD', width: 3840, height: 2160 }
  ]

  useEffect(() => {
    loadVideoLibrary()
  }, [])

  const loadVideoLibrary = async () => {
    try {
      // Mock video library - would load from API
      setVideoLibrary([
        {
          id: '1',
          source_type: 'url',
          source_url: 'https://example.com/article-1',
          title: 'The Future of AI in Business',
          duration: 120,
          resolution: '1080p',
          style: 'modern',
          voice: 'natural',
          scenes: [
            {
              id: 'scene-1',
              content: 'Introduction to AI in business',
              visual_type: 'image',
              visual_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
              duration: 10,
              voiceover_text: 'Artificial Intelligence is transforming the business landscape...',
              transition: 'fade',
              order: 1
            }
          ],
          video_url: 'https://example.com/videos/video-1.mp4',
          thumbnail_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
          created_at: '2026-04-20T10:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Error loading video library:', error)
    }
  }

  const handleGenerateVideo = async () => {
    if (inputType === 'url' && !articleUrl.trim()) return
    if (inputType === 'text' && !articleText.trim()) return
    if (inputType === 'article' && !articleText.trim()) return

    try {
      setIsGenerating(true)
      setGenerationProgress(0)
      setCurrentStep('Analyzing content...')

      // Simulate multi-step progress
      const steps = [
        { progress: 20, step: 'Extracting key points...' },
        { progress: 40, step: 'Generating script...' },
        { progress: 60, step: 'Creating scenes...' },
        { progress: 80, step: 'Generating voiceover...' },
        { progress: 90, step: 'Compiling video...' }
      ]

      let stepIndex = 0
      const progressInterval = setInterval(() => {
        if (stepIndex < steps.length) {
          setGenerationProgress(steps[stepIndex].progress)
          setCurrentStep(steps[stepIndex].step)
          stepIndex++
        } else {
          clearInterval(progressInterval)
        }
      }, 1500)

      const data = await apiClient.convertArticleToVideo({
        article_url: inputType === 'url' ? articleUrl : '',
        content: inputType !== 'url' ? articleText : '',
        duration: duration[0],
        style,
        voice
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)
      setCurrentStep('Video generated successfully!')

      const newVideo: GeneratedVideo = {
        id: data.video_id || `video-${Date.now()}`,
        source_type: inputType,
        source_url: inputType === 'url' ? articleUrl : undefined,
        source_text: inputType !== 'url' ? articleText.substring(0, 500) : undefined,
        title: title || 'Generated Video',
        duration: duration[0],
        resolution,
        style,
        voice,
        scenes: data.scenes || [],
        video_url: data.video_url,
        thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
        created_at: new Date().toISOString()
      }

      setGeneratedVideo(newVideo)
      setVideoLibrary(prev => [newVideo, ...prev])

      // Reset form
      setArticleUrl('')
      setArticleText('')
      setTitle('')
    } catch (error) {
      console.error('Error generating video:', error)
      alert('Failed to generate video. Please check your API keys and try again.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
      setCurrentStep('')
    }
  }

  const playVideo = (video: GeneratedVideo) => {
    if (videoRef.current) {
      if (videoRef.current.src !== video.video_url) {
        videoRef.current.src = video.video_url
      }

      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const downloadVideo = (video: GeneratedVideo, format: 'mp4' | 'webm') => {
    const link = document.createElement('a')
    link.download = `${video.title}.${format}`
    link.href = video.video_url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteVideo = (videoId: string) => {
    setVideoLibrary(prev => prev.filter(v => v.id !== videoId))
    if (generatedVideo?.id === videoId) {
      setGeneratedVideo(null)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Article → Video</h1>
          <p className="text-nexus-text-secondary">Transform articles and text into engaging videos</p>
        </div>

        {generatedVideo && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => playVideo(generatedVideo)}
              className="border-nexus-border"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Select onValueChange={(value: 'mp4' | 'webm') => downloadVideo(generatedVideo, value)}>
              <SelectTrigger className="w-36 border-nexus-border">
                <SelectValue placeholder="Download" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">Download MP4</SelectItem>
                <SelectItem value="webm">Download WebM</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-nexus-border">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Tabs defaultValue="create" className="flex-1 flex flex-col">
          <TabsList className="m-4 mb-0">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Input */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-nexus-text-primary">
                    <FileText className="w-5 h-5 mr-2 text-nexus-blue" />
                    Content Source
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input Type Selector */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Source Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={inputType === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInputType('url')}
                        className="border-nexus-border"
                      >
                        <Link className="w-4 h-4 mr-2" />
                        URL
                      </Button>
                      <Button
                        variant={inputType === 'article' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInputType('article')}
                        className="border-nexus-border"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Article
                      </Button>
                      <Button
                        variant={inputType === 'text' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInputType('text')}
                        className="border-nexus-border"
                      >
                        <Type className="w-4 h-4 mr-2" />
                        Text
                      </Button>
                    </div>
                  </div>

                  {/* URL Input */}
                  {inputType === 'url' && (
                    <div className="space-y-2">
                      <Label className="text-nexus-text-primary font-medium">Article URL</Label>
                      <Input
                        value={articleUrl}
                        onChange={(e) => setArticleUrl(e.target.value)}
                        placeholder="https://example.com/article"
                        className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                      />
                    </div>
                  )}

                  {/* Article/Text Input */}
                  {(inputType === 'article' || inputType === 'text') && (
                    <div className="space-y-2">
                      <Label className="text-nexus-text-primary font-medium">
                        {inputType === 'article' ? 'Paste Article' : 'Enter Text'}
                      </Label>
                      <Textarea
                        value={articleText}
                        onChange={(e) => setArticleText(e.target.value)}
                        placeholder={
                          inputType === 'article'
                            ? 'Paste your article content here...'
                            : 'Enter the text you want to convert to video...'
                        }
                        rows={10}
                        className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue resize-none"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Video Title</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter video title (optional)"
                      className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Video Settings */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-nexus-text-primary">
                    <Settings className="w-5 h-5 mr-2 text-nexus-violet" />
                    Video Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Duration */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label className="text-nexus-text-primary font-medium">Duration</Label>
                      <span className="text-nexus-text-secondary">{duration[0]} seconds</span>
                    </div>
                    <Slider
                      value={duration}
                      onValueChange={setDuration}
                      max={300}
                      min={15}
                      step={15}
                      className="w-full"
                    />
                  </div>

                  {/* Resolution */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Resolution</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {resolutions.map(r => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} ({r.width}x{r.height})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Style */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Video Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Voice</Label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} ({v.language})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <Label className="text-nexus-text-primary font-medium">Options</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMusic}
                          onChange={(e) => setIncludeMusic(e.target.checked)}
                          className="rounded border-nexus-border"
                        />
                        <span className="text-sm text-nexus-text-primary">Include background music</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeCaptions}
                          onChange={(e) => setIncludeCaptions(e.target.checked)}
                          className="rounded border-nexus-border"
                        />
                        <span className="text-sm text-nexus-text-primary">Include captions</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generate Button */}
            <div className="mt-6 space-y-4">
              <Button
                onClick={handleGenerateVideo}
                disabled={
                  ((inputType === 'url' && !articleUrl.trim()) ||
                    (inputType !== 'url' && !articleText.trim())) ||
                  isGenerating
                }
                className="w-full bg-nexus-blue hover:bg-nexus-accent text-white h-12"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    {currentStep}... {generationProgress.toFixed(0)}%
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>

              {/* Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={generationProgress} className="w-full h-2" />
                  <p className="text-sm text-nexus-text-secondary text-center">{currentStep}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="library" className="flex-1 overflow-y-auto p-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Video Library</CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Your generated videos
                </p>
              </CardHeader>
              <CardContent>
                {videoLibrary.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Videos Yet</h3>
                    <p className="text-nexus-text-secondary mb-6">
                      Transform your first article into video to get started.
                    </p>
                    <Button
                      onClick={() => (document.querySelector('[data-value="create"]') as HTMLElement)?.click()}
                      className="bg-nexus-blue hover:bg-nexus-accent text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videoLibrary.map((video) => (
                      <div key={video.id} className="border border-nexus-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-32 h-20 bg-nexus-bg-secondary rounded-lg overflow-hidden">
                              <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-nexus-text-primary">{video.title}</h4>
                              <div className="flex items-center space-x-3 text-sm text-nexus-text-secondary mt-1">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDuration(video.duration)}
                                </span>
                                <Badge variant="outline" className="border-nexus-border">
                                  {video.resolution}
                                </Badge>
                                <Badge variant="outline" className="border-nexus-border capitalize">
                                  {video.style}
                                </Badge>
                              </div>
                              <p className="text-sm text-nexus-text-secondary mt-1">
                                Source: {video.source_type === 'url' ? 'URL' : 'Text'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setGeneratedVideo(video)
                                ;(document.querySelector('[data-value="preview"]') as HTMLElement)?.click()
                              }}
                              className="border-nexus-border"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadVideo(video, 'mp4')}
                              className="border-nexus-border"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteVideo(video.id)}
                              className="border-nexus-red text-nexus-red hover:bg-nexus-red/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Scenes Preview */}
                        {video.scenes.length > 0 && (
                          <div>
                            <div className="text-sm text-nexus-text-tertiary mb-2">Scenes</div>
                            <div className="flex space-x-2 overflow-x-auto">
                              {video.scenes.map((scene, index) => (
                                <div
                                  key={scene.id}
                                  className="flex-shrink-0 w-24 border border-nexus-border rounded p-2"
                                >
                                  <div className="text-xs text-nexus-text-secondary mb-1">Scene {index + 1}</div>
                                  <div className="text-xs text-nexus-text-primary truncate">
                                    {scene.content}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 p-6">
            <Card className="border-nexus-border h-full">
              <CardContent className="h-full flex flex-col items-center justify-center p-8">
                {generatedVideo ? (
                  <div className="w-full max-w-4xl space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-nexus-text-primary mb-2">{generatedVideo.title}</h3>
                      <div className="flex items-center justify-center space-x-4 text-sm text-nexus-text-secondary">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDuration(generatedVideo.duration)}
                        </span>
                        <Badge variant="outline" className="border-nexus-border">
                          {generatedVideo.resolution}
                        </Badge>
                        <Badge variant="outline" className="border-nexus-border capitalize">
                          {generatedVideo.style}
                        </Badge>
                      </div>
                    </div>

                    {/* Video Player */}
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full"
                        controls
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                      >
                        <source src={generatedVideo.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>

                    {/* Video Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Source Type</div>
                        <div className="font-medium text-nexus-text-primary capitalize">
                          {generatedVideo.source_type}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Duration</div>
                        <div className="font-medium text-nexus-text-primary">
                          {formatDuration(generatedVideo.duration)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Style</div>
                        <div className="font-medium text-nexus-text-primary capitalize">
                          {generatedVideo.style}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Voice</div>
                        <div className="font-medium text-nexus-text-primary capitalize">
                          {generatedVideo.voice}
                        </div>
                      </div>
                    </div>

                    {/* Scenes */}
                    {generatedVideo.scenes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-nexus-text-primary mb-3">Scenes</h4>
                        <div className="space-y-2">
                          {generatedVideo.scenes.map((scene, index) => (
                            <div
                              key={scene.id}
                              className="flex items-center space-x-4 p-3 bg-nexus-bg-secondary rounded-lg"
                            >
                              <Badge variant="outline" className="border-nexus-border">
                                {index + 1}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm text-nexus-text-primary">{scene.content}</p>
                                <p className="text-xs text-nexus-text-secondary mt-1">
                                  {scene.voiceover_text.substring(0, 100)}...
                                </p>
                              </div>
                              <div className="text-sm text-nexus-text-secondary">
                                {scene.duration}s
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        onClick={() => playVideo(generatedVideo)}
                        className="bg-nexus-blue hover:bg-nexus-accent text-white"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadVideo(generatedVideo, 'mp4')}
                        className="border-nexus-border"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="border-nexus-border">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video className="w-24 h-24 text-nexus-text-tertiary mb-6" />
                    <h3 className="text-2xl font-semibold text-nexus-text-primary mb-2">No Video Selected</h3>
                    <p className="text-nexus-text-secondary mb-6">
                      Generate or select a video to preview
                    </p>
                    <Button
                      onClick={() => (document.querySelector('[data-value="create"]') as HTMLElement)?.click()}
                      className="bg-nexus-blue hover:bg-nexus-accent text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Video
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
