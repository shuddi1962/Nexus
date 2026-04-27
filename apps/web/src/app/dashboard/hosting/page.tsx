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
  Building,
  Globe,
  Shield,
  Zap,
  Settings,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Trash2,
  BarChart3,
  Clock,
  Server,
  Lock,
  Wifi,
  Database,
  Mail
} from 'lucide-react'

interface Domain {
  id: string
  name: string
  status: 'active' | 'pending' | 'expired' | 'error'
  sslStatus: 'valid' | 'expiring' | 'expired' | 'none'
  registrar: string
  expiresAt: string
  autoRenew: boolean
  website?: string
}

interface Hosting {
  id: string
  domain: string
  plan: string
  status: 'active' | 'suspended' | 'pending'
  storage: {
    used: number
    total: number
  }
  bandwidth: {
    used: number
    total: number
  }
  uptime: number
  lastBackup: string
  ssl: boolean
}

interface DNSRecord {
  id: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS'
  name: string
  value: string
  ttl: number
  status: 'active' | 'pending'
}

export default function HostingPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [newDomain, setNewDomain] = useState('')
  const [isSearchingDomain, setIsSearchingDomain] = useState(false)

  // Mock data
  const domains: Domain[] = [
    {
      id: '1',
      name: 'myagency.com',
      status: 'active',
      sslStatus: 'valid',
      registrar: 'Namecheap',
      expiresAt: '2027-04-24T00:00:00Z',
      autoRenew: true,
      website: 'Marketing Agency Site'
    },
    {
      id: '2',
      name: 'mystores.com',
      status: 'active',
      sslStatus: 'valid',
      registrar: 'GoDaddy',
      expiresAt: '2026-08-15T00:00:00Z',
      autoRenew: true,
      website: 'E-commerce Store'
    },
    {
      id: '3',
      name: 'myblog.net',
      status: 'active',
      sslStatus: 'expiring',
      registrar: 'Namecheap',
      expiresAt: '2026-05-10T00:00:00Z',
      autoRenew: false,
      website: 'Personal Blog'
    },
    {
      id: '4',
      name: 'nexus-demo.app',
      status: 'active',
      sslStatus: 'valid',
      registrar: 'Nexus',
      expiresAt: '2026-12-31T00:00:00Z',
      autoRenew: true
    }
  ]

  const hosting: Hosting[] = [
    {
      id: '1',
      domain: 'myagency.com',
      plan: 'Business Pro',
      status: 'active',
      storage: { used: 2.4, total: 10 },
      bandwidth: { used: 45.2, total: 100 },
      uptime: 99.9,
      lastBackup: '2026-04-24T02:00:00Z',
      ssl: true
    },
    {
      id: '2',
      domain: 'mystores.com',
      plan: 'E-commerce Plus',
      status: 'active',
      storage: { used: 8.7, total: 50 },
      bandwidth: { used: 234.1, total: 500 },
      uptime: 99.8,
      lastBackup: '2026-04-24T02:30:00Z',
      ssl: true
    }
  ]

  const dnsRecords: DNSRecord[] = [
    {
      id: '1',
      type: 'A',
      name: '@',
      value: '192.168.1.1',
      ttl: 3600,
      status: 'active'
    },
    {
      id: '2',
      type: 'CNAME',
      name: 'www',
      value: '@',
      ttl: 3600,
      status: 'active'
    },
    {
      id: '3',
      type: 'MX',
      name: '@',
      value: 'mail.myagency.com',
      ttl: 3600,
      status: 'active'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
      case 'error':
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSSLStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800'
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
      case 'none':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDomainSearch = async () => {
    if (!newDomain.trim()) return

    setIsSearchingDomain(true)
    // Simulate API call
    setTimeout(() => {
      setIsSearchingDomain(false)
  
    }, 2000)
  }

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let value = bytes
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024
      unitIndex++
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting & Domains</h1>
          <p className="text-gray-600">Manage your domains, hosting, SSL certificates, and DNS settings.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            SSL Manager
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            DNS Manager
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{domains.length}</div>
                <div className="text-sm text-gray-600">Domains</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Server className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{hosting.length}</div>
                <div className="text-sm text-gray-600">Hosting Plans</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {domains.filter(d => d.sslStatus === 'valid').length}
                </div>
                <div className="text-sm text-gray-600">SSL Certificates</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-sm text-gray-600">Avg. Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="hosting">Hosting</TabsTrigger>
          <TabsTrigger value="dns">DNS</TabsTrigger>
          <TabsTrigger value="ssl">SSL</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          {/* Domain Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Register Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter domain name (e.g., mywebsite.com)"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleDomainSearch} disabled={isSearchingDomain}>
                  {isSearchingDomain ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {isSearchingDomain ? 'Searching...' : 'Search'}
                </Button>
              </div>
              {newDomain && !isSearchingDomain && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-800 font-medium">{newDomain} is available!</span>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm">
                      Register Domain - $12.99/year
                    </Button>
                    <Button variant="outline" size="sm">
                      Transfer Existing Domain
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Domains List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Globe className="w-8 h-8 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{domain.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(domain.status)}>
                            {domain.status}
                          </Badge>
                          <Badge className={getSSLStatusColor(domain.sslStatus)}>
                            SSL: {domain.sslStatus}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Registrar: {domain.registrar}
                          </span>
                        </div>
                        {domain.website && (
                          <p className="text-sm text-gray-600 mt-1">
                            Connected to: {domain.website}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Expires: {new Date(domain.expiresAt).toLocaleDateString()}
                          {domain.autoRenew && (
                            <span className="text-green-600 ml-2">• Auto-renew enabled</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hosting" className="space-y-6">
          {/* Hosting Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hosting.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.domain}</CardTitle>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{plan.plan} Plan</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Storage */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage</span>
                      <span>{plan.storage.used}GB / {plan.storage.total}GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(plan.storage.used / plan.storage.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bandwidth */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bandwidth</span>
                      <span>{plan.bandwidth.used}GB / {plan.bandwidth.total}GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(plan.bandwidth.used / plan.bandwidth.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{plan.uptime}%</div>
                      <div className="text-xs text-gray-600">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold flex items-center justify-center">
                        <Lock className="w-4 h-4 mr-1 text-green-500" />
                        SSL
                      </div>
                      <div className="text-xs text-gray-600">Certificate</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    Last backup: {new Date(plan.lastBackup).toLocaleDateString()}
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Database className="w-4 h-4 mr-2" />
                      Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hosting Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Available Hosting Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Starter',
                    price: '$4.99/mo',
                    features: ['1GB Storage', '10GB Bandwidth', 'Free SSL', 'Basic Support']
                  },
                  {
                    name: 'Professional',
                    price: '$9.99/mo',
                    features: ['10GB Storage', '100GB Bandwidth', 'Free SSL', 'Priority Support', 'Daily Backups']
                  },
                  {
                    name: 'Enterprise',
                    price: '$24.99/mo',
                    features: ['100GB Storage', 'Unlimited Bandwidth', 'Free SSL', '24/7 Support', 'Hourly Backups', 'CDN Included']
                  }
                ].map((plan, index) => (
                  <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full">
                        Choose Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>DNS Records for myagency.com</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dnsRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="grid grid-cols-4 gap-4 flex-1">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.type}</div>
                        <Badge className={getStatusColor(record.status)} className="text-xs">
                          {record.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Name</div>
                        <div className="font-mono text-sm">{record.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Value</div>
                        <div className="font-mono text-sm truncate max-w-48">{record.value}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">TTL</div>
                        <div className="text-sm">{record.ttl}s</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* DNS Health Check */}
          <Card>
            <CardHeader>
              <CardTitle>DNS Health Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">DNS Propagation</div>
                      <div className="text-sm text-gray-600">All records are properly propagated worldwide</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">MX Records</div>
                      <div className="text-sm text-gray-600">Email delivery is properly configured</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">SPF Records</div>
                      <div className="text-sm text-gray-600">SPF record is missing - consider adding for better email deliverability</div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SSL Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Shield className={`w-8 h-8 ${domain.sslStatus === 'valid' ? 'text-green-500' : domain.sslStatus === 'expiring' ? 'text-yellow-500' : 'text-red-500'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{domain.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getSSLStatusColor(domain.sslStatus)}>
                            {domain.sslStatus === 'valid' ? 'Valid' : domain.sslStatus === 'expiring' ? 'Expiring Soon' : 'Expired'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Let's Encrypt
                          </span>
                        </div>
                        {domain.sslStatus === 'expiring' && (
                          <p className="text-sm text-yellow-600 mt-1">
                            Expires in 15 days - will auto-renew
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renew
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SSL Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SSL Certificate Checker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Enter domain to check SSL" />
                  <Button className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Check SSL Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">SSL Certificate Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dv">Domain Validated (DV)</SelectItem>
                      <SelectItem value="ov">Organization Validated (OV)</SelectItem>
                      <SelectItem value="ev">Extended Validation (EV)</SelectItem>
                      <SelectItem value="wildcard">Wildcard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}