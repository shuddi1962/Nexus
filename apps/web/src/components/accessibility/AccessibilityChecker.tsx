'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  Volume2,
  VolumeX,
  Contrast,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Keyboard,
  CheckCircle,
  AlertTriangle,
  Accessibility
} from 'lucide-react'

interface AccessibilityIssue {
  id: string
  element: string
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  wcagGuideline: string
  recommendation: string
  status: 'open' | 'fixed' | 'ignored'
}

export function AccessibilityChecker() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([
    {
      id: 'alt-text-1',
      element: 'img[src="/logo.png"]',
      issue: 'Missing alt text',
      severity: 'critical',
      wcagGuideline: '1.1.1 Non-text Content',
      recommendation: 'Add descriptive alt text for all images',
      status: 'open'
    },
    {
      id: 'color-contrast-1',
      element: '.text-gray-600',
      issue: 'Insufficient color contrast',
      severity: 'high',
      wcagGuideline: '1.4.3 Contrast (Minimum)',
      recommendation: 'Ensure text meets WCAG AA contrast ratios (4.5:1)',
      status: 'open'
    },
    {
      id: 'keyboard-nav-1',
      element: '.dropdown-menu',
      issue: 'Keyboard navigation not supported',
      severity: 'high',
      wcagGuideline: '2.1.1 Keyboard',
      recommendation: 'Ensure all interactive elements are keyboard accessible',
      status: 'fixed'
    },
    {
      id: 'focus-indicator-1',
      element: 'button.primary',
      issue: 'Missing focus indicators',
      severity: 'medium',
      wcagGuideline: '2.4.7 Focus Visible',
      recommendation: 'Add visible focus indicators for keyboard navigation',
      status: 'open'
    },
    {
      id: 'aria-label-1',
      element: '.icon-button',
      issue: 'Missing ARIA labels',
      severity: 'medium',
      wcagGuideline: '4.1.2 Name, Role, Value',
      recommendation: 'Add aria-label or aria-labelledby to icon buttons',
      status: 'open'
    }
  ])

  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'ignored':
        return <div className="w-4 h-4 rounded-full bg-gray-300"></div>
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const runAccessibilityAudit = () => {
    // Simulate accessibility audit
    console.log('Running accessibility audit...')
    // In a real implementation, this would use axe-core or similar
  }

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12))
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    document.documentElement.classList.toggle('high-contrast')
  }

  const toggleAccessibility = () => {
    setAccessibilityEnabled(!accessibilityEnabled)
  }

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accessibility & Compliance</h1>
          <p className="text-gray-600">WCAG 2.1 AA compliance and accessibility improvements.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={runAccessibilityAudit}>
            <Accessibility className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
          <Button onClick={toggleAccessibility}>
            <Eye className="w-4 h-4 mr-2" />
            {accessibilityEnabled ? 'Disable' : 'Enable'} Tools
          </Button>
        </div>
      </div>

      {/* Accessibility Tools */}
      {accessibilityEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={decreaseFontSize}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">Font Size: {fontSize}px</span>
                <Button variant="outline" size="sm" onClick={increaseFontSize}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" onClick={toggleHighContrast}>
                <Contrast className="w-4 h-4 mr-2" />
                {highContrast ? 'Disable' : 'Enable'} High Contrast
              </Button>

              <Button variant="outline">
                <Keyboard className="w-4 h-4 mr-2" />
                Keyboard Navigation Guide
              </Button>

              <Button variant="outline">
                <Volume2 className="w-4 h-4 mr-2" />
                Screen Reader Test
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-gray-600">WCAG Compliance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {issues.filter(i => i.status === 'open').length}
                </div>
                <div className="text-sm text-gray-600">Open Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {issues.filter(i => i.status === 'fixed').length}
                </div>
                <div className="text-sm text-gray-600">Fixed Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Accessibility className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">AA</div>
                <div className="text-sm text-gray-600">WCAG Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accessibility Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(issue.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{issue.issue}</h3>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Element:</strong> <code className="bg-gray-100 px-1 rounded">{issue.element}</code>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>WCAG Guideline:</strong> {issue.wcagGuideline}
                  </div>
                  <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Fix
                  </Button>
                  <Button variant="outline" size="sm">
                    Ignore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WCAG Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>WCAG 2.1 AA Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                principle: 'Perceivable',
                guidelines: ['Text Alternatives', 'Time-based Media', 'Adaptable', 'Distinguishable'],
                status: 'partial'
              },
              {
                principle: 'Operable',
                guidelines: ['Keyboard Accessible', 'Enough Time', 'Seizures and Physical Reactions', 'Navigable'],
                status: 'good'
              },
              {
                principle: 'Understandable',
                guidelines: ['Readable', 'Predictable', 'Input Assistance'],
                status: 'good'
              },
              {
                principle: 'Robust',
                guidelines: ['Compatible'],
                status: 'excellent'
              }
            ].map((principle, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{principle.principle}</h3>
                  <Badge className={
                    principle.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    principle.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    principle.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {principle.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {principle.guidelines.map((guideline, i) => (
                    <Badge key={i} variant="outline">
                      {guideline}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">For Developers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use semantic HTML elements</li>
                <li>• Provide alternative text for images</li>
                <li>• Ensure sufficient color contrast</li>
                <li>• Make interactive elements keyboard accessible</li>
                <li>• Test with screen readers</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">For Designers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use high contrast color combinations</li>
                <li>• Design for different screen sizes</li>
                <li>• Provide clear visual hierarchy</li>
                <li>• Use consistent navigation patterns</li>
                <li>• Include text alternatives for icons</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// High contrast mode styles
const highContrastStyles = `
  .high-contrast {
    filter: contrast(150%) brightness(90%);
  }

  .high-contrast * {
    border-color: #000 !important;
  }

  .high-contrast button,
  .high-contrast input,
  .high-contrast select,
  .high-contrast textarea {
    border: 2px solid #000 !important;
  }

  .high-contrast button:focus,
  .high-contrast input:focus,
  .high-contrast select:focus,
  .high-contrast textarea:focus {
    outline: 3px solid #0066cc !important;
    outline-offset: 2px !important;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = highContrastStyles
  document.head.appendChild(style)
}