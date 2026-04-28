import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

export async function reputationRoutes(app: FastifyInstance) {
  // Get reviews for organization
  app.get('/reputation/reviews', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const result = await insforge.get(`/collections/${collections.reviews || 'reviews'}`, {
        params: { org_id: `eq.${orgId}` }
      })

      reply.send(result.data || [])
    } catch (error) {
      logger.error('Error fetching reviews', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Submit review response
  app.post('/reputation/reviews/:id/respond', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { response } = request.body as { response: string }

      await insforge.patch(`/collections/${collections.reviews || 'reviews'}/${id}`, {
        business_response: response,
        responded_at: new Date().toISOString()
      })

      reply.send({ message: 'Response submitted successfully' })
    } catch (error) {
      logger.error('Error submitting review response', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Send review request to customer
  app.post('/reputation/request', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { customer_email, customer_name, order_id } = request.body as {
        customer_email: string
        customer_name?: string
        order_id?: string
      }

      // Generate review request token
      const token = require('crypto').randomBytes(32).toString('hex')

      // Store review request
      await insforge.post(`/collections/${collections.review_requests || 'review_requests'}`, {
        org_id: orgId,
        customer_email,
        customer_name,
        order_id,
        token,
        status: 'sent',
        sent_at: new Date().toISOString()
      })

      // Send email (using nodemailer - simplified)
      const reviewUrl = `${process.env.FRONTEND_URL}/review/${token}`

      // In production, send actual email via SendGrid/Twilio
      logger.info('Review request sent', { customer_email, reviewUrl })

      reply.code(201).send({ message: 'Review request sent successfully' })
    } catch (error) {
      logger.error('Error sending review request', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get review statistics
  app.get('/reputation/stats', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      // In production, calculate from actual reviews
      reply.send({
        total_reviews: 0,
        average_rating: 0,
        positive_reviews: 0,
        negative_reviews: 0,
        response_rate: 0,
        platforms: {
          google: { count: 0, rating: 0 },
          facebook: { count: 0, rating: 0 },
          yelp: { count: 0, rating: 0 }
        }
      })
    } catch (error) {
      logger.error('Error fetching reputation stats', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}
