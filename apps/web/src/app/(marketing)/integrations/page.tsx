'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

const integrations = [
  { name: 'Meta Ads', category: 'Advertising', status: 'connected' },
  { name: 'Google Ads', category: 'Advertising', status: 'connected' },
  { name: 'TikTok Ads', category: 'Advertising', status: 'available' },
  { name: 'LinkedIn', category: 'Social', status: 'available' },
  { name: 'Twitter', category: 'Social', status: 'available' },
  { name: 'Instagram', category: 'Social', status: 'available' },
  { name: 'Slack', category: 'Communication', status: 'connected' },
  { name: 'Zapier', category: 'Automation', status: 'connected' },
  { name: 'Microsoft Teams', category: 'Communication', status: 'available' },
  { name: 'WordPress', category: 'CMS', status: 'available' },
  { name: 'Shopify', category: 'E-commerce', status: 'available' },
  { name: 'Stripe', category: 'Payments', status: 'connected' },
  { name: 'Mailchimp', category: 'Email', status: 'available' },
  { name: 'HubSpot', category: 'CRM', status: 'available' },
  { name: 'Salesforce', category: 'CRM', status: 'coming soon' },
  { name: 'QuickBooks', category: 'Finance', status: 'coming soon' },
]

const categories = ['All', 'Advertising', 'Social', 'Communication', 'Automation', 'CMS', 'E-commerce', 'Payments', 'Email', 'CRM', 'Finance']

export default function IntegrationsPage() {
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Works with everything
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Connect NEXUS with 1000+ apps and services. Your existing tools work seamlessly with our platform.
          </p>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}>
                {cat}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {integrations.map((integration) => (
              <div key={integration.name} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg font-bold text-slate-600">
                    {integration.name[0]}
                  </div>
                  {integration.status === 'connected' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{integration.name}</h3>
                <p className="text-sm text-slate-500">{integration.category}</p>
                <button className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors ${integration.status === 'connected' ? 'bg-green-50 text-green-700' : integration.status === 'available' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                  {integration.status === 'connected' ? 'Connected' : integration.status === 'available' ? 'Connect' : 'Coming Soon'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Need a custom integration?</h2>
          <p className="text-slate-600 mb-6">We can build custom integrations for your specific needs.</p>
          <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Contact Sales
          </Link>
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