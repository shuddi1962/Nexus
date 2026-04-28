import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

export async function workflowsRoutes(app: FastifyInstance) {
  // Get all workflows for organization
  app.get('/workflows', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const result = await insforge.get(`/collections/${collections.workflows}`, {
        params: { org_id: `eq.${orgId}` }
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error fetching workflows', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Create workflow
  app.post('/workflows', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { name, trigger, actions } = request.body as {
        name: string
        trigger: any
        actions: any[]
      }

      const workflow = {
        org_id: orgId,
        name,
        trigger: trigger || {},
        actions: actions || [],
        active: false,
        executions_count: 0,
        created_at: new Date().toISOString()
      }

      const result = await insforge.post(`/collections/${collections.workflows}`, workflow)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating workflow', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update workflow
  app.patch('/workflows/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const updates = request.body as any

      const result = await insforge.patch(`/collections/${collections.workflows}/${id}`, updates)
      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating workflow', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Delete workflow
  app.delete('/workflows/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await insforge.delete(`/collections/${collections.workflows}/${id}`)
      reply.send({ message: 'Workflow deleted successfully' })
    } catch (error) {
      logger.error('Error deleting workflow', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Execute workflow manually
  app.post('/workflows/:id/execute', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { contact_id } = request.body as { contact_id?: string }

      const workflowResult = await insforge.get(`/collections/${collections.workflows}/${id}`)
      if (!workflowResult.data) {
        return reply.code(404).send({ error: 'Workflow not found' })
      }

      const workflow = workflowResult.data

      // Create execution record
      const execution = {
        workflow_id: id,
        contact_id: contact_id || null,
        status: 'running',
        steps_completed: [],
        started_at: new Date().toISOString()
      }

      const execResult = await insforge.post(`/collections/${collections.workflow_executions}`, execution)

      // Update execution count
      await insforge.patch(`/collections/${collections.workflows}/${id}`, {
        executions_count: (workflow.executions_count || 0) + 1
      })

      // Process workflow actions (simplified - in production, use BullMQ)
      setTimeout(() => {
        insforge.patch(`/collections/${collections.workflow_executions}/${execResult.data.id}`, {
          status: 'completed',
          finished_at: new Date().toISOString(),
          steps_completed: workflow.actions?.map((_: any, i: number) => i) || []
        }).catch(err => logger.error('Error completing workflow execution', { err }))
      }, 1000)

      reply.code(201).send({
        message: 'Workflow execution started',
        execution_id: execResult.data.id
      })
    } catch (error) {
      logger.error('Error executing workflow', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get workflow executions
  app.get('/workflows/:id/executions', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const result = await insforge.get(`/collections/${collections.workflow_executions}`, {
        params: { workflow_id: `eq.${id}` }
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error fetching workflow executions', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}
