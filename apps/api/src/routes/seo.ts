import type { FastifyInstance } from 'fastify'
import { getInsForgeClient } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerSEORoutes(fastify: FastifyInstance) {
  const insforge = getInsForgeClient()

  // Perform site audit
  fastify.post('/seo/audit', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { url, auditType = 'full' } = request.body as { url: string; auditType?: string }
      const user = (request as any).user

      if (!url) {
        return reply.code(400).send({ error: 'URL is required' })
      }

      // Create audit record
      const audit = await insforge.from('seo_audits').insert({
        org_id: user.org_id,
        url,
        audit_type: auditType,
        status: 'pending',
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      // TODO: Trigger background job to perform actual audit via DataForSEO
      logger.info(`SEO audit requested for ${url} by user ${user.id}`)

      return { success: true, audit: audit.data }
    } catch (error: any) {
      logger.error('SEO audit error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to perform audit' })
    }
  })

  // Get audits
  fastify.get('/seo/audits', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { page = '1', limit = '20' } = request.query as any
      const user = (request as any).user

      const audits = await insforge.from('seo_audits')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false })
        .range((+page - 1) * +limit, +page * +limit - 1)

      return { audits: audits.data || [], total: audits.count || 0 }
    } catch (error: any) {
      logger.error('Get audits error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get audits' })
    }
  })

  // Analyze keywords
  fastify.post('/seo/keywords/analyze', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { keywords, location, language } = request.body as {
        keywords: string[]
        location?: string
        language?: string
      }
      const user = (request as any).user

      if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return reply.code(400).send({ error: 'Keywords array is required' })
      }

      // TODO: Call DataForSEO API for keyword analysis
      logger.info(`Keyword analysis requested for ${keywords.length} keywords by user ${user.id}`)

      return {
        success: true,
        keywords: keywords.map(k => ({
          keyword: k,
          volume: Math.floor(Math.random() * 10000), // Placeholder
          difficulty: Math.floor(Math.random() * 100),
          cpc: Math.random() * 5,
        }))
      }
    } catch (error: any) {
      logger.error('Keyword analysis error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to analyze keywords' })
    }
  })

  // Get keyword tracking
  fastify.get('/seo/keywords/tracking', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { keyword_ids } = request.query as any
      const user = (request as any).user

      const tracking = await insforge.from('keyword_tracking')
        .select('*')
        .eq('org_id', user.org_id)

      if (keyword_ids) {
        const ids = keyword_ids.split(',')
        tracking.data = tracking.data?.filter(t => ids.includes(t.id))
      }

      return { tracking: tracking.data || [] }
    } catch (error: any) {
      logger.error('Get keyword tracking error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get keyword tracking' })
    }
  })

  // Get backlinks
  fastify.get('/seo/backlinks', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { domain, limit = '100' } = request.query as any
      const user = (request as any).user

      if (!domain) {
        return reply.code(400).send({ error: 'Domain is required' })
      }

      const backlinks = await insforge.from('backlink_profiles')
        .select('*')
        .eq('org_id', user.org_id)
        .eq('domain', domain)
        .limit(+limit)

      return { backlinks: backlinks.data || [] }
    } catch (error: any) {
      logger.error('Get backlinks error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get backlinks' })
    }
  })

  // Get indexing status
  fastify.get('/seo/indexing', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { url } = request.query as any

      // TODO: Check Google/Bing indexing status
      logger.info(`Indexing status check for ${url}`)

      return {
        url,
        google_indexed: true,
        bing_indexed: true,
        last_checked: new Date().toISOString(),
      }
    } catch (error: any) {
      logger.error('Get indexing status error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get indexing status' })
    }
  })

  // Submit for indexing
  fastify.post('/seo/indexing/submit', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { url, engines = ['google', 'bing'] } = request.body as { url: string; engines?: string[] }
      const user = (request as any).user

      if (!url) {
        return reply.code(400).send({ error: 'URL is required' })
      }

      // TODO: Submit to Google/Bing via APIs
      logger.info(`Indexing submission for ${url} to ${engines.join(', ')} by user ${user.id}`)

      return {
        success: true,
        url,
        engines,
        submitted_at: new Date().toISOString(),
      }
    } catch (error: any) {
      logger.error('Submit indexing error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to submit for indexing' })
    }
  })

  // Connect site
  fastify.post('/sites/connect', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { name, url, platform, api_key, username, password } = request.body as any
      const user = (request as any).user

      if (!name || !url || !platform) {
        return reply.code(400).send({ error: 'Name, URL, and platform are required' })
      }

      const site = await insforge.from('connected_sites').insert({
        org_id: user.org_id,
        name,
        url,
        platform,
        api_key,
        username,
        connected_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, site: site.data }
    } catch (error: any) {
      logger.error('Connect site error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to connect site' })
    }
  })

  // Get connected sites
  fastify.get('/sites', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const sites = await insforge.from('connected_sites')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false })

      return { sites: sites.data || [] }
    } catch (error: any) {
      logger.error('Get sites error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get sites' })
    }
  })

  // Sync site
  fastify.post('/sites/:id/sync', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const user = (request as any).user

      // TODO: Sync site content via API
      logger.info(`Site sync requested for ${id} by user ${user.id}`)

      return { success: true, message: 'Site sync initiated' }
    } catch (error: any) {
      logger.error('Sync site error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to sync site' })
    }
  })

  // Publish to site
  fastify.post('/sites/:id/publish', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const { article_id, publish_now, scheduled_date } = request.body as any
      const user = (request as any).user

      // TODO: Publish article to connected site
      logger.info(`Publish requested for article ${article_id} to site ${id} by user ${user.id}`)

      return {
        success: true,
        published: publish_now || false,
        scheduled_date: scheduled_date || null,
      }
    } catch (error: any) {
      logger.error('Publish to site error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to publish to site' })
    }
  })

  logger.info('SEO routes registered')
}
