'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ChevronDown, User, LogOut, Settings, HelpCircle, X, Menu } from 'lucide-react'
import {
  Home,
  Users,
  MessageSquare,
  GitBranch,
  Search,
  PenTool,
  Mail,
  Phone,
  MonitorSpeaker,
  Target,
  Image,
  Video,
  Music,
  FileText,
  Zap,
  Building,
  ShoppingCart,
  Palette,
  Workflow,
  PhoneCall,
  Radio,
  Globe,
  LayoutGrid,
  TrendingUp,
  BarChart3,
  UserCog,
  ChevronRight
} from 'lucide-react'

const navigation = [
  {
    name: 'Core',
    icon: Home,
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
    icon: PenTool,
    items: [
      { name: 'Content Writer', href: '/dashboard/content', icon: PenTool },
      { name: 'SEO Engine', href: '/dashboard/seo', icon: Target },
      { name: 'Social Planner', href: '/dashboard/social', icon: MonitorSpeaker },
      { name: 'Email Marketing', href: '/dashboard/email', icon: Mail },
      { name: 'SMS Marketing', href: '/dashboard/sms', icon: Phone },
      { name: 'WhatsApp', href: '/dashboard/whatsapp', icon: Phone },
      { name: 'Auto-Indexing', href: '/dashboard/indexing', icon: Search },
      { name: 'Site Manager', href: '/dashboard/sites', icon: Building },
      { name: 'Keywords', href: '/dashboard/keywords', icon: Search },
      { name: 'Backlinks', href: '/dashboard/backlinks', icon: GitBranch },
    ],
  },
  {
    name: 'Ads Manager',
    icon: Target,
    items: [
      { name: 'Ad Dashboard', href: '/dashboard/ads', icon: Target },
      { name: 'Campaigns', href: '/dashboard/ads/campaigns', icon: Target },
      { name: 'Ad Sets & Ads', href: '/dashboard/ads/adsets', icon: Target },
      { name: 'Creative Library', href: '/dashboard/ads/creatives', icon: Image },
      { name: 'Audiences', href: '/dashboard/ads/audiences', icon: Users },
      { name: 'Analytics & ROAS', href: '/dashboard/ads/analytics', icon: BarChart3 },
      { name: 'Billing & Payments', href: '/dashboard/ads/billing', icon: FileText },
      { name: 'Budget Optimization', href: '/dashboard/ads/budget-optimization', icon: Zap },
      { name: 'Automated Rules', href: '/dashboard/ads/rules', icon: Workflow },
    ],
  },
  {
    name: 'Commerce',
    icon: ShoppingCart,
    items: [
      { name: 'Commerce Intelligence', href: '/dashboard/commerce', icon: TrendingUp },
      { name: 'Product Research', href: '/dashboard/products/research', icon: Search },
      { name: 'Ad Intelligence', href: '/dashboard/products/intelligence', icon: Target },
      { name: 'UGC Ads', href: '/dashboard/products/ugc', icon: Video },
      { name: 'Online Store', href: '/dashboard/store', icon: ShoppingCart },
      { name: 'Invoices & Payments', href: '/dashboard/invoices', icon: FileText },
    ],
  },
  {
    name: 'Creative',
    icon: Palette,
    items: [
      { name: 'Design Studio', href: '/dashboard/design', icon: Palette },
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
    icon: Zap,
    items: [
      { name: 'Chatbots', href: '/dashboard/chatbots', icon: MessageSquare },
      { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
      { name: 'Voice Calls', href: '/dashboard/voice', icon: PhoneCall },
      { name: 'Broadcasting', href: '/dashboard/broadcasts', icon: Radio },
    ],
  },
  {
    name: 'Build',
    icon: Building,
    items: [
      { name: 'Websites & Funnels', href: '/dashboard/websites', icon: Globe },
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
    icon: Settings,
    items: [
      { name: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3 },
      { name: 'Team & Roles', href: '/dashboard/team', icon: UserCog },
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
  const { user, logout } = useAuth()
  
  // Auto-expand the section that contains the current path
  const getInitialExpandedSections = () => {
    for (const section of navigation) {
      if (section.items.some(item => pathname.startsWith(item.href))) {
        return [section.name]
      }
    }
    return ['Core']
  }
  
  const [expandedSections, setExpandedSections] = useState<string[]>(getInitialExpandedSections)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const isItemActive = (href: string) => pathname === href
  const isSectionActive = (items: any[]) => items.some(item => pathname.startsWith(item.href))

  const getActiveSection = () => {
    for (const section of navigation) {
      if (isSectionActive(section.items)) {
        return section.name
      }
    }
    return null
  }

  const activeSection = getActiveSection()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">NEXUS</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <div className="space-y-1">
            {navigation.map((section) => {
              const isExpanded = expandedSections.includes(section.name)
              const hasActiveItem = isSectionActive(section.items)
              const sectionColor = hasActiveItem || isExpanded ? 'from-blue-500/20 to-purple-500/10' : ''
              const borderColor = hasActiveItem || isExpanded ? 'border-blue-500/50' : 'border-white/5'

              return (
                <div key={section.name} className="mb-1">
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                      hasActiveItem
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white border border-blue-500/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        hasActiveItem 
                          ? "bg-blue-500/20 text-blue-400" 
                          : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300"
                      )}>
                        <section.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{section.name}</span>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isExpanded ? "rotate-180 text-blue-400" : "text-slate-500"
                    )} />
                  </button>

                  {/* Dropdown items */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    isExpanded ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
                  )}>
                    <div className="ml-4 pl-2 border-l-2 border-slate-700/50 space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = isItemActive(item.href)
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              'group flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-150',
                              isActive
                                ? 'bg-blue-500/20 text-blue-400 font-medium shadow-sm'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-0.5'
                            )}
                          >
                            <item.icon className={cn(
                              'h-4 w-4 flex-shrink-0 transition-colors',
                              isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                            )} />
                            <span className="truncate">{item.name}</span>
                            {isActive && (
                              <ChevronRight className="h-3 w-3 ml-auto text-blue-400" />
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </nav>

        {/* User menu */}
        <div className="p-3 border-t border-white/10 bg-slate-900/50">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || 'user@nexus.demo'}
                </p>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-slate-400 transition-transform",
                showUserMenu && "rotate-180"
              )} />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl shadow-black/30 overflow-hidden">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Link>
                <div className="border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      logout()
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}