import type { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerCodeBuilderRoutes(fastify: FastifyInstance) {

  // Get projects
  fastify.get('/code/projects', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.codeProjects || 'code_projects')
        .select('*')
        .eq('org_id', orgId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch code projects', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Create project
  fastify.post('/code/projects', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { name, type, description } = request.body as any

      const { data, error } = await insforge
        .from(collections.codeProjects || 'code_projects')
        .insert([{
          org_id: orgId,
          name,
          type: type || 'web',
          description,
          status: 'active',
          files_count: 0,
          commits_count: 0,
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Code project created', { projectId: data.id, name })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create code project', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get code snippets
  fastify.get('/code/snippets', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.codeSnippets || 'code_snippets')
        .select('*')
        .eq('org_id', orgId)
        .order('usage_count', { ascending: false })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch code snippets', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Create code snippet
  fastify.post('/code/snippets', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { name, language, description, code, tags } = request.body as any

      const { data, error } = await insforge
        .from(collections.codeSnippets || 'code_snippets')
        .insert([{
          org_id: orgId,
          name,
          language,
          description,
          code,
          tags: tags || [],
          usage_count: 0,
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Code snippet created', { snippetId: data.id, name })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create code snippet', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get API endpoints
  fastify.get('/code/endpoints', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.apiEndpoints || 'api_endpoints')
        .select('*')
        .eq('org_id', orgId)

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch API endpoints', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Create API endpoint
  fastify.post('/code/endpoints', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { method, path, description } = request.body as any

      const { data, error } = await insforge
        .from(collections.apiEndpoints || 'api_endpoints')
        .insert([{
          org_id: orgId,
          method,
          path,
          description,
          status: 'active',
          last_called: null,
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('API endpoint created', { endpointId: data.id, method, path })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create API endpoint', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Execute API endpoint (test)
  fastify.post('/code/endpoints/:id/execute', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const { body, headers } = request.body as any

      // In production, this would actually call the endpoint
      logger.info('API endpoint executed', { endpointId: id })

      return reply.send({
        success: true,
        data: {
          status: 200,
          response: { message: 'Endpoint executed successfully' },
          executionTime: Math.random() * 100,
        }
      })
    } catch (error: any) {
      logger.error('Failed to execute API endpoint', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
}
