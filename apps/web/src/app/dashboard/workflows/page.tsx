'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Play,
  Pause,
  Settings,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Mail,
  MessageSquare,
  FileText,
  Database,
  Webhook,
  Code,
  Trash2
} from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  trigger: {
    type: 'manual' | 'schedule' | 'event' | 'webhook'
    config: any
  }
  steps: WorkflowStep[]
  executions: number
  successRate: number
  lastRun: string
}

interface WorkflowStep {
  id: string
  type: 'action' | 'condition' | 'delay' | 'notification'
  name: string
  config: any
}

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  // Mock workflows data
  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'New Lead Nurture',
      description: 'Automatically nurture new leads with personalized email sequences',
      status: 'active',
      trigger: {
        type: 'event',
        config: { event: 'lead_created' }
      },
      steps: [
        { id: '1', type: 'delay', name: 'Wait 1 day', config: { days: 1 } },
        { id: '2', type: 'action', name: 'Send welcome email', config: { template: 'welcome' } },
        { id: '3', type: 'condition', name: 'If not opened', config: { condition: 'email_not_opened', days: 3 } },
        { id: '4', type: 'action', name: 'Send follow-up', config: { template: 'follow_up' } }
      ],
      executions: 156,
      successRate: 89.2,
      lastRun: '2026-04-24T10:30:00Z'
    },
    {
      id: '2',
      name: 'Customer Onboarding',
      description: 'Streamline customer onboarding with automated tasks and communications',
      status: 'active',
      trigger: {
        type: 'event',
        config: { event: 'customer_signed_up' }
      },
      steps: [
        { id: '1', type: 'action', name: 'Create welcome kit', config: { template: 'welcome_kit' } },
        { id: '2', type: 'delay', name: 'Wait 2 hours', config: { hours: 2 } },
        { id: '3', type: 'action', name: 'Send setup instructions', config: { template: 'setup_guide' } },
        { id: '4', type: 'action', name: 'Schedule onboarding call', config: { calendar: 'primary' } }
      ],
      executions: 89,
      successRate: 94.7,
      lastRun: '2026-04-23T15:45:00Z'
    },
    {
      id: '3',
      name: 'Invoice Payment Follow-up',
      description: 'Automated follow-up for overdue invoice payments',
      status: 'paused',
      trigger: {
        type: 'schedule',
        config: { frequency: 'daily', time: '09:00' }
      },
      steps: [
        { id: '1', type: 'condition', name: 'Check overdue invoices', config: { daysOverdue: 7 } },
        { id: '2', type: 'action', name: 'Send payment reminder', config: { template: 'payment_reminder' } },
        { id: '3', type: 'delay', name: 'Wait 3 days', config: { days: 3 } },
        { id: '4', type: 'condition', name: 'If still unpaid', config: { checkPayment: true } },
        { id: '5', type: 'action', name: 'Escalate to manager', config: { notify: 'manager' } }
      ],
      executions: 23,
      successRate: 78.3,
      lastRun: '2026-04-20T09:00:00Z'
    },
    {
      id: '4',
      name: 'Content Publishing',
      description: 'Automate content publishing and social media distribution',
      status: 'draft',
      trigger: {
        type: 'manual',
        config: {}
      },
      steps: [
        { id: '1', type: 'action', name: 'Publish to blog', config: { platform: 'wordpress' } },
        { id: '2', type: 'action', name: 'Share on LinkedIn', config: { platform: 'linkedin' } },
        { id: '3', type: 'action', name: 'Share on Twitter', config: { platform: 'twitter' } },
        { id: '4', type: 'notification', name: 'Notify team', config: { channel: 'slack' } }
      ],
      executions: 0,
      successRate: 0,
      lastRun: null
    }
  ]

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

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'manual':
        return <Users className="w-4 h-4" />
      case 'schedule':
        return <Clock className="w-4 h-4" />
      case 'event':
        return <Zap className="w-4 h-4" />
      case 'webhook':
        return <Webhook className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'action':
        return <Zap className="w-4 h-4" />
      case 'condition':
        return <AlertTriangle className="w-4 h-4" />
      case 'delay':
        return <Clock className="w-4 h-4" />
      case 'notification':
        return <Mail className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="text-gray-600">Create automated workflows to streamline your business processes.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{workflows.filter(w => w.status === 'active').length}</div>
                <div className="text-sm text-gray-600">Active Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {workflows.reduce((sum, w) => sum + w.executions, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Executions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(workflows.reduce((sum, w) => sum + w.successRate * w.executions, 0) /
                    Math.max(workflows.reduce((sum, w) => sum + w.executions, 0), 1))}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-gray-600">Automation</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          {/* Workflows List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTriggerIcon(workflow.trigger.type)}
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{workflow.description}</p>

                  {/* Trigger Info */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Trigger:</span>
                    <Badge variant="outline" className="capitalize">
                      {workflow.trigger.type}
                    </Badge>
                  </div>

                  {/* Steps Preview */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">Workflow Steps:</div>
                    <div className="flex flex-wrap gap-2">
                      {workflow.steps.slice(0, 4).map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-1 text-xs">
                          {getStepIcon(step.type)}
                          <span>{step.name}</span>
                          {index < workflow.steps.length - 1 && <ArrowRight className="w-3 h-3" />}
                        </div>
                      ))}
                      {workflow.steps.length > 4 && (
                        <span className="text-xs text-gray-500">+{workflow.steps.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Executions</div>
                      <div className="font-semibold">{workflow.executions}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Success Rate</div>
                      <div className="font-semibold">{workflow.successRate}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Last Run</div>
                      <div className="font-semibold text-xs">{formatDate(workflow.lastRun)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Run
                      </Button>
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                    <Button
                      variant={workflow.status === 'active' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => setSelectedWorkflow(workflow.id)}
                    >
                      {workflow.status === 'active' ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Lead Nurture Sequence',
                description: 'Automated email sequences for lead nurturing',
                category: 'Marketing',
                steps: 5,
                icon: <Mail className="w-6 h-6" />
              },
              {
                name: 'Customer Onboarding',
                description: 'Streamlined customer onboarding workflow',
                category: 'Sales',
                steps: 7,
                icon: <Users className="w-6 h-6" />
              },
              {
                name: 'Content Publishing',
                description: 'Automated content publishing and distribution',
                category: 'Content',
                steps: 4,
                icon: <FileText className="w-6 h-6" />
              },
              {
                name: 'Invoice Processing',
                description: 'Automated invoice creation and follow-up',
                category: 'Finance',
                steps: 6,
                icon: <Database className="w-6 h-6" />
              },
              {
                name: 'Support Ticket Routing',
                description: 'Intelligent ticket routing and escalation',
                category: 'Support',
                steps: 8,
                icon: <MessageSquare className="w-6 h-6" />
              },
              {
                name: 'Social Media Monitoring',
                description: 'Automated social media response system',
                category: 'Social',
                steps: 5,
                icon: <MessageSquare className="w-6 h-6" />
              }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{template.steps} steps</span>
                    <Button size="sm">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Play className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">2,456</div>
                    <div className="text-sm text-gray-600">Workflow Executions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">87.3%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">24.5h</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.filter(w => w.executions > 0).map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {workflow.executions} executions • {workflow.successRate}% success rate
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${workflow.successRate}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}