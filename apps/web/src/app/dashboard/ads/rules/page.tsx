'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  DollarSign,
  Eye,
  MousePointer
} from 'lucide-react'

// Mock rules data
const automationRules = [
  {
    id: '1',
    name: 'Budget Protector',
    description: 'Pause campaigns when daily spend exceeds 80% of budget',
    type: 'budget',
    status: 'active',
    platform: 'all',
    conditions: [
      { metric: 'daily_spend', operator: 'greater_than', value: '80%', target: 'budget' }
    ],
    actions: [
      { type: 'pause_campaign', target: 'campaign' }
    ],
    triggers: 12,
    lastTriggered: '2026-04-23T14:30:00Z',
    performance: '+5.2% budget efficiency',
  },
  {
    id: '2',
    name: 'CTR Optimizer',
    description: 'Increase bid by 10% when CTR drops below 1%',
    type: 'performance',
    status: 'active',
    platform: 'Google',
    conditions: [
      { metric: 'ctr', operator: 'less_than', value: '1.0' }
    ],
    actions: [
      { type: 'increase_bid', value: '10%', target: 'ad_set' }
    ],
    triggers: 8,
    lastTriggered: '2026-04-22T09:15:00Z',
    performance: '+15.3% CTR improvement',
  },
  {
    id: '3',
    name: 'High Performer Booster',
    description: 'Increase budget by 25% for campaigns with ROAS > 5x',
    type: 'performance',
    status: 'active',
    platform: 'Meta',
    conditions: [
      { metric: 'roas', operator: 'greater_than', value: '5.0' }
    ],
    actions: [
      { type: 'increase_budget', value: '25%', target: 'campaign' }
    ],
    triggers: 3,
    lastTriggered: '2026-04-20T16:45:00Z',
    performance: '+18.7% revenue growth',
  },
  {
    id: '4',
    name: 'Low Performer Pauser',
    description: 'Pause ad sets with CTR below 0.5% for 7 days',
    type: 'performance',
    status: 'paused',
    platform: 'all',
    conditions: [
      { metric: 'ctr', operator: 'less_than', value: '0.5' }
    ],
    actions: [
      { type: 'pause_adset', duration: '7 days', target: 'ad_set' }
    ],
    triggers: 15,
    lastTriggered: '2026-04-18T11:20:00Z',
    performance: '+8.9% cost efficiency',
  },
  {
    id: '5',
    name: 'Creative Performance Monitor',
    description: 'Flag creatives with impressions > 10K but clicks < 50',
    type: 'creative',
    status: 'active',
    platform: 'all',
    conditions: [
      { metric: 'impressions', operator: 'greater_than', value: '10000' },
      { metric: 'clicks', operator: 'less_than', value: '50' }
    ],
    actions: [
      { type: 'send_notification', target: 'user' },
      { type: 'flag_creative', target: 'creative' }
    ],
    triggers: 6,
    lastTriggered: '2026-04-21T13:10:00Z',
    performance: '3 creatives optimized',
  },
]

export default function RulesPage() {
  const [selectedRules, setSelectedRules] = useState<string[]>([])

  const toggleRule = (ruleId: string) => {
    setSelectedRules(prev =>
      prev.includes(ruleId)
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'budget':
        return 'bg-blue-100 text-blue-800'
      case 'performance':
        return 'bg-purple-100 text-purple-800'
      case 'creative':
        return 'bg-orange-100 text-orange-800'
      case 'schedule':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Meta':
        return '📘'
      case 'Google':
        return '🔍'
      case 'TikTok':
        return '🎵'
      case 'all':
        return '🌐'
      default:
        return '📢'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automated Rules Engine</h1>
          <p className="text-gray-600">Create intelligent automation rules to optimize your campaigns.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Rule Templates
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Rules Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {automationRules.filter(r => r.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {automationRules.reduce((sum, r) => sum + r.triggers, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Triggers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">23.4%</div>
                <div className="text-sm text-gray-600">Avg. Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">$12,450</div>
                <div className="text-sm text-gray-600">Cost Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedRules.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedRules.length} rule{selectedRules.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedRules.includes(rule.id)}
                      onChange={() => toggleRule(rule.id)}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="text-2xl">{getPlatformIcon(rule.platform)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                        <Badge className={getTypeColor(rule.type)}>
                          {rule.type}
                        </Badge>
                        <Badge className={getStatusColor(rule.status)}>
                          {rule.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{rule.description}</p>

                      {/* Conditions */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Conditions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {rule.conditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {condition.metric} {condition.operator.replace('_', ' ')} {condition.value}
                              {condition.target && ` of ${condition.target}`}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Actions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {rule.actions.map((action, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {action.type.replace('_', ' ')}
                              {action.value && ` ${action.value}`}
                              {action.duration && ` for ${action.duration}`}
                              {action.target && ` → ${action.target}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                {/* Performance Stats */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-gray-600">Triggers: </span>
                      <span className="font-semibold text-blue-600">{rule.triggers}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last triggered: </span>
                      <span className="font-medium">{formatTimestamp(rule.lastTriggered)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Performance: </span>
                      <span className="font-semibold text-green-600">{rule.performance}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {rule.status === 'active' ? (
                      <Button variant="outline" size="sm">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rule Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Rule Templates</CardTitle>
          <p className="text-sm text-gray-600">Get started quickly with pre-built automation templates</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Smart Budget Manager',
                description: 'Automatically adjust budgets based on performance',
                type: 'budget',
                icon: '💰',
              },
              {
                name: 'Performance Optimizer',
                description: 'Increase bids for high-performing ads, decrease for low performers',
                type: 'performance',
                icon: '📈',
              },
              {
                name: 'Creative Tester',
                description: 'Automatically rotate creatives to find the best performers',
                type: 'creative',
                icon: '🎨',
              },
              {
                name: 'Schedule Manager',
                description: 'Automatically start/stop campaigns based on schedule',
                type: 'schedule',
                icon: '⏰',
              },
              {
                name: 'Audience Expander',
                description: 'Expand audience targeting for successful campaigns',
                type: 'audience',
                icon: '👥',
              },
              {
                name: 'Alert System',
                description: 'Send notifications for important campaign events',
                type: 'notification',
                icon: '🔔',
              },
            ].map((template) => (
              <div key={template.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{template.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
                <Button className="w-full mt-3" size="sm">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}