'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  Wand2,
  Sparkles,
  Zap,
  Palette,
  Contrast,
  Sun,
  Droplets,
  Settings
} from 'lucide-react'

interface ImageFilter {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  sepia: number
}

export default function ImageEditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null)
  const [filters, setFilters] = useState<ImageFilter>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
  })

  const [aiEnhancements, setAiEnhancements] = useState({
    removeBackground: false,
    enhanceColors: false,
    sharpen: false,
    denoise: false,
    upscale: false,
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setOriginalImage(img)
        setCurrentImage(img)
        drawImage(img)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const drawImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match image
    canvas.width = img.width
    canvas.height = img.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
    `

    // Draw image
    ctx.drawImage(img, 0, 0)

    // Reset filter
    ctx.filter = 'none'
  }, [filters])

  // Redraw when filters change
  React.useEffect(() => {
    if (currentImage) {
      drawImage(currentImage)
    }
  }, [currentImage, drawImage])

  const updateFilter = (filterName: keyof ImageFilter, value: number) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
  }

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      sepia: 0,
    })
  }

  const rotateImage = (degrees: number) => {
    const canvas = canvasRef.current
    if (!canvas || !currentImage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create new canvas for rotation
    const newCanvas = document.createElement('canvas')
    const newCtx = newCanvas.getContext('2d')
    if (!newCtx) return

    // Calculate new dimensions
    const angle = (degrees * Math.PI) / 180
    const cos = Math.abs(Math.cos(angle))
    const sin = Math.abs(Math.sin(angle))
    const newWidth = canvas.width * cos + canvas.height * sin
    const newHeight = canvas.width * sin + canvas.height * cos

    newCanvas.width = newWidth
    newCanvas.height = newHeight

    // Rotate and draw
    newCtx.translate(newWidth / 2, newHeight / 2)
    newCtx.rotate(angle)
    newCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)

    // Update main canvas
    canvas.width = newWidth
    canvas.height = newHeight
    ctx.drawImage(newCanvas, 0, 0)
  }

  const flipImage = (horizontal: boolean) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.scale(horizontal ? -1 : 1, horizontal ? 1 : -1)
    ctx.drawImage(canvas, horizontal ? -canvas.width : 0, horizontal ? 0 : -canvas.height)
    ctx.restore()
  }

  const applyAiEnhancement = (enhancement: keyof typeof aiEnhancements) => {
    setAiEnhancements(prev => ({ ...prev, [enhancement]: !prev[enhancement] }))

    // Simulate AI processing
    setTimeout(() => {
      console.log(`Applied AI enhancement: ${enhancement}`)
      // In real implementation, this would call AI APIs
    }, 1000)
  }

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'edited-image.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Toolbar */}
      <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 p-0"
        >
          <Upload className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => rotateImage(-90)}
          className="w-10 h-10 p-0"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => rotateImage(90)}
          className="w-10 h-10 p-0"
        >
          <RotateCw className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => flipImage(true)}
          className="w-10 h-10 p-0"
        >
          <FlipHorizontal className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => flipImage(false)}
          className="w-10 h-10 p-0"
        >
          <FlipVertical className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-10 h-10 p-0"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="text-sm text-gray-600">
              {originalImage ? `${originalImage.width} × ${originalImage.height}` : 'No image loaded'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Crop className="w-4 h-4 mr-2" />
              Crop
            </Button>
            <Button variant="outline">
              <Scissors className="w-4 h-4 mr-2" />
              Resize
            </Button>
            <Button onClick={exportImage} disabled={!currentImage}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 bg-white shadow-lg max-w-full max-h-full"
              style={{ maxWidth: '800px', maxHeight: '600px' }}
            />
            {!currentImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Upload an image to start editing</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4"
                  >
                    Choose Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <Tabs defaultValue="filters" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="ai">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto">
            {/* Basic Filters */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Basic Adjustments
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Brightness</Label>
                    <span className="text-sm text-gray-600">{filters.brightness}%</span>
                  </div>
                  <Slider
                    value={[filters.brightness]}
                    onValueChange={([value]) => updateFilter('brightness', value)}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Contrast</Label>
                    <span className="text-sm text-gray-600">{filters.contrast}%</span>
                  </div>
                  <Slider
                    value={[filters.contrast]}
                    onValueChange={([value]) => updateFilter('contrast', value)}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Saturation</Label>
                    <span className="text-sm text-gray-600">{filters.saturation}%</span>
                  </div>
                  <Slider
                    value={[filters.saturation]}
                    onValueChange={([value]) => updateFilter('saturation', value)}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Hue Rotate</Label>
                    <span className="text-sm text-gray-600">{filters.hue}°</span>
                  </div>
                  <Slider
                    value={[filters.hue]}
                    onValueChange={([value]) => updateFilter('hue', value)}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Blur</Label>
                    <span className="text-sm text-gray-600">{filters.blur}px</span>
                  </div>
                  <Slider
                    value={[filters.blur]}
                    onValueChange={([value]) => updateFilter('blur', value)}
                    min={0}
                    max={20}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Sepia</Label>
                    <span className="text-sm text-gray-600">{filters.sepia}%</span>
                  </div>
                  <Slider
                    value={[filters.sepia]}
                    onValueChange={([value]) => updateFilter('sepia', value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Enhancements
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wand2 className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Remove Background</p>
                      <p className="text-sm text-gray-600">AI-powered background removal</p>
                    </div>
                  </div>
                  <Button
                    variant={aiEnhancements.removeBackground ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyAiEnhancement('removeBackground')}
                  >
                    {aiEnhancements.removeBackground ? 'Applied' : 'Apply'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Enhance Colors</p>
                      <p className="text-sm text-gray-600">AI color correction and enhancement</p>
                    </div>
                  </div>
                  <Button
                    variant={aiEnhancements.enhanceColors ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyAiEnhancement('enhanceColors')}
                  >
                    {aiEnhancements.enhanceColors ? 'Applied' : 'Apply'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Sharpen Image</p>
                      <p className="text-sm text-gray-600">AI-powered image sharpening</p>
                    </div>
                  </div>
                  <Button
                    variant={aiEnhancements.sharpen ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyAiEnhancement('sharpen')}
                  >
                    {aiEnhancements.sharpen ? 'Applied' : 'Apply'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Remove Noise</p>
                      <p className="text-sm text-gray-600">AI denoising and quality improvement</p>
                    </div>
                  </div>
                  <Button
                    variant={aiEnhancements.denoise ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyAiEnhancement('denoise')}
                  >
                    {aiEnhancements.denoise ? 'Applied' : 'Apply'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Upscale Image</p>
                      <p className="text-sm text-gray-600">AI upscaling to higher resolution</p>
                    </div>
                  </div>
                  <Button
                    variant={aiEnhancements.upscale ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyAiEnhancement('upscale')}
                  >
                    {aiEnhancements.upscale ? 'Applied' : 'Apply'}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Sparkles className="w-4 h-4" />
                  <span>AI processing powered by advanced machine learning</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}