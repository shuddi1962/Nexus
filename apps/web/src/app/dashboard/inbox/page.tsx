'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ConversationsList } from '@/components/crm/conversations-list'
import { ConversationView } from '@/components/crm/conversation-view'
import { Search, Filter, MessageSquare, Users } from 'lucide-react'
import { useState } from 'react'

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-nexus-border flex flex-col">
        <div className="p-4 border-b border-nexus-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-nexus-text-primary">Inbox</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
                <Filter className="w-4 h-4 text-nexus-blue" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 border-b border-nexus-border bg-nexus-bg-secondary">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-nexus-text-primary">24</div>
              <div className="text-xs text-nexus-text-tertiary">Unread</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-nexus-text-primary">156</div>
              <div className="text-xs text-nexus-text-tertiary">Total</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-nexus-text-primary">89</div>
              <div className="text-xs text-nexus-text-tertiary">Active</div>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationsList
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>
      </div>

      {/* Conversation View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ConversationView conversationId={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-nexus-bg">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-nexus-text-primary mb-2">
                Select a conversation
              </h3>
              <p className="text-nexus-text-secondary">
                Choose a conversation from the list to view messages and continue the discussion.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}