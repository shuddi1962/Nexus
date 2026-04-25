'use client'

import { useState, useRef } from 'react'
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
  Play,
  Download,
  RefreshCw,
  Settings,
  Volume2,
  Mic,
  Eye,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react'

interface ArticleData {
  title: string
  content: string
  excerpt: string
  author?: string
  published_date?: string
  word_count: number
  reading_time: number
  images: Array<{
    src: string
    alt?: string
  }>
  headings: string[]
}

interface VideoResult {
  id: string
  video_url: string
  thumbnail_url: string
  transcript: string
  duration: number
  style: string
  voice: string
  scenes: Array<{
    start_time: number
    end_time: number
    content: string
    visuals: string
  }>
  audio_tracks: Array<{
    type: string
    voice?: string
    text?: string
    genre?: string
    volume?: number
  }>
}

export default function ArticleToVideoPage() {
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [articleUrl, setArticleUrl] = useState('')
  const [articleData, setArticleData] = useState<ArticleData | null>(null)
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)

  // Conversion settings
  const [targetStyle, setTargetStyle] = useState('professional')
  const [voice, setVoice] = useState('neutral')
  const [duration, setDuration] = useState([300]) // 5 minutes default
  const [platform, setPlatform] = useState('youtube')
  const [includeImages, setIncludeImages] = useState(true)
  const [addBackgroundMusic, setAddBackgroundMusic] = useState(true)

  const styles = [
    { id: 'professional', name: 'Professional', description: 'Clean, corporate style' },
    { id: 'casual', name: 'Casual', description: 'Friendly and approachable' },
    { id: 'educational', name: 'Educational', description: 'Informative and structured' },
    { id: 'engaging', name: 'Engaging', description: 'Dynamic and attention-grabbing' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' }
  ]

  const voices = [
    { id: 'neutral', name: 'Neutral', gender: 'Unisex', accent: 'American' },
    { id: 'male_professional', name: 'Professional Male', gender: 'Male', accent: 'American' },
    { id: 'female_professional', name: 'Professional Female', gender: 'Female', accent: 'American' },
    { id: 'male_casual', name: 'Casual Male', gender: 'Male', accent: 'American' },
    { id: 'female_casual', name: 'Casual Female', gender: 'Female', accent: 'American' },
    { id: 'male_british', name: 'British Male', gender: 'Male', accent: 'British' },
    { id: 'female_british', name: 'British Female', gender: 'Female', accent: 'British' }
  ]

  const platforms = [
    { id: 'youtube', name: 'YouTube', aspectRatio: '16:9', recommendedDuration: '8-15 min' },
    { id: 'tiktok', name: 'TikTok', aspectRatio: '9:16', recommendedDuration: '30-60 sec' },
    { id: 'instagram', name: 'Instagram', aspectRatio: '9:16', recommendedDuration: '30-90 sec' },
    { id: 'linkedin', name: 'LinkedIn', aspectRatio: '16:9', recommendedDuration: '3-5 min' },
    { id: 'twitter', name: 'Twitter/X', aspectRatio: '16:9', recommendedDuration: '30-60 sec' }
  ]

  const handleExtractArticle = async () => {
    if (!articleUrl.trim()) return

    try {
      setIsExtracting(true)
      const data = await apiClient.extractArticle(articleUrl.trim())
      setArticleData(data)
    } catch (error) {
      console.error('Error extracting article:', error)
      alert('Failed to extract article. Please check the URL and try again.')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleConvertToVideo = async () => {
    if (!articleData) return

    try {
      setIsConverting(true)
      setConversionProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * 10
        })
      }, 1000)

      const data = await apiClient.convertArticleToVideo({
        article_url: articleUrl,
        style: targetStyle,
        voice,
        duration: duration[0]
      })

      clearInterval(progressInterval)
      setConversionProgress(100)
      setVideoResult(data)
    } catch (error) {
      console.error('Error converting article to video:', error)
      alert('Failed to convert article to video. Please check your API keys and try again.')
    } finally {
      setIsConverting(false)
      setConversionProgress(0)
    }
  }

  const downloadVideo = (format: 'mp4' | 'webm' = 'mp4') => {
    if (!videoResult) return

    const link = document.createElement('a')
    link.download = `article-video.${format}`
    link.href = videoResult.video_url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentPlatform = platforms.find(p => p.id === platform)

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Article to Video</h1>
          <p className="text-nexus-text-secondary">Convert articles into engaging videos with AI narration</p>
        </div>

        {videoResult && (
          <div className="flex items-center space-x-3">
            <Select onValueChange={(value: 'mp4' | 'webm') => downloadVideo(value)}>
              <SelectTrigger className="w-32 border-nexus-border">
                <SelectValue placeholder="Download" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">Download MP4</SelectItem>
                <SelectItem value="webm">Download WebM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Tabs defaultValue="extract" className="flex-1 flex flex-col">
          <TabsList className="m-4 mb-0">
            <TabsTrigger value="extract">Extract Article</TabsTrigger>
            <TabsTrigger value="convert">Convert to Video</TabsTrigger>
            <TabsTrigger value="preview">Video Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="extract" className="flex-1 overflow-y-auto p-6 space-y-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="flex items-center text-nexus-text-primary">
                  <FileText className="w-5 h-5 mr-2 text-nexus-blue" />
                  Article Extraction
                </CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Extract clean, readable content from any article URL for video conversion.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="https://example.com/article-url"
                    className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  />
                  <Button
                    onClick={handleExtractArticle}
                    disabled={!articleUrl.trim() || isExtracting}
                    className="bg-nexus-blue hover:bg-nexus-accent text-white"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Extract
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {articleData && (
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Extracted Article</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-nexus-text-primary font-medium">Title</Label>
                      <p className="text-sm text-nexus-text-secondary mt-1">{articleData.title}</p>
                    </div>
                    <div>
                      <Label className="text-nexus-text-primary font-medium">Word Count</Label>
                      <p className="text-sm text-nexus-text-secondary mt-1">{articleData.word_count} words</p>
                    </div>
                    <div>
                      <Label className="text-nexus-text-primary font-medium">Reading Time</Label>
                      <p className="text-sm text-nexus-text-secondary mt-1">{articleData.reading_time} minutes</p>
                    </div>
                  </div>

                  {articleData.excerpt && (
                    <div>
                      <Label className="text-nexus-text-primary font-medium">Excerpt</Label>
                      <p className="text-sm text-nexus-text-secondary mt-1 p-3 bg-nexus-bg-secondary rounded-lg">
                        {articleData.excerpt}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-nexus-text-primary font-medium">Content Preview</Label>
                    <div className="mt-2 p-4 bg-nexus-bg-secondary rounded-lg max-h-40 overflow-y-auto">
                      <div className="text-sm text-nexus-text-primary prose prose-sm max-w-none">
                        {articleData.content.substring(0, 500)}...
                      </div>
                    </div>
                  </div>

                  {articleData.headings.length > 0 && (
                    <div>
                      <Label className="text-nexus-text-primary font-medium">Headings</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {articleData.headings.slice(0, 5).map((heading, index) => (
                          <Badge key={index} variant="outline" className="border-nexus-border text-xs">
                            {heading}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={() => (document.querySelector('[data-value="convert"]') as HTMLElement)?.click()}
                      className="bg-nexus-green hover:bg-nexus-green/90 text-white"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Convert to Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="convert" className="flex-1 overflow-y-auto p-6 space-y-6">
            {!articleData ? (
              <Card className="border-nexus-border">
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
                    No Article Extracted
                  </h3>
                  <p className="text-nexus-text-secondary mb-6">
                    Extract an article first to convert it to video.
                  </p>
                  <Button
                    onClick={() => document.querySelector('[data-value="extract"]')?.click()}
                    className="bg-nexus-blue hover:bg-nexus-accent text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Extract Article
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-nexus-border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-nexus-text-primary">
                      <Video className="w-5 h-5 mr-2 text-nexus-violet" />
                      Video Conversion Settings
                    </CardTitle>
                    <p className="text-sm text-nexus-text-secondary">
                      Customize your video settings for optimal engagement.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Platform Selection */}
                    <div className="space-y-3">
                      <Label className="text-nexus-text-primary font-medium">Target Platform</Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="border-nexus-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{p.name}</span>
                                <Badge variant="outline" className="border-nexus-border ml-2">
                                  {p.aspectRatio}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {currentPlatform && (
                        <p className="text-sm text-nexus-text-secondary">
                          Recommended duration: {currentPlatform.recommendedDuration}
                        </p>
                      )}
                    </div>

                    {/* Style Selection */}
                    <div className="space-y-3">
                      <Label className="text-nexus-text-primary font-medium">Video Style</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {styles.map(style => (
                          <div
                            key={style.id}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                              targetStyle === style.id
                                ? 'border-nexus-violet bg-nexus-violet/10'
                                : 'border-nexus-border hover:border-nexus-violet/50'
                            }`}
                            onClick={() => setTargetStyle(style.id)}
                          >
                            <div className="font-medium text-nexus-text-primary">{style.name}</div>
                            <div className="text-sm text-nexus-text-secondary">{style.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Voice Selection */}
                    <div className="space-y-3">
                      <Label className="text-nexus-text-primary font-medium">Narrator Voice</Label>
                      <Select value={voice} onValueChange={setVoice}>
                        <SelectTrigger className="border-nexus-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map(v => (
                            <SelectItem key={v.id} value={v.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{v.name}</span>
                                <div className="flex items-center space-x-2 text-xs text-nexus-text-secondary">
                                  <span>{v.gender}</span>
                                  <span>•</span>
                                  <span>{v.accent}</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <Label className="text-nexus-text-primary font-medium">Video Duration</Label>
                        <span className="text-nexus-text-secondary">{formatTime(duration[0])}</span>
                      </div>
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        max={1800}
                        min={30}
                        step={30}
                        className="w-full"
                      />
                      <p className="text-xs text-nexus-text-secondary">
                        Based on {articleData.word_count} words, approximately {Math.ceil(articleData.word_count / 150)} minutes of content
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      <Label className="text-nexus-text-primary font-medium">Options</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeImages}
                            onChange={(e) => setIncludeImages(e.target.checked)}
                            className="rounded border-nexus-border"
                          />
                          <span className="text-sm text-nexus-text-primary">Include article images</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addBackgroundMusic}
                            onChange={(e) => setAddBackgroundMusic(e.target.checked)}
                            className="rounded border-nexus-border"
                          />
                          <span className="text-sm text-nexus-text-primary">Add background music</span>
                        </label>
                      </div>
                    </div>

                    {/* Convert Button */}
                    <Button
                      onClick={handleConvertToVideo}
                      disabled={isConverting}
                      className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white h-12"
                    >
                      {isConverting ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Converting... {conversionProgress.toFixed(0)}%
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Convert to Video
                        </>
                      )}
                    </Button>

                    {/* Progress Bar */}
                    {isConverting && (
                      <Progress value={conversionProgress} className="w-full h-2" />
                    )}
                  </CardContent>
                </Card>

                {/* Article Summary */}
                <Card className="border-nexus-border">
                  <CardHeader>
                    <CardTitle className="text-nexus-text-primary">Article Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nexus-text-primary">
                          {articleData.word_count}
                        </div>
                        <div className="text-sm text-nexus-text-secondary">Words</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nexus-text-primary">
                          {articleData.reading_time}
                        </div>
                        <div className="text-sm text-nexus-text-secondary">Minutes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nexus-text-primary">
                          {articleData.images.length}
                        </div>
                        <div className="text-sm text-nexus-text-secondary">Images</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-nexus-text-primary">
                          {articleData.headings.length}
                        </div>
                        <div className="text-sm text-nexus-text-secondary">Sections</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="preview" className="flex-1 p-6">
            {videoResult ? (
              <div className="space-y-6">
                <Card className="border-nexus-border">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={videoResult.video_url}
                        poster={videoResult.thumbnail_url}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-nexus-border">
                    <CardHeader>
                      <CardTitle className="text-nexus-text-primary">Video Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-nexus-text-secondary">Duration</span>
                        <span className="font-medium">{formatTime(videoResult.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nexus-text-secondary">Style</span>
                        <Badge className="bg-nexus-violet text-white capitalize">
                          {videoResult.style}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nexus-text-secondary">Voice</span>
                        <span className="font-medium capitalize">
                          {videoResult.voice.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-nexus-text-secondary">Scenes</span>
                        <span className="font-medium">{videoResult.scenes.length}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-border">
                    <CardHeader>
                      <CardTitle className="text-nexus-text-primary">Audio Tracks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {videoResult.audio_tracks.map((track, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {track.type === 'voiceover' && <Mic className="w-4 h-4 text-nexus-blue" />}
                            {track.type === 'background_music' && <Volume2 className="w-4 h-4 text-nexus-green" />}
                            <span className="text-sm capitalize">{track.type.replace('_', ' ')}</span>
                          </div>
                          <div className="text-sm text-nexus-text-secondary">
                            {track.voice && `Voice: ${track.voice}`}
                            {track.genre && `Genre: ${track.genre}`}
                            {track.volume && `Vol: ${track.volume}%`}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-nexus-border">
                  <CardHeader>
                    <CardTitle className="text-nexus-text-primary">Video Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-60 overflow-y-auto p-4 bg-nexus-bg-secondary rounded-lg">
                      <p className="text-sm text-nexus-text-primary leading-relaxed">
                        {videoResult.transcript}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-nexus-border">
                <CardContent className="text-center py-12">
                  <Video className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
                    No Video Generated
                  </h3>
                  <p className="text-nexus-text-secondary mb-6">
                    Extract an article and convert it to video to see the preview.
                  </p>
                  <Button
                    onClick={() => document.querySelector('[data-value="extract"]')?.click()}
                    className="bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Start Conversion
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}