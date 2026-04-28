import type { FastifyInstance } from 'fastify'
import { getInsForgeClient } from '../lib/insforge'
import { authMiddleware } from '../middleware/auth'
import { logger } from '../lib/logger'

export async function registerCalendarRoutes(fastify: FastifyInstance) {
  const insforge = getInsForgeClient()

  // Get events
  fastify.get('/calendar/events', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { start_date, end_date } = request.query as any
      const user = (request as any).user

      let query = insforge.from('calendar_events')
        .select('*')
        .eq('org_id', user.org_id)

      if (start_date) query = query.gte('start_time', start_date)
      if (end_date) query = query.lte('end_time', end_date)

      const events = await query.order('start_time', { ascending: true })

      return { events: events.data || [] }
    } catch (error: any) {
      logger.error('Get calendar events error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get events' })
    }
  })

  // Create event
  fastify.post('/calendar/events', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const eventData = request.body as any

      const event = await insforge.from('calendar_events').insert({
        org_id: user.org_id,
        title: eventData.title,
        description: eventData.description,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        location: eventData.location,
        attendees: eventData.attendees || [],
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, event: event.data }
    } catch (error: any) {
      logger.error('Create event error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create event' })
    }
  })

  // Get appointments
  fastify.get('/calendar/appointments', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user

      const appointments = await insforge.from('appointments')
        .select('*, contacts(name, email)')
        .eq('org_id', user.org_id)
        .order('scheduled_at', { ascending: true })

      return { appointments: appointments.data || [] }
    } catch (error: any) {
      logger.error('Get appointments error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to get appointments' })
    }
  })

  // Create appointment
  fastify.post('/calendar/appointments', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = (request as any).user
      const appointmentData = request.body as any

      const appointment = await insforge.from('appointments').insert({
        org_id: user.org_id,
        contact_id: appointmentData.contact_id,
        title: appointmentData.title,
        description: appointmentData.description,
        scheduled_at: appointmentData.scheduled_at,
        duration_minutes: appointmentData.duration_minutes || 60,
        status: 'scheduled',
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      return { success: true, appointment: appointment.data }
    } catch (error: any) {
      logger.error('Create appointment error:', error)
      return reply.code(500).send({ error: error.message || 'Failed to create appointment' })
    }
  })

  logger.info('Calendar routes registered')
}
