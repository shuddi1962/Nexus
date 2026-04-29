import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'

export default async function broadcastRoutes(fastify: FastifyInstance) {
  // Get all broadcasts
  fastify.get('/', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const { data, error } = await fastify.insforge
        .from('broadcasts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      reply.status(500).send({ error: error.message })
    }
  })

  // Create broadcast
  fastify.post('/', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const { name, type, channels, message, scheduled_at } = request.body as any

      const { data, error } = await fastify.insforge
        .from('broadcasts')
        .insert({
          user_id: userId,
          name,
          type,
          channels,
          message,
          scheduled_at,
          status: 'draft',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      reply.status(500).send({ error: error.message })
    }
  })

  // Send broadcast
  fastify.post('/:id/send', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const userId = (request as any).user.id

      // Get broadcast
      const { data: broadcast, error } = await fastify.insforge
        .from('broadcasts')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error || !broadcast) {
        return reply.status(404).send({ error: 'Broadcast not found' })
      }

      // Update status to sending
      await fastify.insforge
        .from('broadcasts')
        .update({ status: 'sending', sent_at: new Date().toISOString() })
        .eq('id', id)

      // Queue broadcast job (would integrate with actual channels)
      // This is where you'd integrate with email/SMS/WhatsApp APIs

      // Simulate sending (in production, this would be a background job)
      setTimeout(async () => {
        await fastify.insforge
          .from('broadcasts')
          .update({ status: 'sent', recipients: 0 })
          .eq('id', id)
      }, 1000)

      return { success: true, message: 'Broadcast queued for sending' }
    } catch (error: any) {
      reply.status(500).send({ error: error.message })
    }
  })

  // Get broadcast stats
  fastify.get('/stats', {
    preHandler: authMiddleware
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id

      const { count: total } = await fastify.insforge
        .from('broadcasts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      const { count: sent } = await fastify.insforge
        .from('broadcasts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'sent')

      const { count: draft } = await fastify.insforge
        .from('broadcasts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'draft')

      return {
        success: true,
        data: {
          total: total || 0,
          sent: sent || 0,
          draft: draft || 0
        }
      }
    } catch (error: any) {
      reply.status(500).send({ error: error.message })
    }
  })
}
