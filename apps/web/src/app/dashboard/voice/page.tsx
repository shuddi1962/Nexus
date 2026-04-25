'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Phone,
  Mic,
  Play,
  Pause,
  Save,
  Settings,
  Plus,
  Users,
  Clock,
  Volume2,
  FileAudio,
  Zap,
  History,
  BarChart3,
  Upload,
  Download,
  Globe
} from 'lucide-react'

interface VoiceCall {
  id: string
  name: string
  phoneNumber: string
  status: 'scheduled' | 'completed' | 'failed' | 'in-progress'
  duration?: number
  transcript?: string
  recordingUrl?: string
  createdAt: string
  voiceId: string
  script: string
}

interface VoiceProfile {
  id: string
  name: string
  language: string
  gender: 'male' | 'female' | 'neutral'
  accent: string
  sampleUrl?: string
  isCloned: boolean
}

export default function VoicePage() {
  const [selectedCall, setSelectedCall] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [callScript, setCallScript] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')

  // Mock data
  const voiceProfiles: VoiceProfile[] = [
    {
      id: '1',
      name: 'Emma Professional',
      language: 'English',
      gender: 'female',
      accent: 'American',
      isCloned: false
    },
    {
      id: '2',
      name: 'Marcus Corporate',
      language: 'English',
      gender: 'male',
      accent: 'British',
      isCloned: false
    },
    {
      id: '3',
      name: 'Sarah Warm',
      language: 'English',
      gender: 'female',
      accent: 'Australian',
      isCloned: false
    },
    {
      id: '4',
      name: 'CEO Voice Clone',
      language: 'English',
      gender: 'male',
      accent: 'American',
      isCloned: true
    }
  ]

  const calls: VoiceCall[] = [
    {
      id: '1',
      name: 'Customer Follow-up',
      phoneNumber: '+1 (555) 123-4567',
      status: 'completed',
      duration: 245,
      transcript: 'Hello, this is a follow-up call about your recent purchase...',
      recordingUrl: '#',
      createdAt: '2026-04-24T14:30:00Z',
      voiceId: '1',
      script: 'Hello! Thank you for your recent purchase. I wanted to follow up and see how everything is working for you...'
    },
    {
      id: '2',
      name: 'Lead Qualification',
      phoneNumber: '+1 (555) 987-6543',
      status: 'in-progress',
      createdAt: '2026-04-24T15:15:00Z',
      voiceId: '2',
      script: 'Hi there! I noticed you downloaded our whitepaper recently. I\'d love to learn more about your business needs...'
    },
    {
      id: '3',
      name: 'Appointment Reminder',
      phoneNumber: '+1 (555) 456-7890',
      status: 'scheduled',
      createdAt: '2026-04-24T16:00:00Z',
      voiceId: '3',
      script: 'This is a friendly reminder about your appointment tomorrow at 2 PM. We look forward to seeing you!'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice AI & Calls</h1>
          <p className="text-gray-600">AI-powered voice calls, text-to-speech, and voice cloning.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Audio
          </Button>
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            Call History
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Call
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Phone className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm text-gray-600">Calls Made</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">23m 45s</div>
                <div className="text-sm text-gray-600">Total Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-600">Active Voices</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calls" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calls">Voice Calls</TabsTrigger>
          <TabsTrigger value="voices">Voice Library</TabsTrigger>
          <TabsTrigger value="scripts">Call Scripts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="space-y-6">
          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Voice Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{call.name}</h3>
                        <p className="text-sm text-gray-600">{call.phoneNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(call.status)}>
                            {call.status}
                          </Badge>
                          {call.duration && (
                            <span className="text-xs text-gray-500">
                              {formatDuration(call.duration)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {call.recordingUrl && (
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCall(call.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Call Composer */}
          <Card>
            <CardHeader>
              <CardTitle>Compose New Voice Call</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Phone Number</Label>
                  <Input
                    id="recipient"
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice">Voice Profile</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceProfiles.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center space-x-2">
                            <span>{voice.name}</span>
                            {voice.isCloned && (
                              <Badge variant="secondary" className="text-xs">Cloned</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="script">Call Script</Label>
                <Textarea
                  id="script"
                  value={callScript}
                  onChange={(e) => setCallScript(e.target.value)}
                  placeholder="Enter the script for your voice call..."
                  rows={6}
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{callScript.length} characters</span>
                  <Button variant="outline" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Record Script
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Preview Voice
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button>
                    <Phone className="w-4 h-4 mr-2" />
                    Make Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voiceProfiles.map((voice) => (
              <Card key={voice.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{voice.name}</CardTitle>
                    {voice.isCloned && (
                      <Badge className="bg-purple-100 text-purple-800">Cloned</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Language:</span>
                      <div className="font-medium">{voice.language}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <div className="font-medium capitalize">{voice.gender}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Accent:</span>
                      <div className="font-medium">{voice.accent}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="font-medium">{voice.isCloned ? 'Cloned' : 'AI Generated'}</div>
                    </div>
                  </div>

                  {voice.sampleUrl && (
                    <Button variant="outline" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Play Sample
                    </Button>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Clone a New Voice</h3>
              <p className="text-gray-600 mb-6">
                Upload audio samples to create a custom voice clone for your calls.
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Voice Sample
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Script Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: '1',
                    name: 'Customer Follow-up',
                    category: 'Sales',
                    usage: 23,
                    lastModified: '2026-04-20'
                  },
                  {
                    id: '2',
                    name: 'Appointment Reminder',
                    category: 'Support',
                    usage: 45,
                    lastModified: '2026-04-18'
                  },
                  {
                    id: '3',
                    name: 'Lead Qualification',
                    category: 'Marketing',
                    usage: 12,
                    lastModified: '2026-04-15'
                  }
                ].map((script) => (
                  <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{script.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{script.category}</Badge>
                        <span className="text-sm text-gray-600">
                          Used {script.usage} times • Modified {script.lastModified}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Phone className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-sm text-gray-600">Answer Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">4.7</div>
                    <div className="text-sm text-gray-600">Avg. Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">2.3m</div>
                    <div className="text-sm text-gray-600">Avg. Duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Voice Call Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Answer Rate Trend</span>
                    <span className="text-green-600">+5.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Call Quality Score</span>
                    <span className="text-green-600">+2.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Customer Satisfaction</span>
                    <span className="text-green-600">+1.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}