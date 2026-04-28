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
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Target,
  Zap,
  Filter,
  Download,
  Plus,
  Eye,
  Star,
  Heart,
  Share2
} from 'lucide-react'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  salesRank: number
  trend: 'up' | 'down' | 'stable'
  growth: number
  competitors: number
  platform: 'amazon' | 'shopify' | 'etsy' | 'ebay'
  image: string
}

interface MarketInsight {
  category: string
  trend: 'growing' | 'declining' | 'stable'
  growthRate: number
  avgPrice: number
  competition: 'low' | 'medium' | 'high'
  opportunity: 'high' | 'medium' | 'low'
}

export default function ProductResearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  // Mock product data
  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      brand: 'AudioTech',
      category: 'Electronics',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviews: 2341,
      salesRank: 125,
      trend: 'up',
      growth: 23.5,
      competitors: 45,
      platform: 'amazon',
      image: '/api/placeholder/100/100'
    },
    {
      id: '2',
      name: 'Smart Fitness Tracker',
      brand: 'FitLife',
      category: 'Wearables',
      price: 149.99,
      rating: 4.2,
      reviews: 1876,
      salesRank: 89,
      trend: 'up',
      growth: 18.7,
      competitors: 32,
      platform: 'amazon',
      image: '/api/placeholder/100/100'
    },
    {
      id: '3',
      name: 'Organic Green Tea Set',
      brand: 'ZenTea',
      category: 'Beverages',
      price: 34.99,
      rating: 4.8,
      reviews: 892,
      salesRank: 456,
      trend: 'stable',
      growth: 2.1,
      competitors: 67,
      platform: 'etsy',
      image: '/api/placeholder/100/100'
    },
    {
      id: '4',
      name: 'Professional Camera Lens',
      brand: 'PhotoPro',
      category: 'Photography',
      price: 599.99,
      originalPrice: 799.99,
      rating: 4.6,
      reviews: 567,
      salesRank: 78,
      trend: 'down',
      growth: -5.2,
      competitors: 23,
      platform: 'amazon',
      image: '/api/placeholder/100/100'
    },
    {
      id: '5',
      name: 'Handmade Leather Wallet',
      brand: 'CraftLeather',
      category: 'Accessories',
      price: 67.99,
      rating: 4.9,
      reviews: 445,
      salesRank: 234,
      trend: 'up',
      growth: 31.4,
      competitors: 89,
      platform: 'etsy',
      image: '/api/placeholder/100/100'
    }
  ]

  const marketInsights: MarketInsight[] = [
    {
      category: 'Wireless Earbuds',
      trend: 'growing',
      growthRate: 28.5,
      avgPrice: 89.99,
      competition: 'high',
      opportunity: 'medium'
    },
    {
      category: 'Smart Watches',
      trend: 'growing',
      growthRate: 35.2,
      avgPrice: 249.99,
      competition: 'high',
      opportunity: 'high'
    },
    {
      category: 'Eco-friendly Products',
      trend: 'growing',
      growthRate: 42.1,
      avgPrice: 45.99,
      competition: 'medium',
      opportunity: 'high'
    },
    {
      category: 'Home Office Equipment',
      trend: 'declining',
      growthRate: -8.3,
      avgPrice: 156.99,
      competition: 'high',
      opportunity: 'low'
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesPlatform = selectedPlatform === 'all' || product.platform === selectedPlatform

    return matchesSearch && matchesCategory && matchesPlatform
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300"></div>
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'amazon':
        return 'bg-orange-100 text-orange-800'
      case 'shopify':
        return 'bg-green-100 text-green-800'
      case 'etsy':
        return 'bg-pink-100 text-pink-800'
      case 'ebay':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'low':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Research</h1>
          <p className="text-gray-600">Discover trending products and market opportunities.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Search className="w-4 h-4 mr-2" />
            New Research
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="wearables">Wearables</SelectItem>
                <SelectItem value="beverages">Beverages</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="shopify">Shopify</SelectItem>
                <SelectItem value="etsy">Etsy</SelectItem>
                <SelectItem value="ebay">eBay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketInsights.map((insight, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-gray-900">{insight.category}</h3>
                {insight.trend === 'growing' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : insight.trend === 'declining' ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <span className={`font-medium ${insight.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {insight.growthRate > 0 ? '+' : ''}{insight.growthRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Price:</span>
                  <span className="font-medium">${insight.avgPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competition:</span>
                  <Badge className={getCompetitionColor(insight.competition)} variant="secondary">
                    {insight.competition}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opportunity:</span>
                  <Badge className={getOpportunityColor(insight.opportunity)} variant="secondary">
                    {insight.opportunity}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.brand}
                        </Badge>
                        <Badge className={`${getPlatformColor(product.platform)} text-xs`} variant="secondary">
                          {product.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {renderStars(product.rating)}
                        <span className="text-xs text-gray-600">({product.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sales Rank:</span>
                      <span className="font-medium">#{product.salesRank}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Trend:</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(product.trend)}
                        <span className={`text-xs font-medium ${
                          product.growth > 0 ? 'text-green-600' : product.growth < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Competitors:</span>
                      <span className="font-medium">{product.competitors}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Target className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Top Growing Categories</h3>
                    <div className="space-y-3">
                      {[
                        { category: 'AI & Machine Learning', growth: 45.2, products: 1234 },
                        { category: 'Sustainable Products', growth: 38.7, products: 987 },
                        { category: 'Remote Work Tools', growth: 31.4, products: 756 },
                        { category: 'Health & Wellness', growth: 28.9, products: 1456 },
                        { category: 'Smart Home Devices', growth: 24.6, products: 892 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{item.category}</div>
                            <div className="text-xs text-gray-600">{item.products} products</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-bold text-green-600">+{item.growth}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Declining Categories</h3>
                    <div className="space-y-3">
                      {[
                        { category: 'Traditional Software', growth: -12.3, products: 543 },
                        { category: 'Physical Media', growth: -18.7, products: 234 },
                        { category: 'Legacy Hardware', growth: -8.9, products: 345 },
                        { category: 'Outdated Gadgets', growth: -15.4, products: 123 },
                        { category: 'Niche Collectibles', growth: -22.1, products: 67 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{item.category}</div>
                            <div className="text-xs text-gray-600">{item.products} products</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="font-bold text-red-600">{item.growth}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: 'AI-Powered Writing Assistant',
                    category: 'Productivity',
                    potential: 'High',
                    competition: 'Medium',
                    estimatedRevenue: 50000,
                    developmentCost: 25000,
                    roi: 200
                  },
                  {
                    title: 'Sustainable Home Cleaning Products',
                    category: 'Eco-friendly',
                    potential: 'High',
                    competition: 'Low',
                    estimatedRevenue: 75000,
                    developmentCost: 15000,
                    roi: 500
                  },
                  {
                    title: 'Remote Team Collaboration Tool',
                    category: 'Business Software',
                    potential: 'Medium',
                    competition: 'High',
                    estimatedRevenue: 30000,
                    developmentCost: 35000,
                    roi: 86
                  },
                  {
                    title: 'Personalized Nutrition Tracker',
                    category: 'Health & Fitness',
                    potential: 'High',
                    competition: 'Medium',
                    estimatedRevenue: 60000,
                    developmentCost: 20000,
                    roi: 300
                  }
                ].map((opportunity, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getOpportunityColor(opportunity.potential.toLowerCase())}>
                          {opportunity.potential} Potential
                        </Badge>
                        <Badge className={getCompetitionColor(opportunity.competition.toLowerCase())}>
                          {opportunity.competition} Competition
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-gray-600">Category</div>
                        <div className="font-medium">{opportunity.category}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Est. Revenue</div>
                        <div className="font-medium text-green-600">${opportunity.estimatedRevenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Development Cost</div>
                        <div className="font-medium text-red-600">${opportunity.developmentCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">ROI</div>
                        <div className="font-medium text-blue-600">{opportunity.roi}%</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Research
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Product
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}