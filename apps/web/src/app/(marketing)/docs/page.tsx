'use client'

import Link from 'next/link'
import { Search, Book, Zap, Shield, Globe, Code } from 'lucide-react'

const sections = [
  {
    title: 'Getting Started',
    icon: Book,
    articles: [
      'Quick Start Guide',
      'Creating Your First Campaign',
      'Inviting Team Members',
      'Setting Up Integrations',
    ]
  },
  {
    title: 'Features',
    icon: Zap,
    articles: [
      'CRM & Contact Management',
      'Email Marketing',
      'SMS Marketing',
      'Social Media Planning',
      'Ad Management',
      'Content Creation',
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    articles: [
      'Data Protection',
      'Two-Factor Authentication',
      'Access Controls',
      'API Security',
    ]
  },
  {
    title: 'Integrations',
    icon: Globe,
    articles: [
      'Meta Ads Integration',
      'Google Ads Integration',
      'Slack Integration',
      'Zapier Integration',
      'API Documentation',
    ]
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-slate-900">NEXUS</Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Documentation</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Everything you need to know about using NEXUS.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.articles.map((article) => (
                    <li key={article}>
                      <Link href="/docs" className="text-slate-600 hover:text-blue-600 text-sm">
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Need more help?</h2>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Contact Support
            </Link>
            <Link href="/community" className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50">
              Ask Community
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 NEXUS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}