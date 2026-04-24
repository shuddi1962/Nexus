import { Redis } from 'ioredis'
import { env } from './env'

export const redis = new Redis(env.REDIS_URL)

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redis.quit()
})

process.on('SIGINT', async () => {
  await redis.quit()
})