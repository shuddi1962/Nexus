import { FastifyInstance } from 'fastify'
import { AuthService } from '../services/auth'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'
import { insforge, collections } from '../lib/insforge'

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

  // Login
  app.post('/auth/login', async (request, reply) => {
    try {
      const { email, password } = request.body as {
        email: string
        password: string
      }

      const user = await AuthService.findUserByEmail(email)
      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' })
      }

      const isValidPassword = await AuthService.verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' })
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
      })
    } catch (error) {
      logger.error('Get me error', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}