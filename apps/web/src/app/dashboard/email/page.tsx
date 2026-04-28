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
  Mail, Send, Users, Target, BarChart3, TrendingUp, Calendar, Clock,
  CheckCircle, AlertTriangle, Plus, Search, Filter, Eye, Edit
} from 'lucide-react'

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('campaigns')
  const [isCreating, setIsCreating] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', subject: '' })

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        // TODO: Add getEmailCampaigns to apiClient
        // const data = await apiClient.getEmailCampaigns()
        // setCampaigns(data.campaigns || [])
        setCampaigns([])
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const handleCreateCampaign = async () => {
    if (!newCampaign.name.trim() || !newCampaign.subject.trim()) return
    try {
      setIsCreating(true)
      // TODO: Add createEmailCampaign to apiClient
      // const campaign = await apiClient.createEmailCampaign(newCampaign)
      // setCampaigns([campaign, ...campaigns])
      setNewCampaign({ name: '', subject: '' })
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading campaigns...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Email Marketing</h1>
          <p className="text-nexus-text-secondary">Create and manage email campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Eye className="w-4 h-4 mr-2 text-nexus-blue" />
            View Templates
          </Button>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-nexus-blue hover:bg-nexus-accent text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{campaigns.length}</div>
            <p className="text-xs text-nexus-text-secondary">Active campaigns</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">0%</div>
            <p className="text-xs text-nexus-text-secondary">Average open rate</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Click Rate</CardTitle>
            <Target className="h-4 w-4 text-nexus-violet" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">0%</div>
            <p className="text-xs text-nexus-text-secondary">Average click rate</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-nexus-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">0</div>
            <p className="text-xs text-nexus-text-secondary">Total subscribers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                <p className="text-nexus-text-secondary">No campaigns yet. Create your first campaign to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-nexus-text-primary">{campaign.name}</h3>
                        <p className="text-sm text-nexus-text-secondary">{campaign.subject}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={campaign.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {campaign.status || 'draft'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 text-nexus-text-secondary" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 text-nexus-text-secondary" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Create Campaign Modal */}
          {isCreating && (
            <Card className="border-nexus-blue bg-nexus-blue-light">
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Enter campaign name"
                    className="border-nexus-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    placeholder="Enter email subject"
                    className="border-nexus-border"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCampaign} disabled={!newCampaign.name.trim() || !newCampaign.subject.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-nexus-text-secondary">Email templates will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <p className="text-nexus-text-secondary">Analytics data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
