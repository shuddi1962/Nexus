import type { AuthTokens, User } from './auth'

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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
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

  async createArticle(article: {
    title: string
    content: string
    excerpt?: string
    tags?: string[]
    status?: 'draft' | 'published' | 'scheduled' | 'archived'
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
    prompt?: string
    style?: string
    primary_color?: string
    secondary_color?: string
    icon_type?: string
    font_family?: string
    layout?: string
  }) {
    return this.request('/creative/logo/generate', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  async convertArticleToVideo(options: {
    article_url?: string
    content?: string
    style: string
    voice: string
    duration: number
  }) {
    return this.request('/content/convert-to-video', {
      method: 'POST',
      body: JSON.stringify(options)
    })
  }

  // Backlinks endpoints (already defined above)
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

  // Chatbot endpoints
  async getChatbots() {
    return this.request('/chatbots')
  }

  async createChatbot(data: {
    name: string
    flow_data?: any
    channels?: string[]
    mode?: 'off' | 'suggestive' | 'autopilot'
    training_data?: any
  }) {
    return this.request('/chatbots', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateChatbot(id: string, updates: any) {
    return this.request(`/chatbots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteChatbot(id: string) {
    return this.request(`/chatbots/${id}`, {
      method: 'DELETE',
    })
  }

  async generateEmbedCode(id: string, config?: {
    colors?: { primary: string; secondary: string }
    position?: 'bottom-right' | 'bottom-left' | 'center'
    avatar?: string
    welcome_message?: string
  }) {
    return this.request(`/chatbots/${id}/embed`, {
      method: 'POST',
      body: JSON.stringify(config || {}),
    })
  }

  // Workflow endpoints
  async getWorkflows() {
    return this.request('/workflows')
  }

  async createWorkflow(data: {
    name: string
    trigger?: any
    actions?: any[]
  }) {
    return this.request('/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateWorkflow(id: string, updates: any) {
    return this.request(`/workflows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteWorkflow(id: string) {
    return this.request(`/workflows/${id}`, {
      method: 'DELETE',
    })
  }

  async executeWorkflow(id: string, contactId?: string) {
    return this.request(`/workflows/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify({ contact_id: contactId }),
    })
  }

  async getWorkflowExecutions(id: string) {
    return this.request(`/workflows/${id}/executions`)
  }

  // Voice endpoints
  async getVoiceCalls() {
    return this.request('/voice/calls')
  }

  async initiateCall(data: {
    to: string
    contact_id?: string
    script?: string
  }) {
    return this.request('/voice/call', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getVoiceLogs() {
    return this.request('/voice/logs')
  }

  // Reputation endpoints
  async getReviews() {
    return this.request('/reputation/reviews')
  }

  async respondToReview(reviewId: string, response: string) {
    return this.request(`/reputation/reviews/${reviewId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    })
  }

  async requestReview(data: {
    customer_email: string
    customer_name?: string
    order_id?: string
  }) {
    return this.request('/reputation/request', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getReputationStats() {
    return this.request('/reputation/stats')
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request('/dashboard/stats')
  }

  async getRecentActivities() {
    return this.request('/dashboard/activities')
  }

  // SMS endpoints
  async getSMSCampaigns() {
    return this.request('/sms/campaigns')
  }

  async createSMSCampaign(data: { name: string; message: string }) {
    return this.request('/sms/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async sendSMS(to: string, message: string) {
    return this.request('/sms/send', {
      method: 'POST',
      body: JSON.stringify({ to, message }),
    })
  }

  // Social media endpoints
  async getSocialPosts() {
    return this.request('/social/posts')
  }

  async createSocialPost(data: { content: string; platforms: string[] }) {
    return this.request('/social/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Courses endpoints
  async getCourses() {
    return this.request('/courses')
  }

  async createCourse(data: { title: string; description?: string; price?: number }) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Calendar endpoints
  async getCalendarEvents(params?: { start_date?: string; end_date?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.start_date) queryParams.set('start_date', params.start_date)
    if (params?.end_date) queryParams.set('end_date', params.end_date)
    const query = queryParams.toString()
    return this.request(`/calendar/events${query ? `?${query}` : ''}`)
  }

  async createCalendarEvent(data: { title: string; start_time: string; end_time: string }) {
    return this.request('/calendar/events', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Email campaigns
  async getEmailCampaigns() {
    return this.request('/email/campaigns')
  }

  async createEmailCampaign(data: { name: string; subject: string }) {
    return this.request('/email/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Design Studio endpoints
  async getDesignProjects() {
    return this.request('/design/projects')
  }

  async createDesignProject(data: { name: string; width?: number; height?: number }) {
    return this.request('/design/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateDesignProject(id: string, data: any) {
    return this.request(`/design/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteDesignProject(id: string) {
    return this.request(`/design/projects/${id}`, {
      method: 'DELETE',
    })
  }

  async generateDesign(data: { prompt: string; width?: number; height?: number; style?: string }) {
    return this.request('/design/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Images endpoints
  async getImages() {
    return this.request('/images')
  }

  async generateImage(data: {
    prompt: string;
    model?: string;
    width?: number;
    height?: number;
    style?: string;
    size?: string;
    reference_image?: string;
    operation?: string;
  }) {
    return this.request('/images/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async removeBackground(image_url: string) {
    return this.request('/images/remove-background', {
      method: 'POST',
      body: JSON.stringify({ image_url }),
    })
  }

  async upscaleImage(image_url: string, scale?: number) {
    return this.request('/images/upscale', {
      method: 'POST',
      body: JSON.stringify({ image_url, scale }),
    })
  }

  async getImageModels() {
    return this.request('/images/models')
  }

  // Video endpoints
  async getVideoProjects() {
    return this.request('/video/projects')
  }

  async createVideoProject(data: { name: string; width?: number; height?: number }) {
    return this.request('/video/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async generateVideo(data: {
    prompt: string;
    model?: string;
    duration?: number;
    aspect_ratio?: string;
    voice_id?: string;
    script?: string;
  }) {
    return this.request('/video/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async generateUGCVideo(data: {
    product_url: string;
    avatar_id?: string;
    script?: string;
    voice_id?: string;
  }) {
    return this.request('/video/ugc-ad', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Music endpoints
  async getMusicTracks() {
    return this.request('/music')
  }

  async generateMusic(data: {
    prompt: string;
    model?: string;
    duration?: number;
    genre?: string;
    mood?: string;
    instruments?: string[];
  }) {
    return this.request('/music/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async textToSpeech(data: { text: string; voice_id?: string; language?: string }) {
    return this.request('/music/tts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMusicVoices() {
    return this.request('/music/voices')
  }

  async getMusicModels() {
    return this.request('/music/models')
  }

  // Hosting endpoints
  async getDomains() {
    return this.request('/hosting/domains')
  }

  async registerDomain(data: { name: string; registrar?: string }) {
    return this.request('/hosting/domains', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getHostingPlans() {
    return this.request('/hosting/plans')
  }

  async getWebsites() {
    return this.request('/hosting/websites')
  }

  async createWebsite(data: { name: string; domain_id: string; template?: string }) {
    return this.request('/hosting/websites', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getDNSRecords(domainId: string) {
    return this.request(`/hosting/dns/${domainId}`)
  }

  async addDNSRecord(data: { domain_id: string; type: string; name: string; value: string; ttl?: number }) {
    return this.request('/hosting/dns', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Code Builder endpoints
  async getCodeProjects() {
    return this.request('/code/projects')
  }

  async createCodeProject(data: { name: string; type?: string; description?: string }) {
    return this.request('/code/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCodeSnippets() {
    return this.request('/code/snippets')
  }

  async createCodeSnippet(data: { name: string; language: string; description?: string; code: string; tags?: string[] }) {
    return this.request('/code/snippets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAPIEndpoints() {
    return this.request('/code/endpoints')
  }

  async createAPIEndpoint(data: { method: string; path: string; description?: string }) {
    return this.request('/code/endpoints', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async executeEndpoint(id: string, data?: { body?: any; headers?: any }) {
    return this.request(`/code/endpoints/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    })
  }

  // Chat Hub endpoints
  async getChats() {
    return this.request('/chat/chats')
  }

  async getChatMessages(chatId: string) {
    return this.request(`/chat/chats/${chatId}/messages`)
  }

  async sendMessage(data: { chat_id: string; content: string; type?: string }) {
    return this.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getChatIntegrations() {
    return this.request('/chat/integrations')
  }

  async connectIntegration(data: { name: string; platform: string }) {
    return this.request('/chat/integrations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Prospecting endpoints
  async getProspectingCampaigns() {
    return this.request('/prospecting/campaigns')
  }

  async createProspectingCampaign(data: { name: string; description?: string; sources?: string[] }) {
    return this.request('/prospecting/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getScrapedLeads(params?: { campaign_id?: string; status?: string; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.campaign_id) queryParams.set('campaign_id', params.campaign_id)
    if (params?.status) queryParams.set('status', params.status)
    if (params?.search) queryParams.set('search', params.search)
    const query = queryParams.toString()
    return this.request(`/prospecting/leads${query ? `?${query}` : ''}`)
  }

  async scrapeLeads(data: { source: string; query: string; campaign_id?: string; limit?: number }) {
    return this.request('/prospecting/scrape', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateLead(id: string, updates: any) {
    return this.request(`/prospecting/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async getOutreachSequences() {
    return this.request('/prospecting/sequences')
  }

  async createOutreachSequence(data: { name: string; campaign_id?: string; steps?: any[] }) {
    return this.request('/prospecting/sequences', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Broadcasts endpoints
  async getBroadcasts() {
    return this.request('/broadcasts')
  }

  async createBroadcast(data: { name: string; type?: string; channels?: string[]; message?: string }) {
    return this.request('/broadcasts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async sendBroadcast(id: string) {
    return this.request(`/broadcasts/${id}/send`, {
      method: 'POST',
    })
  }

  async getBroadcastStats() {
    return this.request('/broadcasts/stats')
  }

  // Business endpoints
  async getBusinesses() {
    return this.request('/businesses')
  }

  async getBusiness(id: string) {
    return this.request(`/businesses/${id}`)
  }

  async createBusiness(business: {
    name: string
    tagline?: string
    description?: string
    industry?: string
    sub_industry?: string[]
    business_type?: 'product' | 'service' | 'hybrid'
    country?: string
    state?: string
    city?: string
    address?: string
    phone?: string[]
    email?: string
    website?: string
    logo?: string
    brand_colors?: string[]
    brand_voice?: string
    brand_guidelines?: string
    target_audience?: string
    pain_points?: string[]
    unique_value?: string
    competitor_keywords?: string[]
  }) {
    return this.request('/businesses', {
      method: 'POST',
      body: JSON.stringify(business),
    })
  }

  async updateBusiness(id: string, business: Partial<{
    name: string
    tagline: string
    description: string
    industry: string
    sub_industry: string[]
    business_type: 'product' | 'service' | 'hybrid'
    country: string
    state: string
    city: string
    address: string
    phone: string[]
    email: string
    website: string
    logo: string
    brand_colors: string[]
    brand_voice: string
    brand_guidelines: string
    target_audience: string
    pain_points: string[]
    unique_value: string
    competitor_keywords: string[]
  }>) {
    return this.request(`/businesses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(business),
    })
  }

  async deleteBusiness(id: string) {
    return this.request(`/businesses/${id}`, {
      method: 'DELETE',
    })
  }

  async analyzeBusiness(id: string) {
    return this.request(`/businesses/${id}/analyze`, {
      method: 'POST',
    })
  }

  async getBusinessProducts(businessId: string) {
    return this.request(`/businesses/${businessId}/products`)
  }

  async addBusinessProduct(businessId: string, product: {
    name: string
    category?: string
    description?: string
    price?: number
    currency?: string
    keywords?: string[]
    featured?: boolean
    new_arrival?: boolean
    in_stock?: boolean
  }) {
    return this.request(`/businesses/${businessId}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateBusinessProduct(businessId: string, productId: string, product: Partial<{
    name: string
    category: string
    description: string
    price: number
    currency: string
    keywords: string[]
    featured: boolean
    new_arrival: boolean
    in_stock: boolean
  }>) {
    return this.request(`/businesses/${businessId}/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(product),
    })
  }

  async deleteBusinessProduct(businessId: string, productId: string) {
    return this.request(`/businesses/${businessId}/products/${productId}`, {
      method: 'DELETE',
    })
  }

  // Trends endpoints
  async getTrends(params?: { page?: number; limit?: number; region?: string; category?: string; business_id?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.region) queryParams.set('region', params.region)
    if (params?.category) queryParams.set('category', params.category)
    if (params?.business_id) queryParams.set('business_id', params.business_id)
    return this.request(`/trends?${queryParams.toString()}`)
  }

  async getGlobalTrends(region?: string, category?: string) {
    const queryParams = new URLSearchParams()
    if (region) queryParams.set('region', region)
    if (category) queryParams.set('category', category)
    return this.request(`/trends/global?${queryParams.toString()}`)
  }

  async getBusinessTrends(businessId: string) {
    return this.request(`/trends/business/${businessId}`)
  }

  async syncTrends() {
    return this.request('/trends/sync', {
      method: 'POST',
    })
  }

  async getKeywordTrends(keyword: string) {
    return this.request(`/trends/keywords/${encodeURIComponent(keyword)}`)
  }

  // Social Studio endpoints
  async getPostTemplates() {
    return this.request('/social/studio/templates')
  }

  async getSocialPlatforms() {
    return this.request('/social/studio/platforms')
  }

  async generatePost(params: {
    template_type: string
    platform: string
    business_id?: string
    trend_data?: any
    custom_prompt?: string
    num_posts?: number
  }) {
    return this.request('/social/studio/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async queuePosts(posts: any[], scheduled_date: string, scheduled_time: string) {
    return this.request('/social/studio/queue', {
      method: 'POST',
      body: JSON.stringify({ posts, scheduled_date, scheduled_time }),
    })
  }

  async getPostQueue(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    return this.request(`/social/studio/queue?${queryParams.toString()}`)
  }

  async researchHashtags(platform: string, keyword?: string) {
    const queryParams = new URLSearchParams()
    queryParams.set('platform', platform)
    if (keyword) queryParams.set('keyword', keyword)
    return this.request(`/social/studio/hashtags?${queryParams.toString()}`)
  }

  async getCalendar(start_date: string, end_date: string) {
    return this.request(`/social/studio/calendar?start_date=${start_date}&end_date=${end_date}`)
  }

  async publishPost(post_id: string, platforms: string[]) {
    return this.request('/social/studio/publish', {
      method: 'POST',
      body: JSON.stringify({ post_id, platforms }),
    })
  }
}

export const apiClient = new ApiClient()