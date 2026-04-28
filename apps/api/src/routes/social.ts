import type { FastifyInstance } from 'fastify'
import { insforge } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerSocialRoutes(fastify: FastifyInstance) {

  // Get social posts
  fastify.get('/social/posts', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { page = '1', limit = '20', status } = request.query as any
      const user = (request as any).user

      let query = insforge.from('social_posts')
        .select('*')
        .eq('org_id', user.org_id)

      if (status) {
        query = query.eq('status', status)
      }

      const posts = await query
        .order('created_at', { ascending: false })
        .range((+page -1) * +limit, +page * +limit - 1)

      return { posts: posts.data || [], total: posts.count || 0 }
    } catch (error: any) {
      logger.error('Get social posts error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get posts' })
    }
  })

  // Create social post
  fastify.post('/social/posts', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const postData = request.body as any

      const post = await insforge.from('social_posts').insert({
        org_id: user.org_id,
        content: postData.content,
        platforms: postData.platforms || [],
        scheduled_date: postData.scheduled_date,
        scheduled_time: postData.scheduled_time,
        status: postData.status || 'draft',
        hashtags: postData.hashtags || [],
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, post: post.data }
    } catch (error: any) {
      logger.error('Create social post error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create post' })
    }
  })

  // Update social post
  fastify.patch('/social/posts/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const updates = request.body as any

      const post = await insforge.from('social_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return { success: true, post: post.data }
    } catch (error: any) {
      logger.error('Update social post error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to update post' })
    }
  })

  // Delete social post
  fastify.delete('/social/posts/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any

      await insforge.from('social_posts')
        .delete()
        .eq('id', id)

      return { success: true }
    } catch (error: any) {
      logger.error('Delete social post error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to delete post' })
    }
  })

  logger.info('Social media routes registered')
}
