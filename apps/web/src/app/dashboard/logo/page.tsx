'use client'

import { useState } from 'react'
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
  Wand2,
  Download,
  Save,
  Share,
  RefreshCw,
  Star,
  Eye,
  CheckCircle,
  Heart,
  ThumbsUp
} from 'lucide-react'

interface LogoVariation {
  id: number
  name: string
  svg_url: string
  png_url: string
  style: string
  colors: string[]
  fonts: string
  rating: number
  tags: string[]
}

export default function LogoCreatorPage() {
  const { user } = useAuth()
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [style, setStyle] = useState('modern')
  const [selectedColors, setSelectedColors] = useState(['#0066CC', '#FFFFFF'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [logoVariations, setLogoVariations] = useState<LogoVariation[]>([])
  const [selectedLogo, setSelectedLogo] = useState<LogoVariation | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerIndex, setColorPickerIndex] = useState(0)

  const industries = [
    'technology', 'finance', 'healthcare', 'education', 'retail',
    'food', 'travel', 'real estate', 'consulting', 'entertainment',
    'sports', 'automotive', 'fashion', 'beauty', 'fitness'
  ]

  const styles = [
    { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
    { id: 'classic', name: 'Classic', description: 'Traditional and timeless' },
    { id: 'bold', name: 'Bold', description: 'Strong and impactful' },
    { id: 'playful', name: 'Playful', description: 'Fun and energetic' },
    { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined' }
  ]

  const colorPalettes = [
    { name: 'Blue Professional', colors: ['#0066CC', '#FFFFFF', '#333333'] },
    { name: 'Green Nature', colors: ['#22C55E', '#FFFFFF', '#1F2937'] },
    { name: 'Purple Creative', colors: ['#8B5CF6', '#FFFFFF', '#374151'] },
    { name: 'Red Energy', colors: ['#EF4444', '#FFFFFF', '#1F2937'] },
    { name: 'Orange Warm', colors: ['#F97316', '#FFFFFF', '#374151'] },
    { name: 'Teal Cool', colors: ['#14B8A6', '#FFFFFF', '#1F2937'] }
  ]

  const handleGenerateLogos = async () => {
    if (!companyName.trim()) return

    try {
      setIsGenerating(true)
      const data = await apiClient.generateLogo({
        company_name: companyName,
        industry,
        style,
        colors: selectedColors
      })

      setLogoVariations(data.variations || [])
    } catch (error) {
      console.error('Error generating logos:', error)
      alert('Failed to generate logos. Please check your API keys and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleColorChange = (color: string) => {
    const newColors = [...selectedColors]
    newColors[colorPickerIndex] = color
    setSelectedColors(newColors)
  }

  const addColor = () => {
    if (selectedColors.length < 5) {
      setSelectedColors([...selectedColors, '#666666'])
    }
  }

  const removeColor = (index: number) => {
    if (selectedColors.length > 2) {
      const newColors = selectedColors.filter((_, i) => i !== index)
      setSelectedColors(newColors)
    }
  }

  const selectColorPalette = (palette: typeof colorPalettes[0]) => {
    setSelectedColors(palette.colors)
  }

  const downloadLogo = (logo: LogoVariation, format: 'svg' | 'png') => {
    const url = format === 'svg' ? logo.svg_url : logo.png_url
    const link = document.createElement('a')
    link.download = `${companyName}-logo-${logo.id}.${format}`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-nexus-amber text-nexus-amber' : 'text-nexus-text-tertiary'}`}
      />
    ))
  }

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Logo Creator</h1>
          <p className="text-nexus-text-secondary">AI-powered logo generation and brand identity design</p>
        </div>

        {selectedLogo && (
          <div className="flex items-center space-x-3">
            <Select onValueChange={(value: 'svg' | 'png') => downloadLogo(selectedLogo, value)}>
              <SelectTrigger className="w-32 border-nexus-border">
                <SelectValue placeholder="Download" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svg">Download SVG</SelectItem>
                <SelectItem value="png">Download PNG</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-nexus-border">
              <Save className="w-4 h-4 mr-2" />
              Save Logo
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Tabs defaultValue="generate" className="flex-1 flex flex-col">
          <TabsList className="m-4 mb-0">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="flex-1 overflow-y-auto p-6 space-y-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="flex items-center text-nexus-text-primary">
                  <Wand2 className="w-5 h-5 mr-2 text-nexus-violet" />
                  AI Logo Generation
                </CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Create professional logos tailored to your brand with AI assistance.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Company Name *</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-nexus-text-primary font-medium">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="border-nexus-border">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => (
                          <SelectItem key={ind} value={ind}>
                            {ind.charAt(0).toUpperCase() + ind.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Style Selection */}
                <div className="space-y-3">
                  <Label className="text-nexus-text-primary font-medium">Logo Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {styles.map(s => (
                      <div
                        key={s.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          style === s.id
                            ? 'border-nexus-blue bg-nexus-blue/10'
                            : 'border-nexus-border hover:border-nexus-blue/50'
                        }`}
                        onClick={() => setStyle(s.id)}
                      >
                        <div className="font-medium text-nexus-text-primary">{s.name}</div>
                        <div className="text-sm text-nexus-text-secondary">{s.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-nexus-text-primary font-medium">Brand Colors</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addColor}
                      disabled={selectedColors.length >= 5}
                      className="border-nexus-border"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Add Color
                    </Button>
                  </div>

                  {/* Color Palette Presets */}
                  <div className="space-y-2">
                    <Label className="text-sm text-nexus-text-secondary">Quick Palettes</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorPalettes.map((palette, index) => (
                        <button
                          key={index}
                          onClick={() => selectColorPalette(palette)}
                          className="flex items-center space-x-2 px-3 py-1 border border-nexus-border rounded-lg hover:bg-nexus-bg-secondary transition-colors"
                        >
                          <div className="flex space-x-1">
                            {palette.colors.slice(0, 3).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-4 h-4 rounded border border-nexus-border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-nexus-text-primary">{palette.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="flex flex-wrap gap-3">
                    {selectedColors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded border-2 border-nexus-border cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setColorPickerIndex(index)
                            setShowColorPicker(true)
                          }}
                        />
                        <Input
                          value={color}
                          onChange={(e) => {
                            const newColors = [...selectedColors]
                            newColors[index] = e.target.value
                            setSelectedColors(newColors)
                          }}
                          className="w-24 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                        />
                        {selectedColors.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColor(index)}
                            className="text-nexus-red hover:text-nexus-red hover:bg-nexus-red/10"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Color Picker Dialog */}
                  <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
                    <DialogContent className="sm:max-w-[300px]">
                      <DialogHeader>
                        <DialogTitle>Choose Color</DialogTitle>
                      </DialogHeader>
                      <ColorPicker
                        color={selectedColors[colorPickerIndex]}
                        onChange={handleColorChange}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateLogos}
                  disabled={!companyName.trim() || isGenerating}
                  className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white h-12"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating Logos...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Logo Variations
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Logos */}
            {logoVariations.length > 0 && (
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary">Logo Variations</CardTitle>
                  <p className="text-sm text-nexus-text-secondary">
                    Choose your favorite logo design from the generated variations.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {logoVariations.map((logo) => (
                      <div
                        key={logo.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedLogo?.id === logo.id
                            ? 'border-nexus-blue bg-nexus-blue/5'
                            : 'border-nexus-border hover:border-nexus-blue/50 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedLogo(logo)}
                      >
                        {/* Logo Preview */}
                        <div className="aspect-square bg-white border border-nexus-border rounded-lg mb-4 flex items-center justify-center">
                          <img
                            src={logo.png_url}
                            alt={`${companyName} logo ${logo.id}`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Logo'
                            }}
                          />
                        </div>

                        {/* Logo Info */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-nexus-text-primary">{logo.name}</h3>
                            <div className="flex items-center space-x-1">
                              {renderStars(logo.rating)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <Badge variant="outline" className="border-nexus-border capitalize">
                              {logo.style}
                            </Badge>
                            <span className="text-nexus-text-secondary">{logo.fonts}</span>
                          </div>

                          {/* Color Palette */}
                          <div className="flex space-x-1">
                            {logo.colors.slice(0, 4).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-6 h-6 rounded border border-nexus-border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {logo.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs border-nexus-border">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadLogo(logo, 'png')
                              }}
                              className="flex-1 border-nexus-border"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              PNG
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadLogo(logo, 'svg')
                              }}
                              className="flex-1 border-nexus-border"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              SVG
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="design" className="flex-1 overflow-y-auto p-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="flex items-center text-nexus-text-primary">
                  <Palette className="w-5 h-5 mr-2 text-nexus-green" />
                  Logo Customization
                </CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Fine-tune your selected logo with advanced customization options.
                </p>
              </CardHeader>
              <CardContent>
                {selectedLogo ? (
                  <div className="space-y-6">
                    {/* Logo Preview */}
                    <div className="flex justify-center">
                      <div className="w-64 h-64 bg-white border-2 border-nexus-border rounded-lg flex items-center justify-center">
                        <img
                          src={selectedLogo.png_url}
                          alt="Selected logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Customization Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-nexus-text-primary font-medium">Typography</Label>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Font Family</Label>
                            <Select defaultValue={selectedLogo.fonts}>
                              <SelectTrigger className="mt-1 border-nexus-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Montserrat">Montserrat</SelectItem>
                                <SelectItem value="Poppins">Poppins</SelectItem>
                                <SelectItem value="Open Sans">Open Sans</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Font Weight</Label>
                            <Select defaultValue="bold">
                              <SelectTrigger className="mt-1 border-nexus-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                                <SelectItem value="black">Black</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-nexus-text-primary font-medium">Layout & Spacing</Label>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Letter Spacing</Label>
                            <Slider
                              defaultValue={[0]}
                              max={10}
                              min={-5}
                              step={0.5}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Icon Size</Label>
                            <Slider
                              defaultValue={[100]}
                              max={150}
                              min={50}
                              step={5}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-4 pt-4 border-t border-nexus-border">
                      <Label className="text-nexus-text-primary font-medium">Advanced Options</Label>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="border-nexus-border">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" className="border-nexus-border">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                          <Save className="w-4 h-4 mr-2" />
                          Apply Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Palette className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
                      No Logo Selected
                    </h3>
                    <p className="text-nexus-text-secondary mb-6">
                      Generate logo variations first, then select one to customize.
                    </p>
                    <Button
                      onClick={() => document.querySelector('[data-value="generate"]')?.click()}
                      className="bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Logos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="flex-1 overflow-y-auto p-6">
            <Card className="border-nexus-border">
              <CardHeader>
                <CardTitle className="text-nexus-text-primary">Logo Gallery</CardTitle>
                <p className="text-sm text-nexus-text-secondary">
                  Browse and manage your saved logos and brand assets.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Palette className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
                    Logo Gallery Coming Soon
                  </h3>
                  <p className="text-nexus-text-secondary mb-6">
                    Save and organize your logos, track versions, and manage brand assets.
                  </p>
                  <Button className="bg-nexus-green hover:bg-nexus-green/90 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Enable Logo Gallery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}