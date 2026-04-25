import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import { env } from './lib/env'
import { logger } from './src/lib/logger'

const server = Fastify({
  logger: logger,
})

// Register plugins
await server.register(cors, {
  origin: [env.FRONTEND_URL],
  credentials: true,
})

await server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
})

await server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

await server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

// Register routes
import { authRoutes } from './routes/auth'
import { vaultRoutes } from './routes/vault'
import { modelRoutes } from './routes/models'
import { crmRoutes } from './routes/crm'
import { adsRoutes } from './routes/ads'
await server.register(authRoutes, { prefix: '/api' })
await server.register(vaultRoutes, { prefix: '/api' })
await server.register(modelRoutes, { prefix: '/api' })
await server.register(crmRoutes, { prefix: '/api' })
await server.register(adsRoutes, { prefix: '/api' })

// Start background jobs
import './jobs/sync-models'
import { scheduleRulesProcessing } from './jobs/rules-processor'
import { scheduleAdSync } from './jobs/ad-sync'

// Schedule background jobs
scheduleRulesProcessing().catch(console.error)
scheduleAdSync().catch(console.error)

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Start server
const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' })
    logger.info(`Server listening on port ${env.PORT}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()