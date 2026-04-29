'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, Search, Package, Image, Edit2, Trash2, 
  Star, Tag, DollarSign, FileText, ToggleLeft, ToggleRight 
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Product {
  id: string
  name: string
  description?: string
  category?: string
  price?: number
  currency?: string
  specifications?: Record<string, string>
  keywords?: string[]
  featured?: boolean
  new_arrival?: boolean
  in_stock?: boolean
  status: 'active' | 'inactive'
  created_at: string
  images?: ProductImage[]
}

interface ProductImage {
  id: string
  url: string
  alt_text?: string
  is_primary?: boolean
  format?: string
}

interface Service {
  id: string
  name: string
  description?: string
  category?: string
  price?: number
  currency?: string
  duration?: string
  deliverables?: string[]
  status: 'active' | 'inactive'
}

const categoryColors: Record<string, string> = {
  electronics: 'bg-blue-100 text-blue-700',
  clothing: 'bg-purple-100 text-purple-700',
  food: 'bg-green-100 text-green-700',
  health: 'bg-red-100 text-red-700',
  beauty: 'bg-pink-100 text-pink-700',
  sports: 'bg-orange-100 text-orange-700',
  home: 'bg-yellow-100 text-yellow-700',
  other: 'bg-slate-100 text-slate-600',
}

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    currency: 'USD',
    featured: false,
    new_arrival: false,
    in_stock: true,
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'products') {
        const data = await apiClient.getProducts()
        setProducts(data?.products || [])
      } else {
        const data = await apiClient.getServices()
        setServices(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || 0,
        currency: product.currency || 'USD',
        featured: product.featured || false,
        new_arrival: product.new_arrival || false,
        in_stock: product.in_stock !== false,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        currency: 'USD',
        featured: false,
        new_arrival: false,
        in_stock: true,
      })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (activeTab === 'products') {
        if (editingProduct) {
          await apiClient.updateProduct(editingProduct.id, formData)
        } else {
          await apiClient.createProduct(formData)
        }
      } else {
        if (editingProduct) {
          await apiClient.updateService(editingProduct.id, formData)
        } else {
          await apiClient.createService(formData)
        }
      }
      setDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      if (activeTab === 'products') {
        await apiClient.deleteProduct(id)
      } else {
        await apiClient.deleteService(id)
      }
      fetchData()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredServices = services.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products & Services</h1>
          <p className="text-slate-500">Manage your product catalog and service offerings</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add {activeTab === 'products' ? 'Product' : 'Service'}
        </Button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'products'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'services'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Services ({services.length})
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-slate-100 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt_text || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.featured && (
                    <Badge className="bg-amber-500">
                      <Star className="w-3 h-3 mr-1" /> Featured
                    </Badge>
                  )}
                  {product.new_arrival && (
                    <Badge className="bg-green-500">New</Badge>
                  )}
                  {!product.in_stock && (
                    <Badge className="bg-red-500">Out of Stock</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
                    {product.category && (
                      <Badge className={`mt-1 text-xs ${categoryColors[product.category.toLowerCase()] || categoryColors.other}`}>
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(product.price, product.currency)}
                  </div>
                </div>
                {product.description && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{product.description}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(product)} className="flex-1">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)} className="text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                    {service.category && (
                      <Badge className="mt-1 text-xs">{service.category}</Badge>
                    )}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(service.price, service.currency)}
                  </div>
                </div>
                {service.description && (
                  <p className="mt-2 text-sm text-slate-500">{service.description}</p>
                )}
                {service.duration && (
                  <p className="mt-2 text-sm text-slate-400">
                    Duration: {service.duration}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(service as any)} className="flex-1">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)} className="text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(filteredProducts.length === 0 || filteredServices.length === 0) && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No {activeTab} found</p>
          <Button variant="link" onClick={() => handleOpenDialog()}>
            Add your first {activeTab === 'products' ? 'product' : 'service'}
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit' : 'Add'} {activeTab === 'products' ? 'Product' : 'Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={activeTab === 'products' ? 'Product name' : 'Service name'}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description..."
                className="w-full min-h-[80px] p-2 border border-slate-200 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Category"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Price</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
            </div>
            {activeTab === 'products' && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.new_arrival}
                    onChange={(e) => setFormData({ ...formData, new_arrival: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">In Stock</span>
                </label>
              </div>
            )}
            <Button onClick={handleSave} className="w-full">
              {editingProduct ? 'Update' : 'Create'} {activeTab === 'products' ? 'Product' : 'Service'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}