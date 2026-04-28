'use client'

import Link from 'next/link'
import { MessageSquare, Users, Hash, Star, Send } from 'lucide-react'

const channels = [
  { name: 'general', description: 'General discussions', members: 1240 },
  { name: 'help', description: 'Get help from the community', members: 890 },
  { name: 'showcase', description: 'Share what you\'ve built', members: 560 },
  { name: 'tips', description: 'Tips and tricks', members: 420 },
]

const topics = [
  { title: 'Getting started with NEXUS', replies: 45, category: 'Getting Started' },
  { title: 'Best practices for email campaigns', replies: 32, category: 'Marketing' },
  { title: 'How to set up API integrations', replies: 28, category: 'Integrations' },
  { title: 'Automation workflow examples', replies: 56, category: 'Automation' },
  { title: 'Tips for improving deliverability', replies: 23, category: 'Email' },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-slate-900">NEXUS</Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Join Community</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Community</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Connect with thousands of NEXUS users, share knowledge, and help each other succeed.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Join Discussion
            </button>
            <button className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 font-medium">
              Browse Topics
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">12,000+</div>
              <div className="text-slate-400">Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">45,000+</div>
              <div className="text-slate-400">Discussions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-slate-400">Active Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Channels & Topics */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Channels */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Channels</h2>
              {channels.map((channel) => (
                <div key={channel.name} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-slate-400" />
                    <div>
                      <h3 className="font-medium text-slate-900">{channel.name}</h3>
                      <p className="text-sm text-slate-500">{channel.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                    <Users className="w-4 h-4" />
                    {channel.members} members
                  </div>
                </div>
              ))}
            </div>

            {/* Topics */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Popular Topics</h2>
              {topics.map((topic, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{topic.category}</span>
                      <h3 className="font-medium text-slate-900 mt-2">{topic.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <MessageSquare className="w-4 h-4" />
                      {topic.replies} replies
                    </div>
                  </div>
                </div>
              ))}
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