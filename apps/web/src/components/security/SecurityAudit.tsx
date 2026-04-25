'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  FileText,
  Server,
  Globe,
  Database
} from 'lucide-react'

interface SecurityCheck {
  id: string
  name: string
  description: string
  status: 'passed' | 'failed' | 'warning' | 'pending'
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'authentication' | 'authorization' | 'data' | 'network' | 'configuration'
  recommendation?: string
}

interface SecurityMetrics {
  overallScore: number
  criticalIssues: number
  highIssues: number
  mediumIssues: number
  lowIssues: number
  lastAudit: string
}

export function SecurityAuditDashboard() {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([
    {
      id: 'auth-jwt',
      name: 'JWT Token Security',
      description: 'JWT tokens are properly signed and validated',
      status: 'passed',
      severity: 'critical',
      category: 'authentication',
    },
    {
      id: 'auth-password',
      name: 'Password Security',
      description: 'Passwords are hashed with strong algorithms',
      status: 'passed',
      severity: 'high',
      category: 'authentication',
    },
    {
      id: 'auth-rate-limit',
      name: 'Rate Limiting',
      description: 'API endpoints have proper rate limiting',
      status: 'passed',
      severity: 'high',
      category: 'network',
    },
    {
      id: 'data-encryption',
      name: 'Data Encryption',
      description: 'Sensitive data is encrypted at rest and in transit',
      status: 'passed',
      severity: 'critical',
      category: 'data',
    },
    {
      id: 'data-validation',
      name: 'Input Validation',
      description: 'All user inputs are properly validated and sanitized',
      status: 'warning',
      severity: 'medium',
      category: 'data',
      recommendation: 'Implement additional input sanitization for rich text fields',
    },
    {
      id: 'network-https',
      name: 'HTTPS Enforcement',
      description: 'All connections use HTTPS with valid certificates',
      status: 'passed',
      severity: 'critical',
      category: 'network',
    },
    {
      id: 'network-cors',
      name: 'CORS Configuration',
      description: 'CORS headers are properly configured',
      status: 'passed',
      severity: 'medium',
      category: 'network',
    },
    {
      id: 'config-secrets',
      name: 'Secret Management',
      description: 'API keys and secrets are properly managed',
      status: 'passed',
      severity: 'critical',
      category: 'configuration',
    },
    {
      id: 'auth-session',
      name: 'Session Security',
      description: 'Session management is secure',
      status: 'warning',
      severity: 'high',
      category: 'authentication',
      recommendation: 'Implement session rotation and absolute timeouts',
    },
    {
      id: 'data-backup',
      name: 'Data Backup Security',
      description: 'Backups are encrypted and access-controlled',
      status: 'passed',
      severity: 'medium',
      category: 'data',
    },
  ])

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    overallScore: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    lastAudit: new Date().toISOString(),
  })

  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Calculate security metrics
    const criticalIssues = securityChecks.filter(check => check.status === 'failed' && check.severity === 'critical').length
    const highIssues = securityChecks.filter(check => check.status === 'failed' && check.severity === 'high').length +
                      securityChecks.filter(check => check.status === 'warning' && check.severity === 'high').length
    const mediumIssues = securityChecks.filter(check => check.status === 'failed' && check.severity === 'medium').length +
                        securityChecks.filter(check => check.status === 'warning' && check.severity === 'medium').length
    const lowIssues = securityChecks.filter(check => check.status === 'failed' && check.severity === 'low').length +
                     securityChecks.filter(check => check.status === 'warning' && check.severity === 'low').length

    const totalIssues = criticalIssues + highIssues + mediumIssues + lowIssues
    const passedChecks = securityChecks.filter(check => check.status === 'passed').length
    const overallScore = Math.round((passedChecks / securityChecks.length) * 100)

    setMetrics({
      overallScore,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      lastAudit: new Date().toISOString(),
    })
  }, [securityChecks])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Lock className="w-4 h-4" />
      case 'authorization':
        return <Shield className="w-4 h-4" />
      case 'data':
        return <Database className="w-4 h-4" />
      case 'network':
        return <Globe className="w-4 h-4" />
      case 'configuration':
        return <Settings className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const runSecurityAudit = () => {
    // Simulate running a security audit
    setSecurityChecks(prev =>
      prev.map(check => ({
        ...check,
        status: Math.random() > 0.8 ? 'warning' : 'passed'
      }))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Audit</h1>
          <p className="text-gray-600">Comprehensive security assessment and hardening.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button onClick={runSecurityAudit}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Security Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{metrics.overallScore}%</div>
                <div className="text-sm text-gray-600">Security Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{metrics.criticalIssues}</div>
                <div className="text-sm text-gray-600">Critical Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{metrics.highIssues}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {securityChecks.filter(check => check.status === 'passed').length}
                </div>
                <div className="text-sm text-gray-600">Passed Checks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Score Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Security Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Security Score</span>
              <span className="text-lg font-bold">{metrics.overallScore}%</span>
            </div>
            <Progress value={metrics.overallScore} className="h-3" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${metrics.criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.criticalIssues}
                </div>
                <div className="text-xs text-gray-600">Critical</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${metrics.highIssues > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {metrics.highIssues}
                </div>
                <div className="text-xs text-gray-600">High</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${metrics.mediumIssues > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {metrics.mediumIssues}
                </div>
                <div className="text-xs text-gray-600">Medium</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${metrics.lowIssues > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                  {metrics.lowIssues}
                </div>
                <div className="text-xs text-gray-600">Low</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Security Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityChecks.map((check) => (
              <div key={check.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(check.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{check.name}</h3>
                    <Badge className={getSeverityColor(check.severity)}>
                      {check.severity}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      {getCategoryIcon(check.category)}
                      <span className="capitalize">{check.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                  {check.recommendation && showDetails && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Recommendation:</strong> {check.recommendation}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Button variant="outline" size="sm">
                    Fix
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Implement Multi-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Add MFA for all admin accounts to prevent unauthorized access.
                </p>
                <Button size="sm">Implement MFA</Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Regular Security Audits</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Schedule automated security audits and vulnerability scans.
                </p>
                <Button size="sm">Schedule Audits</Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">API Rate Limiting</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Implement advanced rate limiting for API endpoints.
                </p>
                <Button size="sm">Configure Limits</Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Security Headers</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Add comprehensive security headers to all responses.
                </p>
                <Button size="sm">Add Headers</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Security middleware component
export function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Implement Content Security Policy
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta')
      meta.httpEquiv = 'Content-Security-Policy'
      meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
      document.head.appendChild(meta)
    }
  }, [])

  return <>{children}</>
}