'use client'

import Link from 'next/link'
import { MapPin, Clock, ArrowRight } from 'lucide-react'

const jobs = [
  { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Backend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Customer Success Manager', department: 'Support', location: 'Remote', type: 'Full-time' },
  { title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Marketing Manager', department: 'Marketing', location: 'Remote', type: 'Full-time' },
]

const benefits = [
  'Competitive salary',
  'Remote-first culture',
  'Health insurance',
  '401(k) matching',
  'Unlimited PTO',
  'Learning budget',
  'Home office stipend',
  'Team retreats',
]

export default function CareersPage() {
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
            Join our team
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
             Help us build the future of business software. We&apos;re looking for talented people who want to make an impact.
          </p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Open Positions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {jobs.map((job) => (
              <div key={job.title} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Benefits & Perks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-slate-700">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 NEXUS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}