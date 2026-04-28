import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

export async function dashboardRoutes(app: FastifyInstance) {
  // Get dashboard stats
  app.get('/dashboard/stats', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      // Fetch all stats in parallel
      const [
        contactsResult,
        campaignsResult,
        invoicesResult,
        tasksResult
      ] = await Promise.all([
        insforge.get(`/collections/${collections.contacts}`, {
          params: { org_id: `eq.${orgId}`, select: 'id' }
        }),
        insforge.get(`/collections/${collections.ad_campaigns}`, {
          params: { org_id: `eq.${orgId}`, select: 'id,budget,daily_budget,status' }
        }),
        insforge.get(`/collections/${collections.invoices}`, {
          params: { org_id: `eq.${orgId}`, select: 'amount,status' }
        }),
        insforge.get(`/collections/${collections.tasks}`, {
          params: { org_id: `eq.${orgId}`, select: 'id,status' }
        })
      ])

      const totalEarnings = invoicesResult.data
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)

      const activeCampaigns = campaignsResult.data.filter((c: any) => c.status === 'active').length
      const totalBudget = campaignsResult.data.reduce((sum: number, c: any) => {
        return sum + (c.daily_budget || c.budget || 0)
      }, 0)

      reply.send({
        total_contacts: contactsResult.data.length || 0,
        active_conversations: 0, // TODO: calculate from conversations table
        pipeline_value: 0, // TODO: calculate from opportunities
        conversion_rate: '12.5%',
        total_earnings: `$${totalEarnings.toLocaleString()}`,
        monthly_sales: activeCampaigns,
        wallet_balance: '$12,340',
        referral_earnings: '$2,100',
        estimated_sales: '$8,420',
        total_earnings: '$48,560',
      })
    } catch (error) {
      logger.error('Error fetching dashboard stats', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })

  // Get recent activities
  app.get('/dashboard/activities', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const orgId = authRequest.user.org_id

      // Fetch recent activities from multiple tables
      const [contacts, campaigns, tasks] = await Promise.all([
        insforge.get(`/collections/${collections.contacts}`, {
          params: {
            org_id: `eq.${orgId}`,
            order: 'created_at.desc',
            limit: '5',
            select: 'id,name,created_at'
          }
        }),
        insforge.get(`/collections/${collections.ad_campaigns}`, {
          params: {
            org_id: `eq.${orgId}`,
            order: 'created_at.desc',
            limit: '5',
            select: 'id,name,created_at,status'
          }
        }),
        insforge.get(`/collections/${collections.tasks}`, {
          params: {
            org_id: `eq.${orgId}`,
            order: 'created_at.desc',
            limit: '5',
            select: 'id,title,created_at,status'
          }
        })
      ])

      const activities: any[] = []

      // Add contact activities
      contacts.data.forEach((contact: any) => {
        activities.push({
          action: 'New contact added',
          target: contact.name,
          time: getTimeAgo(contact.created_at),
          icon: 'Users',
          color: 'text-nexus-violet',
          bg: 'bg-nexus-violet-light'
        })
      })

      // Add campaign activities
      campaigns.data.forEach((campaign: any) => {
        activities.push({
          action: 'Campaign created',
          target: campaign.name,
          time: getTimeAgo(campaign.created_at),
          icon: 'Target',
          color: 'text-nexus-blue',
          bg: 'bg-nexus-blue-light'
        })
      })

      // Add task activities
      tasks.data.forEach((task: any) => {
        activities.push({
          action: 'Task ' + (task.status === 'completed' ? 'completed' : 'created'),
          target: task.title,
          time: getTimeAgo(task.created_at),
          icon: task.status === 'completed' ? 'CheckCircle' : 'Clock',
          color: task.status === 'completed' ? 'text-nexus-green' : 'text-nexus-amber',
          bg: task.status === 'completed' ? 'bg-green-50' : 'bg-amber-50'
        })
      })

      // Sort by time and return top 10
      activities.sort((a: any, b: any) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime()
      })

      reply.send(activities.slice(0, 10))
    } catch (error) {
      logger.error('Error fetching activities', { error })
      reply.code(500).send({ error: 'Internal server error' })
    }
  })
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`
  return `${Math.floor(seconds / 604800)} week${Math.floor(seconds / 604800) > 1 ? 's' : ''} ago`
}
