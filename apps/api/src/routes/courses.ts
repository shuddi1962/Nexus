import type { FastifyInstance } from 'fastify'
import { insforge } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerCoursesRoutes(fastify: FastifyInstance) {

  // Get courses
  fastify.get('/courses', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { page = '1', limit = '20', status } = request.query as any
      const user = (request as any).user

      let query = insforge.from('courses')
        .select('*')
        .eq('org_id', user.org_id)

      if (status) {
        query = query.eq('status', status)
      }

      const courses = await query
        .order('created_at', { ascending: false })
        .range((+page - 1) * +limit, +page * +limit - 1)

      return { courses: courses.data || [], total: courses.count || 0 }
    } catch (error: any) {
      logger.error('Get courses error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get courses' })
    }
  })

  // Create course
  fastify.post('/courses', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const courseData = request.body as any

      const course = await insforge.from('courses').insert({
        org_id: user.org_id,
        title: courseData.title,
        description: courseData.description,
        status: courseData.status || 'draft',
        price: courseData.price || 0,
        currency: courseData.currency || 'USD',
        instructor_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select().single()

      return { success: true, course: course.data }
    } catch (error: any) {
      logger.error('Create course error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create course' })
    }
  })

  // Get course modules/lessons
  fastify.get('/courses/:id/modules', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any

      const modules = await insforge.from('course_modules')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true })

      return { modules: modules.data || [] }
    } catch (error: any) {
      logger.error('Get course modules error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get modules' })
    }
  })

  // Create module/lesson
  fastify.post('/courses/:id/modules', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const moduleData = request.body as any

      const module = await insforge.from('course_modules').insert({
        course_id: id,
        title: moduleData.title,
        content: moduleData.content,
        type: moduleData.type || 'lesson',
        order_index: moduleData.order_index || 0,
        duration_minutes: moduleData.duration_minutes,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, module: module.data }
    } catch (error: any) {
      logger.error('Create module error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create module' })
    }
  })

  // Get enrollments
  fastify.get('/courses/:id/enrollments', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { id } = request.params as any

      const enrollments = await insforge.from('course_enrollments')
        .select('*, users(name, email)')
        .eq('course_id', id)

      return { enrollments: enrollments.data || [] }
    } catch (error: any) {
      logger.error('Get enrollments error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get enrollments' })
    }
  })

  logger.info('Courses routes registered')
}
