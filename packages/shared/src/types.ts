// Shared types between frontend and backend

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'owner' | 'manager' | 'staff' | 'viewer'
  plan: 'starter' | 'pro' | 'agency' | 'enterprise'
  email_verified: boolean
  created_at: string
}

export interface Organization {
  id: string
  name: string
  owner_id: string
  logo?: string
  domain?: string
  white_label_config: Record<string, any>
  settings: Record<string, any>
  plan: string
  created_at: string
}

export interface ApiKey {
  id: string
  provider: string
  category: string
  label?: string
  test_status: 'active' | 'invalid' | 'untested' | 'expired'
  usage_this_month: number
  active: boolean
  created_at: string
}