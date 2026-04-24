export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  avatar?: string
  role: 'admin' | 'owner' | 'manager' | 'staff' | 'viewer'
  plan: 'starter' | 'pro' | 'agency' | 'enterprise'
  email_verified: boolean
  two_fa_secret?: string
  two_fa_enabled: boolean
  last_login_at?: Date
  suspended: boolean
  suspended_reason?: string
  created_at: Date
}

export interface Session {
  id: string
  user_id: string
  token_hash: string
  ip?: string
  user_agent?: string
  expires_at: Date
  created_at: Date
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: 'Bearer'
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshRequest {
  refresh_token: string
}