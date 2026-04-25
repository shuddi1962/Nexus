'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient } from './api'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'owner' | 'manager' | 'staff' | 'viewer'
  plan: 'starter' | 'pro' | 'agency' | 'enterprise'
  avatar?: string
  email_verified: boolean
}

interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!tokens

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  // Set up token refresh timer
  useEffect(() => {
    if (tokens?.expires_in) {
      const refreshTime = (tokens.expires_in - 60) * 1000 // Refresh 1 minute before expiry
      const timer = setTimeout(() => {
        refreshTokens()
      }, refreshTime)

      return () => clearTimeout(timer)
    }
  }, [tokens])

  const initializeAuth = async () => {
    try {
      // Check if we have stored tokens
      const storedTokens = localStorage.getItem('auth_tokens')
      if (storedTokens) {
        const parsedTokens = JSON.parse(storedTokens)
        setTokens(parsedTokens)

        // Set tokens for API client
        apiClient.setTokens(parsedTokens)

        // Try to get current user
        try {
          const userData = await apiClient.getCurrentUser()
          setUser(userData)
        } catch (error) {
          // Tokens are invalid, clear them
          localStorage.removeItem('auth_tokens')
          setTokens(null)
          apiClient.setTokens(null)
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await apiClient.login(email, password)
      setUser(data.user)
      setTokens(data)

      // Set tokens for API client
      apiClient.setTokens(data)

      // Store tokens in localStorage
      localStorage.setItem('auth_tokens', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      }))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const data = await apiClient.register(email, password, name)
      setUser(data.user)
      setTokens(data)

      // Set tokens for API client
      apiClient.setTokens(data)

      // Store tokens in localStorage
      localStorage.setItem('auth_tokens', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      }))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (tokens) {
        await apiClient.logout(tokens.refresh_token)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API call success
      setUser(null)
      setTokens(null)
      apiClient.setTokens(null)
      localStorage.removeItem('auth_tokens')
    }
  }

  const refreshTokens = async () => {
    if (!tokens?.refresh_token) return

    try {
      const newTokens = await apiClient.refreshTokens(tokens.refresh_token)
      setTokens(newTokens)

      // Update API client tokens
      apiClient.setTokens(newTokens)

      // Update stored tokens
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
    }
  }

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshTokens,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}