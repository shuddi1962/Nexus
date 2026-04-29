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
  const { chatbotsRoutes } = await import('./routes/chatbots')
  const { workflowsRoutes } = await import('./routes/workflows')
  const { voiceRoutes } = await import('./routes/voice')
  const { seoRoutes } = await import('./routes/seo')
  const { coursesRoutes } = await import('./routes/courses')
  const { sitesRoutes } = await import('./routes/sites')
  const { calendarRoutes } = await import('./routes/calendar')
  const { smsRoutes } = await import('./routes/sms')
  const { socialRoutes } = await import('./routes/social')
  const { designRoutes } = await import('./routes/design')
  const { imagesRoutes } = await import('./routes/images')
  const { videoRoutes } = await import('./routes/video')
  const { musicRoutes } = await import('./routes/music')
  const { hostingRoutes } = await import('./routes/hosting')
  const { codeBuilderRoutes } = await import('./routes/codebuilder')
  const { chatHubRoutes } = await import('./routes/chathub')
  
  await server.register(authRoutes, { prefix: '/api' })
  await server.register(vaultRoutes, { prefix: '/api' })
  await server.register(modelRoutes, { prefix: '/api' })
  await server.register(crmRoutes, { prefix: '/api' })
  await server.register(adsRoutes, { prefix: '/api' })
  await server.register(contentRoutes, { prefix: '/api' })
  await server.register(commerceRoutes, { prefix: '/api' })
  await server.register(seoRoutes, { prefix: '/api' })
  await server.register(coursesRoutes, { prefix: '/api' })
  await server.register(sitesRoutes, { prefix: '/api' })
  await server.register(calendarRoutes, { prefix: '/api' })
  await server.register(smsRoutes, { prefix: '/api' })
  await server.register(socialRoutes, { prefix: '/api' })
  await server.register(designRoutes, { prefix: '/api' })
  await server.register(imagesRoutes, { prefix: '/api' })
  await server.register(videoRoutes, { prefix: '/api' })
  await server.register(musicRoutes, { prefix: '/api' })
  await server.register(hostingRoutes, { prefix: '/api' })
  await server.register(codeBuilderRoutes, { prefix: '/api' })
  await server.register(chatHubRoutes, { prefix: '/api' })
  const { broadcastRoutes } = await import('./routes/broadcasts')
  await server.register(broadcastRoutes, { prefix: '/api/broadcasts' })
  const { prospectingRoutes } = await import('./routes/prospecting')
  await server.register(prospectingRoutes, { prefix: '/api' })
  const { reputationRoutes } = await import('./routes/reputation')
  await server.register(chatbotsRoutes, { prefix: '/api' })
  await server.register(workflowsRoutes, { prefix: '/api' })
  await server.register(voiceRoutes, { prefix: '/api' })
  await server.register(reputationRoutes, { prefix: '/api' })

  // Business routes
  const { businessRoutes } = await import('./routes/business')
  await server.register(businessRoutes, { prefix: '/api' })

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
