'use client'

import { useAuth } from '@/lib/auth'
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
  DollarSign
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-nexus-text-secondary">Here's what's happening with your business today.</p>
        </div>
        <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-nexus-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">1,234</div>
            <p className="text-xs text-nexus-text-secondary">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Active Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-nexus-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">89</div>
            <p className="text-xs text-nexus-text-secondary">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-nexus-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">$45,231</div>
            <p className="text-xs text-nexus-text-secondary">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-nexus-text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">12.5%</div>
            <p className="text-xs text-nexus-text-secondary">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-nexus-border">
          <CardHeader>
            <CardTitle className="flex items-center text-nexus-text-primary">
              <Activity className="w-5 h-5 mr-2 text-nexus-blue" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New contact added', target: 'John Doe', time: '2 minutes ago' },
                { action: 'Email sent to', target: 'jane@example.com', time: '15 minutes ago' },
                { action: 'Pipeline updated', target: 'Enterprise Deal', time: '1 hour ago' },
                { action: 'Task completed', target: 'Follow-up call', time: '2 hours ago' },
                { action: 'New lead captured', target: 'Website form', time: '3 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-nexus-blue rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-nexus-text-primary">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-nexus-text-secondary">{activity.target}</span>
                    </p>
                    <p className="text-xs text-nexus-text-tertiary">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-nexus-border">
          <CardHeader>
            <CardTitle className="text-nexus-text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-nexus-blue" />
                Add Contact
              </span>
              <ArrowRight className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>

            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-nexus-blue" />
                Send Email
              </span>
              <ArrowRight className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>

            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-nexus-blue" />
                Create Campaign
              </span>
              <ArrowRight className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>

            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-nexus-blue" />
                View Reports
              </span>
              <ArrowRight className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { task: 'Follow up with John Doe', due: 'Today, 2:00 PM', priority: 'high' },
              { task: 'Review pipeline opportunities', due: 'Tomorrow, 10:00 AM', priority: 'medium' },
              { task: 'Send weekly newsletter', due: 'Friday, 9:00 AM', priority: 'low' },
              { task: 'Update contact database', due: 'Next Monday', priority: 'medium' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-nexus-bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.priority === 'high' ? 'bg-nexus-red' :
                    item.priority === 'medium' ? 'bg-nexus-amber' : 'bg-nexus-green'
                  }`}></div>
                  <span className="text-sm font-medium text-nexus-text-primary">{item.task}</span>
                </div>
                <span className="text-xs text-nexus-text-tertiary">{item.due}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}