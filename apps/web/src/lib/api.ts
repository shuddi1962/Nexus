import { AuthTokens } from './auth'

class ApiClient {
  private baseURL: string
  private tokens: AuthTokens | null = null

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  setTokens(tokens: AuthTokens | null) {
    this.tokens = tokens
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.tokens?.access_token) {
      headers['Authorization'] = `Bearer ${this.tokens.access_token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async logout(refreshToken: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  }

  async refreshTokens(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Model endpoints
  async getLLMModels() {
    return this.request('/models/llm')
  }

  async getMultimodalModels() {
    return this.request('/models/multimodal')
  }

  // CRM endpoints
  async getContacts() {
    return this.request('/crm/contacts')
  }

  async createContact(contact: {
    name: string
    email?: string
    phone?: string
    company?: string
    position?: string
    tags?: string[]
    notes?: string
  }) {
    return this.request('/crm/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    })
  }

  async updateContact(id: string, contact: Partial<{
    name: string
    email: string
    phone: string
    company: string
    position: string
    tags: string[]
    notes: string
  }>) {
    return this.request(`/crm/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(contact),
    })
  }

  async deleteContact(id: string) {
    return this.request(`/crm/contacts/${id}`, {
      method: 'DELETE',
    })
  }

  async searchContacts(query: string) {
    return this.request(`/crm/contacts/search?q=${encodeURIComponent(query)}`)
  }

  // Ads endpoints
  async getAdAccounts() {
    return this.request('/ads/accounts')
  }

  async connectAdAccount(platform: string) {
    return this.request(`/ads/accounts/connect/${platform}`, {
      method: 'POST',
    })
  }

  async getCampaigns(accountId: string) {
    return this.request(`/ads/accounts/${accountId}/campaigns`)
  }

  async createCampaign(accountId: string, campaign: any) {
    return this.request(`/ads/accounts/${accountId}/campaigns`, {
      method: 'POST',
      body: JSON.stringify(campaign),
    })
  }

  async updateCampaign(campaignId: string, updates: any) {
    return this.request(`/ads/campaigns/${campaignId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async getAdsAnalytics(params?: {
    account_id?: string
    campaign_id?: string
    start_date?: string
    end_date?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.account_id) queryParams.set('account_id', params.account_id)
    if (params?.campaign_id) queryParams.set('campaign_id', params.campaign_id)
    if (params?.start_date) queryParams.set('start_date', params.start_date)
    if (params?.end_date) queryParams.set('end_date', params.end_date)

    const query = queryParams.toString()
    return this.request(`/ads/analytics${query ? `?${query}` : ''}`)
  }

  async createAdRule(rule: {
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
  }) {
    return this.request('/ads/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    })
  }

  // Payment endpoints
  async getPayments(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())

    return this.request(`/ads/payments?${query.toString()}`)
  }

  async processPayment(data: { account_id: string; amount: number; currency?: string }) {
    return this.request('/ads/payments/process', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPaymentMethods() {
    return this.request('/ads/payments/methods')
  }

  // Creative endpoints
  async getCreatives(accountId: string, params?: {
    type?: string
    status?: string
    campaign_id?: string
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.type) queryParams.set('type', params.type)
    if (params?.status) queryParams.set('status', params.status)
    if (params?.campaign_id) queryParams.set('campaign_id', params.campaign_id)
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())

    const query = queryParams.toString()
    return this.request(`/ads/accounts/${accountId}/creatives${query ? `?${query}` : ''}`)
  }

  async createCreative(accountId: string, creative: {
    name: string
    type: 'image' | 'video' | 'carousel' | 'text'
    campaign_id?: string
    status?: 'active' | 'draft' | 'archived'
    format?: string
    dimensions?: string
    file_size?: number
    url?: string
    content?: any
    tags?: string[]
  }) {
    return this.request(`/ads/accounts/${accountId}/creatives`, {
      method: 'POST',
      body: JSON.stringify(creative),
    })
  }

  async updateCreative(creativeId: string, updates: Partial<{
    name: string
    type: string
    campaign_id: string
    status: string
    format: string
    dimensions: string
    file_size: number
    url: string
    content: any
    tags: string[]
  }>) {
    return this.request(`/ads/creatives/${creativeId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteCreative(creativeId: string) {
    return this.request(`/ads/creatives/${creativeId}`, {
      method: 'DELETE',
    })
  }

  async duplicateCreative(creativeId: string) {
    return this.request(`/ads/creatives/${creativeId}/duplicate`, {
      method: 'POST',
    })
  }

  async getCreativeAnalytics(creativeId: string, params?: {
    start_date?: string
    end_date?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.set('start_date', params.start_date)
    if (params?.end_date) queryParams.set('end_date', params.end_date)

    const query = queryParams.toString()
    return this.request(`/ads/creatives/${creativeId}/analytics${query ? `?${query}` : ''}`)
  }

  // Reporting endpoints
  async getCampaignPerformanceReport(params?: {
    start_date?: string
    end_date?: string
    campaign_ids?: string
    group_by?: 'day' | 'week' | 'month'
  }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.set('start_date', params.start_date)
    if (params?.end_date) queryParams.set('end_date', params.end_date)
    if (params?.campaign_ids) queryParams.set('campaign_ids', params.campaign_ids)
    if (params?.group_by) queryParams.set('group_by', params.group_by)

    const query = queryParams.toString()
    return this.request(`/ads/reports/campaign-performance${query ? `?${query}` : ''}`)
  }

  async getROIAnalysisReport(params?: {
    start_date?: string
    end_date?: string
    attribution_window?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.set('start_date', params.start_date)
    if (params?.end_date) queryParams.set('end_date', params.end_date)
    if (params?.attribution_window) queryParams.set('attribution_window', params.attribution_window.toString())

    const query = queryParams.toString()
    return this.request(`/ads/reports/roi-analysis${query ? `?${query}` : ''}`)
  }

  async getAudiencePerformanceReport(params?: {
    start_date?: string
    end_date?: string
    audience_ids?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.set('start_date', params.start_date)
    if (params?.end_date) queryParams.set('end_date', params.end_date)
    if (params?.audience_ids) queryParams.set('audience_ids', params.audience_ids)

    const query = queryParams.toString()
    return this.request(`/ads/reports/audience-performance${query ? `?${query}` : ''}`)
  }

  async getCreativeComparisonReport(params?: {
    start_date?: string
    end_date?: string
    creative_ids?: string
    campaign_id?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.set('start_date', params.start_date)
    if (params?.end_date) queryParams.set('end_date', params.end_date)
    if (params?.creative_ids) queryParams.set('creative_ids', params.creative_ids)
    if (params?.campaign_id) queryParams.set('campaign_id', params.campaign_id)

    const query = queryParams.toString()
    return this.request(`/ads/reports/creative-comparison${query ? `?${query}` : ''}`)
  }

  async getBudgetOptimizationReport(params?: {
    current_budget?: number
    target_roas?: number
    risk_tolerance?: 'low' | 'medium' | 'high'
  }) {
    const queryParams = new URLSearchParams()
    if (params?.current_budget) queryParams.set('current_budget', params.current_budget.toString())
    if (params?.target_roas) queryParams.set('target_roas', params.target_roas.toString())
    if (params?.risk_tolerance) queryParams.set('risk_tolerance', params.risk_tolerance)

    const query = queryParams.toString()
    return this.request(`/ads/reports/budget-optimization${query ? `?${query}` : ''}`)
  }

  async exportReport(reportType: string, params?: any) {
    const queryParams = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, value.toString())
      }
    })

    return this.request(`/ads/reports/export/${reportType}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`)
  }

  // SEO endpoints
  async performSiteAudit(url: string, auditType: 'quick' | 'full' | 'technical' | 'content' = 'full') {
    return this.request('/seo/audit', {
      method: 'POST',
      body: JSON.stringify({ url, auditType })
    })
  }

  async getAudits(params?: {
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())

    const query = queryParams.toString()
    return this.request(`/seo/audits${query ? `?${query}` : ''}`)
  }

  async analyzeKeywords(keywords: string[], location?: string, language?: string) {
    return this.request('/seo/keywords/analyze', {
      method: 'POST',
      body: JSON.stringify({ keywords, location, language })
    })
  }

  async getKeywordTracking(params?: {
    keyword_ids?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.keyword_ids) queryParams.set('keyword_ids', params.keyword_ids)

    const query = queryParams.toString()
    return this.request(`/seo/keywords/tracking${query ? `?${query}` : ''}`)
  }

  async getBacklinks(domain: string, limit?: number) {
    const queryParams = new URLSearchParams()
    queryParams.set('domain', domain)
    if (limit) queryParams.set('limit', limit.toString())

    return this.request(`/seo/backlinks?${queryParams.toString()}`)
  }

  async getIndexingStatus(params?: {
    url?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.url) queryParams.set('url', params.url)

    const query = queryParams.toString()
    return this.request(`/seo/indexing${query ? `?${query}` : ''}`)
  }

  // Article extraction endpoints
  async extractArticle(url: string) {
    return this.request('/content/extract', {
      method: 'POST',
      body: JSON.stringify({ url })
    })
  }

  async getArticles(params?: {
    page?: number
    limit?: number
    status?: 'draft' | 'published' | 'scheduled'
    search?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.status) queryParams.set('status', params.status)
    if (params?.search) queryParams.set('search', params.search)

    const query = queryParams.toString()
    return this.request(`/content/articles${query ? `?${query}` : ''}`)
  }

  async rewriteContent(options: {
    content: string
    instructions?: string
    tone?: string
    length?: string
  }) {
    return this.request('/content/rewrite', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  async generateImage(options: {
    prompt: string
    style?: string
  }) {
    return this.request('/content/generate-image', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  async createArticle(article: {
    title: string
    content: string
    excerpt?: string
    tags?: string[]
    status?: 'draft' | 'published' | 'scheduled'
  }) {
    return this.request('/content/articles', {
      method: 'POST',
      body: JSON.stringify(article)
    })
  }

  // Presentation endpoints
  async createPresentation(options: {
    topic: string
    slides: number
    style?: string
    template?: string
  }) {
    return this.request('/presentations/create', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  // Creative endpoints
  async generateLogo(options: {
    name: string
    style?: string
    colors?: string[]
  }) {
    return this.request('/creative/logo/generate', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  async generateMusic(options: {
    prompt: string
    duration?: number
    style?: string
    genre?: string
  }) {
    return this.request('/creative/music/generate', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  async convertArticleToVideo(options: {
    article_url: string
    style: string
    voice: string
    duration: number
  }) {
    return this.request('/content/convert-to-video', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  // Backlinks endpoints
  async getBacklinks(domain: string, limit?: number) {
    const queryParams = new URLSearchParams()
    queryParams.set('domain', domain)
    if (limit) queryParams.set('limit', limit.toString())

    return this.request(`/seo/backlinks?${queryParams.toString()}`)
  }

  async submitForIndexing(url: string, engines?: string[]) {
    return this.request('/seo/indexing/submit', {
      method: 'POST',
      body: JSON.stringify({ url, engines: engines || ['google', 'bing'] })
    })
  }

  // Commerce endpoints
  async performProductResearch(query: string, platform?: string, options?: {
    category?: string
    price_range?: { min: number; max: number }
    sort_by?: string
  }) {
    const params = {
      query,
      platform: platform || 'amazon',
      ...options
    }
    return this.request('/commerce/research', {
      method: 'POST',
      body: JSON.stringify(params)
    })
  }

  async getMarketTrends(options?: {
    category?: string
    timeframe?: '7d' | '30d' | '90d' | '1y'
    region?: string
  }) {
    const queryParams = new URLSearchParams()
    if (options?.category) queryParams.set('category', options.category)
    if (options?.timeframe) queryParams.set('timeframe', options.timeframe)
    if (options?.region) queryParams.set('region', options.region)

    const query = queryParams.toString()
    return this.request(`/commerce/market-trends${query ? `?${query}` : ''}`)
  }

  async getAdIntelligence(options?: {
    keyword?: string
    category?: string
    platform?: 'google' | 'facebook' | 'tiktok' | 'pinterest'
    timeframe?: '7d' | '30d' | '90d' | '1y'
  }) {
    const queryParams = new URLSearchParams()
    if (options?.keyword) queryParams.set('keyword', options.keyword)
    if (options?.category) queryParams.set('category', options.category)
    if (options?.platform) queryParams.set('platform', options.platform)
    if (options?.timeframe) queryParams.set('timeframe', options.timeframe)

    const query = queryParams.toString()
    return this.request(`/commerce/ad-intelligence${query ? `?${query}` : ''}`)
  }

  async performCompetitiveAnalysis(productUrl: string, competitors?: string[], analysisType?: string) {
    return this.request('/commerce/competitive-analysis', {
      method: 'POST',
      body: JSON.stringify({ product_url: productUrl, competitors, analysis_type: analysisType })
    })
  }

  async createUGCAd(options: {
    product_url: string
    target_platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook'
    ad_format: 'video' | 'carousel' | 'story' | 'reel'
    target_audience: string[]
    campaign_objective: 'awareness' | 'traffic' | 'conversions' | 'engagement'
    budget?: number
  }) {
    return this.request('/commerce/ugc-ads/create', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  async getUGCAds(params?: {
    status?: 'draft' | 'active' | 'completed' | 'paused'
    platform?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.set('status', params.status)
    if (params?.platform) queryParams.set('platform', params.platform)

    const query = queryParams.toString()
    return this.request(`/commerce/ugc-ads${query ? `?${query}` : ''}`)
  }

  // Site management endpoints
  async connectSite(siteData: {
    name: string
    url: string
    platform: 'wordpress' | 'ghost' | 'webflow' | 'shopify' | 'custom'
    api_key?: string
    username?: string
    password?: string
  }) {
    return this.request('/sites/connect', {
      method: 'POST',
      body: JSON.stringify(siteData)
    })
  }

  async getConnectedSites() {
    return this.request('/sites')
  }

  async syncSite(siteId: string) {
    return this.request(`/sites/${siteId}/sync`, {
      method: 'POST'
    })
  }

  async publishToSite(siteId: string, articleData: {
    article_id: string
    publish_now?: boolean
    scheduled_date?: string
  }) {
    return this.request(`/sites/${siteId}/publish`, {
      method: 'POST',
      body: JSON.stringify(articleData)
    })
  }

  // Vault endpoints (admin only)
  async getApiKeys() {
    return this.request('/admin/vault')
  }

  async addApiKey(provider: string, category: string, key: string, label?: string) {
    return this.request('/admin/vault', {
      method: 'POST',
      body: JSON.stringify({ provider, category, key, label }),
    })
  }

  async testApiKey(id: string) {
    return this.request(`/admin/vault/${id}/test`, {
      method: 'POST',
    })
  }

  async deleteApiKey(id: string) {
    return this.request(`/admin/vault/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()