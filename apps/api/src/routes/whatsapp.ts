import type { FastifyInstance } from 'fastify'
import { insforge } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerWhatsAppRoutes(fastify: FastifyInstance) {

  // Get WhatsApp conversations
  fastify.get('/whatsapp/conversations', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { page = '1', limit = '20', status } = request.query as any
      const user = (request as any).user

      let query = insforge.from('whatsapp_conversations')
        .select('*')
        .eq('org_id', user.org_id)

      if (status) {
        query = query.eq('status', status)
      }

      const conversations = await query
        .order('last_message_at', { ascending: false })
        .range((+page - 1) * +limit, +page * +limit - 1)

      return { conversations: conversations.data || [], total: conversations.count || 0 }
    } catch (error: any) {
      logger.error('Get WhatsApp conversations error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get conversations' })
    }
  })

  // Get conversation messages
  fastify.get('/whatsapp/conversations/:id/messages', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const user = (request as any).user

      const messages = await insforge.from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', id)
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: true })

      return { messages: messages.data || [] }
    } catch (error: any) {
      logger.error('Get WhatsApp messages error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get messages' })
    }
  })

  // Send WhatsApp message
  fastify.post('/whatsapp/send', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const { to, message, conversation_id, type = 'text' } = request.body as any

      if (!to || !message) {
        return reply.code(400).send({ error: 'Recipient and message are required' })
      }

      // Get WhatsApp credentials from vault
      const vaultResult = await insforge.from('api_keys_vault')
        .select('*')
        .eq('provider', 'whatsapp')
        .eq('active', true)
        .limit(1)
        .single()

      if (!vaultResult.data) {
        return reply.code(400).send({ error: 'WhatsApp not configured. Please configure in Admin > API Vault.' })
      }

      // TODO: Integrate with Twilio WhatsApp Business API
      logger.info(`WhatsApp message send requested to ${to} by user ${user.id}`)

      // Find or create conversation
      let conversationId = conversation_id
      if (!conversationId) {
        const existingConv = await insforge.from('whatsapp_conversations')
          .select('*')
          .eq('org_id', user.org_id)
          .eq('phone', to)
          .single()

        if (existingConv.data) {
          conversationId = existingConv.data.id
        } else {
          const newConv = await insforge.from('whatsapp_conversations').insert({
            org_id: user.org_id,
            phone: to,
            name: to,
            status: 'active',
            last_message_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }).select().single()

          conversationId = newConv.data?.id
        }
      }

      // Save message
      const savedMessage = await insforge.from('whatsapp_messages').insert({
        org_id: user.org_id,
        conversation_id: conversationId,
        content: message,
        sender: 'user',
        type,
        status: 'sent',
        created_at: new Date().toISOString(),
      }).select().single()

      return {
        success: true,
        message: 'Message queued for sending',
        message_id: savedMessage.data?.id,
      }
    } catch (error: any) {
      logger.error('Send WhatsApp message error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to send message' })
    }
  })

  // Get WhatsApp templates
  fastify.get('/whatsapp/templates', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const templates = await insforge.from('whatsapp_templates')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false })

      return { templates: templates.data || [] }
    } catch (error: any) {
      logger.error('Get WhatsApp templates error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get templates' })
    }
  })

  // Get WhatsApp analytics
  fastify.get('/whatsapp/analytics', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const conversations = await insforge.from('whatsapp_conversations')
        .select('*')
        .eq('org_id', user.org_id)

      const messages = await insforge.from('whatsapp_messages')
        .select('*')
        .eq('org_id', user.org_id)

      const analytics = {
        total_conversations: conversations.data?.length || 0,
        active_conversations: conversations.data?.filter(c => c.status === 'active').length || 0,
        total_messages: messages.data?.length || 0,
        messages_sent: messages.data?.filter(m => m.sender === 'user').length || 0,
        messages_received: messages.data?.filter(m => m.sender === 'contact').length || 0,
      }

      return { analytics }
    } catch (error: any) {
      logger.error('Get WhatsApp analytics error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get analytics' })
    }
  })

  logger.info('WhatsApp routes registered')
}
