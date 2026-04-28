import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import { env } from './lib/env'
import { logger } from './lib/logger'

const server = Fastify({
  logger: logger,
})

async function startServer() {
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
  const { authRoutes } = await import('./routes/auth')
  const { vaultRoutes } = await import('./routes/vault')
  const { modelRoutes } = await import('./routes/models')
  const { crmRoutes } = await import('./routes/crm')
  const { adsRoutes } = await import('./routes/ads')
  const { contentRoutes } = await import('./routes/content')
  const { commerceRoutes } = await import('./routes/commerce')
  
  await server.register(authRoutes, { prefix: '/api' })
  await server.register(vaultRoutes, { prefix: '/api' })
  await server.register(modelRoutes, { prefix: '/api' })
  await server.register(crmRoutes, { prefix: '/api' })
  await server.register(adsRoutes, { prefix: '/api' })
  await server.register(contentRoutes, { prefix: '/api' })
  await server.register(commerceRoutes, { prefix: '/api' })

  // Start background jobs
  const { scheduleRulesProcessing } = await import('./jobs/rules-processor')
  const { scheduleAdSync } = await import('./jobs/ad-sync')

  // Schedule background jobs
  scheduleRulesProcessing().catch(console.error)
  scheduleAdSync().catch(console.error)

  // Health check
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // Start server
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' })
    logger.info(`Server listening on port ${env.PORT}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

startServer()
