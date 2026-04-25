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
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Calculator,
  Sliders,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface BudgetOptimization {
  recommendations: Array<{
    campaign: string
    current_budget: number
    recommended_budget: number
    change_percentage: number
    reason: string
    expected_additional_revenue: number
    confidence_level: number
  }>
  expected_outcomes: {
    total_budget_change: number
    expected_revenue_increase: number
    expected_roas_improvement: number
    projected_payback_period: number
  }
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high'
    risk_factors: string[]
    mitigation_strategies: string[]
  }
}

interface CampaignBudget {
  id: string
  name: string
  platform: string
  current_budget: number
  daily_spend: number
  projected_monthly_spend: number
  performance_score: number
  roas: number
  status: 'active' | 'paused' | 'draft'
  last_optimized: string
  optimization_suggestions: string[]
}

export default function BudgetOptimizationPage() {
  const { user } = useAuth()
  const [optimizationData, setOptimizationData] = useState<BudgetOptimization | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignBudget[]>([])
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [budgetInputs, setBudgetInputs] = useState<{ [key: string]: string }>({})
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false)
  const [currentBudget, setCurrentBudget] = useState(50000)
  const [targetRoas, setTargetRoas] = useState(3.5)
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    fetchBudgetData()
  }, [])

  useEffect(() => {
    if (campaigns.length > 0) {
      // Initialize budget inputs with current values
      const inputs: { [key: string]: string } = {}
      campaigns.forEach(campaign => {
        inputs[campaign.id] = campaign.current_budget.toString()
      })
      setBudgetInputs(inputs)
    }
  }, [campaigns])

  const fetchBudgetData = async () => {
    try {
      setLoading(true)

      // Mock campaign data - would integrate with actual API
      setCampaigns([
        {
          id: '1',
          name: 'Meta - Brand Awareness Q2',
          platform: 'Meta',
          current_budget: 5000,
          daily_spend: 167,
          projected_monthly_spend: 5000,
          performance_score: 85,
          roas: 4.2,
          status: 'active',
          last_optimized: '2026-04-20T10:00:00Z',
          optimization_suggestions: [
            'Increase budget by 20% - high ROAS performer',
            'Consider expanding audience reach',
            'Test new creative variations'
          ]
        },
        {
          id: '2',
          name: 'Google - Search Campaign',
          platform: 'Google',
          current_budget: 3000,
          daily_spend: 100,
          projected_monthly_spend: 3000,
          performance_score: 78,
          roas: 3.8,
          status: 'active',
          last_optimized: '2026-04-19T14:30:00Z',
          optimization_suggestions: [
            'Optimize for branded keywords',
            'Consider increasing CPC bid for top performers',
            'Expand negative keyword list'
          ]
        },
        {
          id: '3',
          name: 'TikTok - Product Demo',
          platform: 'TikTok',
          current_budget: 2000,
          daily_spend: 67,
          projected_monthly_spend: 2000,
          performance_score: 65,
          roas: 2.1,
          status: 'active',
          last_optimized: '2026-04-18T09:15:00Z',
          optimization_suggestions: [
            'Review creative performance',
            'Consider pausing underperforming ads',
            'Test different audience targeting'
          ]
        },
        {
          id: '4',
          name: 'LinkedIn - B2B Lead Gen',
          platform: 'LinkedIn',
          current_budget: 1500,
          daily_spend: 50,
          projected_monthly_spend: 1500,
          performance_score: 72,
          roas: 3.2,
          status: 'paused',
          last_optimized: '2026-04-15T16:45:00Z',
          optimization_suggestions: [
            'Resume with optimized targeting',
            'Focus on decision-maker job titles',
            'Consider account-based marketing approach'
          ]
        }
      ])

      // Fetch optimization recommendations
      await fetchOptimizationRecommendations()
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOptimizationRecommendations = async () => {
    try {
      const data = await apiClient.getBudgetOptimizationReport({
        current_budget: currentBudget,
        target_roas: targetRoas,
        risk_tolerance: riskTolerance
      })
      setOptimizationData(data)
    } catch (error) {
      console.error('Error fetching optimization recommendations:', error)
      // Fallback to mock data
      setOptimizationData({
        recommendations: [
          {
            campaign: 'Meta - Brand Awareness Q2',
            current_budget: 5000,
            recommended_budget: 6000,
            change_percentage: 20,
            reason: 'Highest ROAS (4.2x) with room for growth',
            expected_additional_revenue: 4200,
            confidence_level: 0.88
          },
          {
            campaign: 'Google - Search Campaign',
            current_budget: 3000,
            recommended_budget: 3600,
            change_percentage: 20,
            reason: 'Strong performance on branded keywords',
            expected_additional_revenue: 2280,
            confidence_level: 0.82
          },
          {
            campaign: 'TikTok - Product Demo',
            current_budget: 2000,
            recommended_budget: 1200,
            change_percentage: -40,
            reason: 'Lower ROAS (2.1x) compared to other channels',
            expected_additional_revenue: -800,
            confidence_level: 0.91
          }
        ],
        expected_outcomes: {
          total_budget_change: 800,
          expected_revenue_increase: 5680,
          expected_roas_improvement: 0.3,
          projected_payback_period: 16
        },
        risk_assessment: {
          risk_level: 'medium',
          risk_factors: [
            'Market seasonality may affect performance',
            'Competitor activity could impact CPC',
            'Creative fatigue may reduce CTR over time'
          ],
          mitigation_strategies: [
            'Monitor performance weekly and adjust as needed',
            'Set up automated rules for budget reallocation',
            'Prepare backup creatives for testing'
          ]
        }
      })
    }
  }

  const handleOptimizeBudgets = async () => {
    try {
      setOptimizing(true)

      // Apply optimization recommendations
      const updates = optimizationData?.recommendations.map(rec => ({
        campaign: rec.campaign,
        new_budget: rec.recommended_budget,
        reason: rec.reason
      }))

      // In a real implementation, this would call the API
      console.log('Applying budget optimizations:', updates)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update local state
      setCampaigns(campaigns.map(campaign => {
        const recommendation = optimizationData?.recommendations.find(r => r.campaign === campaign.name)
        if (recommendation) {
          return {
            ...campaign,
            current_budget: recommendation.recommended_budget,
            last_optimized: new Date().toISOString()
          }
        }
        return campaign
      }))

      setShowOptimizationDialog(false)
      await fetchBudgetData() // Refresh data
    } catch (error) {
      console.error('Error optimizing budgets:', error)
    } finally {
      setOptimizing(false)
    }
  }

  const handleManualBudgetUpdate = async (campaignId: string) => {
    try {
      const newBudget = parseFloat(budgetInputs[campaignId])
      if (isNaN(newBudget) || newBudget < 0) {
        alert('Please enter a valid budget amount')
        return
      }

      // In a real implementation, this would call the API
      console.log(`Updating budget for campaign ${campaignId} to $${newBudget}`)

      // Update local state
      setCampaigns(campaigns.map(campaign =>
        campaign.id === campaignId
          ? { ...campaign, current_budget: newBudget, last_optimized: new Date().toISOString() }
          : campaign
      ))
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Meta':
        return '📘'
      case 'Google':
        return '🔍'
      case 'TikTok':
        return '🎵'
      case 'LinkedIn':
        return '💼'
      default:
        return '📢'
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-nexus-green'
    if (score >= 60) return 'text-nexus-amber'
    return 'text-nexus-red'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-nexus-green text-white'
      case 'medium':
        return 'bg-nexus-amber text-white'
      case 'high':
        return 'bg-nexus-red text-white'
      default:
        return 'bg-nexus-text-tertiary text-white'
    }
  }

  const totalCurrentBudget = campaigns.reduce((sum, c) => sum + c.current_budget, 0)
  const totalProjectedSpend = campaigns.reduce((sum, c) => sum + c.projected_monthly_spend, 0)
  const averageRoas = campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexus-text-primary">Budget Optimization</h1>
            <p className="text-nexus-text-secondary">Loading budget data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">Budget Optimization</h1>
          <p className="text-nexus-text-secondary">AI-powered budget recommendations and optimization tools</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchBudgetData}
            disabled={loading}
            className="border-nexus-border hover:bg-nexus-bg-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
            <DialogTrigger asChild>
              <Button className="bg-nexus-blue hover:bg-nexus-accent text-white">
                <Zap className="w-4 h-4 mr-2" />
                Auto Optimize
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-nexus-text-primary">AI Budget Optimization</DialogTitle>
              </DialogHeader>
              <OptimizationDialog
                data={optimizationData}
                onConfirm={handleOptimizeBudgets}
                loading={optimizing}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-nexus-blue mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {formatCurrency(totalCurrentBudget)}
                </div>
                <div className="text-sm text-nexus-text-secondary">Total Budget</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-nexus-green mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {formatCurrency(totalProjectedSpend)}
                </div>
                <div className="text-sm text-nexus-text-secondary">Projected Monthly Spend</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-nexus-violet mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {averageRoas.toFixed(1)}x
                </div>
                <div className="text-sm text-nexus-text-secondary">Average ROAS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-nexus-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-nexus-amber mr-3" />
              <div>
                <div className="text-2xl font-bold text-nexus-text-primary">
                  {campaigns.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-nexus-text-secondary">Active Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Settings */}
      <Card className="border-nexus-border">
        <CardHeader>
          <CardTitle className="text-nexus-text-primary flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Optimization Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-nexus-text-primary">Current Total Budget</Label>
              <Input
                type="number"
                value={currentBudget}
                onChange={(e) => setCurrentBudget(Number(e.target.value))}
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-nexus-text-primary">Target ROAS</Label>
              <Input
                type="number"
                step="0.1"
                value={targetRoas}
                onChange={(e) => setTargetRoas(Number(e.target.value))}
                className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-nexus-text-primary">Risk Tolerance</Label>
              <Select value={riskTolerance} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskTolerance(value)}>
                <SelectTrigger className="border-nexus-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Conservative</SelectItem>
                  <SelectItem value="medium">Balanced</SelectItem>
                  <SelectItem value="high">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={fetchOptimizationRecommendations}
              variant="outline"
              className="border-nexus-border hover:bg-nexus-bg-secondary"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Recalculate Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaign Budgets</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="insights">Performance Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Budget Management */}
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Campaign Budget Management</CardTitle>
              <p className="text-sm text-nexus-text-secondary">Adjust individual campaign budgets manually</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border border-nexus-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getPlatformIcon(campaign.platform)}</div>
                      <div>
                        <h3 className="font-medium text-nexus-text-primary">{campaign.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-nexus-text-secondary">
                          <span>Daily: {formatCurrency(campaign.daily_spend)}</span>
                          <span>ROAS: {campaign.roas}x</span>
                          <span className={`font-medium ${getPerformanceColor(campaign.performance_score)}`}>
                            Score: {campaign.performance_score}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-nexus-text-secondary">Current Budget</div>
                        <div className="font-semibold text-nexus-text-primary">
                          {formatCurrency(campaign.current_budget)}
                        </div>
                      </div>

                      <div className="w-32">
                        <Input
                          type="number"
                          value={budgetInputs[campaign.id] || ''}
                          onChange={(e) => setBudgetInputs(prev => ({ ...prev, [campaign.id]: e.target.value }))}
                          placeholder="New budget"
                          className="border-nexus-border focus:ring-nexus-blue focus:border-nexus-blue"
                        />
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleManualBudgetUpdate(campaign.id)}
                        className="bg-nexus-blue hover:bg-nexus-accent text-white"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* AI Recommendations */}
          {optimizationData && (
            <>
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    AI Budget Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationData.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border border-nexus-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-nexus-text-primary">{rec.campaign}</h3>
                          <div className="flex items-center space-x-2">
                            {rec.change_percentage > 0 ? (
                              <ArrowUp className="w-4 h-4 text-nexus-green" />
                            ) : rec.change_percentage < 0 ? (
                              <ArrowDown className="w-4 h-4 text-nexus-red" />
                            ) : (
                              <Minus className="w-4 h-4 text-nexus-text-tertiary" />
                            )}
                            <Badge className={
                              rec.change_percentage > 0 ? 'bg-nexus-green text-white' :
                              rec.change_percentage < 0 ? 'bg-nexus-red text-white' :
                              'bg-nexus-text-tertiary text-white'
                            }>
                              {rec.change_percentage > 0 ? '+' : ''}{rec.change_percentage}%
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-nexus-text-secondary">Current</div>
                            <div className="font-semibold text-nexus-text-primary">
                              {formatCurrency(rec.current_budget)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-nexus-text-secondary">Recommended</div>
                            <div className="font-semibold text-nexus-blue">
                              {formatCurrency(rec.recommended_budget)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-nexus-text-secondary">Expected Revenue</div>
                            <div className="font-semibold text-nexus-green">
                              {rec.expected_additional_revenue > 0 ? '+' : ''}{formatCurrency(rec.expected_additional_revenue)}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-nexus-text-secondary mb-2">{rec.reason}</p>

                        <div className="flex items-center text-sm">
                          <span className="text-nexus-text-secondary mr-2">Confidence:</span>
                          <Progress value={rec.confidence_level * 100} className="flex-1 h-2" />
                          <span className="ml-2 text-nexus-text-primary">
                            {(rec.confidence_level * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Expected Outcomes */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Expected Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nexus-text-primary">
                        {optimizationData.expected_outcomes.total_budget_change > 0 ? '+' : ''}
                        {formatCurrency(optimizationData.expected_outcomes.total_budget_change)}
                      </div>
                      <div className="text-sm text-nexus-text-secondary">Budget Change</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nexus-green">
                        +{formatCurrency(optimizationData.expected_outcomes.expected_revenue_increase)}
                      </div>
                      <div className="text-sm text-nexus-text-secondary">Revenue Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nexus-blue">
                        +{optimizationData.expected_outcomes.expected_roas_improvement.toFixed(1)}x
                      </div>
                      <div className="text-sm text-nexus-text-secondary">ROAS Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nexus-violet">
                        {optimizationData.expected_outcomes.projected_payback_period} days
                      </div>
                      <div className="text-sm text-nexus-text-secondary">Payback Period</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="border-nexus-border">
                <CardHeader>
                  <CardTitle className="text-nexus-text-primary flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge className={getRiskColor(optimizationData.risk_assessment.risk_level)}>
                      {optimizationData.risk_assessment.risk_level.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-nexus-text-primary mb-2">Risk Factors</h4>
                      <ul className="space-y-1">
                        {optimizationData.risk_assessment.risk_factors.map((factor, index) => (
                          <li key={index} className="text-sm text-nexus-text-secondary flex items-start">
                            <AlertTriangle className="w-4 h-4 text-nexus-amber mr-2 mt-0.5 flex-shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-nexus-text-primary mb-2">Mitigation Strategies</h4>
                      <ul className="space-y-1">
                        {optimizationData.risk_assessment.mitigation_strategies.map((strategy, index) => (
                          <li key={index} className="text-sm text-nexus-text-secondary flex items-start">
                            <CheckCircle className="w-4 h-4 text-nexus-green mr-2 mt-0.5 flex-shrink-0" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Performance Insights */}
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Budget Allocation Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPlatformIcon(campaign.platform)}</span>
                        <span className="font-medium text-nexus-text-primary">{campaign.name}</span>
                      </div>
                      <div className="text-sm text-nexus-text-secondary">
                        {formatCurrency(campaign.current_budget)} ({((campaign.current_budget / totalCurrentBudget) * 100).toFixed(1)}%)
                      </div>
                    </div>
                    <Progress
                      value={(campaign.current_budget / totalCurrentBudget) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-nexus-text-secondary">
                      <span>ROAS: {campaign.roas}x</span>
                      <span>Performance Score: {campaign.performance_score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Suggestions */}
          <Card className="border-nexus-border">
            <CardHeader>
              <CardTitle className="text-nexus-text-primary">Campaign-Specific Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 border border-nexus-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg">{getPlatformIcon(campaign.platform)}</span>
                      <h3 className="font-medium text-nexus-text-primary">{campaign.name}</h3>
                      <Badge className={
                        campaign.status === 'active' ? 'bg-nexus-green text-white' :
                        campaign.status === 'paused' ? 'bg-nexus-amber text-white' :
                        'bg-nexus-text-tertiary text-white'
                      }>
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {campaign.optimization_suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-nexus-amber mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-nexus-text-secondary">{suggestion}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-nexus-border">
                      <div className="text-xs text-nexus-text-tertiary">
                        Last optimized: {new Date(campaign.last_optimized).toLocaleDateString()}
                      </div>
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

function OptimizationDialog({
  data,
  onConfirm,
  loading
}: {
  data: BudgetOptimization | null
  onConfirm: () => void
  loading: boolean
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Zap className="w-12 h-12 text-nexus-blue mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
          Apply AI Budget Optimization
        </h3>
        <p className="text-nexus-text-secondary">
          This will automatically adjust your campaign budgets based on AI recommendations.
          Review the changes below before confirming.
        </p>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {data.recommendations.map((rec, index) => (
          <div key={index} className="p-3 bg-nexus-bg-secondary rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-nexus-text-primary text-sm">{rec.campaign}</span>
              <Badge className={
                rec.change_percentage > 0 ? 'bg-nexus-green text-white' :
                rec.change_percentage < 0 ? 'bg-nexus-red text-white' :
                'bg-nexus-text-tertiary text-white'
              }>
                {rec.change_percentage > 0 ? '+' : ''}{rec.change_percentage}%
              </Badge>
            </div>
            <div className="text-sm text-nexus-text-secondary">
              {formatCurrency(rec.current_budget)} → {formatCurrency(rec.recommended_budget)}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-nexus-blue/10 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-nexus-text-primary">
              {data.expected_outcomes.total_budget_change > 0 ? '+' : ''}
              {formatCurrency(data.expected_outcomes.total_budget_change)}
            </div>
            <div className="text-sm text-nexus-text-secondary">Budget Change</div>
          </div>
          <div>
            <div className="text-lg font-bold text-nexus-green">
              +{formatCurrency(data.expected_outcomes.expected_revenue_increase)}
            </div>
            <div className="text-sm text-nexus-text-secondary">Expected Revenue</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          className="border-nexus-border hover:bg-nexus-bg-secondary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          className="bg-nexus-blue hover:bg-nexus-accent text-white"
        >
          {loading ? 'Applying...' : 'Apply Optimization'}
        </Button>
      </div>
    </div>
  )
}