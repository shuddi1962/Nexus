'use client'

import Link from 'next/link'
import { Search, MessageSquare, Mail, Phone, FileText, Video, HelpCircle, Settings, AlertTriangle } from 'lucide-react'

const topics = [
  { title: 'Getting Started', icon: HelpCircle, count: 24 },
  { title: 'Billing & Pricing', icon: FileText, count: 18 },
  { title: 'Account Settings', icon: Settings, count: 15 },
  { title: 'Integrations', icon: MessageSquare, count: 32 },
  { title: 'Technical Issues', icon: AlertTriangle, count: 21 },
]

const articles = [
  'How to set up your first campaign',
  'Understanding billing cycles',
  'Setting up two-factor authentication',
  'Connecting Meta Ads',
  'Troubleshooting email delivery',
]

export default function SupportPage() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">How can we help?</h1>
          <p className="text-xl text-slate-600 mb-8">
            Search our knowledge base or browse topics below.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <topic.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-slate-900 mb-1">{topic.title}</h3>
                <p className="text-sm text-slate-500">{topic.count} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Popular Articles</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {articles.map((article) => (
              <a key={article} href="#" className="block p-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">{article}</span>
                  <span className="text-blue-600">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Live Chat</h3>
              <p className="text-slate-600 text-sm mb-4">Chat with our team</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Start Chat</button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
              <p className="text-slate-600 text-sm mb-4">Get help via email</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Send Email</button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
              <p className="text-slate-600 text-sm mb-4">Mon-Fri 9am-6pm EST</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Call Now</button>
            </div>
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