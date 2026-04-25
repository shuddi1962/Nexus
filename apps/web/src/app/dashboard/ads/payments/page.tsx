'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Plus,
  Receipt,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react'

interface Payment {
  id: string
  account_id: string
  platform: string
  amount: number
  commission: number
  net_amount: number
  currency: string
  status: 'processing' | 'completed' | 'failed'
  created_at: string
}

interface PaymentMethod {
  id: string
  name: string
  type: string
  currencies: string[]
  processing_fee: string
}

export default function AdsPaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  useEffect(() => {
    fetchPayments()
    fetchPaymentMethods()
    fetchAdAccounts()
  }, [])

  const fetchPayments = async () => {
    try {
      const data = await apiClient.getPayments()
      setPayments(data.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const data = await apiClient.getPaymentMethods()
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    }
  }

  const fetchAdAccounts = async () => {
    try {
      const data = await apiClient.getAdAccounts()
      setAdAccounts(data)
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
    }
  }

  const handleProcessPayment = async (paymentData: any) => {
    try {
      setProcessingPayment(true)
      const result = await apiClient.processPayment(paymentData)
      fetchPayments()
      setShowPaymentDialog(false)
    } catch (error) {
      console.error('Error processing payment:', error)
    } finally {
      setProcessingPayment(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-nexus-green" />
      case 'processing':
        return <Clock className="w-4 h-4 text-nexus-amber" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-nexus-red" />
      default:
        return <Clock className="w-4 h-4 text-nexus-text-tertiary" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-nexus-green text-white'
      case 'processing':
        return 'bg-nexus-amber text-white'
      case 'failed':
        return 'bg-nexus-red text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  // Calculate totals
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalCommission = payments.reduce((sum, payment) => sum + payment.commission, 0)
  const totalNet = payments.reduce((sum, payment) => sum + payment.net_amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Payments & Billing</h1>
          <p className="text-nexus-text-secondary">Manage your ad spend and payment processing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Download className="w-4 h-4 mr-2 text-nexus-blue" />
            Export
          </Button>
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-nexus-text-primary">Add Ad Funds</DialogTitle>
              </DialogHeader>
              <PaymentForm
                onSubmit={handleProcessPayment}
                adAccounts={adAccounts}
                paymentMethods={paymentMethods}
                loading={processingPayment}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-nexus-text-secondary">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Platform Fees</CardTitle>
            <Receipt className="h-4 w-4 text-nexus-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">
              {formatCurrency(totalCommission)}
            </div>
            <p className="text-xs text-nexus-text-secondary">
              7% commission rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Net to Platforms</CardTitle>
            <TrendingUp className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">
              {formatCurrency(totalNet)}
            </div>
            <p className="text-xs text-nexus-text-secondary">
              Credited to ad accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">Payment Methods</CardTitle>
          <p className="text-sm text-nexus-text-secondary">Choose how you'd like to fund your campaigns</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-4 border border-nexus-border rounded-lg">
                <div className="flex items-center mb-3">
                  <CreditCard className="w-5 h-5 text-nexus-blue mr-2" />
                  <span className="font-medium text-nexus-text-primary">{method.name}</span>
                </div>
                <p className="text-sm text-nexus-text-secondary mb-2">
                  Fee: {method.processing_fee}
                </p>
                <div className="flex flex-wrap gap-1">
                  {method.currencies.slice(0, 3).map((currency) => (
                    <Badge key={currency} variant="outline" className="text-xs border-nexus-border">
                      {currency}
                    </Badge>
                  ))}
                  {method.currencies.length > 3 && (
                    <Badge variant="outline" className="text-xs border-nexus-border">
                      +{method.currencies.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">Payment History</CardTitle>
          <p className="text-sm text-nexus-text-secondary">Track all your ad spend transactions</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexus-blue"></div>
              <span className="ml-2 text-nexus-text-secondary">Loading payments...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">No Payments Yet</h3>
              <p className="text-nexus-text-secondary mb-6">
                Your payment history will appear here once you start funding campaigns.
              </p>
              <Button
                className="bg-nexus-blue hover:bg-nexus-accent text-white"
                onClick={() => setShowPaymentDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Make First Payment
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nexus-text-tertiary">Date</TableHead>
                  <TableHead className="text-nexus-text-tertiary">Platform</TableHead>
                  <TableHead className="text-nexus-text-tertiary">Amount</TableHead>
                  <TableHead className="text-nexus-text-tertiary">Commission</TableHead>
                  <TableHead className="text-nexus-text-tertiary">Net Amount</TableHead>
                  <TableHead className="text-nexus-text-tertiary">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-nexus-text-primary">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-nexus-bg-secondary text-nexus-text-primary border-nexus-border">
                        {payment.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-nexus-text-primary">
                      {formatCurrency(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell className="text-nexus-text-secondary">
                      {formatCurrency(payment.commission, payment.currency)}
                    </TableCell>
                    <TableCell className="font-medium text-nexus-green">
                      {formatCurrency(payment.net_amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <Badge className={`ml-2 ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary">Billing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-nexus-text-primary mb-2">Current Plan</h4>
              <p className="text-nexus-text-secondary">Professional Plan - $99/month</p>
              <p className="text-sm text-nexus-text-tertiary">Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-medium text-nexus-text-primary mb-2">Commission Rate</h4>
              <p className="text-nexus-text-secondary">7% on all ad spend</p>
              <p className="text-sm text-nexus-text-tertiary">This covers platform maintenance and support</p>
            </div>
          </div>
          <div className="pt-4 border-t border-nexus-border">
            <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
              <Receipt className="w-4 h-4 mr-2 text-nexus-blue" />
              View Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentForm({ onSubmit, adAccounts, paymentMethods, loading }: {
  onSubmit: (data: any) => void
  adAccounts: any[]
  paymentMethods: PaymentMethod[]
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    account_id: '',
    amount: '',
    currency: 'USD',
    payment_method: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      account_id: formData.account_id,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account" className="text-nexus-text-primary">Ad Account *</Label>
        <Select value={formData.account_id} onValueChange={(value) => setFormData(prev => ({ ...prev, account_id: value }))}>
          <SelectTrigger className="border-nexus-border">
            <SelectValue placeholder="Select ad account" />
          </SelectTrigger>
          <SelectContent>
            {adAccounts.map(account => (
              <SelectItem key={account.id} value={account.id}>
                {account.platform} - {account.account_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-nexus-text-primary">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="1"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="100.00"
            required
            className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-nexus-text-primary">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
            <SelectTrigger className="border-nexus-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method" className="text-nexus-text-primary">Payment Method *</Label>
        <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
          <SelectTrigger className="border-nexus-border">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map(method => (
              <SelectItem key={method.id} value={method.id}>
                {method.name} ({method.processing_fee})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.amount && (
        <div className="p-4 bg-nexus-bg-secondary rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-nexus-text-secondary">Amount:</span>
            <span className="text-nexus-text-primary">{formatCurrency(parseFloat(formData.amount) || 0, formData.currency)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-nexus-text-secondary">Commission (7%):</span>
            <span className="text-nexus-text-primary">{formatCurrency((parseFloat(formData.amount) || 0) * 0.07, formData.currency)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium pt-2 border-t border-nexus-border">
            <span className="text-nexus-text-primary">Net to Platform:</span>
            <span className="text-nexus-green">{formatCurrency((parseFloat(formData.amount) || 0) * 0.93, formData.currency)}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-nexus-blue hover:bg-nexus-accent text-white" disabled={loading}>
          {loading ? 'Processing...' : 'Process Payment'}
        </Button>
      </div>
    </form>
  )
}