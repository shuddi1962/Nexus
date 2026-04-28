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
  MessageCircle,
  Send,
  Phone,
  Settings,
  Plus,
  Users,
  Clock,
  CheckCircle,
  MessageSquare,
  Smartphone,
  Image,
  Paperclip,
  Smile,
  Search
} from 'lucide-react'

interface Conversation {
  id: string
  name: string
  phone: string
  lastMessage: string
  timestamp: string
  unread: number
  status: 'active' | 'resolved'
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'contact'
  timestamp: string
  type: 'text' | 'image' | 'document'
}

export default function WhatsAppPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1')
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      lastMessage: 'Thanks for the update!',
      timestamp: '2 min ago',
      unread: 2,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      lastMessage: 'When will my order ship?',
      timestamp: '15 min ago',
      unread: 0,
      status: 'active'
    },
    {
      id: '3',
      name: 'Tech Solutions Inc',
      phone: '+1 (555) 456-7890',
      lastMessage: 'Perfect, thank you!',
      timestamp: '1 hour ago',
      unread: 0,
      status: 'resolved'
    }
  ]

  const messages: Message[] = [
    { id: '1', content: 'Hi, I have a question about my order', sender: 'contact', timestamp: '10:30 AM', type: 'text' },
    { id: '2', content: 'Hello! I\'d be happy to help. What\'s your order number?', sender: 'user', timestamp: '10:31 AM', type: 'text' },
    { id: '3', content: 'It\'s ORD-12345', sender: 'contact', timestamp: '10:32 AM', type: 'text' },
    { id: '4', content: 'Let me check that for you.', sender: 'user', timestamp: '10:33 AM', type: 'text' },
    { id: '5', content: 'Your order has shipped and will arrive tomorrow!', sender: 'user', timestamp: '10:35 AM', type: 'text' },
    { id: '6', content: 'Thanks for the update!', sender: 'contact', timestamp: '10:36 AM', type: 'text' }
  ]

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    // In real app, this would send via WhatsApp API
    alert('Message sent!')
    setMessageText('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">WhatsApp Business</h1>
          <p className="text-nexus-text-secondary">Manage customer conversations via WhatsApp.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Settings className="w-4 h-4 mr-2 text-nexus-blue" />
            Settings
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Active Chats</CardTitle>
            <MessageCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">24</div>
            <p className="text-xs text-nexus-text-secondary">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">1,247</div>
            <p className="text-xs text-nexus-text-secondary">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-nexus-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">3.2m</div>
            <p className="text-xs text-nexus-text-secondary">Average</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">94%</div>
            <p className="text-xs text-nexus-text-secondary">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <Card className="border-nexus-border">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-nexus-border">
              <div className="p-4 border-b border-nexus-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-tertiary" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-nexus-border focus:ring-nexus-blue"
                  />
                </div>
              </div>
              <div className="overflow-y-auto max-h-[536px]">
                {conversations
                  .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-4 cursor-pointer border-b border-nexus-border hover:bg-nexus-bg-secondary transition-colors ${
                        selectedConversation === conv.id ? 'bg-nexus-blue-light' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-nexus-text-primary">{conv.name}</h3>
                        <span className="text-xs text-nexus-text-tertiary">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-nexus-text-secondary truncate">{conv.lastMessage}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-nexus-text-tertiary">{conv.phone}</span>
                        {conv.unread > 0 && (
                          <Badge className="bg-nexus-green text-white">{conv.unread}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-nexus-border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-nexus-text-primary">
                          {conversations.find(c => c.id === selectedConversation)?.name}
                        </h3>
                        <p className="text-sm text-nexus-text-secondary">
                          {conversations.find(c => c.id === selectedConversation)?.phone}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-nexus-green/10 text-nexus-green border-nexus-green/20">
                      Active
                    </Badge>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[440px]">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-nexus-blue text-white'
                              : 'bg-nexus-bg-secondary text-nexus-text-primary'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-nexus-text-tertiary'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-nexus-border">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-nexus-text-secondary">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-nexus-text-secondary">
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-nexus-text-secondary">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 border-nexus-border focus:ring-nexus-blue"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                    <p className="text-nexus-text-secondary">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
