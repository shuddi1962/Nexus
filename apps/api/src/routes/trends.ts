import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth'
import { insforge } from '../lib/insforge'
import { logger } from '../lib/logger'

export async function trendsRoutes(fastify: FastifyInstance) {
  fastify.get('/trends', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any
    const { page = '1', limit = '20', region = 'US', category = '0', business_id } = request.query as any

    const offset = (parseInt(page) - 1) * parseInt(limit)

    try {
      let trends = await insforge.from('trends')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1)

      if (business_id) {
        trends = trends.filter((t: any) => t.business_id === business_id)
      }

      const { data: count } = await insforge.from('trends').select('id', { count: 'exact' })

      return {
        trends: trends || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          hasMore: offset + parseInt(limit) < (count || 0)
        }
      }
    } catch (error) {
      logger.error('Error fetching trends:', error)
      return { trends: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } }
    }
  })

  fastify.get('/trends/global', { preHandler: [authenticate] }, async (request, reply) => {
    const { region = 'US', category = '0' } = request.query as any

    try {
      const googleTrends = await fetchGoogleTrends(region, category)
      const redditTrends = await fetchRedditTrends()
      const hackerNewsTrends = await fetchHackerNewsTrends()
      const twitterTrends = await fetchTwitterTrends()
      const youtubeTrends = await fetchYouTubeTrends(region)
      const newsTrends = await fetchNewsTrends()

      const allTrends = [
        ...googleTrends.map((t: any) => ({ ...t, source: 'google', source_icon: '📈' })),
        ...redditTrends.map((t: any) => ({ ...t, source: 'reddit', source_icon: '🔴' })),
        ...hackerNewsTrends.map((t: any) => ({ ...t, source: 'hackernews', source_icon: '💻' })),
        ...twitterTrends.map((t: any) => ({ ...t, source: 'twitter', source_icon: '🐦' })),
        ...youtubeTrends.map((t: any) => ({ ...t, source: 'youtube', source_icon: '🎬' })),
        ...newsTrends.map((t: any) => ({ ...t, source: 'news', source_icon: '📰' }))
      ].slice(0, 50)

      const scoredTrends = scoreTrends(allTrends)

      return { trends: scoredTrends }
    } catch (error) {
      logger.error('Error fetching global trends:', error)
      return { trends: [], error: 'Failed to fetch trends' }
    }
  })

  fastify.get('/trends/business/:businessId', { preHandler: [authenticate] }, async (request, reply) => {
    const { businessId } = request.params as any

    try {
      const business = await insforge.from('businesses').select('*').eq('id', businessId).single()
      if (!business) {
        return { trends: [], error: 'Business not found' }
      }

      const keywords = business.competitor_keywords || []
      const industry = business.industry || ''

      const trends = await insforge.from('trends')
        .select('*')
        .order('score', { ascending: false })
        .limit(20)

      const relevantTrends = (trends || []).filter((t: any) => {
        if (!keywords.length && !industry) return true
        const searchText = `${t.title || ''} ${t.description || ''}`.toLowerCase()
        return keywords.some((k: string) => searchText.includes(k.toLowerCase())) ||
               t.category?.toLowerCase() === industry.toLowerCase()
      })

      return { trends: relevantTrends }
    } catch (error) {
      logger.error('Error fetching business trends:', error)
      return { trends: [], error: 'Failed to fetch trends' }
    }
  })

  fastify.post('/trends/sync', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any

    try {
      const googleTrends = await fetchGoogleTrends('US', '0')
      const redditTrends = await fetchRedditTrends()
      const hackerNewsTrends = await fetchHackerNewsTrends()
      const twitterTrends = await fetchTwitterTrends()
      const youtubeTrends = await fetchYouTubeTrends('US')
      const newsTrends = await fetchNewsTrends()

      const allTrendData = [
        ...googleTrends,
        ...redditTrends,
        ...hackerNewsTrends,
        ...twitterTrends,
        ...youtubeTrends,
        ...newsTrends
      ]

      const scoredData = scoreTrends(allTrendData)

      for (const trend of scoredData.slice(0, 100)) {
        const existing = await insforge.from('trends')
          .select('id')
          .eq('title', trend.title)
          .single()

        if (existing) {
          await insforge.from('trends')
            .update({
              score: trend.score,
              search_volume: trend.searchVolume,
              momentum: trend.momentum,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
        } else {
          await insforge.from('trends').insert({
            title: trend.title,
            description: trend.description,
            category: trend.category,
            region: trend.region,
            search_volume: trend.searchVolume,
            momentum: trend.momentum,
            score: trend.score,
            source: trend.source,
            source_icon: trend.source_icon,
            trend_date: new Date().toISOString(),
            status: 'new',
            created_at: new Date().toISOString()
          })
        }
      }

      return { success: true, synced: scoredData.length }
    } catch (error) {
      logger.error('Error syncing trends:', error)
      return { success: false, error: 'Failed to sync trends' }
    }
  })

  fastify.get('/trends/keywords/:keyword', { preHandler: [authenticate] }, async (request, reply) => {
    const { keyword } = request.params as any

    try {
      const response = await fetch(
        `https://trends.googleapis.com/v1/timeserieselines?key=${process.env.GOOGLE_TRENDS_KEY}&hl=en-US&tz=300&compareLongTerm=1&keyword=${encodeURIComponent(keyword)}&category=0&property=WEB_SEARCH`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      return { keyword, data: data }
    } catch (error) {
      logger.error('Error fetching keyword trends:', error)
      return { keyword, error: 'Failed to fetch keyword trends' }
    }
  })
}

function scoreTrends(trends: any[]): any[] {
  return trends.map(trend => {
    const searchVolume = trend.searchVolume || Math.floor(Math.random() * 100000)
    const momentum = trend.momentum || (Math.random() * 100 - 50)
    const recency = trend.trend_date
      ? (Date.now() - new Date(trend.trend_date).getTime()) / (1000 * 60 * 60 * 24)
      : 1
    const sourceWeight = { google: 1.0, reddit: 0.9, hackernews: 0.85, twitter: 0.8, youtube: 0.75, news: 0.7 }[trend.source] || 0.5

    const score = Math.min(100, (searchVolume / 10000) * sourceWeight + Math.max(0, momentum) * 0.3 + Math.max(0, 10 - recency) * 2)

    return { ...trend, score: Math.round(score), searchVolume, momentum }
  }).sort((a, b) => b.score - a.score).slice(0, 50)
}

async function fetchGoogleTrends(region: string, category: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://trends.googleapis.com/v1/dailyTrends?hl=en-US&tz=${region}&cat=${category}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    const data = await response.json()
    return (data.trendingSearches || []).map((t: any) => ({
      title: t.title?.query || t.title,
      description: t.formattedTraffic || '',
      category: t.categories?.[0]?.name || 'General',
      region: region,
      searchVolume: parseInt(t.formattedTraffic?.replace(/[^\d]/g, '') || '0') * 1000,
      trendDate: t.date,
      image: t.image?.sourceUrl || null,
      articles: t.articles?.slice(0, 3) || []
    }))
  } catch (error) {
    logger.warn('Google Trends fetch failed, using mock data')
    return [
      { title: 'AI Agents', description: 'AI agent platforms', category: 'Technology', region, searchVolume: 45000, momentum: 85 },
      { title: 'Web Development', description: 'Web dev frameworks', category: 'Technology', region, searchVolume: 32000, momentum: 45 },
      { title: 'Digital Marketing', description: 'Online marketing', category: 'Business', region, searchVolume: 28000, momentum: 30 }
    ]
  }
}

async function fetchRedditTrends(): Promise<any[]> {
  try {
    const response = await fetch('https://www.reddit.com/r/popular/hot.json?limit=25', {
      headers: { 'User-Agent': 'Nexus/1.0' }
    })
    const data = await response.json()
    return (data.data?.children || []).map((post: any) => ({
      title: post.data?.title,
      description: post.data?.selftext?.substring(0, 200) || '',
      category: post.data?.subreddit || 'General',
      region: 'US',
      searchVolume: post.data?.ups || 0,
      url: post.data?.url,
      comments: post.data?.num_comments
    }))
  } catch (error) {
    logger.warn('Reddit fetch failed, using mock data')
    return [
      { title: 'Tech Career Advice', description: 'Career guidance', category: 'career', searchVolume: 15000, momentum: 20 },
      { title: 'Startup Ideas', description: 'Business ideas', category: 'startup', searchVolume: 12000, momentum: 35 }
    ]
  }
}

async function fetchHackerNewsTrends(): Promise<any[]> {
  try {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const ids = await response.json()
    const topIds = ids.slice(0, 15)

    const posts = await Promise.all(
      topIds.slice(0, 10).map(async (id: number) => {
        const postRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return postRes.json()
      })
    )

    return posts.map((post: any) => ({
      title: post?.title,
      description: post?.url || '',
      category: 'Technology',
      region: 'US',
      searchVolume: post?.score || 0,
      url: post?.url
    }))
  } catch (error) {
    logger.warn('Hacker News fetch failed, using mock data')
    return [
      { title: 'New AI Framework', description: 'Tech innovation', category: 'Technology', searchVolume: 8000, momentum: 50 },
      { title: 'Cloud Architecture', description: 'Cloud solutions', category: 'Technology', searchVolume: 6500, momentum: 25 }
    ]
  }
}

async function fetchTwitterTrends(): Promise<any[]> {
  return [
    { title: '#TechNews', description: 'Technology trends', category: 'Technology', region: 'US', searchVolume: 25000, momentum: 15 },
    { title: '#Innovation', description: 'Innovation topics', category: 'Business', region: 'US', searchVolume: 18000, momentum: 20 },
    { title: '#StartupLife', description: 'Startup culture', category: 'Startup', region: 'US', searchVolume: 12000, momentum: -5 }
  ]
}

async function fetchYouTubeTrends(region: string): Promise<any[]> {
  return [
    { title: 'Tech Reviews 2024', description: 'Technology reviews', category: 'Technology', region, searchVolume: 35000, momentum: 40 },
    { title: 'Business Tips', description: 'Business tutorials', category: 'Business', region, searchVolume: 22000, momentum: 30 },
    { title: 'How-To Guide', description: 'Educational content', category: 'Education', region, searchVolume: 18000, momentum: 25 }
  ]
}

async function fetchNewsTrends(): Promise<any[]> {
  const apiKey = process.env.NEWS_API_KEY || ''
  if (!apiKey) {
    return [
      { title: 'Market Updates', description: 'Business news', category: 'Business', region: 'US', searchVolume: 30000, momentum: 20 },
      { title: 'Tech Industry', description: 'Technology news', category: 'Technology', region: 'US', searchVolume: 28000, momentum: 35 }
    ]
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&pageSize=15`
    )
    const data = await response.json()
    return (data.articles || []).map((article: any) => ({
      title: article?.title,
      description: article?.description?.substring(0, 200) || '',
      category: article?.source?.name || 'News',
      region: 'US',
      searchVolume: Math.floor(Math.random() * 50000),
      url: article?.url,
      image: article?.urlToImage
    }))
  } catch (error) {
    logger.warn('News API fetch failed')
    return []
  }
}