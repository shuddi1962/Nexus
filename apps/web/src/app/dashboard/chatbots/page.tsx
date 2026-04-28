'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api'
import {
  Plus, Bot, MessageSquare, Settings, Play, Save, Trash2, ArrowRight, Zap, Users, BarChart3, TestTube
} from 'lucide-react'

export default function ChatbotPage() {
  const [chatbots, setChatbots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newChatbotName, setNewChatbotName] = useState('')
  const [newChatbotDescription, setNewChatbotDescription] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Fetch chatbots on mount
  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getChatbots()
        setChatbots(data || [])
      } catch (error) {
        console.error('Error fetching chatbots:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchChatbots()
  }, [])

  const handleCreateChatbot = async () => {
    if (!newChatbotName.trim()) return

    try {
      setIsCreating(true)
      const newChatbot = await apiClient.createChatbot({
        name: newChatbotName,
      })
      setChatbots([newChatbot, ...chatbots])
      setNewChatbotName('')
      setNewChatbotDescription('')
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating chatbot:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteChatbot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) return
    try {
      await apiClient.deleteChatbot(id)
      setChatbots(chatbots.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting chatbot:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading chatbots...</div>
      </div>
    )
  }

  const filteredChatbots = activeTab === 'all'
    ? chatbots
    : chatbots.filter(c => c.status === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Chatbots</h1>
          <p className="text-nexus-text-secondary">Build and manage AI-powered chatbots for your business.</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-nexus-violet hover:bg-nexus-accent text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Chatbot
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'draft', 'inactive'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'bg-nexus-violet text-white' : 'border-nexus-border'}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Create Chatbot Modal */}
      {isCreating && (
        <Card className="border-nexus-blue bg-nexus-blue-light">
          <CardHeader>
            <CardTitle>Create New Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatbotName">Chatbot Name</Label>
              <Input
                id="chatbotName"
                value={newChatbotName}
                onChange={(e) => setNewChatbotName(e.target.value)}
                placeholder="Enter chatbot name"
                className="border-nexus-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatbotDescription">Description</Label>
              <Textarea
                id="chatbotDescription"
                value={newChatbotDescription}
                onChange={(e) => setNewChatbotDescription(e.target.value)}
                placeholder="Describe what this chatbot will do"
                rows={3}
                className="border-nexus-border"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChatbot} disabled={!newChatbotName.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Create Chatbot
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chatbots List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChatbots.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Bot className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                <p className="text-nexus-text-secondary">No chatbots yet. Create your first chatbot to get started.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredChatbots.map((chatbot) => (
            <Card key={chatbot.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-nexus-violet-light rounded-lg">
                      <Bot className="w-5 h-5 text-nexus-violet" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                      <p className="text-sm text-nexus-text-secondary">{chatbot.description || 'No description'}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(chatbot.status)}>
                    {chatbot.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t border-nexus-border">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteChatbot(chatbot.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
