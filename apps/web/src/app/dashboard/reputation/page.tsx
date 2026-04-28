'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Star, MessageSquare, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  RefreshCw, Send, ThumbsUp, ThumbsDown, BarChart3, Users, Globe, Zap,
  Settings, Plus, Filter, Search, Eye, Reply, Flag
} from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function ReputationPage() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('reviews')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [reviewsData, statsData] = await Promise.all([
          apiClient.getReviews(),
          apiClient.getReputationStats()
        ])
        setReviews(reviewsData || [])
        setStats(statsData || null)
      } catch (error) {
        console.error('Error fetching reputation data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return
    try {
      await apiClient.respondToReview(reviewId, responseText)
      setReviews(reviews.map(r =>
        r.id === reviewId
          ? { ...r, status: 'responded', response: responseText, responseDate: new Date().toISOString() }
          : r
      ))
      setSelectedReview(null)
      setResponseText('')
    } catch (error) {
      console.error('Error responding to review:', error)
    }
  }

  const handleRequestReview = async () => {
    const email = prompt('Enter customer email:')
    if (!email) return
    try {
      await apiClient.requestReview({ customer_email: email })
      alert('Review request sent!')
    } catch (error) {
      console.error('Error requesting review:', error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading reputation data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Reputation Management</h1>
          <p className="text-nexus-text-secondary">Monitor and manage your online reputation across platforms.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary" onClick={handleRequestReview}>
            <Send className="w-4 h-4 mr-2 text-nexus-blue" />
            Request Review
          </Button>
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Settings className="w-4 h-4 mr-2 text-nexus-text-secondary" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{stats?.total_reviews || 0}</div>
            <p className="text-xs text-nexus-text-secondary">Across all platforms</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{(stats?.average_rating || 0).toFixed(1)}</div>
            <p className="text-xs text-nexus-text-secondary">Out of 5.0</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{stats?.response_rate || 0}%</div>
            <p className="text-xs text-nexus-text-secondary">Reviews responded to</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Positive Reviews</CardTitle>
            <ThumbsUp className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{stats?.positive_reviews || 0}</div>
            <p className="text-xs text-nexus-text-secondary">Rating 4-5 stars</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nexus-text-tertiary h-4 w-4" />
                    <Input placeholder="Search reviews..." className="pl-10" />
                  </div>
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
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-nexus-text-secondary">No reviews yet. Request reviews from customers to get started.</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-nexus-bg-secondary rounded-full flex items-center justify-center">
                          <span className="font-medium text-nexus-text-primary">
                            {(review.author || 'A').split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-nexus-text-primary">{review.author || 'Anonymous'}</h3>
                            <Badge variant="outline">{review.platform || 'Google'}</Badge>
                            <Badge className={review.status === 'responded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                              {review.status || 'pending'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            {renderStars(review.rating || 0)}
                            <span className="text-sm text-nexus-text-secondary">
                              {new Date(review.created_at || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-nexus-text-primary mb-4">{review.content || 'No content'}</p>

                          {review.response && (
                            <div className="bg-nexus-blue-light border-l-4 border-nexus-blue p-4 rounded">
                              <div className="flex items-center space-x-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-nexus-blue" />
                                <span className="text-sm font-medium text-nexus-text-primary">Your Response</span>
                              </div>
                              <p className="text-nexus-text-primary">{review.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {review.status !== 'responded' && (
                      <div className="flex items-center space-x-2 pt-4 border-t border-nexus-border">
                        <Button variant="outline" onClick={() => setSelectedReview(review.id)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Respond
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Response Modal */}
          {selectedReview && (
            <Card className="border-nexus-blue bg-nexus-blue-light">
              <CardHeader>
                <CardTitle>Respond to Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Response</Label>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write a thoughtful response to this review..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedReview(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleRespond(selectedReview)}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Review Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nexus-text-secondary">Configure which platforms to monitor and alert settings.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Response Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nexus-text-secondary">Create templates for common review responses.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-nexus-text-secondary">View detailed analytics and trends for your reviews.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
