'use client'

import { useState, useRef, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Upload,
  Download,
  Wand2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  Palette,
  Contrast,
  Sun,
  Droplets,
  Zap,
  Sparkles,
  Image as ImageIcon,
  Settings,
  RefreshCw,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Eye,
  EyeOff,
  Layers,
  Type,
  Stamp,
  Eraser,
  Brush,
  Move,
  Square,
  Circle,
  Triangle,
  Minus,
  Plus,
  MinusIcon
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface ImageEdit {
  id: string
  name: string
  type: 'filter' | 'adjustment' | 'effect' | 'text' | 'shape' | 'crop'
  parameters: any
  applied: boolean
}

interface EditedImage {
  original: string
  current: string
  edits: ImageEdit[]
  history: string[]
}

export default function ImageStudioPage() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [editedImage, setEditedImage] = useState<EditedImage | null>(null)
  const [loading, setLoading] = useState(false)
  const [tool, setTool] = useState<'select' | 'crop' | 'brush' | 'eraser' | 'text' | 'shape'>('select')
  const [zoom, setZoom] = useState(1)
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const [hue, setHue] = useState([0])
  const [blur, setBlur] = useState([0])
  const [selectedFilter, setSelectedFilter] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [textColor, setTextColor] = useState('#000000')
  const [textSize, setTextSize] = useState([24])
  const [generatingImage, setGeneratingImage] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [aiStyle, setAiStyle] = useState('')
  const [aiModel, setAiModel] = useState('kie-realistic-v2')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const filters = [
    { name: 'none', label: 'None' },
    { name: 'grayscale', label: 'Grayscale' },
    { name: 'sepia', label: 'Sepia' },
    { name: 'vintage', label: 'Vintage' },
    { name: 'warm', label: 'Warm' },
    { name: 'cool', label: 'Cool' },
    { name: 'dramatic', label: 'Dramatic' },
    { name: 'vibrant', label: 'Vibrant' },
    { name: 'muted', label: 'Muted' },
    { name: 'high-contrast', label: 'High Contrast' },
    { name: 'soft-focus', label: 'Soft Focus' },
    { name: 'dreamy', label: 'Dreamy' },
    { name: 'cyberpunk', label: 'Cyberpunk' },
    { name: 'minimalist', label: 'Minimalist' },
    { name: 'noir', label: 'Noir' },
    { name: 'pastel', label: 'Pastel' }
  ]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          setImage(img)
          setEditedImage({
            original: e.target?.result as string,
            current: e.target?.result as string,
            edits: [],
            history: [e.target?.result as string]
          })
          drawImageOnCanvas(img)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    multiple: false
  })

  const drawImageOnCanvas = (img: HTMLImageElement) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match image
    canvas.width = img.width
    canvas.height = img.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw image
    ctx.drawImage(img, 0, 0)

    // Apply current filters
    applyFiltersToCanvas()
  }

  const applyFiltersToCanvas = () => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Reset to original image
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0)

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Apply filters
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // Brightness
      r = Math.min(255, r * (brightness[0] / 100))
      g = Math.min(255, g * (brightness[0] / 100))
      b = Math.min(255, b * (brightness[0] / 100))

      // Contrast
      const contrastFactor = (259 * (contrast[0] + 255)) / (255 * (259 - contrast[0]))
      r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128))
      g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128))
      b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128))

      // Saturation
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
      r = gray + (r - gray) * (saturation[0] / 100)
      g = gray + (g - gray) * (saturation[0] / 100)
      b = gray + (b - gray) * (saturation[0] / 100)

      // Hue shift (simplified)
      if (hue[0] !== 0) {
        // This would require HSL conversion - simplified for demo
        const hueShift = hue[0] / 360
        // Apply basic hue rotation
      }

      // Blur (simplified)
      if (blur[0] > 0) {
        // This would require convolution - simplified for demo
      }

      // Apply selected filter
      if (selectedFilter && selectedFilter !== 'none') {
        applyFilter(selectedFilter, r, g, b, i, data)
      }

      data[i] = Math.min(255, Math.max(0, r))
      data[i + 1] = Math.min(255, Math.max(0, g))
      data[i + 2] = Math.min(255, Math.max(0, b))
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const applyFilter = (filterName: string, r: number, g: number, b: number, index: number, data: Uint8ClampedArray) => {
    switch (filterName) {
      case 'grayscale':
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
        data[index] = data[index + 1] = data[index + 2] = gray
        break
      case 'sepia':
        data[index] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
        data[index + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
        data[index + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
        break
      case 'vintage':
        data[index] = Math.min(255, r * 1.2)
        data[index + 1] = Math.min(255, g * 0.9)
        data[index + 2] = Math.min(255, b * 0.8)
        break
      // Add more filters as needed
    }
  }

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    try {
      setGeneratingImage(true)
      const data = await apiClient.generateImage({
        prompt,
        model: aiModel,
        style: aiStyle,
        width: 1024,
        height: 1024,
      })

      setGeneratedImages(prev => [data.data || data, ...prev.slice(0, 9)])
    } catch (error: any) {
      console.error('Error generating image:', error)
      alert(error.message || 'Failed to generate image. Please check your API keys.')
    } finally {
      setGeneratingImage(false)
    }
  }

  const handleRemoveBackground = async () => {
    if (!editedImage?.current) return

    try {
      setGeneratingImage(true)
      const data = await apiClient.removeBackground(editedImage.current)
      setEditedImage({
        ...editedImage,
        current: data.data?.url || data.url,
        history: [...editedImage.history, data.data?.url || data.url]
      })
    } catch (error: any) {
      console.error('Error removing background:', error)
      alert(error.message || 'Failed to remove background.')
    } finally {
      setGeneratingImage(false)
    }
  }

  const handleUpscaleImage = async () => {
    if (!editedImage?.current) return

    try {
      setGeneratingImage(true)
      const data = await apiClient.upscaleImage(editedImage.current, 2)
      setEditedImage({
        ...editedImage,
        current: data.data?.url || data.url,
        history: [...editedImage.history, data.data?.url || data.url]
      })
    } catch (error: any) {
      console.error('Error upscaling image:', error)
      alert(error.message || 'Failed to upscale image.')
    } finally {
      setGeneratingImage(false)
    }
  }

  const handleBatchProcess = async () => {
    // This would process multiple images
    alert('Batch processing feature coming soon!')
  }

  const exportImage = (format: 'png' | 'jpg' | 'webp') => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL(`image/${format}`)
    const link = document.createElement('a')
    link.download = `edited-image.${format}`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetImage = () => {
    if (!editedImage) return

    setBrightness([100])
    setContrast([100])
    setSaturation([100])
    setHue([0])
    setBlur([0])
    setSelectedFilter('none')

    if (image) {
      drawImageOnCanvas(image)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-xl font-bold text-nexus-text-primary">Image Studio</h1>
          <p className="text-nexus-text-secondary">AI-powered image editing and generation</p>
        </div>

        <div className="flex items-center space-x-3">
          {image && (
            <>
              <Button variant="outline" onClick={resetImage} className="border-nexus-border">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Select onValueChange={(value: 'png' | 'jpg' | 'webp') => exportImage(value)}>
                <SelectTrigger className="w-32 border-nexus-border">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">Export PNG</SelectItem>
                  <SelectItem value="jpg">Export JPG</SelectItem>
                  <SelectItem value="webp">Export WebP</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-white border-r border-nexus-border flex flex-col items-center py-4 space-y-2">
          <Button
            variant={tool === 'select' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('select')}
            className="w-12 h-12 p-0"
          >
            <Move className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'crop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('crop')}
            className="w-12 h-12 p-0"
          >
            <Crop className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'brush' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('brush')}
            className="w-12 h-12 p-0"
          >
            <Brush className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="w-12 h-12 p-0"
          >
            <Eraser className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'text' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('text')}
            className="w-12 h-12 p-0"
          >
            <Type className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'shape' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('shape')}
            className="w-12 h-12 p-0"
          >
            <Square className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {!image ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div
                {...getRootProps()}
                className={`w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-nexus-blue bg-nexus-blue/10'
                    : 'border-nexus-border hover:border-nexus-blue hover:bg-nexus-bg-secondary'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-nexus-text-tertiary mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-nexus-text-primary mb-2">
                    {isDragActive ? 'Drop your image here' : 'Upload or drag an image'}
                  </h3>
                  <p className="text-nexus-text-secondary mb-4">
                    Supports PNG, JPG, GIF, WebP, and SVG files
                  </p>
                  <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-nexus-bg-secondary">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full shadow-lg border border-nexus-border"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow">
                  <div className="text-sm text-nexus-text-primary">
                    Zoom: {Math.round(zoom * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-white border-l border-nexus-border flex flex-col">
          <Tabs defaultValue="edit" className="flex-1 flex flex-col">
            <div className="p-4 border-b border-nexus-border">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="ai">AI Tools</TabsTrigger>
                <TabsTrigger value="generate">Generate</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="edit" className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Filters */}
              <div className="space-y-3">
                <Label className="text-nexus-text-primary font-medium">Filters</Label>
                <Select value={selectedFilter} onValueChange={(value) => {
                  setSelectedFilter(value)
                  setTimeout(applyFiltersToCanvas, 100)
                }}>
                  <SelectTrigger className="border-nexus-border">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filters.map(filter => (
                      <SelectItem key={filter.name} value={filter.name}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Adjustments */}
              <div className="space-y-4">
                <Label className="text-nexus-text-primary font-medium">Adjustments</Label>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Brightness</span>
                      <span className="text-nexus-text-primary">{brightness[0]}%</span>
                    </div>
                    <Slider
                      value={brightness}
                      onValueChange={(value) => {
                        setBrightness(value)
                        setTimeout(applyFiltersToCanvas, 100)
                      }}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Contrast</span>
                      <span className="text-nexus-text-primary">{contrast[0]}%</span>
                    </div>
                    <Slider
                      value={contrast}
                      onValueChange={(value) => {
                        setContrast(value)
                        setTimeout(applyFiltersToCanvas, 100)
                      }}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Saturation</span>
                      <span className="text-nexus-text-primary">{saturation[0]}%</span>
                    </div>
                    <Slider
                      value={saturation}
                      onValueChange={(value) => {
                        setSaturation(value)
                        setTimeout(applyFiltersToCanvas, 100)
                      }}
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Hue</span>
                      <span className="text-nexus-text-primary">{hue[0]}°</span>
                    </div>
                    <Slider
                      value={hue}
                      onValueChange={(value) => {
                        setHue(value)
                        setTimeout(applyFiltersToCanvas, 100)
                      }}
                      max={180}
                      min={-180}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-nexus-text-secondary">Blur</span>
                      <span className="text-nexus-text-primary">{blur[0]}px</span>
                    </div>
                    <Slider
                      value={blur}
                      onValueChange={(value) => {
                        setBlur(value)
                        setTimeout(applyFiltersToCanvas, 100)
                      }}
                      max={20}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 pt-4 border-t border-nexus-border">
                <Label className="text-nexus-text-primary font-medium">Quick Actions</Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveBackground}
                    className="w-full border-nexus-border justify-start"
                  >
                    <Scissors className="w-4 h-4 mr-2" />
                    Remove Background
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpscaleImage}
                    className="w-full border-nexus-border justify-start"
                  >
                    <ZoomIn className="w-4 h-4 mr-2" />
                    Upscale to 8K
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchProcess}
                    className="w-full border-nexus-border justify-start"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Batch Process
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-4">
                <Label className="text-nexus-text-primary font-medium">AI-Powered Enhancements</Label>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <Wand2 className="w-4 h-4 mr-2 text-nexus-violet" />
                    Auto Enhance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <Zap className="w-4 h-4 mr-2 text-nexus-amber" />
                    Smart Sharpen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <Palette className="w-4 h-4 mr-2 text-nexus-green" />
                    Color Correction
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-nexus-border justify-start"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-nexus-blue" />
                    Remove Artifacts
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="generate" className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* AI Image Generation */}
              <div className="space-y-4">
                <Label className="text-nexus-text-primary font-medium">AI Image Generation</Label>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-nexus-text-secondary">Describe your image</Label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A beautiful sunset over mountains with vibrant colors..."
                      rows={4}
                      className="w-full mt-1 px-3 py-2 border border-nexus-border rounded-md focus:ring-nexus-blue focus:border-nexus-blue resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-nexus-text-secondary">Style (Optional)</Label>
                    <Select value={aiStyle} onValueChange={setAiStyle}>
                      <SelectTrigger className="mt-1 border-nexus-border">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default</SelectItem>
                        <SelectItem value="photorealistic">Photorealistic</SelectItem>
                        <SelectItem value="illustration">Illustration</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                        <SelectItem value="dreamy">Dreamy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerateImage}
                    disabled={!prompt.trim() || generatingImage}
                    className="w-full bg-nexus-violet hover:bg-nexus-violet/90 text-white"
                  >
                    {generatingImage ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Generated Images Gallery */}
              {generatedImages.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-nexus-text-primary font-medium">Recent Generations</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {generatedImages.map((imgUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imgUrl}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            const img = new Image()
                            img.onload = () => {
                              setImage(img)
                              setEditedImage({
                                original: imgUrl,
                                current: imgUrl,
                                edits: [],
                                history: [imgUrl]
                              })
                              drawImageOnCanvas(img)
                            }
                            img.src = imgUrl
                          }}
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.download = `ai-generated-${index + 1}.png`
                            link.href = imgUrl
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}