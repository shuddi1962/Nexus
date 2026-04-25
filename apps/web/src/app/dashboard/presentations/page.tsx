'use client'

import { useState, useRef } from 'react'
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
  Presentation,
  Plus,
  Play,
  Download,
  Save,
  Share,
  Eye,
  Edit,
  Trash2,
  Move,
  Type,
  Image as ImageIcon,
  Palette,
  Settings,
  Wand2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

interface PresentationSlide {
  id: number
  title: string
  content: string
  layout: 'hero' | 'title_content' | 'content_only' | 'image_content' | 'contact'
  background: string
  textColor: string
  elements: Array<{
    type: 'title' | 'content' | 'image' | 'shape'
    content: string
    position: { x: number; y: number }
    style: any
  }>
}

interface PresentationData {
  id: string
  topic: string
  slides: PresentationSlide[]
  theme: string
  template: string
  total_slides: number
  presentation_title: string
  estimated_duration: number
  fonts: string[]
  color_scheme: string[]
}

export default function PresentationBuilderPage() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [presentation, setPresentation] = useState<PresentationData | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [zoom, setZoom] = useState(1)

  // Creation parameters
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState([5])
  const [style, setStyle] = useState('modern')
  const [template, setTemplate] = useState('professional')
  const [isGenerating, setIsGenerating] = useState(false)

  // Edit mode
  const [selectedElement, setSelectedElement] = useState<any>(null)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [textSize, setTextSize] = useState([24])
  const [textColor, setTextColor] = useState('#000000')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Clean and corporate' },
    { id: 'modern', name: 'Modern', description: 'Contemporary design' },
    { id: 'creative', name: 'Creative', description: 'Artistic and bold' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' },
    { id: 'dark', name: 'Dark Theme', description: 'Dark background with light text' }
  ]

  const styles = [
    { id: 'modern', name: 'Modern', colors: ['#0066CC', '#FFFFFF', '#333333'] },
    { id: 'corporate', name: 'Corporate', colors: ['#1a365d', '#FFFFFF', '#4a5568'] },
    { id: 'creative', name: 'Creative', colors: ['#e53e3e', '#FFFFFF', '#2d3748'] },
    { id: 'minimalist', name: 'Minimalist', colors: ['#FFFFFF', '#000000', '#666666'] },
    { id: 'dark', name: 'Dark', colors: ['#1a1a1a', '#FFFFFF', '#666666'] }
  ]

  const handleCreatePresentation = async () => {
    if (!topic.trim()) return

    try {
      setIsGenerating(true)
      const data = await apiClient.createPresentation({
        topic,
        slides: slideCount[0],
        style,
        template
      })

      setPresentation(data)
      setCurrentSlideIndex(0)
    } catch (error) {
      console.error('Error creating presentation:', error)
      alert('Failed to create presentation. Please check your API keys and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const nextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const addTextElement = () => {
    if (!presentation) return

    const newElement = {
      type: 'content' as const,
      content: 'New text element',
      position: { x: 100, y: 200 },
      style: {
        fontSize: 24,
        color: '#000000',
        fontWeight: 'normal',
        textAlign: 'left'
      }
    }

    const updatedSlides = [...presentation.slides]
    updatedSlides[currentSlideIndex].elements.push(newElement)

    setPresentation({
      ...presentation,
      slides: updatedSlides
    })
  }

  const addImageElement = () => {
    if (!presentation) return

    const newElement = {
      type: 'image' as const,
      content: 'https://via.placeholder.com/400x300',
      position: { x: 100, y: 100 },
      style: { width: 400, height: 300 }
    }

    const updatedSlides = [...presentation.slides]
    updatedSlides[currentSlideIndex].elements.push(newElement)

    setPresentation({
      ...presentation,
      slides: updatedSlides
    })
  }

  const updateElement = (elementIndex: number, updates: any) => {
    if (!presentation) return

    const updatedSlides = [...presentation.slides]
    updatedSlides[currentSlideIndex].elements[elementIndex] = {
      ...updatedSlides[currentSlideIndex].elements[elementIndex],
      ...updates
    }

    setPresentation({
      ...presentation,
      slides: updatedSlides
    })
  }

  const deleteElement = (elementIndex: number) => {
    if (!presentation) return

    const updatedSlides = [...presentation.slides]
    updatedSlides[currentSlideIndex].elements.splice(elementIndex, 1)

    setPresentation({
      ...presentation,
      slides: updatedSlides
    })
  }

  const exportPresentation = (format: 'pdf' | 'pptx' | 'html') => {
    // Mock export - would integrate with presentation export service
    alert(`Exporting as ${format.toUpperCase()}... This feature would integrate with a presentation export service.`)
  }

  const currentSlide = presentation?.slides[currentSlideIndex]

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Presentation Builder</h1>
          <p className="text-nexus-text-secondary">AI-powered presentation creation and editing</p>
        </div>

        {presentation && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="border-nexus-border"
            >
              {isPreviewMode ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Select onValueChange={(value: 'pdf' | 'pptx' | 'html') => exportPresentation(value)}>
              <SelectTrigger className="w-32 border-nexus-border">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">Export PDF</SelectItem>
                <SelectItem value="pptx">Export PPTX</SelectItem>
                <SelectItem value="html">Export HTML</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-nexus-border">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      {!presentation ? (
        /* Creation Form */
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-2xl border-nexus-border">
            <CardHeader>
              <CardTitle className="flex items-center text-nexus-text-primary">
                <Wand2 className="w-5 h-5 mr-2 text-nexus-blue" />
                Create New Presentation
              </CardTitle>
              <p className="text-sm text-nexus-text-secondary">
                Generate a complete presentation with AI-powered content and design.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Presentation Topic</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., The Future of AI in Business"
                  className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label className="text-nexus-text-primary font-medium">Number of Slides</Label>
                  <span className="text-nexus-text-secondary">{slideCount[0]} slides</span>
                </div>
                <Slider
                  value={slideCount}
                  onValueChange={setSlideCount}
                  max={20}
                  min={3}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label className="text-nexus-text-primary font-medium">Template</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger className="border-nexus-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleCreatePresentation}
                disabled={!topic.trim() || isGenerating}
                className="w-full bg-nexus-blue hover:bg-nexus-accent text-white h-12"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Presentation...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Create Presentation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Presentation Editor */
        <div className="flex flex-1 overflow-hidden">
          {/* Slide Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Slide Navigation */}
            <div className="h-16 bg-white border-b border-nexus-border flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  className="border-nexus-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="text-nexus-text-primary font-medium">
                  Slide {currentSlideIndex + 1} of {presentation.slides.length}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={currentSlideIndex === presentation.slides.length - 1}
                  className="border-nexus-border"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="border-nexus-border">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-nexus-text-primary min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="border-nexus-border">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Slide Canvas */}
            <div className="flex-1 flex items-center justify-center p-8 bg-nexus-bg-secondary">
              <div
                ref={canvasRef}
                className="relative border-2 border-dashed border-nexus-border bg-white shadow-xl"
                style={{
                  width: 960 * zoom, // 16:9 aspect ratio
                  height: 540 * zoom,
                  maxWidth: '90vw',
                  maxHeight: '70vh'
                }}
              >
                {currentSlide && (
                  <div
                    className="w-full h-full relative overflow-hidden"
                    style={{ backgroundColor: currentSlide.background }}
                  >
                    {currentSlide.elements.map((element, index) => (
                      <div
                        key={index}
                        className={`absolute ${!isPreviewMode ? 'border-2 border-dashed border-nexus-blue cursor-pointer hover:border-nexus-blue/50' : ''}`}
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          ...element.style
                        }}
                        onClick={() => !isPreviewMode && setSelectedElement({ ...element, index })}
                      >
                        {element.type === 'title' && (
                          <h1
                            className="font-bold leading-tight"
                            style={{
                              fontSize: element.style.fontSize || 48,
                              color: element.style.color || currentSlide.textColor
                            }}
                          >
                            {element.content}
                          </h1>
                        )}

                        {element.type === 'content' && (
                          <p
                            className="leading-relaxed"
                            style={{
                              fontSize: element.style.fontSize || 24,
                              color: element.style.color || currentSlide.textColor
                            }}
                          >
                            {element.content}
                          </p>
                        )}

                        {element.type === 'image' && (
                          <img
                            src={element.content}
                            alt="Slide content"
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          {!isPreviewMode && (
            <div className="w-80 bg-white border-l border-nexus-border flex flex-col">
              <Tabs defaultValue="slides" className="flex-1 flex flex-col">
                <TabsList className="m-4 mb-0">
                  <TabsTrigger value="slides">Slides</TabsTrigger>
                  <TabsTrigger value="elements">Elements</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                </TabsList>

                <TabsContent value="slides" className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-nexus-text-primary font-medium">All Slides</Label>
                      <Button variant="outline" size="sm" className="border-nexus-border">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {presentation.slides.map((slide, index) => (
                        <div
                          key={slide.id}
                          className={`p-2 border-2 rounded cursor-pointer transition-colors ${
                            index === currentSlideIndex
                              ? 'border-nexus-blue bg-nexus-blue/10'
                              : 'border-nexus-border hover:border-nexus-blue/50'
                          }`}
                          onClick={() => setCurrentSlideIndex(index)}
                          style={{
                            aspectRatio: '16/9',
                            backgroundColor: slide.background
                          }}
                        >
                          <div className="text-xs text-center mt-1" style={{ color: slide.textColor }}>
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="elements" className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-nexus-text-primary font-medium">Add Elements</Label>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addTextElement}
                        className="w-full border-nexus-border justify-start"
                      >
                        <Type className="w-4 h-4 mr-2 text-nexus-blue" />
                        Add Text
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addImageElement}
                        className="w-full border-nexus-border justify-start"
                      >
                        <ImageIcon className="w-4 h-4 mr-2 text-nexus-green" />
                        Add Image
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-nexus-border justify-start"
                      >
                        <Palette className="w-4 h-4 mr-2 text-nexus-violet" />
                        Add Shape
                      </Button>
                    </div>
                  </div>

                  {/* Element Properties */}
                  {selectedElement && (
                    <div className="space-y-3 pt-4 border-t border-nexus-border">
                      <Label className="text-nexus-text-primary font-medium">Element Properties</Label>

                      {selectedElement.type === 'title' || selectedElement.type === 'content' ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Content</Label>
                            <textarea
                              value={selectedElement.content}
                              onChange={(e) => updateElement(selectedElement.index, { content: e.target.value })}
                              rows={3}
                              className="w-full mt-1 px-2 py-1 border border-nexus-border rounded text-sm resize-none"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Font Size</Label>
                            <Slider
                              value={[selectedElement.style.fontSize || 24]}
                              onValueChange={(value) => updateElement(selectedElement.index, {
                                style: { ...selectedElement.style, fontSize: value[0] }
                              })}
                              max={72}
                              min={12}
                              step={1}
                              className="w-full mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Text Color</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <div
                                className="w-8 h-8 rounded border border-nexus-border cursor-pointer"
                                style={{ backgroundColor: selectedElement.style.color || '#000000' }}
                                onClick={() => setShowColorPicker(true)}
                              />
                              <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
                                <DialogContent className="sm:max-w-[300px]">
                                  <DialogHeader>
                                    <DialogTitle>Choose Text Color</DialogTitle>
                                  </DialogHeader>
                                  <ColorPicker
                                    color={selectedElement.style.color || '#000000'}
                                    onChange={(color) => {
                                      updateElement(selectedElement.index, {
                                        style: { ...selectedElement.style, color }
                                      })
                                    }}
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      ) : selectedElement.type === 'image' ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-nexus-text-secondary">Image URL</Label>
                            <Input
                              value={selectedElement.content}
                              onChange={(e) => updateElement(selectedElement.index, { content: e.target.value })}
                              className="mt-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                            />
                          </div>
                        </div>
                      ) : null}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteElement(selectedElement.index)}
                        className="w-full border-nexus-red text-nexus-red hover:bg-nexus-red hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Element
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="design" className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-nexus-text-primary font-medium">Slide Design</Label>

                    <div>
                      <Label className="text-sm text-nexus-text-secondary">Background Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-8 h-8 rounded border border-nexus-border cursor-pointer"
                          style={{ backgroundColor: currentSlide?.background }}
                        />
                        <Input
                          value={currentSlide?.background}
                          onChange={(e) => {
                            if (presentation) {
                              const updatedSlides = [...presentation.slides]
                              updatedSlides[currentSlideIndex].background = e.target.value
                              setPresentation({
                                ...presentation,
                                slides: updatedSlides
                              })
                            }
                          }}
                          className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-nexus-text-secondary">Text Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-8 h-8 rounded border border-nexus-border cursor-pointer"
                          style={{ backgroundColor: currentSlide?.textColor }}
                        />
                        <Input
                          value={currentSlide?.textColor}
                          onChange={(e) => {
                            if (presentation) {
                              const updatedSlides = [...presentation.slides]
                              updatedSlides[currentSlideIndex].textColor = e.target.value
                              setPresentation({
                                ...presentation,
                                slides: updatedSlides
                              })
                            }
                          }}
                          className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      )}
    </div>
  )
}