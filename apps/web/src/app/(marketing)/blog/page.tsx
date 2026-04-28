'use client'

import Link from 'next/link'
import { Search, ArrowRight, Calendar, User } from 'lucide-react'

const posts = [
  {
    id: 1,
    title: 'How AI is Transforming Business Operations in 2026',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way businesses operate and grow.',
    category: 'AI',
    date: '2026-04-28',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    author: 'Alex Johnson'
  },
  {
    id: 2,
    title: '10 SEO Strategies That Actually Work in 2026',
    excerpt: 'Learn the most effective SEO techniques to boost your search rankings and drive organic traffic.',
    category: 'Marketing',
    date: '2026-04-25',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    author: 'Sarah Chen'
  },
  {
    id: 3,
    title: 'The Complete Guide to Marketing Automation',
    excerpt: 'Everything you need to know about marketing automation and how to implement it in your business.',
    category: 'Automation',
    date: '2026-04-20',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    author: 'Michael Brown'
  },
  {
    id: 4,
    title: 'Building a Successful E-commerce Business from Scratch',
    excerpt: 'Step-by-step guide to starting and scaling your e-commerce business.',
    category: 'E-commerce',
    date: '2026-04-15',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    author: 'Emily Davis'
  },
]

export default function BlogPage() {
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
              <Link href="/blog" className="text-slate-900 font-medium">Blog</Link>
            </nav>
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
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Blog</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Insights, tips, and guides to help you grow your business.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">{post.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h2>
                  <p className="text-slate-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-600">{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Subscribe to our newsletter</h2>
          <p className="text-slate-600 mb-6">Get the latest articles and insights delivered to your inbox.</p>
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© 2026 NEXUS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}