'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Building,
  Plus,
  Eye,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Palette,
  Type,
  Image,
  Video,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Users,
  BarChart3,
  Save,
  Upload,
  Download,
  Share2,
  Copy,
  Trash2,
  Move,
  RotateCcw,
  RotateCw
} from 'lucide-react'

interface Website {
  id: string
  name: string
  domain: string
  status: 'draft' | 'published' | 'archived'
  template: string
  pages: number
  visitors: number
  conversions: number
  lastModified: string
  thumbnail?: string
}

interface PageElement {
  id: string
  type: 'text' | 'image' | 'button' | 'form' | 'video' | 'hero' | 'testimonial'
  content: any
  position: { x: number; y: number }
  size: { width: number; height: number }
  style: any
}

export default function WebsitesPage() {
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [websiteName, setWebsiteName] = useState('')
  const [websiteDomain, setWebsiteDomain] = useState('')

  // Mock data
  const websites: Website[] = [
    {
      id: '1',
      name: 'Marketing Agency Site',
      domain: 'myagency.nexus.app',
      status: 'published',
      template: 'Agency',
      pages: 5,
      visitors: 1247,
      conversions: 23,
      lastModified: '2026-04-24T10:30:00Z'
    },
    {
      id: '2',
      name: 'E-commerce Store',
      domain: 'mystores.nexus.app',
      status: 'published',
      template: 'E-commerce',
      pages: 8,
      visitors: 3421,
      conversions: 156,
      lastModified: '2026-04-23T15:45:00Z'
    },
    {
      id: '3',
      name: 'Personal Blog',
      domain: 'myblog.nexus.app',
      status: 'draft',
      template: 'Blog',
      pages: 3,
      visitors: 0,
      conversions: 0,
      lastModified: '2026-04-22T09:20:00Z'
    },
    {
      id: '4',
      name: 'Landing Page',
      domain: 'mylaunch.nexus.app',
      status: 'published',
      template: 'Landing',
      pages: 1,
      visitors: 5678,
      conversions: 89,
      lastModified: '2026-04-21T14:15:00Z'
    }
  ]

  const templates = [
    {
      id: 'blank',
      name: 'Blank Canvas',
      description: 'Start from scratch',
      icon: Palette
    },
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Perfect for product launches',
      icon: Zap
    },
    {
      id: 'business',
      name: 'Business Website',
      description: 'Professional business presence',
      icon: Building
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      description: 'Online store with products',
      icon: ShoppingCart
    },
    {
      id: 'blog',
      name: 'Blog & Magazine',
      description: 'Content-focused website',
      icon: Type
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Showcase your work',
      icon: Users
    }
  ]

  const elements = [
    { type: 'text', name: 'Text Block', icon: Type },
    { type: 'image', name: 'Image', icon: Image },
    { type: 'button', name: 'Button', icon: Zap },
    { type: 'hero', name: 'Hero Section', icon: Zap },
    { type: 'form', name: 'Contact Form', icon: Mail },
    { type: 'video', name: 'Video Player', icon: Video },
    { type: 'testimonial', name: 'Testimonials', icon: Users }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateWebsite = () => {
    if (!websiteName.trim() || !websiteDomain.trim()) return

    // In real app, this would create a new website
    console.log('Creating website:', websiteName, websiteDomain)
    setIsBuilding(true)
    setWebsiteName('')
    setWebsiteDomain('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-gray-600">Create stunning websites and sales funnels with drag-and-drop simplicity.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Site
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsBuilding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Website
          </Button>
        </div>
      </div>

      {/* Create Website Modal */}
      {isBuilding && !selectedWebsite && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Website Name</Label>
                <Input
                  id="siteName"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="Enter website name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDomain">Domain</Label>
                <Input
                  id="siteDomain"
                  value={websiteDomain}
                  onChange={(e) => setWebsiteDomain(e.target.value)}
                  placeholder="yoursite.nexus.app"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Choose Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <template.icon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsBuilding(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebsite}>
                Create Website
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Website Builder Interface */}
      {isBuilding && selectedWebsite && (
        <div className="grid grid-cols-12 gap-6 h-screen">
          {/* Toolbar */}
          <div className="col-span-2 bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Elements</h3>
            <div className="space-y-2">
              {elements.map((element) => (
                <div
                  key={element.type}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <element.icon className="w-4 h-4" />
                  <span className="text-sm">{element.name}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Properties</h3>
              {selectedElement ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Font Size</Label>
                    <Select defaultValue="16">
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                        <SelectItem value="24">24px</SelectItem>
                        <SelectItem value="32">32px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Color</Label>
                    <input type="color" defaultValue="#000000" className="w-full h-8 rounded" />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select an element to edit properties</p>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-8 bg-white border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden">
            {/* Canvas Toolbar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Move className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Smartphone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Canvas Content */}
            <div className="h-full p-8 pt-20">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Hero Section Placeholder */}
                <div className="bg-gray-100 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h2 className="text-2xl font-bold text-gray-600 mb-2">Hero Section</h2>
                  <p className="text-gray-500">Drag elements here to build your hero section</p>
                </div>

                {/* Content Sections Placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                    <Type className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Text Block</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                    <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Image</p>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Contact Form</p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="col-span-2 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Page Settings</h3>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Page Title</Label>
                <Input defaultValue="Home Page" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">SEO Description</Label>
                <Textarea
                  placeholder="Describe your page for search engines"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Background Color</Label>
                <input type="color" defaultValue="#ffffff" className="w-full h-8 rounded" />
              </div>

              <div className="border-t pt-4">
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Websites Grid */}
      {!isBuilding && (
        <Tabs defaultValue="websites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="websites">My Websites</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="websites" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="w-8 h-8 text-blue-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">{websites.length}</div>
                      <div className="text-sm text-gray-600">Total Websites</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Globe className="w-8 h-8 text-green-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {websites.filter(w => w.status === 'published').length}
                      </div>
                      <div className="text-sm text-gray-600">Published</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {websites.reduce((sum, w) => sum + w.visitors, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Visitors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-orange-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {websites.reduce((sum, w) => sum + w.conversions, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Conversions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Websites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((website) => (
                <Card key={website.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{website.name}</CardTitle>
                      <Badge className={getStatusColor(website.status)}>
                        {website.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-8 h-8 text-gray-400" />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Domain:</span>
                        <span className="font-medium">{website.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pages:</span>
                        <span className="font-medium">{website.pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visitors:</span>
                        <span className="font-medium">{website.visitors.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversions:</span>
                        <span className="font-medium">{website.conversions}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedWebsite(website.id)
                          setIsBuilding(true)
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <template.icon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    <Button className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Globe className="w-8 h-8 text-blue-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">24.5K</div>
                      <div className="text-sm text-gray-600">Page Views</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-green-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">8.7K</div>
                      <div className="text-sm text-gray-600">Unique Visitors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">3.2%</div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Website Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {websites.filter(w => w.visitors > 0).map((website) => (
                    <div key={website.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{website.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {website.visitors} visitors • {website.conversions} conversions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(website.conversions / Math.max(website.visitors, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">Conversion Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}