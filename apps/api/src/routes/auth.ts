import { FastifyInstance } from 'fastify'
import { AuthService } from '../services/auth'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'
import { insforge, collections } from '../lib/insforge'
import { randomBytes } from 'crypto'
import axios from 'axios'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/oauth/google/callback'

export async function authRoutes(app: FastifyInstance) {
  // Register
  app.post('/auth/register', async (request, reply) => {
    try {
      const { email, password, name } = request.body as {
        email: string
        password: string
        name: string
      }

      // Check if user exists
      const existingUser = await AuthService.findUserByEmail(email)
      if (existingUser) {
        return reply.code(409).send({ error: 'User already exists' })
      }

      // Create user
      const user = await AuthService.createUser({ email, password, name })

      // TODO: Send email verification

      // Create session
      const tokens = await AuthService.createSession(user.id, request.ip, request.headers['user-agent'])

      reply.code(201).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        },
        ...tokens,
      })
    } catch (error) {
      logger.error('Registration error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Refresh token
  app.post('/auth/refresh', async (request, reply) => {
    try {
      const { refresh_token } = request.body as { refresh_token: string }

      const user = await AuthService.validateRefreshToken(refresh_token)
      if (!user) {
        return reply.code(401).send({ error: 'Invalid refresh token' })
      }

      // Create new session
      const tokens = await AuthService.createSession(user.id, request.ip, request.headers['user-agent'])

      reply.send(tokens)
    } catch (error) {
      logger.error('Refresh token error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Logout
  app.post('/auth/logout', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { refresh_token } = request.body as { refresh_token: string }
      const authRequest = request as any

      await AuthService.revokeSession(authRequest.user.id, refresh_token)

      reply.send({ message: 'Logged out successfully' })
    } catch (error) {
      logger.error('Logout error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Me (get current user)
  app.get('/auth/me', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const user = await AuthService.findUserById(authRequest.user.id)

      if (!user) {
        return reply.code(404).send({ error: 'User not found' })
      }

      reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
        email_verified: user.email_verified,
        two_fa_enabled: user.two_fa_enabled,
      })
    } catch (error) {
      logger.error('Get me error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Verify Email
  app.post('/auth/verify-email', async (request, reply) => {
    try {
      const { token, email } = request.body as { token: string; email: string }

      if (!token || !email) {
        return reply.code(400).send({ error: 'Token and email are required' })
      }

      const success = await AuthService.verifyEmail(token, email)

      if (!success) {
        return reply.code(400).send({ error: 'Invalid or expired verification token' })
      }

      reply.send({ message: 'Email verified successfully' })
    } catch (error) {
      logger.error('Email verification error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Resend verification email
  app.post('/auth/resend-verification', async (request, reply) => {
    try {
      const { email } = request.body as { email: string }

      if (!email) {
        return reply.code(400).send({ error: 'Email is required' })
      }

      const user = await AuthService.findUserByEmail(email)

      if (!user) {
        // Don't reveal user existence
        return reply.send({ message: 'If the email exists, a verification email has been sent' })
      }

      if (user.email_verified) {
        return reply.code(400).send({ error: 'Email is already verified' })
      }

      await AuthService.sendVerificationEmail(user.id, email)

      reply.send({ message: 'Verification email sent' })
    } catch (error) {
      logger.error('Resend verification error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // 2FA Setup - Generate secret
  app.post('/auth/2fa/setup', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const user = await AuthService.findUserById(authRequest.user.id)

      if (!user) {
        return reply.code(404).send({ error: 'User not found' })
      }

      const { secret, otpauth_url } = AuthService.generate2FASecret(user.email)

      // Return secret and URL (don't enable yet - wait for verification)
      reply.send({
        secret,
        otpauth_url,
        message: 'Scan the QR code with your authenticator app, then verify with a token',
      })
    } catch (error) {
      logger.error('2FA setup error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // 2FA QR Code
  app.post('/auth/2fa/qrcode', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { otpauth_url } = request.body as { otpauth_url: string }

      if (!otpauth_url) {
        return reply.code(400).send({ error: 'otpauth_url is required' })
      }

      const qrCodeDataURL = await AuthService.generate2FAQRCode(otpauth_url)

      reply.send({ qr_code: qrCodeDataURL })
    } catch (error) {
      logger.error('2FA QR code error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // 2FA Verify token
  app.post('/auth/2fa/verify', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const { token, secret } = request.body as { token: string; secret: string }

      if (!token || !secret) {
        return reply.code(400).send({ error: 'Token and secret are required' })
      }

      const isValid = AuthService.verify2FAToken(token, secret)

      if (!isValid) {
        return reply.code(400).send({ error: 'Invalid 2FA token' })
      }

      reply.send({ verified: true, message: 'Token verified. You can now enable 2FA.' })
    } catch (error) {
      logger.error('2FA verify error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // 2FA Enable
  app.post('/auth/2fa/enable', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const { secret } = request.body as { secret: string }

      if (!secret) {
        return reply.code(400).send({ error: 'Secret is required' })
      }

      await AuthService.enable2FA(authRequest.user.id, secret)

      reply.send({ message: '2FA enabled successfully' })
    } catch (error) {
      logger.error('2FA enable error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // 2FA Disable
  app.post('/auth/2fa/disable', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const { token } = request.body as { token: string }

      const user = await AuthService.findUserById(authRequest.user.id)

      if (!user || !user.two_fa_enabled || !user.two_fa_secret) {
        return reply.code(400).send({ error: '2FA is not enabled' })
      }

      if (token) {
        const isValid = AuthService.verify2FAToken(token, user.two_fa_secret)
        if (!isValid) {
          return reply.code(400).send({ error: 'Invalid 2FA token' })
        }
      }

      await AuthService.disable2FA(authRequest.user.id)

      reply.send({ message: '2FA disabled successfully' })
    } catch (error) {
      logger.error('2FA disable error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Password Reset Request
  app.post('/auth/password-reset/request', async (request, reply) => {
    try {
      const { email } = request.body as { email: string }

      if (!email) {
        return reply.code(400).send({ error: 'Email is required' })
      }

      await AuthService.requestPasswordReset(email)

      // Always return success to prevent email enumeration
      reply.send({ message: 'If the email exists, a password reset link has been sent' })
    } catch (error) {
      logger.error('Password reset request error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Password Reset Confirm
  app.post('/auth/password-reset/confirm', async (request, reply) => {
    try {
      const { token, email, new_password } = request.body as {
        token: string
        email: string
        new_password: string
      }

      if (!token || !email || !new_password) {
        return reply.code(400).send({ error: 'Token, email, and new password are required' })
      }

      if (new_password.length < 8) {
        return reply.code(400).send({ error: 'Password must be at least 8 characters' })
      }

      const success = await AuthService.resetPassword(token, email, new_password)

      if (!success) {
        return reply.code(400).send({ error: 'Invalid or expired reset token' })
      }

      reply.send({ message: 'Password reset successfully' })
    } catch (error) {
      logger.error('Password reset confirm error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Login with 2FA support
  app.post('/auth/login', async (request, reply) => {
    try {
      const { email, password, two_fa_token } = request.body as {
        email: string
        password: string
        two_fa_token?: string
      }

      const user = await AuthService.findUserByEmail(email)
      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' })
      }

      const isValidPassword = await AuthService.verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' })
      }

      // Check 2FA
      if (user.two_fa_enabled && user.two_fa_secret) {
        if (!two_fa_token) {
          return reply.code(401).send({
            error: '2FA token required',
            two_fa_required: true,
          })
        }

        const isValid2FA = AuthService.verify2FAToken(two_fa_token, user.two_fa_secret)
        if (!isValid2FA) {
          return reply.code(401).send({ error: 'Invalid 2FA token' })
        }
      }

      if (user.suspended) {
        return reply.code(403).send({ error: 'Account suspended' })
      }

      // Update last login
      await insforge.patch(`/collections/${collections.users}/${user.id}`, {
        last_login_at: new Date().toISOString(),
      })

      // Create session
      const tokens = await AuthService.createSession(user.id, request.ip, request.headers['user-agent'])

      reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        },
...tokens,
        })
    } catch (error) {
      logger.error('Login error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Google OAuth - Get authorization URL
  app.get('/auth/oauth/google', async (request, reply) => {
    const state = randomBytes(32).toString('hex')
    
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=openid%20email%20profile&access_type=offline&state=${state}`

    reply.send({ oauth_url: oauthUrl, state })
  })

  // Google OAuth callback
  app.get('/auth/oauth/google/callback', async (request, reply) => {
    try {
      const { code, state } = request.query as { code: string; state: string }

      if (!code) {
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_code`)
      }

      // Exchange code for tokens
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      })

      const { access_token, id_token } = tokenResponse.data

      // Get user info from Google
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      })

      const { email, name, picture } = userInfoResponse.data

      // Find or create user
      let user = await AuthService.findUserByEmail(email)

      if (!user) {
        // Create new user
        const newUser = await AuthService.createUser({
          email,
          name: name || email.split('@')[0],
          password: randomBytes(32).toString('hex'), // Random password for OAuth users
        })

        user = newUser

        // Update with Google info
        await insforge.patch(`/collections/${collections.users}/${user.id}`, {
          avatar: picture,
          email_verified: true,
        })
      }

      if (user.suspended) {
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=suspended`)
      }

      // Create session
      const tokens = await AuthService.createSession(user.id, request.ip, request.headers['user-agent'])

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      const redirectUrl = new URL(`${frontendUrl}/dashboard`)
      redirectUrl.searchParams.set('access_token', tokens.access_token)
      redirectUrl.searchParams.set('refresh_token', tokens.refresh_token)
      redirectUrl.searchParams.set('oauth', 'true')

      reply.redirect(redirectUrl.toString())
    } catch (error) {
      logger.error('Google OAuth callback error', { error })
      reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`)
    }
  })

  // LinkedIn OAuth - Get authorization URL
  app.get('/auth/oauth/linkedin', async (request, reply) => {
    const clientId = process.env.LINKEDIN_CLIENT_ID || ''
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3001/auth/oauth/linkedin/callback'
    const state = randomBytes(32).toString('hex')

    const oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=r_liteprofile%20r_emailaddress&state=${state}`

    reply.send({ oauth_url: oauthUrl, state })
  })

  // LinkedIn OAuth callback
  app.get('/auth/oauth/linkedin/callback', async (request, reply) => {
    try {
      const { code, state } = request.query as { code: string; state: string }

      if (!code) {
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_code`)
      }

      const clientId = process.env.LINKEDIN_CLIENT_ID || ''
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || ''
      const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3001/auth/oauth/linkedin/callback'

      // Exchange code for tokens
      const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )

      const { access_token } = tokenResponse.data

      // Get user info from LinkedIn
      const [profileResponse, emailResponse] = await Promise.all([
        axios.get('https://api.linkedin.com/v2/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        }),
        axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
          headers: { Authorization: `Bearer ${access_token}` },
        }),
      ])

      const profile = profileResponse.data
      const emailData = emailResponse.data
      const email = emailData?.elements?.[0]?.['handle~']?.emailAddress || `${profile.id}@linkedin.local`
      const name = `${profile.localizedFirstName || ''} ${profile.localizedLastName || ''}`.trim() || email.split('@')[0]

      // Find or create user
      let user = await AuthService.findUserByEmail(email)

      if (!user) {
        const newUser = await AuthService.createUser({
          email,
          name,
          password: randomBytes(32).toString('hex'),
        })
        user = newUser
      }

      if (user.suspended) {
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=suspended`)
      }

      // Create session
      const tokens = await AuthService.createSession(user.id, request.ip, request.headers['user-agent'])

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      const redirectUrl = new URL(`${frontendUrl}/dashboard`)
      redirectUrl.searchParams.set('access_token', tokens.access_token)
      redirectUrl.searchParams.set('refresh_token', tokens.refresh_token)
      redirectUrl.searchParams.set('oauth', 'true')

      reply.redirect(redirectUrl.toString())
    } catch (error) {
      logger.error('LinkedIn OAuth callback error', { error })
      reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`)
    }
  })

  // Get all active sessions for current user
  app.get('/auth/sessions', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const sessions = await AuthService.getUserSessions(authRequest.user.id)
      
      reply.send(sessions)
    } catch (error) {
      logger.error('Get sessions error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Revoke all sessions (logout everywhere)
  app.post('/auth/sessions/revoke-all', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      await AuthService.revokeAllSessions(authRequest.user.id)
      
      reply.send({ message: 'All sessions revoked successfully' })
    } catch (error) {
      logger.error('Revoke all sessions error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Revoke specific session
  app.post('/auth/sessions/revoke', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { refresh_token } = request.body as { refresh_token: string }
      const authRequest = request as any
      
      await AuthService.revokeSession(authRequest.user.id, refresh_token)
      
      reply.send({ message: 'Session revoked successfully' })
    } catch (error) {
      logger.error('Revoke session error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}