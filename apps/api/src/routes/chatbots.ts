import { FastifyInstance } from 'fastify'
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

export async function chatbotsRoutes(app: FastifyInstance) {
  // Get all chatbots for organization
  app.get('/chatbots', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const result = await insforge.get(`/collections/${collections.chatbots}`, {
        params: { org_id: `eq.${orgId}` }
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error fetching chatbots', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Create chatbot
  app.post('/chatbots', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { name, flow_data, channels, mode, training_data } = request.body as {
        name: string
        flow_data?: any
        channels?: string[]
        mode?: 'off' | 'suggestive' | 'autopilot'
        training_data?: any
      }

      const chatbot = {
        org_id: orgId,
        name,
        flow_data: flow_data || {},
        channels: channels || [],
        mode: mode || 'off',
        training_data: training_data || {},
        embed_config: {},
        active: false,
        created_at: new Date().toISOString()
      }

      const result = await insforge.post(`/collections/${collections.chatbots}`, chatbot)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating chatbot', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update chatbot
  app.patch('/chatbots/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const updates = request.body as any

      const result = await insforge.patch(`/collections/${collections.chatbots}/${id}`, updates)
      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating chatbot', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Delete chatbot
  app.delete('/chatbots/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      await insforge.delete(`/collections/${collections.chatbots}/${id}`)
      reply.send({ message: 'Chatbot deleted successfully' })
    } catch (error) {
      logger.error('Error deleting chatbot', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Generate embed code
  app.post('/chatbots/:id/embed', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { colors, position, avatar, welcome_message } = request.body as {
        colors?: { primary: string; secondary: string }
        position?: 'bottom-right' | 'bottom-left' | 'center'
        avatar?: string
        welcome_message?: string
      }

      const embedCode = `
<!-- NEXUS Chatbot -->
<div id="nexus-chatbot-container"></div>
<script>
  window.NEXUS_CHATBOT_ID = '${id}';
  window.NEXUS_CHATBOT_CONFIG = ${JSON.stringify({ colors, position, avatar, welcome_message })};
  (function() {
    var s = document.createElement('script');
    s.src = '${process.env.FRONTEND_URL || 'https://nexus.app'}/chatbot.js';
    document.body.appendChild(s);
  })();
</script>
<!-- End NEXUS Chatbot -->
      `.trim()

      // Update embed config
      await insforge.patch(`/collections/${collections.chatbots}/${id}`, {
        embed_config: { colors, position, avatar, welcome_message }
      })

      reply.send({
        embed_code: embedCode,
        direct_link: `${process.env.FRONTEND_URL || 'https://nexus.app'}/chat/${id}`,
        react_component: `import { NexusChatbot } from '@nexus/chatbot';\n<NexusChatbot chatbotId="${id}" config={${JSON.stringify({ colors, position })} />`,
        wordpress_shortcode: `[nexus_chatbot id="${id}"]`,
        shopify_snippet: `{{ render 'nexus-chatbot', chatbot_id: '${id}' }}`
      })
    } catch (error) {
      logger.error('Error generating embed code', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}
