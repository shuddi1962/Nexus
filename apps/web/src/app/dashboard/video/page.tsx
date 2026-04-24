'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Scissors,
  Plus,
  Download,
  Upload,
  Film,
  Music,
  Type,
  Image,
  Settings
} from 'lucide-react'

interface TimelineTrack {
  id: string
  type: 'video' | 'audio' | 'text' | 'image'
  name: string
  clips: TimelineClip[]
}

interface TimelineClip {
  id: string
  startTime: number
  duration: number
  src?: string
  text?: string
  effects?: any[]
}

export default function VideoEditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)

  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: 'video-1',
      type: 'video',
      name: 'Video Track 1',
      clips: [
        {
          id: 'clip-1',
          startTime: 0,
          duration: 30,
          src: '/sample-video.mp4'
        }
      ]
    },
    {
      id: 'audio-1',
      type: 'audio',
      name: 'Audio Track 1',
      clips: [
        {
          id: 'audio-clip-1',
          startTime: 0,
          duration: 30,
          src: '/sample-audio.mp3'
        }
      ]
    },
    {
      id: 'text-1',
      type: 'text',
      name: 'Text Track 1',
      clips: [
        {
          id: 'text-clip-1',
          startTime: 5,
          duration: 10,
          text: 'Welcome to NEXUS'
        }
      ]
    }
  ])

  const [zoom, setZoom] = useState(1)
  const pixelsPerSecond = 20 * zoom

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      setCurrentTime(video.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (video) {
      setDuration(video.duration)
    }
  }

  const handleSeek = (newTime: number) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const addTrack = (type: TimelineTrack['type']) => {
    const trackNumber = tracks.filter(t => t.type === type).length + 1
    const newTrack: TimelineTrack = {
      id: `${type}-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Track ${trackNumber}`,
      clips: []
    }
    setTracks(prev => [...prev, newTrack])
  }

  const addClip = (trackId: string, type: TimelineClip['id']) => {
    // In real implementation, this would open file picker or create new clip
    console.log(`Adding ${type} clip to track ${trackId}`)
  }

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Film className="w-4 h-4" />
      case 'audio':
        return <Music className="w-4 h-4" />
      case 'text':
        return <Type className="w-4 h-4" />
      case 'image':
        return <Image className="w-4 h-4" />
      default:
        return <Film className="w-4 h-4" />
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => addTrack('video')}>
            <Film className="w-4 h-4 mr-2" />
            Add Video Track
          </Button>
          <Button variant="outline" onClick={() => addTrack('audio')}>
            <Music className="w-4 h-4 mr-2" />
            Add Audio Track
          </Button>
          <Button variant="outline" onClick={() => addTrack('text')}>
            <Type className="w-4 h-4 mr-2" />
            Add Text Track
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Media
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Video
          </Button>
        </div>
      </div>

      {/* Video Preview */}
      <div className="bg-gray-900 p-8 flex justify-center">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full max-w-4xl h-auto bg-black"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            poster="/video-placeholder.jpg"
          >
            <source src="/sample-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => handleSeek(Math.max(0, currentTime - 10))}>
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => handleSeek(Math.min(duration, currentTime + 10))}>
                <SkipForward className="w-4 h-4" />
              </Button>

              <div className="flex-1 mx-4">
                <Slider
                  value={[currentTime]}
                  onValueChange={([value]) => handleSeek(value)}
                  max={duration}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={([value]) => {
                    setVolume(value)
                    if (videoRef.current) {
                      videoRef.current.volume = value
                    }
                  }}
                  max={1}
                  step={0.1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Timeline Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-900">Timeline</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}>
                Zoom Out
              </Button>
              <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.5))}>
                Zoom In
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Scissors className="w-4 h-4 mr-2" />
              Split
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Effects
            </Button>
          </div>
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            {/* Track Labels */}
            <div className="w-48 bg-gray-100 border-r border-gray-200">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`p-3 border-b border-gray-200 flex items-center space-x-3 cursor-pointer hover:bg-gray-200 ${
                    selectedTrack === track.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  <div className="text-gray-600">{getTrackIcon(track.type)}</div>
                  <div>
                    <div className="font-medium text-sm">{track.name}</div>
                    <div className="text-xs text-gray-500">{track.clips.length} clips</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Grid */}
            <div className="flex-1 relative">
              {/* Time Ruler */}
              <div className="h-8 bg-gray-200 border-b border-gray-300 flex items-center">
                {Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, i) => (
                  <div key={i} className="flex items-center" style={{ marginLeft: i === 0 ? 0 : 5 * pixelsPerSecond - 40 }}>
                    <div className="w-px h-4 bg-gray-400"></div>
                    <span className="text-xs text-gray-600 ml-1">{formatTime(i * 5)}</span>
                  </div>
                ))}
              </div>

              {/* Tracks Timeline */}
              {tracks.map((track, trackIndex) => (
                <div key={track.id} className="relative" style={{ height: '60px' }}>
                  {/* Track Background */}
                  <div className="absolute inset-0 bg-white border-b border-gray-200"></div>

                  {/* Clips */}
                  {track.clips.map((clip) => (
                    <div
                      key={clip.id}
                      className="absolute top-2 bottom-2 bg-blue-500 rounded cursor-pointer hover:bg-blue-600 flex items-center px-2"
                      style={{
                        left: clip.startTime * pixelsPerSecond,
                        width: clip.duration * pixelsPerSecond,
                      }}
                    >
                      <div className="text-white text-xs truncate">
                        {clip.text || `Clip ${clip.id.slice(-1)}`}
                      </div>
                    </div>
                  ))}

                  {/* Playhead */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
                    style={{ left: currentTime * pixelsPerSecond }}
                  >
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Footer */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Duration: {formatTime(duration)}</span>
            <span>Tracks: {tracks.length}</span>
            <span>Total Clips: {tracks.reduce((sum, track) => sum + track.clips.length, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}