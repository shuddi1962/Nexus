import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  tags?: string[]
  notes?: string
  created_at: string
  updated_at: string
  user_id: string
}

export async function crmRoutes(app: FastifyInstance) {
  // Get all contacts for the current user
  app.get('/crm/contacts', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id

      const result = await insforge.get(`/collections/${collections.contacts}`, {
        params: { user_id: `eq.${userId}` }
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error fetching contacts', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Create a new contact
  app.post('/crm/contacts', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id

      const { name, email, phone, company, position, tags, notes } = request.body as {
        name: string
        email?: string
        phone?: string
        company?: string
        position?: string
        tags?: string[]
        notes?: string
      }

      const contact = {
        name,
        email,
        phone,
        company,
        position,
        tags: tags || [],
        notes,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.contacts}`, contact)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating contact', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update a contact
  app.patch('/crm/contacts/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { id } = request.params as { id: string }

      const { name, email, phone, company, position, tags, notes } = request.body as {
        name?: string
        email?: string
        phone?: string
        company?: string
        position?: string
        tags?: string[]
        notes?: string
      }

      // First check if the contact belongs to the user
      const existingContact = await insforge.get(`/collections/${collections.contacts}/${id}`)
      if (!existingContact.data || existingContact.data.user_id !== userId) {
        return reply.code(403).send({ error: 'Contact not found or access denied' })
      }

      const updateData = {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(position !== undefined && { position }),
        ...(tags !== undefined && { tags }),
        ...(notes !== undefined && { notes }),
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.patch(`/collections/${collections.contacts}/${id}`, updateData)
      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating contact', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Delete a contact
  app.delete('/crm/contacts/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { id } = request.params as { id: string }

      // First check if the contact belongs to the user
      const existingContact = await insforge.get(`/collections/${collections.contacts}/${id}`)
      if (!existingContact.data || existingContact.data.user_id !== userId) {
        return reply.code(403).send({ error: 'Contact not found or access denied' })
      }

      await insforge.delete(`/collections/${collections.contacts}/${id}`)
      reply.send({ message: 'Contact deleted successfully' })
    } catch (error) {
      logger.error('Error deleting contact', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Search contacts
  app.get('/crm/contacts/search', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { q } = request.query as { q?: string }

      if (!q) {
        return reply.code(400).send({ error: 'Search query required' })
      }

      // Simple search implementation - in production you'd want full-text search
      const result = await insforge.get(`/collections/${collections.contacts}`, {
        params: { user_id: `eq.${userId}` }
      })

      const filteredContacts = result.data.filter((contact: Contact) =>
        contact.name.toLowerCase().includes(q.toLowerCase()) ||
        contact.email?.toLowerCase().includes(q.toLowerCase()) ||
        contact.company?.toLowerCase().includes(q.toLowerCase())
      )

      reply.send(filteredContacts)
    } catch (error) {
      logger.error('Error searching contacts', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}