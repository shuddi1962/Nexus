import { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerProspectingRoutes(fastify: FastifyInstance) {
  
  // Get prospecting campaigns
  fastify.get('/prospecting/campaigns', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      
      const { data, error } = await insforge
        .from(collections.prospectingCampaigns)
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch prospecting campaigns', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
  
  // Create prospecting campaign
  fastify.post('/prospecting/campaigns', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const userId = authRequest.user.id
      const { name, description, sources, filters } = request.body as any
      
      const { data, error } = await insforge
        .from(collections.prospectingCampaigns)
        .insert([{
          org_id: orgId,
          name,
          description,
          sources: sources || [],
          filters: filters || {},
          status: 'draft',
          created_by: userId,
        }])
        .select()
        .single()
      
      if (error) throw error
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create prospecting campaign', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
  
  // Get scraped leads
  fastify.get('/prospecting/leads', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { campaign_id, status, search } = request.query as any
      
      let query = insforge
        .from(collections.scrapedLeads)
        .select('*')
        .eq('org_id', orgId)
      
      if (campaign_id) {
        query = query.eq('campaign_id', campaign_id)
      }
      if (status) {
        query = query.eq('status', status)
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch leads', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
  
  // Scrape new leads (trigger Apify)
  fastify.post('/prospecting/scrape', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { source, query, campaign_id, limit } = request.body as any
      
      // This would integrate with Apify for actual scraping
      // For now, return a queued response
      
      logger.info('Lead scraping requested', { source, query, orgId })
      
      return reply.send({ 
        success: true, 
        message: 'Scraping job queued',
        job_id: `job_${Date.now()}`
      })
    } catch (error: any) {
      logger.error('Failed to queue scraping job', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
  
  // Update lead status
  fastify.patch('/prospecting/leads/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { id } = request.params as any
      const updates = request.body as any
      
      const { data, error } = await insforge
        .from(collections.scrapedLeads)
        .update(updates)
        .eq('id', id)
        .eq('org_id', orgId)
        .select()
        .single()
      
      if (error) throw error
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to update lead', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
  
  // Get outreach sequences
  fastify.get('/prospecting/sequences', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      
      const { data, error } = await insforge
        .from(collections.outreachSequences)
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch sequences', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
  
  // Create outreach sequence
  fastify.post('/prospecting/sequences', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const userId = authRequest.user.id
      const { name, campaign_id, steps } = request.body as any
      
      const { data, error } = await insforge
        .from(collections.outreachSequences)
        .insert([{
          org_id: orgId,
          name,
          campaign_id,
          steps: steps || [],
          status: 'draft',
          created_by: userId,
        }])
        .select()
        .single()
      
      if (error) throw error
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create sequence', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
}
