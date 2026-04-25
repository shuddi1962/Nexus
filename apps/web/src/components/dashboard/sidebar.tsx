'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import {
  Home,
  Users,
  MessageSquare,
  GitBranch,
  Search,
  PenTool,
  Mail,
  MessageCircle,
  Phone,
  MonitorSpeaker,
  Target,
  Image,
  Video,
  Music,
  FileText,
  Zap,
  Building,
  Settings,
  User
} from 'lucide-react'

const navigation = [
  {
    name: 'Core',
    items: [
      { name: 'Home', href: '/dashboard', icon: Home },
      { name: 'Contacts & CRM', href: '/dashboard/crm', icon: Users },
      { name: 'Inbox', href: '/dashboard/inbox', icon: MessageSquare },
      { name: 'Pipelines', href: '/dashboard/pipelines', icon: GitBranch },
      { name: 'Prospecting', href: '/dashboard/prospecting', icon: Search },
    ],
  },
  {
    name: 'Marketing',
    items: [
      { name: 'Content Writer', href: '/dashboard/content', icon: PenTool },
      { name: 'Social Planner', href: '/dashboard/social', icon: MonitorSpeaker },
      { name: 'Email Marketing', href: '/dashboard/email', icon: Mail },
      { name: 'SMS Marketing', href: '/dashboard/sms', icon: MessageCircle },
      { name: 'WhatsApp', href: '/dashboard/whatsapp', icon: Phone },
      { name: 'SEO Engine', href: '/dashboard/seo', icon: Target },
      { name: 'Auto-Indexing', href: '/dashboard/indexing', icon: Search },
      { name: 'Site Manager', href: '/dashboard/sites', icon: Building },
      { name: 'Keywords', href: '/dashboard/keywords', icon: Target },
      { name: 'Backlinks', href: '/dashboard/backlinks', icon: GitBranch },
    ],
  },
  {
    name: 'Ads Manager',
    items: [
      { name: 'Ad Dashboard', href: '/dashboard/ads', icon: Target },
      { name: 'Campaigns', href: '/dashboard/ads/campaigns', icon: Target },
      { name: 'Ad Sets & Ads', href: '/dashboard/ads/adsets', icon: Target },
      { name: 'Creative Library', href: '/dashboard/ads/creatives', icon: Image },
      { name: 'Audiences', href: '/dashboard/ads/audiences', icon: Users },
      { name: 'Analytics & ROAS', href: '/dashboard/ads/analytics', icon: Target },
      { name: 'Billing & Payments', href: '/dashboard/ads/billing', icon: Target },
      { name: 'Automated Rules', href: '/dashboard/ads/rules', icon: Zap },
    ],
  },
  {
    name: 'Commerce',
    items: [
      { name: 'Product Research', href: '/dashboard/products/research', icon: Search },
      { name: 'Ad Intelligence', href: '/dashboard/products/intelligence', icon: Target },
      { name: 'UGC Ads', href: '/dashboard/products/ugc', icon: Video },
      { name: 'Online Store', href: '/dashboard/store', icon: Building },
      { name: 'Invoices & Payments', href: '/dashboard/invoices', icon: FileText },
    ],
  },
  {
    name: 'Creative',
    items: [
      { name: 'Design Studio', href: '/dashboard/design', icon: PenTool },
      { name: 'Image Studio', href: '/dashboard/images', icon: Image },
      { name: 'Video Editor', href: '/dashboard/video', icon: Video },
      { name: 'Music Creator', href: '/dashboard/music', icon: Music },
      { name: 'Presentations', href: '/dashboard/presentations', icon: FileText },
      { name: 'Logo Creator', href: '/dashboard/logo', icon: PenTool },
      { name: 'Article → Video', href: '/dashboard/article-to-video', icon: Video },
    ],
  },
  {
    name: 'Automation',
    items: [
      { name: 'Chatbots', href: '/dashboard/chatbots', icon: MessageSquare },
      { name: 'Workflows', href: '/dashboard/workflows', icon: GitBranch },
      { name: 'Voice Calls', href: '/dashboard/voice', icon: Phone },
      { name: 'Broadcasting', href: '/dashboard/broadcasts', icon: MonitorSpeaker },
    ],
  },
  {
    name: 'Build',
    items: [
      { name: 'Websites & Funnels', href: '/dashboard/websites', icon: Building },
      { name: 'Hosting & Domains', href: '/dashboard/hosting', icon: Building },
      { name: 'Business Name Gen', href: '/dashboard/business-name', icon: PenTool },
      { name: 'Calendars', href: '/dashboard/calendar', icon: FileText },
      { name: 'Courses & Memberships', href: '/dashboard/courses', icon: Users },
      { name: 'Reviews & Reputation', href: '/dashboard/reputation', icon: Target },
      { name: 'Code Builder', href: '/dashboard/code', icon: FileText },
      { name: 'Chat Hub', href: '/dashboard/chat', icon: MessageSquare },
    ],
  },
  {
    name: 'System',
    items: [
      { name: 'Reports & Analytics', href: '/dashboard/reports', icon: Target },
      { name: 'Team & Roles', href: '/dashboard/team', icon: Users },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const user = null

  return (
    <div>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-nexus-surface border-r border-nexus-border flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-nexus-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center" onClick={onClose}>
            <div className="text-2xl font-bold text-nexus-text-primary">NEXUS</div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-nexus-text-secondary hover:text-nexus-text-primary lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-8">
          {navigation.map((section: any) => (
            <div key={section.name}>
              <h3 className="px-3 text-xs font-semibold text-nexus-text-tertiary uppercase tracking-wider mb-2">
                {section.name}
              </h3>
              <div className="space-y-1">
                {section.items.map((item: any) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-nexus-blue-light text-nexus-blue border-r-2 border-nexus-blue'
                          : 'text-nexus-text-secondary hover:bg-nexus-bg-secondary hover:text-nexus-text-primary'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 h-5 w-5 flex-shrink-0',
                          isActive ? 'text-nexus-blue' : 'text-nexus-text-tertiary group-hover:text-nexus-text-secondary'
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User menu */}
      <div className="p-4 border-t border-nexus-border">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-nexus-bg-secondary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-nexus-text-secondary" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-nexus-text-primary truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-nexus-text-tertiary truncate">
              {user?.email || 'user@nexus.demo'}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}