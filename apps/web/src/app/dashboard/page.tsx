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
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your business today.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
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
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-gray-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Add Contact
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Email
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Create Campaign
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { task: 'Follow up with John Doe', due: 'Today, 2:00 PM', priority: 'high' },
              { task: 'Review pipeline opportunities', due: 'Tomorrow, 10:00 AM', priority: 'medium' },
              { task: 'Send weekly newsletter', due: 'Friday, 9:00 AM', priority: 'low' },
              { task: 'Update contact database', due: 'Next Monday', priority: 'medium' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium">{item.task}</span>
                </div>
                <span className="text-xs text-gray-500">{item.due}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}