'use client'

import Link from 'next/link'
import { Check, ArrowRight, Star, Zap, Shield, HeadphonesIcon } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for small businesses getting started',
    features: [
      'Up to 500 contacts',
      'Basic CRM & pipelines',
      'Email marketing (50/mo)',
      '5 social accounts',
      'Basic reporting',
      'Email support'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: 99,
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
    popular: true
  },
  {
    name: 'Enterprise',
    price: 299,
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
    popular: false
  }
]

const faqs = [
  { question: 'Can I change my plan later?', answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
  { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial on all plans. No credit card required.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
  { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time. No questions asked.' },
  { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee on all plans.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-slate-900">NEXUS</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-slate-600 hover:text-slate-900">Features</Link>
              <Link href="/pricing" className="text-slate-900 font-medium">Pricing</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900">About</Link>
              <Link href="/contact" className="text-slate-600 hover:text-slate-900">Contact</Link>
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
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your business. All plans include our core features and 24/7 support.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-slate-600">Monthly</span>
            <div className="w-12 h-6 bg-blue-600 rounded-full p-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto" />
            </div>
            <span className="text-slate-900 font-medium">Annual</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">Save 20%</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'border border-slate-200 shadow-sm'}`}>
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center py-1 px-4 rounded-full text-sm font-medium mb-4 -mt-14">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-600">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block w-full py-3 px-6 rounded-lg text-center font-medium transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Fast Setup</h3>
              <p className="text-slate-600">Get started in minutes, not hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Secure & Reliable</h3>
              <p className="text-slate-600">Enterprise-grade security</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p className="text-slate-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/community" className="hover:text-white">Community</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
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