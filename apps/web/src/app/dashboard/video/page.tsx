'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Scissors,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Type,
  Image as ImageIcon,
  Music,
  Video,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Settings,
  Layers,
  Plus,
  Trash2,
  Copy,
  Move,
  Crop,
  Wand2,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface VideoTrack {
  id: string
  type: 'video' | 'audio' | 'text' | 'image'
  name: string
  duration: number
  startTime: number
  endTime: number
  src?: string
  content?: string
  style?: Record<string, unknown>
  effects?: VideoEffect[]
}

interface VideoEffect {
  id: string
  type: 'filter' | 'transition' | 'animation'
  name: string
  parameters: Record<string, unknown>
  startTime: number
  endTime: number
}

interface VideoProject {
  id: string
  name: string
  duration: number
  resolution: { width: number; height: number }
  fps: number
  tracks: VideoTrack[]
  currentTime: number
  isPlaying: boolean
}

export default function VideoEditorPage() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const [project, setProject] = useState<VideoProject>({
    id: '1',
    name: 'New Video Project',
    duration: 60, // 60 seconds
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    tracks: [],
    currentTime: 0,
    isPlaying: false
  })

  const [selectedTrack, setSelectedTrack] = useState<VideoTrack | null>(null)
  const [zoom, setZoom] = useState(1)
  const [tool, setTool] = useState<'select' | 'cut' | 'trim' | 'split'>('select')
  const [showPreview, setShowPreview] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  // Video properties
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const [volume, setVolume] = useState([100])
  const [speed, setSpeed] = useState([1])

  // Text overlay properties
  const [textContent, setTextContent] = useState('')
  const [textSize, setTextSize] = useState([24])
  const [textColor, setTextColor] = useState('#ffffff')
  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('video/')) {
        addVideoTrack(file)
      } else if (file.type.startsWith('audio/')) {
        addAudioTrack(file)
      } else if (file.type.startsWith('image/')) {
        addImageTrack(file)
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
      'audio/*': ['.mp3', '.wav', '.aac'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  })

  const addVideoTrack = (file: File) => {
    const track: VideoTrack = {
      id: `video-${Date.now()}`,
      type: 'video',
      name: file.name,
      duration: 0, // Will be set when video loads
      startTime: project.currentTime,
      endTime: project.currentTime + 10, // Default 10 seconds
      src: URL.createObjectURL(file),
      effects: []
    }

    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, track]
    }))

    // Load video to get duration
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      setProject(prev => ({
        ...prev,
        tracks: prev.tracks.map(t =>
          t.id === track.id ? { ...t, duration: video.duration, endTime: Math.min(project.currentTime + video.duration, project.duration) } : t
        )
      }))
    }
    video.src = track.src!
  }

  const addAudioTrack = (file: File) => {
    const track: VideoTrack = {
      id: `audio-${Date.now()}`,
      type: 'audio',
      name: file.name,
      duration: 0,
      startTime: project.currentTime,
      endTime: project.currentTime + 10,
      src: URL.createObjectURL(file),
      effects: []
    }

    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, track]
    }))
  }

  const addImageTrack = (file: File) => {
    const track: VideoTrack = {
      id: `image-${Date.now()}`,
      type: 'image',
      name: file.name,
      duration: 5, // Default 5 seconds for images
      startTime: project.currentTime,
      endTime: project.currentTime + 5,
      src: URL.createObjectURL(file),
      effects: []
    }

    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, track]
    }))
  }

  const addTextTrack = () => {
    const track: VideoTrack = {
      id: `text-${Date.now()}`,
      type: 'text',
      name: 'Text Overlay',
      duration: 5,
      startTime: project.currentTime,
      endTime: project.currentTime + 5,
      content: 'Your text here',
      style: {
        fontSize: textSize[0],
        color: textColor,
        position: textPosition
      },
      effects: []
    }

    setProject(prev => ({
      ...prev,
      tracks: [...prev.tracks, track]
    }))
  }

  const deleteTrack = (trackId: string) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.filter(t => t.id !== trackId)
    }))
    if (selectedTrack?.id === trackId) {
      setSelectedTrack(null)
    }
  }

  const updateTrack = (trackId: string, updates: Partial<VideoTrack>) => {
    setProject(prev => ({
      ...prev,
      tracks: prev.tracks.map(t => t.id === trackId ? { ...t, ...updates } : t)
    }))
  }

  const splitTrack = (trackId: string, time: number) => {
    const track = project.tracks.find(t => t.id === trackId)
    if (!track || time <= track.startTime || time >= track.endTime) return

    const firstPart: VideoTrack = {
      ...track,
      id: `${track.id}-1`,
      endTime: time
    }

    const secondPart: VideoTrack = {
      ...track,
      id: `${track.id}-2`,
      startTime: time
    }

    setProject(prev => ({
      ...prev,
      tracks: prev.tracks
        .filter(t => t.id !== trackId)
        .concat([firstPart, secondPart])
    }))
  }

  const playPause = () => {
    setProject(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }))
  }

  const seekTo = (time: number) => {
    setProject(prev => ({
      ...prev,
      currentTime: Math.max(0, Math.min(time, prev.duration))
    }))
  }

  const renderTimeline = () => {
    const pixelsPerSecond = 20 * zoom // pixels per second
    const timelineWidth = project.duration * pixelsPerSecond

    return (
      <div className="flex-1 overflow-x-auto bg-nexus-bg-secondary">
        <div
          ref={timelineRef}
          className="relative"
          style={{ width: timelineWidth, minWidth: '100%' }}
        >
          {/* Time ruler */}
          <div className="h-8 bg-nexus-bg border-b border-nexus-border flex items-center">
            {Array.from({ length: Math.ceil(project.duration) }, (_, i) => (
              <div key={i} className="relative" style={{ width: pixelsPerSecond }}>
                <div className="absolute left-0 top-0 h-2 w-px bg-nexus-border"></div>
                <div className="absolute left-1 top-2 text-xs text-nexus-text-secondary">
                  {i}s
                </div>
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="space-y-1 p-2">
            {project.tracks.map(track => (
              <div key={track.id} className="relative h-16 bg-white border border-nexus-border rounded">
                {/* Track header */}
                <div className="h-6 bg-nexus-bg border-b border-nexus-border flex items-center px-2">
                  <Badge variant="outline" className="mr-2 border-nexus-border">
                    {track.type}
                  </Badge>
                  <span className="text-sm text-nexus-text-primary truncate">
                    {track.name}
                  </span>
                </div>

                {/* Track content */}
                <div className="h-10 relative overflow-hidden">
                  <div
                    className={`absolute top-0 h-full bg-nexus-blue/20 border-2 cursor-pointer hover:bg-nexus-blue/30 transition-colors ${
                      selectedTrack?.id === track.id ? 'border-nexus-blue' : 'border-nexus-blue/50'
                    }`}
                    style={{
                      left: track.startTime * pixelsPerSecond,
                      width: (track.endTime - track.startTime) * pixelsPerSecond
                    }}
                    onClick={() => setSelectedTrack(track)}
                  >
                    <div className="h-full flex items-center justify-center">
                      {track.type === 'video' && <Video className="w-4 h-4 text-nexus-blue" />}
                      {track.type === 'audio' && <Music className="w-4 h-4 text-nexus-green" />}
                      {track.type === 'text' && <Type className="w-4 h-4 text-nexus-violet" />}
                      {track.type === 'image' && <ImageIcon className="w-4 h-4 text-nexus-amber" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-nexus-red z-10 pointer-events-none"
            style={{ left: project.currentTime * pixelsPerSecond }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-nexus-red rounded-full border-2 border-white shadow"></div>
          </div>
        </div>
      </div>
    )
  }

  const exportVideo = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          alert('Video exported successfully!')
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-xl font-bold text-nexus-text-primary">Video Editor</h1>
          <p className="text-nexus-text-secondary">Professional video editing with AI-powered tools</p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="border-nexus-border">
            {project.resolution.width}x{project.resolution.height} • {project.fps}fps
          </Badge>
          <Button variant="outline" className="border-nexus-border">
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
          <Button
            onClick={exportVideo}
            disabled={isExporting || project.tracks.length === 0}
            className="bg-nexus-blue hover:bg-nexus-accent text-white"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Video
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools & Media */}
        <div className="w-64 bg-white border-r border-nexus-border flex flex-col">
          <Tabs defaultValue="tools" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Editing Tools */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Tools</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tool === 'select' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('select')}
                    className="border-nexus-border"
                  >
                    <Move className="w-4 h-4 mr-2" />
                    Select
                  </Button>
                  <Button
                    variant={tool === 'cut' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('cut')}
                    className="border-nexus-border"
                  >
                    <Scissors className="w-4 h-4 mr-2" />
                    Cut
                  </Button>
                  <Button
                    variant={tool === 'trim' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('trim')}
                    className="border-nexus-border"
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    Trim
                  </Button>
                  <Button
                    variant={tool === 'split' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('split')}
                    className="border-nexus-border"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Split
                  </Button>
                </div>
              </div>

              {/* Add Elements */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Add Elements</Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTextTrack}
                    className="w-full border-nexus-border justify-start"
                  >
                    <Type className="w-4 h-4 mr-2 text-nexus-violet" />
                    Add Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <ImageIcon className="w-4 h-4 mr-2 text-nexus-amber" />
                    Add Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <Music className="w-4 h-4 mr-2 text-nexus-green" />
                    Add Audio
                  </Button>
                </div>
              </div>

              {/* AI Tools */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">AI Tools</Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <Wand2 className="w-4 h-4 mr-2 text-nexus-violet" />
                    Auto Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-nexus-amber" />
                    Enhance Quality
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <Label className="text-nexus-text-primary font-medium">Upload Media</Label>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-nexus-blue bg-nexus-blue/10'
                      : 'border-nexus-border hover:border-nexus-blue'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-nexus-text-tertiary mx-auto mb-2" />
                  <p className="text-sm text-nexus-text-secondary">
                    {isDragActive ? 'Drop files here' : 'Drop video, audio, or image files'}
                  </p>
                </div>

                {/* Current tracks */}
                {project.tracks.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Current Tracks</Label>
                    {project.tracks.map(track => (
                      <div key={track.id} className="flex items-center justify-between p-2 bg-nexus-bg-secondary rounded">
                        <div className="flex items-center space-x-2">
                          {track.type === 'video' && <Video className="w-4 h-4 text-nexus-blue" />}
                          {track.type === 'audio' && <Music className="w-4 h-4 text-nexus-green" />}
                          {track.type === 'text' && <Type className="w-4 h-4 text-nexus-violet" />}
                          {track.type === 'image' && <ImageIcon className="w-4 h-4 text-nexus-amber" />}
                          <span className="text-sm text-nexus-text-primary truncate max-w-32">
                            {track.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTrack(track.id)}
                          className="text-nexus-red hover:text-nexus-red hover:bg-nexus-red/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          {showPreview && (
            <div className="h-96 bg-black flex items-center justify-center relative">
              <canvas
                ref={canvasRef}
                width={project.resolution.width}
                height={project.resolution.height}
                className="max-w-full max-h-full"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => seekTo(0)}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={playPause}
                        className="text-white hover:bg-white/20"
                      >
                        {project.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => seekTo(project.duration)}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">
                        {formatTime(project.currentTime)} / {formatTime(project.duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        min={0}
                        step={1}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <Slider
                      value={[project.currentTime]}
                      onValueChange={(value) => seekTo(value[0])}
                      max={project.duration}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="flex-1 flex flex-col">
            <div className="h-12 bg-white border-b border-nexus-border flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                  className="border-nexus-border"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-nexus-text-primary">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="border-nexus-border"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="border-nexus-border"
                >
                  {showPreview ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Badge variant="outline" className="border-nexus-border">
                  {project.tracks.length} tracks
                </Badge>
              </div>
            </div>

            {renderTimeline()}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-white border-l border-nexus-border flex flex-col">
          <div className="p-4 border-b border-nexus-border">
            <h3 className="font-medium text-nexus-text-primary">Properties</h3>
          </div>

          {selectedTrack ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Track Info */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Track Info</Label>
                <div className="text-sm text-nexus-text-secondary space-y-1">
                  <div>Name: {selectedTrack.name}</div>
                  <div>Type: {selectedTrack.type}</div>
                  <div>Duration: {formatTime(selectedTrack.duration)}</div>
                  <div>Start: {formatTime(selectedTrack.startTime)}</div>
                  <div>End: {formatTime(selectedTrack.endTime)}</div>
                </div>
              </div>

              {/* Video Adjustments (for video tracks) */}
              {selectedTrack.type === 'video' && (
                <div className="space-y-4">
                  <Label className="text-nexus-text-primary font-medium">Video Adjustments</Label>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Brightness</span>
                      <span className="text-nexus-text-primary">{brightness[0]}%</span>
                    </div>
                    <Slider
                      value={brightness}
                      onValueChange={setBrightness}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Contrast</span>
                      <span className="text-nexus-text-primary">{contrast[0]}%</span>
                    </div>
                    <Slider
                      value={contrast}
                      onValueChange={setContrast}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Saturation</span>
                      <span className="text-nexus-text-primary">{saturation[0]}%</span>
                    </div>
                    <Slider
                      value={saturation}
                      onValueChange={setSaturation}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Speed</span>
                      <span className="text-nexus-text-primary">{speed[0]}x</span>
                    </div>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      max={2}
                      min={0.25}
                      step={0.25}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Audio Adjustments (for audio tracks) */}
              {selectedTrack.type === 'audio' && (
                <div className="space-y-4">
                  <Label className="text-nexus-text-primary font-medium">Audio Adjustments</Label>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Volume</span>
                      <span className="text-nexus-text-primary">{volume[0]}%</span>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Text Properties (for text tracks) */}
              {selectedTrack.type === 'text' && (
                <div className="space-y-4">
                  <Label className="text-nexus-text-primary font-medium">Text Properties</Label>

                  <div>
                    <Label className="text-sm text-nexus-text-secondary">Content</Label>
                    <Input
                      value={selectedTrack.content}
                      onChange={(e) => updateTrack(selectedTrack.id, { content: e.target.value })}
                      className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Font Size</span>
                      <span className="text-nexus-text-primary">{textSize[0]}px</span>
                    </div>
                    <Slider
                      value={textSize}
                      onValueChange={(value) => {
                        setTextSize(value)
                        updateTrack(selectedTrack.id, {
                          style: { ...selectedTrack.style, fontSize: value[0] }
                        })
                      }}
                      max={72}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-nexus-text-secondary">Text Color</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className="w-8 h-8 rounded border border-nexus-border cursor-pointer"
                        style={{ backgroundColor: textColor }}
                        onClick={() => {/* Open color picker */}}
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value)
                          updateTrack(selectedTrack.id, {
                            style: { ...selectedTrack.style, color: e.target.value }
                          })
                        }}
                        className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Effects */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Effects</Label>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full border-nexus-border justify-start">
                    <Wand2 className="w-4 h-4 mr-2 text-nexus-violet" />
                    Add Filter
                  </Button>
                  <Button variant="outline" size="sm" className="w-full border-nexus-border justify-start">
                    <Sparkles className="w-4 h-4 mr-2 text-nexus-amber" />
                    Add Transition
                  </Button>
                  <Button variant="outline" size="sm" className="w-full border-nexus-border justify-start">
                    <Move className="w-4 h-4 mr-2 text-nexus-green" />
                    Add Animation
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-nexus-text-secondary">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a track to edit its properties</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="fixed bottom-4 right-4 bg-white border border-nexus-border rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 animate-spin text-nexus-blue" />
            <div>
              <div className="font-medium text-nexus-text-primary">Exporting Video</div>
              <Progress value={exportProgress} className="w-32 mt-1" />
              <div className="text-sm text-nexus-text-secondary mt-1">{exportProgress}% complete</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}