'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <div className="text-2xl font-bold text-gray-900">NEXUS</div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-8">
          {navigation.map((section) => (
            <div key={section.name}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.name}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 h-5 w-5 flex-shrink-0',
                          isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
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
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">User Name</p>
            <p className="text-xs text-gray-500 truncate">user@nexus.demo</p>
          </div>
        </div>
      </div>
    </div>
  )
}