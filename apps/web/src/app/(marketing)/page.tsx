'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { ChevronDown, Star, Check, ArrowRight, Play } from 'lucide-react'

// Lazy load Three.js particles for performance
const ThreeParticles = dynamic(() => import('@/components/marketing/three-particles'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-nexus-accent" />
})

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Company logos for social proof
const companyLogos = [
  'Acme Corp', 'TechStart Inc', 'BuildFast', 'InnovateLab', 'ScaleUp Co', 'NextGen Solutions'
]

// Feature highlights data
const featureHighlights = [
  {
    title: 'CRM & Pipeline Management',
    description: 'Track leads, manage deals, and close more business with automated workflows.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    badge: 'Most Popular'
  },
  {
    title: 'Content Creation Studio',
    description: 'Generate blog posts, social media content, and marketing materials with AI.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    badge: 'AI Powered'
  },
  {
    title: 'Advertising Dashboard',
    description: 'Manage all your ad campaigns across Meta, Google, TikTok, and more from one place.',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80',
    badge: 'Multi-Platform'
  },
  {
    title: 'Email & SMS Marketing',
    description: 'Design beautiful emails and send targeted SMS campaigns to your audience.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    badge: 'Automated'
  },
  {
    title: 'Analytics & Reporting',
    description: 'Get deep insights into your business performance with comprehensive dashboards.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    badge: 'Real-time'
  },
  {
    title: 'Automation Workflows',
    description: 'Automate repetitive tasks and create powerful business workflows.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    badge: 'No-Code'
  }
]

// Testimonials data
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechCorp',
    content: 'NEXUS transformed our entire marketing operation. We replaced 12 different tools with one integrated platform.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=80',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'CEO',
    company: 'ScaleUp Co',
    content: 'The automation features alone saved us 20 hours per week. Our conversion rates increased by 340%.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&q=80',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Sales Manager',
    company: 'BuildFast',
    content: 'Finally, a CRM that actually works for modern sales teams. The pipeline management is incredible.',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&fit=crop&q=80',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Founder',
    company: 'InnovateLab',
    content: 'NEXUS helped us grow from 0 to $2M ARR in 18 months. The all-in-one approach is a game changer.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&q=80',
    rating: 5
  },
  {
    name: 'Lisa Thompson',
    role: 'Operations Director',
    company: 'NextGen Solutions',
    content: 'The ROI was immediate. We saw a 400% increase in lead quality within the first month.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&q=80',
    rating: 5
  },
  {
    name: 'James Wilson',
    role: 'VP of Sales',
    company: 'Acme Corp',
    content: 'Best investment we\'ve made. The platform pays for itself through increased efficiency and revenue.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=80',
    rating: 5
  }
]

// Pricing data
const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'Perfect for small businesses getting started',
    features: [
      'Up to 500 contacts',
      'Basic CRM & pipelines',
      'Email marketing (50/mo)',
      '5 social accounts',
      'Basic reporting',
      'Email support'
    ],
    buttonText: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    price: 99,
    period: 'month',
    description: 'Ideal for growing businesses and agencies',
    features: [
      'Up to 5,000 contacts',
      'Advanced CRM & automation',
      'Email marketing (500/mo)',
      '25 social accounts',
      'Advanced reporting & analytics',
      'Ad management (Meta, Google)',
      'Content creation studio',
      'Priority support'
    ],
    buttonText: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 299,
    period: 'month',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited contacts',
      'White-label solution',
      'Unlimited email marketing',
      'Unlimited social accounts',
      'Custom integrations',
      'Dedicated success manager',
      'Advanced security & compliance',
      'Phone support'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
]

// Stats for animated counters
const stats = [
  { value: 55, suffix: '+', label: 'Tools Replaced', prefix: '' },
  { value: 300, suffix: '+', label: 'AI Models', prefix: '' },
  { value: 10000, suffix: 'M+', label: 'Leads Generated', prefix: '' },
  { value: 2800, suffix: 'B+', label: 'Ad Spend Managed', prefix: '$' }
]

export default function MarketingHomepage() {
  // Preload critical images for better Core Web Vitals
  useEffect(() => {
    // Preload hero image
    const heroImage = new Image()
    heroImage.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80'

    // Preload testimonial avatars
    const avatarUrls = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=80'
    ]

    avatarUrls.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }, [])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('crm')

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-nexus-surface/90 backdrop-blur-md border-b border-nexus-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-nexus-accent">
              NEXUS
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-nexus-text-secondary hover:text-nexus-text-primary transition-colors">
                  Products <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {/* Mega menu would go here */}
              </div>
              <div className="relative group">
                <button className="flex items-center text-nexus-text-secondary hover:text-nexus-text-primary transition-colors">
                  Solutions <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
              <Link href="/pricing" className="text-nexus-text-secondary hover:text-nexus-text-primary transition-colors">
                Pricing
              </Link>
              <div className="relative group">
                <button className="flex items-center text-nexus-text-secondary hover:text-nexus-text-primary transition-colors">
                  Resources <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/login" className="text-nexus-text-secondary hover:text-nexus-text-primary transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-nexus-blue text-white px-4 py-2 rounded-lg hover:bg-nexus-accent transition-colors">
                Start Free Trial →
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center">
                <span className={`w-full h-0.5 bg-nexus-text-primary transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`} />
                <span className={`w-full h-0.5 bg-nexus-text-primary transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-full h-0.5 bg-nexus-text-primary transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`} />
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-nexus-border">
              <div className="space-y-4">
                <a href="/features" className="block text-nexus-text-secondary hover:text-nexus-text-primary">Features</a>
                <a href="/pricing" className="block text-nexus-text-secondary hover:text-nexus-text-primary">Pricing</a>
                <a href="/about" className="block text-nexus-text-secondary hover:text-nexus-text-primary">About</a>
                <div className="pt-4 border-t border-nexus-border space-y-2">
                  <Link href="/login" className="block text-nexus-text-secondary hover:text-nexus-text-primary">Login</Link>
                  <Link href="/register" className="block bg-nexus-blue text-white px-4 py-2 rounded-lg text-center">Start Free Trial</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-nexus-accent">
        {/* Three.js Particles Background */}
        <ThreeParticles />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250,250,248,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center rounded-full bg-nexus-blue/10 text-nexus-blue px-4 py-2 text-sm font-medium border border-nexus-blue/20">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Rated #1 All-in-One Business Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-nexus-surface mb-6 leading-tight"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            The Operating System
            <br />
            for Modern Business
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-nexus-surface/70 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Replace 55+ tools with one platform. CRM, marketing, creative studio, advertising, automation — all connected.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/register" className="bg-nexus-blue text-white px-8 py-4 rounded-lg hover:bg-nexus-accent transition-colors text-lg font-medium">
              Start Free 14-Day Trial
            </Link>
            <button className="border border-nexus-surface/30 text-nexus-surface px-8 py-4 rounded-lg hover:bg-nexus-surface/10 transition-colors text-lg font-medium flex items-center justify-center">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo →
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-16"
          >
            <p className="text-nexus-surface/60 mb-8">Trusted by 12,000+ businesses worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {companyLogos.map((company, index) => (
                <div key={index} className="text-nexus-surface/80 font-semibold text-lg">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="relative px-4"
          >
            <div
              className="relative mx-auto max-w-4xl rounded-xl overflow-hidden shadow-2xl"
              style={{
                transform: 'perspective(1200px) rotateX(8deg)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
              }}
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80"
                alt="NEXUS Dashboard Preview"
                width={1600}
                height={900}
                className="w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />

              {/* Floating metric cards - Hidden on mobile for better UX */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-nexus-green text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg z-20 text-sm md:text-base"
              >
                <div className="text-lg md:text-2xl font-bold">↑ 247%</div>
                <div className="text-xs md:text-sm opacity-90">Revenue Growth</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute top-4 right-4 md:top-8 md:right-8 bg-white text-nexus-text-primary px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg z-20 text-sm md:text-base"
              >
                <div className="text-lg md:text-2xl font-bold">12,847</div>
                <div className="text-xs md:text-sm text-nexus-text-secondary">Leads Generated</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-nexus-blue text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg z-20 text-sm md:text-base"
              >
                <div className="text-lg md:text-2xl font-bold">AI Content</div>
                <div className="text-xs md:text-sm opacity-90">Published: 94</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nexus-bg to-transparent" />
      </section>

      {/* Social Proof Bar */}
      <section className="py-16 bg-nexus-surface border-b border-nexus-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-nexus-text-secondary mb-8">Join thousands of businesses already using NEXUS</p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {companyLogos.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.6 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-nexus-text-tertiary font-semibold text-xl"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Bento Grid */}
      <section className="py-24 bg-nexus-bg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-nexus-text-primary mb-4">
              Everything you need to grow
            </h2>
            <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
              Powerful features designed to scale with your business
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featureHighlights.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-nexus-surface rounded-xl overflow-hidden border border-nexus-border hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-nexus-blue text-white px-2 py-1 rounded text-xs font-medium">
                      {feature.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-nexus-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-nexus-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-nexus-accent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-nexus-surface mb-2">
                  {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-nexus-surface/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Module Showcase */}
      <section className="py-24 bg-nexus-bg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-nexus-text-primary mb-4">
              All your business tools, unified
            </h2>
            <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
              Every feature you need, seamlessly connected in one platform
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-nexus-surface p-1 rounded-lg border border-nexus-border">
                {['crm', 'marketing', 'creative', 'ads', 'automation', 'commerce'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-nexus-blue text-white'
                        : 'text-nexus-text-secondary hover:text-nexus-text-primary'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-nexus-surface rounded-xl border border-nexus-border p-8"
            >
              {activeTab === 'crm' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-4">CRM & Pipeline Management</h3>
                  <p className="text-nexus-text-secondary mb-6">Track every lead, manage deals, and close more business with intelligent automation.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-blue" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Contact Management</h4>
                      <p className="text-sm text-nexus-text-secondary">Organize and track all customer interactions</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-blue" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Pipeline Automation</h4>
                      <p className="text-sm text-nexus-text-secondary">Move deals forward automatically</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-blue" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Performance Analytics</h4>
                      <p className="text-sm text-nexus-text-secondary">Track conversion rates and ROI</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'marketing' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-4">Marketing Automation</h3>
                  <p className="text-nexus-text-secondary mb-6">Create, schedule, and optimize your marketing campaigns across all channels.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-green" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Email Campaigns</h4>
                      <p className="text-sm text-nexus-text-secondary">Design and send beautiful emails</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-green" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Social Media</h4>
                      <p className="text-sm text-nexus-text-secondary">Schedule and manage all social platforms</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-green" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">SEO Tools</h4>
                      <p className="text-sm text-nexus-text-secondary">Optimize content for search engines</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'creative' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-4">Creative Studio</h3>
                  <p className="text-nexus-text-secondary mb-6">Create stunning visuals, videos, and content with AI-powered tools.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-violet/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-violet" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Image Generation</h4>
                      <p className="text-sm text-nexus-text-secondary">Create images with AI prompts</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-violet/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-violet" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Video Editor</h4>
                      <p className="text-sm text-nexus-text-secondary">Edit and produce professional videos</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-violet/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-violet" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Design Studio</h4>
                      <p className="text-sm text-nexus-text-secondary">Create graphics and presentations</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ads' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-4">Advertising Dashboard</h3>
                  <p className="text-nexus-text-secondary mb-6">Manage all your ad campaigns across platforms from one unified dashboard.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-blue" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Multi-Platform</h4>
                      <p className="text-sm text-nexus-text-secondary">Meta, Google, TikTok, LinkedIn, and more</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-blue" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Smart Optimization</h4>
                      <p className="text-sm text-nexus-text-secondary">AI-powered bidding and targeting</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-blue" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Performance Tracking</h4>
                      <p className="text-sm text-nexus-text-secondary">Real-time ROAS and conversion tracking</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'automation' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-4">Workflow Automation</h3>
                  <p className="text-nexus-text-secondary mb-6">Automate repetitive tasks and create powerful business workflows.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-amber/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-amber" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Visual Builder</h4>
                      <p className="text-sm text-nexus-text-secondary">Drag-and-drop workflow creation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-amber/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-amber" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">API Integration</h4>
                      <p className="text-sm text-nexus-text-secondary">Connect with 1000+ apps and services</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-amber/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-amber" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Smart Triggers</h4>
                      <p className="text-sm text-nexus-text-secondary">Event-based automation rules</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'commerce' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-4">Commerce Intelligence</h3>
                  <p className="text-nexus-text-secondary mb-6">Product research, competitor analysis, and marketplace optimization tools.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-red/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-red" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Product Research</h4>
                      <p className="text-sm text-nexus-text-secondary">Find trending products and opportunities</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-red/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-red" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Market Analysis</h4>
                      <p className="text-sm text-nexus-text-secondary">Competitor insights and pricing strategy</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-nexus-red/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6 text-nexus-red" />
                      </div>
                      <h4 className="font-semibold text-nexus-text-primary mb-2">Store Management</h4>
                      <p className="text-sm text-nexus-text-secondary">E-commerce platform integration</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-nexus-bg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-nexus-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
              Get started in minutes, not months. Our platform is designed for rapid deployment and immediate results.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connection line */}
              <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
                <svg className="w-full h-8" viewBox="0 0 400 32" fill="none">
                  <path d="M0 16 Q100 0 200 16 Q300 32 400 16" stroke="currentColor" strokeWidth="2" className="text-nexus-border" />
                </svg>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-nexus-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-nexus-text-primary mb-3">Connect Your Tools</h3>
                  <p className="text-nexus-text-secondary">
                    Import data from your existing tools or start fresh. Our AI automatically maps and organizes your information.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-nexus-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-nexus-text-primary mb-3">Configure Workflows</h3>
                  <p className="text-nexus-text-secondary">
                    Set up automated processes and rules. Define how your business operates with our visual workflow builder.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-nexus-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-nexus-text-primary mb-3">Scale & Optimize</h3>
                  <p className="text-nexus-text-secondary">
                    Monitor performance, get AI-powered insights, and continuously improve your business processes.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-nexus-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-nexus-text-primary mb-4">
              Loved by businesses worldwide
            </h2>
            <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
              See how NEXUS is transforming the way companies operate and grow.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-nexus-bg rounded-xl p-6 border border-nexus-border"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-nexus-amber text-nexus-amber" />
                  ))}
                </div>
                <blockquote className="text-nexus-text-primary mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-nexus-text-primary">{testimonial.name}</div>
                    <div className="text-sm text-nexus-text-secondary">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-nexus-bg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-nexus-text-primary mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-nexus-text-secondary max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include our core features and 24/7 support.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative bg-nexus-surface rounded-xl border p-8 ${
                  plan.popular
                    ? 'border-nexus-blue ring-2 ring-nexus-blue/20'
                    : 'border-nexus-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-nexus-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-nexus-text-primary mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-nexus-text-primary mb-1">
                    ${plan.price}
                    <span className="text-lg text-nexus-text-secondary font-normal">/{plan.period}</span>
                  </div>
                  <p className="text-nexus-text-secondary">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-nexus-green mr-3 flex-shrink-0" />
                      <span className="text-nexus-text-primary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`w-full block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-nexus-blue text-white hover:bg-nexus-accent'
                      : 'bg-nexus-bg text-nexus-text-primary hover:bg-nexus-surface border border-nexus-border'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-nexus-text-secondary">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-nexus-accent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-nexus-surface mb-4">
              Works with everything you use
            </h2>
            <p className="text-xl text-nexus-surface/80 max-w-2xl mx-auto">
              Connect NEXUS with 1000+ apps and services. Your existing tools work seamlessly with our platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative overflow-hidden"
          >
            <div className="flex animate-marquee">
              {[
                'Slack', 'Zapier', 'HubSpot', 'Salesforce', 'Mailchimp', 'Stripe', 'QuickBooks',
                'Google Analytics', 'Facebook Ads', 'LinkedIn', 'Twitter', 'Instagram',
                'Shopify', 'WooCommerce', 'WordPress', 'Notion', 'Figma', 'GitHub'
              ].map((integration, index) => (
                <div key={index} className="flex-shrink-0 mx-8">
                  <div className="bg-nexus-surface/10 backdrop-blur-sm border border-nexus-surface/20 rounded-lg px-6 py-3">
                    <span className="text-nexus-surface font-semibold">{integration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-nexus-accent">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-nexus-surface mb-6">
              Ready to transform your business?
            </h2>
            <p className="text-xl text-nexus-surface/80 mb-8">
              Join thousands of businesses already using NEXUS to streamline operations, boost productivity, and accelerate growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-nexus-blue text-white px-8 py-4 rounded-lg hover:bg-nexus-accent transition-colors text-lg font-medium">
                Start Free Trial
              </Link>
              <Link href="/demo" className="border border-nexus-surface/30 text-nexus-surface px-8 py-4 rounded-lg hover:bg-nexus-surface/10 transition-colors text-lg font-medium">
                Schedule Demo
              </Link>
            </div>
            <p className="text-nexus-surface/60 mt-6 text-sm">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nexus-accent text-nexus-surface">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">NEXUS</div>
              <p className="text-nexus-surface/80 mb-4">
                The all-in-one business platform that replaces 55+ tools with one integrated solution.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-nexus-surface/60 hover:text-nexus-surface transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-nexus-surface/60 hover:text-nexus-surface transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-nexus-surface/60 hover:text-nexus-surface transition-colors">
                  GitHub
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Features</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Pricing</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Integrations</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">About</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Blog</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Careers</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Help Center</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Documentation</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Community</a></li>
                <li><a href="#" className="text-nexus-surface/80 hover:text-nexus-surface transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-nexus-surface/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-nexus-surface/60 text-sm">
              © 2026 NEXUS. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-nexus-surface/60 hover:text-nexus-surface transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-nexus-surface/60 hover:text-nexus-surface transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-nexus-surface/60 hover:text-nexus-surface transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}