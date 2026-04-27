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
  Palette,
  Upload,
  Eye,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Globe,
  Mail,
  Smartphone,
  Monitor,
  FileText,
  Image,
  Settings,
  Shield,
  Users
} from 'lucide-react'

interface BrandingConfig {
  companyName: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  customDomain: string
  supportEmail: string
  supportPhone: string
  privacyPolicy: string
  termsOfService: string
  socialLinks: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
}

export default function WhiteLabelPage() {
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: 'Acme Corp',
    logo: '',
    favicon: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    accentColor: '#10B981',
    fontFamily: 'Inter',
    customDomain: 'app.acmecorp.com',
    supportEmail: 'support@acmecorp.com',
    supportPhone: '+1 (555) 123-4567',
    privacyPolicy: '',
    termsOfService: '',
    socialLinks: {
      twitter: 'https://twitter.com/acmecorp',
      linkedin: 'https://linkedin.com/company/acmecorp',
      facebook: 'https://facebook.com/acmecorp',
      instagram: 'https://instagram.com/acmecorp'
    }
  })

  const [previewMode, setPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)

  }

  const updateConfig = (key: keyof BrandingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const updateSocialLink = (platform: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">White-label Configuration</h1>
          <p className="text-gray-600">Customize the platform branding and appearance for your clients.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">Active</div>
                <div className="text-sm text-gray-600">White-label Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-gray-600">Custom Domain</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">247</div>
                <div className="text-sm text-gray-600">Client Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={config.companyName}
                    onChange={(e) => updateConfig('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select value={config.fontFamily} onValueChange={(value) => updateConfig('fontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Instrument Sans">Instrument Sans</SelectItem>
                      <SelectItem value="Fraunces">Fraunces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo and Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Logo & Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Company Logo</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        {config.logo ? (
                          <div className="space-y-4">
                            <img src={config.logo} alt="Logo" className="max-w-32 max-h-16 mx-auto" />
                            <Button variant="outline" size="sm">
                              Change Logo
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Upload company logo</p>
                              <p className="text-xs text-gray-600">PNG, JPG up to 2MB</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Choose File
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Favicon</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {config.favicon ? (
                          <div className="space-y-2">
                            <img src={config.favicon} alt="Favicon" className="w-8 h-8 mx-auto" />
                            <Button variant="outline" size="sm">
                              Change Favicon
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                            <p className="text-xs text-gray-600">ICO, PNG 32x32px</p>
                            <Button variant="outline" size="sm">
                              Choose File
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Color Scheme</Label>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border-2 border-gray-300"
                            style={{ backgroundColor: config.primaryColor }}
                          ></div>
                          <span className="text-sm">Primary</span>
                        </div>
                        <Input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="w-16 h-8"
                        />
                        <Input
                          value={config.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border-2 border-gray-300"
                            style={{ backgroundColor: config.secondaryColor }}
                          ></div>
                          <span className="text-sm">Secondary</span>
                        </div>
                        <Input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="w-16 h-8"
                        />
                        <Input
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border-2 border-gray-300"
                            style={{ backgroundColor: config.accentColor }}
                          ></div>
                          <span className="text-sm">Accent</span>
                        </div>
                        <Input
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => updateConfig('accentColor', e.target.value)}
                          className="w-16 h-8"
                        />
                        <Input
                          value={config.accentColor}
                          onChange={(e) => updateConfig('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    value={config.customDomain}
                    onChange={(e) => updateConfig('customDomain', e.target.value)}
                    placeholder="app.yourcompany.com"
                  />
                  <p className="text-xs text-gray-600">
                    This will replace the default NEXUS domain in the client interface
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>SSL Certificate</Label>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">SSL Certificate Active</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">DNS Configuration</h4>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-2">
                    <div>CNAME {config.customDomain} → nexus-custom.app</div>
                    <div>TXT _dmarc.{config.customDomain} → "v=DMARC1; p=none;"</div>
                    <div>MX {config.customDomain} → mail.nexus.app</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600">DNS records are properly configured</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>SMTP Server</Label>
                  <Select defaultValue="sendgrid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="aws">Amazon SES</SelectItem>
                      <SelectItem value="custom">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>From Email Address</Label>
                  <Input defaultValue="noreply@app.acmecorp.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Templates Branding</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Apply company branding to all email templates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Include company logo in email footers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Use custom email signatures</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Welcome Message</Label>
                  <Textarea
                    defaultValue={`Welcome to ${config.companyName}'s platform. We're excited to help you achieve your goals with our comprehensive marketing automation tools.`}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Dashboard Header Text</Label>
                  <Input defaultValue={`${config.companyName} Dashboard`} />
                </div>

                <div>
                  <Label>Help Documentation URL</Label>
                  <Input defaultValue={`https://help.${config.customDomain}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Twitter/X</Label>
                  <Input
                    value={config.socialLinks.twitter}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    placeholder="https://twitter.com/company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={config.socialLinks.linkedin}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={config.socialLinks.facebook}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    placeholder="https://facebook.com/company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={config.socialLinks.instagram}
                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    placeholder="https://instagram.com/company"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input
                    value={config.supportEmail}
                    onChange={(e) => updateConfig('supportEmail', e.target.value)}
                    placeholder="support@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Support Phone</Label>
                  <Input
                    value={config.supportPhone}
                    onChange={(e) => updateConfig('supportPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Support Hours</Label>
                <Select defaultValue="247">
                  <SelectTrigger className="max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business Hours (9 AM - 5 PM EST)</SelectItem>
                    <SelectItem value="extended">Extended Hours (8 AM - 8 PM EST)</SelectItem>
                    <SelectItem value="247">24/7 Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Privacy Policy URL</Label>
                <Input
                  value={config.privacyPolicy}
                  onChange={(e) => updateConfig('privacyPolicy', e.target.value)}
                  placeholder="https://company.com/privacy"
                />
              </div>

              <div className="space-y-2">
                <Label>Terms of Service URL</Label>
                <Input
                  value={config.termsOfService}
                  onChange={(e) => updateConfig('termsOfService', e.target.value)}
                  placeholder="https://company.com/terms"
                />
              </div>

              <div className="space-y-4">
                <Label>GDPR Compliance</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Enable GDPR consent management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Include data processing agreement</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Enable right to data portability</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>White-label Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6" style={{
                  fontFamily: config.fontFamily,
                  '--primary-color': config.primaryColor,
                  '--secondary-color': config.secondaryColor,
                  '--accent-color': config.accentColor
                } as React.CSSProperties}>
                  {/* Header Preview */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {config.logo ? (
                        <img src={config.logo} alt="Logo" className="h-8" />
                      ) : (
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: config.primaryColor }}
                        >
                          {config.companyName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h1 className="text-xl font-bold" style={{ color: config.primaryColor }}>
                          {config.companyName}
                        </h1>
                        <p className="text-sm text-gray-600">Dashboard</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button style={{ backgroundColor: config.primaryColor }}>
                        Get Started
                      </Button>
                    </div>
                  </div>

                  {/* Feature Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900">Marketing Automation</h3>
                      <p className="text-sm text-gray-600 mt-1">Streamline your marketing efforts</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900">Lead Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Track and nurture your leads</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600 mt-1">Data-driven insights</p>
                    </div>
                  </div>

                  {/* Footer Preview */}
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div>
                        © 2026 {config.companyName}. All rights reserved.
                      </div>
                      <div className="flex items-center space-x-4">
                        {config.socialLinks.twitter && (
                          <a href={config.socialLinks.twitter} className="hover:text-blue-600">Twitter</a>
                        )}
                        {config.socialLinks.linkedin && (
                          <a href={config.socialLinks.linkedin} className="hover:text-blue-600">LinkedIn</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-blue-800 font-medium">Preview Mode Active</p>
                      <p className="text-blue-700 text-sm">This is how your white-labeled platform will appear to clients.</p>
                    </div>
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