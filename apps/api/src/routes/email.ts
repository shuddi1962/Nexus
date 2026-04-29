import type { FastifyInstance } from 'fastify'
import { insforge } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'
import axios from 'axios'

export async function registerEmailRoutes(fastify: FastifyInstance) {

  // Get email campaigns
  fastify.get('/email/campaigns', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { page = '1', limit = '20', status } = request.query as any
      const user = (request as any).user

      let query = insforge.from('email_campaigns')
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
      logger.error('Get email campaigns error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get campaigns' })
    }
  })

  // Create email campaign
  fastify.post('/email/campaigns', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const campaignData = request.body as any

      const campaign = await insforge.from('email_campaigns').insert({
        org_id: user.org_id,
        name: campaignData.name,
        subject: campaignData.subject,
        content: campaignData.content || '',
        status: 'draft',
        recipients_count: 0,
        sent_count: 0,
        open_count: 0,
        click_count: 0,
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, campaign: campaign.data }
    } catch (error: any) {
      logger.error('Create email campaign error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create campaign' })
    }
  })

  // Send email
  fastify.post('/email/send', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const { to, subject, content, campaign_id } = request.body as any

      if (!to || !subject || !content) {
        return reply.code(400).send({ error: 'Recipient, subject, and content are required' })
      }

      // Get email provider credentials from vault
      const vaultResult = await insforge.from('api_keys_vault')
        .select('*')
        .eq('category', 'email')
        .eq('active', true)
        .limit(1)
        .single()

      const provider = vaultResult.data

      if (!provider) {
        return reply.code(400).send({ error: 'No email provider configured. Please configure in Admin > API Vault.' })
      }

      // TODO: Integrate with SendGrid/Mailgun based on provider.provider
      logger.info(`Email send requested to ${to} by user ${user.id}`)

      // Log the send
      await insforge.from('email_logs').insert({
        org_id: user.org_id,
        campaign_id: campaign_id || null,
        recipient: to,
        subject,
        status: 'queued',
        sent_at: new Date().toISOString(),
      })

      return {
        success: true,
        message: 'Email queued for sending',
        to,
        subject,
      }
    } catch (error: any) {
      logger.error('Send email error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to send email' })
    }
  })

  // Get email templates
  fastify.get('/email/templates', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const templates = await insforge.from('email_templates')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false })

      return { templates: templates.data || [] }
    } catch (error: any) {
      logger.error('Get email templates error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get templates' })
    }
  })

  // Get email analytics
  fastify.get('/email/analytics', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const { campaign_id, start_date, end_date } = request.query as any

      let query = insforge.from('email_logs')
        .select('*')
        .eq('org_id', user.org_id)

      if (campaign_id) {
        query = query.eq('campaign_id', campaign_id)
      }
      if (start_date) {
        query = query.gte('sent_at', start_date)
      }
      if (end_date) {
        query = query.lte('sent_at', end_date)
      }

      const logs = await query

      const analytics = {
        total_sent: logs.data?.filter(l => l.status === 'sent').length || 0,
        total_opened: logs.data?.filter(l => l.opened_at).length || 0,
        total_clicked: logs.data?.filter(l => l.clicked_at).length || 0,
        open_rate: 0,
        click_rate: 0,
      }

      if (analytics.total_sent > 0) {
        analytics.open_rate = Math.round((analytics.total_opened / analytics.total_sent) * 100)
        analytics.click_rate = Math.round((analytics.total_clicked / analytics.total_sent) * 100)
      }

      return { analytics }
    } catch (error: any) {
      logger.error('Get email analytics error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get analytics' })
    }
  })

  logger.info('Email routes registered')
}
