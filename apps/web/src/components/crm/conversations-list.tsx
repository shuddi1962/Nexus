'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
        return '📧'
      case 'sms':
        return '💬'
      case 'whatsapp':
        return '📱'
      case 'phone':
        return '📞'
      default:
        return '💬'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-500'
      case 'active':
        return 'bg-green-500'
      case 'closed':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
            selectedConversation === conversation.id && 'bg-blue-50 border-r-2 border-blue-500'
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
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {conversation.contact.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(conversation.lastMessage.timestamp)}
                  </span>
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    conversation.status === 'unread' && 'bg-blue-500'
                  )} />
                </div>
              </div>

              <p className="text-sm text-gray-600 truncate mb-2">
                {conversation.lastMessage.isFromContact ? (
                  conversation.lastMessage.content
                ) : (
                  <span className="text-gray-900 font-medium">You: </span>
                ) + conversation.lastMessage.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{getChannelIcon(conversation.channel)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {conversation.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {conversation.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                  {conversation.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
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