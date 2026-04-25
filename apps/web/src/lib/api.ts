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