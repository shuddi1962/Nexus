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
  MessageSquare,
  Send,
  Users,
  Bot,
  Phone,
  Mail,
  Smartphone,
  Globe,
  Settings,
  Plus,
  Search,
  Filter,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mic,
  Volume2,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  Star,
  Trash2,
  Reply,
  Forward,
  Pin,
  Archive
} from 'lucide-react'

interface Chat {
  id: string
  name: string
  type: 'direct' | 'group' | 'channel'
  platform: 'internal' | 'whatsapp' | 'telegram' | 'discord' | 'slack'
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  participants: string[]
  isOnline: boolean
  avatar?: string
}

interface Message {
  id: string
  chatId: string
  sender: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file' | 'voice'
  status: 'sent' | 'delivered' | 'read'
  reactions?: { emoji: string; count: number; users: string[] }[]
}

interface Integration {
  id: string
  name: string
  platform: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  messages: number
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Marketing Team',
      type: 'group',
      platform: 'internal',
      lastMessage: 'Great work on the new campaign!',
      lastMessageTime: '2026-04-24T15:30:00Z',
      unreadCount: 3,
      participants: ['john@nexus.demo', 'sarah@nexus.demo', 'mike@nexus.demo'],
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      type: 'direct',
      platform: 'internal',
      lastMessage: 'Can we schedule a call for tomorrow?',
      lastMessageTime: '2026-04-24T14:45:00Z',
      unreadCount: 0,
      participants: ['sarah@nexus.demo'],
      isOnline: true
    },
    {
      id: '3',
      name: 'Customer Support',
      type: 'channel',
      platform: 'slack',
      lastMessage: 'New ticket from ABC Corp',
      lastMessageTime: '2026-04-24T14:20:00Z',
      unreadCount: 12,
      participants: ['support-team'],
      isOnline: true
    },
    {
      id: '4',
      name: 'WhatsApp Business',
      type: 'direct',
      platform: 'whatsapp',
      lastMessage: 'Thank you for your help!',
      lastMessageTime: '2026-04-24T13:15:00Z',
      unreadCount: 1,
      participants: ['customer-123'],
      isOnline: false
    },
    {
      id: '5',
      name: 'Telegram Bot',
      type: 'direct',
      platform: 'telegram',
      lastMessage: 'Automated response sent',
      lastMessageTime: '2026-04-24T12:30:00Z',
      unreadCount: 0,
      participants: ['bot-user'],
      isOnline: true
    }
  ]

  const messages: Message[] = [
    {
      id: '1',
      chatId: '1',
      sender: 'John Smith',
      content: 'Hey team, great work on the new campaign!',
      timestamp: '2026-04-24T15:25:00Z',
      type: 'text',
      status: 'read',
      reactions: [{ emoji: '👍', count: 2, users: ['sarah', 'mike'] }]
    },
    {
      id: '2',
      chatId: '1',
      sender: 'Sarah Johnson',
      content: 'Thanks! The click-through rates are much higher than expected.',
      timestamp: '2026-04-24T15:27:00Z',
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      chatId: '1',
      sender: 'Mike Chen',
      content: 'Let\'s schedule a review meeting for next week.',
      timestamp: '2026-04-24T15:30:00Z',
      type: 'text',
      status: 'sent'
    }
  ]

  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Slack Workspace',
      platform: 'Slack',
      status: 'connected',
      lastSync: '2026-04-24T15:00:00Z',
      messages: 1247
    },
    {
      id: '2',
      name: 'WhatsApp Business',
      platform: 'WhatsApp',
      status: 'connected',
      lastSync: '2026-04-24T14:45:00Z',
      messages: 892
    },
    {
      id: '3',
      name: 'Telegram Bot',
      platform: 'Telegram',
      status: 'connected',
      lastSync: '2026-04-24T14:30:00Z',
      messages: 567
    },
    {
      id: '4',
      name: 'Discord Server',
      platform: 'Discord',
      status: 'error',
      lastSync: '2026-04-23T10:15:00Z',
      messages: 234
    }
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return <Phone className="w-4 h-4 text-green-500" />
      case 'telegram':
        return <Send className="w-4 h-4 text-blue-500" />
      case 'discord':
        return <Globe className="w-4 h-4 text-purple-500" />
      case 'slack':
        return <MessageSquare className="w-4 h-4 text-orange-500" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'disconnected':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    // In real app, this would send the message
    console.log('Sending message:', messageInput)
    setMessageInput('')
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer mb-1 hover:bg-gray-100 ${
                  selectedChat === chat.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {chat.type === 'group' || chat.type === 'channel' ? (
                        <Users className="w-5 h-5 text-gray-600" />
                      ) : (
                        <User className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    <div className="absolute -top-1 -right-1">
                      {getPlatformIcon(chat.platform)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {chat.type}
                        </Badge>
                        {chat.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {chats.find(c => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {chats.find(c => c.id === selectedChat)?.participants.length} participants
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.filter(m => m.chatId === selectedChat).map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 mb-2">
                      <p className="text-gray-900">{message.content}</p>
                    </div>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex space-x-1">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            className="bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-1 text-xs flex items-center space-x-1"
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="min-h-10 max-h-32 resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Only show when chat is selected */}
      {selectedChat && (
        <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
          <Tabs defaultValue="details" className="flex-1">
            <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="automations">AI</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conversation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <Badge variant="secondary" className="ml-2 capitalize">
                      {chats.find(c => c.id === selectedChat)?.type}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Platform</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getPlatformIcon(chats.find(c => c.id === selectedChat)?.platform || '')}
                      <span className="text-sm capitalize">
                        {chats.find(c => c.id === selectedChat)?.platform}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Participants</Label>
                    <div className="mt-2 space-y-2">
                      {chats.find(c => c.id === selectedChat)?.participants.map((participant, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {participant.split('@')[0][0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm">{participant}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automations" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Response Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Response
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bot className="w-4 h-4 mr-2" />
                    Auto-Reply Setup
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Smart Suggestions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Pin className="w-4 h-4 mr-2" />
                    Pin Conversation
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Chat
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Conversation
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Connected Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getPlatformIcon(integration.platform)}
                          <div>
                            <div className="font-medium text-sm">{integration.name}</div>
                            <div className="text-xs text-gray-600">
                              {integration.messages} messages • Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}