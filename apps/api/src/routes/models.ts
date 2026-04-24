import { FastifyInstance } from 'fastify'
import { redis } from '../lib/redis'
import { logger } from '../lib/logger'

export async function modelRoutes(app: FastifyInstance) {
  // Get LLM models (OpenRouter)
  app.get('/models/llm', async (request, reply) => {
    try {
      const models = await redis.get('openrouter:models')
      if (!models) {
        return reply.code(503).send({
          error: 'Models not available',
          message: 'Model sync job may not have run yet'
        })
      }

      const parsedModels = JSON.parse(models)
      reply.send(parsedModels)
    } catch (error) {
      logger.error('Error fetching LLM models', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get multimodal models (Kie.ai)
  app.get('/models/multimodal', async (request, reply) => {
    try {
      const models = await redis.get('kie:models')
      if (!models) {
        return reply.code(503).send({
          error: 'Models not available',
          message: 'Model sync job may not have run yet'
        })
      }

      const parsedModels = JSON.parse(models)
      reply.send(parsedModels)
    } catch (error) {
      logger.error('Error fetching multimodal models', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}