import { Queue, Worker } from 'bullmq'
import { redis } from '../lib/redis'
import { getDecryptedApiKey } from '../routes/vault'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'
import axios from 'axios'

// Queues
export const modelSyncQueue = new Queue('model-sync', { connection: redis })

// OpenRouter model sync
export async function syncOpenRouterModels() {
  try {
    const apiKey = await getDecryptedApiKey('openrouter')
    if (!apiKey) {
      logger.warn('OpenRouter key not configured, skipping sync')
      return
    }

    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 30000,
    })

    const models = response.data.data

    // Cache in Redis (6 hours)
    await redis.set('openrouter:models', JSON.stringify(models), 'EX', 21600)

    // Store in database
    await insforge.from(collections.platformSettings).upsert({
      key: 'openrouter_models',
      value: JSON.stringify(models),
    })

    logger.info(`Synced ${models.length} OpenRouter models`)
  } catch (error) {
    logger.error('Error syncing OpenRouter models', { error })
  }
}

// Kie.ai model sync
export async function syncKieModels() {
  try {
    const apiKey = await getDecryptedApiKey('kie_ai')
    if (!apiKey) {
      logger.warn('Kie.ai key not configured, skipping sync')
      return
    }

    const response = await axios.get('https://api.kie.ai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 30000,
    })

    const models = response.data

    // Cache in Redis
    await redis.set('kie:models', JSON.stringify(models), 'EX', 21600)

    logger.info('Synced Kie.ai models')
  } catch (error) {
    logger.error('Error syncing Kie.ai models', { error })
  }
}

// Worker to process sync jobs
const modelSyncWorker = new Worker(
  'model-sync',
  async (job) => {
    const { provider } = job.data

    switch (provider) {
      case 'openrouter':
        await syncOpenRouterModels()
        break
      case 'kie':
        await syncKieModels()
        break
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  },
  { connection: redis }
)

modelSyncWorker.on('completed', (job) => {
  logger.info(`Model sync job completed: ${job.data.provider}`)
})

modelSyncWorker.on('failed', (job, err) => {
  logger.error(`Model sync job failed: ${job?.data.provider}`, { error: err })
})

// Schedule sync jobs
import * as cron from 'node-cron'

// Run on startup
syncOpenRouterModels()
syncKieModels()

// Run every 6 hours
cron.schedule('0 */6 * * *', () => {
  modelSyncQueue.add('sync-openrouter', { provider: 'openrouter' })
  modelSyncQueue.add('sync-kie', { provider: 'kie' })
})