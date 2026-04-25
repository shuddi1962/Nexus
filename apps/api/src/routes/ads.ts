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
}