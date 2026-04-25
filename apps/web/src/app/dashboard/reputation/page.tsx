'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Send,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Users,
  Globe,
  Zap,
  Settings,
  Plus,
  Filter,
  Search,
  Eye,
  Reply,
  Flag
} from 'lucide-react'

interface Review {
  id: string
  platform: string
  author: string
  rating: number
  content: string
  date: string
  status: 'pending' | 'responded' | 'ignored'
  sentiment: 'positive' | 'neutral' | 'negative'
  response?: string
  responseDate?: string
}

interface ReputationMetric {
  platform: string
  rating: number
  reviews: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface Alert {
  id: string
  type: 'negative_review' | 'rating_drop' | 'competitor_mention'
  severity: 'high' | 'medium' | 'low'
  message: string
  platform: string
  date: string
  resolved: boolean
}

export default function ReputationPage() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  // Mock data
  const reviews: Review[] = [
    {
      id: '1',
      platform: 'Google',
      author: 'Sarah Johnson',
      rating: 5,
      content: 'Absolutely love the NEXUS platform! The automation features have saved us hours every week. Customer support is excellent too.',
      date: '2026-04-24T10:30:00Z',
      status: 'responded',
      sentiment: 'positive',
      response: 'Thank you so much for the kind words, Sarah! We\'re thrilled to hear that NEXUS is helping streamline your workflow. Our team is always here to help!',
      responseDate: '2026-04-24T11:15:00Z'
    },
    {
      id: '2',
      platform: 'Trustpilot',
      author: 'Mike Chen',
      rating: 4,
      content: 'Great platform overall, but the initial setup could be simpler. Once you get going, it\'s fantastic.',
      date: '2026-04-23T14:20:00Z',
      status: 'pending',
      sentiment: 'neutral'
    },
    {
      id: '3',
      platform: 'Capterra',
      author: 'Lisa Wong',
      rating: 2,
      content: 'Pricing is too high for what you get. Customer support takes too long to respond.',
      date: '2026-04-22T09:45:00Z',
      status: 'pending',
      sentiment: 'negative'
    },
    {
      id: '4',
      platform: 'G2',
      author: 'John Smith',
      rating: 5,
      content: 'Best investment we\'ve made this year. The AI features are game-changing!',
      date: '2026-04-21T16:30:00Z',
      status: 'responded',
      sentiment: 'positive',
      response: 'Thank you for the amazing review, John! We\'re so glad you\'re finding value in our AI features. Keep the feedback coming!',
      responseDate: '2026-04-21T17:00:00Z'
    }
  ]

  const reputationMetrics: ReputationMetric[] = [
    { platform: 'Google', rating: 4.8, reviews: 1247, trend: 'up', change: 0.2 },
    { platform: 'Trustpilot', rating: 4.6, reviews: 892, trend: 'stable', change: 0 },
    { platform: 'Capterra', rating: 4.4, reviews: 567, trend: 'down', change: -0.1 },
    { platform: 'G2', rating: 4.7, reviews: 743, trend: 'up', change: 0.3 }
  ]

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'negative_review',
      severity: 'high',
      message: 'New 2-star review on Capterra mentioning pricing concerns',
      platform: 'Capterra',
      date: '2026-04-22T09:45:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'rating_drop',
      severity: 'medium',
      message: 'Capterra rating dropped by 0.1 points this week',
      platform: 'Capterra',
      date: '2026-04-20T00:00:00Z',
      resolved: false
    },
    {
      id: '3',
      type: 'competitor_mention',
      severity: 'low',
      message: 'User mentioned competitor in positive context',
      platform: 'G2',
      date: '2026-04-19T12:30:00Z',
      resolved: true
    }
  ]

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'ignored':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
    }
  }

  const handleSendResponse = (reviewId: string) => {
    if (!responseText.trim()) return

    // In real app, this would send the response
    console.log('Sending response for review:', reviewId, responseText)
    setResponseText('')
    setSelectedReview(null)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review & Reputation Management</h1>
          <p className="text-gray-600">Monitor reviews, manage reputation, and respond to customer feedback across all platforms.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Platform
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.filter(a => !a.resolved).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Active Alerts ({alerts.filter(a => !a.resolved).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.filter(a => !a.resolved).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">
                        {alert.platform} • {new Date(alert.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reputation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reputationMetrics.map((metric) => (
          <Card key={metric.platform}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-900">{metric.platform}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-2xl font-bold">{metric.rating}</div>
                <div className="flex">{renderStars(Math.round(metric.rating))}</div>
              </div>
              <div className="text-sm text-gray-600">
                {metric.reviews} reviews
                {metric.change !== 0 && (
                  <span className={`ml-2 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({metric.change > 0 ? '+' : ''}{metric.change})
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="responses">Response Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {/* Review Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input placeholder="Search reviews..." className="max-w-sm" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="trustpilot">Trustpilot</SelectItem>
                    <SelectItem value="capterra">Capterra</SelectItem>
                    <SelectItem value="g2">G2</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="ignored">Ignored</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {review.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{review.author}</h3>
                          <Badge variant="outline">{review.platform}</Badge>
                          <Badge className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                          <Badge className={getSentimentColor(review.sentiment)}>
                            {review.sentiment}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{review.content}</p>

                        {review.response && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Your Response</span>
                              <span className="text-xs text-blue-600">
                                {new Date(review.responseDate!).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-blue-700">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {review.status === 'pending' && (
                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedReview(review.id)}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                      <Button variant="outline">
                        <Flag className="w-4 h-4 mr-2" />
                        Flag for Review
                      </Button>
                      <Button variant="outline">
                        Ignore
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Response Modal */}
          {selectedReview && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Respond to Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">John Smith</span>
                    <Badge variant="outline">Google</Badge>
                    <div className="flex">{renderStars(4)}</div>
                  </div>
                  <p className="text-gray-700">
                    Great platform overall, but the initial setup could be simpler. Once you get going, it's fantastic.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Your Response</Label>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write a thoughtful response to this review..."
                    rows={4}
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{responseText.length} characters</span>
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedReview(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSendResponse(selectedReview)}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Monitored Platforms</h3>
                  <div className="space-y-2">
                    {['Google', 'Trustpilot', 'Capterra', 'G2', 'App Store', 'Play Store'].map((platform) => (
                      <div key={platform} className="flex items-center justify-between">
                        <span>{platform}</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Alert Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Negative reviews (1-2 stars)</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rating drops</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Competitor mentions</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Review spikes</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Auto-Response Settings</Label>
                <Select defaultValue="manual">
                  <SelectTrigger className="max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual responses only</SelectItem>
                    <SelectItem value="auto-positive">Auto-respond to positive reviews</SelectItem>
                    <SelectItem value="auto-all">Auto-respond to all reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Thank You Template',
                    category: 'Positive',
                    content: 'Thank you for your wonderful review! We\'re thrilled to hear you\'re enjoying [Product/Service]. Your feedback helps us improve and serve you better.',
                    usage: 45
                  },
                  {
                    name: 'Apology Template',
                    category: 'Negative',
                    content: 'We\'re sorry to hear about your experience with [Product/Service]. We take this feedback seriously and would like to make this right. Please contact our support team at [contact] so we can assist you directly.',
                    usage: 23
                  },
                  {
                    name: 'Feature Request',
                    category: 'Neutral',
                    content: 'Thank you for your suggestion about [feature]. We\'re always looking to improve our platform. Your input helps us prioritize our development roadmap.',
                    usage: 12
                  }
                ].map((template, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <span className="text-sm text-gray-600">Used {template.usage} times</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{template.content}</p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
                  <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">2,449</div>
                    <div className="text-sm text-gray-600">Total Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ThumbsUp className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">87%</div>
                    <div className="text-sm text-gray-600">Positive Sentiment</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">4.6</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Review Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Rate</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time (Avg)</span>
                    <span>2.3 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rating Improvement</span>
                    <span>+0.3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
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