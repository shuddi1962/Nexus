import { Worker, Queue, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { env } from '../lib/env'
import { logger } from '../lib/logger'
import { insforge, collections } from '../lib/insforge'

// Initialize Redis connection
const redis = new Redis(env.REDIS_URL)

// Create rules processing queue
export const rulesQueue = new Queue('ads-rules', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 100,
  },
})

// Worker to process automated rules
const rulesWorker = new Worker('ads-rules', async (job: Job) => {
  const { ruleId } = job.data

  try {
    logger.info(`Processing automated rule: ${ruleId}`)

    // Get the rule
    const ruleResult = await insforge.get(`/collections/${collections.platformSettings}/${ruleId}`)
    if (!ruleResult.data) {
      throw new Error(`Rule not found: ${ruleId}`)
    }

    const rule = JSON.parse(ruleResult.data.value)

    // Check if rule is enabled
    if (!rule.enabled) {
      logger.info(`Rule ${ruleId} is disabled, skipping`)
      return
    }

    // Get analytics data for the rule scope
    let analyticsParams: any = {}

    if (rule.account_ids?.length > 0) {
      analyticsParams.account_id = rule.account_ids[0] // Process one account at a time
    }

    // Get current analytics
    const currentAnalytics = await getAnalyticsData(analyticsParams)

    // Evaluate the rule condition
    const shouldTrigger = evaluateRuleCondition(rule, currentAnalytics)

    if (shouldTrigger) {
      logger.info(`Rule ${ruleId} triggered, executing action: ${rule.action}`)

      // Execute the rule action
      await executeRuleAction(rule, currentAnalytics)

      // Log the rule execution
      await logRuleExecution(rule, currentAnalytics)

      // Update last triggered timestamp
      rule.last_triggered = new Date().toISOString()
      await insforge.patch(`/collections/${collections.platformSettings}/${ruleId}`, {
        value: JSON.stringify(rule),
      })
    }

    return { success: true, triggered: shouldTrigger }
  } catch (error) {
    logger.error(`Error processing rule ${ruleId}:`, error)
    throw error
  }
}, { connection: redis })

// Helper function to get analytics data
async function getAnalyticsData(params: any) {
  // This would integrate with actual ad platform APIs
  // For now, return mock data
  return {
    impressions: Math.floor(Math.random() * 100000) + 50000,
    clicks: Math.floor(Math.random() * 2000) + 500,
    conversions: Math.floor(Math.random() * 50) + 10,
    spend: Math.floor(Math.random() * 2000) + 500,
    ctr: (Math.random() * 5) + 1,
    cpc: (Math.random() * 3) + 0.5,
    cpa: Math.floor(Math.random() * 50) + 20,
    roas: (Math.random() * 3) + 1,
  }
}

// Evaluate rule condition
function evaluateRuleCondition(rule: any, analytics: any): boolean {
  const { metric, condition, threshold } = rule

  const value = analytics[metric]
  if (value === undefined) return false

  switch (condition) {
    case 'greater_than':
      return value > threshold
    case 'less_than':
      return value < threshold
    case 'equals':
      return value === threshold
    case 'greater_equal':
      return value >= threshold
    case 'less_equal':
      return value <= threshold
    default:
      return false
  }
}

// Execute rule action
async function executeRuleAction(rule: any, analytics: any) {
  const { action, scope, campaign_ids, account_ids } = rule

  switch (action) {
    case 'pause_campaign':
      // Pause campaigns that meet the condition
      if (campaign_ids?.length > 0) {
        for (const campaignId of campaign_ids) {
          await updateCampaignStatus(campaignId, 'paused')
        }
      }
      break

    case 'increase_budget':
      // Increase budget by 20%
      if (campaign_ids?.length > 0) {
        for (const campaignId of campaign_ids) {
          await increaseCampaignBudget(campaignId, 1.2)
        }
      }
      break

    case 'decrease_budget':
      // Decrease budget by 20%
      if (campaign_ids?.length > 0) {
        for (const campaignId of campaign_ids) {
          await increaseCampaignBudget(campaignId, 0.8)
        }
      }
      break

    case 'send_notification':
      // Send notification to user
      await sendNotification(rule, analytics)
      break

    default:
      logger.warn(`Unknown rule action: ${action}`)
  }
}

// Helper functions for rule actions
async function updateCampaignStatus(campaignId: string, status: string) {
  // This would integrate with ad platform APIs
  logger.info(`Updating campaign ${campaignId} status to ${status}`)
}

async function increaseCampaignBudget(campaignId: string, multiplier: number) {
  // This would integrate with ad platform APIs
  logger.info(`Updating campaign ${campaignId} budget by multiplier ${multiplier}`)
}

async function sendNotification(rule: any, analytics: any) {
  // Send notification to user (could be email, in-app, SMS)
  logger.info(`Sending notification for rule ${rule.id}: ${rule.metric} ${rule.condition} ${rule.threshold}`)
}

// Log rule execution
async function logRuleExecution(rule: any, analytics: any) {
  const logEntry = {
    rule_id: rule.id,
    rule_name: rule.name,
    triggered_at: new Date().toISOString(),
    analytics_snapshot: analytics,
    action_taken: rule.action,
  }

  // Store in platform_settings as log
  await insforge.post(`/collections/${collections.platformSettings}`, {
    key: `rule_log_${Date.now()}`,
    value: JSON.stringify(logEntry),
    type: 'rule_log',
  })
}

// Schedule rules processing job
export async function scheduleRulesProcessing() {
  // Process all active rules every hour
  const job = await rulesQueue.add(
    'process-rules',
    { type: 'bulk_process' },
    {
      repeat: {
        pattern: '0 * * * *', // Every hour
      },
      jobId: 'rules-bulk-processor',
    }
  )

  logger.info('Scheduled rules processing job')
}

// Process all active rules
rulesWorker.on('completed', (job) => {
  logger.info(`Rule processing completed: ${job.id}`)
})

rulesWorker.on('failed', (job, err) => {
  logger.error(`Rule processing failed: ${job?.id}`, err)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  await rulesWorker.close()
  await rulesQueue.close()
  await redis.quit()
})

export { rulesWorker }