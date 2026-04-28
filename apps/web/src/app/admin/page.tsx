'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Building2,
  Key,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Server,
  Database,
  Shield,
  Zap,
  DollarSign,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  CreditCard
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

const adminStats = [
  { title: 'Total Users', value: '12,431', change: '+18.2%', trend: 'up', icon: Users, gradient: 'from-nexus-violet to-nexus-blue', lightBg: 'bg-nexus-violet-light' },
  { title: 'Organizations', value: '1,234', change: '+12.5%', trend: 'up', icon: Building2, gradient: 'from-nexus-blue to-cyan-500', lightBg: 'bg-nexus-blue-light' },
  { title: 'API Keys Active', value: '856', change: '+5.3%', trend: 'up', icon: Key, gradient: 'from-nexus-green to-emerald-500', lightBg: 'bg-green-50' },
  { title: 'Monthly Revenue', value: '$124,560', change: '+22.1%', trend: 'up', icon: DollarSign, gradient: 'from-pink-500 to-nexus-violet', lightBg: 'bg-pink-50' },
  { title: 'Active Campaigns', value: '3,421', change: '+8.7%', trend: 'up', icon: TrendingUp, gradient: 'from-nexus-amber to-orange-500', lightBg: 'bg-amber-50' },
  { title: 'System Uptime', value: '99.9%', change: '+0.1%', trend: 'up', icon: Server, gradient: 'from-cyan-500 to-blue-500', lightBg: 'bg-cyan-50' },
]

const growthData = [
  { month: 'Jan', users: 8200, orgs: 650, revenue: 85000 },
  { month: 'Feb', users: 8800, orgs: 720, revenue: 92000 },
  { month: 'Mar', users: 9500, orgs: 800, revenue: 105000 },
  { month: 'Apr', users: 10200, orgs: 880, revenue: 115000 },
  { month: 'May', users: 11000, orgs: 950, revenue: 125000 },
  { month: 'Jun', users: 11800, orgs: 1020, revenue: 135000 },
  { month: 'Jul', users: 12431, orgs: 1080, revenue: 124560 },
]

const planDistribution = [
  { name: 'Starter', value: 45, color: '#6C47FF' },
  { name: 'Pro', value: 35, color: '#0652DD' },
  { name: 'Agency', value: 15, color: '#12A150' },
  { name: 'Enterprise', value: 5, color: '#D97706' },
]

const systemHealth = [
  { metric: 'API Response Time', value: '120ms', status: 'good', icon: Activity },
  { metric: 'Database Load', value: '42%', status: 'good', icon: Database },
  { metric: 'Active Connections', value: '1,234', status: 'good', icon: Globe },
  { metric: 'Error Rate', value: '0.02%', status: 'good', icon: Shield },
]

const recentAdminActivities = [
  { action: 'User registered', target: 'john@example.com', time: '5 min ago', icon: Users, color: 'text-nexus-violet', bg: 'bg-nexus-violet-light' },
  { action: 'API key added', target: 'OpenAI API Key', time: '15 min ago', icon: Key, color: 'text-nexus-blue', bg: 'bg-nexus-blue-light' },
  { action: 'Organization created', target: 'Acme Corp', time: '1 hour ago', icon: Building2, color: 'text-nexus-green', bg: 'bg-green-50' },
  { action: 'Payment received', target: '$2,500 from Pro User', time: '2 hours ago', icon: DollarSign, color: 'text-nexus-amber', bg: 'bg-amber-50' },
  { action: 'System backup', target: 'Automated daily backup', time: '3 hours ago', icon: CheckCircle, color: 'text-nexus-blue', bg: 'bg-nexus-blue-light' },
]

const quickActions = [
  { label: 'Manage Users', icon: Users, href: '/admin/users', gradient: 'from-nexus-violet to-nexus-blue' },
  { label: 'API Vault', icon: Key, href: '/admin/vault', gradient: 'from-nexus-blue to-cyan-500' },
  { label: 'Demo Accounts', icon: Eye, href: '/admin/demo-accounts', gradient: 'from-nexus-green to-emerald-500' },
  { label: 'White Label', icon: Globe, href: '/admin/white-label', gradient: 'from-pink-500 to-nexus-violet' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'revenue' | 'orgs'>('users')

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">
            Platform Administration 👋
          </h1>
          <p className="text-nexus-text-secondary mt-1">Monitor and manage the NEXUS platform.</p>
        </div>
        <Button className="bg-gradient-to-r from-nexus-violet to-nexus-blue hover:from-nexus-violet/90 hover:to-nexus-blue/90 text-white shadow-lg shadow-nexus-violet/25">
          <Zap className="w-4 h-4 mr-2" />
          System Settings
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {adminStats.map((stat, index) => (
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
                  <ArrowUpRight className="w-3 h-3" />
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
        {/* Growth Chart */}
        <Card className="lg:col-span-2 border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
              <LineChart className="w-5 h-5 text-nexus-violet" />
              Platform Growth
            </CardTitle>
            <div className="flex gap-1">
              {(['users', 'revenue', 'orgs'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-colors capitalize",
                    activeTab === tab
                      ? "bg-nexus-violet text-white"
                      : "text-nexus-text-secondary hover:bg-nexus-bg-secondary"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C47FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C47FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0652DD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0652DD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" stroke="#8A8A8A" fontSize={12} />
                <YAxis stroke="#8A8A8A" fontSize={12} />
                <Tooltip />
                {activeTab === 'users' && (
                  <Area type="monotone" dataKey="users" stroke="#6C47FF" strokeWidth={2} fill="url(#colorUsers)" />
                )}
                {activeTab === 'revenue' && (
                  <Area type="monotone" dataKey="revenue" stroke="#0652DD" strokeWidth={2} fill="url(#colorRevenue)" />
                )}
                {activeTab === 'orgs' && (
                  <Area type="monotone" dataKey="orgs" stroke="#12A150" strokeWidth={2} fill="url(#colorRevenue)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
              <PieChart className="w-5 h-5 text-nexus-blue" />
              Plan Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-4">
              {planDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-nexus-text-secondary">{item.name}</span>
                  </div>
                  <span className="font-medium text-nexus-text-primary">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
              <Server className="w-5 h-5 text-nexus-green" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {systemHealth.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-nexus-bg-secondary">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-nexus-surface">
                    <item.icon className="w-4 h-4 text-nexus-text-primary" />
                  </div>
                  <span className="text-sm text-nexus-text-secondary">{item.metric}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-nexus-text-primary">{item.value}</span>
                  <CheckCircle className="w-4 h-4 text-nexus-green" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2 border-nexus-border shadow-sm">
          <CardHeader className="pb-2 border-b border-nexus-border">
            <CardTitle className="text-lg font-semibold text-nexus-text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="flex items-center justify-between p-4 rounded-xl bg-nexus-bg-secondary hover:bg-nexus-bg-tertiary transition-all duration-200 group"
                >
                  <span className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", action.gradient)}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-nexus-text-primary">{action.label}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-nexus-text-tertiary group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Admin Activity */}
      <Card className="border-nexus-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-nexus-border">
          <CardTitle className="text-lg font-semibold text-nexus-text-primary flex items-center gap-2">
            <Activity className="w-5 h-5 text-nexus-violet" />
            Recent Admin Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-nexus-text-secondary hover:text-nexus-text-primary">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-nexus-border">
            {recentAdminActivities.map((activity, index) => (
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
    </div>
  )
}
