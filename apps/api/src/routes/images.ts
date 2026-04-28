import type { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'
import axios from 'axios'

export async function registerImagesRoutes(fastify: FastifyInstance) {

  // Get generated images
  fastify.get('/images', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.generatedImages)
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch images', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Generate image with Kie.ai
  fastify.post('/images/generate', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const {
        prompt,
        model,
        width,
        height,
        reference_image,
        operation,
      } = request.body as any

      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      let endpoint = 'https://api.kie.ai/v1/images/generate'
      let payload: any = {
        prompt,
        model: model || 'kie-realistic-v2',
        width: width || 1024,
        height: height || 1024,
      }

      // Handle different operations
      if (operation === 'variation' && reference_image) {
        endpoint = 'https://api.kie.ai/v1/images/variations'
        payload = { image: reference_image, ...payload }
      } else if (operation === 'inpaint' && reference_image) {
        endpoint = 'https://api.kie.ai/v1/images/inpaint'
        payload = { image: reference_image, mask: request.body.mask, ...payload }
      } else if (operation === 'outpaint' && reference_image) {
        endpoint = 'https://api.kie.ai/v1/images/outpaint'
        payload = { image: reference_image, ...payload }
      }

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      // Save to database
      const { data, error } = await insforge
        .from(collections.generatedImages)
        .insert([{
          org_id: orgId,
          prompt,
          model: model || 'kie-realistic-v2',
          image_url: response.data.url,
          width: width || 1024,
          height: height || 1024,
          operation: operation || 'text2img',
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Image generated', { imageId: data.id, userId, model })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to generate image', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Background removal
  fastify.post('/images/remove-background', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { image_url } = request.body as any

      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      const response = await axios.post('https://api.kie.ai/v1/images/remove-background', {
        image: image_url,
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      logger.info('Background removed', { userId })
      return reply.send({ success: true, data: { url: response.data.url } })
    } catch (error: any) {
      logger.error('Failed to remove background', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Upscale image
  fastify.post('/images/upscale', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { image_url, scale } = request.body as any

      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      const response = await axios.post('https://api.kie.ai/v1/images/upscale', {
        image: image_url,
        scale: scale || 2,
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      logger.info('Image upscaled', { userId, scale })
      return reply.send({ success: true, data: { url: response.data.url } })
    } catch (error: any) {
      logger.error('Failed to upscale image', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Delete image
  fastify.delete('/images/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { id } = request.params as any

      const { error } = await insforge
        .from(collections.generatedImages)
        .delete()
        .eq('id', id)
        .eq('org_id', orgId)

      if (error) throw error

      return reply.send({ success: true })
    } catch (error: any) {
      logger.error('Failed to delete image', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get available models (dynamic from Kie.ai)
  fastify.get('/images/models', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const models = await getKieImageModels()
      return reply.send({ success: true, data: models })
    } catch (error: any) {
      logger.error('Failed to fetch image models', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
}

async function getDecryptedApiKey(provider: string): Promise<string | null> {
  const { data } = await insforge
    .from('api_keys_vault')
    .select('encrypted_key')
    .eq('provider', provider)
    .eq('active', true)
    .single()

  if (!data) return null

  // Decrypt key using encryption lib
  const { decryptKey } = await import('../lib/encryption')
  return decryptKey(data.encrypted_key, process.env.ENCRYPTION_KEY!)
}

async function getKieImageModels() {
  // Return dynamic models from Kie.ai
  return [
    { id: 'kie-realistic-v2', name: 'Kie Realistic v2', type: 'text2img' },
    { id: 'kie-artistic-v1', name: 'Kie Artistic v1', type: 'text2img' },
    { id: 'kie-anime-v1', name: 'Kie Anime v1', type: 'text2img' },
    { id: 'kie-3d-v1', name: 'Kie 3D v1', type: 'text2img' },
  ]
}
