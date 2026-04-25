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
  Store,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  TrendingUp,
  Package,
  Truck,
  CreditCard,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  sales: number
  revenue: number
  image: string
  category: string
}

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  items: number
}

interface StoreSettings {
  name: string
  domain: string
  currency: string
  taxRate: number
  shipping: {
    freeThreshold: number
    standardRate: number
    expressRate: number
  }
  paymentMethods: string[]
}

export default function StorePage() {
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock store data
  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      originalPrice: 129.99,
      stock: 45,
      status: 'active',
      sales: 234,
      revenue: 21026.66,
      image: '/api/placeholder/100/100',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Smart Fitness Tracker',
      price: 149.99,
      stock: 23,
      status: 'active',
      sales: 156,
      revenue: 23398.44,
      image: '/api/placeholder/100/100',
      category: 'Wearables'
    },
    {
      id: '3',
      name: 'Organic Green Tea Set',
      price: 34.99,
      stock: 0,
      status: 'out_of_stock',
      sales: 89,
      revenue: 3113.11,
      image: '/api/placeholder/100/100',
      category: 'Beverages'
    },
    {
      id: '4',
      name: 'Professional Camera Lens',
      price: 599.99,
      originalPrice: 799.99,
      stock: 12,
      status: 'active',
      sales: 67,
      revenue: 40199.33,
      image: '/api/placeholder/100/100',
      category: 'Photography'
    }
  ]

  const orders: Order[] = [
    {
      id: '#ORD-001',
      customer: 'John Smith',
      email: 'john@example.com',
      total: 239.97,
      status: 'delivered',
      date: '2026-04-24T14:30:00Z',
      items: 2
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      total: 89.99,
      status: 'shipped',
      date: '2026-04-24T10:15:00Z',
      items: 1
    },
    {
      id: '#ORD-003',
      customer: 'Mike Chen',
      email: 'mike@example.com',
      total: 184.98,
      status: 'processing',
      date: '2026-04-23T16:45:00Z',
      items: 3
    },
    {
      id: '#ORD-004',
      customer: 'Emma Davis',
      email: 'emma@example.com',
      total: 599.99,
      status: 'pending',
      date: '2026-04-23T09:20:00Z',
      items: 1
    }
  ]

  const storeSettings: StoreSettings = {
    name: 'NEXUS Store',
    domain: 'store.nexus.app',
    currency: 'USD',
    taxRate: 8.5,
    shipping: {
      freeThreshold: 100,
      standardRate: 9.99,
      expressRate: 19.99
    },
    paymentMethods: ['stripe', 'paypal', 'apple_pay', 'google_pay']
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0)
  const totalOrders = orders.length
  const totalCustomers = new Set(orders.map(order => order.email)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Online Store</h1>
          <p className="text-gray-600">Manage your e-commerce store, products, and orders.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Store
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Store Settings
          </Button>
        </div>
      </div>

      {/* Store Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <div className="text-sm text-gray-600">Total Customers</div>
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
                  ${(totalRevenue / totalOrders).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Avg. Order Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-600">{order.customer}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString()} • {order.items} items
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${order.total.toFixed(2)}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products
                  .sort((a, b) => b.sales - a.sales)
                  .slice(0, 5)
                  .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{product.sales}</div>
                        <div className="text-gray-600">Sales</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">${product.revenue.toLocaleString()}</div>
                        <div className="text-gray-600">Revenue</div>
                      </div>
                      <div className="text-center">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${product.price}
                            {product.originalPrice && (
                              <span className="text-gray-500 line-through ml-2">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            product.stock === 0 ? 'text-red-600' :
                            product.stock < 20 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {product.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.sales}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
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

        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10 w-64"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-500">{order.items} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Truck className="w-4 h-4" />
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

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{totalCustomers}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((totalOrders / totalCustomers) * 10) / 10}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Orders per Customer</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    ${(totalRevenue / totalCustomers).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Customer Value</div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'John Smith', email: 'john@example.com', orders: 3, totalSpent: 459.95, lastOrder: '2026-04-24' },
                  { name: 'Sarah Johnson', email: 'sarah@example.com', orders: 2, totalSpent: 239.98, lastOrder: '2026-04-24' },
                  { name: 'Mike Chen', email: 'mike@example.com', orders: 1, totalSpent: 89.99, lastOrder: '2026-04-23' },
                  { name: 'Emma Davis', email: 'emma@example.com', orders: 4, totalSpent: 899.96, lastOrder: '2026-04-23' }
                ].map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{customer.orders}</div>
                        <div className="text-gray-600">Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">${customer.totalSpent}</div>
                        <div className="text-gray-600">Total Spent</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{customer.lastOrder}</div>
                        <div className="text-gray-600">Last Order</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">23.4%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingCart className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-gray-600">Daily Orders</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">$2,450</div>
                    <div className="text-sm text-gray-600">Daily Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Store Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Revenue (Last 30 Days)</span>
                    <span className="font-bold">$89,432</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Orders (Last 30 Days)</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span className="font-bold">3.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}