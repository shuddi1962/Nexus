'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Send,
  Mail,
  Phone,
  Search,
  Filter,
  Plus,
  User,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface Conversation {
  id: string
  contact: string
  channel: 'email' | 'sms' | 'whatsapp' | 'phone'
  lastMessage: string
  timestamp: string
  unread: boolean
  status: 'open' | 'pending' | 'closed'
}

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      contact: 'Sarah Johnson',
      channel: 'email',
      lastMessage: 'Thank you for the quick response!',
      timestamp: '2026-04-24T15:30:00Z',
      unread: true,
      status: 'open'
    },
    {
      id: '2',
      contact: 'Mike Chen',
      channel: 'whatsapp',
      lastMessage: 'Can we schedule a demo?',
      timestamp: '2026-04-24T14:45:00Z',
      unread: false,
      status: 'pending'
    },
    {
      id: '3',
      contact: 'Emma Davis',
      channel: 'sms',
      lastMessage: 'Product arrived, thank you!',
      timestamp: '2026-04-24T12:20:00Z',
      unread: false,
      status: 'closed'
    },
    {
      id: '4',
      contact: 'John Smith',
      channel: 'phone',
      lastMessage: 'Left voicemail about pricing',
      timestamp: '2026-04-24T10:15:00Z',
      unread: true,
      status: 'open'
    }
  ]

  const filteredConversations = conversations.filter(conv =>
    conv.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sms':
        return <MessageSquare className="w-4 h-4" />
      case 'whatsapp':
        return <Phone className="w-4 h-4" />
      case 'phone':
        return <Phone className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-100 text-blue-800'
      case 'sms':
        return 'bg-green-100 text-green-800'
      case 'whatsapp':
        return 'bg-green-100 text-green-800'
      case 'phone':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="h-screen flex">
      {/* Conversations List */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
            <Button size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer mb-1 hover:bg-gray-100 ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border border-blue-200' : ''
                } ${conversation.unread ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-600">
                      {conversation.contact.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.contact}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(conversation.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getChannelColor(conversation.channel)}>
                        {getChannelIcon(conversation.channel)}
                        <span className="ml-1 capitalize">{conversation.channel}</span>
                      </Badge>
                      <Badge className={getStatusColor(conversation.status)}>
                        {conversation.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>

                {conversation.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {conversations.find(c => c.id === selectedConversation)?.contact}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {conversations.find(c => c.id === selectedConversation)?.channel} conversation
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">You</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-900">Thank you for reaching out! I'd be happy to help you with your marketing needs.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">SJ</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">Sarah Johnson</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-900">That sounds great! Can you tell me more about your email marketing features?</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">You</span>
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-900">Absolutely! Our email marketing platform includes advanced segmentation, A/B testing, automation workflows, and detailed analytics. Would you like me to schedule a demo?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}