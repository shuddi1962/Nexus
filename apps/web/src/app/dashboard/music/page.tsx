'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Music,
  Play,
  Pause,
  Download,
  Wand2,
  Volume2,
  VolumeX,
  RefreshCw,
  Save,
  Share,
  Headphones,
  Activity,
  Clock,
  Zap
} from 'lucide-react'

interface GeneratedMusic {
  id: string
  prompt: string
  duration: number
  genre: string
  mood: string
  instruments: string[]
  audio_url: string
  waveform_data: number[]
  bpm: number
  key: string
  created_at: string
}

export default function MusicCreatorPage() {
  const { user } = useAuth()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([80])
  const [isMuted, setIsMuted] = useState(false)

  // Generation parameters
  const [prompt, setPrompt] = useState('')
  const [duration_setting, setDurationSetting] = useState([60])
  const [genre, setGenre] = useState('')
  const [mood, setMood] = useState('')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedMusic, setGeneratedMusic] = useState<GeneratedMusic | null>(null)

  // Music library
  const [musicLibrary, setMusicLibrary] = useState<GeneratedMusic[]>([])

  const genres = [
    'electronic', 'ambient', 'classical', 'jazz', 'rock', 'pop', 'hip-hop',
    'country', 'folk', 'reggae', 'blues', 'funk', 'disco', 'techno', 'house'
  ]

  const moods = [
    'happy', 'sad', 'energetic', 'calm', 'mysterious', 'romantic', 'epic',
    'melancholic', 'uplifting', 'dark', 'peaceful', 'intense', 'dreamy', 'aggressive'
  ]

  const instruments = [
    'piano', 'guitar', 'bass', 'drums', 'strings', 'brass', 'woodwinds',
    'synth', 'vocals', 'percussion', 'harp', 'organ', 'flute', 'trumpet'
  ]

  useEffect(() => {
    loadMusicLibrary()
  }, [])

  const loadMusicLibrary = async () => {
    try {
      // Mock music library - would load from API
      setMusicLibrary([
        {
          id: '1',
          prompt: 'Upbeat electronic track for a tech startup',
          duration: 60,
          genre: 'electronic',
          mood: 'energetic',
          instruments: ['synth', 'drums', 'bass'],
          audio_url: 'https://example.com/music-1.mp3',
          waveform_data: Array.from({ length: 100 }, () => Math.random()),
          bpm: 128,
          key: 'C Minor',
          created_at: '2026-04-20T10:00:00Z'
        },
        {
          id: '2',
          prompt: 'Calm ambient background music',
          duration: 120,
          genre: 'ambient',
          mood: 'peaceful',
          instruments: ['strings', 'piano', 'synth'],
          audio_url: 'https://example.com/music-2.mp3',
          waveform_data: Array.from({ length: 100 }, () => Math.random()),
          bpm: 60,
          key: 'A Major',
          created_at: '2026-04-19T14:30:00Z'
        }
      ])
    } catch (error) {
      console.error('Error loading music library:', error)
    }
  }

  const toggleInstrument = (instrument: string) => {
    setSelectedInstruments(prev =>
      prev.includes(instrument)
        ? prev.filter(i => i !== instrument)
        : [...prev, instrument]
    )
  }

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) return

    try {
      setIsGenerating(true)
      setGenerationProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * 15
        })
      }, 1000)

      const data = await apiClient.generateMusic({
        prompt,
        duration: duration_setting[0],
        genre,
        mood,
        instruments: selectedInstruments
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      const newMusic: GeneratedMusic = {
        id: data.music_id || `music-${Date.now()}`,
        prompt,
        duration: duration_setting[0],
        genre: genre || 'mixed',
        mood: mood || 'neutral',
        instruments: selectedInstruments,
        audio_url: data.audio_url,
        waveform_data: data.waveform_data || Array.from({ length: 100 }, () => Math.random()),
        bpm: data.bpm || 120,
        key: data.key || 'C Major',
        created_at: new Date().toISOString()
      }

      setGeneratedMusic(newMusic)
      setMusicLibrary(prev => [newMusic, ...prev])
    } catch (error) {
      console.error('Error generating music:', error)
      alert('Failed to generate music. Please check your API keys and try again.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const playMusic = (music: GeneratedMusic) => {
    if (audioRef.current) {
      if (audioRef.current.src !== music.audio_url) {
        audioRef.current.src = music.audio_url
      }

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderWaveform = (data: number[], height: number = 40) => {
    const width = data.length * 2
    const maxAmplitude = Math.max(...data)

    return (
      <svg width={width} height={height} className="overflow-visible">
        {data.map((amplitude, index) => (
          <rect
            key={index}
            x={index * 2}
            y={height / 2 - (amplitude / maxAmplitude) * height / 2}
            width="1"
            height={(amplitude / maxAmplitude) * height}
            fill="#0066CC"
            opacity="0.8"
          />
        ))}
      </svg>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Music Creator</h1>
          <p className="text-nexus-text-secondary">AI-powered music generation for your content</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Download className="w-4 h-4 mr-2 text-nexus-blue" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Tabs defaultValue="generate" className="flex-1 flex flex-col">
          <TabsList className="m-4 mb-0">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="player">Player</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="flex-1 overflow-y-auto p-6 space-y-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="flex items-center text-nexus-text-primary">
                  <Wand2 className="w-5 h-5 mr-2 text-nexus-violet" />
                  AI Music Generation
                </CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Describe the music you want to create and let AI compose it for you.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <Label className="text-nexus-text-primary font-medium">Describe Your Music</Label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., An upbeat electronic track with driving bass and synth melodies for a tech product launch..."
                    rows={4}
                    className="w-full px-3 py-2 border border-nexus-border rounded-md focus:ring-nexus-blue focus:border-nexus-blue resize-none"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label className="text-nexus-text-primary font-medium">Duration</Label>
                    <span className="text-nexus-text-secondary">{duration_setting[0]} seconds</span>
                  </div>
                  <Slider
                    value={duration_setting}
                    onValueChange={setDurationSetting}
                    max={300}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                </div>

                {/* Genre and Mood */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Genre</Label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map(g => (
                          <SelectItem key={g} value={g}>
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Mood</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map(m => (
                          <SelectItem key={m} value={m}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Instruments */}
                <div className="space-y-2">
                  <Label className="text-nexus-text-primary font-medium">Instruments (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {instruments.map(instrument => (
                      <Badge
                        key={instrument}
                        variant={selectedInstruments.includes(instrument) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedInstruments.includes(instrument)
                            ? 'bg-nexus-blue text-white'
                            : 'border-nexus-border hover:bg-nexus-bg-secondary'
                        }`}
                        onClick={() => toggleInstrument(instrument)}
                      >
                        {instrument}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateMusic}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white h-12"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating Music... {generationProgress.toFixed(0)}%
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Music
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                {isGenerating && (
                  <Progress value={generationProgress} className="w-full h-2" />
                )}
              </CardContent>
            </Card>

            {/* Generated Music Preview */}
            {generatedMusic && (
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Generated Music</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Waveform Visualization */}
                  <div className="bg-nexus-bg-secondary p-4 rounded-lg">
                    <div className="flex items-center justify-center">
                      {renderWaveform(generatedMusic.waveform_data, 60)}
                    </div>
                  </div>

                  {/* Music Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-nexus-text-tertiary">Genre</div>
                      <div className="font-medium text-nexus-text-primary capitalize">
                        {generatedMusic.genre}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-nexus-text-tertiary">Mood</div>
                      <div className="font-medium text-nexus-text-primary capitalize">
                        {generatedMusic.mood}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-nexus-text-tertiary">BPM</div>
                      <div className="font-medium text-nexus-text-primary">
                        {generatedMusic.bpm}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-nexus-text-tertiary">Key</div>
                      <div className="font-medium text-nexus-text-primary">
                        {generatedMusic.key}
                      </div>
                    </div>
                  </div>

                  {/* Instruments */}
                  {generatedMusic.instruments.length > 0 && (
                    <div>
                      <div className="text-sm text-nexus-text-tertiary mb-2">Instruments</div>
                      <div className="flex flex-wrap gap-1">
                        {generatedMusic.instruments.map(instrument => (
                          <Badge key={instrument} variant="secondary" className="border-nexus-border">
                            {instrument}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-nexus-border">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-nexus-border">
                        <Download className="w-4 h-4 mr-2 text-nexus-blue" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="border-nexus-border">
                        <Save className="w-4 h-4 mr-2 text-nexus-blue" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="border-nexus-border">
                        <Share className="w-4 h-4 mr-2 text-nexus-blue" />
                        Share
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playMusic(generatedMusic)}
                        className="border-nexus-border"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMute}
                        className="border-nexus-border"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="library" className="flex-1 overflow-y-auto p-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Music Library</CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Your generated music collection
                </p>
              </CardHeader>
              <CardContent>
                {musicLibrary.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Music Yet</h3>
                    <p className="text-nexus-text-secondary mb-6">
                      Generate your first AI music track to get started.
                    </p>
                    <Button
                      onClick={() => (document.querySelector('[data-value="generate"]') as HTMLElement)?.click()}
                      className="bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Music
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {musicLibrary.map((music) => (
                      <div key={music.id} className="p-4 border border-nexus-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Headphones className="w-8 h-8 text-nexus-violet" />
                            <div>
                              <h3 className="font-medium text-nexus-text-primary line-clamp-1">
                                {music.prompt}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-nexus-text-secondary">
                                <span className="capitalize">{music.genre}</span>
                                <span className="capitalize">{music.mood}</span>
                                <span>{music.bpm} BPM</span>
                                <span>{music.duration}s</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-nexus-border">
                              {music.key}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => playMusic(music)}
                              className="border-nexus-border"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-nexus-border">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Mini Waveform */}
                        <div className="bg-nexus-bg-secondary p-3 rounded-lg">
                          <div className="flex items-center justify-center">
                            {renderWaveform(music.waveform_data.slice(0, 50), 30)}
                          </div>
                        </div>

                        {/* Instruments */}
                        {music.instruments.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {music.instruments.map(instrument => (
                              <Badge key={instrument} variant="secondary" className="text-xs border-nexus-border">
                                {instrument}
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

          <TabsContent value="player" className="flex-1 p-6">
            <Card className="border-nexus-border h-full">
              <CardContent className="p-8 h-full flex flex-col items-center justify-center">
                <Music className="w-24 h-24 text-nexus-text-tertiary mb-6" />

                {generatedMusic ? (
                  <div className="w-full max-w-md text-center space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-nexus-text-primary mb-2">
                        Now Playing
                      </h3>
                      <p className="text-nexus-text-secondary line-clamp-2">
                        {generatedMusic.prompt}
                      </p>
                    </div>

                    {/* Large Waveform */}
                    <div className="bg-nexus-bg-secondary p-6 rounded-lg">
                      <div className="flex items-center justify-center">
                        {renderWaveform(generatedMusic.waveform_data, 80)}
                      </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                          className="border-nexus-border"
                        >
                          -10s
                        </Button>

                        <Button
                          size="lg"
                          onClick={() => playMusic(generatedMusic)}
                          className="bg-nexus-blue hover:bg-nexus-accent text-white px-8"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                          className="border-nexus-border"
                        >
                          +10s
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Slider
                          value={[currentTime]}
                          onValueChange={(value) => handleSeek(value[0])}
                          max={duration}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-nexus-text-secondary">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleMute}
                          className="border-nexus-border"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <Slider
                          value={volume}
                          onValueChange={(value) => {
                            setVolume(value)
                            if (audioRef.current) {
                              audioRef.current.volume = value[0] / 100
                            }
                          }}
                          max={100}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-nexus-text-secondary w-12">
                          {volume[0]}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-nexus-text-primary mb-2">
                      No Music Selected
                    </h3>
                    <p className="text-nexus-text-secondary mb-6">
                      Generate or select music to play
                    </p>
                    <Button
                      onClick={() => (document.querySelector('[data-value="generate"]') as HTMLElement)?.click()}
                      className="bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Music
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}