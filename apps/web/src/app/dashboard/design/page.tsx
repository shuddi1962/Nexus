'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Palette,
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Minus,
  Undo,
  Redo,
  Download,
  Upload,
  Save,
  Copy,
  Trash2,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  Eye,
  EyeOff,
  Settings,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Zap,
  FolderOpen,
} from 'lucide-react'
import * as fabric from 'fabric'

interface DesignProject {
  id: string
  name: string
  canvas: any
  thumbnail: string
  width: number
  height: number
  created_at: string
  updated_at: string
}

export default function DesignStudioPage() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [tool, setTool] = useState<'select' | 'text' | 'rectangle' | 'circle' | 'triangle' | 'line' | 'image'>('select')
  const [color, setColor] = useState('#000000')
  const [fontSize, setFontSize] = useState([16])
  const [opacity, setOpacity] = useState([1])
  const [showGrid, setShowGrid] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showTextPanel, setShowTextPanel] = useState(false)
  const [showImagePanel, setShowImagePanel] = useState(false)
  const [showProjectList, setShowProjectList] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const canvasSizes = {
    instagram: { width: 1080, height: 1080 },
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 675 },
    linkedin: { width: 1200, height: 627 },
    pinterest: { width: 1000, height: 1500 },
    story: { width: 1080, height: 1920 },
    custom: { width: 800, height: 600 }
  }

  const [currentSize, setCurrentSize] = useState(canvasSizes.instagram)

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      initializeCanvas()
    }
  }, [canvasRef.current])

  // Load projects from API
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getDesignProjects()
      setProjects(data.data || [])
    } catch (error) {
      console.error('Failed to load projects', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveProject = async () => {
    if (!canvas) return

    try {
      setIsSaving(true)
      const canvasData = canvas.toJSON()

      if (currentProject) {
        // Update existing project
        await apiClient.updateDesignProject(currentProject.id, {
          canvas_data: canvasData,
          updated_at: new Date().toISOString(),
        })
      } else {
        // Create new project
        const name = prompt('Enter project name:', 'Untitled Design')
        if (!name) return

        const data = await apiClient.createDesignProject({
          name,
          width: currentSize.width,
          height: currentSize.height,
        })

        if (data.data) {
          setCurrentProject(data.data)
          await apiClient.updateDesignProject(data.data.id, {
            canvas_data: canvasData,
          })
        }
      }

      await loadProjects()
      alert('Project saved successfully!')
    } catch (error) {
      console.error('Failed to save project', error)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const loadProject = async (project: any) => {
    if (!canvas) return

    try {
      setCurrentProject(project)
      if (project.canvas_data) {
        canvas.loadFromJSON(project.canvas_data, () => {
          canvas.renderAll()
        })
      }
      setShowProjectList(false)
    } catch (error) {
      console.error('Failed to load project', error)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await apiClient.deleteDesignProject(projectId)
      await loadProjects()
      if (currentProject?.id === projectId) {
        setCurrentProject(null)
        canvas?.clear()
      }
    } catch (error) {
      console.error('Failed to delete project', error)
    }
  }

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: currentSize.width,
      height: currentSize.height,
      backgroundColor: '#ffffff',
    })

    // Enable object selection
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null)
    })

    setCanvas(fabricCanvas)
  }, [currentSize])

  useEffect(() => {
    if (canvas) {
      canvas.setDimensions({ width: currentSize.width, height: currentSize.height })
      canvas.renderAll()
    }
  }, [currentSize, canvas])

  const addText = () => {
    if (!canvas) return

    const text = new fabric.IText('Click to edit text', {
      left: 100,
      top: 100,
      fontSize: fontSize[0],
      fill: color,
      fontFamily: 'Arial',
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    setSelectedObject(text)
  }

  const addRectangle = () => {
    if (!canvas) return

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: color,
      opacity: opacity[0],
    })

    canvas.add(rect)
    canvas.setActiveObject(rect)
    setSelectedObject(rect)
  }

  const addCircle = () => {
    if (!canvas) return

    const circle = new fabric.Circle({
      radius: 50,
      left: 100,
      top: 100,
      fill: color,
      opacity: opacity[0],
    })

    canvas.add(circle)
    canvas.setActiveObject(circle)
    setSelectedObject(circle)
  }

  const addTriangle = () => {
    if (!canvas) return

    const triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      left: 100,
      top: 100,
      fill: color,
      opacity: opacity[0],
    })

    canvas.add(triangle)
    canvas.setActiveObject(triangle)
    setSelectedObject(triangle)
  }

  const addLine = () => {
    if (!canvas) return

    const line = new fabric.Line([50, 100, 200, 100], {
      stroke: color,
      strokeWidth: 2,
      opacity: opacity[0],
    })

    canvas.add(line)
    canvas.setActiveObject(line)
    setSelectedObject(line)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !canvas) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imgUrl = e.target?.result as string
      fabric.Image.fromURL(imgUrl, { crossOrigin: 'anonymous' } as any, (img: any) => {
        img.scaleToWidth(200)
        canvas.add(img)
        canvas.setActiveObject(img)
        setSelectedObject(img)
      })
    }
    reader.readAsDataURL(file)
  }

  const updateSelectedObject = (property: string, value: any) => {
    if (!selectedObject || !canvas) return

    selectedObject.set(property, value)
    canvas.renderAll()
  }

  const deleteSelectedObject = () => {
    if (!selectedObject || !canvas) return

    canvas.remove(selectedObject)
    setSelectedObject(null)
  }

  const duplicateSelectedObject = () => {
    if (!selectedObject || !canvas) return

    ;(selectedObject as any).clone((cloned: fabric.Object) => {
      cloned.set({
        left: (selectedObject.left || 0) + 10,
        top: (selectedObject.top || 0) + 10,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      setSelectedObject(cloned)
    })
  }

  const bringToFront = () => {
    if (!selectedObject || !canvas) return
    canvas.bringObjectToFront(selectedObject)
  }

  const sendToBack = () => {
    if (!selectedObject || !canvas) return
    canvas.sendObjectToBack(selectedObject)
  }

  const alignLeft = () => {
    if (!selectedObject || !canvas) return
    selectedObject.set('left', 0)
    canvas.renderAll()
  }

  const alignCenter = () => {
    if (!selectedObject || !canvas) return
    const canvasWidth = canvas.getWidth()
    const objectWidth = selectedObject.getScaledWidth()
    selectedObject.set('left', (canvasWidth - objectWidth) / 2)
    canvas.renderAll()
  }

  const alignRight = () => {
    if (!selectedObject || !canvas) return
    const canvasWidth = canvas.getWidth()
    const objectWidth = selectedObject.getScaledWidth()
    selectedObject.set('left', canvasWidth - objectWidth)
    canvas.renderAll()
  }

  const zoomIn = () => {
    if (!canvas) return
    const newZoom = Math.min(zoom * 1.2, 3)
    setZoom(newZoom)
    canvas.setZoom(newZoom)
  }

  const zoomOut = () => {
    if (!canvas) return
    const newZoom = Math.max(zoom / 1.2, 0.1)
    setZoom(newZoom)
    canvas.setZoom(newZoom)
  }

  const fitToScreen = () => {
    if (!canvas) return
    canvas.setZoom(1)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    setZoom(1)
  }

  const exportCanvas = (format: 'png' | 'jpg' | 'svg' | 'pdf') => {
    if (!canvas) return

    switch (format) {
      case 'png':
        const pngData = canvas.toDataURL({ format: 'png', multiplier: 1 } as any)
        downloadImage(pngData, 'design.png')
        break
      case 'jpg':
        const jpgData = canvas.toDataURL({ format: 'jpeg', quality: 0.8, multiplier: 1 } as any)
        downloadImage(jpgData, 'design.jpg')
        break
      case 'svg':
        // SVG export would require additional implementation
        alert('SVG export coming soon!')
        break
      case 'pdf':
        // PDF export would require additional implementation
        alert('PDF export coming soon!')
        break
    }
  }

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const undo = () => {
    if (!canvas) return
    // Fabric.js doesn't have built-in undo/redo, would need to implement
    alert('Undo functionality coming soon!')
  }

  const redo = () => {
    if (!canvas) return
    // Fabric.js doesn't have built-in undo/redo, would need to implement
    alert('Redo functionality coming soon!')
  }

  return (
    <div className="h-screen flex flex-col bg-nexus-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nexus-border bg-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-nexus-text-primary">Design Studio</h1>
          <Select value={`${currentSize.width}x${currentSize.height}`} onValueChange={(value) => {
            const [width, height] = value.split('x').map(Number)
            setCurrentSize({ width, height })
          }}>
            <SelectTrigger className="w-40 border-nexus-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={`${canvasSizes.instagram.width}x${canvasSizes.instagram.height}`}>Instagram Post</SelectItem>
              <SelectItem value={`${canvasSizes.facebook.width}x${canvasSizes.facebook.height}`}>Facebook Post</SelectItem>
              <SelectItem value={`${canvasSizes.twitter.width}x${canvasSizes.twitter.height}`}>Twitter Post</SelectItem>
              <SelectItem value={`${canvasSizes.linkedin.width}x${canvasSizes.linkedin.height}`}>LinkedIn Post</SelectItem>
              <SelectItem value={`${canvasSizes.pinterest.width}x${canvasSizes.pinterest.height}`}>Pinterest Pin</SelectItem>
              <SelectItem value={`${canvasSizes.story.width}x${canvasSizes.story.height}`}>Story</SelectItem>
              <SelectItem value={`${canvasSizes.custom.width}x${canvasSizes.custom.height}`}>Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={undo} className="border-nexus-border">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} className="border-nexus-border">
            <Redo className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" onClick={zoomOut} className="border-nexus-border">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-nexus-text-secondary min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn} className="border-nexus-border">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={fitToScreen} className="border-nexus-border">
            <Maximize className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" onClick={() => setShowProjectList(true)} className="border-nexus-border">
            <FolderOpen className="w-4 h-4 mr-2" />
            Projects
          </Button>
          <Button variant="outline" size="sm" onClick={saveProject} disabled={isSaving} className="border-nexus-border">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Select onValueChange={(value: 'png' | 'jpg' | 'svg' | 'pdf') => exportCanvas(value)}>
            <SelectTrigger className="w-32 border-nexus-border">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">Export PNG</SelectItem>
              <SelectItem value="jpg">Export JPG</SelectItem>
              <SelectItem value="svg">Export SVG</SelectItem>
              <SelectItem value="pdf">Export PDF</SelectItem>
            </SelectContent>
          </Select>
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
            variant={tool === 'text' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => { setTool('text'); addText() }}
            className="w-12 h-12 p-0"
          >
            <Type className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'rectangle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => { setTool('rectangle'); addRectangle() }}
            className="w-12 h-12 p-0"
          >
            <Square className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'circle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => { setTool('circle'); addCircle() }}
            className="w-12 h-12 p-0"
          >
            <Circle className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'triangle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => { setTool('triangle'); addTriangle() }}
            className="w-12 h-12 p-0"
          >
            <Triangle className="w-5 h-5" />
          </Button>
          <Button
            variant={tool === 'line' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => { setTool('line'); addLine() }}
            className="w-12 h-12 p-0"
          >
            <Minus className="w-5 h-5" />
          </Button>
          <label className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-nexus-bg-secondary rounded">
            <Image className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-nexus-bg-secondary">
          <div className="flex-1 flex items-center justify-center p-8">
            <div
              className="relative border-2 border-dashed border-nexus-border bg-white shadow-lg"
              style={{
                width: currentSize.width * zoom,
                height: currentSize.height * zoom,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              <canvas
                ref={canvasRef}
                className="block"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-white border-l border-nexus-border flex flex-col">
          <div className="p-4 border-b border-nexus-border">
            <h3 className="font-medium text-nexus-text-primary">Properties</h3>
          </div>

          {selectedObject ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Object Actions */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Actions</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={duplicateSelectedObject} className="border-nexus-border">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" onClick={deleteSelectedObject} className="border-nexus-border text-nexus-red hover:text-nexus-red">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Layer Controls */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Layer</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={bringToFront} className="border-nexus-border flex-1">
                    Front
                  </Button>
                  <Button variant="outline" size="sm" onClick={sendToBack} className="border-nexus-border flex-1">
                    Back
                  </Button>
                </div>
              </div>

              {/* Alignment */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Align</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={alignLeft} className="border-nexus-border">
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={alignCenter} className="border-nexus-border">
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={alignRight} className="border-nexus-border">
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Fill Color */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Fill Color</Label>
                <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-nexus-border justify-start">
                      <div
                        className="w-6 h-6 rounded border border-nexus-border mr-3"
                        style={{ backgroundColor: color }}
                      />
                      {color.toUpperCase()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[300px]">
                    <DialogHeader>
                      <DialogTitle>Choose Color</DialogTitle>
                    </DialogHeader>
                    <ColorPicker
                      color={color}
                      onChange={(newColor) => {
                        setColor(newColor)
                        updateSelectedObject('fill', newColor)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <Label className="text-nexus-text-primary font-medium">Opacity</Label>
                <Slider
                  value={opacity}
                  onValueChange={(value) => {
                    setOpacity(value)
                    updateSelectedObject('opacity', value[0])
                  }}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-nexus-text-secondary text-center">
                  {Math.round(opacity[0] * 100)}%
                </div>
              </div>

              {/* Font Size (for text objects) */}
              {selectedObject && selectedObject.type === 'i-text' && (
                <div className="space-y-2">
                  <Label className="text-nexus-text-primary font-medium">Font Size</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={(value) => {
                      setFontSize(value)
                      updateSelectedObject('fontSize', value[0])
                    }}
                    max={72}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-nexus-text-secondary text-center">
                    {fontSize[0]}px
                  </div>
                </div>
              )}

              {/* Text Formatting (for text objects) */}
              {selectedObject && selectedObject.type === 'i-text' && (
                <div className="space-y-2">
                  <Label className="text-nexus-text-primary font-medium">Text Style</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSelectedObject('fontWeight', (selectedObject as any).fontWeight === 'bold' ? 'normal' : 'bold')}
                      className={`border-nexus-border ${(selectedObject as any).fontWeight === 'bold' ? 'bg-nexus-blue text-white' : ''}`}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSelectedObject('fontStyle', (selectedObject as any).fontStyle === 'italic' ? 'normal' : 'italic')}
                      className={`border-nexus-border ${(selectedObject as any).fontStyle === 'italic' ? 'bg-nexus-blue text-white' : ''}`}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSelectedObject('underline', !(selectedObject as any).underline)}
                      className={`border-nexus-border ${(selectedObject as any).underline ? 'bg-nexus-blue text-white' : ''}`}
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Object Info */}
              <div className="space-y-2 pt-4 border-t border-nexus-border">
                <Label className="text-nexus-text-primary font-medium">Object Info</Label>
                <div className="text-sm text-nexus-text-secondary space-y-1">
                  <div>Type: {selectedObject.type}</div>
                  <div>Position: {Math.round(selectedObject.left || 0)}, {Math.round(selectedObject.top || 0)}</div>
                  <div>Size: {Math.round(selectedObject.getScaledWidth())}, {Math.round(selectedObject.getScaledHeight())}</div>
                  {selectedObject.angle && <div>Rotation: {Math.round(selectedObject.angle)}°</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-nexus-text-secondary">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an object to edit its properties</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project List Modal */}
      {showProjectList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-nexus-text-primary">Your Projects</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowProjectList(false)}>
                ✕
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-nexus-text-secondary">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-nexus-text-secondary">
                No projects yet. Create one by designing and clicking Save.
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border border-nexus-border rounded-lg hover:bg-nexus-bg-secondary cursor-pointer"
                    onClick={() => loadProject(project)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-nexus-text-primary">{project.name}</h3>
                      <p className="text-sm text-nexus-text-secondary">
                        {project.width}x{project.height} • {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProject(project.id)
                      }}
                      className="text-nexus-red hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}