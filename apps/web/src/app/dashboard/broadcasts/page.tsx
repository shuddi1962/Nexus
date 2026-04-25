'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  MonitorSpeaker,
  Send,
  Users,
  MessageSquare,
  Mail,
  Phone,
  Plus,
  Play,
  Pause,
  Settings,
  BarChart3,
  Clock,
  Target,
  Globe,
  Smartphone,
  Volume2,
  Zap,
  Calendar,
  Eye,
  ThumbsUp,
  Share2
} from 'lucide-react'

interface Broadcast {
  id: string
  name: string
  type: 'email' | 'sms' | 'voice' | 'social' | 'push'
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed'
  recipients: number
  sent: number
  delivered: number
  opened?: number
  clicked?: number
  scheduledFor?: string
  createdAt: string
  content: string
  channels: string[]
}

interface Channel {
  id: string
  name: string
  type: 'email' | 'sms' | 'voice' | 'social' | 'push'
  icon: any
  connected: boolean
  subscribers: number
}

export default function BroadcastingPage() {
  const [selectedBroadcast, setSelectedBroadcast] = useState<string | null>(null)
  const [broadcastContent, setBroadcastContent] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  // Mock data
  const channels: Channel[] = [
    {
      id: 'email',
      name: 'Email Marketing',
      type: 'email',
      icon: Mail,
      connected: true,
      subscribers: 12450
    },
    {
      id: 'sms',
      name: 'SMS Marketing',
      type: 'sms',
      icon: MessageSquare,
      connected: true,
      subscribers: 8760
    },
    {
      id: 'voice',
      name: 'Voice Calls',
      type: 'voice',
      icon: Phone,
      connected: true,
      subscribers: 5430
    },
    {
      id: 'push',
      name: 'Push Notifications',
      type: 'push',
      icon: Smartphone,
      connected: true,
      subscribers: 32100
    },
    {
      id: 'facebook',
      name: 'Facebook',
      type: 'social',
      icon: Users,
      connected: true,
      subscribers: 45200
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      type: 'social',
      icon: Globe,
      connected: true,
      subscribers: 12800
    }
  ]

  const broadcasts: Broadcast[] = [
    {
      id: '1',
      name: 'Product Launch Announcement',
      type: 'email',
      status: 'completed',
      recipients: 12450,
      sent: 12450,
      delivered: 11800,
      opened: 4200,
      clicked: 890,
      createdAt: '2026-04-20T10:00:00Z',
      content: 'Exciting news! Our new AI-powered marketing platform is now live...',
      channels: ['email']
    },
    {
      id: '2',
      name: 'Flash Sale Alert',
      type: 'sms',
      status: 'completed',
      recipients: 8760,
      sent: 8760,
      delivered: 8500,
      createdAt: '2026-04-22T14:30:00Z',
      content: '⚡ FLASH SALE: 50% off all plans! Limited time offer. Visit nexus.app/sale',
      channels: ['sms']
    },
    {
      id: '3',
      name: 'Weekly Newsletter',
      type: 'email',
      status: 'scheduled',
      recipients: 12450,
      sent: 0,
      delivered: 0,
      scheduledFor: '2026-04-27T09:00:00Z',
      createdAt: '2026-04-24T16:00:00Z',
      content: 'Your weekly digest of marketing tips, industry news, and platform updates...',
      channels: ['email']
    },
    {
      id: '4',
      name: 'Appointment Reminders',
      type: 'voice',
      status: 'sending',
      recipients: 150,
      sent: 87,
      delivered: 82,
      createdAt: '2026-04-24T15:45:00Z',
      content: 'This is a reminder of your appointment tomorrow at 2 PM with our sales team.',
      channels: ['voice']
    },
    {
      id: '5',
      name: 'Social Media Campaign',
      type: 'social',
      status: 'draft',
      recipients: 57700,
      sent: 0,
      delivered: 0,
      createdAt: '2026-04-24T12:00:00Z',
      content: '🚀 Revolutionize your marketing with AI-powered automation...',
      channels: ['facebook', 'twitter']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'sending':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelIcon = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId)
    return channel ? channel.icon : Settings
  }

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Broadcasting Hub</h1>
          <p className="text-gray-600">Send messages across multiple channels simultaneously.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Broadcast
          </Button>
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Audience Builder
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Broadcast
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">156K</div>
                <div className="text-sm text-gray-600">Messages Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">42.3%</div>
                <div className="text-sm text-gray-600">Open Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ThumbsUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">8.7%</div>
                <div className="text-sm text-gray-600">Click Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-gray-600">Active Channels</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="broadcasts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="composer">Composer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="broadcasts" className="space-y-6">
          {/* Recent Broadcasts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Broadcasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {broadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {React.createElement(getChannelIcon(broadcast.channels[0]), {
                            className: "w-5 h-5 text-blue-600"
                          })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{broadcast.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(broadcast.status)}>
                            {broadcast.status}
                          </Badge>
                          <span className="text-sm text-gray-600 capitalize">
                            {broadcast.type}
                          </span>
                          <span className="text-sm text-gray-600">
                            {broadcast.sent}/{broadcast.recipients} sent
                          </span>
                        </div>
                        {broadcast.scheduledFor && (
                          <p className="text-xs text-gray-500 mt-1">
                            Scheduled for {formatDate(broadcast.scheduledFor)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {broadcast.opened !== undefined && (
                        <div className="text-center">
                          <div className="text-sm font-medium">{broadcast.opened}</div>
                          <div className="text-xs text-gray-500">Opened</div>
                        </div>
                      )}
                      {broadcast.clicked !== undefined && (
                        <div className="text-center">
                          <div className="text-sm font-medium">{broadcast.clicked}</div>
                          <div className="text-xs text-gray-500">Clicked</div>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBroadcast(broadcast.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${channel.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {React.createElement(channel.icon, {
                          className: `w-5 h-5 ${channel.connected ? 'text-green-600' : 'text-gray-400'}`
                        })}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <Badge className={channel.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {channel.connected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    {channel.subscribers.toLocaleString()} subscribers
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="composer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Channel Broadcast Composer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Channel Selection */}
              <div className="space-y-4">
                <Label>Select Channels</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel.id}
                        checked={selectedChannels.includes(channel.id)}
                        onCheckedChange={() => handleChannelToggle(channel.id)}
                        disabled={!channel.connected}
                      />
                      <label
                        htmlFor={channel.id}
                        className="flex items-center space-x-2 text-sm cursor-pointer"
                      >
                        {React.createElement(channel.icon, { className: "w-4 h-4" })}
                        <span>{channel.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Composer */}
              <div className="space-y-2">
                <Label htmlFor="content">Broadcast Content</Label>
                <Textarea
                  id="content"
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Enter your broadcast message..."
                  rows={8}
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{broadcastContent.length} characters</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                    <Button variant="outline" size="sm">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Text-to-Speech
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {broadcastContent && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedChannels.map((channelId) => {
                        const channel = channels.find(c => c.id === channelId)
                        if (!channel) return null

                        return (
                          <div key={channelId} className="border rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              {React.createElement(channel.icon, { className: "w-4 h-4" })}
                              <span className="font-medium text-sm">{channel.name}</span>
                            </div>
                            <p className="text-sm text-gray-600">{broadcastContent}</p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Segment Audience
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Test Send
                  </Button>
                  <Button disabled={selectedChannels.length === 0 || !broadcastContent.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Broadcast
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Send className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">98.7%</div>
                    <div className="text-sm text-gray-600">Delivery Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Share2 className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">23.4%</div>
                    <div className="text-sm text-gray-600">Engagement Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">4.2</div>
                    <div className="text-sm text-gray-600">Avg. Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.filter(c => c.connected).map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {React.createElement(channel.icon, { className: "w-5 h-5 text-gray-600" })}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">94.2%</div>
                        <div className="text-gray-500">Delivery</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">42.1%</div>
                        <div className="text-gray-500">Open Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">8.7%</div>
                        <div className="text-gray-500">Click Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}