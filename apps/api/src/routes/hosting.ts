import type { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerHostingRoutes(fastify: FastifyInstance) {

  // Get domains
  fastify.get('/hosting/domains', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.domains || 'domains')
        .select('*')
        .eq('org_id', orgId)

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch domains', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Register domain
  fastify.post('/hosting/domains', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { name, registrar } = request.body as any

      const { data, error } = await insforge
        .from(collections.domains || 'domains')
        .insert([{
          org_id: orgId,
          name,
          registrar: registrar || 'manual',
          status: 'pending',
          ssl_status: 'none',
          auto_renew: true,
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Domain registered', { domainId: data.id, name })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to register domain', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get hosting plans
  fastify.get('/hosting/plans', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { data, error } = await insforge
        .from(collections.hostingPlans || 'hosting_plans')
        .select('*')
        .eq('active', true)

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch hosting plans', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get websites
  fastify.get('/hosting/websites', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.websites || 'websites')
        .select('*')
        .eq('org_id', orgId)

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch websites', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Create website
  fastify.post('/hosting/websites', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { name, domain_id, template } = request.body as any

      const { data, error } = await insforge
        .from(collections.websites || 'websites')
        .insert([{
          org_id: orgId,
          name,
          domain_id,
          template: template || 'blank',
          status: 'building',
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Website created', { websiteId: data.id, name })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create website', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get DNS records
  fastify.get('/hosting/dns/:domainId', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { domainId } = request.params as any

      const { data, error } = await insforge
        .from(collections.dnsRecords || 'dns_records')
        .select('*')
        .eq('domain_id', domainId)

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch DNS records', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Add DNS record
  fastify.post('/hosting/dns', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { domain_id, type, name, value, ttl } = request.body as any

      const { data, error } = await insforge
        .from(collections.dnsRecords || 'dns_records')
        .insert([{
          domain_id,
          type,
          name,
          value,
          ttl: ttl || 3600,
          status: 'active',
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('DNS record added', { recordId: data.id, type, name })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to add DNS record', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
}
