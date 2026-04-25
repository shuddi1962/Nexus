import { FastifyInstance } from 'fastify'
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'
import axios from 'axios'

interface ProductResearch {
  id: string
  org_id: string
  query: string
  platform: 'amazon' | 'shopify' | 'etsy' | 'ebay' | 'aliexpress'
  results: ProductResult[]
  analysis: ProductAnalysis
  created_at: string
}

interface ProductResult {
  title: string
  price: number
  original_price?: number
  currency: string
  rating: number
  review_count: number
  seller: string
  url: string
  image_url: string
  platform: string
  availability: 'in_stock' | 'out_of_stock' | 'limited'
  tags: string[]
}

interface ProductAnalysis {
  market_overview: {
    total_products: number
    average_price: number
    price_range: { min: number; max: number }
    top_sellers: string[]
    trending_categories: string[]
  }
  competitive_analysis: {
    price_positioning: 'low' | 'medium' | 'high'
    unique_selling_points: string[]
    competitor_strengths: string[]
    market_gaps: string[]
  }
  recommendations: {
    suggested_price_range: { min: number; max: number }
    optimal_categories: string[]
    marketing_angles: string[]
    target_audience: string[]
  }
}

export async function commerceRoutes(app: FastifyInstance) {
  // Product Research
  app.post('/commerce/research', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { query, platform, category, price_range, sort_by } = request.body as {
        query: string
        platform?: 'amazon' | 'shopify' | 'etsy' | 'ebay' | 'aliexpress'
        category?: string
        price_range?: { min: number; max: number }
        sort_by?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'popularity'
      }

      if (!query) {
        return reply.code(400).send({ error: 'Search query is required' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Perform product research
      const researchResults = await performProductResearch(query, {
        platform,
        category,
        price_range,
        sort_by
      })

      // Analyze results
      const analysis = await analyzeProductResults(researchResults)

      // Store research results
      const researchData = {
        org_id: orgId,
        query,
        platform: platform || 'amazon',
        results: researchResults,
        analysis,
        created_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.products}`, researchData)

      reply.send({
        research_id: result.data.id,
        ...researchData
      })
    } catch (error) {
      logger.error('Error performing product research:', error)
      reply.code(500).send({ error: 'Failed to perform product research' })
    }
  })

  // Get Product Research History
  app.get('/commerce/research', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { page = 1, limit = 20, query } = request.query as {
        page?: number
        limit?: number
        query?: string
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
      if (query) {
        queryParams.query = `ilike.*${query}*`
      }

      const researchResult = await insforge.get(`/collections/${collections.products}`, {
        params: queryParams
      })

      const research = researchResult.data || []

      reply.send({
        research,
        pagination: {
          page,
          limit,
          total: research.length,
          pages: Math.ceil(research.length / limit),
        },
      })
    } catch (error) {
      logger.error('Error fetching product research:', error)
      reply.code(500).send({ error: 'Failed to fetch product research' })
    }
  })

  // Competitive Analysis
  app.post('/commerce/competitive-analysis', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { product_url, competitors, analysis_type } = request.body as {
        product_url: string
        competitors?: string[]
        analysis_type?: 'pricing' | 'features' | 'marketing' | 'full'
      }

      if (!product_url) {
        return reply.code(400).send({ error: 'Product URL is required' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Perform competitive analysis
      const analysis = await performCompetitiveAnalysis(product_url, competitors, analysis_type)

      // Store analysis results
      const analysisData = {
        org_id: orgId,
        product_url,
        competitors: competitors || [],
        analysis_type: analysis_type || 'full',
        results: analysis,
        created_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.platformSettings}`, {
        key: `competitive_analysis_${Date.now()}`,
        value: JSON.stringify(analysisData),
        type: 'competitive_analysis',
        created_by: userId,
      })

      reply.send({
        analysis_id: result.data.id,
        ...analysisData
      })
    } catch (error) {
      logger.error('Error performing competitive analysis:', error)
      reply.code(500).send({ error: 'Failed to perform competitive analysis' })
    }
  })

  // Market Trends Analysis
  app.get('/commerce/market-trends', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { category, timeframe = '30d', region = 'US' } = request.query as {
        category?: string
        timeframe?: '7d' | '30d' | '90d' | '1y'
        region?: string
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      // Perform market trends analysis
      const trends = await analyzeMarketTrends(category, timeframe, region)

      reply.send({
        category,
        timeframe,
        region,
        trends,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error analyzing market trends:', error)
      reply.code(500).send({ error: 'Failed to analyze market trends' })
    }
  })

  // Ad Intelligence - Market Insights
  app.get('/commerce/ad-intelligence', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { keyword, category, platform, timeframe = '30d' } = request.query as {
        keyword?: string
        category?: string
        platform?: 'google' | 'facebook' | 'tiktok' | 'pinterest'
        timeframe?: '7d' | '30d' | '90d' | '1y'
      }

      // Get ad intelligence data
      const intelligence = await getAdIntelligence({
        keyword,
        category,
        platform,
        timeframe
      })

      reply.send({
        keyword,
        category,
        platform,
        timeframe,
        intelligence,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      logger.error('Error fetching ad intelligence:', error)
      reply.code(500).send({ error: 'Failed to fetch ad intelligence' })
    }
  })

  // UGC Ads Creation
  app.post('/commerce/ugc-ads/create', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const {
        product_url,
        target_platform,
        ad_format,
        target_audience,
        campaign_objective,
        budget
      } = request.body as {
        product_url: string
        target_platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook'
        ad_format: 'video' | 'carousel' | 'story' | 'reel'
        target_audience: string[]
        campaign_objective: 'awareness' | 'traffic' | 'conversions' | 'engagement'
        budget?: number
      }

      if (!product_url || !target_platform) {
        return reply.code(400).send({ error: 'Product URL and target platform are required' })
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Create UGC ad campaign
      const ugcAd = await createUGCAd({
        org_id: orgId,
        product_url,
        target_platform,
        ad_format,
        target_audience,
        campaign_objective,
        budget,
        created_by: userId
      })

      reply.send(ugcAd)
    } catch (error) {
      logger.error('Error creating UGC ad:', error)
      reply.code(500).send({ error: 'Failed to create UGC ad' })
    }
  })

  // Get UGC Ads
  app.get('/commerce/ugc-ads', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { status, platform } = request.query as {
        status?: 'draft' | 'active' | 'completed' | 'paused'
        platform?: string
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Get UGC ads
      let queryParams: any = { org_id: `eq.${orgId}`, type: 'eq.ugc_ad' }
      if (status) queryParams.status = `eq.${status}`
      if (platform) queryParams.platform = `eq.${platform}`

      const adsResult = await insforge.get(`/collections/${collections.platformSettings}`, {
        params: queryParams
      })

      const ads = adsResult.data.map((record: any) => JSON.parse(record.value))

      reply.send(ads)
    } catch (error) {
      logger.error('Error fetching UGC ads:', error)
      reply.code(500).send({ error: 'Failed to fetch UGC ads' })
    }
  })
}

// Commerce Helper Functions

async function performProductResearch(query: string, options: any): Promise<ProductResult[]> {
  // In a real implementation, this would integrate with various e-commerce APIs
  // For now, return mock data that simulates real product research
  const mockResults: ProductResult[] = [
    {
      title: `${query} Professional Model`,
      price: 299.99,
      original_price: 399.99,
      currency: 'USD',
      rating: 4.5,
      review_count: 1250,
      seller: 'Premium Brands Inc',
      url: `https://amazon.com/${query.replace(/\s+/g, '-')}`,
      image_url: 'https://via.placeholder.com/300x300',
      platform: options.platform || 'amazon',
      availability: 'in_stock',
      tags: ['premium', 'professional', 'bestseller']
    },
    {
      title: `${query} Starter Kit`,
      price: 89.99,
      currency: 'USD',
      rating: 4.2,
      review_count: 890,
      seller: 'Budget Solutions Ltd',
      url: `https://amazon.com/${query.replace(/\s+/g, '-')}-starter`,
      image_url: 'https://via.placeholder.com/300x300',
      platform: options.platform || 'amazon',
      availability: 'in_stock',
      tags: ['budget', 'starter', 'affordable']
    },
    {
      title: `${query} Deluxe Edition`,
      price: 599.99,
      currency: 'USD',
      rating: 4.8,
      review_count: 567,
      seller: 'Luxury Goods Co',
      url: `https://amazon.com/${query.replace(/\s+/g, '-')}-deluxe`,
      image_url: 'https://via.placeholder.com/300x300',
      platform: options.platform || 'amazon',
      availability: 'limited',
      tags: ['luxury', 'deluxe', 'premium']
    }
  ]

  // Filter by price range if specified
  if (options.price_range) {
    return mockResults.filter(product =>
      product.price >= options.price_range.min &&
      product.price <= options.price_range.max
    )
  }

  return mockResults
}

async function analyzeProductResults(results: ProductResult[]): Promise<ProductAnalysis> {
  const prices = results.map(r => r.price)
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  // Extract sellers and categories from tags
  const sellers = [...new Set(results.map(r => r.seller))]
  const allTags = results.flatMap(r => r.tags)
  const tagFrequency: { [key: string]: number } = {}
  allTags.forEach(tag => {
    tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
  })
  const trendingCategories = Object.entries(tagFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag)

  return {
    market_overview: {
      total_products: results.length,
      average_price: averagePrice,
      price_range: { min: minPrice, max: maxPrice },
      top_sellers: sellers.slice(0, 3),
      trending_categories: trendingCategories
    },
    competitive_analysis: {
      price_positioning: averagePrice < 100 ? 'low' : averagePrice < 500 ? 'medium' : 'high',
      unique_selling_points: ['Quality materials', 'Fast shipping', 'Good reviews'],
      competitor_strengths: ['Brand recognition', 'Large customer base', 'Extensive product range'],
      market_gaps: ['Eco-friendly options', 'Customizable products', 'Local manufacturing']
    },
    recommendations: {
      suggested_price_range: {
        min: Math.max(0, averagePrice * 0.8),
        max: averagePrice * 1.2
      },
      optimal_categories: trendingCategories.slice(0, 3),
      marketing_angles: ['Value proposition', 'Quality focus', 'Customer satisfaction'],
      target_audience: ['Tech enthusiasts', 'Small business owners', 'Budget-conscious consumers']
    }
  }
}

async function performCompetitiveAnalysis(productUrl: string, competitors: string[] = [], analysisType: string = 'full') {
  // Mock competitive analysis
  return {
    product_analysis: {
      strengths: ['Good reviews', 'Competitive pricing', 'Fast shipping'],
      weaknesses: ['Limited color options', 'Basic warranty', 'Small brand'],
      market_position: 'Mid-tier competitor'
    },
    competitor_comparison: competitors.map(comp => ({
      competitor: comp,
      price_difference: Math.random() * 100 - 50,
      feature_comparison: {
        strengths: ['Better warranty', 'More colors'],
        weaknesses: ['Higher price', 'Slower shipping']
      },
      market_share: Math.random() * 20
    })),
    pricing_strategy: {
      recommended_price: 249.99,
      price_elasticity: -1.2,
      competitor_pricing: 'Premium positioning'
    },
    market_opportunities: [
      'Expand color options',
      'Improve warranty terms',
      'Add premium features',
      'Target niche markets'
    ]
  }
}

async function analyzeMarketTrends(category?: string, timeframe: string = '30d', region: string = 'US') {
  // Mock market trends analysis
  return {
    overall_trend: 'growing',
    growth_rate: 12.5,
    seasonal_patterns: {
      peak_months: ['November', 'December'],
      slow_months: ['January', 'February']
    },
    emerging_trends: [
      'Sustainable products',
      'AI-powered features',
      'Subscription models',
      'Personalization'
    ],
    consumer_behavior: {
      average_order_value: 89.50,
      purchase_frequency: 'Monthly',
      preferred_channels: ['Online stores', 'Social commerce', 'Marketplaces']
    },
    competitor_activity: {
      new_entrants: 15,
      marketing_spend_increase: 23,
      product_launches: 8
    },
    predictions: {
      '3_month_forecast': 'Continued growth',
      '6_month_forecast': 'Strong expansion',
      '1_year_forecast': 'Market saturation possible'
    }
  }
}

async function getAdIntelligence(options: any) {
  // Mock ad intelligence data
  return {
    keyword_performance: {
      search_volume_trend: 'increasing',
      competition_level: 'medium',
      cost_per_click_trend: 'stable',
      seasonal_variations: ['Q4 peaks', 'Summer slowdowns']
    },
    platform_insights: {
      best_performing_platform: 'Instagram',
      audience_engagement_rates: {
        instagram: 4.2,
        tiktok: 3.8,
        facebook: 2.1,
        google: 1.9
      },
      ad_format_effectiveness: {
        video: 'High engagement',
        carousel: 'Good conversion',
        static_image: 'Low engagement'
      }
    },
    audience_insights: {
      demographics: {
        age_groups: ['18-24', '25-34', '35-44'],
        gender_distribution: { male: 45, female: 55 },
        locations: ['Urban areas', 'Suburban', 'International']
      },
      interests: ['Technology', 'Fashion', 'Home improvement'],
      behaviors: ['Online shoppers', 'Brand loyalists', 'Price sensitive']
    },
    competitive_landscape: {
      top_competitors: ['Brand A', 'Brand B', 'Brand C'],
      their_strategies: ['Influencer marketing', 'Email campaigns', 'Retargeting'],
      market_share_distribution: {
        'Brand A': 25,
        'Brand B': 20,
        'Brand C': 15,
        others: 40
      }
    },
    recommendations: {
      optimal_budget_allocation: {
        instagram: 40,
        tiktok: 30,
        facebook: 20,
        google: 10
      },
      best_times_to_advertise: ['Evenings', 'Weekends', 'Lunch hours'],
      creative_suggestions: [
        'User-generated content',
        'Behind-the-scenes videos',
        'Customer testimonials'
      ]
    }
  }
}

async function createUGCAd(options: any) {
  const { org_id, product_url, target_platform, ad_format, target_audience, campaign_objective, budget, created_by } = options

  // Get product information from URL (mock implementation)
  const productInfo = await extractProductInfo(product_url)

  // Generate UGC ad content using AI
  const adContent = await generateUGCAdContent(productInfo, {
    platform: target_platform,
    format: ad_format,
    objective: campaign_objective,
    audience: target_audience
  })

  // Create ad campaign record
  const ugcAdData = {
    org_id,
    product_url,
    product_info: productInfo,
    target_platform,
    ad_format,
    target_audience,
    campaign_objective,
    budget,
    ad_content: adContent,
    status: 'draft',
    created_at: new Date().toISOString(),
    created_by
  }

  const result = await insforge.post(`/collections/${collections.platformSettings}`, {
    key: `ugc_ad_${Date.now()}`,
    value: JSON.stringify(ugcAdData),
    type: 'ugc_ad',
    created_by
  })

  return {
    ad_id: result.data.id,
    ...ugcAdData
  }
}

async function extractProductInfo(url: string) {
  // Mock product information extraction
  return {
    title: 'Sample Product',
    description: 'A high-quality product for modern consumers',
    price: 99.99,
    currency: 'USD',
    images: ['https://via.placeholder.com/400x400'],
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    category: 'Electronics',
    brand: 'Sample Brand'
  }
}

async function generateUGCAdContent(productInfo: any, options: any) {
  // Mock UGC ad content generation
  const scripts = {
    tiktok: [
      "Just discovered this amazing product! 😍 #ProductReview #MustHave",
      "POV: You finally find the perfect solution 🎯 #LifeChanger #ProductLove",
      "Day in the life with my new favorite product 💫 #ProductDemo #Satisfied"
    ],
    instagram: [
      "Loving this new addition to my daily routine! ✨ What are your must-have products?",
      "The quality speaks for itself! 🌟 #ProductReview #QualityMatters",
      "Before and after using this product... mind blown 🤯 #TransformationTuesday"
    ],
    youtube: [
      "Complete product review - everything you need to know!",
      "Why this product changed my routine forever",
      "Honest thoughts after 30 days of use"
    ]
  }

  return {
    script: scripts[options.platform]?.[0] || "Excited to share this amazing product! 🎉",
    hashtags: ['#ProductReview', '#MustHave', '#QualityProduct'],
    call_to_action: options.objective === 'conversions' ? 'Shop now via link in bio' : 'Save for later!',
    estimated_duration: options.format === 'video' ? '15-30 seconds' : 'Static post',
    target_audience_fit: `Optimized for ${options.audience.join(', ')} interests`
  }
}