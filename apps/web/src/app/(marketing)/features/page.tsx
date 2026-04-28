'use client'

import Link from 'next/link'
import { 
  Users, MessageSquare, GitBranch, Search, PenTool, Mail, Phone, 
  Target, Image, Video, Music, Building, Zap, LayoutGrid, BarChart3,
  Globe, Palette, Workflow, ShoppingCart, MessageCircle, Send, Bell,
  Settings, Shield, Clock, CheckCircle, ArrowRight
} from 'lucide-react'

const features = [
  {
    category: 'CRM & Sales',
    icon: Users,
    color: 'blue',
    items: [
      { name: 'Contact Management', description: 'Organize and track all customer interactions' },
      { name: 'Pipeline Management', description: 'Visualize and manage your sales pipeline' },
      { name: 'Deal Tracking', description: 'Track deals from lead to close' },
      { name: 'Activity Tracking', description: 'Monitor all customer touchpoints' },
    ]
  },
  {
    category: 'Marketing',
    icon: PenTool,
    color: 'purple',
    items: [
      { name: 'Content Writer', description: 'AI-powered content creation' },
      { name: 'Email Marketing', description: 'Beautiful emails that convert' },
      { name: 'SMS Marketing', description: 'Reach customers via text message' },
      { name: 'Social Media', description: 'Schedule and manage posts' },
    ]
  },
  {
    category: 'Advertising',
    icon: Target,
    color: 'pink',
    items: [
      { name: 'Multi-Platform Ads', description: 'Manage Meta, Google, TikTok ads' },
      { name: 'Campaign Builder', description: 'Create ads with AI assistance' },
      { name: 'Analytics Dashboard', description: 'Track performance in real-time' },
      { name: 'Budget Optimization', description: 'Auto-optimize ad spend' },
    ]
  },
  {
    category: 'Creative',
    icon: Palette,
    color: 'orange',
    items: [
      { name: 'Design Studio', description: 'Create stunning graphics' },
      { name: 'Image Studio', description: 'AI-powered image editing' },
      { name: 'Video Editor', description: 'Professional video editing' },
      { name: 'Music Creator', description: 'AI-generated music' },
    ]
  },
  {
    category: 'Automation',
    icon: Zap,
    color: 'amber',
    items: [
      { name: 'Workflows', description: 'Automate repetitive tasks' },
      { name: 'Chatbots', description: 'AI-powered customer support' },
      { name: 'Broadcasting', description: 'Send to multiple channels' },
      { name: 'Voice Calls', description: 'AI voice assistants' },
    ]
  },
  {
    category: 'Commerce',
    icon: ShoppingCart,
    color: 'green',
    items: [
      { name: 'Product Research', description: 'Find winning products' },
      { name: 'Ad Intelligence', description: 'Competitor ad analysis' },
      { name: 'UGC Ads', description: 'AI-generated video ads' },
      { name: 'Store Management', description: 'E-commerce in one place' },
    ]
  }
]

const stats = [
  { value: '55+', label: 'Tools Integrated' },
  { value: '300+', label: 'AI Models' },
  { value: '10M+', label: 'Leads Generated' },
  { value: '$2.8B+', label: 'Ad Spend Managed' },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-slate-900">NEXUS</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-slate-900 font-medium">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900">About</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Everything you need to grow
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Powerful features designed to scale with your business. Replace dozens of tools with one platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg hover:bg-slate-50 font-medium">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            All-in-one platform
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            From CRM to creative tools, everything your business needs in one place.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((category) => (
              <div key={category.category} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    category.color === 'blue' ? 'bg-blue-100' :
                    category.color === 'purple' ? 'bg-purple-100' :
                    category.color === 'pink' ? 'bg-pink-100' :
                    category.color === 'orange' ? 'bg-orange-100' :
                    category.color === 'amber' ? 'bg-amber-100' : 'bg-green-100'
                  }`}>
                    <category.icon className={`w-5 h-5 ${
                      category.color === 'blue' ? 'text-blue-600' :
                      category.color === 'purple' ? 'text-purple-600' :
                      category.color === 'pink' ? 'text-pink-600' :
                      category.color === 'orange' ? 'text-orange-600' :
                      category.color === 'amber' ? 'text-amber-600' : 'text-green-600'
                    }`} />
                  </div>
                  <h3 className="font-semibold text-slate-900">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link href={`/dashboard/${item.name.toLowerCase().replace(/[^a-z]/g, '-')}`} className="block">
                        <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using NEXUS to streamline operations and accelerate growth.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Start Free 14-Day Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-white mb-4 md:mb-0">NEXUS</div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>© 2026 NEXUS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}