'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  GitBranch,
  Plus,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react'

interface Pipeline {
  id: string
  name: string
  stages: PipelineStage[]
  opportunities: Opportunity[]
}

interface PipelineStage {
  id: string
  name: string
  color: string
  order: number
}

interface Opportunity {
  id: string
  name: string
  contact: string
  company: string
  value: number
  stage: string
  probability: number
  expectedCloseDate: string
  lastActivity: string
  assignedTo: string
}

export default function PipelinesPage() {
  const [selectedPipeline, setSelectedPipeline] = useState('sales')
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  // Mock pipeline data
  const pipelines: Record<string, Pipeline> = {
    sales: {
      id: 'sales',
      name: 'Sales Pipeline',
      stages: [
        { id: 'lead', name: 'New Lead', color: 'bg-blue-500', order: 1 },
        { id: 'qualified', name: 'Qualified', color: 'bg-yellow-500', order: 2 },
        { id: 'proposal', name: 'Proposal Sent', color: 'bg-purple-500', order: 3 },
        { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500', order: 4 },
        { id: 'closed_won', name: 'Closed Won', color: 'bg-green-500', order: 5 },
        { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-500', order: 6 }
      ],
      opportunities: [
        {
          id: '1',
          name: 'Enterprise Deal',
          contact: 'John Smith',
          company: 'TechCorp',
          value: 50000,
          stage: 'proposal',
          probability: 75,
          expectedCloseDate: '2026-05-15',
          lastActivity: '2026-04-24T10:30:00Z',
          assignedTo: 'Sarah Johnson'
        },
        {
          id: '2',
          name: 'SMB Package',
          contact: 'Emma Davis',
          company: 'LocalBiz',
          value: 12000,
          stage: 'qualified',
          probability: 60,
          expectedCloseDate: '2026-05-01',
          lastActivity: '2026-04-23T14:15:00Z',
          assignedTo: 'Mike Chen'
        },
        {
          id: '3',
          name: 'Startup Solution',
          contact: 'Alex Johnson',
          company: 'InnovateLabs',
          value: 25000,
          stage: 'negotiation',
          probability: 85,
          expectedCloseDate: '2026-04-30',
          lastActivity: '2026-04-24T09:45:00Z',
          assignedTo: 'Sarah Johnson'
        },
        {
          id: '4',
          name: 'Consulting Project',
          contact: 'Lisa Wong',
          company: 'StrategyCorp',
          value: 35000,
          stage: 'lead',
          probability: 30,
          expectedCloseDate: '2026-06-01',
          lastActivity: '2026-04-22T16:20:00Z',
          assignedTo: 'Mike Chen'
        }
      ]
    }
  }

  const currentPipeline = pipelines[selectedPipeline]

  const getOpportunitiesByStage = (stageId: string) => {
    return currentPipeline.opportunities.filter(opp => opp.stage === stageId)
  }

  const getStageColor = (stageId: string) => {
    const stage = currentPipeline.stages.find(s => s.id === stageId)
    return stage?.color || 'bg-gray-500'
  }

  const getTotalValue = () => {
    return currentPipeline.opportunities.reduce((sum, opp) => sum + opp.value, 0)
  }

  const getWonValue = () => {
    return currentPipeline.opportunities
      .filter(opp => opp.stage === 'closed_won')
      .reduce((sum, opp) => sum + opp.value, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipelines</h1>
          <p className="text-gray-600">Track and manage your sales opportunities through the pipeline.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitBranch className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{currentPipeline.opportunities.length}</div>
                <div className="text-sm text-gray-600">Total Opportunities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(getTotalValue())}</div>
                <div className="text-sm text-gray-600">Pipeline Value</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(getWonValue())}</div>
                <div className="text-sm text-gray-600">Closed Won</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((getWonValue() / getTotalValue()) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {currentPipeline.stages.map((stage: PipelineStage) => (
            <div key={stage.id} className="bg-gray-50 rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{stage.name}</h3>
                <Badge className="bg-gray-200 text-gray-700">
                  {getOpportunitiesByStage(stage.id).length}
                </Badge>
              </div>

              <div className="space-y-3">
                {getOpportunitiesByStage(stage.id).map((opportunity: Opportunity) => (
                  <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                        <span className="text-xs text-gray-500">
                          {opportunity.probability}%
                        </span>
                      </div>

                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {opportunity.name}
                      </h4>

                      <p className="text-xs text-gray-600 mb-2">
                        {opportunity.contact} • {opportunity.company}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600 text-sm">
                          {formatCurrency(opportunity.value)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Opportunity
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Close Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPipeline.opportunities.map((opportunity: Opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {opportunity.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {opportunity.contact} • {opportunity.company}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStageColor(opportunity.stage)}>
                          {currentPipeline.stages.find(s => s.id === opportunity.stage)?.name}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(opportunity.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${opportunity.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{opportunity.probability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {opportunity.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Stage Distribution</h4>
              <div className="space-y-2">
                {currentPipeline.stages.map((stage) => {
                  const count = getOpportunitiesByStage(stage.id).length
                  const percentage = Math.round((count / currentPipeline.opportunities.length) * 100)
                  return (
                    <div key={stage.id} className="flex items-center justify-between">
                      <span className="text-sm">{stage.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${stage.color}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Monthly Trends</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Opportunities Added</span>
                  <span className="font-medium text-green-600">+12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deals Closed</span>
                  <span className="font-medium text-blue-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Deal Size</span>
                  <span className="font-medium text-purple-600">$28,750</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sales Velocity</span>
                  <span className="font-medium text-orange-600">24 days</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Performers</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">SJ</span>
                    </div>
                    <span className="text-sm">Sarah Johnson</span>
                  </div>
                  <span className="font-medium text-green-600">$75K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600">MC</span>
                    </div>
                    <span className="text-sm">Mike Chen</span>
                  </div>
                  <span className="font-medium text-green-600">$47K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-600">LW</span>
                    </div>
                    <span className="text-sm">Lisa Wong</span>
                  </div>
                  <span className="font-medium text-green-600">$35K</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}