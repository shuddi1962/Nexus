'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api'
import {
  Plus, Play, Pause, Settings, Zap, ArrowRight, CheckCircle,
  AlertTriangle, Clock, Users, Mail, MessageSquare, FileText,
  Database, Webhook, Code, Trash2, Eye
} from 'lucide-react'

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getWorkflows()
        setWorkflows(data || [])
      } catch (error) {
        console.error('Error fetching workflows:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWorkflows()
  }, [])

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) return

    try {
      setIsCreating(true)
      const newWorkflow = await apiClient.createWorkflow({
        name: newWorkflowName,
      })
      setWorkflows([newWorkflow, ...workflows])
      setNewWorkflowName('')
    } catch (error) {
      console.error('Error creating workflow:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return
    try {
      await apiClient.deleteWorkflow(id)
      setWorkflows(workflows.filter(w => w.id !== id))
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  const handleExecuteWorkflow = async (id: string) => {
    try {
      await apiClient.executeWorkflow(id)
      alert('Workflow execution started!')
    } catch (error) {
      console.error('Error executing workflow:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Clock className="w-4 h-4" />
      case 'event':
        return <Zap className="w-4 h-4" />
      case 'webhook':
        return <Webhook className="w-4 h-4" />
      case 'manual':
        return <Play className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-nexus-text-tertiary">Loading workflows...</div>
      </div>
    )
  }

  const filteredWorkflows = activeTab === 'all'
    ? workflows
    : workflows.filter(w => w.status === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Workflows</h1>
          <p className="text-nexus-text-secondary">Automate your business processes with visual workflows.</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-nexus-violet hover:bg-nexus-accent text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'paused', 'draft'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'bg-nexus-violet text-white' : 'border-nexus-border'}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Create Workflow Modal */}
      {isCreating && (
        <Card className="border-nexus-blue bg-nexus-blue-light">
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="workflowName" className="text-sm font-medium text-nexus-text-primary">Workflow Name</label>
              <input
                id="workflowName"
                type="text"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
                className="w-full px-3 py-2 border border-nexus-border rounded-md focus:outline-none focus:ring-2 focus:ring-nexus-blue"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow} disabled={!newWorkflowName.trim()}>
                <Zap className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-nexus-text-tertiary mx-auto mb-4" />
              <p className="text-nexus-text-secondary">No workflows yet. Create your first workflow to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-nexus-violet-light rounded-lg">
                      {getTriggerIcon(workflow.trigger?.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-nexus-text-primary">{workflow.name}</h3>
                      <p className="text-sm text-nexus-text-secondary">{workflow.description || 'No description'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                        <span className="text-xs text-nexus-text-tertiary">
                          {workflow.executions || 0} executions
                        </span>
                        {workflow.successRate && (
                          <span className="text-xs text-nexus-green">
                            {workflow.successRate}% success
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleExecuteWorkflow(workflow.id)}>
                      <Play className="w-4 h-4 text-nexus-green" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 text-nexus-text-secondary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkflow(workflow.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Workflow Steps Preview */}
                {workflow.steps && workflow.steps.length > 0 && (
                  <div className="flex items-center gap-2 pt-4 border-t border-nexus-border">
                    <span className="text-xs text-nexus-text-tertiary">Steps:</span>
                    {workflow.steps.slice(0, 3).map((step: any, index: number) => (
                      <div key={step.id} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {step.type}: {step.name}
                        </Badge>
                        {index < Math.min(workflow.steps.length, 3) - 1 && (
                          <ArrowRight className="w-3 h-3 text-nexus-text-tertiary" />
                        )}
                      </div>
                    ))}
                    {workflow.steps.length > 3 && (
                      <span className="text-xs text-nexus-text-tertiary">+{workflow.steps.length - 3} more</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
