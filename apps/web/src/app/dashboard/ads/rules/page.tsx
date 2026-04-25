'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Plus,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react'

interface AdRule {
  id: string
  name: string
  description?: string
  metric: string
  condition: string
  threshold: number
  timeWindow: number
  action: string
  scope: string
  campaign_ids?: string[]
  account_ids?: string[]
  enabled: boolean
  created_at: string
  last_triggered?: string
}

interface AdAccount {
  id: string
  platform: string
  account_name: string
}

export default function AdsRulesPage() {
  const { user } = useAuth()
  const [rules, setRules] = useState<AdRule[]>([])
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedRule, setSelectedRule] = useState<AdRule | null>(null)

  useEffect(() => {
    fetchRules()
    fetchAdAccounts()
  }, [])

  const fetchRules = async () => {
    try {
      // For now, we'll show mock rules since the API doesn't exist yet
      setRules([
        {
          id: '1',
          name: 'High CPC Alert',
          description: 'Pause campaigns when CPC exceeds $2.00',
          metric: 'cpc',
          condition: 'greater_than',
          threshold: 2.0,
          timeWindow: 24,
          action: 'pause_campaign',
          scope: 'campaign',
          enabled: true,
          created_at: '2026-04-20T10:00:00Z',
          last_triggered: '2026-04-24T14:30:00Z',
        },
        {
          id: '2',
          name: 'Low CTR Optimizer',
          description: 'Increase budget when CTR drops below 1%',
          metric: 'ctr',
          condition: 'less_than',
          threshold: 1.0,
          timeWindow: 48,
          action: 'increase_budget',
          scope: 'campaign',
          enabled: false,
          created_at: '2026-04-22T08:15:00Z',
        },
        {
          id: '3',
          name: 'Performance Notification',
          description: 'Send alert when ROAS exceeds 5x',
          metric: 'roas',
          condition: 'greater_than',
          threshold: 5.0,
          timeWindow: 12,
          action: 'send_notification',
          scope: 'account',
          enabled: true,
          created_at: '2026-04-23T16:45:00Z',
          last_triggered: '2026-04-25T09:20:00Z',
        },
      ])
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdAccounts = async () => {
    try {
      const data = await apiClient.getAdAccounts()
      setAdAccounts(data)
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
    }
  }

  const handleCreateRule = async (ruleData: any) => {
    try {
      await apiClient.createAdRule(ruleData)
      fetchRules()
      setShowCreateDialog(false)
    } catch (error) {
      console.error('Error creating rule:', error)
    }
  }

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      // Update rule enabled status
      setRules(rules.map(rule =>
        rule.id === ruleId ? { ...rule, enabled } : rule
      ))
    } catch (error) {
      console.error('Error toggling rule:', error)
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'cpc':
        return <TrendingUp className="w-4 h-4 text-nexus-blue" />
      case 'ctr':
        return <Target className="w-4 h-4 text-nexus-green" />
      case 'roas':
        return <TrendingUp className="w-4 h-4 text-nexus-violet" />
      case 'spend':
        return <TrendingUp className="w-4 h-4 text-nexus-amber" />
      default:
        return <Target className="w-4 h-4 text-nexus-text-tertiary" />
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'pause_campaign':
        return <Pause className="w-4 h-4 text-nexus-red" />
      case 'increase_budget':
        return <TrendingUp className="w-4 h-4 text-nexus-green" />
      case 'decrease_budget':
        return <TrendingDown className="w-4 h-4 text-nexus-red" />
      case 'send_notification':
        return <AlertTriangle className="w-4 h-4 text-nexus-amber" />
      default:
        return <Settings className="w-4 h-4 text-nexus-text-tertiary" />
    }
  }

  const formatCondition = (condition: string, threshold: number, metric: string) => {
    const conditionText = {
      greater_than: '>',
      less_than: '<',
      equals: '=',
      greater_equal: '≥',
      less_equal: '≤',
    }[condition] || condition

    const metricLabel = {
      cpc: 'CPC',
      ctr: 'CTR',
      roas: 'ROAS',
      spend: 'Spend',
      impressions: 'Impressions',
      clicks: 'Clicks',
      conversions: 'Conversions',
    }[metric] || metric

    return `${metricLabel} ${conditionText} ${metric === 'cpc' || metric === 'spend' ? '$' : ''}${threshold}${metric === 'ctr' ? '%' : metric === 'roas' ? 'x' : ''}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexus-text-primary">Automated Rules</h1>
            <p className="text-nexus-text-secondary">Loading rules...</p>
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
          <h1 className="text-2xl font-bold text-nexus-text-primary">Automated Rules</h1>
          <p className="text-nexus-text-secondary">Create intelligent automation for your ad campaigns</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-nexus-text-primary">Create Automated Rule</DialogTitle>
            </DialogHeader>
            <RuleForm onSubmit={handleCreateRule} adAccounts={adAccounts} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-nexus-blue/10 rounded-lg mr-4">
                <Zap className="w-6 h-6 text-nexus-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {rules.filter(r => r.enabled).length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Active Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-nexus-green/10 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-nexus-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {rules.filter(r => r.last_triggered).length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Rules Triggered</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-nexus-amber/10 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-nexus-amber" />
              </div>
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {rules.length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Total Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">Your Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Rules Yet</h3>
                <p className="text-nexus-text-secondary mb-6">
                  Create your first automated rule to optimize campaign performance.
                </p>
                <Button
                  className="bg-nexus-blue hover:bg-nexus-accent text-white"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border border-nexus-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getMetricIcon(rule.metric)}
                      <div>
                        <h3 className="font-semibold text-nexus-text-primary">{rule.name}</h3>
                        <p className="text-sm text-nexus-text-secondary">{rule.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-nexus-text-primary">
                        {formatCondition(rule.condition, rule.threshold, rule.metric)}
                      </div>
                      <div className="text-xs text-nexus-text-tertiary">
                        {rule.timeWindow}h window
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getActionIcon(rule.action)}
                      <span className="text-sm text-nexus-text-primary capitalize">
                        {rule.action.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-nexus-text-tertiary">Last triggered</div>
                      <div className="text-sm text-nexus-text-primary">
                        {rule.last_triggered
                          ? new Date(rule.last_triggered).toLocaleDateString()
                          : 'Never'
                        }
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                      />
                      <Button variant="ghost" size="sm" className="hover:bg-nexus-bg-secondary">
                        <Settings className="w-4 h-4 text-nexus-text-tertiary" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rule Templates */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">Rule Templates</CardTitle>
          <p className="text-sm text-nexus-text-secondary">Get started with pre-built automation rules</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-nexus-border rounded-lg hover:bg-nexus-bg-secondary cursor-pointer transition-colors">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-5 h-5 text-nexus-red mr-2" />
                <span className="font-medium text-nexus-text-primary">Cost Control</span>
              </div>
              <p className="text-sm text-nexus-text-secondary mb-3">
                Automatically pause campaigns when CPC exceeds budget limits.
              </p>
              <Button size="sm" variant="outline" className="border-nexus-border hover:bg-nexus-bg">
                Use Template
              </Button>
            </div>

            <div className="p-4 border border-nexus-border rounded-lg hover:bg-nexus-bg-secondary cursor-pointer transition-colors">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-nexus-green mr-2" />
                <span className="font-medium text-nexus-text-primary">Performance Booster</span>
              </div>
              <p className="text-sm text-nexus-text-secondary mb-3">
                Increase budget for high-performing campaigns automatically.
              </p>
              <Button size="sm" variant="outline" className="border-nexus-border hover:bg-nexus-bg">
                Use Template
              </Button>
            </div>

            <div className="p-4 border border-nexus-border rounded-lg hover:bg-nexus-bg-secondary cursor-pointer transition-colors">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-nexus-amber mr-2" />
                <span className="font-medium text-nexus-text-primary">Alert System</span>
              </div>
              <p className="text-sm text-nexus-text-secondary mb-3">
                Get notified when campaigns reach important milestones.
              </p>
              <Button size="sm" variant="outline" className="border-nexus-border hover:bg-nexus-bg">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RuleForm({ onSubmit, adAccounts }: {
  onSubmit: (data: any) => void
  adAccounts: AdAccount[]
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metric: 'cpc',
    condition: 'greater_than',
    threshold: '',
    timeWindow: '24',
    action: 'pause_campaign',
    scope: 'campaign',
    enabled: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      threshold: parseFloat(formData.threshold),
      timeWindow: parseInt(formData.timeWindow),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-nexus-text-primary">Rule Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metric" className="text-nexus-text-primary">Metric *</Label>
          <Select value={formData.metric} onValueChange={(value) => setFormData(prev => ({ ...prev, metric: value }))}>
            <SelectTrigger className="border-nexus-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpc">Cost per Click (CPC)</SelectItem>
              <SelectItem value="ctr">Click-through Rate (CTR)</SelectItem>
              <SelectItem value="roas">Return on Ad Spend (ROAS)</SelectItem>
              <SelectItem value="spend">Spend</SelectItem>
              <SelectItem value="conversions">Conversions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-nexus-text-primary">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what this rule does..."
          className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition" className="text-nexus-text-primary">Condition *</Label>
          <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
            <SelectTrigger className="border-nexus-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="greater_than">Greater than</SelectItem>
              <SelectItem value="less_than">Less than</SelectItem>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="greater_equal">Greater or equal</SelectItem>
              <SelectItem value="less_equal">Less or equal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="threshold" className="text-nexus-text-primary">Threshold *</Label>
          <Input
            id="threshold"
            type="number"
            step="0.01"
            value={formData.threshold}
            onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
            required
            className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeWindow" className="text-nexus-text-primary">Time Window (hours)</Label>
          <Select value={formData.timeWindow} onValueChange={(value) => setFormData(prev => ({ ...prev, timeWindow: value }))}>
            <SelectTrigger className="border-nexus-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="6">6 hours</SelectItem>
              <SelectItem value="12">12 hours</SelectItem>
              <SelectItem value="24">24 hours</SelectItem>
              <SelectItem value="48">48 hours</SelectItem>
              <SelectItem value="168">1 week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="action" className="text-nexus-text-primary">Action *</Label>
          <Select value={formData.action} onValueChange={(value) => setFormData(prev => ({ ...prev, action: value }))}>
            <SelectTrigger className="border-nexus-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pause_campaign">Pause Campaign</SelectItem>
              <SelectItem value="increase_budget">Increase Budget (+20%)</SelectItem>
              <SelectItem value="decrease_budget">Decrease Budget (-20%)</SelectItem>
              <SelectItem value="send_notification">Send Notification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="scope" className="text-nexus-text-primary">Scope</Label>
          <Select value={formData.scope} onValueChange={(value) => setFormData(prev => ({ ...prev, scope: value }))}>
            <SelectTrigger className="border-nexus-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="campaign">Campaign</SelectItem>
              <SelectItem value="account">Account</SelectItem>
              <SelectItem value="all">All Campaigns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enabled"
          checked={formData.enabled}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
        />
        <Label htmlFor="enabled" className="text-nexus-text-primary">Enable rule immediately</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-nexus-blue hover:bg-nexus-accent text-white">
          Create Rule
        </Button>
      </div>
    </form>
  )
}