'use client'

import { useState } from 'react'
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
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Wallet,
  TrendingDown,
  Zap
} from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'

const statsCards = [
  { title: 'Total Earnings', value: '$48,560', change: '+12.5%', trend: 'up', icon: DollarSign, gradient: 'from-nexus-violet to-nexus-blue', lightBg: 'bg-nexus-violet-light' },
  { title: 'Monthly Sales', value: '1,234', change: '+8.2%', trend: 'up', icon: ShoppingCart, gradient: 'from-nexus-blue to-cyan-500', lightBg: 'bg-nexus-blue-light' },
  { title: 'Wallet Balance', value: '$12,340', change: '-2.1%', trend: 'down', icon: Wallet, gradient: 'from-nexus-amber to-orange-500', lightBg: 'bg-amber-50' },
  { title: 'Conversion Rate', value: '12.5%', change: '+2.1%', trend: 'up', icon: TrendingUp, gradient: 'from-nexus-green to-emerald-500', lightBg: 'bg-green-50' },
  { title: 'Total Contacts', value: '1,234', change: '+12%', trend: 'up', icon: Users, gradient: 'from-pink-500 to-nexus-violet', lightBg: 'bg-pink-50' },
  { title: 'Active Conversations', value: '89', change: '+5%', trend: 'up', icon: MessageSquare, gradient: 'from-cyan-500 to-blue-500', lightBg: 'bg-cyan-50' },
]

const chartData = [
  { month: 'Jan', earnings: 4000, sales: 240, leads: 400 },
  { month: 'Feb', earnings: 3000, sales: 198, leads: 300 },
  { month: 'Mar', earnings: 5000, sales: 320, leads: 500 },
  { month: 'Apr', earnings: 4500, sales: 290, leads: 450 },
  { month: 'May', earnings: 6000, sales: 380, leads: 600 },
  { month: 'Jun', earnings: 5500, sales: 350, leads: 550 },
  { month: 'Jul', earnings: 7000, sales: 420, leads: 700 },
  { month: 'Aug', earnings: 6500, sales: 400, leads: 650 },
  { month: 'Sep', earnings: 8000, sales: 480, leads: 800 },
  { month: 'Oct', earnings: 7500, sales: 460, leads: 750 },
  { month: 'Nov', earnings: 9000, sales: 520, leads: 900 },
  { month: 'Dec', earnings: 9500, sales: 550, leads: 950 },
]

const trafficData = [
  { name: 'Direct', value: 400, color: '#6C47FF' },
  { name: 'Facebook', value: 300, color: '#0652DD' },
  { name: 'YouTube', value: 200, color: '#DC2626' },
  { name: 'Search', value: 250, color: '#12A150' },
  { name: 'Referral', value: 150, color: '#D97706' },
]

const summaryCards = [
  { title: 'Revenue Status', value: '$48,560', icon: DollarSign, trend: 'up', change: '+12.5%', sparkline: [20, 35, 28, 45, 40, 55, 48, 65] },
  { title: 'Page Views', value: '24,531', icon: Eye, trend: 'up', change: '+18.2%', sparkline: [30, 40, 35, 50, 45, 60, 55, 70] },
  { title: 'Bounce Rate', value: '32.1%', icon: TrendingDown, trend: 'down', change: '-2.4%', sparkline: [65, 60, 55, 50, 45, 40, 38, 35] },
  { title: 'Earnings', value: '$8,420', icon: Wallet, trend: 'up', change: '+9.1%', sparkline: [15, 25, 20, 35, 30, 45, 40, 55] },
]

const recentActivities = [
  { action: 'New contact added', target: 'John Doe', time: '2 min ago', icon: Users, color: 'text-nexus-violet', bg: 'bg-nexus-violet-light' },
  { action: 'Email sent to', target: 'jane@example.com', time: '15 min ago', icon: Mail, color: 'text-nexus-blue', bg: 'bg-nexus-blue-light' },
  { action: 'Pipeline updated', target: 'Enterprise Deal', time: '1 hour ago', icon: Target, color: 'text-pink-600', bg: 'bg-pink-50' },
  { action: 'Task completed', target: 'Follow-up call', time: '2 hours ago', icon: CheckCircle, color: 'text-nexus-green', bg: 'bg-green-50' },
  { action: 'New lead captured', target: 'Website form', time: '3 hours ago', icon: ArrowUpRight, color: 'text-nexus-violet', bg: 'bg-nexus-violet-light' },
]

const ordersData = [
  { invoice: 'INV-001', customer: 'John Doe', from: 'New York, USA', price: '$1,200', status: 'completed' },
  { invoice: 'INV-002', customer: 'Jane Smith', from: 'London, UK', price: '$850', status: 'open' },
  { invoice: 'INV-003', customer: 'Bob Johnson', from: 'Tokyo, Japan', price: '$2,100', status: 'pending' },
  { invoice: 'INV-004', customer: 'Alice Brown', from: 'Sydney, Australia', price: '$950', status: 'completed' },
  { invoice: 'INV-005', customer: 'Charlie Wilson', from: 'Berlin, Germany', price: '$1,500', status: 'open' },
]

const quickActions = [
  { label: 'Add Contact', icon: Users, gradient: 'from-nexus-violet to-nexus-blue' },
  { label: 'Send Email', icon: Mail, gradient: 'from-nexus-blue to-cyan-500' },
  { label: 'Create Campaign', icon: Target, gradient: 'from-pink-500 to-nexus-violet' },
  { label: 'View Reports', icon: BarChart3, gradient: 'from-nexus-green to-emerald-500' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-nexus-text-secondary mt-1">Here's what's happening with your business today.</p>
        </div>
        <Button className="bg-gradient-to-r from-nexus-violet to-nexus-blue hover:from-nexus-violet/90 hover:to-nexus-blue/90 text-white shadow-lg shadow-nexus-violet/25">
          <Plus className="w-4 h-4 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border-nexus-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className={cn("h-1 bg-gradient-to-r", stat.gradient)} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2.5 rounded-xl", stat.lightBg)}>
                  <stat.icon className="w-5 h-5 text-nexus-text-primary" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  stat.trend === 'up' ? "text-nexus-green bg-green-50" : "text-nexus-red bg-red-50"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-nexus-text-primary">{stat.value}</div>
              <div className="text-sm text-nexus-text-secondary mt-1">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <Card className="lg:col-span-2 border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
              <LineChart className="w-5 h-5 text-nexus-violet" />
              Analytics Overview
            </CardTitle>
            <div className="flex gap-1">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                    activeTab === tab
                      ? "bg-nexus-violet text-white"
                      : "text-nexus-text-secondary hover:bg-nexus-bg-secondary"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C47FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C47FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0652DD" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0652DD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" stroke="#8A8A8A" fontSize={12} />
                <YAxis stroke="#8A8A8A" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="earnings" stroke="#6C47FF" strokeWidth={2} fill="url(#colorEarnings)" />
                <Area type="monotone" dataKey="sales" stroke="#0652DD" strokeWidth={2} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Donut Chart */}
        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
              <PieChart className="w-5 h-5 text-nexus-blue" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-4">
              {trafficData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-nexus-text-secondary">{item.name}</span>
                  </div>
                  <span className="font-medium text-nexus-text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="border-nexus-border shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-nexus-bg-secondary">
                  <card.icon className="w-5 h-5 text-nexus-text-primary" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  card.trend === 'up' ? "text-nexus-green bg-green-50" : "text-nexus-red bg-red-50"
                )}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </div>
              </div>
              <div className="text-xl font-bold text-nexus-text-primary">{card.value}</div>
              <div className="text-sm text-nexus-text-secondary mb-3">{card.title}</div>
              <ResponsiveContainer width="100%" height={40}>
                <RechartsLineChart data={card.sparkline.map((v, i) => ({ value: v, index: i }))}>
                  <Line type="monotone" dataKey="value" stroke={card.trend === 'up' ? '#12A150' : '#DC2626'} strokeWidth={2} dot={false} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-nexus-violet" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-nexus-text-secondary hover:text-nexus-text-primary">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-nexus-border">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-nexus-bg-secondary transition-colors">
                  <div className={cn("p-2 rounded-lg", activity.bg)}>
                    <activity.icon className={cn("w-4 h-4", activity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
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
        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-nexus-bg-secondary hover:bg-nexus-bg-tertiary transition-all duration-200 group"
              >
                <span className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", action.gradient)}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-nexus-text-primary">{action.label}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-nexus-text-tertiary group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-nexus-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-nexus-border">
          <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-nexus-blue" />
            Recent Orders
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-nexus-text-secondary hover:text-nexus-text-primary">
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-nexus-border bg-nexus-bg-secondary/50">
                  <th className="text-left p-4 text-sm font-medium text-nexus-text-secondary">Invoice</th>
                  <th className="text-left p-4 text-sm font-medium text-nexus-text-secondary">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-nexus-text-secondary">From</th>
                  <th className="text-left p-4 text-sm font-medium text-nexus-text-secondary">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-nexus-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nexus-border">
                {ordersData.map((order, index) => (
                  <tr key={index} className="hover:bg-nexus-bg-secondary transition-colors">
                    <td className="p-4 text-sm font-medium text-nexus-text-primary">{order.invoice}</td>
                    <td className="p-4 text-sm text-nexus-text-secondary">{order.customer}</td>
                    <td className="p-4 text-sm text-nexus-text-secondary">{order.from}</td>
                    <td className="p-4 text-sm font-medium text-nexus-text-primary">{order.price}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        order.status === 'completed' && "bg-green-100 text-nexus-green",
                        order.status === 'open' && "bg-blue-100 text-nexus-blue",
                        order.status === 'pending' && "bg-amber-100 text-nexus-amber"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-nexus-border flex items-center justify-between">
            <p className="text-sm text-nexus-text-secondary">Showing 5 of 50 results</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-nexus-border">Previous</Button>
              <Button variant="outline" size="sm" className="border-nexus-border bg-nexus-violet text-white">1</Button>
              <Button variant="outline" size="sm" className="border-nexus-border">2</Button>
              <Button variant="outline" size="sm" className="border-nexus-border">3</Button>
              <Button variant="outline" size="sm" className="border-nexus-border">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
