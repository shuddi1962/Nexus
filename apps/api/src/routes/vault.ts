import { FastifyInstance } from 'fastify'
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth'
import { encryptKey, decryptKey } from '../lib/encryption'
import { env } from '../lib/env'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

interface ApiKey {
  id: string
  provider: string
  category: string
  encrypted_key: string
  label?: string
  added_by: string
  last_tested_at?: string
  test_status: 'active' | 'invalid' | 'untested' | 'expired'
  usage_this_month: number
  active: boolean
  created_at: string
}

export async function vaultRoutes(app: FastifyInstance) {
  // Get all API keys (admin only, without decrypted keys)
  app.get('/admin/vault', { preHandler: adminOnlyMiddleware }, async (request, reply) => {
    try {
      const result = await insforge.get(`/collections/${collections.apiKeysVault}`)
      const keys = result.data.map((key: ApiKey) => ({
        id: key.id,
        provider: key.provider,
        category: key.category,
        label: key.label,
        added_by: key.added_by,
        last_tested_at: key.last_tested_at,
        test_status: key.test_status,
        usage_this_month: key.usage_this_month,
        active: key.active,
        created_at: key.created_at,
      }))

      reply.send(keys)
    } catch (error) {
      logger.error('Error fetching API keys', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Add new API key
  app.post('/admin/vault', { preHandler: adminOnlyMiddleware }, async (request, reply) => {
    try {
      const { provider, category, key, label } = request.body as {
        provider: string
        category: string
        key: string
        label?: string
      }

      const authRequest = request as any
      const encryptedKey = encryptKey(key, env.ENCRYPTION_KEY)

      const apiKey = {
        provider,
        category,
        encrypted_key: encryptedKey,
        label,
        added_by: authRequest.user.id,
        test_status: 'untested',
        usage_this_month: 0,
        active: true,
      }

      const result = await insforge.post(`/collections/${collections.apiKeysVault}`, apiKey)
      reply.code(201).send({
        id: result.data.id,
        provider: result.data.provider,
        category: result.data.category,
        label: result.data.label,
        test_status: result.data.test_status,
        active: result.data.active,
        created_at: result.data.created_at,
      })
    } catch (error) {
      logger.error('Error adding API key', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Test API key connection (server-side only, never returns decrypted key)
  app.post('/admin/vault/:id/test', { preHandler: adminOnlyMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const result = await insforge.get(`/collections/${collections.apiKeysVault}/${id}`)
      const apiKey = result.data

      if (!apiKey) {
        return reply.code(404).send({ error: 'API key not found' })
      }

      const decryptedKey = decryptKey(apiKey.encrypted_key, env.ENCRYPTION_KEY)

      // TODO: Implement provider-specific testing logic
      // For now, just mark as tested
      const testStatus = 'active' // Placeholder

      await insforge.patch(`/collections/${collections.apiKeysVault}/${id}`, {
        last_tested_at: new Date().toISOString(),
        test_status: testStatus,
      })

      reply.send({ status: testStatus })
    } catch (error) {
      logger.error('Error testing API key', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Delete API key
  app.delete('/admin/vault/:id', { preHandler: adminOnlyMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      await insforge.delete(`/collections/${collections.apiKeysVault}/${id}`)
      reply.send({ message: 'API key deleted' })
    } catch (error) {
      logger.error('Error deleting API key', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}

// Helper function to get decrypted API key by provider
export async function getDecryptedApiKey(provider: string): Promise<string | null> {
  try {
    const result = await insforge.get(`/collections/${collections.apiKeysVault}`, {
      params: { provider: `eq.${provider}`, active: 'eq.true' }
    })

    if (result.data.length === 0) return null

    const apiKey = result.data[0]
    return decryptKey(apiKey.encrypted_key, env.ENCRYPTION_KEY)
  } catch (error) {
    logger.error('Error getting decrypted API key', { error, provider })
    return null
  }
}