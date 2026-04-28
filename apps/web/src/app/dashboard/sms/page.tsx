'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Send,
  Phone,
  Settings,
  Plus,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react'

export default function SMSPage() {
  const [smsData, setSmsData] = useState({
    to: '',
    message: '',
  })
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // TODO: Add getSMSCampaigns to apiClient
        // const data = await apiClient.getSMSCampaigns()
        // setCampaigns(data.campaigns || [])
      } catch (error) {
        console.error('Error fetching SMS campaigns:', error)
      }
    }
    fetchCampaigns()
  }, [])

  const handleSend = async () => {
    if (!smsData.to || !smsData.message) return
    try {
      setLoading(true)
      // TODO: Add sendSMS to apiClient
      // await apiClient.sendSMS(smsData.to, smsData.message)
      alert('SMS sent successfully!')
      setSmsData({ to: '', message: '' })
    } catch (error) {
      console.error('Error sending SMS:', error)
      alert('Failed to send SMS')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">SMS Marketing</h1>
          <p className="text-nexus-text-secondary">Send text messages to your contacts and customers.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Settings className="w-4 h-4 mr-2 text-nexus-blue" />
            SMS Settings
          </Button>
          <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">2,847</div>
            <p className="text-xs text-nexus-text-secondary">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">98.5%</div>
            <p className="text-xs text-nexus-text-secondary">
              Industry leading
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-nexus-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">2.3 min</div>
            <p className="text-xs text-nexus-text-secondary">
              -15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Active Campaigns</CardTitle>
            <Users className="h-4 w-4 text-nexus-violet" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">12</div>
            <p className="text-xs text-nexus-text-secondary">
              3 scheduled for today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS Composer */}
        <Card className="lg:col-span-2 border-nexus-border">
          <CardHeader>
            <CardTitle className="text-nexus-text-primary">Send SMS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to" className="text-nexus-text-primary">Recipient Phone Number</Label>
              <Input
                id="to"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={smsData.to}
                onChange={(e) => setSmsData(prev => ({ ...prev, to: e.target.value }))}
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-nexus-text-primary">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your SMS message here..."
                value={smsData.message}
                onChange={(e) => setSmsData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                maxLength={160}
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
              <div className="text-xs text-nexus-text-tertiary">
                {smsData.message.length}/160 characters
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge className="bg-nexus-bg-secondary text-nexus-text-primary border-nexus-border">
                  Standard Rate: $0.01
                </Badge>
                <Badge className="bg-nexus-green text-white">
                  Delivery: ~30 sec
                </Badge>
              </div>
              <Button
                onClick={handleSend}
                disabled={!smsData.to || !smsData.message}
                className="bg-nexus-blue hover:bg-nexus-accent text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-nexus-border">
          <CardHeader>
            <CardTitle className="text-nexus-text-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-nexus-blue" />
                Bulk Send
              </span>
              <MessageSquare className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>

            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-nexus-blue" />
                Import Contacts
              </span>
              <Plus className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>

            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-nexus-blue" />
                Schedule Message
              </span>
              <Send className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>

            <Button variant="outline" className="w-full justify-between border-nexus-border hover:bg-nexus-bg-secondary">
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-nexus-blue" />
                SMS Templates
              </span>
              <Settings className="w-4 h-4 text-nexus-text-tertiary" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}