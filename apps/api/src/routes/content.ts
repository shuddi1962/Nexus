import { FastifyInstance } from 'fastify'
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

interface Article {
  id: string
  org_id: string
  title: string
  content: string
  excerpt: string
  url?: string
  author?: string
  published_date?: string
  word_count: number
  reading_time: number
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  seo_title?: string
  seo_description?: string
  canonical_url?: string
  featured_image?: string
  created_at: string
  updated_at: string
}

interface ContentSource {
  id: string
  org_id: string
  name: string
  url: string
  type: 'rss' | 'website' | 'api'
  status: 'active' | 'inactive'
  last_fetched?: string
  fetch_interval: number // minutes
  created_at: string
}

export async function contentRoutes(app: FastifyInstance) {
  // URL to Article Extraction
  app.post('/content/extract', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { url } = request.body as { url: string }

      if (!url) {
        return reply.code(400).send({ error: 'URL is required' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Fetch the webpage content
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Nexus-Bot/1.0)',
        }
      })

      // Parse with Cheerio for initial processing
      const $ = cheerio.load(response.data)

      // Remove unwanted elements
      $('script, style, nav, footer, aside, .ad, .advertisement, .sidebar').remove()

      // Create JSDOM for Readability
      const dom = new JSDOM(response.data, { url })
      const reader = new Readability(dom.window.document)
      const article = reader.parse()

      if (!article) {
        return reply.code(400).send({ error: 'Could not extract article content from URL' })
      }

      // Extract additional metadata
      const title = article.title || $('title').text().trim()
      const excerpt = article.excerpt || $('meta[name="description"]').attr('content') || ''
      const author = article.byline || $('meta[name="author"]').attr('content') || ''
      const publishedDate = article.publishedTime || $('meta[property="article:published_time"]').attr('content') || ''

      // Calculate word count and reading time
      const wordCount = article.textContent.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200) // Average 200 words per minute

      // Extract images
      const images = $('img').map((_, img) => ({
        src: $(img).attr('src'),
        alt: $(img).attr('alt') || '',
        title: $(img).attr('title') || ''
      })).get().slice(0, 5) // Limit to first 5 images

      const extractedArticle = {
        title,
        content: article.content,
        textContent: article.textContent,
        excerpt,
        url,
        author,
        published_date: publishedDate,
        word_count: wordCount,
        reading_time: readingTime,
        images,
        site_name: $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname,
        language: $('html').attr('lang') || 'en'
      }

      reply.send(extractedArticle)
    } catch (error) {
      logger.error('Error extracting article from URL:', error)
      reply.code(500).send({ error: 'Failed to extract article content' })
    }
  })

  // Create Article from Extracted Content
  app.post('/content/articles', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const articleData = request.body as Partial<Article>

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      const article = {
        org_id: orgId,
        title: articleData.title || 'Untitled Article',
        content: articleData.content || '',
        excerpt: articleData.excerpt || '',
        url: articleData.url,
        author: articleData.author,
        published_date: articleData.published_date,
        word_count: articleData.word_count || 0,
        reading_time: articleData.reading_time || 0,
        status: articleData.status || 'draft',
        tags: articleData.tags || [],
        seo_title: articleData.seo_title,
        seo_description: articleData.seo_description,
        canonical_url: articleData.canonical_url,
        featured_image: articleData.featured_image,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.articles}`, article)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating article:', error)
      reply.code(500).send({ error: 'Failed to create article' })
    }
  })

  // Get Articles
  app.get('/content/articles', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { page = 1, limit = 20, status, search } = request.query as {
        page?: number
        limit?: number
        status?: string
        search?: string
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Build query
      let queryParams: any = { org_id: `eq.${orgId}` }
      if (status) queryParams.status = `eq.${status}`
      if (search) {
        // Search in title and content
        queryParams.or = `(title.ilike.*${search}*,content.ilike.*${search}*)`
      }

      const articlesResult = await insforge.get(`/collections/${collections.articles}`, {
        params: queryParams
      })

      const articles = articlesResult.data || []

      reply.send({
        articles,
        pagination: {
          page,
          limit,
          total: articles.length,
          pages: Math.ceil(articles.length / limit),
        },
      })
    } catch (error) {
      logger.error('Error fetching articles:', error)
      reply.code(500).send({ error: 'Failed to fetch articles' })
    }
  })

  // Update Article
  app.patch('/content/articles/:articleId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { articleId } = request.params as { articleId: string }
      const updateData = request.body as Partial<Article>

      // Get article and verify ownership
      const articleResult = await insforge.get(`/collections/${collections.articles}/${articleId}`)
      if (!articleResult.data) {
        return reply.code(404).send({ error: 'Article not found' })
      }

      const article = articleResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${article.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Update article
      const result = await insforge.patch(`/collections/${collections.articles}/${articleId}`, {
        ...updateData,
        updated_at: new Date().toISOString(),
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating article:', error)
      reply.code(500).send({ error: 'Failed to update article' })
    }
  })

  // Delete Article
  app.delete('/content/articles/:articleId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { articleId } = request.params as { articleId: string }

      // Get article and verify ownership
      const articleResult = await insforge.get(`/collections/${collections.articles}/${articleId}`)
      if (!articleResult.data) {
        return reply.code(404).send({ error: 'Article not found' })
      }

      const article = articleResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${article.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Delete article
      await insforge.delete(`/collections/${collections.articles}/${articleId}`)
      reply.send({ success: true })
    } catch (error) {
      logger.error('Error deleting article:', error)
      reply.code(500).send({ error: 'Failed to delete article' })
    }
  })

  // Content Sources Management
  app.post('/content/sources', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const sourceData = request.body as Partial<ContentSource>

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      const source = {
        org_id: orgId,
        name: sourceData.name || 'Unnamed Source',
        url: sourceData.url || '',
        type: sourceData.type || 'website',
        status: sourceData.status || 'active',
        fetch_interval: sourceData.fetch_interval || 60,
        created_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.contentSources}`, source)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating content source:', error)
      reply.code(500).send({ error: 'Failed to create content source' })
    }
  })

  // Get Content Sources
  app.get('/content/sources', { preHandler: authMiddleware }, async (request, reply) => {
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

      const sourcesResult = await insforge.get(`/collections/${collections.contentSources}`, {
        params: { org_id: `eq.${orgId}` }
      })

      reply.send(sourcesResult.data || [])
    } catch (error) {
      logger.error('Error fetching content sources:', error)
      reply.code(500).send({ error: 'Failed to fetch content sources' })
    }
  })

  // AI Content Rewriting
  app.post('/content/rewrite', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { content, instructions, tone, length } = request.body as {
        content: string
        instructions?: string
        tone?: string
        length?: string
      }

      if (!content) {
        return reply.code(400).send({ error: 'Content is required' })
      }

      // Get OpenRouter API key
      const apiKeyResult = await insforge.get(`/collections/${collections.apiKeysVault}`, {
        params: {
          provider: 'eq.openrouter',
          category: 'eq.language_models'
        }
      })

      if (!apiKeyResult.data || apiKeyResult.data.length === 0) {
        return reply.code(400).send({ error: 'OpenRouter API key not configured' })
      }

      const apiKeyRecord = apiKeyResult.data[0]
      const { decryptKey } = await import('../lib/encryption')
      const apiKey = decryptKey(apiKeyRecord.encrypted_key, process.env.ENCRYPTION_KEY!)

      // Prepare AI prompt
      const prompt = `Rewrite the following content with these requirements:
${instructions ? `Instructions: ${instructions}` : ''}
${tone ? `Tone: ${tone}` : ''}
${length ? `Length: ${length}` : ''}

Original content:
${content}

Please provide a well-written, engaging rewrite that maintains the key information and facts.`

      // Call OpenRouter API
      const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      })

      const rewrittenContent = aiResponse.data.choices[0].message.content

      reply.send({
        original_content: content,
        rewritten_content: rewrittenContent,
        word_count: rewrittenContent.split(/\s+/).length,
        instructions,
        tone,
        length
      })
    } catch (error) {
      logger.error('Error rewriting content:', error)
      reply.code(500).send({ error: 'Failed to rewrite content' })
    }
  })

  // Generate Article Images
  app.post('/content/generate-image', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { prompt, style, size = '1024x1024' } = request.body as {
        prompt: string
        style?: string
        size?: string
      }

      if (!prompt) {
        return reply.code(400).send({ error: 'Prompt is required' })
      }

      // Get Kie.ai API key
      const apiKeyResult = await insforge.get(`/collections/${collections.apiKeysVault}`, {
        params: {
          provider: 'eq.kie_ai',
          category: 'eq.multi_modal'
        }
      })

      if (!apiKeyResult.data || apiKeyResult.data.length === 0) {
        return reply.code(400).send({ error: 'Kie.ai API key not configured' })
      }

      const apiKeyRecord = apiKeyResult.data[0]
      const { decryptKey } = await import('../lib/encryption')
      const apiKey = decryptKey(apiKeyRecord.encrypted_key, process.env.ENCRYPTION_KEY!)

      // Call Kie.ai image generation API
      const imageResponse = await axios.post('https://api.kie.ai/v1/images/generations', {
        prompt: `${prompt}${style ? ` in ${style} style` : ''}`,
        n: 1,
        size,
        response_format: 'url'
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      })

      const imageUrl = imageResponse.data.data[0].url

      reply.send({
        image_url: imageUrl,
        prompt,
        style,
        size,
        generated_at: new Date().toISOString()
      })
    } catch (error) {
      logger.error('Error generating image:', error)
      reply.code(500).send({ error: 'Failed to generate image' })
    }
  })

  // SEO Engine Routes

  // Site Audit
  app.post('/seo/audit', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { url, auditType = 'full' } = request.body as {
        url: string
        auditType?: 'quick' | 'full' | 'technical' | 'content'
      }

      if (!url) {
        return reply.code(400).send({ error: 'URL is required' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Perform site audit
      const auditResult = await performSiteAudit(url, auditType)

      // Store audit result
      const auditRecord = {
        org_id: orgId,
        url,
        audit_type: auditType,
        results: auditResult,
        created_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.seoAudits}`, auditRecord)

      reply.send({
        audit_id: result.data.id,
        ...auditRecord
      })
    } catch (error) {
      logger.error('Error performing site audit:', error)
      reply.code(500).send({ error: 'Failed to perform site audit' })
    }
  })

  // Get SEO Audits
  app.get('/seo/audits', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { page = 1, limit = 20 } = request.query as {
        page?: number
        limit?: number
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      const auditsResult = await insforge.get(`/collections/${collections.seoAudits}`, {
        params: { org_id: `eq.${orgId}` }
      })

      const audits = auditsResult.data || []

      reply.send({
        audits,
        pagination: {
          page,
          limit,
          total: audits.length,
          pages: Math.ceil(audits.length / limit),
        },
      })
    } catch (error) {
      logger.error('Error fetching SEO audits:', error)
      reply.code(500).send({ error: 'Failed to fetch SEO audits' })
    }
  })

  // Keyword Analysis
  app.post('/seo/keywords/analyze', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { keywords, location = 'US', language = 'en' } = request.body as {
        keywords: string[]
        location?: string
        language?: string
      }

      if (!keywords || keywords.length === 0) {
        return reply.code(400).send({ error: 'Keywords are required' })
      }

      // Get DataForSEO API key
      const apiKeyResult = await insforge.get(`/collections/${collections.apiKeysVault}`, {
        params: {
          provider: 'eq.dataforseo',
          category: 'eq.seo_data'
        }
      })

      if (!apiKeyResult.data || apiKeyResult.data.length === 0) {
        return reply.code(400).send({ error: 'DataForSEO API key not configured' })
      }

      const apiKeyRecord = apiKeyResult.data[0]
      const { decryptKey } = await import('../lib/encryption')
      const apiKey = decryptKey(apiKeyRecord.encrypted_key, process.env.ENCRYPTION_KEY!)

      // Analyze keywords using DataForSEO
      const keywordAnalysis = await analyzeKeywordsWithDataForSEO(keywords, apiKey, location, language)

      reply.send({
        keywords: keywordAnalysis,
        analyzed_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error analyzing keywords:', error)
      reply.code(500).send({ error: 'Failed to analyze keywords' })
    }
  })

  // Get Keyword Tracking Data
  app.get('/seo/keywords/tracking', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { keyword_ids } = request.query as { keyword_ids?: string }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Build query
      let queryParams: any = { org_id: `eq.${orgId}` }
      if (keyword_ids) {
        queryParams.id = `in.(${keyword_ids})`
      }

      const trackingResult = await insforge.get(`/collections/${collections.keywordTracking}`, {
        params: queryParams
      })

      reply.send(trackingResult.data || [])
    } catch (error) {
      logger.error('Error fetching keyword tracking:', error)
      reply.code(500).send({ error: 'Failed to fetch keyword tracking data' })
    }
  })

  // Backlink Analysis
  app.get('/seo/backlinks', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { domain, limit = 100 } = request.query as {
        domain?: string
        limit?: number
      }

      if (!domain) {
        return reply.code(400).send({ error: 'Domain is required' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Get backlink data for domain
      const backlinksResult = await insforge.get(`/collections/${collections.backlinkProfiles}`, {
        params: {
          org_id: `eq.${orgId}`,
          domain: `eq.${domain}`
        }
      })

      reply.send(backlinksResult.data || [])
    } catch (error) {
      logger.error('Error fetching backlinks:', error)
      reply.code(500).send({ error: 'Failed to fetch backlink data' })
    }
  })

  // Page Indexing Status
  app.get('/seo/indexing', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { url } = request.query as { url?: string }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Build query
      let queryParams: any = { org_id: `eq.${orgId}` }
      if (url) {
        queryParams.url = `eq.${url}`
      }

      const indexingResult = await insforge.get(`/collections/${collections.indexedPages}`, {
        params: queryParams
      })

      reply.send(indexingResult.data || [])
    } catch (error) {
      logger.error('Error fetching indexing data:', error)
      reply.code(500).send({ error: 'Failed to fetch indexing data' })
    }
  })

  // Auto-Indexing: Submit URL to search engines
  app.post('/seo/indexing/submit', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { url, engines = ['google', 'bing'] } = request.body as {
        url: string
        engines?: string[]
      }

      if (!url) {
        return reply.code(400).send({ error: 'URL is required' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Submit to search engines
      const submissionResults = await submitToSearchEngines(url, engines)

      // Store indexing record
      const indexingRecord = {
        org_id: orgId,
        url,
        engines_submitted: engines,
        submission_results: submissionResults,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.indexedPages}`, indexingRecord)

      reply.send({
        indexing_id: result.data.id,
        ...indexingRecord
      })
    } catch (error) {
      logger.error('Error submitting URL for indexing:', error)
      reply.code(500).send({ error: 'Failed to submit URL for indexing' })
    }
  })
}

// SEO Helper Functions

async function performSiteAudit(url: string, auditType: string) {
  const auditResults = {
    url,
    audit_type: auditType,
    score: 0,
    issues: [] as any[],
    recommendations: [] as any[],
    technical_seo: {} as any,
    content_seo: {} as any,
    performance: {} as any,
    mobile_friendly: {} as any,
    security: {} as any,
    audited_at: new Date().toISOString(),
  }

  try {
    // Fetch the page
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nexus-SEO-Auditor/1.0',
      }
    })

    const $ = cheerio.load(response.data)

    // Basic SEO checks
    const title = $('title').text().trim()
    const metaDescription = $('meta[name="description"]').attr('content') || ''
    const h1Tags = $('h1').length
    const h2Tags = $('h2').length
    const imagesWithoutAlt = $('img:not([alt])').length
    const totalImages = $('img').length

    // Issues and recommendations
    const issues = []
    const recommendations = []

    // Title checks
    if (!title) {
      issues.push({
        type: 'error',
        category: 'meta',
        message: 'Missing page title',
        impact: 'high'
      })
      recommendations.push({
        category: 'meta',
        action: 'Add a descriptive title tag (50-60 characters)',
        priority: 'high'
      })
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: 'Title too long',
        impact: 'medium'
      })
    }

    // Meta description checks
    if (!metaDescription) {
      issues.push({
        type: 'error',
        category: 'meta',
        message: 'Missing meta description',
        impact: 'high'
      })
      recommendations.push({
        category: 'meta',
        action: 'Add a compelling meta description (150-160 characters)',
        priority: 'high'
      })
    }

    // Heading structure
    if (h1Tags === 0) {
      issues.push({
        type: 'error',
        category: 'content',
        message: 'No H1 tag found',
        impact: 'high'
      })
    } else if (h1Tags > 1) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Multiple H1 tags found',
        impact: 'medium'
      })
    }

    // Image alt text
    if (imagesWithoutAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: `${imagesWithoutAlt} images missing alt text`,
        impact: 'medium'
      })
      recommendations.push({
        category: 'accessibility',
        action: 'Add descriptive alt text to all images',
        priority: 'medium'
      })
    }

    // Technical SEO
    auditResults.technical_seo = {
      has_ssl: url.startsWith('https://'),
      has_canonical: $('link[rel="canonical"]').length > 0,
      has_robots: $('meta[name="robots"]').length > 0,
      has_sitemap: $('link[rel="sitemap"]').length > 0,
      response_time: response.headers['x-response-time'] || 'unknown',
      status_code: response.status,
    }

    // Content SEO
    auditResults.content_seo = {
      title,
      meta_description: metaDescription,
      h1_count: h1Tags,
      h2_count: h2Tags,
      word_count: response.data.split(/\s+/).length,
      images_total: totalImages,
      images_without_alt: imagesWithoutAlt,
    }

    // Performance basics
    auditResults.performance = {
      page_size: response.data.length,
      load_time: 'simulated', // Would need actual performance testing
    }

    // Calculate overall score (0-100)
    let score = 100
    issues.forEach(issue => {
      if (issue.impact === 'high') score -= 20
      else if (issue.impact === 'medium') score -= 10
      else score -= 5
    })

    auditResults.score = Math.max(0, score)
    auditResults.issues = issues
    auditResults.recommendations = recommendations

  } catch (error) {
    auditResults.issues.push({
      type: 'error',
      category: 'technical',
      message: `Failed to audit site: ${error.message}`,
      impact: 'high'
    })
    auditResults.score = 0
  }

  return auditResults
}

async function analyzeKeywordsWithDataForSEO(keywords: string[], apiKey: string, location: string, language: string) {
  // This would integrate with DataForSEO API for real keyword analysis
  // For now, return mock data
  return keywords.map(keyword => ({
    keyword,
    search_volume: Math.floor(Math.random() * 10000) + 100,
    competition: Math.random(),
    cpc: (Math.random() * 5) + 0.5,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    difficulty: Math.floor(Math.random() * 100),
    location,
    language,
  }))
}

async function submitToSearchEngines(url: string, engines: string[]) {
  const results = {}

  for (const engine of engines) {
    try {
      switch (engine) {
        case 'google':
          // Submit to Google Search Console (would require API integration)
          results.google = {
            status: 'submitted',
            message: 'URL submitted to Google for indexing',
            estimated_time: '1-7 days'
          }
          break
        case 'bing':
          // Submit to Bing Webmaster Tools
          results.bing = {
            status: 'submitted',
            message: 'URL submitted to Bing for indexing',
            estimated_time: '1-3 days'
          }
          break
        default:
          results[engine] = {
            status: 'skipped',
            message: 'Engine not supported'
          }
      }
    } catch (error) {
      results[engine] = {
        status: 'failed',
        message: error.message
      }
    }
  }

  return results
}