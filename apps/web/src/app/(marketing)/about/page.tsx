'use client'

import Link from 'next/link'
import { ArrowRight, Users, Globe, Shield, Zap } from 'lucide-react'

const stats = [
  { value: '12,000+', label: 'Businesses' },
  { value: '55+', label: 'Tools Integrated' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]

const team = [
  { name: 'Alex Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80' },
  { name: 'Sarah Chen', role: 'CTO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80' },
  { name: 'Michael Brown', role: 'VP of Product', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80' },
  { name: 'Emily Davis', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&q=80' },
]

const values = [
  { icon: Zap, title: 'Innovation', description: 'We constantly push boundaries to deliver cutting-edge features.' },
  { icon: Shield, title: 'Reliability', description: 'Your data is safe with enterprise-grade security.' },
  { icon: Users, title: 'Customer Focus', description: 'We listen and respond to our users needs.' },
  { icon: Globe, title: 'Global Impact', description: 'Helping businesses worldwide achieve their goals.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-slate-900">NEXUS</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-slate-600 hover:text-slate-900">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
              <Link href="/about" className="text-slate-900 font-medium">About</Link>
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
            Building the future of business
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            NEXUS is an all-in-one platform designed to help businesses replace dozens of tools with one powerful solution.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900">
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

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-slate-600">
              <p>
                NEXUS was founded in 2024 with a simple mission: to simplify how businesses operate by replacing dozens of disconnected tools with one integrated platform.
              </p>
              <p>
                We saw businesses struggling with fragmented workflows, multiple subscriptions, and data silos. Our founders had experienced these pain points firsthand while building and scaling their own companies.
              </p>
              <p>
                Today, NEXUS serves over 12,000 businesses worldwide, helping them save time, reduce costs, and grow faster. We continue to innovate and expand our platform to meet the evolving needs of modern businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                <p className="text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join thousands of businesses
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see why NEXUS is the choice of forward-thinking businesses.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Get Started <ArrowRight className="w-5 h-5" />
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