import type { FastifyInstance } from 'fastify'
import { getInsForgeClient } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerSMSRoutes(fastify: FastifyInstance) {
  const insforge = getInsForgeClient()

  // Get SMS campaigns
  fastify.get('/sms/campaigns', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { page = '1', limit = '20', status } = request.query as any
      const user = (request as any).user

      let query = insforge.from('sms_campaigns')
        .select('*')
        .eq('org_id', user.org_id)

      if (status) {
        query = query.eq('status', status)
      }

      const campaigns = await query
        .order('created_at', { ascending: false })
        .range((+page - 1) * +limit, +page * +limit - 1)

      return { campaigns: campaigns.data || [], total: campaigns.count || 0 }
    } catch (error: any) {
      logger.error('Get SMS campaigns error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get campaigns' })
    }
  })

  // Create SMS campaign
  fastify.post('/sms/campaigns', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const campaignData = request.body as any

      const campaign = await insforge.from('sms_campaigns').insert({
        org_id: user.org_id,
        name: campaignData.name,
        message: campaignData.message,
        status: 'draft',
        recipients_count: 0,
        sent_count: 0,
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, campaign: campaign.data }
    } catch (error: any) {
      logger.error('Create SMS campaign error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create campaign' })
    }
  })

  // Send SMS
  fastify.post('/sms/send', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const { to, message } = request.body as { to: string; message: string }

      if (!to || !message) {
        return reply.code(400).send({ error: 'Phone number and message are required' })
      }

      // TODO: Integrate with Twilio or other SMS provider
      logger.info(`SMS send requested to ${to} by user ${user.id}`)

      return {
        success: true,
        message: 'SMS queued for sending',
        to,
        message_length: message.length,
      }
    } catch (error: any) {
      logger.error('Send SMS error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to send SMS' })
    }
  })

  // Get SMS templates
  fastify.get('/sms/templates', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const templates = await insforge.from('sms_templates')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false })

      return { templates: templates.data || [] }
    } catch (error: any) {
      logger.error('Get SMS templates error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get templates' })
    }
  })

  logger.info('SMS routes registered')
}
