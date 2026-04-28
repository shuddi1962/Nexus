'use client'

import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  MessageSquare,
  Target,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
  DollarSign,
  Mail,
  Send,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const statsCards = [
  { title: 'Total Contacts', value: '1,234', change: '+12%', trend: 'up', icon: Users },
  { title: 'Active Conversations', value: '89', change: '+5%', trend: 'up', icon: MessageSquare },
  { title: 'Pipeline Value', value: '$45,231', change: '+8%', trend: 'up', icon: DollarSign },
  { title: 'Conversion Rate', value: '12.5%', change: '+2.1%', trend: 'up', icon: TrendingUp },
]

const quickActions = [
  { label: 'Add Contact', icon: Users, color: 'blue' },
  { label: 'Send Email', icon: Mail, color: 'purple' },
  { label: 'Create Campaign', icon: Target, color: 'pink' },
  { label: 'View Reports', icon: BarChart3, color: 'green' },
]

const tasks = [
  { task: 'Follow up with John Doe', due: 'Today, 2:00 PM', priority: 'high', status: 'pending' },
  { task: 'Review pipeline opportunities', due: 'Tomorrow, 10:00 AM', priority: 'medium', status: 'pending' },
  { task: 'Send weekly newsletter', due: 'Friday, 9:00 AM', priority: 'low', status: 'pending' },
  { task: 'Update contact database', due: 'Next Monday', priority: 'medium', status: 'completed' },
]

const activities = [
  { action: 'New contact added', target: 'John Doe', time: '2 min ago', icon: Users, color: 'blue' },
  { action: 'Email sent to', target: 'jane@example.com', time: '15 min ago', icon: Mail, color: 'purple' },
  { action: 'Pipeline updated', target: 'Enterprise Deal', time: '1 hour ago', icon: Target, color: 'pink' },
  { action: 'Task completed', target: 'Follow-up call', time: '2 hours ago', icon: CheckCircle, color: 'green' },
  { action: 'New lead captured', target: 'Website form', time: '3 hours ago', icon: ArrowUpRight, color: 'blue' },
]

const campaigns = [
  { name: 'Summer Sale 2026', status: 'active', budget: '$2,500', spent: '$1,890', leads: 234 },
  { name: 'Newsletter Q2', status: 'active', budget: '$500', spent: '$320', leads: 89 },
  { name: 'Product Launch', status: 'paused', budget: '$5,000', spent: '$0', leads: 0 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
          <Plus className="w-4 h-4 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  index === 0 && "bg-blue-50",
                  index === 1 && "bg-purple-50",
                  index === 2 && "bg-pink-50",
                  index === 3 && "bg-green-50"
                )}>
                  <stat.icon className={cn(
                    "w-5 h-5",
                    index === 0 && "text-blue-600",
                    index === 1 && "text-purple-600",
                    index === 2 && "text-pink-600",
                    index === 3 && "text-green-600"
                  )} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "p-2 rounded-lg",
                    activity.color === 'blue' && "bg-blue-50",
                    activity.color === 'purple' && "bg-purple-50",
                    activity.color === 'pink' && "bg-pink-50",
                    activity.color === 'green' && "bg-green-50"
                  )}>
                    <activity.icon className={cn(
                      "w-4 h-4",
                      activity.color === 'blue' && "text-blue-600",
                      activity.color === 'purple' && "text-purple-600",
                      activity.color === 'pink' && "text-pink-600",
                      activity.color === 'green' && "text-green-600"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-slate-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:shadow-md",
                  action.color === 'blue' && "bg-blue-50 hover:bg-blue-100 text-blue-700",
                  action.color === 'purple' && "bg-purple-50 hover:bg-purple-100 text-purple-700",
                  action.color === 'pink' && "bg-pink-50 hover:bg-pink-100 text-pink-700",
                  action.color === 'green' && "bg-green-50 hover:bg-green-100 text-green-700"
                )}
              >
                <span className="flex items-center gap-3">
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Campaigns & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-600" />
              Active Campaigns
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {campaigns.map((campaign, index) => (
                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{campaign.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      campaign.status === 'active' && "bg-green-100 text-green-700",
                      campaign.status === 'paused' && "bg-amber-100 text-amber-700"
                    )}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs">Budget</p>
                      <p className="font-medium text-slate-900">{campaign.budget}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Spent</p>
                      <p className="font-medium text-slate-900">{campaign.spent}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Leads</p>
                      <p className="font-medium text-slate-900">{campaign.leads}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Upcoming Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {tasks.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <button className={cn(
                    "flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center",
                    item.status === 'completed' 
                      ? "bg-green-500 border-green-500" 
                      : "border-slate-300 hover:border-blue-500"
                  )}>
                    {item.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm",
                      item.status === 'completed' ? "text-slate-400 line-through" : "text-slate-900"
                    )}>
                      {item.task}
                    </p>
                    <p className="text-xs text-slate-400">{item.due}</p>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    item.priority === 'high' && "bg-red-500",
                    item.priority === 'medium' && "bg-amber-500",
                    item.priority === 'low' && "bg-green-500"
                  )} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}