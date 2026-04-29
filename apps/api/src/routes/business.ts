import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

interface Business {
  id: string
  name: string
  tagline?: string
  description?: string
  industry?: string
  sub_industry?: string[]
  business_type?: 'product' | 'service' | 'hybrid'
  country?: string
  state?: string
  city?: string
  address?: string
  phone?: string[]
  email?: string
  website?: string
  logo?: string
  brand_colors?: string[]
  brand_voice?: string
  brand_guidelines?: string
  target_audience?: string
  pain_points?: string[]
  unique_value?: string
  competitor_keywords?: string[]
  user_id: string
  created_at: string
  updated_at: string
}

export async function businessRoutes(app: FastifyInstance) {
  // Get all businesses for user
  app.get('/businesses', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id

      const result = await insforge.get(`/collections/${collections.businesses}`, {
        params: { user_id: `eq.${userId}` }
      })

      reply.send(result.data || [])
    } catch (error) {
      logger.error('Error fetching businesses', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get single business
  app.get('/businesses/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const authRequest = request as any
      const userId = authRequest.user.id

      const result = await insforge.get(`/collections/${collections.businesses}/${id}`)

      if (!result.data) {
        return reply.code(404).send({ error: 'Business not found' })
      }

      if (result.data.user_id !== userId) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      reply.send(result.data)
    } catch (error) {
      logger.error('Error fetching business', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Create business
  app.post('/businesses', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id

      const businessData = request.body as Partial<Business>

      const business = {
        ...businessData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.businesses}`, business)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating business', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update business
  app.patch('/businesses/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const authRequest = request as any
      const userId = authRequest.user.id

      const businessData = request.body as Partial<Business>

      // Verify ownership
      const existing = await insforge.get(`/collections/${collections.businesses}/${id}`)
      if (!existing.data) {
        return reply.code(404).send({ error: 'Business not found' })
      }
      if (existing.data.user_id !== userId) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      const updatedBusiness = {
        ...businessData,
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.patch(`/collections/${collections.businesses}/${id}`, updatedBusiness)
      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating business', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Delete business
  app.delete('/businesses/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const authRequest = request as any
      const userId = authRequest.user.id

      const existing = await insforge.get(`/collections/${collections.businesses}/${id}`)
      if (!existing.data) {
        return reply.code(404).send({ error: 'Business not found' })
      }
      if (existing.data.user_id !== userId) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      await insforge.delete(`/collections/${collections.businesses}/${id}`)
      reply.send({ message: 'Business deleted' })
    } catch (error) {
      logger.error('Error deleting business', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get business products
  app.get('/businesses/:id/products', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const result = await insforge.get(`/collections/${collections.businessProducts}`, {
        params: { business_id: `eq.${id}` }
      })

      reply.send(result.data || [])
    } catch (error) {
      logger.error('Error fetching business products', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Add business product
  app.post('/businesses/:id/products', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const productData = request.body as any

      const product = {
        ...productData,
        business_id: id,
        created_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.businessProducts}`, product)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error adding business product', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update business product
  app.patch('/businesses/:businessId/products/:productId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { productId } = request.params as { productId: string }
      const productData = request.body as any

      const result = await insforge.patch(`/collections/${collections.businessProducts}/${productId}`, productData)
      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating product', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Delete business product
  app.delete('/businesses/:businessId/products/:productId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { productId } = request.params as { productId: string }

      await insforge.delete(`/collections/${collections.businessProducts}/${productId}`)
      reply.send({ message: 'Product deleted' })
    } catch (error) {
      logger.error('Error deleting product', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // AI Business Analysis
  app.post('/businesses/:id/analyze', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const authRequest = request as any

      // Get business data
      const business = await insforge.get(`/collections/${collections.businesses}/${id}`)
      if (!business.data) {
        return reply.code(404).send({ error: 'Business not found' })
      }
      if (business.data.user_id !== authRequest.user.id) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      const analysis = {
        industry_competitive_landscape: 'Analysis of industry competitors and market positioning',
        recommended_content_topics: [
          'Industry trends and insights',
          'How-to guides for your products/services',
          'Customer success stories',
          'Product updates and announcements',
        ],
        optimal_posting_frequency: {
          linkedin: '3-5 times per week',
          twitter: '5-10 times per day',
          instagram: '1-2 times per day',
          facebook: '1-2 times per day',
        },
        audience_behavior_by_location: {
          'North America': 'Peak engagement: 9AM-12PM EST',
          'Europe': 'Peak engagement: 2PM-5PM GMT',
          'Asia': 'Peak engagement: 8PM-11PM IST',
        },
        seasonal_trends: [
          'Q1: New year resolutions, spring cleaning',
          'Q2: Spring promotions, tax season',
          'Q3: Back to school, end of summer',
          'Q4: Holiday shopping, year-end',
        ],
        competitor_social_analysis: {
          top_competitors: [],
          content_gaps: [],
          engagement_strategies: [],
        },
        audience_persona: {
          demographics: 'Professionals aged 25-45',
          interests: 'Technology, productivity, business growth',
          pain_points: ['Time management', 'Scaling challenges', 'Tech adoption'],
        },
        analyzed_at: new Date().toISOString(),
      }

      // Save analysis to business
      await insforge.patch(`/collections/${collections.businesses}/${id}`, {
        analysis,
        updated_at: new Date().toISOString(),
      })

      reply.send(analysis)
    } catch (error) {
      logger.error('Error analyzing business', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}