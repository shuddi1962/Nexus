'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Globe,
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Settings
} from 'lucide-react'

interface IndexedSite {
  id: string
  url: string
  status: 'indexed' | 'pending' | 'error'
  pagesIndexed: number
  lastIndexed: string
  autoIndex: boolean
}

export default function IndexingPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [newUrl, setNewUrl] = useState('')

  const sites: IndexedSite[] = [
    {
      id: '1',
      url: 'https://example.com',
      status: 'indexed',
      pagesIndexed: 247,
      lastIndexed: '2 hours ago',
      autoIndex: true
    },
    {
      id: '2',
      url: 'https://blog.example.com',
      status: 'pending',
      pagesIndexed: 89,
      lastIndexed: '5 min ago',
      autoIndex: true
    },
    {
      id: '3',
      url: 'https://shop.example.com',
      status: 'error',
      pagesIndexed: 0,
      lastIndexed: '1 day ago',
      autoIndex: false
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed': return <CheckCircle className="w-4 h-4 text-nexus-green" />
      case 'pending': return <Clock className="w-4 h-4 text-nexus-amber" />
      case 'error': return <AlertCircle className="w-4 h-4 text-nexus-red" />
    }
  }

  const handleAddSite = () => {
    if (!newUrl.trim()) return
    alert('Site added for indexing!')
    setNewUrl('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Auto-Indexing</h1>
          <p className="text-nexus-text-secondary">Automatically index your websites for search engines.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Settings className="w-4 h-4 mr-2 text-nexus-blue" />
            Settings
          </Button>
          <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-index All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sites" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sites">Indexed Sites</TabsTrigger>
          <TabsTrigger value="add">Add New Site</TabsTrigger>
          <TabsTrigger value="settings">Indexing Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-nexus-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Sites</CardTitle>
                <Globe className="h-4 w-4 text-nexus-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text-primary">12</div>
                <p className="text-xs text-nexus-text-secondary">3 auto-indexing</p>
              </CardContent>
            </Card>

            <Card className="border-nexus-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-primary">Pages Indexed</CardTitle>
                <CheckCircle className="h-4 w-4 text-nexus-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text-primary">1,247</div>
                <p className="text-xs text-nexus-text-secondary">+89 this week</p>
              </CardContent>
            </Card>

            <Card className="border-nexus-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-primary">Errors</CardTitle>
                <AlertCircle className="h-4 w-4 text-nexus-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text-primary">2</div>
                <p className="text-xs text-nexus-text-secondary">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Indexed Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className={`p-4 border rounded-lg hover:bg-nexus-bg-secondary transition-colors cursor-pointer ${
                      selectedSite === site.id ? 'border-nexus-blue bg-nexus-blue-light' : 'border-nexus-border'
                    }`}
                    onClick={() => setSelectedSite(site.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(site.status)}
                        <div>
                          <h3 className="font-medium text-nexus-text-primary">{site.url}</h3>
                          <p className="text-sm text-nexus-text-secondary">
                            {site.pagesIndexed} pages • Last indexed {site.lastIndexed}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            site.status === 'indexed'
                              ? 'bg-nexus-green/10 text-nexus-green border-nexus-green/20'
                              : site.status === 'pending'
                              ? 'bg-nexus-amber/10 text-nexus-amber border-nexus-amber/20'
                              : 'bg-nexus-red/10 text-nexus-red border-nexus-red/20'
                          }
                        >
                          {site.status}
                        </Badge>
                        {site.autoIndex && (
                          <Badge className="bg-nexus-blue/10 text-nexus-blue border-nexus-blue/20">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-nexus-border">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Re-index
                      </Button>
                      <Button variant="outline" size="sm" className="border-nexus-border">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" className="border-nexus-red text-nexus-red hover:bg-nexus-red/10">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Add New Site for Indexing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteUrl" className="text-nexus-text-primary">Website URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="siteUrl"
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 border-nexus-border focus:ring-nexus-blue"
                  />
                  <Button onClick={handleAddSite} className="bg-nexus-blue hover:bg-nexus-accent text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Site
                  </Button>
                </div>
              </div>

              <div className="bg-nexus-bg-secondary p-4 rounded-lg">
                <h4 className="font-medium text-nexus-text-primary mb-2">What gets indexed?</h4>
                <ul className="text-sm text-nexus-text-secondary space-y-1">
                  <li>• All public pages linked from your homepage</li>
                  <li>• Blog posts and articles</li>
                  <li>• Product pages and categories</li>
                  <li>• Automatically submits to Google, Bing, and other search engines</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Indexing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-nexus-text-primary">Auto-Index New Pages</h4>
                    <p className="text-sm text-nexus-text-secondary">Automatically index new pages as they're discovered</p>
                  </div>
                  <Button variant="outline" className="border-nexus-border">Enabled</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-nexus-text-primary">Submit to Search Engines</h4>
                    <p className="text-sm text-nexus-text-secondary">Auto-submit sitemaps to Google, Bing, etc.</p>
                  </div>
                  <Button variant="outline" className="border-nexus-border">Enabled</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-nexus-text-primary">Indexing Frequency</h4>
                    <p className="text-sm text-nexus-text-secondary">How often to re-index your sites</p>
                  </div>
                  <Button variant="outline" className="border-nexus-border">Daily</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
