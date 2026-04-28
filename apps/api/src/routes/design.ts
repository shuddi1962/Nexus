import type { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerDesignRoutes(fastify: FastifyInstance) {

  // Get design projects
  fastify.get('/design/projects', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.designProjects)
        .select('*')
        .eq('org_id', orgId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch design projects', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Create design project
  fastify.post('/design/projects', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { name, width, height, canvas_data } = request.body as any

      const { data, error } = await insforge
        .from(collections.designProjects)
        .insert([{
          org_id: orgId,
          name,
          width: width || 1920,
          height: height || 1080,
          canvas_data: canvas_data || null,
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Design project created', { projectId: data.id, userId })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create design project', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Update design project
  fastify.put('/design/projects/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { id } = request.params as any
      const updates = request.body as any

      const { data, error } = await insforge
        .from(collections.designProjects)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('org_id', orgId)
        .select()
        .single()

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to update design project', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Delete design project
  fastify.delete('/design/projects/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { id } = request.params as any

      const { error } = await insforge
        .from(collections.designProjects)
        .delete()
        .eq('id', id)
        .eq('org_id', orgId)

      if (error) throw error

      return reply.send({ success: true })
    } catch (error: any) {
      logger.error('Failed to delete design project', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Generate design with AI
  fastify.post('/design/generate', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { prompt, width, height, style } = request.body as any

      // Call Kie.ai for image generation
      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      const response = await axios.post('https://api.kie.ai/v1/images/generate', {
        prompt,
        width: width || 1024,
        height: height || 1024,
        style: style || 'realistic',
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      logger.info('Design generated with AI', { userId, prompt })
      return reply.send({ success: true, data: response.data })
    } catch (error: any) {
      logger.error('Failed to generate design', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Export design
  fastify.post('/design/export/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { id } = request.params as any
      const { format } = request.body as any

      const { data: project } = await insforge
        .from(collections.designProjects)
        .select('*')
        .eq('id', id)
        .eq('org_id', orgId)
        .single()

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' })
      }

      // In production, this would use Fabric.js to export to PNG/JPEG/SVG/PDF
      logger.info('Design exported', { projectId: id, format })
      return reply.send({ success: true, download_url: `/api/design/downloads/${id}.${format}` })
    } catch (error: any) {
      logger.error('Failed to export design', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
}
