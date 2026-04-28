import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'
import axios from 'axios'

export async function voiceRoutes(app: FastifyInstance) {
  // Get voice calls for organization
  app.get('/voice/calls', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const result = await insforge.get(`/collections/${collections.appointments}`, {
        params: {
          org_id: `eq.${orgId}`,
          status: `eq.scheduled`
        }
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error fetching voice calls', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Initiate outbound call via Twilio
  app.post('/voice/call', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const { to, contact_id, script } = request.body as {
        to: string
        contact_id?: string
        script?: string
      }

      if (!to) {
        return reply.code(400).send({ error: 'Phone number is required' })
      }

      // Get Twilio credentials from vault
      const twilioSid = await getDecryptedApiKey('twilio_sid')
      const twilioToken = await getDecryptedApiKey('twilio_token')

      if (!twilioSid || !twilioToken) {
        return reply.code(400).send({ error: 'Twilio credentials not configured' })
      }

      // Initiate call via Twilio API
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Calls.json`

      const response = await axios.post(twilioUrl, {
        To: to,
        From: process.env.TWILIO_PHONE_NUMBER,
        Url: `${process.env.API_BASE_URL}/voice/twiml`,
        Method: 'POST'
      }, {
        auth: {
          username: twilioSid,
          password: twilioToken
        }
      })

      // Log the call
      await insforge.post(`/collections/${collections.appointments}`, {
        org_id: orgId,
        contact_id,
        title: 'Outbound Call',
        description: script || 'Automated call',
        start_time: new Date().toISOString(),
        status: 'scheduled',
        created_at: new Date().toISOString()
      })

      reply.code(201).send({
        message: 'Call initiated',
        call_sid: response.data.sid,
        status: response.data.status
      })
    } catch (error: any) {
      logger.error('Error initiating call', { error: error.message })
      reply.code(500).send({ error: 'Failed to initiate call' })
    }
  })

  // TwiML endpoint for call handling
  app.post('/voice/twiml', async (request, reply) => {
    try {
      const { script } = request.body as { script?: string }

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>${script || 'Hello, this is an automated call from NEXUS.'}</Say>
  <Pause length="1"/>
  <Gather numDigits="1" action="${process.env.API_BASE_URL}/voice/handle-key" method="POST">
    <Say>Press 1 to connect to sales, 2 to connect to support, or 3 to leave a voicemail.</Say>
  </Gather>
  <Say>No input received. Goodbye.</Say>
</Response>`

      reply.header('Content-Type', 'text/xml')
      reply.send(twiml)
    } catch (error) {
      logger.error('Error generating TwiML', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Handle key press during call
  app.post('/voice/handle-key', async (request, reply) => {
    try {
      const { Digits } = request.body as { Digits: string }

      let twiml = `<?xml version="1.0" encoding="UTF-8"?><Response>`

      if (Digits === '1') {
        twiml += `<Dial>${process.env.SALES_NUMBER || '+1234567890'}</Dial>`
      } else if (Digits === '2') {
        twiml += `<Dial>${process.env.SUPPORT_NUMBER || '+1234567891'}</Dial>`
      } else if (Digits === '3') {
        twiml += `<Record maxLength="30" action="${process.env.API_BASE_URL}/voice/handle-recording"/>`
      } else {
        twiml += `<Say>Invalid option. Goodbye.</Say>`
      }

      twiml += `</Response>`

      reply.header('Content-Type', 'text/xml')
      reply.send(twiml)
    } catch (error) {
      logger.error('Error handling key press', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Handle voicemail recording
  app.post('/voice/handle-recording', async (request, reply) => {
    try {
      const { RecordingUrl } = request.body as { RecordingUrl: string }

      // Save recording URL to database
      await insforge.post(`/collections/${collections.appointments}`, {
        title: 'Voicemail Recording',
        description: `Recording URL: ${RecordingUrl}`,
        start_time: new Date().toISOString(),
        status: 'completed'
      })

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for your message. Goodbye.</Say>
</Response>`

      reply.header('Content-Type', 'text/xml')
      reply.send(twiml)
    } catch (error) {
      logger.error('Error handling recording', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get call logs
  app.get('/voice/logs', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      const result = await insforge.get(`/collections/${collections.appointments}`, {
        params: {
          org_id: `eq.${orgId}`,
          title: `like.*Call*`
        }
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error fetching call logs', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}

// Helper to get decrypted API key
async function getDecryptedApiKey(provider: string): Promise<string | null> {
  try {
    const result = await insforge.get(`/collections/${collections.api_keys_vault}`, {
      params: { provider: `eq.${provider}` }
    })

    if (result.data.length === 0) return null

    // In real implementation, decrypt the key
    return result.data[0].encrypted_key
  } catch (error) {
    logger.error('Error fetching API key', { error })
    return null
  }
}
