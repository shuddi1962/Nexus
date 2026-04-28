import type { FastifyInstance } from 'fastify'
import { insforge } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerSitesRoutes(fastify: FastifyInstance) {

  // Get sites
  fastify.get('/sites', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const sites = await insforge.from('hosting_sites')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false })

      return { sites: sites.data || [] }
    } catch (error: any) {
      logger.error('Get sites error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get sites' })
    }
  })

  // Create site
  fastify.post('/sites', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const siteData = request.body as any

      const site = await insforge.from('hosting_sites').insert({
        org_id: user.org_id,
        name: siteData.name,
        url: siteData.url,
        platform: siteData.platform || 'custom',
        template: siteData.template,
        status: 'draft',
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, site: site.data }
    } catch (error: any) {
      logger.error('Create site error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create site' })
    }
  })

  // Get domains
  fastify.get('/domains', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const domains = await insforge.from('domains')
        .select('*')
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false })

      return { domains: domains.data || [] }
    } catch (error: any) {
      logger.error('Get domains error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get domains' })
    }
  })

  // Register domain
  fastify.post('/domains', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const domainData = request.body as any

      const domain = await insforge.from('domains').insert({
        org_id: user.org_id,
        domain: domainData.domain,
        provider: domainData.provider,
        status: 'pending',
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, domain: domain.data }
    } catch (error: any) {
      logger.error('Register domain error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to register domain' })
    }
  })

  logger.info('Sites routes registered')
}
