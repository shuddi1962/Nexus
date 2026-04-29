'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api'
import {
  Plus, Rss, CheckCircle, XCircle, Clock, RefreshCw,
  Trash2, Edit2, ExternalLink, AlertTriangle
} from 'lucide-react'

interface RSSFeed {
  id: string
  name: string
  url: string
  type: 'rss'
  status: 'active' | 'inactive'
  last_fetched?: string
  last_successful_poll?: string
  total_items_found: number
  fetch_interval: number
  health_status?: string
  next_fetch?: string
  created_at: string
}

export default function RSSFeedsPage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editingFeed, setEditingFeed] = useState<RSSFeed | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    fetch_interval: 30
  })

  useEffect(() => {
    fetchFeeds()
  }, [])

  const fetchFeeds = async () => {
    try {
      setLoading(true)
      const data = await apiClient.call('/content/feeds')
      setFeeds(data || [])
    } catch (error) {
      console.error('Error fetching RSS feeds:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (feed?: RSSFeed) => {
    if (feed) {
      setEditingFeed(feed)
      setFormData({
        name: feed.name,
        url: feed.url,
        fetch_interval: feed.fetch_interval
      })
    } else {
      setEditingFeed(null)
      setFormData({ name: '', url: '', fetch_interval: 30 })
    }
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      if (editingFeed) {
        await apiClient.call(`/content/feeds/${editingFeed.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData)
        })
      } else {
        await apiClient.call('/content/feeds', {
          method: 'POST',
          body: JSON.stringify(formData)
        })
      }
      setShowDialog(false)
      fetchFeeds()
    } catch (error) {
      console.error('Error saving feed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RSS feed?')) return
    try {
      await apiClient.call(`/content/feeds/${id}`, {
        method: 'DELETE'
      })
      fetchFeeds()
    } catch (error) {
      console.error('Error deleting feed:', error)
    }
  }

  const handlePollFeed = async (feedId?: string) => {
    try {
      setPolling(true)
      const result = await apiClient.call('/content/feeds/poll', {
        method: 'POST',
        body: JSON.stringify(feedId ? { feed_id: feedId } : {})
      })
      alert(`Polled ${result.feeds_polled} feeds, found ${result.new_items} new items`)
      fetchFeeds()
    } catch (error) {
      console.error('Error polling feeds:', error)
    } finally {
      setPolling(false)
    }
  }

  const getHealthBadge = (feed: RSSFeed) => {
    if (!feed.last_fetched) {
      return <Badge className="bg-gray-100 text-gray-800">Never Fetched</Badge>
    }
    const now = Date.now()
    const lastFetched = new Date(feed.last_fetched).getTime()
    const intervalMs = feed.fetch_interval * 60000
    const isHealthy = (now - lastFetched) < (intervalMs * 2)

    return isHealthy ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" /> Healthy
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" /> Stale
      </Badge>
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleString()
  }

  const formatInterval = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`
    return `${Math.floor(minutes / 1440)} days`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading RSS feeds...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">RSS Feed Management</h1>
          <p className="text-nexus-text-secondary mt-1">
            Manage RSS feeds for automatic content discovery
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handlePollFeed()}
            disabled={polling || feeds.length === 0}
          >
            {polling ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Poll All Feeds
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-nexus-blue hover:bg-nexus-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Feed
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-nexus-text-secondary">Total Feeds</p>
                <p className="text-2xl font-bold text-nexus-text-primary">{feeds.length}</p>
              </div>
              <Rss className="w-8 h-8 text-nexus-blue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-nexus-text-secondary">Active Feeds</p>
                <p className="text-2xl font-bold text-green-600">
                  {feeds.filter(f => f.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-nexus-text-secondary">Total Items Found</p>
                <p className="text-2xl font-bold text-nexus-violet">
                  {feeds.reduce((sum, f) => sum + (f.total_items_found || 0), 0)}
                </p>
              </div>
              <ExternalLink className="w-8 h-8 text-nexus-violet" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feeds List */}
      {feeds.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Rss className="w-16 h-16 mx-auto text-nexus-text-tertiary mb-4" />
            <h2 className="text-xl font-semibold mb-2">No RSS Feeds Yet</h2>
            <p className="text-nexus-text-secondary mb-6">
              Add your first RSS feed to start discovering content automatically.
            </p>
            <Button onClick={() => handleOpenDialog()} className="bg-nexus-blue hover:bg-nexus-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Feed
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feeds.map(feed => (
            <Card key={feed.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Rss className="w-5 h-5 text-nexus-orange" />
                      <h3 className="font-semibold text-lg">{feed.name}</h3>
                      {getHealthBadge(feed)}
                      <Badge className={feed.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {feed.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-nexus-text-secondary">
                      <p className="flex items-center gap-2">
                        <ExternalLink className="w-3 h-3" />
                        <a href={feed.url} target="_blank" rel="noopener noreferrer" className="hover:text-nexus-blue">
                          {feed.url}
                        </a>
                      </p>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Poll Interval: {formatInterval(feed.fetch_interval)}
                        </span>
                        <span>Last Fetched: {formatDate(feed.last_fetched)}</span>
                        <span>Items Found: {feed.total_items_found || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePollFeed(feed.id)}
                      disabled={polling}
                      title="Poll Now"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(feed)}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(feed.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingFeed ? 'Edit' : 'Add'} RSS Feed</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Feed Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My News Feed"
                />
              </div>
              <div>
                <Label htmlFor="url">RSS Feed URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/rss.xml"
                />
              </div>
              <div>
                <Label htmlFor="interval">Poll Interval (minutes)</Label>
                <Input
                  id="interval"
                  type="number"
                  value={formData.fetch_interval}
                  onChange={e => setFormData({ ...formData, fetch_interval: parseInt(e.target.value) || 30 })}
                  min={5}
                />
                <p className="text-xs text-nexus-text-secondary mt-1">Minimum 5 minutes</p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button onClick={handleSave} className="bg-nexus-blue hover:bg-nexus-blue/90">
                  {editingFeed ? 'Update' : 'Add'} Feed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
