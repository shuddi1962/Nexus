import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../services/auth'
import { logger } from '../lib/logger'

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string
    role: string
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.substring(7)
  const payload = AuthService.verifyAccessToken(token)

  if (!payload) {
    return reply.code(401).send({ error: 'Invalid or expired token' })
  }

  // Attach user to request
  ;(request as AuthenticatedRequest).user = {
    id: payload.userId,
    role: payload.role,
  }
}

export async function adminOnlyMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authRequest = request as AuthenticatedRequest

  if (!authRequest.user) {
    return reply.code(401).send({ error: 'Authentication required' })
  }

  if (authRequest.user.role !== 'admin') {
    return reply.code(403).send({ error: 'Admin access required' })
  }
}

export function roleMiddleware(allowedRoles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const authRequest = request as AuthenticatedRequest

    if (!authRequest.user) {
      return reply.code(401).send({ error: 'Authentication required' })
    }

    if (!allowedRoles.includes(authRequest.user.role)) {
      return reply.code(403).send({ error: 'Insufficient permissions' })
    }
  }
}