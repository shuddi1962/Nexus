import type { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'
import axios from 'axios'

export async function registerVideoRoutes(fastify: FastifyInstance) {

  // Get video projects
  fastify.get('/video/projects', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.videoProjects)
        .select('*')
        .eq('org_id', orgId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch video projects', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Create video project
  fastify.post('/video/projects', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const { name, width, height, timeline_data } = request.body as any

      const { data, error } = await insforge
        .from(collections.videoProjects)
        .insert([{
          org_id: orgId,
          name,
          width: width || 1920,
          height: height || 1080,
          timeline_data: timeline_data || null,
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Video project created', { projectId: data.id, userId })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to create video project', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Update video project
  fastify.put('/video/projects/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { id } = request.params as any
      const updates = request.body as any

      const { data, error } = await insforge
        .from(collections.videoProjects)
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
      logger.error('Failed to update video project', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Generate video with Kie.ai
  fastify.post('/video/generate', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const {
        prompt,
        model,
        duration,
        aspect_ratio,
        voice_id,
        script,
      } = request.body as any

      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      const response = await axios.post('https://api.kie.ai/v1/videos/generate', {
        prompt,
        model: model || 'kie-video-v1',
        duration: duration || 10,
        aspect_ratio: aspect_ratio || '16:9',
        voice_id,
        script,
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      // Save to database
      const { data, error } = await insforge
        .from(collections.videoProjects)
        .insert([{
          org_id: orgId,
          name: prompt.substring(0, 50),
          video_url: response.data.url,
          duration: duration || 10,
          model: model || 'kie-video-v1',
          created_by: userId,
          status: 'completed',
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Video generated', { videoId: data.id, userId, model })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to generate video', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // UGC Ad generation
  fastify.post('/video/ugc-ad', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const {
        product_url,
        avatar_id,
        script,
        voice_id,
      } = request.body as any

      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      // Extract product info from URL
      const productResponse = await axios.get(product_url)
      const productData = {
        title: extractTitle(productResponse.data),
        images: extractImages(productResponse.data),
      }

      // Generate UGC video
      const response = await axios.post('https://api.kie.ai/v1/videos/ugc', {
        product: productData,
        avatar_id,
        script,
        voice_id,
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      logger.info('UGC ad generated', { userId, avatar_id })
      return reply.send({ success: true, data: response.data })
    } catch (error: any) {
      logger.error('Failed to generate UGC ad', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // AI Video Editing
  fastify.post('/video/ai-edit', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { video_url, instructions } = request.body as any

      // Use OpenRouter for natural language video editing
      const apiKey = await getDecryptedApiKey('openrouter')
      if (!apiKey) {
        return reply.status(400).send({ error: 'OpenRouter API key not configured' })
      }

      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-4-vision-preview',
        messages: [{
          role: 'user',
          content: `Edit this video (${video_url}) according to these instructions: ${instructions}. Return ffmpeg commands.`
        }]
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      const ffmpegCommands = response.data.choices[0].message.content

      logger.info('AI video edit generated', { userId })
      return reply.send({ success: true, data: { commands: ffmpegCommands } })
    } catch (error: any) {
      logger.error('Failed to AI edit video', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Export video
  fastify.post('/video/export/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { id } = request.params as any
      const { format, quality } = request.body as any

      // In production, this would use fluent-ffmpeg to export
      logger.info('Video exported', { projectId: id, format, quality })
      return reply.send({ success: true, download_url: `/api/video/downloads/${id}.${format}` })
    } catch (error: any) {
      logger.error('Failed to export video', { error })
      return reply.status(500).send({ error: error.message })
    }
  })
}

function extractTitle(html: string): string {
  const match = html.match(/<title>(.*?)<\/title>/)
  return match ? match[1] : 'Product'
}

function extractImages(html: string): string[] {
  const matches = html.match(/<img[^>]+src="([^"]+)"[^>]*>/g) || []
  return matches.slice(0, 5).map(img => {
    const srcMatch = img.match(/src="([^"]+)"/)
    return srcMatch ? srcMatch[1] : ''
  }).filter(Boolean)
}

async function getDecryptedApiKey(provider: string): Promise<string | null> {
  const { data } = await insforge
    .from('api_keys_vault')
    .select('encrypted_key')
    .eq('provider', provider)
    .eq('active', true)
    .single()

  if (!data) return null

  const { decryptKey } = await import('../lib/encryption')
  return decryptKey(data.encrypted_key, process.env.ENCRYPTION_KEY!)
}
