import axios from 'axios'
import { env } from './env'

export const insforge = axios.create({
  baseURL: env.INSFORGE_URL,
  headers: {
    'Authorization': `Bearer ${env.INSFORGE_API_KEY}`,
    'Content-Type': 'application/json',
  },
})

// Collections
export const collections = {
  users: 'users',
  organizations: 'organizations',
  orgMembers: 'org_members',
  sessions: 'sessions',
  apiKeysVault: 'api_keys_vault',
  platformSettings: 'platform_settings',

  // CRM collections
  contacts: 'contacts',
  conversations: 'conversations',
  messages: 'messages',
  pipelines: 'pipelines',
  opportunities: 'opportunities',

  // Ads collections
  adAccounts: 'ad_accounts',
  adCampaigns: 'ad_campaigns',
  adSets: 'ad_sets',
  ads: 'ads',
  adCreatives: 'ad_creatives',
  adAnalytics: 'ad_analytics',
  adAudiences: 'ad_audiences',
  adPayments: 'ad_payments',
  adRules: 'ad_rules',

  // Content & SEO
  articles: 'articles',
  contentSources: 'content_sources',
  seoAudits: 'seo_audits',
  indexedPages: 'indexed_pages',
  connectedSites: 'connected_sites',
  keywordTracking: 'keyword_tracking',
  backlinkProfiles: 'backlink_profiles',

  // Commerce
  products: 'products',
  orders: 'orders',
  invoices: 'invoices',

  // Other collections...
  designProjects: 'design_projects',
  generatedImages: 'generated_images',
  videoProjects: 'video_projects',
  musicTracks: 'music_tracks',
  
  // Hosting
  domains: 'domains',
  hostingPlans: 'hosting_plans',
  websites: 'websites',
  dnsRecords: 'dns_records',
  
  // Code Builder
  codeProjects: 'code_projects',
  codeSnippets: 'code_snippets',
  apiEndpoints: 'api_endpoints',
  
  // Chat Hub
  chats: 'chats',
  chatIntegrations: 'chat_integrations',

  // Business Profiles
  businesses: 'businesses',
  businessProducts: 'business_products',
  businessTeam: 'business_team',
  
  // Social & Trends
  socialAccounts: 'social_accounts',
  trends: 'trends',
  hashtags: 'hashtags',
  calendars: 'calendars',
  scheduledPosts: 'scheduled_posts',
  
  // RSS & Content
  rssFeeds: 'rss_feeds',
  contentItems: 'content_items',
  
  // Marketing
  emailCampaigns: 'email_campaigns',
  smsCampaigns: 'sms_campaigns',
  whatsappMessages: 'whatsapp_messages',
}

// Helper functions
export async function insert(table: string, data: any) {
  const response = await insforge.post(`/collections/${table}`, data)
  return response.data
}

export async function select(table: string, query?: any) {
  const response = await insforge.get(`/collections/${table}`, { params: query })
  return response.data
}

export async function update(table: string, id: string, data: any) {
  const response = await insforge.patch(`/collections/${table}/${id}`, data)
  return response.data
}

export async function remove(table: string, id: string) {
  const response = await insforge.delete(`/collections/${table}/${id}`)
  return response.data
}