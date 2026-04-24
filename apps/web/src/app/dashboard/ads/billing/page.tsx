'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Receipt,
  TrendingUp,
  Wallet,
  Banknote
} from 'lucide-react'

// Mock billing data
const billingData = {
  currentBalance: 15420.50,
  monthlyBudget: 25000,
  spentThisMonth: 18750.25,
  pendingCharges: 2340.50,
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
  },
  billingHistory: [
    {
      id: '1',
      date: '2026-04-15',
      description: 'Meta Ads - Q2 Campaign',
      amount: 2850.75,
      status: 'paid',
      platform: 'Meta',
      invoiceUrl: '#',
    },
    {
      id: '2',
      date: '2026-04-10',
      description: 'Google Ads - Brand Campaign',
      amount: 1650.25,
      status: 'paid',
      platform: 'Google',
      invoiceUrl: '#',
    },
    {
      id: '3',
      date: '2026-04-05',
      description: 'TikTok Ads - Product Demo',
      amount: 920.50,
      status: 'paid',
      platform: 'TikTok',
      invoiceUrl: '#',
    },
    {
      id: '4',
      date: '2026-04-01',
      description: 'Meta Ads - Holiday Sale',
      amount: 3450.00,
      status: 'pending',
      platform: 'Meta',
      invoiceUrl: '#',
    },
  ],
  platformBalances: [
    {
      platform: 'Meta',
      balance: 5200.00,
      spent: 8750.25,
      available: 4450.75,
    },
    {
      platform: 'Google',
      balance: 3800.00,
      spent: 6250.50,
      available: 2550.50,
    },
    {
      platform: 'TikTok',
      balance: 2100.00,
      spent: 3749.50,
      available: 1650.50,
    },
  ],
  upcomingCharges: [
    {
      description: 'Meta Ads - Auto top-up',
      amount: 1500.00,
      date: '2026-04-25',
      platform: 'Meta',
    },
    {
      description: 'Google Ads - Performance bonus',
      amount: 800.00,
      date: '2026-04-28',
      platform: 'Google',
    },
  ],
}

export default function BillingPage() {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
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
      default:
        return '📢'
    }
  }

  const budgetUtilization = (billingData.spentThisMonth / billingData.monthlyBudget) * 100
  const isOverBudget = budgetUtilization > 90

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage your advertising budgets and payment methods.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.currentBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Available for campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.monthlyBudget)}</div>
            <div className="mt-2">
              <Progress value={budgetUtilization} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {budgetUtilization.toFixed(1)}% utilized
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.spentThisMonth)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(billingData.monthlyBudget - billingData.spentThisMonth)} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Charges</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.pendingCharges)}</div>
            <p className="text-xs text-muted-foreground">
              To be charged soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alert */}
      {isOverBudget && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Budget Alert</h3>
                <p className="text-sm text-yellow-700">
                  You've used {budgetUtilization.toFixed(1)}% of your monthly budget.
                  Consider adjusting campaign spending or increasing your budget limit.
                </p>
              </div>
              <Button size="sm" className="ml-auto">
                Adjust Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.platformBalances.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getPlatformIcon(platform.platform)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{platform.platform} Balance</h3>
                    <p className="text-sm text-gray-600">
                      Spent: {formatCurrency(platform.spent)} / Available: {formatCurrency(platform.available)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(platform.balance)}
                    </div>
                    <div className="text-xs text-gray-500">Current Balance</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Funds
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method & Upcoming Charges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {billingData.paymentMethod.brand}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    •••• •••• •••• {billingData.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Primary
              </Badge>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                Update Card
              </Button>
              <Button variant="outline" className="flex-1">
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Charges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {billingData.upcomingCharges.map((charge, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{getPlatformIcon(charge.platform)}</div>
                    <div>
                      <p className="font-medium text-gray-900">{charge.description}</p>
                      <p className="text-sm text-gray-600">{charge.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(charge.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Billing History
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Platforms</option>
                <option>Meta</option>
                <option>Google</option>
                <option>TikTok</option>
              </select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingData.billingHistory.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getPlatformIcon(invoice.platform)}</span>
                        <span className="text-sm text-gray-900">{invoice.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}