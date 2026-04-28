import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../lib/env'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'
import { User, AuthTokens, RegisterRequest, LoginRequest } from '../types/auth'
import { randomBytes } from 'crypto'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import nodemailer from 'nodemailer'

// Email transporter
const transporter = nodemailer.createTransport({
  host: env.SYSTEM_SMTP_HOST,
  port: env.SYSTEM_SMTP_PORT,
  secure: env.SYSTEM_SMTP_PORT === 465,
  auth: {
    user: env.SYSTEM_SMTP_USER,
    pass: env.SYSTEM_SMTP_PASS,
  },
})

// Generate verification/reset tokens
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

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

  // Email Verification
  static async sendVerificationEmail(userId: string, email: string): Promise<void> {
    try {
      const token = generateToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Store token in email_verifications table
      await insforge.post(`/collections/${collections.email_verifications}`, {
        email,
        token,
        expires_at: expiresAt.toISOString(),
      })

      // Send verification email
      const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`

      await transporter.sendMail({
        from: env.SYSTEM_FROM_EMAIL,
        to: email,
        subject: 'Verify your NEXUS account',
        html: `
          <div style="font-family: Instrument Sans, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1A1A2E;">Welcome to NEXUS!</h1>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6C47FF, #0652DD); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
              Verify Email
            </a>
            <p>Or copy and paste this link: ${verificationUrl}</p>
            <p><strong>This link expires in 24 hours.</strong></p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `,
      })

      logger.info('Verification email sent', { userId, email })
    } catch (error) {
      logger.error('Failed to send verification email', { error, userId, email })
      throw error
    }
  }

  static async verifyEmail(token: string, email: string): Promise<boolean> {
    try {
      const result = await insforge.get(`/collections/${collections.email_verifications}`, {
        params: {
          email: `eq.${email}`,
          token: `eq.${token}`,
        },
      })

      if (result.data.length === 0) {
        return false
      }

      const verification = result.data[0]

      // Check if expired
      if (new Date(verification.expires_at) < new Date()) {
        return false
      }

      // Update user as verified
      const users = await insforge.get(`/collections/${collections.users}`, {
        params: { email: `eq.${email}` },
      })

      if (users.data.length === 0) {
        return false
      }

      await insforge.patch(`/collections/${collections.users}/${users.data[0].id}`, {
        email_verified: true,
      })

      // Delete used token
      await insforge.delete(`/collections/${collections.email_verifications}/${verification.id}`)

      logger.info('Email verified successfully', { email })
      return true
    } catch (error) {
      logger.error('Email verification failed', { error, email })
      return false
    }
  }

  // 2FA Methods
  static generate2FASecret(email: string): { secret: string; otpauth_url: string } {
    const secret = speakeasy.generateSecret({
      name: `NEXUS (${email})`,
      issuer: 'NEXUS',
    })

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url || '',
    }
  }

  static async generate2FAQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await qrcode.toDataURL(otpauthUrl)
    } catch (error) {
      logger.error('Failed to generate QR code', { error })
      throw error
    }
  }

  static verify2FAToken(token: string, secret: string): boolean {
    try {
      return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
      })
    } catch (error) {
      logger.error('2FA token verification failed', { error })
      return false
    }
  }

  static async enable2FA(userId: string, secret: string): Promise<void> {
    await insforge.patch(`/collections/${collections.users}/${userId}`, {
      two_fa_secret: secret,
      two_fa_enabled: true,
    })
    logger.info('2FA enabled', { userId })
  }

  static async disable2FA(userId: string): Promise<void> {
    await insforge.patch(`/collections/${collections.users}/${userId}`, {
      two_fa_secret: null,
      two_fa_enabled: false,
    })
    logger.info('2FA disabled', { userId })
  }

  // Password Reset
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await this.findUserByEmail(email)
      if (!user) {
        // Don't reveal user existence
        logger.info('Password reset requested for non-existent user', { email })
        return
      }

      const token = generateToken()
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

      // Store reset token (reuse email_verifications table or create password_resets)
      await insforge.post(`/collections/${collections.email_verifications}`, {
        email,
        token,
        expires_at: expiresAt.toISOString(),
        type: 'password_reset',
      })

      // Send reset email
      const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

      await transporter.sendMail({
        from: env.SYSTEM_FROM_EMAIL,
        to: email,
        subject: 'Reset your NEXUS password',
        html: `
          <div style="font-family: Instrument Sans, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1A1A2E;">Password Reset Request</h1>
            <p>You requested to reset your password. Click the button below:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6C47FF, #0652DD); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
              Reset Password
            </a>
            <p>Or copy and paste this link: ${resetUrl}</p>
            <p><strong>This link expires in 1 hour.</strong></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      })

      logger.info('Password reset email sent', { email })
    } catch (error) {
      logger.error('Failed to send password reset email', { error, email })
      throw error
    }
  }

  static async resetPassword(token: string, email: string, newPassword: string): Promise<boolean> {
    try {
      const result = await insforge.get(`/collections/${collections.email_verifications}`, {
        params: {
          email: `eq.${email}`,
          token: `eq.${token}`,
        },
      })

      if (result.data.length === 0) {
        return false
      }

      const resetRequest = result.data[0]

      // Check if expired
      if (new Date(resetRequest.expires_at) < new Date()) {
        return false
      }

      // Update password
      const users = await insforge.get(`/collections/${collections.users}`, {
        params: { email: `eq.${email}` },
      })

      if (users.data.length === 0) {
        return false
      }

      const passwordHash = await this.hashPassword(newPassword)

      await insforge.patch(`/collections/${collections.users}/${users.data[0].id}`, {
        password_hash: passwordHash,
      })

      // Delete all sessions for this user (force re-login)
      const sessions = await insforge.get(`/collections/${collections.sessions}`, {
        params: { user_id: `eq.${users.data[0].id}` },
      })

      for (const session of sessions.data) {
        await insforge.delete(`/collections/${collections.sessions}/${session.id}`)
      }

      // Delete used token
      await insforge.delete(`/collections/${collections.email_verifications}/${resetRequest.id}`)

      logger.info('Password reset successfully', { email })
      return true
    } catch (error) {
      logger.error('Password reset failed', { error, email })
      return false
    }
  }
}