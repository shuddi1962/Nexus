'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Phone,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Smile
} from 'lucide-react'

// Mock conversation data
const mockConversation = {
  id: '1',
  contact: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: null,
    company: 'Acme Corp',
  },
  channel: 'email',
  status: 'active',
  messages: [
    {
      id: '1',
      content: 'Hi John, I wanted to follow up on our conversation about the enterprise solution.',
      timestamp: '2026-04-24T09:00:00Z',
      isFromContact: false,
      sender: 'You',
    },
    {
      id: '2',
      content: 'Hi! Thanks for following up. I\'ve been reviewing the proposal you sent over.',
      timestamp: '2026-04-24T09:15:00Z',
      isFromContact: true,
      sender: 'John Doe',
    },
    {
      id: '3',
      content: 'Great to hear! Do you have any questions about the pricing or implementation timeline?',
      timestamp: '2026-04-24T09:20:00Z',
      isFromContact: false,
      sender: 'You',
    },
    {
      id: '4',
      content: 'The pricing looks competitive. I\'m particularly interested in the onboarding process. How long does it typically take?',
      timestamp: '2026-04-24T09:30:00Z',
      isFromContact: true,
      sender: 'John Doe',
    },
    {
      id: '5',
      content: 'Thanks for the quick response! The proposal looks great.',
      timestamp: '2026-04-24T10:30:00Z',
      isFromContact: true,
      sender: 'John Doe',
    },
  ],
}

interface ConversationViewProps {
  conversationId: string
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState('')
  const conversation = mockConversation // In real app, fetch by conversationId

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // In real app, this would send the message via API
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  // Group messages by date
  const groupedMessages = conversation.messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, typeof conversation.messages>)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-nexus-border bg-nexus-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.contact.avatar || ''} alt={conversation.contact.name} />
              <AvatarFallback>
                {conversation.contact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-nexus-text-primary">
                {conversation.contact.name}
              </h2>
              <p className="text-sm text-nexus-text-secondary">
                {conversation.contact.company}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={conversation.status === 'active' ? 'bg-nexus-green text-white' : 'bg-nexus-bg-secondary text-nexus-text-primary border-nexus-border'}>
              {conversation.status}
            </Badge>
            <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <Phone className="w-4 h-4 text-nexus-blue" />
            </Button>
            <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <Mail className="w-4 h-4 text-nexus-blue" />
            </Button>
            <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <MessageCircle className="w-4 h-4 text-nexus-blue" />
            </Button>
            <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <MoreHorizontal className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="flex items-center mb-4">
              <div className="flex-1 border-t border-nexus-border"></div>
              <div className="px-3 bg-nexus-surface text-xs text-nexus-text-tertiary font-medium">
                {date}
              </div>
              <div className="flex-1 border-t border-nexus-border"></div>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromContact ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${message.isFromContact ? 'flex-row' : 'flex-row-reverse'}`}>
                    {message.isFromContact && (
                      <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                        <AvatarImage src={conversation.contact.avatar || ''} alt={conversation.contact.name} />
                        <AvatarFallback className="text-xs">
                          {conversation.contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`rounded-lg px-3 py-2 ${
                      message.isFromContact
                        ? 'bg-nexus-bg-secondary text-nexus-text-primary'
                        : 'bg-nexus-blue text-white'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isFromContact ? 'text-nexus-text-tertiary' : 'text-blue-100'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>

                    {!message.isFromContact && (
                      <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-blue-600">Y</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-nexus-border bg-nexus-surface">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="min-h-[40px] resize-none border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <Paperclip className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>
            <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <Smile className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-nexus-blue hover:bg-nexus-accent text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-nexus-text-tertiary">
          <span>Press Enter to send</span>
          <span>via {conversation.channel}</span>
        </div>
      </div>
    </div>
  )
}