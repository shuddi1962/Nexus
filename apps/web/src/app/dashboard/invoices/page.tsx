'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileText,
  DollarSign,
  Download,
  Send,
  Eye,
  Search,
  Filter,
  Plus,
  Calendar,
  Mail,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react'

interface Invoice {
  id: string
  number: string
  customer: string
  email: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  createdAt: string
  items: InvoiceItem[]
}

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  // Mock invoice data
  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2026-001',
      customer: 'Acme Corporation',
      email: 'billing@acme.com',
      amount: 2500.00,
      status: 'paid',
      dueDate: '2026-05-15',
      createdAt: '2026-04-20',
      items: [
        { description: 'NEXUS Pro License', quantity: 1, rate: 1999.00, amount: 1999.00 },
        { description: 'Setup & Training', quantity: 1, rate: 501.00, amount: 501.00 }
      ]
    },
    {
      id: '2',
      number: 'INV-2026-002',
      customer: 'TechStart Inc',
      email: 'finance@techstart.com',
      amount: 1250.00,
      status: 'sent',
      dueDate: '2026-05-01',
      createdAt: '2026-04-18',
      items: [
        { description: 'NEXUS Agency Plan', quantity: 1, rate: 999.00, amount: 999.00 },
        { description: 'Custom Integration', quantity: 1, rate: 251.00, amount: 251.00 }
      ]
    },
    {
      id: '3',
      number: 'INV-2026-003',
      customer: 'Global Solutions Ltd',
      email: 'accounts@global.com',
      amount: 3750.00,
      status: 'overdue',
      dueDate: '2026-04-25',
      createdAt: '2026-04-15',
      items: [
        { description: 'NEXUS Enterprise License', quantity: 1, rate: 2999.00, amount: 2999.00 },
        { description: 'Premium Support', quantity: 1, rate: 751.00, amount: 751.00 }
      ]
    },
    {
      id: '4',
      number: 'INV-2026-004',
      customer: 'StartupXYZ',
      email: 'hello@startupxyz.com',
      amount: 750.00,
      status: 'draft',
      dueDate: '2026-05-10',
      createdAt: '2026-04-24',
      items: [
        { description: 'NEXUS Starter Plan', quantity: 1, rate: 499.00, amount: 499.00 },
        { description: 'Onboarding Setup', quantity: 1, rate: 251.00, amount: 251.00 }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'sent':
        return <Send className="w-4 h-4 text-blue-500" />
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-500" />
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const pendingAmount = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices & Payments</h1>
          <p className="text-gray-600">Manage invoices, track payments, and handle billing.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Paid Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">${overdueAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <div className="text-sm text-gray-600">Total Invoices</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">All Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(invoice.status)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {invoice.number}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(invoice.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.customer}
                            </div>
                            <div className="text-sm text-gray-500">{invoice.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="w-4 h-4" />
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
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { method: 'Stripe', status: 'connected', transactions: 245, volume: 45600 },
                  { method: 'PayPal', status: 'connected', transactions: 123, volume: 23400 },
                  { method: 'Bank Transfer', status: 'configured', transactions: 67, volume: 12300 },
                  { method: 'Crypto', status: 'pending', transactions: 0, volume: 0 }
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{payment.method}</div>
                        <div className="text-sm text-gray-600">
                          {payment.transactions} transactions • ${payment.volume.toLocaleString()} volume
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={
                        payment.status === 'connected' ? 'bg-green-100 text-green-800' :
                        payment.status === 'configured' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {payment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { invoice: 'INV-2026-001', customer: 'Acme Corporation', amount: 2500.00, method: 'Stripe', date: '2026-04-24', status: 'completed' },
                  { invoice: 'INV-2026-002', customer: 'TechStart Inc', amount: 1250.00, method: 'PayPal', date: '2026-04-23', status: 'completed' },
                  { invoice: 'INV-2026-003', customer: 'Global Solutions', amount: 750.00, method: 'Bank Transfer', date: '2026-04-22', status: 'pending' }
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{payment.invoice}</div>
                        <div className="text-sm text-gray-600">
                          {payment.customer} • {payment.method} • {payment.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                      <Badge className={
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Professional', description: 'Clean, corporate design', preview: '📄' },
                  { name: 'Modern', description: 'Contemporary styling', preview: '🎨' },
                  { name: 'Minimal', description: 'Simple and elegant', preview: '⚪' },
                  { name: 'Creative', description: 'Bold and colorful', preview: '🌈' },
                  { name: 'Classic', description: 'Traditional business style', preview: '🏢' }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{template.preview}</div>
                      <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice Prefix</Label>
                    <Input defaultValue="INV-" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Due Date</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Footer Text</Label>
                  <Input defaultValue="Thank you for your business!" />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Include payment QR code</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Auto-send payment reminders</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue="NEXUS Platform Inc." />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input defaultValue="123 Business St, Suite 100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label>State/Province</Label>
                    <Input defaultValue="CA" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ZIP/Postal Code</Label>
                    <Input defaultValue="94105" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input defaultValue="United States" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tax ID/VAT Number</Label>
                  <Input defaultValue="US123456789" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="cad">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" defaultValue="8.5" />
                </div>

                <div className="space-y-2">
                  <Label>Late Payment Fee (%)</Label>
                  <Input type="number" defaultValue="1.5" />
                </div>

                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select defaultValue="net30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15 days</SelectItem>
                      <SelectItem value="net30">Net 30 days</SelectItem>
                      <SelectItem value="net45">Net 45 days</SelectItem>
                      <SelectItem value="net60">Net 60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Send automatic payment reminders</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Require PO numbers for invoices</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}