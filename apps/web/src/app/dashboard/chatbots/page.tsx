'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Bot,
  MessageSquare,
  Settings,
  Play,
  Save,
  Trash2,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  TestTube
} from 'lucide-react'

interface ChatbotFlow {
  id: string
  name: string
  description: string
  nodes: FlowNode[]
  connections: FlowConnection[]
  settings: ChatbotSettings
}

interface FlowNode {
  id: string
  type: 'message' | 'input' | 'condition' | 'action' | 'end'
  position: { x: number; y: number }
  data: any
}

interface FlowConnection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

interface ChatbotSettings {
  name: string
  description: string
  avatar?: string
  primaryColor: string
  welcomeMessage: string
  fallbackMessage: string
  language: string
  timezone: string
}

// Mock chatbot data
const chatbots = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'AI-powered customer support assistant',
    status: 'active',
    conversations: 1247,
    satisfaction: 4.8,
    lastUpdated: '2026-04-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'Lead qualification and sales support',
    status: 'active',
    conversations: 892,
    satisfaction: 4.6,
    lastUpdated: '2026-04-19T14:15:00Z',
  },
  {
    id: '3',
    name: 'HR Bot',
    description: 'Employee onboarding and HR queries',
    status: 'draft',
    conversations: 0,
    satisfaction: 0,
    lastUpdated: '2026-04-18T09:45:00Z',
  },
]

export default function ChatbotPage() {
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newChatbotName, setNewChatbotName] = useState('')
  const [newChatbotDescription, setNewChatbotDescription] = useState('')

  const handleCreateChatbot = () => {
    if (!newChatbotName.trim()) return

    // In real app, this would create a new chatbot
    console.log('Creating chatbot:', newChatbotName, newChatbotDescription)
    setIsCreating(false)
    setNewChatbotName('')
    setNewChatbotDescription('')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot Builder</h1>
          <p className="text-gray-600">Create intelligent conversational AI assistants.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <TestTube className="w-4 h-4 mr-2" />
            Test Chatbot
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Chatbot
          </Button>
        </div>
      </div>

      {/* Create Chatbot Modal */}
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50">
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
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChatbot}>
                Create Chatbot
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chatbots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map((chatbot) => (
          <Card key={chatbot.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="w-8 h-8 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                    <Badge className={getStatusColor(chatbot.status)}>
                      {chatbot.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{chatbot.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Conversations</div>
                  <div className="font-semibold text-lg">{chatbot.conversations.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Satisfaction</div>
                  <div className="font-semibold text-lg flex items-center">
                    {chatbot.satisfaction.toFixed(1)}
                    <span className="text-yellow-500 ml-1">⭐</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Last updated: {new Date(chatbot.lastUpdated).toLocaleDateString()}
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedChatbot(chatbot.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chatbot Builder Interface */}
      {selectedChatbot && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Chatbot Flow Builder
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Flow
                </Button>
                <Button variant="outline">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Flow
                </Button>
                <Button onClick={() => setSelectedChatbot(null)}>
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="flow" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="flow">Flow Builder</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="flow" className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Visual Flow Builder</h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop conversation nodes to build your chatbot flow.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Message Node
                    </Button>
                    <Button variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Add Condition
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Add Action
                    </Button>
                  </div>
                </div>

                {/* Flow Preview */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-medium">Welcome</div>
                      <div className="text-xs text-gray-600">Start</div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-400" />

                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-medium">Collect Info</div>
                      <div className="text-xs text-gray-600">User Input</div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-400" />

                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-medium">Process</div>
                      <div className="text-xs text-gray-600">AI Response</div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-400" />

                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-medium">Response</div>
                      <div className="text-xs text-gray-600">End</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="botName">Bot Name</Label>
                        <Input id="botName" defaultValue="Customer Support Bot" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="welcomeMessage">Welcome Message</Label>
                        <Textarea
                          id="welcomeMessage"
                          defaultValue="Hi! I'm here to help you. How can I assist you today?"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fallbackMessage">Fallback Message</Label>
                        <Textarea
                          id="fallbackMessage"
                          defaultValue="I'm sorry, I didn't understand that. Let me connect you with a human agent."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            id="primaryColor"
                            type="color"
                            defaultValue="#3B82F6"
                            className="w-10 h-10 rounded border border-gray-300"
                          />
                          <Input defaultValue="#3B82F6" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option>PST</option>
                          <option>EST</option>
                          <option>CST</option>
                          <option>MST</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <div className="text-2xl font-bold">1,247</div>
                          <div className="text-sm text-gray-600">Total Conversations</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <BarChart3 className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                          <div className="text-2xl font-bold">4.8</div>
                          <div className="text-sm text-gray-600">Avg. Satisfaction</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-purple-500 mr-3" />
                        <div>
                          <div className="text-2xl font-bold">23.4%</div>
                          <div className="text-sm text-gray-600">Resolution Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversation Flow Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Welcome → Collect Info</span>
                        <span className="text-sm font-medium">89.2% completion</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89.2%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Collect Info → Process</span>
                        <span className="text-sm font-medium">76.8% completion</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '76.8%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Process → Response</span>
                        <span className="text-sm font-medium">94.1% completion</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.1%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}