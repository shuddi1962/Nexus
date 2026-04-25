'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Globe,
  Settings,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sync,
  Upload,
  Link,
  Key,
  User,
  Lock
} from 'lucide-react'

interface ConnectedSite {
  id: string
  name: string
  url: string
  platform: 'wordpress' | 'ghost' | 'webflow' | 'shopify' | 'custom'
  status: 'connected' | 'disconnected' | 'error'
  last_sync?: string
  created_at: string
}

export default function SitesPage() {
  const { user } = useAuth()
  const [sites, setSites] = useState<ConnectedSite[]>([])
  const [loading, setLoading] = useState(true)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [syncingSite, setSyncingSite] = useState<string | null>(null)

  // Connect site form
  const [connectForm, setConnectForm] = useState({
    name: '',
    url: '',
    platform: '' as ConnectedSite['platform'],
    api_key: '',
    username: '',
    password: '',
    useCredentials: false
  })

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getConnectedSites()
      setSites(data || [])
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectSite = async () => {
    if (!connectForm.name || !connectForm.url || !connectForm.platform) return

    try {
      await apiClient.connectSite({
        name: connectForm.name,
        url: connectForm.url,
        platform: connectForm.platform,
        ...(connectForm.useCredentials && {
          api_key: connectForm.api_key,
          username: connectForm.username,
          password: connectForm.password
        })
      })

      setConnectForm({
        name: '',
        url: '',
        platform: '' as any,
        api_key: '',
        username: '',
        password: '',
        useCredentials: false
      })
      setShowConnectDialog(false)
      fetchSites()
      alert('Site connected successfully!')
    } catch (error) {
      console.error('Error connecting site:', error)
      alert('Failed to connect site. Please check your credentials and try again.')
    }
  }

  const handleSyncSite = async (siteId: string) => {
    try {
      setSyncingSite(siteId)
      await apiClient.syncSite(siteId)
      fetchSites()
      alert('Site synced successfully!')
    } catch (error) {
      console.error('Error syncing site:', error)
      alert('Failed to sync site.')
    } finally {
      setSyncingSite(null)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'wordpress':
        return '📝'
      case 'ghost':
        return '👻'
      case 'webflow':
        return '🎨'
      case 'shopify':
        return '🛒'
      default:
        return '🌐'
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'wordpress':
        return 'WordPress'
      case 'ghost':
        return 'Ghost'
      case 'webflow':
        return 'Webflow'
      case 'shopify':
        return 'Shopify'
      default:
        return 'Custom'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-nexus-green text-white'
      case 'disconnected':
        return 'bg-nexus-red text-white'
      case 'error':
        return 'bg-nexus-amber text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  const getConnectionInstructions = (platform: string) => {
    switch (platform) {
      case 'wordpress':
        return {
          title: 'WordPress Setup',
          steps: [
            'Install and activate the "Application Passwords" plugin',
            'Go to Users → Profile and generate an Application Password',
            'Use your WordPress username and the generated password',
            'Ensure REST API is enabled (usually enabled by default)'
          ]
        }
      case 'ghost':
        return {
          title: 'Ghost Setup',
          steps: [
            'Go to Settings → Integrations in your Ghost admin',
            'Create a new Custom Integration',
            'Copy the Admin API Key',
            'Use the key in the API Key field above'
          ]
        }
      case 'webflow':
        return {
          title: 'Webflow Setup',
          steps: [
            'Go to Site Settings → Apps & Integrations',
            'Generate an API token',
            'Find your Collection ID from the CMS API docs',
            'Use the token in the API Key field'
          ]
        }
      default:
        return {
          title: 'Custom Platform',
          steps: [
            'Ensure your platform supports REST API',
            'Generate API credentials if required',
            'Test the connection before saving'
          ]
        }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexus-text-primary">Site Manager</h1>
            <p className="text-nexus-text-secondary">Loading connected sites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Site Manager</h1>
          <p className="text-nexus-text-secondary">Connect and manage your websites for seamless content publishing.</p>
        </div>
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogTrigger asChild>
            <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
              <Plus className="w-4 h-4 mr-2" />
              Connect Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-nexus-text-primary">Connect New Website</DialogTitle>
            </DialogHeader>
            <ConnectSiteForm
              form={connectForm}
              setForm={setConnectForm}
              onSubmit={handleConnectSite}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sites Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-nexus-blue mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {sites.length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Connected Sites</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-nexus-green mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {sites.filter(s => s.status === 'connected').length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Active Connections</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Sync className="w-8 h-8 text-nexus-violet mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {sites.filter(s => s.last_sync).length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Recently Synced</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Sites */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">Connected Websites</CardTitle>
          <p className="text-sm text-nexus-text-secondary">
            Manage your website connections and publishing destinations.
          </p>
        </CardHeader>
        <CardContent>
          {sites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Sites Connected</h3>
              <p className="text-nexus-text-secondary mb-6">
                Connect your first website to start publishing content automatically.
              </p>
              <Button
                onClick={() => setShowConnectDialog(true)}
                className="bg-nexus-blue hover:bg-nexus-accent text-white"
              >
                <Link className="w-4 h-4 mr-2" />
                Connect Your First Site
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sites.map((site) => (
                <div key={site.id} className="p-4 border border-nexus-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getPlatformIcon(site.platform)}</div>
                      <div>
                        <h3 className="font-medium text-nexus-text-primary">{site.name}</h3>
                        <p className="text-sm text-nexus-text-secondary">{site.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(site.status)}>
                        {site.status}
                      </Badge>
                      <Badge variant="outline" className="border-nexus-border">
                        {getPlatformName(site.platform)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-nexus-text-secondary">
                      {site.last_sync
                        ? `Last synced: ${new Date(site.last_sync).toLocaleDateString()}`
                        : 'Never synced'
                      }
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(site.url, '_blank')}
                        className="border-nexus-border hover:bg-nexus-bg-secondary"
                      >
                        <ExternalLink className="w-4 h-4 mr-2 text-nexus-blue" />
                        Visit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncSite(site.id)}
                        disabled={syncingSite === site.id}
                        className="border-nexus-border hover:bg-nexus-bg-secondary"
                      >
                        {syncingSite === site.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin text-nexus-blue" />
                        ) : (
                          <Sync className="w-4 h-4 mr-2 text-nexus-blue" />
                        )}
                        Sync
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                        <Settings className="w-4 h-4 text-nexus-text-tertiary" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publishing Stats */}
      {sites.length > 0 && (
        <Card className="border-nexus-border">
          <CardHeader>
            <CardTitle className="text-nexus-text-primary">Publishing Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-nexus-bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-nexus-text-primary mb-1">0</div>
                <div className="text-sm text-nexus-text-secondary">Articles Published Today</div>
              </div>
              <div className="text-center p-4 bg-nexus-bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-nexus-text-primary mb-1">0</div>
                <div className="text-sm text-nexus-text-secondary">Scheduled for Publishing</div>
              </div>
              <div className="text-center p-4 bg-nexus-bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-nexus-text-primary mb-1">0</div>
                <div className="text-sm text-nexus-text-secondary">Failed Publications</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ConnectSiteForm({ form, setForm, onSubmit }: {
  form: any
  setForm: (form: any) => void
  onSubmit: () => void
}) {
  const instructions = form.platform ? getConnectionInstructions(form.platform) : null

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="help">Setup Help</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-nexus-text-primary">Site Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="My Blog"
                className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
            <div>
              <Label className="text-nexus-text-primary">Platform *</Label>
              <Select value={form.platform} onValueChange={(value: any) => setForm({ ...form, platform: value })}>
                <SelectTrigger className="mt-1 border-nexus-border">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wordpress">WordPress</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="webflow">Webflow</SelectItem>
                  <SelectItem value="shopify">Shopify</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-nexus-text-primary">Website URL *</Label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com"
              className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useCredentials"
              checked={form.useCredentials}
              onChange={(e) => setForm({ ...form, useCredentials: e.target.checked })}
              className="rounded border-nexus-border"
            />
            <Label htmlFor="useCredentials" className="text-nexus-text-primary">
              I have API credentials for this site
            </Label>
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          {form.platform === 'wordpress' && (
            <div className="space-y-4">
              <div className="p-4 bg-nexus-blue/10 rounded-lg">
                <p className="text-sm text-nexus-text-primary">
                  WordPress requires Application Passwords for API access.
                </p>
              </div>
              <div>
                <Label className="text-nexus-text-primary">Username *</Label>
                <Input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>
              <div>
                <Label className="text-nexus-text-primary">Application Password *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>
            </div>
          )}

          {(form.platform === 'ghost' || form.platform === 'webflow') && (
            <div className="space-y-4">
              <div className="p-4 bg-nexus-violet/10 rounded-lg">
                <p className="text-sm text-nexus-text-primary">
                  {form.platform === 'ghost' ? 'Ghost requires an Admin API Key.' : 'Webflow requires an API token.'}
                </p>
              </div>
              <div>
                <Label className="text-nexus-text-primary">API Key *</Label>
                <Input
                  value={form.api_key}
                  onChange={(e) => setForm({ ...form, api_key: e.target.value })}
                  placeholder="Your API key"
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>
            </div>
          )}

          {form.platform === 'custom' && (
            <div className="space-y-4">
              <div className="p-4 bg-nexus-amber/10 rounded-lg">
                <p className="text-sm text-nexus-text-primary">
                  For custom platforms, provide API credentials if your CMS supports REST API.
                </p>
              </div>
              <div>
                <Label className="text-nexus-text-primary">API Key (Optional)</Label>
                <Input
                  value={form.api_key}
                  onChange={(e) => setForm({ ...form, api_key: e.target.value })}
                  placeholder="API key if required"
                  className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          {instructions ? (
            <div>
              <h3 className="font-medium text-nexus-text-primary mb-4">{instructions.title}</h3>
              <ol className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-nexus-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-nexus-text-secondary">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <p className="text-nexus-text-secondary">
                Select a platform to see setup instructions.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          className="border-nexus-border hover:bg-nexus-bg-secondary"
          onClick={() => setForm({
            name: '',
            url: '',
            platform: '' as any,
            api_key: '',
            username: '',
            password: '',
            useCredentials: false
          })}
        >
          Reset
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!form.name || !form.url || !form.platform}
          className="bg-nexus-blue hover:bg-nexus-accent text-white"
        >
          Connect Site
        </Button>
      </div>
    </div>
  )
}