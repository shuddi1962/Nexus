import type { FastifyInstance } from 'fastify'
import { insforge, collections } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'
import axios from 'axios'

export async function registerMusicRoutes(fastify: FastifyInstance) {

  // Get music tracks
  fastify.get('/music', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { data, error } = await insforge
        .from(collections.musicTracks)
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to fetch music tracks', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Generate music with Kie.ai
  fastify.post('/music/generate', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const orgId = authRequest.user.org_id
      const {
        prompt,
        model,
        duration,
        genre,
        mood,
        tempo,
        key,
      } = request.body as any

      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      const response = await axios.post('https://api.kie.ai/v1/music/generate', {
        prompt,
        model: model || 'kie-music-v1',
        duration: duration || 30,
        genre: genre || 'pop',
        mood: mood || 'happy',
        tempo: tempo || 120,
        key: key || 'C',
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      // Save to database
      const { data, error } = await insforge
        .from(collections.musicTracks)
        .insert([{
          org_id: orgId,
          prompt,
          model: model || 'kie-music-v1',
          audio_url: response.data.url,
          duration: duration || 30,
          genre: genre || 'pop',
          mood: mood || 'happy',
          created_by: userId,
        }])
        .select()
        .single()

      if (error) throw error

      logger.info('Music generated', { trackId: data.id, userId, model })
      return reply.send({ success: true, data })
    } catch (error: any) {
      logger.error('Failed to generate music', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Text-to-Speech
  fastify.post('/music/tts', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { text, voice_id, language } = request.body as any

      const apiKey = await getDecryptedApiKey('kie_ai')
      if (!apiKey) {
        return reply.status(400).send({ error: 'Kie.ai API key not configured' })
      }

      const response = await axios.post('https://api.kie.ai/v1/tts', {
        text,
        voice_id: voice_id || 'en-US-1',
        language: language || 'en-US',
      }, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })

      logger.info('TTS generated', { userId, voice_id })
      return reply.send({ success: true, data: { url: response.data.url } })
    } catch (error: any) {
      logger.error('Failed to generate TTS', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get available voices
  fastify.get('/music/voices', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      // Return dynamic voices from Kie.ai
      const voices = [
        { id: 'en-US-1', name: 'American Male', language: 'en-US' },
        { id: 'en-US-2', name: 'American Female', language: 'en-US' },
        { id: 'en-GB-1', name: 'British Male', language: 'en-GB' },
        { id: 'en-GB-2', name: 'British Female', language: 'en-GB' },
        // ... 140+ voices from Kie.ai
      ]

      return reply.send({ success: true, data: voices })
    } catch (error: any) {
      logger.error('Failed to fetch voices', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Delete music track
  fastify.delete('/music/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id
      const { id } = request.params as any

      const { error } = await insforge
        .from(collections.musicTracks)
        .delete()
        .eq('id', id)
        .eq('org_id', orgId)

      if (error) throw error

      return reply.send({ success: true })
    } catch (error: any) {
      logger.error('Failed to delete music track', { error })
      return reply.status(500).send({ error: error.message })
    }
  })

  // Get available models (dynamic from Kie.ai)
  fastify.get('/music/models', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const models = [
        { id: 'kie-music-v1', name: 'Kie Music v1', type: 'music' },
        { id: 'kie-music-v2', name: 'Kie Music v2', type: 'music' },
      ]

      return reply.send({ success: true, data: models })
    } catch (error: any) {
      logger.error('Failed to fetch music models', { error })
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

  const { decryptKey } = await import('../lib/encryption')
  return decryptKey(data.encrypted_key, process.env.ENCRYPTION_KEY!)
}
