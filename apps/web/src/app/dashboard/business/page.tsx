'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus, Search, Package, Image, Edit2, Trash2,
  Star, Tag, DollarSign, FileText, ToggleLeft, ToggleRight,
  ChevronRight, Check, X, Loader2,
  Building2, TrendingUp, Save, Palette, Users, Target, Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface Business {
  id?: string
  name: string
  tagline?: string
  description?: string
  industry?: string
  sub_industry?: string[]
  business_type?: 'product' | 'service' | 'hybrid'
  country?: string
  state?: string
  city?: string
  address?: string
  phone?: string[]
  email?: string
  website?: string
  logo?: string
  brand_colors?: string[]
  brand_voice?: string
  brand_guidelines?: string
  target_audience?: string
  pain_points?: string[]
  unique_value?: string
  competitor_keywords?: string[]
  created_at?: string
  updated_at?: string
}

interface Industry {
  value: string
  label: string
  subIndustries: string[]
}

const INDUSTRIES: Industry[] = [
  { value: 'technology', label: 'Technology & Software', subIndustries: ['SaaS', 'Enterprise Software', 'Mobile Apps', 'AI/ML', 'Cybersecurity'] },
  { value: 'ecommerce', label: 'E-commerce & Retail', subIndustries: [' fashion', 'Electronics', 'Home & Garden', 'Health & Beauty', 'Sports'] },
  { value: 'healthcare', label: 'Healthcare & Wellness', subIndustries: ['Medical Devices', 'Pharmaceuticals', 'Fitness', 'Mental Health', 'Nutrition'] },
  { value: 'finance', label: 'Finance & Banking', subIndustries: ['Banking', 'Insurance', 'Investment', 'Cryptocurrency', 'FinTech'] },
  { value: 'education', label: 'Education', subIndustries: ['K-12', 'Higher Ed', 'Online Learning', 'EdTech', 'Training'] },
  { value: 'realestate', label: 'Real Estate', subIndustries: ['Residential', 'Commercial', 'Property Management', 'REITs', 'Construction'] },
  { value: 'food', label: 'Food & Beverage', subIndustries: ['Restaurants', 'Food Manufacturing', 'Beverages', 'Food Delivery', 'Catering'] },
  { value: 'media', label: 'Media & Entertainment', subIndustries: ['Publishing', 'Gaming', 'Streaming', 'Music', 'Film'] },
  { value: 'marketing', label: 'Marketing & Advertising', subIndustries: ['Digital Marketing', 'Advertising Agencies', 'PR', 'Content Marketing', 'SEO'] },
  { value: 'consulting', label: 'Consulting & Services', subIndustries: ['Management Consulting', 'IT Consulting', 'HR Consulting', 'Legal', 'Accounting'] },
  { value: 'manufacturing', label: 'Manufacturing', subIndustries: ['Automotive', 'Aerospace', 'Electronics', 'Textiles', 'Machinery'] },
  { value: 'other', label: 'Other', subIndustries: [] }
]

const BRAND_VOICES = [
  { value: 'professional', label: 'Professional', description: 'Formal, expert, authoritative' },
  { value: 'casual', label: 'Casual', description: 'Relaxed, friendly, approachable' },
  { value: 'technical', label: 'Technical', description: 'Detailed, data-driven, precise' },
  { value: 'friendly', label: 'Friendly', description: 'Warm, conversational, supportive' },
  { value: 'bold', label: 'Bold', description: 'Confident, innovative, daring' },
  { value: 'luxury', label: 'Luxury', description: 'Premium, exclusive, sophisticated' }
]

export default function BusinessPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('identity')
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getBusinesses()
      setBusinesses(data || [])
      if (data && data.length > 0) {
        setBusiness(data[0])
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!business) return
    try {
      setSaving(true)
      if (business.id) {
        await apiClient.updateBusiness(business.id, business)
      } else {
        const newBusiness = await apiClient.createBusiness(business)
        setBusiness(newBusiness)
      }
      await fetchBusinesses()
    } catch (error) {
      console.error('Error saving business:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAnalyze = async () => {
    if (!business?.id) return
    try {
      setAnalyzing(true)
      await apiClient.analyzeBusiness(business.id)
      await fetchBusinesses()
    } catch (error) {
      console.error('Error analyzing business:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const updateField = <K extends keyof Business>(field: K, value: Business[K]) => {
    setBusiness(prev => prev ? { ...prev, [field]: value } : null)
  }

  const addPhone = () => {
    setBusiness(prev => prev ? { ...prev, phone: [...(prev.phone || []), ''] } : null)
  }

  const updatePhone = (index: number, value: string) => {
    if (!business) return
    const phones = [...(business.phone || [])]
    phones[index] = value
    setBusiness({ ...business, phone: phones })
  }

  const removePhone = (index: number) => {
    if (!business) return
    const phones = (business.phone || []).filter((_, i) => i !== index)
    setBusiness({ ...business, phone: phones })
  }

  const addColor = () => {
    setBusiness(prev => prev ? { ...prev, brand_colors: [...(prev.brand_colors || []), '#000000'] } : null)
  }

  const updateColor = (index: number, value: string) => {
    if (!business) return
    const colors = [...(business.brand_colors || [])]
    colors[index] = value
    setBusiness({ ...business, brand_colors: colors })
  }

  const removeColor = (index: number) => {
    if (!business) return
    const colors = (business.brand_colors || []).filter((_, i) => i !== index)
    setBusiness({ ...business, brand_colors: colors })
  }

  const addPainPoint = () => {
    setBusiness(prev => prev ? { ...prev, pain_points: [...(prev.pain_points || []), ''] } : null)
  }

  const updatePainPoint = (index: number, value: string) => {
    if (!business) return
    const points = [...(business.pain_points || [])]
    points[index] = value
    setBusiness({ ...business, pain_points: points })
  }

  const removePainPoint = (index: number) => {
    if (!business) return
    const points = (business.pain_points || []).filter((_, i) => i !== index)
    setBusiness({ ...business, pain_points: points })
  }

  const addKeyword = () => {
    setBusiness(prev => prev ? { ...prev, competitor_keywords: [...(prev.competitor_keywords || []), ''] } : null)
  }

  const updateKeyword = (index: number, value: string) => {
    if (!business) return
    const keywords = [...(business.competitor_keywords || [])]
    keywords[index] = value
    setBusiness({ ...business, competitor_keywords: keywords })
  }

  const removeKeyword = (index: number) => {
    if (!business) return
    const keywords = (business.competitor_keywords || []).filter((_, i) => i !== index)
    setBusiness({ ...business, competitor_keywords: keywords })
  }

  const startNewBusiness = () => {
    setBusiness({
      name: '',
      tagline: '',
      description: '',
      industry: '',
      sub_industry: [],
      business_type: 'service',
      country: '',
      state: '',
      city: '',
      address: '',
      phone: [''],
      email: '',
      website: '',
      logo: '',
      brand_colors: ['#1A1A2E'],
      brand_voice: 'professional',
      brand_guidelines: '',
      target_audience: '',
      pain_points: [],
      unique_value: '',
      competitor_keywords: []
    })
    setShowWizard(true)
    setWizardStep(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-nexus-blue" />
      </div>
    )
  }

  if (!business && !showWizard) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card>
          <CardContent className="pt-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-nexus-text-tertiary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Business Profile Yet</h2>
            <p className="text-nexus-text-secondary mb-8">
              Create your first business profile to get AI-powered insights and start generating content tailored to your brand.
            </p>
            <Button onClick={startNewBusiness} className="bg-nexus-blue hover:bg-nexus-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Business Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderWizardStep = () => {
    if (!showWizard) return null
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Business Setup Wizard</CardTitle>
              <CardDescription>Step {wizardStep} of 8</CardDescription>
            </div>
            <Badge className="bg-nexus-blue">{wizardStep}/8</Badge>
          </div>
          <div className="flex gap-1 mt-4">
            {[1,2,3,4,5,6,7,8].map(step => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${step <= wizardStep ? 'bg-nexus-blue' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {wizardStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: Business Identity</h3>
              <div className="space-y-2">
                <Label>Business Name *</Label>
                <Input value={business?.name || ''} onChange={e => updateField('name', e.target.value)} placeholder="Your business name" />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={business?.tagline || ''} onChange={e => updateField('tagline', e.target.value)} placeholder="Your catchy tagline" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={business?.description || ''} onChange={e => updateField('description', e.target.value)} placeholder="What does your business do?" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <select value={business?.industry || ''} onChange={e => updateField('industry', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <select value={business?.business_type || 'service'} onChange={e => updateField('business_type', e.target.value as any)} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
                    <option value="service">Service</option>
                    <option value="product">Product</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Products & Services</h3>
              <p className="text-sm text-nexus-text-secondary">Add your products and services with images</p>
              <Button onClick={() => window.location.href = '/dashboard/products/catalog'} variant="outline" className="w-full">
                <Package className="w-4 h-4 mr-2" />
                Manage Products & Services
              </Button>
            </div>
          )}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Brand & Tone</h3>
              <div className="space-y-2">
                <Label>Brand Colors</Label>
                <div className="flex gap-2">
                  {(business?.brand_colors || ['#1A1A2E']).map((color, index) => (
                    <input key={index} type="color" value={color} onChange={e => updateColor(index, e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                  ))}
                  <Button variant="ghost" size="icon" onClick={addColor}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Brand Voice</Label>
                <div className="grid grid-cols-2 gap-3">
                  {BRAND_VOICES.map(voice => (
                    <div key={voice.value} className={`p-4 border rounded-lg cursor-pointer ${business?.brand_voice === voice.value ? 'border-nexus-blue bg-nexus-blue-light' : ''}`} onClick={() => updateField('brand_voice', voice.value)}>
                      <div className="font-medium">{voice.label}</div>
                      <div className="text-sm text-nexus-text-secondary">{voice.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {wizardStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 4: Target Audience</h3>
              <div className="space-y-2">
                <Label>Target Audience Description</Label>
                <Textarea value={business?.target_audience || ''} onChange={e => updateField('target_audience', e.target.value)} placeholder="Describe your ideal customer..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Pain Points</Label>
                {(business?.pain_points || []).map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={point} onChange={e => updatePainPoint(index, e.target.value)} placeholder="e.g., High costs..." />
                    <Button variant="ghost" size="icon" onClick={() => removePainPoint(index)}><X className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addPainPoint}><Plus className="w-4 h-4 mr-2" />Add Pain Point</Button>
              </div>
            </div>
          )}
          {wizardStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 5: Social Accounts</h3>
              <p className="text-sm text-nexus-text-secondary mb-4">Connect your social media accounts for auto-posting</p>
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Pinterest', 'TikTok'].map(platform => (
                <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{platform}</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              ))}
            </div>
          )}
          {wizardStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 6: WordPress Sites</h3>
              <p className="text-sm text-nexus-text-secondary mb-4">Add WordPress sites and set publish mode</p>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add WordPress Site
              </Button>
            </div>
          )}
          {wizardStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 7: Auto-Post Rules</h3>
              <p className="text-sm text-nexus-text-secondary mb-4">Configure automatic posting rules</p>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Auto-post new articles to social media</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Draft mode (review before publishing)</span>
                </label>
              </div>
            </div>
          )}
          {wizardStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 8: Review & Launch</h3>
              <div className="p-4 bg-nexus-blue-light rounded-lg space-y-2">
                <div><strong>Business:</strong> {business?.name || 'Not set'}</div>
                <div><strong>Industry:</strong> {business?.industry || 'Not set'}</div>
                <div><strong>Brand Voice:</strong> {business?.brand_voice || 'Not set'}</div>
              </div>
              <Button onClick={handleSave} className="w-full bg-nexus-blue hover:bg-nexus-blue/90">
                <Check className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            </div>
          )}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setShowWizard(false)}>
              {wizardStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            {wizardStep < 8 ? (
              <Button onClick={() => setWizardStep(wizardStep + 1)} className="bg-nexus-blue hover:bg-nexus-blue/90">
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showWizard) {
    return renderWizardStep()
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Business Profile</h1>
          <p className="text-nexus-text-secondary mt-1">
            Manage your business identity and get AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={analyzing || !business?.id}
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Analyze Business
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-nexus-blue hover:bg-nexus-blue/90">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Identity
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Strategy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Identity</CardTitle>
              <CardDescription>Basic information about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={business?.name || ''}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Your business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={business?.tagline || ''}
                    onChange={e => updateField('tagline', e.target.value)}
                    placeholder="Your catchy tagline"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={business?.description || ''}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="What does your business do?"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={business?.industry || ''}
                    onChange={e => updateField('industry', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <select
                    id="businessType"
                    value={business?.business_type || 'service'}
                    onChange={e => updateField('business_type', e.target.value as 'product' | 'service' | 'hybrid')}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                  >
                    <option value="service">Service</option>
                    <option value="product">Product</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={business?.country || ''}
                    onChange={e => updateField('country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={business?.state || ''}
                    onChange={e => updateField('state', e.target.value)}
                    placeholder="CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={business?.city || ''}
                    onChange={e => updateField('city', e.target.value)}
                    placeholder="San Francisco"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={business?.address || ''}
                  onChange={e => updateField('address', e.target.value)}
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Numbers</Label>
                {(business?.phone || ['']).map((phone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={phone}
                      onChange={e => updatePhone(index, e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                    {(business?.phone || []).length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removePhone(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addPhone}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Phone
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={business?.email || ''}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="contact@business.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={business?.website || ''}
                    onChange={e => updateField('website', e.target.value)}
                    placeholder="https://business.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>Define your visual brand identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Business Logo</Label>
                <div className="flex items-center gap-4">
                  {business?.logo ? (
                    <img src={business.logo} alt="Logo" className="w-24 h-24 object-contain border rounded-lg" />
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-nexus-text-tertiary" />
                    </div>
                  )}
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Brand Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {(business?.brand_colors || ['#1A1A2E']).map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={e => updateColor(index, e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                      />
                      <Input
                        value={color}
                        onChange={e => updateColor(index, e.target.value)}
                        className="w-28 font-mono"
                        placeholder="#000000"
                      />
                      {(business?.brand_colors || []).length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeColor(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={addColor}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Brand Voice</Label>
                <div className="grid grid-cols-2 gap-3">
                  {BRAND_VOICES.map(voice => (
                    <div
                      key={voice.value}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors",
                        business?.brand_voice === voice.value
                          ? "border-nexus-blue bg-nexus-blue-light"
                          : "hover:border-nexus-border-strong"
                      )}
                      onClick={() => updateField('brand_voice', voice.value)}
                    >
                      <div className="font-medium">{voice.label}</div>
                      <div className="text-sm text-nexus-text-secondary">{voice.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guidelines">Brand Guidelines</Label>
                <Textarea
                  id="guidelines"
                  value={business?.brand_guidelines || ''}
                  onChange={e => updateField('brand_guidelines', e.target.value)}
                  placeholder="Describe your brand voice, tone, and visual guidelines..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Define who you're targeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience Description</Label>
                <Textarea
                  id="audience"
                  value={business?.target_audience || ''}
                  onChange={e => updateField('target_audience', e.target.value)}
                  placeholder="Describe your ideal customer: demographics, interests, behavior..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Pain Points</Label>
                <p className="text-sm text-nexus-text-secondary mb-2">
                  What problems does your audience face that your business solves?
                </p>
                {(business?.pain_points || []).map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={point}
                      onChange={e => updatePainPoint(index, e.target.value)}
                      placeholder="e.g., High costs, slow processes..."
                    />
                    {(business?.pain_points || []).length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removePainPoint(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addPainPoint}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pain Point
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uniqueValue">Unique Value Proposition</Label>
                <Textarea
                  id="uniqueValue"
                  value={business?.unique_value || ''}
                  onChange={e => updateField('unique_value', e.target.value)}
                  placeholder="What makes your business unique? Why should customers choose you?"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Strategy</CardTitle>
              <CardDescription>Monitor your competitive landscape</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Competitor Keywords</Label>
                <p className="text-sm text-nexus-text-secondary mb-2">
                  Keywords to monitor for competitive analysis
                </p>
                {(business?.competitor_keywords || []).map((keyword, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={keyword}
                      onChange={e => updateKeyword(index, e.target.value)}
                      placeholder="e.g., industry trends, competitor names..."
                    />
                    {(business?.competitor_keywords || []).length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeKeyword(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addKeyword}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Keyword
                </Button>
              </div>

              <div className="p-4 bg-nexus-blue-light rounded-lg border border-nexus-blue/20">
                <h4 className="font-semibold text-nexus-blue mb-2">AI Analysis</h4>
                <p className="text-sm text-nexus-text-secondary">
                  Click "Analyze Business" to get AI-powered insights about your industry, competitors, and optimal content strategies.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}