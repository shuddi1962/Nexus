'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Download,
  Upload,
  Undo,
  Redo,
  Square,
  Circle,
  Type,
  Image,
  Move,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Palette,
  Settings
} from 'lucide-react'

interface CanvasElement {
  id: string
  type: 'rectangle' | 'circle' | 'text' | 'image'
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  text?: string
  fontSize?: number
  src?: string
}

export default function DesignStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedTool, setSelectedTool] = useState<'select' | 'rectangle' | 'circle' | 'text' | 'image'>('select')
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [fillColor, setFillColor] = useState('#3B82F6')
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(16)
  const [zoom, setZoom] = useState(1)

  const canvasWidth = 800
  const canvasHeight = 600

  const addElement = useCallback((type: CanvasElement['type'], x: number, y: number) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type,
      x,
      y,
      width: type === 'circle' ? 100 : 200,
      height: type === 'circle' ? 100 : 100,
      fill: fillColor,
      stroke: strokeColor,
      text: type === 'text' ? 'New Text' : undefined,
      fontSize: type === 'text' ? fontSize : undefined,
    }

    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement.id)
  }, [fillColor, strokeColor, fontSize])

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el))
  }, [])

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    setSelectedElement(null)
  }, [])

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id)
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        x: element.x + 20,
        y: element.y + 20,
      }
      setElements(prev => [...prev, newElement])
      setSelectedElement(newElement.id)
    }
  }, [elements])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw grid
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let x = 0; x <= canvasWidth; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    }
    for (let y = 0; y <= canvasHeight; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }

    // Draw elements
    elements.forEach(element => {
      ctx.save()

      if (element.type === 'rectangle') {
        ctx.fillStyle = element.fill
        ctx.strokeStyle = element.stroke
        ctx.lineWidth = 2
        ctx.fillRect(element.x, element.y, element.width, element.height)
        ctx.strokeRect(element.x, element.y, element.width, element.height)
      } else if (element.type === 'circle') {
        ctx.fillStyle = element.fill
        ctx.strokeStyle = element.stroke
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(element.x + element.width/2, element.y + element.height/2, element.width/2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
      } else if (element.type === 'text' && element.text) {
        ctx.fillStyle = element.fill
        ctx.font = `${element.fontSize || 16}px Arial`
        ctx.fillText(element.text, element.x, element.y + (element.fontSize || 16))
      }

      // Draw selection outline
      if (selectedElement === element.id) {
        ctx.strokeStyle = '#3B82F6'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        if (element.type === 'circle') {
          ctx.beginPath()
          ctx.arc(element.x + element.width/2, element.y + element.height/2, element.width/2 + 5, 0, 2 * Math.PI)
          ctx.stroke()
        } else {
          ctx.strokeRect(element.x - 5, element.y - 5, element.width + 10, element.height + 10)
        }
        ctx.setLineDash([])
      }

      ctx.restore()
    })
  }, [elements, selectedElement])

  // Redraw when elements change
  React.useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    // Check if clicking on existing element
    const clickedElement = elements.find(el => {
      return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
    })

    if (clickedElement) {
      setSelectedElement(clickedElement.id)
    } else {
      setSelectedElement(null)
      if (selectedTool !== 'select') {
        addElement(selectedTool, x, y)
      }
    }
  }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'design.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const selectedElementData = elements.find(el => el.id === selectedElement)

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Toolbar */}
      <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
        <Button
          variant={selectedTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedTool('select')}
          className="w-10 h-10 p-0"
        >
          <Move className="w-4 h-4" />
        </Button>

        <Button
          variant={selectedTool === 'rectangle' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedTool('rectangle')}
          className="w-10 h-10 p-0"
        >
          <Square className="w-4 h-4" />
        </Button>

        <Button
          variant={selectedTool === 'circle' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedTool('circle')}
          className="w-10 h-10 p-0"
        >
          <Circle className="w-4 h-4" />
        </Button>

        <Button
          variant={selectedTool === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedTool('text')}
          className="w-10 h-10 p-0"
        >
          <Type className="w-4 h-4" />
        </Button>

        <Button
          variant={selectedTool === 'image' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedTool('image')}
          className="w-10 h-10 p-0"
        >
          <Image className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" onClick={() => setZoom(Math.min(3, zoom + 0.25))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button variant="outline">
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Button onClick={exportCanvas}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onClick={handleCanvasClick}
              className="border border-gray-300 bg-white cursor-crosshair"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Properties</h3>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {selectedElementData ? (
            <>
              {/* Fill Color */}
              <div className="space-y-2">
                <Label htmlFor="fillColor">Fill Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="fillColor"
                    type="color"
                    value={selectedElementData.fill}
                    onChange={(e) => updateElement(selectedElementData.id, { fill: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <Input
                    value={selectedElementData.fill}
                    onChange={(e) => updateElement(selectedElementData.id, { fill: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Stroke Color */}
              <div className="space-y-2">
                <Label htmlFor="strokeColor">Stroke Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="strokeColor"
                    type="color"
                    value={selectedElementData.stroke}
                    onChange={(e) => updateElement(selectedElementData.id, { stroke: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <Input
                    value={selectedElementData.stroke}
                    onChange={(e) => updateElement(selectedElementData.id, { stroke: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={selectedElementData.width}
                    onChange={(e) => updateElement(selectedElementData.id, { width: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={selectedElementData.height}
                    onChange={(e) => updateElement(selectedElementData.id, { height: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="x">X Position</Label>
                  <Input
                    id="x"
                    type="number"
                    value={selectedElementData.x}
                    onChange={(e) => updateElement(selectedElementData.id, { x: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="y">Y Position</Label>
                  <Input
                    id="y"
                    type="number"
                    value={selectedElementData.y}
                    onChange={(e) => updateElement(selectedElementData.id, { y: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Text Properties */}
              {selectedElementData.type === 'text' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="text">Text Content</Label>
                    <Input
                      id="text"
                      value={selectedElementData.text || ''}
                      onChange={(e) => updateElement(selectedElementData.id, { text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Input
                      id="fontSize"
                      type="number"
                      value={selectedElementData.fontSize || 16}
                      onChange={(e) => updateElement(selectedElementData.id, { fontSize: parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => duplicateElement(selectedElementData.id)}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteElement(selectedElementData.id)}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select an element to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}