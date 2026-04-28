import type { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerChatHubRoutes(fastify: FastifyInstance) {

  // Get chats
  fastify.get('/chat/chats', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.chats || 'chats')
        .select('*')
        .eq('org_id', orgId)
        .order('last_message_time', { ascending: false })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch chats', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get messages for a chat
  fastify.get('/chat/chats/:id/messages', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any

      const { data, error } = await insforge
        .from(collections.messages || 'messages')
        .select('*')
        .eq('chat_id', id)
        .order('timestamp', { ascending: true })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch messages', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Send message
  fastify.post('/chat/messages', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { chat_id, content, type } = request.body as any

      const { data, error } = await insforge
        .from(collections.messages || 'messages')
        .insert([{
          chat_id,
          sender_id: userId,
          sender: authRequest.user.name || 'User',
          content,
          type: type || 'text',
          status: 'sent',
          timestamp: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error

      // Update chat's last message
      await insforge
        .from(collections.chats || 'chats')
        .update({
          last_message: content.substring(0, 100),
          last_message_time: new Date().toISOString(),
        })
        .eq('id', chat_id)

      logger.info('Message sent', { chatId: chat_id, messageId: data.id })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to send message', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get integrations
  fastify.get('/chat/integrations', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.chatIntegrations || 'chat_integrations')
        .select('*')
        .eq('org_id', orgId)

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch integrations', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Connect integration
  fastify.post('/chat/integrations', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { name, platform } = request.body as any

      const { data, error } = await insforge
        .from(collections.chatIntegrations || 'chat_integrations')
        .insert([{
          org_id: orgId,
          name,
          platform,
          status: 'connected',
          last_sync: new Date().toISOString(),
          messages_count: 0,
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Chat integration connected', { integrationId: data.id, platform })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to connect integration', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
}
