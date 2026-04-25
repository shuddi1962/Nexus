'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Play,
  Pause,
  Archive,
  TrendingUp,
  DollarSign,
  Target,
  Eye
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  objective?: string
  status: 'active' | 'paused' | 'draft' | 'archived'
  daily_budget?: number
  lifetime_budget?: number
  currency: string
  start_date?: string
  end_date?: string
  created_at: string
  synced_at?: string
}

export default function CampaignsPage() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchAdAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchCampaigns()
    }
  }, [selectedAccount])

  const fetchAdAccounts = async () => {
    try {
      const data = await apiClient.getAdAccounts()
      setAdAccounts(data)
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
    }
  }

  const fetchCampaigns = async () => {
    if (!selectedAccount) return

    try {
      setLoading(true)
      const data = await apiClient.getCampaigns(selectedAccount)
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      await apiClient.createCampaign(selectedAccount, campaignData)
      fetchCampaigns()
      setShowCreateDialog(false)
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const handleUpdateCampaign = async (campaignId: string, updates: any) => {
    try {
      await apiClient.updateCampaign(campaignId, updates)
      fetchCampaigns()
    } catch (error) {
      console.error('Error updating campaign:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-nexus-green text-white'
      case 'paused':
        return 'bg-nexus-amber text-white'
      case 'draft':
        return 'bg-nexus-text-tertiary text-white'
      case 'archived':
        return 'bg-nexus-red text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Campaigns</h1>
          <p className="text-nexus-text-secondary">Create and manage your advertising campaigns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-nexus-border hover:bg-nexus-bg-secondary"
            onClick={fetchCampaigns}
          >
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-nexus-text-primary">Create New Campaign</DialogTitle>
              </DialogHeader>
              <CampaignForm onSubmit={handleCreateCampaign} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Account Selector */}
      <Card className="border-nexus-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Label className="text-nexus-text-primary">Ad Account:</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-64 border-nexus-border">
                <SelectValue placeholder="Select ad account" />
              </SelectTrigger>
              <SelectContent>
                {adAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.platform} - {account.account_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-nexus-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-nexus-border"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 border-nexus-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="border-nexus-border">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexus-blue"></div>
                <span className="ml-2 text-nexus-text-secondary">Loading campaigns...</span>
              </div>
            </CardContent>
          </Card>
        ) : filteredCampaigns.length === 0 ? (
          <Card className="border-nexus-border">
            <CardContent className="p-12 text-center">
              <Target className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Campaigns Yet</h3>
              <p className="text-nexus-text-secondary mb-6">
                Create your first campaign to start advertising.
              </p>
              <Button
                className="bg-nexus-blue hover:bg-nexus-accent text-white"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="border-nexus-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-nexus-text-primary">
                        {campaign.name}
                      </h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-nexus-text-secondary">Objective:</span>
                        <p className="font-medium text-nexus-text-primary">{campaign.objective || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-nexus-text-secondary">Daily Budget:</span>
                        <p className="font-medium text-nexus-text-primary">
                          {campaign.daily_budget ? `$${campaign.daily_budget}` : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <span className="text-nexus-text-secondary">Currency:</span>
                        <p className="font-medium text-nexus-text-primary">{campaign.currency}</p>
                      </div>
                      <div>
                        <span className="text-nexus-text-secondary">Created:</span>
                        <p className="font-medium text-nexus-text-primary">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-nexus-border hover:bg-nexus-bg-secondary"
                      onClick={() => handleUpdateCampaign(campaign.id,
                        campaign.status === 'active' ? { status: 'paused' } : { status: 'active' }
                      )}
                    >
                      {campaign.status === 'active' ? (
                        <Pause className="w-4 h-4 text-nexus-amber" />
                      ) : (
                        <Play className="w-4 h-4 text-nexus-green" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                      <Edit className="w-4 h-4 text-nexus-text-tertiary" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                      <MoreHorizontal className="w-4 h-4 text-nexus-text-tertiary" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function CampaignForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    daily_budget: '',
    lifetime_budget: '',
    start_date: '',
    end_date: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      daily_budget: formData.daily_budget ? parseFloat(formData.daily_budget) : undefined,
      lifetime_budget: formData.lifetime_budget ? parseFloat(formData.lifetime_budget) : undefined,
      status: 'draft',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-nexus-text-primary">Campaign Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective" className="text-nexus-text-primary">Objective</Label>
        <Select value={formData.objective} onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}>
          <SelectTrigger className="border-nexus-border">
            <SelectValue placeholder="Select campaign objective" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="awareness">Awareness</SelectItem>
            <SelectItem value="traffic">Traffic</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
            <SelectItem value="leads">Leads</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="daily_budget" className="text-nexus-text-primary">Daily Budget ($)</Label>
          <Input
            id="daily_budget"
            type="number"
            step="0.01"
            value={formData.daily_budget}
            onChange={(e) => setFormData(prev => ({ ...prev, daily_budget: e.target.value }))}
            className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lifetime_budget" className="text-nexus-text-primary">Lifetime Budget ($)</Label>
          <Input
            id="lifetime_budget"
            type="number"
            step="0.01"
            value={formData.lifetime_budget}
            onChange={(e) => setFormData(prev => ({ ...prev, lifetime_budget: e.target.value }))}
            className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-nexus-text-primary">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-nexus-text-primary">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-nexus-blue hover:bg-nexus-accent text-white">
          Create Campaign
        </Button>
      </div>
    </form>
  )
}