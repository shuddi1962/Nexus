'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Globe,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Search,
  BarChart3
} from 'lucide-react'

interface Site {
  id: string
  name: string
  url: string
  status: 'connected' | 'error' | 'pending'
  pages: number
  seoScore: number
  lastAudit: string
}

export default function SitesPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const sites: Site[] = [
    {
      id: '1',
      name: 'Main Website',
      url: 'https://example.com',
      status: 'connected',
      pages: 247,
      seoScore: 92,
      lastAudit: '2 hours ago'
    },
    {
      id: '2',
      name: 'Blog',
      url: 'https://blog.example.com',
      status: 'connected',
      pages: 89,
      seoScore: 88,
      lastAudit: '5 hours ago'
    },
    {
      id: '3',
      name: 'E-commerce Store',
      url: 'https://shop.example.com',
      status: 'error',
      pages: 0,
      seoScore: 45,
      lastAudit: '1 day ago'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-nexus-green/10 text-nexus-green border-nexus-green/20'
      case 'error': return 'bg-nexus-red/10 text-nexus-red border-nexus-red/20'
      case 'pending': return 'bg-nexus-amber/10 text-nexus-amber border-nexus-amber/20'
      default: return 'bg-nexus-bg-secondary text-nexus-text-secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Site Manager</h1>
          <p className="text-nexus-text-secondary">Manage and monitor all your connected websites.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <BarChart3 className="w-4 h-4 mr-2 text-nexus-blue" />
            SEO Overview
          </Button>
          <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
            <Plus className="w-4 h-4 mr-2" />
            Connect Site
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Sites</CardTitle>
            <Globe className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">3</div>
            <p className="text-xs text-nexus-text-secondary">2 connected, 1 error</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Pages</CardTitle>
            <Globe className="h-4 w-4 text-nexus-violet" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">336</div>
            <p className="text-xs text-nexus-text-secondary">Across all sites</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Avg SEO Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">75</div>
            <p className="text-xs text-nexus-text-secondary">Out of 100</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-nexus-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">12</div>
            <p className="text-xs text-nexus-text-secondary">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allsites" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="allsites">All Sites</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="issues">Has Issues</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-tertiary" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-nexus-border"
            />
          </div>
        </div>

        <TabsContent value="allsites" className="space-y-4">
          {sites
            .filter(site => site.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((site) => (
              <Card
                key={site.id}
                className={`border-nexus-border hover:shadow-md transition-all cursor-pointer ${
                  selectedSite === site.id ? 'ring-2 ring-nexus-blue' : ''
                }`}
                onClick={() => setSelectedSite(site.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-nexus-bg-secondary rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-nexus-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium text-nexus-text-primary">{site.name}</h3>
                        <p className="text-sm text-nexus-text-secondary">{site.url}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-nexus-text-tertiary">{site.pages} pages</span>
                          <span className="text-xs text-nexus-text-tertiary">•</span>
                          <span className="text-xs text-nexus-text-tertiary">SEO: {site.seoScore}/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(site.status)}>
                        {site.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-nexus-red hover:text-nexus-red hover:bg-nexus-red/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="connected">
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-nexus-green mx-auto mb-4" />
            <p className="text-nexus-text-secondary">Connected sites view</p>
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-nexus-red mx-auto mb-4" />
            <p className="text-nexus-text-secondary">Sites with issues</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
