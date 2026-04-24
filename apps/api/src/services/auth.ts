import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../lib/env'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'
import { User, AuthTokens, RegisterRequest, LoginRequest } from '../types/auth'
import { randomBytes } from 'crypto'

export class AuthService {
  private static readonly SALT_ROUNDS = 12
  private static readonly ACCESS_TOKEN_EXPIRY = '15m'
  private static readonly REFRESH_TOKEN_EXPIRY = '7d'

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static generateAccessToken(payload: { userId: string; role: string }): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    })
  }

  static generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    })
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET)
    } catch (error) {
      logger.error('Invalid access token', { error })
      return null
    }
  }

  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET)
    } catch (error) {
      logger.error('Invalid refresh token', { error })
      return null
    }
  }

  static async createUser(data: RegisterRequest): Promise<User> {
    const passwordHash = await this.hashPassword(data.password)

    const user = {
      email: data.email,
      password_hash: passwordHash,
      name: data.name,
      role: 'owner' as const,
      plan: 'starter' as const,
      email_verified: false,
      two_fa_enabled: false,
      suspended: false,
    }

    const result = await insforge.post(`/collections/${collections.users}`, user)
    return result.data
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await insforge.get(`/collections/${collections.users}`, {
        params: { email: `eq.${email}` }
      })
      return result.data.length > 0 ? result.data[0] : null
    } catch (error) {
      logger.error('Error finding user by email', { error, email })
      return null
    }
  }

  static async findUserById(id: string): Promise<User | null> {
    try {
      const result = await insforge.get(`/collections/${collections.users}/${id}`)
      return result.data
    } catch (error) {
      logger.error('Error finding user by ID', { error, id })
      return null
    }
  }

  static async createSession(userId: string, ip?: string, userAgent?: string): Promise<AuthTokens> {
    const accessPayload = { userId, role: 'owner' } // TODO: get actual role
    const refreshPayload = { userId }

    const accessToken = this.generateAccessToken(accessPayload)
    const refreshToken = this.generateRefreshToken(refreshPayload)

    // Hash the refresh token for storage
    const refreshTokenHash = await bcrypt.hash(refreshToken, this.SALT_ROUNDS)

    const session = {
      user_id: userId,
      token_hash: refreshTokenHash,
      ip,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }

    await insforge.post(`/collections/${collections.sessions}`, session)

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 15 * 60, // 15 minutes
      token_type: 'Bearer',
    }
  }

  static async validateRefreshToken(refreshToken: string): Promise<User | null> {
    const payload = this.verifyRefreshToken(refreshToken)
    if (!payload) return null

    const user = await this.findUserById(payload.userId)
    if (!user) return null

    // Find and validate session
    const sessions = await insforge.get(`/collections/${collections.sessions}`, {
      params: { user_id: `eq.${user.id}` }
    })

    for (const session of sessions.data) {
      if (await bcrypt.compare(refreshToken, session.token_hash)) {
        if (new Date(session.expires_at) > new Date()) {
          return user
        }
        // Clean up expired session
        await insforge.delete(`/collections/${collections.sessions}/${session.id}`)
      }
    }

    return null
  }

  static async revokeSession(userId: string, refreshToken: string): Promise<void> {
    const sessions = await insforge.get(`/collections/${collections.sessions}`, {
      params: { user_id: `eq.${userId}` }
    })

    for (const session of sessions.data) {
      if (await bcrypt.compare(refreshToken, session.token_hash)) {
        await insforge.delete(`/collections/${collections.sessions}/${session.id}`)
        break
      }
    }
  }
}