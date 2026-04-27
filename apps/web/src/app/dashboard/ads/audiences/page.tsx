'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Users,
  Target,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Smartphone,
  Monitor,
  Edit,
  Copy,
  Trash2,
  Eye,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react'

interface AdAccount {
  id: string
  platform: string
  account_id: string
  account_name: string
  status: string
  currency: string
  connected_at: string
  synced_at?: string
}

interface Audience {
  id: string
  name: string
  description?: string
  platform: string
  type: 'lookalike' | 'interest' | 'custom' | 'retargeting' | 'saved'
  size?: number
  targeting?: {
    demographics?: { age_min?: number; age_max?: number; gender?: string[] }
    locations?: string[]
    interests?: string[]
    behaviors?: string[]
    devices?: string[]
    languages?: string[]
  }
  performance?: {
    reach?: number
    frequency?: number
    cpm?: number
    ctr?: number
  }
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export default function AudiencesPage() {
  const { user } = useAuth()
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')

  useEffect(() => {
    fetchAdAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchAudiences()
    }
  }, [selectedAccount, selectedType])

  const fetchAdAccounts = async () => {
    try {
      const data = await apiClient.getAdAccounts()
      setAdAccounts(data)
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
    }
  }

  const fetchAudiences = async () => {
    if (!selectedAccount) return

    try {
      setLoading(true)
      // Mock data for now - would integrate with actual API
      setAudiences([
        {
          id: '1',
          name: 'Tech Professionals 25-45',
          description: 'Software engineers, product managers, and tech leaders',
          platform: 'Meta',
          type: 'saved',
          size: 2500000,
          targeting: {
            demographics: {
              age_min: 25,
              age_max: 45,
              gender: ['male', 'female']
            },
            locations: ['United States', 'Canada', 'United Kingdom'],
            interests: ['Software Development', 'Technology', 'Startups', 'Programming'],
            behaviors: ['Technology early adopters', 'Business professionals'],
            devices: ['mobile', 'desktop'],
            languages: ['en']
          },
          performance: {
            reach: 2500000,
            frequency: 1.2,
            cpm: 8.50,
            ctr: 1.8
          },
          status: 'active',
          created_at: '2026-04-01T10:00:00Z',
          updated_at: '2026-04-15T14:30:00Z'
        },
        {
          id: '2',
          name: 'Lookalike - High Value Customers',
          description: 'Similar to our top 10% of customers by LTV',
          platform: 'Meta',
          type: 'lookalike',
          size: 1800000,
          targeting: {
            demographics: {},
            locations: ['United States'],
            interests: [],
            behaviors: ['High intent purchasers', 'Luxury shoppers'],
            devices: ['mobile', 'desktop'],
            languages: ['en']
          },
          performance: {
            reach: 1800000,
            frequency: 1.1,
            cpm: 12.75,
            ctr: 2.1
          },
          status: 'active',
          created_at: '2026-04-05T09:15:00Z',
          updated_at: '2026-04-16T11:20:00Z'
        },
        {
          id: '3',
          name: 'Small Business Owners',
          description: 'Owners of companies with 1-50 employees',
          platform: 'Google',
          type: 'custom',
          size: 3200000,
          targeting: {
            demographics: {
              age_min: 30,
              age_max: 65
            },
            locations: ['United States'],
            interests: ['Business', 'Entrepreneurship', 'Small Business'],
            behaviors: ['Small business owners', 'Business decision makers'],
            devices: ['mobile', 'desktop'],
            languages: ['en']
          },
          performance: {
            reach: 3200000,
            frequency: 1.3,
            cpm: 6.25,
            ctr: 1.5
          },
          status: 'active',
          created_at: '2026-03-20T16:45:00Z',
          updated_at: '2026-04-14T08:30:00Z'
        }
      ])
    } catch (error) {
      console.error('Error fetching audiences:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAudiences()
  }

  const handleCreateAudience = async (audienceData: Omit<Audience, 'id' | 'created_at' | 'updated_at' | 'size'>) => {
    try {
      // Would integrate with actual API

      fetchAudiences()
      setShowCreateDialog(false)
    } catch (error) {
      console.error('Error creating audience:', error)
    }
  }

  const filteredAudiences = audiences.filter(audience =>
    audience.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedType === '' || audience.type === selectedType)
  )

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Meta':
        return '📘'
      case 'Google':
        return '🔍'
      case 'TikTok':
        return '🎵'
      default:
        return '🎯'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'saved':
        return 'bg-nexus-blue text-white'
      case 'lookalike':
        return 'bg-nexus-green text-white'
      case 'custom':
        return 'bg-nexus-violet text-white'
      case 'interest':
        return 'bg-nexus-amber text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  if (loading && !audiences.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexus-text-primary">Audience Targeting</h1>
            <p className="text-nexus-text-secondary">Loading audiences...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Audience Targeting</h1>
          <p className="text-nexus-text-secondary">Create and manage targeted audiences for your campaigns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-nexus-border hover:bg-nexus-bg-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Audience
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-nexus-text-primary">Create New Audience</DialogTitle>
              </DialogHeader>
              <AudienceForm onSubmit={handleCreateAudience} adAccounts={adAccounts} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-nexus-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary h-4 w-4" />
                <Input
                  placeholder="Search audiences..."
                  className="pl-10 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-40 border-nexus-border">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {adAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.platform} - {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32 border-nexus-border">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="saved">Saved</SelectItem>
                  <SelectItem value="lookalike">Lookalike</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-nexus-blue mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {filteredAudiences.length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Total Audiences</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-nexus-green mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {formatNumber(filteredAudiences.reduce((sum, a) => sum + (a.size || 0), 0))}
                </div>
                <div className="text-sm text-nexus-text-secondary">Total Reach</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-nexus-amber mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  ${(filteredAudiences.reduce((sum, a) => sum + a.performance.cpm, 0) / filteredAudiences.length).toFixed(2)}
                </div>
                <div className="text-sm text-nexus-text-secondary">Avg CPM</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-nexus-violet mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {(filteredAudiences.reduce((sum, a) => sum + a.performance.ctr, 0) / filteredAudiences.length).toFixed(1)}%
                </div>
                <div className="text-sm text-nexus-text-secondary">Avg CTR</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audiences List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAudiences.map((audience) => (
          <Card key={audience.id} className="border-nexus-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPlatformIcon(audience.platform)}</span>
                  <Badge className={getTypeColor(audience.type)}>
                    {audience.type}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                  <MoreHorizontal className="w-4 h-4 text-nexus-text-tertiary" />
                </Button>
              </div>
              <CardTitle className="text-nexus-text-primary text-lg">{audience.name}</CardTitle>
              {audience.description && (
                <p className="text-sm text-nexus-text-secondary">{audience.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Audience Size & Performance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-nexus-text-tertiary">Audience Size</div>
                  <div className="text-xl font-bold text-nexus-text-primary">
                    {formatNumber(audience.size || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-nexus-text-tertiary">Avg CPM</div>
                  <div className="text-xl font-bold text-nexus-text-primary">
                    ${audience.performance.cpm.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Targeting Summary */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-nexus-text-primary">Targeting:</div>
                <div className="flex flex-wrap gap-1">
                  {audience.targeting.demographics.age_min && (
                    <Badge variant="outline" className="text-xs border-nexus-border">
                      {audience.targeting.demographics.age_min}-{audience.targeting.demographics.age_max}
                    </Badge>
                  )}
                  {audience.targeting.locations.slice(0, 2).map(location => (
                    <Badge key={location} variant="outline" className="text-xs border-nexus-border">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                  {audience.targeting.interests.slice(0, 1).map(interest => (
                    <Badge key={interest} variant="outline" className="text-xs border-nexus-border">
                      {interest}
                    </Badge>
                  ))}
                  {audience.targeting.locations.length > 2 && (
                    <Badge variant="outline" className="text-xs border-nexus-border">
                      +{audience.targeting.locations.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-nexus-border">
                <div className="text-center">
                  <div className="text-sm text-nexus-text-tertiary">Reach</div>
                  <div className="font-semibold text-nexus-text-primary">
                    {formatNumber(audience.performance.reach)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-nexus-text-tertiary">Freq</div>
                  <div className="font-semibold text-nexus-text-primary">
                    {audience.performance.frequency.toFixed(1)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-nexus-text-tertiary">CTR</div>
                  <div className="font-semibold text-nexus-text-primary">
                    {audience.performance.ctr.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm" className="border-nexus-border hover:bg-nexus-bg-secondary">
                  <Eye className="w-4 h-4 mr-2 text-nexus-blue" />
                  View Details
                </Button>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <Edit className="w-4 h-4 text-nexus-text-tertiary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                    <Copy className="w-4 h-4 text-nexus-text-tertiary" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAudiences.length === 0 && !loading && (
        <Card className="border-nexus-border">
          <CardContent className="text-center py-12">
            <Target className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Audiences Found</h3>
            <p className="text-nexus-text-secondary mb-6">
              {selectedAccount ? 'Create your first audience to start targeting specific customer segments.' : 'Select an ad account to view audiences.'}
            </p>
            {selectedAccount && (
              <Button
                className="bg-nexus-blue hover:bg-nexus-accent text-white"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Audience
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AudienceForm({ onSubmit, adAccounts }: {
  onSubmit: (data: Omit<Audience, 'id' | 'created_at' | 'updated_at' | 'size'>) => void
  adAccounts: AdAccount[]
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: '',
    type: 'saved',
    ageMin: [25],
    ageMax: [45],
    genders: [] as string[],
    locations: [] as string[],
    interests: [] as string[],
    behaviors: [] as string[],
    devices: [] as string[],
    languages: ['en']
  })

  const [locationInput, setLocationInput] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [behaviorInput, setBehaviorInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const audienceData = {
      name: formData.name,
      description: formData.description,
      platform: formData.platform,
      type: formData.type,
      targeting: {
        demographics: {
          age_min: formData.ageMin[0],
          age_max: formData.ageMax[0],
          gender: formData.genders
        },
        locations: formData.locations,
        interests: formData.interests,
        behaviors: formData.behaviors,
        devices: formData.devices,
        languages: formData.languages
      }
    }

    onSubmit(audienceData)
  }

  const addLocation = () => {
    if (locationInput && !formData.locations.includes(locationInput)) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, locationInput]
      }))
      setLocationInput('')
    }
  }

  const addInterest = () => {
    if (interestInput && !formData.interests.includes(interestInput)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput]
      }))
      setInterestInput('')
    }
  }

  const addBehavior = () => {
    if (behaviorInput && !formData.behaviors.includes(behaviorInput)) {
      setFormData(prev => ({
        ...prev,
        behaviors: [...prev.behaviors, behaviorInput]
      }))
      setBehaviorInput('')
    }
  }

  const removeItem = (array: string[], item: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: array.filter(i => i !== item)
    }))
  }

  const toggleGender = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter(g => g !== gender)
        : [...prev.genders, gender]
    }))
  }

  const toggleDevice = (device: string) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.includes(device)
        ? prev.devices.filter(d => d !== device)
        : [...prev.devices, device]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="interests">Interests & Behaviors</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-nexus-text-primary">Audience Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-nexus-text-primary">Platform *</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger className="border-nexus-border">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {adAccounts.map(account => (
                    <SelectItem key={account.id} value={account.platform}>
                      {account.platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-nexus-text-primary">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this audience..."
              className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-nexus-text-primary">Audience Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="border-nexus-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saved">Saved Audience</SelectItem>
                <SelectItem value="lookalike">Lookalike Audience</SelectItem>
                <SelectItem value="custom">Custom Audience</SelectItem>
                <SelectItem value="interest">Interest-Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-nexus-text-primary">Age Range</Label>
              <div className="px-3 py-2">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-nexus-text-secondary">Min: {formData.ageMin[0]}</span>
                  <Slider
                    value={formData.ageMin}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, ageMin: value }))}
                    max={65}
                    min={18}
                    step={1}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-nexus-text-secondary">Max: {formData.ageMax[0]}</span>
                  <Slider
                    value={formData.ageMax}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, ageMax: value }))}
                    max={65}
                    min={18}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-nexus-text-primary">Gender</Label>
              <div className="flex space-x-4 mt-2">
                {['male', 'female', 'all'].map(gender => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={gender}
                      checked={formData.genders.includes(gender) || (gender === 'all' && formData.genders.length === 0)}
                      onCheckedChange={() => {
                        if (gender === 'all') {
                          setFormData(prev => ({ ...prev, genders: [] }))
                        } else {
                          toggleGender(gender)
                        }
                      }}
                    />
                    <Label htmlFor={gender} className="capitalize text-nexus-text-primary">{gender}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-nexus-text-primary">Locations</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Add location..."
                  className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                />
                <Button type="button" onClick={addLocation} variant="outline" className="border-nexus-border">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.locations.map(location => (
                  <Badge key={location} variant="secondary" className="border-nexus-border">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location}
                    <button
                      type="button"
                      onClick={() => removeItem(formData.locations, location, 'locations')}
                      className="ml-1 hover:text-nexus-red"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-nexus-text-primary">Devices</Label>
              <div className="flex space-x-4 mt-2">
                {[
                  { value: 'mobile', label: 'Mobile', icon: Smartphone },
                  { value: 'desktop', label: 'Desktop', icon: Monitor }
                ].map(device => (
                  <div key={device.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={device.value}
                      checked={formData.devices.includes(device.value)}
                      onCheckedChange={() => toggleDevice(device.value)}
                    />
                    <device.icon className="w-4 h-4" />
                    <Label htmlFor={device.value} className="text-nexus-text-primary">{device.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="interests" className="space-y-4">
          <div>
            <Label className="text-nexus-text-primary">Interests</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="Add interest..."
                className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button type="button" onClick={addInterest} variant="outline" className="border-nexus-border">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="border-nexus-border">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeItem(formData.interests, interest, 'interests')}
                    className="ml-1 hover:text-nexus-red"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-nexus-text-primary">Behaviors</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                value={behaviorInput}
                onChange={(e) => setBehaviorInput(e.target.value)}
                placeholder="Add behavior..."
                className="flex-1 border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBehavior())}
              />
              <Button type="button" onClick={addBehavior} variant="outline" className="border-nexus-border">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.behaviors.map(behavior => (
                <Badge key={behavior} variant="secondary" className="border-nexus-border">
                  {behavior}
                  <button
                    type="button"
                    onClick={() => removeItem(formData.behaviors, behavior, 'behaviors')}
                    className="ml-1 hover:text-nexus-red"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-nexus-blue hover:bg-nexus-accent text-white">
          Create Audience
        </Button>
      </div>
    </form>
  )
}