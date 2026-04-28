import { Worker, Queue, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { env } from '../lib/env'
import { logger } from '../lib/logger'
import { insforge, collections } from '../lib/insforge'

// Initialize Redis connection
const redis = new Redis(env.REDIS_URL)

// Create ad sync queue
export const adSyncQueue = new Queue('ads-sync', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 100,
  },
})

// Worker to process ad data synchronization
const adSyncWorker = new Worker('ads-sync', async (job: Job) => {
  const { accountId, platform, fullSync = false, webhookData, triggeredBy } = job.data

  try {
    logger.info(`Syncing ad data for account: ${accountId}, platform: ${platform}`, {
      fullSync,
      hasWebhookData: !!webhookData,
      triggeredBy
    })

    // Get ad account details
    const accountResult = await insforge.get(`/collections/${collections.adAccounts}/${accountId}`)
    if (!accountResult.data) {
      throw new Error(`Ad account not found: ${accountId}`)
    }

    const account = accountResult.data

    // If webhook data provided, process it specifically
    if (webhookData) {
      await processWebhookData(account, webhookData)
    } else {
      // Full sync or regular sync
      const campaigns = await syncCampaigns(account, fullSync)
      logger.info(`Synced ${campaigns.length} campaigns for account ${accountId}`)

      // Sync analytics for each campaign (only if not a webhook-triggered update)
      if (!webhookData) {
        for (const campaign of campaigns) {
          await syncCampaignAnalytics(account, campaign.id, fullSync)
        }
      }
    }

    // Update account last sync timestamp
    await insforge.patch(`/collections/${collections.adAccounts}/${accountId}`, {
      synced_at: new Date().toISOString(),
    })

    // Log sync completion
    await logSyncEvent(account, {
      type: webhookData ? 'webhook' : (fullSync ? 'full' : 'incremental'),
      success: true,
      campaignsProcessed: 0, // Would be populated in real sync
      triggeredBy
    })

    return {
      accountId,
      platform,
      fullSync,
      webhookTriggered: !!webhookData,
      success: true
    }
  } catch (error) {
    logger.error(`Error syncing ad data for account ${accountId}:`, error)

    // Log sync failure
    await logSyncEvent(account, {
      type: 'sync',
      success: false,
      error: error.message,
      triggeredBy
    })

    throw error
  }
}, { connection: redis })

// Enhanced sync functions with better error handling
      external_campaign_id: campaignData.external_id,
      name: campaignData.name,
      objective: campaignData.objective,
      status: campaignData.status,
      daily_budget: campaignData.daily_budget,
      lifetime_budget: campaignData.lifetime_budget,
      currency: account.currency,
      start_date: campaignData.start_date,
      created_at: new Date().toISOString(),
      synced_at: new Date().toISOString(),
    }

    // Check if campaign exists
    const existingCampaigns = await insforge.get(`/collections/${collections.adCampaigns}`, {
      params: {
        ad_account_id: `eq.${account.id}`,
        external_campaign_id: `eq.${campaignData.external_id}`
      }
    })

    let campaignId
    if (existingCampaigns.data && existingCampaigns.data.length > 0) {
      // Update existing campaign
      campaignId = existingCampaigns.data[0].id
      await insforge.patch(`/collections/${collections.adCampaigns}/${campaignId}`, campaign)
    } else {
      // Create new campaign
      const result = await insforge.post(`/collections/${collections.adCampaigns}`, campaign)
      campaignId = result.data.id
    }

    syncedCampaigns.push({ id: campaignId, ...campaign })
  }

  return syncedCampaigns
}

// Helper function to sync analytics for a campaign
async function syncCampaignAnalytics(account: any, campaignId: string) {
  // In a real implementation, this would fetch analytics from the ad platform API
  // For now, generate mock analytics

  const analytics = {
    campaign_id: campaignId,
    date: new Date().toISOString().split('T')[0],
    impressions: Math.floor(Math.random() * 50000) + 10000,
    clicks: Math.floor(Math.random() * 1000) + 200,
    conversions: Math.floor(Math.random() * 50) + 5,
    spend: Math.floor(Math.random() * 500) + 100,
    ctr: (Math.random() * 5) + 1,
    cpc: (Math.random() * 2) + 0.5,
    cpa: Math.floor(Math.random() * 40) + 10,
    roas: (Math.random() * 3) + 1,
    created_at: new Date().toISOString(),
  }

  // Store analytics (would go to ad_analytics table)
  await insforge.post(`/collections/${collections.platformSettings}`, {
    key: `analytics_${campaignId}_${analytics.date}`,
    value: JSON.stringify(analytics),
    type: 'ad_analytics',
  })
}

// Function to sync all active ad accounts
export async function syncAllAdAccounts() {
  try {
    // Get all connected ad accounts
    const accountsResult = await insforge.get(`/collections/${collections.adAccounts}`, {
      params: { status: 'eq.connected' }
    })

    if (!accountsResult.data) return

    // Queue sync jobs for each account
    const syncPromises = accountsResult.data.map((account: any) =>
      adSyncQueue.add('sync-account', {
        accountId: account.id,
        platform: account.platform,
        fullSync: false
      })
    )

    await Promise.all(syncPromises)
    logger.info(`Queued sync jobs for ${accountsResult.data.length} ad accounts`)
  } catch (error) {
    logger.error('Error queuing ad account syncs:', error)
  }
}

// Schedule regular sync every 15 minutes
export async function scheduleAdSync() {
  const job = await adSyncQueue.add(
    'sync-all-accounts',
    { type: 'bulk_sync' },
    {
      repeat: {
        pattern: '*/15 * * * *', // Every 15 minutes
      },
      jobId: 'ad-sync-scheduler',
    }
  )

  logger.info('Scheduled ad sync job every 15 minutes')
}

// Worker event handlers
adSyncWorker.on('completed', (job) => {
  logger.info(`Ad sync completed: ${job.id}`)
})

adSyncWorker.on('failed', (job, err) => {
  logger.error(`Ad sync failed: ${job?.id}`, err)
})

// Process webhook data for real-time updates
async function processWebhookData(account: any, webhookData: any) {
  const { platform } = account

  switch (platform) {
    case 'meta':
      await processMetaWebhook(account, webhookData)
      break
    case 'google':
      await processGoogleWebhook(account, webhookData)
      break
    case 'tiktok':
      await processTikTokWebhook(account, webhookData)
      break
    default:
      logger.warn(`Webhook processing not implemented for platform: ${platform}`)
  }
}

// Process Meta Ads webhook data
async function processMetaWebhook(account: any, webhookData: any) {
  // Process different types of Meta webhook updates
  for (const change of webhookData.changes || []) {
    const { field, value, campaign_id, adset_id, ad_id } = change

    try {
      switch (field) {
        case 'campaign':
          await updateCampaignFromWebhook(account, campaign_id, value)
          break
        case 'adset':
          await updateAdSetFromWebhook(account, adset_id, value)
          break
        case 'ad':
          await updateAdFromWebhook(account, ad_id, value)
          break
        case 'insights':
          await updateInsightsFromWebhook(account, value)
          break
        default:
          logger.debug(`Unhandled Meta webhook field: ${field}`)
      }
    } catch (error) {
      logger.error(`Error processing Meta webhook change for field ${field}:`, error)
    }
  }
}

// Process Google Ads webhook data
async function processGoogleWebhook(account: any, webhookData: any) {
  // Process Google Ads change notifications
  const { changeResourceName, changeType, newResource } = webhookData

  try {
    if (changeResourceName.includes('campaigns/')) {
      const campaignId = changeResourceName.split('/').pop()
      await updateCampaignFromWebhook(account, campaignId, newResource)
    } else if (changeResourceName.includes('adGroups/')) {
      const adGroupId = changeResourceName.split('/').pop()
      await updateAdSetFromWebhook(account, adGroupId, newResource)
    }
    // Handle other Google Ads resource types...
  } catch (error) {
    logger.error('Error processing Google webhook:', error)
  }
}

// Process TikTok Ads webhook data
async function processTikTokWebhook(account: any, webhookData: any) {
  // Process TikTok Ads webhook updates
  const { event_type, ad_ids, campaign_ids } = webhookData

  try {
    switch (event_type) {
      case 'campaign.update':
        for (const campaignId of campaign_ids) {
          // Fetch updated campaign data from TikTok API
          await syncCampaignById(account, campaignId)
        }
        break
      case 'ad.update':
        for (const adId of ad_ids) {
          // Fetch updated ad data from TikTok API
          await syncAdById(account, adId)
        }
        break
      default:
        logger.debug(`Unhandled TikTok webhook event: ${event_type}`)
    }
  } catch (error) {
    logger.error('Error processing TikTok webhook:', error)
  }
}

// Helper functions for webhook updates
async function updateCampaignFromWebhook(account: any, campaignId: string, data: any) {
  // Update campaign data from webhook
  logger.info(`Updating campaign ${campaignId} from webhook for account ${account.id}`)
  // Implementation would update the campaign record
}

async function updateAdSetFromWebhook(account: any, adSetId: string, data: any) {
  // Update ad set data from webhook
  logger.info(`Updating ad set ${adSetId} from webhook for account ${account.id}`)
  // Implementation would update the ad set record
}

async function updateAdFromWebhook(account: any, adId: string, data: any) {
  // Update ad data from webhook
  logger.info(`Updating ad ${adId} from webhook for account ${account.id}`)
  // Implementation would update the ad record
}

async function updateInsightsFromWebhook(account: any, insightsData: any) {
  // Update analytics data from webhook
  logger.info(`Updating insights from webhook for account ${account.id}`)
  // Implementation would update analytics records
}

async function syncCampaignById(account: any, campaignId: string) {
  // Sync specific campaign by ID
  logger.info(`Syncing campaign ${campaignId} for account ${account.id}`)
}

async function syncAdById(account: any, adId: string) {
  // Sync specific ad by ID
  logger.info(`Syncing ad ${adId} for account ${account.id}`)
}

// Log sync events for monitoring
async function logSyncEvent(account: any, eventData: any) {
  const logEntry = {
    account_id: account.id,
    platform: account.platform,
    timestamp: new Date().toISOString(),
    ...eventData
  }

  try {
    await insforge.post(`/collections/${collections.platformSettings}`, {
      key: `sync_log_${Date.now()}_${Math.random()}`,
      value: JSON.stringify(logEntry),
      type: 'sync_log',
    })
  } catch (error) {
    logger.error('Error logging sync event:', error)
  }
}

// Enhanced sync functions with better error handling
async function syncCampaigns(account: any, fullSync: boolean = false) {
  // Enhanced campaign sync with better error handling
  const mockCampaigns = [
    {
      external_id: `ext_${account.platform}_1`,
      name: `${account.platform} Brand Campaign`,
      status: 'active',
      objective: 'awareness',
      daily_budget: 50.00,
      lifetime_budget: 1500.00,
      start_date: new Date().toISOString().split('T')[0],
    },
    {
      external_id: `ext_${account.platform}_2`,
      name: `${account.platform} Sales Campaign`,
      status: 'active',
      objective: 'conversions',
      daily_budget: 75.00,
      lifetime_budget: 2250.00,
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  ]

  // Upsert campaigns with better error handling
  const syncedCampaigns = []
  for (const campaignData of mockCampaigns) {
    try {
      const campaign = {
        org_id: account.org_id,
        ad_account_id: account.id,
        platform: account.platform,
        external_campaign_id: campaignData.external_id,
        name: campaignData.name,
        objective: campaignData.objective,
        status: campaignData.status,
        daily_budget: campaignData.daily_budget,
        lifetime_budget: campaignData.lifetime_budget,
        currency: account.currency,
        start_date: campaignData.start_date,
        created_at: new Date().toISOString(),
        synced_at: new Date().toISOString(),
      }

      // Check if campaign exists
      const existingCampaigns = await insforge.get(`/collections/${collections.adCampaigns}`, {
        params: {
          ad_account_id: `eq.${account.id}`,
          external_campaign_id: `eq.${campaignData.external_id}`
        }
      })

      let campaignId
      if (existingCampaigns.data && existingCampaigns.data.length > 0) {
        // Update existing campaign
        campaignId = existingCampaigns.data[0].id
        await insforge.patch(`/collections/${collections.adCampaigns}/${campaignId}`, campaign)
      } else {
        // Create new campaign
        const result = await insforge.post(`/collections/${collections.adCampaigns}`, campaign)
        campaignId = result.data.id
      }

      syncedCampaigns.push({ id: campaignId, ...campaign })
    } catch (error) {
      logger.error(`Error syncing campaign ${campaignData.external_id}:`, error)
      // Continue with other campaigns
    }
  }

  return syncedCampaigns
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await adSyncWorker.close()
  await adSyncQueue.close()
  await redis.quit()
})

export { adSyncWorker }