import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowRight,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react'

// Mock pipeline data
const pipelines = [
  {
    id: '1',
    name: 'Enterprise Sales',
    description: 'High-value enterprise deals',
    stages: [
      { id: '1', name: 'Lead', count: 12, value: 240000 },
      { id: '2', name: 'Discovery', count: 8, value: 180000 },
      { id: '3', name: 'Proposal', count: 5, value: 150000 },
      { id: '4', name: 'Negotiation', count: 3, value: 120000 },
      { id: '5', name: 'Closed Won', count: 2, value: 80000 },
    ],
    totalValue: 770000,
    totalDeals: 30,
    conversionRate: 6.7,
  },
  {
    id: '2',
    name: 'SMB Sales',
    description: 'Small to medium business opportunities',
    stages: [
      { id: '1', name: 'Awareness', count: 45, value: 135000 },
      { id: '2', name: 'Interest', count: 28, value: 84000 },
      { id: '3', name: 'Consideration', count: 15, value: 45000 },
      { id: '4', name: 'Purchase', count: 8, value: 24000 },
      { id: '5', name: 'Onboarding', count: 5, value: 15000 },
    ],
    totalValue: 303000,
    totalDeals: 101,
    conversionRate: 5.0,
  },
]

const opportunities = [
  {
    id: '1',
    name: 'Acme Corp Enterprise Deal',
    contact: { name: 'John Doe', avatar: null },
    company: 'Acme Corp',
    value: 50000,
    stage: 'Proposal',
    pipeline: 'Enterprise Sales',
    probability: 75,
    closeDate: '2026-05-15',
    lastActivity: '2026-04-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'Tech Startup Partnership',
    contact: { name: 'Jane Smith', avatar: null },
    company: 'Tech Startup Inc',
    value: 25000,
    stage: 'Discovery',
    pipeline: 'SMB Sales',
    probability: 60,
    closeDate: '2026-04-30',
    lastActivity: '2026-04-22T14:15:00Z',
  },
  {
    id: '3',
    name: 'Retail Solutions Upgrade',
    contact: { name: 'Alice Wilson', avatar: null },
    company: 'Retail Solutions',
    value: 15000,
    stage: 'Negotiation',
    pipeline: 'SMB Sales',
    probability: 85,
    closeDate: '2026-04-25',
    lastActivity: '2026-04-23T09:45:00Z',
  },
]

export default function PipelinesPage() {
  const [selectedPipeline, setSelectedPipeline] = useState(pipelines[0])
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  const getOpportunitiesForStage = (stageName: string) => {
    return opportunities.filter(opp => opp.stage === stageName && opp.pipeline === selectedPipeline.name)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipelines</h1>
          <p className="text-gray-600">Track and manage your sales opportunities.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setView(view === 'kanban' ? 'list' : 'kanban')}>
            {view === 'kanban' ? 'List View' : 'Kanban View'}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Pipeline
          </Button>
        </div>
      </div>

      {/* Pipeline Selector */}
      <div className="flex space-x-4">
        {pipelines.map((pipeline) => (
          <Card
            key={pipeline.id}
            className={`cursor-pointer transition-all ${
              selectedPipeline.id === pipeline.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedPipeline(pipeline)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{pipeline.name}</h3>
                <Badge variant="secondary">{pipeline.totalDeals} deals</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{pipeline.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">{formatCurrency(pipeline.totalValue)}</div>
                  <div className="text-gray-500">Total Value</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{pipeline.conversionRate}%</div>
                  <div className="text-gray-500">Conversion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline View */}
      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {selectedPipeline.stages.map((stage) => (
            <Card key={stage.id} className="min-h-[400px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                  <Badge variant="secondary">{stage.count}</Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(stage.value)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {getOpportunitiesForStage(stage.name).map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="p-3 bg-gray-50 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {opportunity.name}
                      </h4>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={opportunity.contact.avatar || ''} />
                        <AvatarFallback className="text-xs">
                          {opportunity.contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{opportunity.contact.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatCurrency(opportunity.value)}</span>
                      <span>{opportunity.probability}%</span>
                    </div>

                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(opportunity.closeDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}

                <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Opportunity
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Opportunities</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search opportunities..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {opportunities
                    .filter(opp => opp.pipeline === selectedPipeline.name)
                    .map((opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {opportunity.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {opportunity.company}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={opportunity.contact.avatar || ''} />
                            <AvatarFallback>
                              {opportunity.contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {opportunity.contact.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">{opportunity.stage}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(opportunity.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${opportunity.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{opportunity.probability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(opportunity.closeDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
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
    </div>
  )
}