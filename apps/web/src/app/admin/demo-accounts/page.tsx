'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, ExternalLink, RefreshCw, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const DEMO_ACCOUNTS = [
  {
    email: "admin@nexus.demo",
    password: "NexusAdmin2025!",
    name: "Platform Admin",
    role: "admin",
    url: "/admin",
    plan: "Platform Admin",
    description: "Full platform admin — API Vault, all users, billing, system settings"
  },
  {
    email: "owner@nexus.demo",
    password: "NexusOwner2025!",
    name: "Agency Owner",
    role: "owner",
    plan: "agency",
    url: "/dashboard",
    description: "Agency plan — 20 workspaces, white-label, all features"
  },
  {
    email: "pro@nexus.demo",
    password: "NexusPro2025!",
    name: "Pro User",
    role: "owner",
    plan: "pro",
    url: "/dashboard",
    description: "Pro plan — all marketing, ads, creative, CRM features"
  },
  {
    email: "starter@nexus.demo",
    password: "NexusStarter2025!",
    name: "Starter User",
    role: "owner",
    plan: "starter",
    url: "/dashboard",
    description: "Starter plan — basic CRM, email, 50 AI pieces/mo"
  },
  {
    email: "staff@nexus.demo",
    password: "NexusStaff2025!",
    name: "Team Member",
    role: "staff",
    plan: "Pro (Staff)",
    url: "/dashboard",
    description: "Staff role under pro org — limited permissions"
  }
]

export default function DemoAccountsPage() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const copyCredentials = async (email: string, password: string) => {
    try {
      await navigator.clipboard.writeText(`${email}:${password}`)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch {
      alert('Failed to copy credentials')
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nexus-text-primary">Demo Accounts</h1>
        <p className="text-nexus-text-secondary mt-2">
          These accounts are automatically created and can be used for testing different user roles and plans.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-nexus-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-nexus-border bg-nexus-bg-secondary">
              <th className="text-left py-3 px-4 font-medium text-nexus-text-secondary">Role</th>
              <th className="text-left py-3 px-4 font-medium text-nexus-text-secondary">Email</th>
              <th className="text-left py-3 px-4 font-medium text-nexus-text-secondary">Password</th>
              <th className="text-left py-3 px-4 font-medium text-nexus-text-secondary">URL</th>
              <th className="text-left py-3 px-4 font-medium text-nexus-text-secondary">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-nexus-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ACCOUNTS.map((account) => (
              <tr key={account.email} className="border-b border-nexus-border hover:bg-nexus-bg-secondary/50">
                <td className="py-3 px-4">
                  <Badge variant="outline">{account.role}</Badge>
                </td>
                <td className="py-3 px-4 font-mono text-sm text-nexus-text-primary">{account.email}</td>
                <td className="py-3 px-4 font-mono text-sm text-nexus-text-primary">{account.password}</td>
                <td className="py-3 px-4">
                  <a href={account.url} className="text-nexus-blue hover:underline text-sm">{account.url}</a>
                </td>
                <td className="py-3 px-4">
                  <Badge className="bg-nexus-violet-light text-nexus-violet">{account.plan}</Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCredentials(account.email, account.password)}
                    >
                      {copiedEmail === account.email ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copiedEmail === account.email ? 'Copied' : 'Copy'}
                    </Button>
                    <a
                      href={account.url}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-nexus-border bg-white hover:bg-nexus-bg-secondary h-9 px-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}