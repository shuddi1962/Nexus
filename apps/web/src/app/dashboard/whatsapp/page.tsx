'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient } from '@/lib/api'
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

export default function WhatsAppPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const data = await apiClient.call('/whatsapp/conversations')
        setConversations(data.conversations || [])
        if (data.conversations?.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0].id)
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [])

  useEffect(() => {
    if (!selectedConversation) return
    const fetchMessages = async () => {
      try {
        const data = await apiClient.call(`/whatsapp/conversations/${selectedConversation}/messages`)
        setMessages(data.messages || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    fetchMessages()
  }, [selectedConversation])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return
    try {
      const conv = conversations.find(c => c.id === selectedConversation)
        await apiClient.call('/whatsapp/send', {
        method: 'POST',
        body: JSON.stringify({
          to: conv?.phone,
          message: messageText,
          conversation_id: selectedConversation
        })
      })
      const newMsg = {
        id: Date.now().toString(),
        content: messageText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      }
      setMessages([...messages, newMsg])
      setMessageText('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading conversations...</div>
      </div>
    )
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
            <div className="text-2xl font-bold text-nexus-text-primary">{conversations.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-nexus-text-secondary">Active conversations</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{messages.filter(m => m.sender === 'user').length}</div>
            <p className="text-xs text-nexus-text-secondary">Total sent</p>
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
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Chats</CardTitle>
            <Users className="h-4 w-4 text-nexus-violet" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{conversations.length}</div>
            <p className="text-xs text-nexus-text-secondary">All time</p>
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
                  .filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-4 cursor-pointer border-b border-nexus-border hover:bg-nexus-bg-secondary transition-colors ${
                        selectedConversation === conv.id ? 'bg-nexus-blue-light' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-nexus-text-primary">{conv.name || conv.phone}</h3>
                        <span className="text-xs text-nexus-text-tertiary">
                          {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                      <p className="text-sm text-nexus-text-secondary truncate">{conv.last_message || 'No messages yet'}</p>
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
                          {conversations.find(c => c.id === selectedConversation)?.name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-nexus-text-secondary">
                          {conversations.find(c => c.id === selectedConversation)?.phone}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-nexus-green/10 text-nexus-green border-nexus-green/20">
                      {conversations.find(c => c.id === selectedConversation)?.status || 'active'}
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
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
