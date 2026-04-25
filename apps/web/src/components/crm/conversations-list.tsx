'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Mail, MessageCircle, Phone } from 'lucide-react'

// Mock conversations data
const conversations = [
  {
    id: '1',
    contact: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: null,
    },
    lastMessage: {
      content: 'Thanks for the quick response! The proposal looks great.',
      timestamp: '2026-04-24T10:30:00Z',
      isFromContact: true,
    },
    status: 'unread',
    channel: 'email',
    tags: ['VIP', 'Enterprise'],
  },
  {
    id: '2',
    contact: {
      name: 'Jane Smith',
      email: 'jane.smith@techstartup.com',
      avatar: null,
    },
    lastMessage: {
      content: 'When can we schedule a demo call?',
      timestamp: '2026-04-24T09:15:00Z',
      isFromContact: true,
    },
    status: 'active',
    channel: 'email',
    tags: ['Lead', 'SaaS'],
  },
  {
    id: '3',
    contact: {
      name: 'Bob Johnson',
      email: 'bob@consulting.com',
      avatar: null,
    },
    lastMessage: {
      content: 'I sent the contract for review.',
      timestamp: '2026-04-24T08:45:00Z',
      isFromContact: false,
    },
    status: 'active',
    channel: 'email',
    tags: ['Prospect'],
  },
  {
    id: '4',
    contact: {
      name: 'Alice Wilson',
      email: 'alice.wilson@retail.com',
      avatar: null,
    },
    lastMessage: {
      content: 'The new feature rollout went smoothly!',
      timestamp: '2026-04-23T16:20:00Z',
      isFromContact: false,
    },
    status: 'closed',
    channel: 'sms',
    tags: ['Customer', 'E-commerce'],
  },
  {
    id: '5',
    contact: {
      name: 'Charlie Brown',
      email: 'charlie.brown@finance.com',
      avatar: null,
    },
    lastMessage: {
      content: 'Can you send me the pricing details?',
      timestamp: '2026-04-23T14:10:00Z',
      isFromContact: true,
    },
    status: 'active',
    channel: 'whatsapp',
    tags: ['VIP', 'Finance'],
  },
]

interface ConversationsListProps {
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationsList({
  selectedConversation,
  onSelectConversation
}: ConversationsListProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-3 h-3 text-nexus-blue" />
      case 'sms':
        return <MessageCircle className="w-3 h-3 text-nexus-blue" />
      case 'whatsapp':
        return <MessageCircle className="w-3 h-3 text-green-500" />
      case 'phone':
        return <Phone className="w-3 h-3 text-nexus-blue" />
      default:
        return <MessageCircle className="w-3 h-3 text-nexus-blue" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-nexus-blue'
      case 'active':
        return 'bg-nexus-green'
      case 'closed':
        return 'bg-nexus-text-tertiary'
      default:
        return 'bg-nexus-text-tertiary'
    }
  }

  return (
    <div className="divide-y divide-nexus-border">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            'p-4 cursor-pointer hover:bg-nexus-bg-secondary transition-colors',
            selectedConversation === conversation.id && 'bg-nexus-blue-light border-r-2 border-nexus-blue'
          )}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={conversation.contact.avatar || ''} alt={conversation.contact.name} />
              <AvatarFallback>
                {conversation.contact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-nexus-text-primary truncate">
                  {conversation.contact.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-nexus-text-tertiary">
                    {formatTimestamp(conversation.lastMessage.timestamp)}
                  </span>
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    conversation.status === 'unread' && getStatusColor('unread')
                  )} />
                </div>
              </div>

              <p className="text-sm text-nexus-text-secondary truncate mb-2">
                {conversation.lastMessage.isFromContact ? (
                  conversation.lastMessage.content
                ) : (
                  <span className="text-nexus-text-primary font-medium">You: </span>
                ) + conversation.lastMessage.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{getChannelIcon(conversation.channel)}</span>
                  <Badge className="text-xs bg-nexus-bg-secondary text-nexus-text-primary border-nexus-border">
                    {conversation.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {conversation.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5 border-nexus-border text-nexus-text-secondary">
                      {tag}
                    </Badge>
                  ))}
                  {conversation.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-nexus-border text-nexus-text-secondary">
                      +{conversation.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}