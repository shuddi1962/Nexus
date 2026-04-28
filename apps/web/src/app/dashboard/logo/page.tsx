'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Palette,
  Type,
  Image as ImageIcon,
  Download,
  Save,
  Wand2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Layers,
  Shapes,
  Plus,
  Trash2,
  Copy,
  Move,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Star,
  Heart,
  Zap,
  Settings
} from 'lucide-react'

interface LogoDesign {
  id: string
  name: string
  prompt: string
  style: string
  primary_color: string
  secondary_color: string
  icon_type: string
  font_family: string
  layout: 'icon_only' | 'text_only' | 'icon_left' | 'icon_top' | 'icon_right'
  generated_urls: string[]
  selected_url: string
  created_at: string
}

export default function LogoCreatorPage() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Logo properties
  const [logoName, setLogoName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('minimalist')
  const [primaryColor, setPrimaryColor] = useState('#1A1A2E')
  const [secondaryColor, setSecondaryColor] = useState('#6C47FF')
  const [iconType, setIconType] = useState('abstract')
  const [fontFamily, setFontFamily] = useState('Instrument Sans')
  const [layout, setLayout] = useState<'icon_only' | 'text_only' | 'icon_left' | 'icon_top' | 'icon_right'>('icon_left')

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedLogos, setGeneratedLogos] = useState<LogoDesign[]>([])
  const [currentLogo, setCurrentLogo] = useState<LogoDesign | null>(null)

  // Logo library
  const [logoLibrary, setLogoLibrary] = useState<LogoDesign[]>([])

  // Zoom
  const [zoom, setZoom] = useState(1)

  const styles = [
    { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
    { id: 'retro', name: 'Retro', description: 'Vintage inspired' },
    { id: 'bold', name: 'Bold', description: 'Strong and impactful' },
    { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined' },
    { id: 'playful', name: 'Playful', description: 'Fun and creative' },
    { id: 'corporate', name: 'Corporate', description: 'Professional business' },
    { id: 'tech', name: 'Tech', description: 'Technology focused' },
    { id: 'organic', name: 'Organic', description: 'Natural and flowing' },
    { id: 'geometric', name: 'Geometric', description: 'Structured shapes' }
  ]

  const iconTypes = [
    { id: 'abstract', name: 'Abstract', icon: Shapes },
    { id: 'letter', name: 'Letter Mark', icon: Type },
    { id: 'symbol', name: 'Symbol', icon: Star },
    { id: 'emblem', name: 'Emblem', icon: Hexagon },
    { id: 'mascot', name: 'Mascot', icon: Heart },
    { id: 'combination', name: 'Combination', icon: Zap }
  ]

  const fonts = [
    'Instrument Sans',
    'Fraunces',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New'
  ]

  const layouts = [
    { id: 'icon_only', name: 'Icon Only', icon: Square },
    { id: 'text_only', name: 'Text Only', icon: Type },
    { id: 'icon_left', name: 'Icon Left', icon: Layers },
    { id: 'icon_top', name: 'Icon Top', icon: Layers },
    { id: 'icon_right', name: 'Icon Right', icon: Layers }
  ]

  useEffect(() => {
    loadLogoLibrary()
  }, [])

  const loadLogoLibrary = async () => {
    try {
      // Mock logo library - would load from API
      setLogoLibrary([
        {
          id: '1',
          name: 'TechCorp Logo',
          prompt: 'Modern tech company logo with circuit pattern',
          style: 'tech',
          primary_color: '#0652DD',
          secondary_color: '#6C47FF',
          icon_type: 'abstract',
          font_family: 'Instrument Sans',
          layout: 'icon_left',
          generated_urls: ['https://via.placeholder.com/400x400/0652DD/FFFFFF?text=TC'],
          selected_url: 'https://via.placeholder.com/400x400/0652DD/FFFFFF?text=TC',
          created_at: '2026-04-20T10:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Error loading logo library:', error)
    }
  }

  const handleGenerateLogo = async () => {
    if (!prompt.trim() && !logoName.trim()) return

    try {
      setIsGenerating(true)
      setGenerationProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * 15
        })
      }, 800)

      const data = await apiClient.generateLogo({
        name: logoName,
        prompt,
        style,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        icon_type: iconType,
        font_family: fontFamily,
        layout
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      const newLogo: LogoDesign = {
        id: data.logo_id || `logo-${Date.now()}`,
        name: logoName || 'Untitled Logo',
        prompt,
        style,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        icon_type: iconType,
        font_family: fontFamily,
        layout,
        generated_urls: data.logo_variations || [
          `https://via.placeholder.com/400x400/${primaryColor.replace('#', '')}/FFFFFF?text=${logoName.substring(0, 2).toUpperCase()}`,
          `https://via.placeholder.com/400x400/${secondaryColor.replace('#', '')}/FFFFFF?text=${logoName.substring(0, 2).toUpperCase()}`,
          `https://via.placeholder.com/400x400/000000/FFFFFF?text=${logoName.substring(0, 2).toUpperCase()}`
        ],
        selected_url: '',
        created_at: new Date().toISOString()
      }

      newLogo.selected_url = newLogo.generated_urls[0]
      setCurrentLogo(newLogo)
      setGeneratedLogos(prev => [newLogo, ...prev])
      setLogoLibrary(prev => [newLogo, ...prev])
    } catch (error) {
      console.error('Error generating logo:', error)
      alert('Failed to generate logo. Please check your API keys and try again.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const selectLogoVariation = (logo: LogoDesign, url: string) => {
    const updated = { ...logo, selected_url: url }
    setCurrentLogo(updated)

    // Update in library
    setLogoLibrary(prev =>
      prev.map(l => l.id === logo.id ? updated : l)
    )
  }

  const saveLogo = (logo: LogoDesign) => {
    // Would save to API
    alert(`Logo "${logo.name}" saved successfully!`)
  }

  const downloadLogo = (logo: LogoDesign, format: 'png' | 'svg' | 'pdf') => {
    if (!logo.selected_url) return

    const link = document.createElement('a')
    link.download = `${logo.name}-logo.${format}`
    link.href = logo.selected_url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteLogo = (logoId: string) => {
    setLogoLibrary(prev => prev.filter(l => l.id !== logoId))
    if (currentLogo?.id === logoId) {
      setCurrentLogo(null)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Logo Creator</h1>
          <p className="text-nexus-text-secondary">AI-powered logo design for your brand</p>
        </div>

        {currentLogo && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => saveLogo(currentLogo)}
              className="border-nexus-border"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Logo
            </Button>
            <Select onValueChange={(value: 'png' | 'svg' | 'pdf') => downloadLogo(currentLogo, value)}>
              <SelectTrigger className="w-36 border-nexus-border">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">Export PNG</SelectItem>
                <SelectItem value="svg">Export SVG</SelectItem>
                <SelectItem value="pdf">Export PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Tabs defaultValue="create" className="flex-1 flex flex-col">
          <TabsList className="m-4 mb-0">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Creation Form */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-nexus-text-primary">
                    <Wand2 className="w-5 h-5 mr-2 text-nexus-violet" />
                    AI Logo Generation
                  </CardTitle>
                  <p className="text-sm text-nexus-text-secondary">
                    Describe your brand and let AI create the perfect logo.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Name */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Brand Name</Label>
                    <Input
                      value={logoName}
                      onChange={(e) => setLogoName(e.target.value)}
                      placeholder="e.g., TechCorp"
                      className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                    />
                  </div>

                  {/* Prompt */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Description</Label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A modern tech company logo with circuit patterns and blue tones..."
                      rows={3}
                      className="w-full px-3 py-2 border border-nexus-border rounded-md focus:ring-nexus-blue focus:border-nexus-blue resize-none"
                    />
                  </div>

                  {/* Style */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Icon Type */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Icon Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {iconTypes.map(type => (
                        <Button
                          key={type.id}
                          variant={iconType === type.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setIconType(type.id)}
                          className="border-nexus-border flex-col h-auto py-3"
                        >
                          <type.icon className="w-5 h-5 mb-1" />
                          <span className="text-xs">{type.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-nexus-text-primary font-medium">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 rounded border border-nexus-border cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => {/* Open color picker */}}
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-nexus-text-primary font-medium">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 rounded border border-nexus-border cursor-pointer"
                          style={{ backgroundColor: secondaryColor }}
                          onClick={() => {/* Open color picker */}}
                        />
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map(f => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Layout */}
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Layout</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {layouts.map(l => (
                        <Button
                          key={l.id}
                          variant={layout === l.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setLayout(l.id as any)}
                          className="border-nexus-border flex-col h-auto py-3"
                        >
                          <l.icon className="w-4 h-4 mb-1" />
                          <span className="text-xs">{l.name.split(' ')[0]}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateLogo}
                    disabled={(!prompt.trim() && !logoName.trim()) || isGenerating}
                    className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white h-12"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Generating Logo... {generationProgress.toFixed(0)}%
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Logo
                      </>
                    )}
                  </Button>

                  {/* Progress */}
                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="w-full bg-nexus-bg-secondary rounded-full h-2">
                        <div
                          className="bg-nexus-violet h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Right Column - Preview */}
              <div className="space-y-6">
                {currentLogo ? (
                  <>
                    {/* Main Preview */}
                    <Card className="border-nexus-border">
                      <CardHeader>
                        <CardTitle className="text-nexus-text-primary">Logo Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-nexus-bg-secondary rounded-lg p-8 flex items-center justify-center">
                          <div
                            className="bg-white rounded-lg shadow-lg p-6"
                            style={{ transform: `scale(${zoom})` }}
                          >
                            <img
                              src={currentLogo.selected_url}
                              alt={currentLogo.name}
                              className="max-w-full max-h-48 object-contain"
                            />
                          </div>
                        </div>

                        {/* Zoom Controls */}
                        <div className="flex items-center justify-center space-x-4 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                            className="border-nexus-border"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-nexus-text-primary min-w-[60px] text-center">
                            {Math.round(zoom * 100)}%
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                            className="border-nexus-border"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(1)}
                            className="border-nexus-border"
                          >
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Logo Variations */}
                    <Card className="border-nexus-border">
                      <CardHeader>
                        <CardTitle className="text-nexus-text-primary">Variations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                          {currentLogo.generated_urls.map((url, index) => (
                            <div
                              key={index}
                              className={`border-2 rounded-lg p-3 cursor-pointer hover:border-nexus-blue transition-colors ${
                                currentLogo.selected_url === url ? 'border-nexus-blue bg-nexus-blue/10' : 'border-nexus-border'
                              }`}
                              onClick={() => selectLogoVariation(currentLogo, url)}
                            >
                              <img
                                src={url}
                                alt={`Variation ${index + 1}`}
                                className="w-full h-20 object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="border-nexus-border h-full">
                    <CardContent className="h-full flex items-center justify-center p-12">
                      <div className="text-center">
                        <Palette className="w-16 h-16 text-nexus-text-tertiary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Logo Yet</h3>
                        <p className="text-nexus-text-secondary">
                          Generate your first AI-powered logo to get started.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="flex-1 overflow-y-auto p-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Logo Library</CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Your generated logo collection
                </p>
              </CardHeader>
              <CardContent>
                {logoLibrary.length === 0 ? (
                  <div className="text-center py-12">
                    <Palette className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Logos Yet</h3>
                    <p className="text-nexus-text-secondary mb-6">
                      Generate your first AI logo to get started.
                    </p>
                    <Button
                      onClick={() => (document.querySelector('[data-value="create"]') as HTMLElement)?.click()}
                      className="bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Logo
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {logoLibrary.map((logo) => (
                      <div key={logo.id} className="border border-nexus-border rounded-lg p-4 space-y-3">
                        <div className="bg-nexus-bg-secondary rounded-lg p-4 flex items-center justify-center">
                          <img
                            src={logo.selected_url || logo.generated_urls[0]}
                            alt={logo.name}
                            className="max-w-full h-24 object-contain"
                          />
                        </div>

                        <div>
                          <h4 className="font-medium text-nexus-text-primary truncate">{logo.name}</h4>
                          <p className="text-sm text-nexus-text-secondary capitalize">{logo.style}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="border-nexus-border"
                            style={{ borderColor: logo.primary_color }}
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-1"
                              style={{ backgroundColor: logo.primary_color }}
                            />
                            Primary
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-nexus-border"
                            style={{ borderColor: logo.secondary_color }}
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-1"
                              style={{ backgroundColor: logo.secondary_color }}
                            />
                            Secondary
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentLogo(logo)
                              ;(document.querySelector('[data-value="preview"]') as HTMLElement)?.click()
                            }}
                            className="border-nexus-border flex-1"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadLogo(logo, 'png')}
                            className="border-nexus-border"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteLogo(logo.id)}
                            className="border-nexus-red text-nexus-red hover:bg-nexus-red/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 p-6">
            <Card className="border-nexus-border h-full">
              <CardContent className="h-full flex flex-col items-center justify-center p-8">
                {currentLogo ? (
                  <div className="w-full max-w-2xl space-y-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-nexus-text-primary mb-2">{currentLogo.name}</h3>
                      <p className="text-nexus-text-secondary">{currentLogo.prompt}</p>
                    </div>

                    {/* Large Preview */}
                    <div className="bg-nexus-bg-secondary rounded-xl p-12 flex items-center justify-center">
                      <img
                        src={currentLogo.selected_url}
                        alt={currentLogo.name}
                        className="max-w-full max-h-64 object-contain"
                      />
                    </div>

                    {/* Logo Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Style</div>
                        <div className="font-medium text-nexus-text-primary capitalize">{currentLogo.style}</div>
                      </div>
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Icon Type</div>
                        <div className="font-medium text-nexus-text-primary capitalize">{currentLogo.icon_type}</div>
                      </div>
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Font</div>
                        <div className="font-medium text-nexus-text-primary">{currentLogo.font_family}</div>
                      </div>
                      <div>
                        <div className="text-sm text-nexus-text-tertiary">Layout</div>
                        <div className="font-medium text-nexus-text-primary capitalize">{currentLogo.layout.replace('_', ' ')}</div>
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                      <div className="text-sm text-nexus-text-tertiary mb-2">Color Palette</div>
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <div
                            className="h-16 rounded-lg border border-nexus-border"
                            style={{ backgroundColor: currentLogo.primary_color }}
                          />
                          <div className="text-center text-sm mt-1 text-nexus-text-primary">Primary</div>
                        </div>
                        <div className="flex-1">
                          <div
                            className="h-16 rounded-lg border border-nexus-border"
                            style={{ backgroundColor: currentLogo.secondary_color }}
                          />
                          <div className="text-center text-sm mt-1 text-nexus-text-primary">Secondary</div>
                        </div>
                      </div>
                    </div>

                    {/* Download Options */}
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        onClick={() => downloadLogo(currentLogo, 'png')}
                        className="bg-nexus-blue hover:bg-nexus-accent text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadLogo(currentLogo, 'svg')}
                        className="border-nexus-border"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download SVG
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => saveLogo(currentLogo)}
                        className="border-nexus-border"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Logo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Palette className="w-24 h-24 text-nexus-text-tertiary mb-6" />
                    <h3 className="text-2xl font-semibold text-nexus-text-primary mb-2">No Logo Selected</h3>
                    <p className="text-nexus-text-secondary mb-6">
                      Generate or select a logo to preview
                    </p>
                    <Button
                      onClick={() => (document.querySelector('[data-value="create"]') as HTMLElement)?.click()}
                      className="bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Logo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
