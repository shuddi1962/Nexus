'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Lightbulb,
  Search,
  CheckCircle,
  XCircle,
  Globe,
  Zap,
  Star,
  Heart,
  ThumbsUp,
  Copy,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Sparkles
} from 'lucide-react'

interface NameSuggestion {
  name: string
  domain: string
  available: boolean
  score: number
  reasons: string[]
}

export default function BusinessNamePage() {
  const [keywords, setKeywords] = useState('')
  const [industry, setIndustry] = useState('')
  const [style, setStyle] = useState('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([])

  // Mock name suggestions
  const mockSuggestions: NameSuggestion[] = [
    {
      name: 'NexusFlow Solutions',
      domain: 'nexusflow.com',
      available: true,
      score: 92,
      reasons: ['Professional', 'Memorable', 'Domain available', 'Industry relevant']
    },
    {
      name: 'TechNexus Pro',
      domain: 'technexuspro.com',
      available: true,
      score: 88,
      reasons: ['Tech-focused', 'Professional', 'Strong brand potential']
    },
    {
      name: 'FlowNexus',
      domain: 'flownexus.com',
      available: false,
      score: 85,
      reasons: ['Modern', 'Easy to remember', 'Domain taken']
    },
    {
      name: 'NexusHub',
      domain: 'nexushub.io',
      available: true,
      score: 83,
      reasons: ['Short', 'Memorable', 'Tech connotation']
    },
    {
      name: 'SmartNexus',
      domain: 'smartnexus.co',
      available: true,
      score: 79,
      reasons: ['Modern', 'Descriptive', 'Available domains']
    }
  ]

  const industries = [
    'Technology', 'Marketing', 'Consulting', 'E-commerce', 'Healthcare',
    'Finance', 'Education', 'Real Estate', 'Manufacturing', 'Retail',
    'Food & Beverage', 'Entertainment', 'Travel', 'Fitness', 'Legal'
  ]

  const styles = [
    { value: 'professional', label: 'Professional', description: 'Corporate, trustworthy names' },
    { value: 'creative', label: 'Creative', description: 'Unique, memorable names' },
    { value: 'modern', label: 'Modern', description: 'Contemporary, trendy names' },
    { value: 'classic', label: 'Classic', description: 'Timeless, traditional names' },
    { value: 'fun', label: 'Fun', description: 'Playful, engaging names' },
    { value: 'tech', label: 'Tech', description: 'Technology-focused names' }
  ]

  const generateNames = async () => {
    if (!keywords.trim()) return

    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      setSuggestions(mockSuggestions)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Name Generator</h1>
          <p className="text-gray-600">AI-powered business name suggestions with domain availability checking.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Saved Names
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Ideas
          </Button>
        </div>
      </div>

      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Business Names</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="tech, smart, flow..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind.toLowerCase()}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Names</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 names</SelectItem>
                  <SelectItem value="10">10 names</SelectItem>
                  <SelectItem value="15">15 names</SelectItem>
                  <SelectItem value="20">20 names</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={generateNames}
              disabled={isGenerating || !keywords.trim()}
              className="flex-1 md:flex-none"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Names
                </>
              )}
            </Button>
            <div className="text-sm text-gray-600">
              {style && styles.find(s => s.value === style)?.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {suggestions.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Name Suggestions ({suggestions.length})</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">{suggestion.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(suggestion.name)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{suggestion.domain}</span>
                          {suggestion.available ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(suggestion.score)}`}>
                            {suggestion.score}/100
                          </div>
                          <div className="text-xs text-gray-600">{getScoreLabel(suggestion.score)}</div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {suggestion.reasons.map((reason, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Name Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestions
                    .filter(s => s.available && s.score >= 85)
                    .slice(0, 3)
                    .map((name, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium text-sm">{name.name}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{name.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Domain Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestions
                    .filter(s => s.available)
                    .slice(0, 3)
                    .map((name, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium text-sm">{name.domain}</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trending Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compound Names</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Short Names</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Descriptive</span>
                    <span className="font-medium">32%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tips & Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Business Naming Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Do's</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Keep it short and memorable</li>
                <li>• Check domain availability</li>
                <li>• Ensure it's easy to pronounce</li>
                <li>• Make it relevant to your industry</li>
                <li>• Test it with your target audience</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Don'ts</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Don't use hyphens or numbers</li>
                <li>• Avoid complicated spellings</li>
                <li>• Don't copy competitors exactly</li>
                <li>• Steer clear of negative connotations</li>
                <li>• Don't rush the decision</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'tech solutions',
              'digital marketing',
              'smart analytics',
              'cloud services',
              'ai platform',
              'business intelligence',
              'workflow automation',
              'customer success'
            ].map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setKeywords(search)}
              >
                {search}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}