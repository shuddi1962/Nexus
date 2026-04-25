import { FastifyInstance } from 'fastify'
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

interface AdAccount {
  id: string
  org_id: string
  platform: 'meta' | 'google' | 'tiktok' | 'twitter' | 'linkedin' | 'snapchat' | 'pinterest' | 'youtube' | 'amazon'
  account_id: string
  account_name: string
  credentials_encrypted: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  currency: string
  timezone: string
  billing_method?: string
  connected_at: string
  synced_at?: string
}

interface AdCreative {
  id: string
  org_id: string
  ad_account_id: string
  name: string
  type: 'image' | 'video' | 'carousel' | 'text'
  platform: string
  campaign_id?: string
  status: 'active' | 'draft' | 'archived'
  format: string
  dimensions?: string
  file_size?: number
  url?: string
  content?: any // For text ads or carousel data
  performance: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
  }
  tags: string[]
  created_at: string
  updated_at: string
}

interface AdCampaign {
  id: string
  org_id: string
  ad_account_id: string
  platform: string
  external_campaign_id?: string
  name: string
  objective?: string
  status: 'active' | 'paused' | 'draft' | 'archived'
  daily_budget?: number
  lifetime_budget?: number
  currency: string
  start_date?: string
  end_date?: string
  targeting: any
  bid_strategy?: string
  created_at: string
  synced_at?: string
}

export async function adsRoutes(app: FastifyInstance) {
  // Get all ad accounts for the current organization
  app.get('/ads/accounts', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Get ad accounts for the organization
      const accountsResult = await insforge.get(`/collections/${collections.adAccounts}`, {
        params: { org_id: `eq.${orgId}` }
      })

      reply.send(accountsResult.data)
    } catch (error) {
      logger.error('Error fetching ad accounts', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Connect new ad account (OAuth flow initiation)
  app.post('/ads/accounts/connect/:platform', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { platform } = request.params as { platform: string }

      // Validate platform
      const validPlatforms = ['meta', 'google', 'tiktok', 'twitter', 'linkedin', 'snapchat', 'pinterest', 'youtube', 'amazon']
      if (!validPlatforms.includes(platform)) {
        return reply.code(400).send({ error: 'Invalid platform' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Generate OAuth URL based on platform
      const oauthUrls = {
        meta: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI || '')}&scope=ads_management,ads_read&response_type=code`,
        google: `https://accounts.google.com/oauth/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || '')}&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline`,
        tiktok: `https://www.tiktok.com/auth/authorize?client_key=${process.env.TIKTOK_CLIENT_KEY}&redirect_uri=${encodeURIComponent(process.env.TIKTOK_REDIRECT_URI || '')}&scope=user.info.basic,video.list&response_type=code`,
        // Add other platforms...
      }

      const oauthUrl = oauthUrls[platform as keyof typeof oauthUrls]
      if (!oauthUrl) {
        return reply.code(501).send({ error: 'OAuth not implemented for this platform' })
      }

      // Create pending ad account record
      const pendingAccount = {
        org_id: orgId,
        platform,
        account_id: `pending_${Date.now()}`,
        account_name: `Connecting ${platform}...`,
        credentials_encrypted: 'pending',
        status: 'pending',
      }

      const result = await insforge.post(`/collections/${collections.adAccounts}`, pendingAccount)

      reply.send({
        oauth_url: oauthUrl,
        account_id: result.data.id,
        platform
      })
    } catch (error) {
      logger.error('Error initiating ad account connection', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // OAuth callback handler
  app.post('/ads/accounts/callback/:platform', async (request, reply) => {
    try {
      const { platform } = request.params as { platform: string }
      const { code, account_id } = request.body as { code: string; account_id: string }

      // Exchange code for access token (platform-specific logic would go here)
      // For now, we'll simulate this

      const mockCredentials = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_in: 3600,
      }

      // Encrypt credentials
      const { encryptKey } = await import('../lib/encryption')
      const encryptedCredentials = encryptKey(JSON.stringify(mockCredentials), process.env.ENCRYPTION_KEY!)

      // Update ad account with credentials
      await insforge.patch(`/collections/${collections.adAccounts}/${account_id}`, {
        credentials_encrypted: encryptedCredentials,
        status: 'connected',
        connected_at: new Date().toISOString(),
        synced_at: new Date().toISOString(),
      })

      reply.send({ success: true, account_id })
    } catch (error) {
      logger.error('Error handling OAuth callback', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get campaigns for an ad account
  app.get('/ads/accounts/:accountId/campaigns', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { accountId } = request.params as { accountId: string }

      // Verify account ownership
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${accountId}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Get campaigns
      const campaignsResult = await insforge.get(`/collections/${collections.adCampaigns}`, {
        params: { ad_account_id: `eq.${accountId}` }
      })

      reply.send(campaignsResult.data)
    } catch (error) {
      logger.error('Error fetching campaigns', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Create new campaign
  app.post('/ads/accounts/:accountId/campaigns', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { accountId } = request.params as { accountId: string }
      const campaignData = request.body as Partial<AdCampaign>

      // Verify account ownership
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${accountId}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Create campaign
      const campaign = {
        org_id: account.org_id,
        ad_account_id: accountId,
        platform: account.platform,
        name: campaignData.name || 'New Campaign',
        objective: campaignData.objective,
        status: campaignData.status || 'draft',
        daily_budget: campaignData.daily_budget,
        lifetime_budget: campaignData.lifetime_budget,
        currency: account.currency,
        start_date: campaignData.start_date,
        end_date: campaignData.end_date,
        targeting: campaignData.targeting || {},
        bid_strategy: campaignData.bid_strategy,
        created_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.adCampaigns}`, campaign)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating campaign', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update campaign
  app.patch('/ads/campaigns/:campaignId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { campaignId } = request.params as { campaignId: string }
      const updateData = request.body as Partial<AdCampaign>

      // Get campaign and verify ownership
      const campaignResult = await insforge.get(`/collections/${collections.adCampaigns}/${campaignId}`)
      if (!campaignResult.data) {
        return reply.code(404).send({ error: 'Campaign not found' })
      }

      const campaign = campaignResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${campaign.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Update campaign
      const result = await insforge.patch(`/collections/${collections.adCampaigns}/${campaignId}`, {
        ...updateData,
        synced_at: new Date().toISOString(),
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating campaign', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get analytics for campaigns
  app.get('/ads/analytics', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { account_id, campaign_id, start_date, end_date } = request.query as {
        account_id?: string
        campaign_id?: string
        start_date?: string
        end_date?: string
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Build query for analytics
      let queryParams: any = { org_id: `eq.${orgId}` }

      if (account_id) queryParams.ad_account_id = `eq.${account_id}`
      if (campaign_id) queryParams.campaign_id = `eq.${campaign_id}`
      if (start_date) queryParams.date = `gte.${start_date}`
      if (end_date) queryParams.date = queryParams.date ? `${queryParams.date},lte.${end_date}` : `lte.${end_date}`

      // In a real implementation, this would aggregate data from ad_analytics table
      // For now, return mock data
      const mockAnalytics = {
        impressions: 125000,
        clicks: 2500,
        conversions: 125,
        spend: 2500.00,
        ctr: 2.0,
        cpc: 1.00,
        cpa: 20.00,
        roas: 4.5,
      }

      reply.send(mockAnalytics)
    } catch (error) {
      logger.error('Error fetching analytics', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get payment history
  app.get('/ads/payments', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Get payment records (would be in ad_payments table)
      const paymentsResult = await insforge.get(`/collections/${collections.platformSettings}`, {
        params: { type: `eq.ad_payment`, created_by: `eq.${userId}` }
      })

      const payments = paymentsResult.data.map((record: any) => JSON.parse(record.value))

      reply.send({
        payments,
        pagination: {
          page,
          limit,
          total: payments.length,
          pages: Math.ceil(payments.length / limit),
        },
      })
    } catch (error) {
      logger.error('Error fetching payments', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Process ad spend payment
  app.post('/ads/payments/process', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { account_id, amount, currency = 'USD' } = request.body as {
        account_id: string
        amount: number
        currency?: string
      }

      // Verify account ownership
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${account_id}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Calculate commission (7% default)
      const commissionRate = 0.07
      const commission = amount * commissionRate
      const netAmount = amount - commission

      // Create payment record
      const paymentRecord = {
        account_id,
        platform: account.platform,
        amount,
        commission,
        net_amount: netAmount,
        currency,
        status: 'processing',
        user_id: userId,
        org_id: account.org_id,
        created_at: new Date().toISOString(),
      }

      // Store payment record
      const result = await insforge.post(`/collections/${collections.platformSettings}`, {
        key: `ad_payment_${Date.now()}`,
        value: JSON.stringify(paymentRecord),
        type: 'ad_payment',
        created_by: userId,
      })

      // In a real implementation, this would:
      // 1. Process payment through Stripe/Paystack/etc
      // 2. Transfer net amount to ad platform
      // 3. Update payment status

      // For now, simulate successful processing
      setTimeout(async () => {
        const updatedPayment = { ...paymentRecord, status: 'completed' }
        await insforge.patch(`/collections/${collections.platformSettings}/${result.data.id}`, {
          value: JSON.stringify(updatedPayment),
        })
      }, 5000)

      reply.send({
        payment_id: result.data.id,
        amount,
        commission,
        net_amount: netAmount,
        status: 'processing',
      })
    } catch (error) {
      logger.error('Error processing payment', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get payment methods
  app.get('/ads/payments/methods', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      // In a real implementation, this would return available payment methods
      // For now, return mock data
      const paymentMethods = [
        {
          id: 'stripe',
          name: 'Credit Card (Stripe)',
          type: 'card',
          currencies: ['USD', 'EUR', 'GBP'],
          processing_fee: '2.9% + $0.30',
        },
        {
          id: 'paypal',
          name: 'PayPal',
          type: 'paypal',
          currencies: ['USD', 'EUR', 'GBP'],
          processing_fee: '2.9% + $0.49',
        },
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          type: 'bank',
          currencies: ['USD', 'EUR', 'GBP'],
          processing_fee: '1% (min $10)',
        },
      ]

      reply.send(paymentMethods)
    } catch (error) {
      logger.error('Error fetching payment methods', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Webhook endpoints for real-time ad platform updates
  app.post('/ads/webhooks/meta', async (request, reply) => {
    try {
      const { body, headers } = request

      // Verify webhook signature (in production)
      // const signature = headers['x-hub-signature-256']
      // if (!verifyMetaSignature(body, signature)) {
      //   return reply.code(401).send({ error: 'Invalid signature' })
      // }

      logger.info('Meta webhook received', { entry: body.entry })

      // Process Meta webhook data
      for (const entry of body.entry) {
        const accountId = entry.id

        // Find the corresponding ad account in our system
        const accountResult = await insforge.get(`/collections/${collections.adAccounts}`, {
          params: { account_id: `eq.${accountId}` }
        })

        if (accountResult.data && accountResult.data.length > 0) {
          const account = accountResult.data[0]

          // Queue immediate sync for this account
          const { adSyncQueue } = await import('../jobs/ad-sync')
          await adSyncQueue.add('webhook-sync', {
            accountId: account.id,
            platform: 'meta',
            fullSync: false,
            webhookData: entry
          })

          logger.info(`Queued webhook sync for Meta account: ${accountId}`)
        }
      }

      reply.send({ success: true })
    } catch (error) {
      logger.error('Error processing Meta webhook', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  app.post('/ads/webhooks/google', async (request, reply) => {
    try {
      const { body } = request

      logger.info('Google webhook received', { resourceName: body.resourceName })

      // Process Google Ads webhook data
      const resourceMatch = body.resourceName.match(/customers\/(\d+)/)
      if (resourceMatch) {
        const customerId = resourceMatch[1]

        // Find the corresponding ad account
        const accountResult = await insforge.get(`/collections/${collections.adAccounts}`, {
          params: { account_id: `eq.${customerId}` }
        })

        if (accountResult.data && accountResult.data.length > 0) {
          const account = accountResult.data[0]

          // Queue immediate sync
          const { adSyncQueue } = await import('../jobs/ad-sync')
          await adSyncQueue.add('webhook-sync', {
            accountId: account.id,
            platform: 'google',
            fullSync: false,
            webhookData: body
          })

          logger.info(`Queued webhook sync for Google account: ${customerId}`)
        }
      }

      reply.send({ success: true })
    } catch (error) {
      logger.error('Error processing Google webhook', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get sync status for ad accounts
  app.get('/ads/accounts/:accountId/sync-status', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { accountId } = request.params as { accountId: string }

      // Verify account ownership
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${accountId}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Get recent sync jobs from Redis
      const { adSyncQueue } = await import('../jobs/ad-sync')
      const waiting = await adSyncQueue.getWaiting()
      const active = await adSyncQueue.getActive()
      const completed = await adSyncQueue.getCompleted()
      const failed = await adSyncQueue.getFailed()

      const syncJobs = [
        ...waiting.map(job => ({ id: job.id, status: 'waiting', data: job.data })),
        ...active.map(job => ({ id: job.id, status: 'active', data: job.data })),
        ...completed.slice(0, 5).map(job => ({ id: job.id, status: 'completed', data: job.data })),
        ...failed.slice(0, 5).map(job => ({ id: job.id, status: 'failed', data: job.data })),
      ].filter(job => job.data.accountId === accountId)

      reply.send({
        account_id: accountId,
        last_sync: account.synced_at,
        status: account.status,
        sync_jobs: syncJobs,
        webhook_enabled: true, // In production, check if webhooks are configured
      })
    } catch (error) {
      logger.error('Error fetching sync status', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Manual sync trigger
  app.post('/ads/accounts/:accountId/sync', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { accountId } = request.params as { accountId: string }
      const { fullSync = false } = request.body as { fullSync?: boolean }

      // Verify account ownership
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${accountId}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Queue sync job
      const { adSyncQueue } = await import('../jobs/ad-sync')
      const job = await adSyncQueue.add('manual-sync', {
        accountId,
        platform: account.platform,
        fullSync,
        triggeredBy: userId,
      })

      logger.info(`Manual sync queued for account ${accountId}`, { jobId: job.id })

      reply.send({
        job_id: job.id,
        status: 'queued',
        estimated_completion: '5-15 minutes'
      })
    } catch (error) {
      logger.error('Error triggering manual sync', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Create automated rule
  app.post('/ads/rules', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const ruleData = request.body as {
        name: string
        description?: string
        metric: string
        condition: string
        threshold: number
        timeWindow: number
        action: string
        scope: string
        campaign_ids?: string[]
        account_ids?: string[]
        enabled: boolean
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      const rule = {
        org_id: orgId,
        name: ruleData.name,
        description: ruleData.description,
        metric: ruleData.metric,
        condition: ruleData.condition,
        threshold: ruleData.threshold,
        time_window: ruleData.timeWindow,
        action: ruleData.action,
        scope: ruleData.scope,
        campaign_ids: ruleData.campaign_ids || [],
        account_ids: ruleData.account_ids || [],
        enabled: ruleData.enabled,
        created_at: new Date().toISOString(),
        last_triggered: null,
      }

      // This would go to an ad_rules table
      // For now, we'll store in platform_settings as a placeholder
      const result = await insforge.post(`/collections/${collections.platformSettings}`, {
        key: `ad_rule_${Date.now()}`,
        value: JSON.stringify(rule),
        type: 'ad_rule',
        created_by: userId,
      })

      reply.code(201).send({ id: result.data.id, ...rule })
    } catch (error) {
      logger.error('Error creating ad rule', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Creative Library Management Routes

  // Get creatives for an ad account
  app.get('/ads/accounts/:accountId/creatives', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { accountId } = request.params as { accountId: string }
      const { type, status, campaign_id, page = 1, limit = 20 } = request.query as {
        type?: string
        status?: string
        campaign_id?: string
        page?: number
        limit?: number
      }

      // Verify account ownership
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${accountId}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Build query for creatives
      let queryParams: any = { ad_account_id: `eq.${accountId}` }

      if (type) queryParams.type = `eq.${type}`
      if (status) queryParams.status = `eq.${status}`
      if (campaign_id) queryParams.campaign_id = `eq.${campaign_id}`

      // Get creatives from platform_settings (placeholder for actual creatives table)
      const creativesResult = await insforge.get(`/collections/${collections.platformSettings}`, {
        params: { type: 'eq.ad_creative', ...queryParams }
      })

      const creatives = creativesResult.data.map((record: any) => JSON.parse(record.value))

      reply.send({
        creatives,
        pagination: {
          page,
          limit,
          total: creatives.length,
          pages: Math.ceil(creatives.length / limit),
        },
      })
    } catch (error) {
      logger.error('Error fetching creatives', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Upload/create new creative
  app.post('/ads/accounts/:accountId/creatives', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { accountId } = request.params as { accountId: string }
      const creativeData = request.body as Partial<AdCreative>

      // Verify account ownership
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${accountId}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      const creative = {
        org_id: account.org_id,
        ad_account_id: accountId,
        name: creativeData.name || 'New Creative',
        type: creativeData.type || 'image',
        platform: account.platform,
        campaign_id: creativeData.campaign_id,
        status: creativeData.status || 'draft',
        format: creativeData.format || '',
        dimensions: creativeData.dimensions,
        file_size: creativeData.file_size,
        url: creativeData.url,
        content: creativeData.content || {},
        performance: creativeData.performance || {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpc: 0,
        },
        tags: creativeData.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store creative
      const result = await insforge.post(`/collections/${collections.platformSettings}`, {
        key: `ad_creative_${Date.now()}`,
        value: JSON.stringify(creative),
        type: 'ad_creative',
        created_by: userId,
      })

      reply.code(201).send({ id: result.data.id, ...creative })
    } catch (error) {
      logger.error('Error creating creative', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Update creative
  app.patch('/ads/creatives/:creativeId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { creativeId } = request.params as { creativeId: string }
      const updateData = request.body as Partial<AdCreative>

      // Get creative
      const creativeResult = await insforge.get(`/collections/${collections.platformSettings}/${creativeId}`)
      if (!creativeResult.data) {
        return reply.code(404).send({ error: 'Creative not found' })
      }

      const creative = JSON.parse(creativeResult.data.value)

      // Verify ownership through account
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${creative.ad_account_id}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Update creative
      const updatedCreative = {
        ...creative,
        ...updateData,
        updated_at: new Date().toISOString(),
      }

      await insforge.patch(`/collections/${collections.platformSettings}/${creativeId}`, {
        value: JSON.stringify(updatedCreative),
      })

      reply.send(updatedCreative)
    } catch (error) {
      logger.error('Error updating creative', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Delete creative
  app.delete('/ads/creatives/:creativeId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { creativeId } = request.params as { creativeId: string }

      // Get creative
      const creativeResult = await insforge.get(`/collections/${collections.platformSettings}/${creativeId}`)
      if (!creativeResult.data) {
        return reply.code(404).send({ error: 'Creative not found' })
      }

      const creative = JSON.parse(creativeResult.data.value)

      // Verify ownership through account
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${creative.ad_account_id}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Delete creative
      await insforge.delete(`/collections/${collections.platformSettings}/${creativeId}`)

      reply.send({ success: true })
    } catch (error) {
      logger.error('Error deleting creative', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Duplicate creative
  app.post('/ads/creatives/:creativeId/duplicate', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { creativeId } = request.params as { creativeId: string }

      // Get creative
      const creativeResult = await insforge.get(`/collections/${collections.platformSettings}/${creativeId}`)
      if (!creativeResult.data) {
        return reply.code(404).send({ error: 'Creative not found' })
      }

      const creative = JSON.parse(creativeResult.data.value)

      // Verify ownership through account
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${creative.ad_account_id}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Create duplicate
      const duplicateCreative = {
        ...creative,
        id: undefined,
        name: `${creative.name} (Copy)`,
        status: 'draft',
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpc: 0,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.platformSettings}`, {
        key: `ad_creative_${Date.now()}`,
        value: JSON.stringify(duplicateCreative),
        type: 'ad_creative',
        created_by: userId,
      })

      reply.code(201).send({ id: result.data.id, ...duplicateCreative })
    } catch (error) {
      logger.error('Error duplicating creative', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get creative performance analytics
  app.get('/ads/creatives/:creativeId/analytics', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { creativeId } = request.params as { creativeId: string }
      const { start_date, end_date } = request.query as { start_date?: string; end_date?: string }

      // Get creative
      const creativeResult = await insforge.get(`/collections/${collections.platformSettings}/${creativeId}`)
      if (!creativeResult.data) {
        return reply.code(404).send({ error: 'Creative not found' })
      }

      const creative = JSON.parse(creativeResult.data.value)

      // Verify ownership through account
      const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${creative.ad_account_id}`)
      if (!accountResult.data) {
        return reply.code(404).send({ error: 'Ad account not found' })
      }

      const account = accountResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${account.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Get analytics for this creative (would be from ad_analytics table filtered by creative_id)
      const analyticsResult = await insforge.get(`/collections/${collections.platformSettings}`, {
        params: {
          type: 'eq.ad_analytics',
          creative_id: `eq.${creativeId}`
        }
      })

      const analytics = analyticsResult.data.map((record: any) => JSON.parse(record.value))

      reply.send({
        creative_id: creativeId,
        analytics,
        summary: creative.performance,
      })
    } catch (error) {
      logger.error('Error fetching creative analytics', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Comprehensive Reporting and ROI Tracking Routes

  // Get campaign performance report
  app.get('/ads/reports/campaign-performance', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { start_date, end_date, campaign_ids, group_by = 'day' } = request.query as {
        start_date?: string
        end_date?: string
        campaign_ids?: string
        group_by?: 'day' | 'week' | 'month'
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Get campaigns for the organization
      let campaignParams: any = { org_id: `eq.${orgId}` }
      if (campaign_ids) {
        campaignParams.id = `in.(${campaign_ids})`
      }

      const campaignsResult = await insforge.get(`/collections/${collections.adCampaigns}`, {
        params: campaignParams
      })

      const campaigns = campaignsResult.data || []

      // Generate comprehensive report data
      const reportData = await generateCampaignPerformanceReport(campaigns, {
        start_date,
        end_date,
        group_by
      })

      reply.send({
        campaigns: campaigns.length,
        date_range: { start_date, end_date },
        group_by,
        summary: reportData.summary,
        data: reportData.data,
        roi_metrics: reportData.roi_metrics,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error generating campaign performance report', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get ROI analysis report
  app.get('/ads/reports/roi-analysis', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { start_date, end_date, attribution_window = 30 } = request.query as {
        start_date?: string
        end_date?: string
        attribution_window?: number
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Generate ROI analysis
      const roiAnalysis = await generateROIAnalysis(orgId, {
        start_date,
        end_date,
        attribution_window
      })

      reply.send({
        organization_id: orgId,
        date_range: { start_date, end_date },
        attribution_window,
        summary: roiAnalysis.summary,
        channel_performance: roiAnalysis.channel_performance,
        customer_lifetime_value: roiAnalysis.customer_lifetime_value,
        recommendations: roiAnalysis.recommendations,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error generating ROI analysis', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get audience performance report
  app.get('/ads/reports/audience-performance', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { start_date, end_date, audience_ids } = request.query as {
        start_date?: string
        end_date?: string
        audience_ids?: string
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Generate audience performance report
      const audienceReport = await generateAudiencePerformanceReport(orgId, {
        start_date,
        end_date,
        audience_ids
      })

      reply.send({
        organization_id: orgId,
        date_range: { start_date, end_date },
        audiences_analyzed: audienceReport.audiences_analyzed,
        performance_data: audienceReport.performance_data,
        segment_insights: audienceReport.segment_insights,
        optimization_suggestions: audienceReport.optimization_suggestions,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error generating audience performance report', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get creative performance comparison
  app.get('/ads/reports/creative-comparison', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { start_date, end_date, creative_ids, campaign_id } = request.query as {
        start_date?: string
        end_date?: string
        creative_ids?: string
        campaign_id?: string
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Generate creative comparison report
      const comparisonReport = await generateCreativeComparisonReport(orgId, {
        start_date,
        end_date,
        creative_ids,
        campaign_id
      })

      reply.send({
        organization_id: orgId,
        date_range: { start_date, end_date },
        creatives_compared: comparisonReport.creatives_compared,
        comparison_data: comparisonReport.comparison_data,
        best_performing: comparisonReport.best_performing,
        recommendations: comparisonReport.recommendations,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error generating creative comparison report', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get budget optimization recommendations
  app.get('/ads/reports/budget-optimization', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { current_budget, target_roas, risk_tolerance = 'medium' } = request.query as {
        current_budget?: number
        target_roas?: number
        risk_tolerance?: 'low' | 'medium' | 'high'
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Generate budget optimization recommendations
      const optimizationReport = await generateBudgetOptimizationReport(orgId, {
        current_budget,
        target_roas,
        risk_tolerance
      })

      reply.send({
        organization_id: orgId,
        current_budget,
        target_roas,
        risk_tolerance,
        optimization_recommendations: optimizationReport.recommendations,
        expected_outcomes: optimizationReport.expected_outcomes,
        risk_assessment: optimizationReport.risk_assessment,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error generating budget optimization report', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Export report data
  app.get('/ads/reports/export/:reportType', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { reportType } = request.params as { reportType: string }
      const query = request.query as any

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Generate export data based on report type
      let exportData: any = {}
      let filename = ''

      switch (reportType) {
        case 'campaign-performance':
          exportData = await generateCampaignPerformanceReport([], query)
          filename = `campaign-performance-${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'roi-analysis':
          exportData = await generateROIAnalysis(orgId, query)
          filename = `roi-analysis-${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'audience-performance':
          exportData = await generateAudiencePerformanceReport(orgId, query)
          filename = `audience-performance-${new Date().toISOString().split('T')[0]}.csv`
          break
        default:
          return reply.code(400).send({ error: 'Invalid report type' })
      }

      // Convert to CSV format
      const csvData = convertToCSV(exportData)

      reply.header('Content-Type', 'text/csv')
      reply.header('Content-Disposition', `attachment; filename="${filename}"`)
      reply.send(csvData)
    } catch (error) {
      logger.error('Error exporting report', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}

// Helper functions for report generation

async function generateCampaignPerformanceReport(campaigns: any[], options: any) {
  // Mock comprehensive campaign performance data
  const summary = {
    total_spend: campaigns.reduce((sum, c) => sum + (c.spend || 0), 0),
    total_impressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
    total_clicks: campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0),
    total_conversions: campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0),
    average_ctr: 0,
    average_cpc: 0,
    average_cpa: 0,
    average_roas: 0,
  }

  // Calculate averages
  if (campaigns.length > 0) {
    summary.average_ctr = campaigns.reduce((sum, c) => sum + (c.ctr || 0), 0) / campaigns.length
    summary.average_cpc = campaigns.reduce((sum, c) => sum + (c.cpc || 0), 0) / campaigns.length
    summary.average_cpa = campaigns.reduce((sum, c) => sum + (c.cpa || 0), 0) / campaigns.length
    summary.average_roas = campaigns.reduce((sum, c) => sum + (c.roas || 0), 0) / campaigns.length
  }

  // Generate time-series data
  const data = []
  const days = options.group_by === 'month' ? 30 : options.group_by === 'week' ? 7 : 1

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split('T')[0],
      spend: Math.floor(Math.random() * 1000) + 100,
      impressions: Math.floor(Math.random() * 50000) + 10000,
      clicks: Math.floor(Math.random() * 500) + 50,
      conversions: Math.floor(Math.random() * 25) + 5,
      ctr: (Math.random() * 3) + 1,
      cpc: (Math.random() * 2) + 0.5,
      cpa: Math.floor(Math.random() * 30) + 10,
      roas: (Math.random() * 2) + 1,
    })
  }

  const roi_metrics = {
    total_roi: summary.average_roas * summary.total_spend,
    payback_period: Math.floor(Math.random() * 30) + 7,
    customer_acquisition_cost: summary.average_cpa,
    lifetime_value: summary.average_cpa * 3.5, // Estimated LTV
    profit_margin: ((summary.average_roas - 1) / summary.average_roas) * 100,
  }

  return { summary, data, roi_metrics }
}

async function generateROIAnalysis(orgId: string, options: any) {
  const summary = {
    total_ad_spend: 50000,
    total_revenue_attributed: 175000,
    overall_roas: 3.5,
    total_conversions: 1250,
    average_order_value: 140,
    customer_acquisition_cost: 40,
    payback_period_days: 12,
  }

  const channel_performance = [
    {
      channel: 'Meta Ads',
      spend: 25000,
      revenue: 95000,
      roas: 3.8,
      conversions: 650,
      cpa: 38.46,
    },
    {
      channel: 'Google Ads',
      spend: 15000,
      revenue: 52000,
      roas: 3.47,
      conversions: 380,
      cpa: 39.47,
    },
    {
      channel: 'TikTok Ads',
      spend: 10000,
      revenue: 28000,
      roas: 2.8,
      conversions: 220,
      cpa: 45.45,
    },
  ]

  const customer_lifetime_value = {
    average_ltv: 420,
    ltv_to_cac_ratio: 10.5,
    retention_rate: 0.65,
    churn_rate: 0.35,
    repeat_purchase_rate: 0.45,
  }

  const recommendations = [
    {
      type: 'budget_reallocation',
      priority: 'high',
      description: 'Increase Meta Ads budget by 20% - highest ROAS channel',
      expected_impact: '+$15,000 additional revenue',
    },
    {
      type: 'creative_optimization',
      priority: 'medium',
      description: 'A/B test new creative variations on underperforming campaigns',
      expected_impact: '+5-10% conversion improvement',
    },
    {
      type: 'audience_refinement',
      priority: 'medium',
      description: 'Refine targeting for Google Ads based on top-performing segments',
      expected_impact: 'Reduce CPA by 15%',
    },
  ]

  return { summary, channel_performance, customer_lifetime_value, recommendations }
}

async function generateAudiencePerformanceReport(orgId: string, options: any) {
  const audiences_analyzed = 8

  const performance_data = [
    {
      audience_name: 'Tech Professionals 25-45',
      size: 2500000,
      spend: 5000,
      impressions: 125000,
      clicks: 2500,
      conversions: 125,
      cpa: 40,
      roas: 4.2,
      ctr: 2.0,
    },
    {
      audience_name: 'Lookalike - High Value Customers',
      size: 1800000,
      spend: 4500,
      impressions: 95000,
      clicks: 1900,
      conversions: 114,
      cpa: 39.47,
      roas: 4.8,
      ctr: 2.0,
    },
    {
      audience_name: 'Small Business Owners',
      size: 3200000,
      spend: 3200,
      impressions: 85000,
      clicks: 1700,
      conversions: 85,
      cpa: 37.65,
      roas: 3.9,
      ctr: 2.0,
    },
  ]

  const segment_insights = [
    {
      segment: 'Age 25-34',
      performance: 'best',
      insight: 'Highest conversion rate and ROAS',
      recommendation: 'Increase budget allocation',
    },
    {
      segment: 'Age 35-44',
      performance: 'good',
      insight: 'Strong performance with lower CPA',
      recommendation: 'Maintain current spend',
    },
    {
      segment: 'Age 45+',
      performance: 'needs_improvement',
      insight: 'Higher CPA, lower ROAS',
      recommendation: 'Refine targeting or reduce spend',
    },
  ]

  const optimization_suggestions = [
    {
      type: 'expand_audience',
      audience: 'Lookalike - High Value Customers',
      suggestion: 'Expand to 3M people - similar performance expected',
      confidence: 0.85,
    },
    {
      type: 'refine_targeting',
      audience: 'Small Business Owners',
      suggestion: 'Add "recently searched for business tools" behavior',
      confidence: 0.78,
    },
    {
      type: 'pause_underperforming',
      audience: 'General Audience',
      suggestion: 'Pause campaigns targeting this audience - CPA too high',
      confidence: 0.92,
    },
  ]

  return { audiences_analyzed, performance_data, segment_insights, optimization_suggestions }
}

async function generateCreativeComparisonReport(orgId: string, options: any) {
  const creatives_compared = 6

  const comparison_data = [
    {
      creative_name: 'Hero Image - Product Shot',
      type: 'image',
      impressions: 125000,
      clicks: 2500,
      ctr: 2.0,
      conversions: 125,
      cpa: 32,
      roas: 4.5,
      performance_score: 95,
    },
    {
      creative_name: 'Video - Product Demo',
      type: 'video',
      impressions: 98000,
      clicks: 1960,
      ctr: 2.0,
      conversions: 98,
      cpa: 40.82,
      roas: 3.8,
      performance_score: 82,
    },
    {
      creative_name: 'Carousel - Feature Benefits',
      type: 'carousel',
      impressions: 85000,
      clicks: 1700,
      ctr: 2.0,
      conversions: 85,
      cpa: 47.06,
      roas: 3.2,
      performance_score: 75,
    },
    {
      creative_name: 'Text Ad - Brand Search',
      type: 'text',
      impressions: 45000,
      clicks: 1350,
      ctr: 3.0,
      conversions: 68,
      cpa: 29.41,
      roas: 5.1,
      performance_score: 88,
    },
  ]

  const best_performing = {
    by_ctr: 'Text Ad - Brand Search',
    by_conversions: 'Hero Image - Product Shot',
    by_roas: 'Text Ad - Brand Search',
    by_cpa: 'Text Ad - Brand Search',
  }

  const recommendations = [
    {
      action: 'scale_winner',
      creative: 'Hero Image - Product Shot',
      reason: 'Highest conversions and ROAS',
      suggestion: 'Increase budget by 30%',
    },
    {
      action: 'test_variations',
      creative: 'Video - Product Demo',
      reason: 'Good performance but could be better',
      suggestion: 'Create 3-5 variations for A/B testing',
    },
    {
      action: 'optimize_or_pause',
      creative: 'Carousel - Feature Benefits',
      reason: 'Underperforming compared to other formats',
      suggestion: 'Review creative content or pause campaign',
    },
    {
      action: 'expand_search',
      creative: 'Text Ad - Brand Search',
      reason: 'Excellent performance on search',
      suggestion: 'Expand keyword targeting',
    },
  ]

  return { creatives_compared, comparison_data, best_performing, recommendations }
}

async function generateBudgetOptimizationReport(orgId: string, options: any) {
  const recommendations = [
    {
      campaign: 'Meta - Brand Awareness',
      current_budget: 5000,
      recommended_budget: 6500,
      change_percentage: 30,
      reason: 'Highest ROAS (4.2x) with room for growth',
      expected_additional_revenue: 7800,
      confidence_level: 0.88,
    },
    {
      campaign: 'Google - Search',
      current_budget: 3000,
      recommended_budget: 4200,
      change_percentage: 40,
      reason: 'Strong performance on branded keywords',
      expected_additional_revenue: 4200,
      confidence_level: 0.82,
    },
    {
      campaign: 'TikTok - Product Demo',
      current_budget: 2000,
      recommended_budget: 1200,
      change_percentage: -40,
      reason: 'Lower ROAS (2.1x) compared to other channels',
      expected_additional_revenue: -800,
      confidence_level: 0.91,
    },
  ]

  const expected_outcomes = {
    total_budget_change: 2500,
    expected_revenue_increase: 11200,
    expected_roas_improvement: 0.8,
    projected_payback_period: 14,
  }

  const risk_assessment = {
    risk_level: options.risk_tolerance === 'high' ? 'medium' : 'low',
    risk_factors: [
      'Market seasonality may affect performance',
      'Competitor activity could impact CPC',
      'Creative fatigue may reduce CTR over time',
    ],
    mitigation_strategies: [
      'Monitor performance weekly and adjust as needed',
      'Set up automated rules for budget reallocation',
      'Prepare backup creatives for testing',
    ],
  }

  return { recommendations, expected_outcomes, risk_assessment }
}

function convertToCSV(data: any): string {
  // Simple CSV conversion for export functionality
  // In a real implementation, this would use a proper CSV library
  if (Array.isArray(data)) {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header]
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ]
    return csvRows.join('\n')
  }

  // For single objects, convert to simple key-value pairs
  const rows = Object.entries(data).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key},${value.join('; ')}`
    }
    return `${key},${value}`
  })

  return rows.join('\n')
}