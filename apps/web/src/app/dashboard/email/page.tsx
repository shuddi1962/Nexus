'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Send,
  Paperclip,
  Image,
  Link,
  Bold,
  Italic,
  List,
  Eye,
  Settings,
  Plus,
  Search
} from 'lucide-react'

// Mock email templates
const emailTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to NEXUS - Your Business Platform',
    category: 'Onboarding',
  },
  {
    id: '2',
    name: 'Follow-up Email',
    subject: 'Following up on our conversation',
    category: 'Sales',
  },
  {
    id: '3',
    name: 'Newsletter',
    subject: 'Monthly Business Insights',
    category: 'Marketing',
  },
]

export default function EmailPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    content: '',
  })

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        content: `Dear [Recipient Name],\n\n${template.name} content goes here...\n\nBest regards,\nYour Name`,
      }))
    }
  }

  const handleSend = () => {
    // In real app, this would send via email API
    console.log('Sending email:', emailData)
    alert('Email sent successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Email Marketing</h1>
          <p className="text-nexus-text-secondary">Create and send professional emails to your contacts.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Settings className="w-4 h-4 mr-2 text-nexus-blue" />
            Email Settings
          </Button>
          <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Templates Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emailTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{template.category}</p>
                    <Badge variant="outline" className="text-xs mt-2">
                      Template
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Composer */}
        <div className="lg:col-span-3 space-y-6">
          {/* Email Form */}
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <div className="flex space-x-2">
                  <Input
                    id="to"
                    placeholder="recipient@example.com"
                    value={emailData.to}
                    onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              {/* Email Editor Toolbar */}
              <div className="border rounded-lg">
                <div className="border-b p-2 flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                  <div className="border-l pl-2 ml-2 flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Textarea
                  placeholder="Write your email content here..."
                  value={emailData.content}
                  onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[300px] border-0 rounded-none resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview and Send */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline">
                    Save Draft
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Sending to: {emailData.to || 'No recipient selected'}
                  </span>
                  <Button
                    onClick={handleSend}
                    disabled={!emailData.to || !emailData.subject || !emailData.content}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Mail className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-gray-600">Emails Sent This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">78.5%</div>
                    <div className="text-sm text-gray-600">Open Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Send className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">23.4%</div>
                    <div className="text-sm text-gray-600">Click Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}