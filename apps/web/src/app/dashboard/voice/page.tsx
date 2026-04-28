'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api'
import {
  Phone, Play, Pause, Settings, Plus, Clock, CheckCircle,
  AlertTriangle, Mic, Volume2, PhoneCall, PhoneIncoming
} from 'lucide-react'

export default function VoicePage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newCall, setNewCall] = useState({ to: '', script: '' })

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getVoiceCalls()
        setCalls(data || [])
      } catch (error) {
        console.error('Error fetching voice calls:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCalls()
  }, [])

  const handleInitiateCall = async () => {
    if (!newCall.to.trim()) return

    try {
      setIsCreating(true)
      await apiClient.initiateCall({
        to: newCall.to,
        script: newCall.script,
      })
      alert('Call initiated successfully!')
      setNewCall({ to: '', script: '' })
    } catch (error) {
      console.error('Error initiating call:', error)
      alert('Failed to initiate call')
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading voice calls...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Voice AI</h1>
          <p className="text-nexus-text-secondary">Manage voice calls and AI-powered phone interactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-nexus-border hover:bg-nexus-bg-secondary">
            <Settings className="w-4 h-4 mr-2 text-nexus-text-secondary" />
            Voice Settings
          </Button>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-nexus-blue hover:bg-nexus-accent text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Initiate Call
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Total Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-nexus-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">{calls.length}</div>
            <p className="text-xs text-nexus-text-secondary">All time</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Active Calls</CardTitle>
            <PhoneIncoming className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">
              {calls.filter(c => c.status === 'in_progress').length}
            </div>
            <p className="text-xs text-nexus-text-secondary">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-nexus-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">0m</div>
            <p className="text-xs text-nexus-text-secondary">Average call time</p>
          </CardContent>
        </Card>

        <Card className="border-nexus-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-primary">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-nexus-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text-primary">0%</div>
            <p className="text-xs text-nexus-text-secondary">Calls completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Initiate Call Modal */}
      {isCreating && (
        <Card className="border-nexus-blue bg-nexus-blue-light">
          <CardHeader>
            <CardTitle>Initiate Voice Call</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">Phone Number</Label>
              <Input
                id="to"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={newCall.to}
                onChange={(e) => setNewCall({ ...newCall, to: e.target.value })}
                className="border-nexus-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="script">Call Script (Optional)</Label>
              <Textarea
                id="script"
                placeholder="Enter the script for the AI to follow..."
                value={newCall.script}
                onChange={(e) => setNewCall({ ...newCall, script: e.target.value })}
                rows={4}
                className="border-nexus-border"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleInitiateCall} disabled={!newCall.to.trim()}>
                <Phone className="w-4 h-4 mr-2" />
                Initiate Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calls List */}
      <div className="space-y-4">
        {calls.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Phone className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <p className="text-nexus-text-secondary">No voice calls yet. Initiate your first call to get started.</p>
            </CardContent>
          </Card>
        ) : (
          calls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      p-2 rounded-lg
                      ${call.status === 'completed' ? 'bg-green-100' : 
                        call.status === 'in_progress' ? 'bg-blue-100' : 
                        call.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'}
                    `}>
                      <Phone className={`
                        w-5 h-5
                        ${call.status === 'completed' ? 'text-green-600' : 
                          call.status === 'in_progress' ? 'text-blue-600' : 
                          call.status === 'failed' ? 'text-red-600' : 'text-gray-600'}
                      `} />
                    </div>
                    <div>
                      <h3 className="font-medium text-nexus-text-primary">{call.to || 'Unknown'}</h3>
                      <p className="text-sm text-nexus-text-secondary">
                        {call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` : 'Duration N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      call.status === 'completed' ? 'bg-green-100 text-green-800' :
                      call.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      call.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {call.status || 'pending'}
                    </Badge>
                    {call.status === 'in_progress' && (
                      <Button variant="ghost" size="sm">
                        <Pause className="w-4 h-4 text-nexus-amber" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
