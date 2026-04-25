'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Plus,
  Key,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Loader2
} from 'lucide-react'

interface ApiKey {
  id: string
  provider: string
  category: string
  label?: string
  added_by: string
  last_tested_at?: string
  test_status: 'active' | 'invalid' | 'untested' | 'expired'
  usage_this_month: number
  active: boolean
  created_at: string
}

const PROVIDER_CATEGORIES = [
  'Language Models',
  'Multi-Modal',
  'SEO & Data',
  'Email',
  'SMS & Voice',
  'Messaging',
  'Ads Platforms',
  'Platform Payments',
  'Storage & CDN',
  'Scraping & Enrichment',
  'Calendar & Communication',
  'Domain Management',
  'Analytics & Stock Images',
  'Miscellaneous'
]

const PROVIDERS = [
  // Language Models
  { name: 'openrouter', category: 'Language Models', label: 'OpenRouter' },
  { name: 'anthropic', category: 'Language Models', label: 'Anthropic Claude' },
  { name: 'openai', category: 'Language Models', label: 'OpenAI' },
  { name: 'google', category: 'Language Models', label: 'Google Gemini' },
  { name: 'xai', category: 'Language Models', label: 'xAI Grok' },
  { name: 'deepseek', category: 'Language Models', label: 'DeepSeek' },
  { name: 'minimax', category: 'Language Models', label: 'MiniMax' },

  // Multi-Modal
  { name: 'kie_ai', category: 'Multi-Modal', label: 'Kie.ai' },

  // SEO & Data
  { name: 'dataforseo', category: 'SEO & Data', label: 'DataForSEO' },
  { name: 'google_search_console', category: 'SEO & Data', label: 'Google Search Console' },
  { name: 'bing_webmaster', category: 'SEO & Data', label: 'Bing Webmaster Tools' },

  // Email
  { name: 'mailgun', category: 'Email', label: 'Mailgun' },
  { name: 'sendgrid', category: 'Email', label: 'SendGrid' },
  { name: 'smtp', category: 'Email', label: 'Custom SMTP' },

  // SMS & Voice
  { name: 'twilio', category: 'SMS & Voice', label: 'Twilio' },

  // Messaging
  { name: 'whatsapp_business', category: 'Messaging', label: 'WhatsApp Business' },
  { name: '360dialog', category: 'Messaging', label: '360Dialog' },
  { name: 'telegram', category: 'Messaging', label: 'Telegram' },
  { name: 'facebook_messenger', category: 'Messaging', label: 'Facebook Messenger' },
  { name: 'instagram', category: 'Messaging', label: 'Instagram' },
  { name: 'tiktok', category: 'Messaging', label: 'TikTok' },
  { name: 'linkedin', category: 'Messaging', label: 'LinkedIn' },
  { name: 'twitter', category: 'Messaging', label: 'Twitter' },
  { name: 'pinterest', category: 'Messaging', label: 'Pinterest' },
  { name: 'snapchat', category: 'Messaging', label: 'Snapchat' },

  // Ads Platforms
  { name: 'meta_ads', category: 'Ads Platforms', label: 'Meta Ads' },
  { name: 'google_ads', category: 'Ads Platforms', label: 'Google Ads' },
  { name: 'tiktok_ads', category: 'Ads Platforms', label: 'TikTok Ads' },
  { name: 'twitter_ads', category: 'Ads Platforms', label: 'Twitter Ads' },
  { name: 'linkedin_ads', category: 'Ads Platforms', label: 'LinkedIn Ads' },
  { name: 'snapchat_ads', category: 'Ads Platforms', label: 'Snapchat Ads' },
  { name: 'pinterest_ads', category: 'Ads Platforms', label: 'Pinterest Ads' },
  { name: 'youtube_ads', category: 'Ads Platforms', label: 'YouTube Ads' },
  { name: 'amazon_ads', category: 'Ads Platforms', label: 'Amazon Ads' },

  // Platform Payments
  { name: 'stripe', category: 'Platform Payments', label: 'Stripe' },
  { name: 'paystack', category: 'Platform Payments', label: 'Paystack' },
  { name: 'flutterwave', category: 'Platform Payments', label: 'Flutterwave' },
  { name: 'nowpayments', category: 'Platform Payments', label: 'NOWPayments' },

  // Storage & CDN
  { name: 'cloudflare_r2', category: 'Storage & CDN', label: 'Cloudflare R2' },
  { name: 'cloudflare_api', category: 'Storage & CDN', label: 'Cloudflare API' },

  // Scraping & Enrichment
  { name: 'apify', category: 'Scraping & Enrichment', label: 'Apify' },
  { name: 'zerobounce', category: 'Scraping & Enrichment', label: 'ZeroBounce' },
  { name: 'neverbounce', category: 'Scraping & Enrichment', label: 'NeverBounce' },
  { name: 'hunter', category: 'Scraping & Enrichment', label: 'Hunter.io' },
  { name: 'clearbit', category: 'Scraping & Enrichment', label: 'Clearbit' },

  // Calendar & Communication
  { name: 'google_calendar', category: 'Calendar & Communication', label: 'Google Calendar' },
  { name: 'outlook_calendar', category: 'Calendar & Communication', label: 'Outlook Calendar' },
  { name: 'zoom', category: 'Calendar & Communication', label: 'Zoom' },

  // Domain Management
  { name: 'namecheap', category: 'Domain Management', label: 'Namecheap' },
  { name: 'godaddy', category: 'Domain Management', label: 'GoDaddy' },
  { name: 'cloudflare_registrar', category: 'Domain Management', label: 'Cloudflare Registrar' },

  // Analytics & Stock Images
  { name: 'google_analytics', category: 'Analytics & Stock Images', label: 'Google Analytics' },
  { name: 'facebook_pixel', category: 'Analytics & Stock Images', label: 'Facebook Pixel' },
  { name: 'gtm', category: 'Analytics & Stock Images', label: 'Google Tag Manager' },
  { name: 'unsplash', category: 'Analytics & Stock Images', label: 'Unsplash API' },
  { name: 'pexels', category: 'Analytics & Stock Images', label: 'Pexels API' },

  // Miscellaneous
  { name: 'google_maps', category: 'Miscellaneous', label: 'Google Maps' },
  { name: 'yext', category: 'Miscellaneous', label: 'Yext' },
  { name: 'custom', category: 'Miscellaneous', label: 'Custom API' }
]

export default function VaultPage() {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [newKeyForm, setNewKeyForm] = useState({
    provider: '',
    category: '',
    key: '',
    label: ''
  })

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getApiKeys()
      setApiKeys(data)
    } catch (error) {
      console.error('Error fetching API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddKey = async () => {
    try {
      await apiClient.addApiKey(newKeyForm)
      setIsAddDialogOpen(false)
      setNewKeyForm({ provider: '', category: '', key: '', label: '' })
      fetchApiKeys()
    } catch (error) {
      console.error('Error adding API key:', error)
    }
  }

  const handleTestKey = async (keyId: string) => {
    try {
      setTesting(keyId)
      await apiClient.testApiKey(keyId)
      fetchApiKeys() // Refresh to show updated status
    } catch (error) {
      console.error('Error testing API key:', error)
    } finally {
      setTesting(null)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      await apiClient.deleteApiKey(keyId)
      fetchApiKeys()
    } catch (error) {
      console.error('Error deleting API key:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case 'invalid':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Invalid</Badge>
      case 'expired':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800"><TestTube className="w-3 h-3 mr-1" />Untested</Badge>
    }
  }

  const filteredProviders = selectedCategory
    ? PROVIDERS.filter(p => p.category === selectedCategory)
    : PROVIDERS

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">API Keys Vault</h1>
          <p className="text-nexus-text-secondary">Manage encrypted API keys for all platform integrations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-nexus-border hover:bg-nexus-bg-secondary"
            onClick={fetchApiKeys}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDER_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={newKeyForm.provider}
                    onValueChange={(value) => {
                      const provider = PROVIDERS.find(p => p.name === value)
                      setNewKeyForm({
                        ...newKeyForm,
                        provider: value,
                        category: provider?.category || ''
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProviders.map(provider => (
                        <SelectItem key={provider.name} value={provider.name}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="key">API Key</Label>
                  <Input
                    id="key"
                    type="password"
                    placeholder="Enter your API key"
                    value={newKeyForm.key}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, key: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="label">Label (Optional)</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Production Key"
                    value={newKeyForm.label}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, label: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddKey} disabled={!newKeyForm.provider || !newKeyForm.key}>
                    Add Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* API Keys Table */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="flex items-center text-nexus-text-primary">
            <Key className="w-5 h-5 mr-2 text-nexus-blue" />
            API Keys ({apiKeys.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-nexus-blue" />
              <span className="ml-2 text-nexus-text-secondary">Loading API keys...</span>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No API Keys Yet</h3>
              <p className="text-nexus-text-secondary mb-4">Add your first API key to start integrating with external services.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">
                      {PROVIDERS.find(p => p.name === key.provider)?.label || key.provider}
                    </TableCell>
                    <TableCell>{key.category}</TableCell>
                    <TableCell>{key.label || '-'}</TableCell>
                    <TableCell>{getStatusBadge(key.test_status)}</TableCell>
                    <TableCell>{key.usage_this_month} requests</TableCell>
                    <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestKey(key.id)}
                          disabled={testing === key.id}
                          className="border-nexus-border hover:bg-nexus-bg-secondary"
                        >
                          {testing === key.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <TestTube className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteKey(key.id)}
                          className="border-nexus-border hover:bg-nexus-bg-secondary text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}