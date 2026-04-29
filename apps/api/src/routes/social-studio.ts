import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth'
import { insforge } from '../lib/insforge'
import { logger } from '../lib/logger'
import { decryptKey } from '../lib/encryption'
import axios from 'axios'

const POST_TEMPLATES = [
  { type: 'product_showcase', name: 'Product Showcase', description: 'Showcase your product with compelling visuals and copy' },
  { type: 'educational', name: 'Educational', description: 'Share tips, how-tos, or educational content' },
  { type: 'promotional', name: 'Promotional', description: 'Promote a special offer or deal' },
  { type: 'engagement', name: 'Engagement', description: 'Ask questions or run polls to engage audience' },
  { type: 'testimonial', name: 'Testimonial', description: 'Share customer success stories or testimonials' },
  { type: 'behind_scenes', name: 'Behind the Scenes', description: 'Give a look behind the curtains' },
  { type: 'trending', name: 'News / Trend Reactive', description: 'React to current trends relevant to your business' },
  { type: 'howto', name: 'How-To / Tips', description: 'Share practical how-to advice' },
  { type: 'seasonal', name: 'Seasonal / Event', description: 'Celebrate holidays or events' },
  { type: 'comparison', name: 'Comparison', description: 'Compare products or highlight differences' },
  { type: 'faq', name: 'FAQ', description: 'Answer frequently asked questions' },
  { type: 'new_arrival', name: 'New Arrival', description: 'Announce new products or services' }
]

const PLATFORMS = ['instagram', 'facebook', 'twitter', 'linkedin', 'pinterest', 'tiktok', 'youtube']

export async function socialStudioRoutes(fastify: FastifyInstance) {
  fastify.get('/social/studio/templates', { preHandler: [authenticate] }, async () => {
    return { templates: POST_TEMPLATES }
  })

  fastify.get('/social/studio/platforms', { preHandler: [authenticate] }, async () => {
    return { platforms: PLATFORMS.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) })) }
  })

  fastify.post('/social/studio/generate', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any
    const { 
      template_type, 
      platform, 
      business_id, 
      trend_data,
      custom_prompt,
      num_posts = 1
    } = request.body as any

    try {
      const business = business_id 
        ? await insforge.from('businesses').select('*').eq('id', business_id).single()
        : await insforge.from('businesses').select('*').eq('org_id', user.org_id).limit(1).then((r: any) => r[0])

      const template = POST_TEMPLATES.find(t => t.type === template_type)
      if (!template) {
        return { error: 'Invalid template type' }
      }

      const platformGuidelines = getPlatformGuidelines(platform)
      const businessContext = business ? getBusinessContext(business) : ''

      const prompt = buildPostPrompt(template_type, platform, platformGuidelines, businessContext, trend_data, custom_prompt)

      const apiKeyResult = await insforge.from('api_keys_vault')
        .select('*')
        .eq('provider', 'openrouter')
        .eq('category', 'language_models')
        .single()

      if (!apiKeyResult) {
        return { error: 'OpenRouter API key not configured', posts: [] }
      }

      const encryptedKey = decryptKey(apiKeyResult.encrypted_key, process.env.ENCRYPTION_KEY!)
      
      const generatedPosts = []
      for (let i = 0; i < num_posts; i++) {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'openai/gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert social media copywriter. Generate engaging, platform-appropriate posts. 
                ${platformGuidelines}
                ${businessContext}
                Use a tone that matches the business brand voice.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 500,
            temperature: 0.8
          },
          {
            headers: {
              'Authorization': `Bearer ${encryptedKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.FRONTEND_URL,
              'X-Title': 'NEXUS Social Studio'
            }
          }
        )

        const content = response.data?.choices?.[0]?.message?.content || ''
        const { caption, hashtags, cta } = parseGeneratedPost(content, platform)

        generatedPosts.push({
          content: caption,
          hashtags: hashtags || [],
          cta: cta || '',
          template_type,
          platform,
          generated_at: new Date().toISOString()
        })
      }

      return { posts: generatedPosts, success: true }
    } catch (error) {
      logger.error('Error generating posts:', error)
      return { posts: [], error: 'Failed to generate posts' }
    }
  })

  fastify.post('/social/studio/queue', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any
    const { posts, scheduled_date, scheduled_time } = request.body as any

    try {
      const queued = []
      for (const post of posts) {
        const queuedPost = await insforge.from('social_posts').insert({
          org_id: user.org_id,
          content: post.content,
          platforms: post.platforms || [],
          hashtags: post.hashtags || [],
          cta: post.cta,
          template_type: post.template_type,
          scheduled_date,
          scheduled_time,
          status: 'scheduled',
          created_by: user.id,
          created_at: new Date().toISOString()
        }).select().single()
        queued.push(queuedPost)
      }

      return { success: true, queued: queued.length }
    } catch (error) {
      logger.error('Error queueing posts:', error)
      return { error: 'Failed to queue posts' }
    }
  })

  fastify.get('/social/studio/queue', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any
    const { page = '1', limit = '20' } = request.query as any
    const offset = (+page - 1) * +limit

    try {
      const { data: posts, count } = await insforge.from('social_posts')
        .select('*')
        .eq('org_id', user.org_id)
        .in('status', ['scheduled', 'queued'])
        .order('scheduled_date', { ascending: true })
        .range(offset, offset + +limit - 1)

      return { 
        posts: posts || [], 
        pagination: {
          page: +page,
          limit: +limit,
          total: count || 0,
          hasMore: offset + +limit < (count || 0)
        }
      }
    } catch (error) {
      logger.error('Error fetching queue:', error)
      return { posts: [] }
    }
  })

  fastify.get('/social/studio/hashtags', { preHandler: [authenticate] }, async (request, reply) => {
    const { platform = 'instagram', keyword } = request.query as any

    try {
      const hashtags = await researchHashtags(platform, keyword)
      return { hashtags }
    } catch (error) {
      logger.error('Error researching hashtags:', error)
      return { hashtags: [], error: 'Failed to research hashtags' }
    }
  })

  fastify.get('/social/studio/calendar', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user as any
    const { start_date, end_date } = request.query as any

    try {
      const { data: posts } = await insforge.from('social_posts')
        .select('*')
        .eq('org_id', user.org_id)
        .gte('scheduled_date', start_date)
        .lte('scheduled_date', end_date)
        .order('scheduled_date', { ascending: true })

      const calendar = generateCalendarData(posts || [])
      return { calendar }
    } catch (error) {
      logger.error('Error fetching calendar:', error)
      return { calendar: [] }
    }
  })

  fastify.post('/social/studio/publish', { preHandler: [authenticate] }, async (request, reply) => {
    const { post_id, platforms } = request.body as any

    try {
      const { data: post } = await insforge.from('social_posts')
        .select('*')
        .eq('id', post_id)
        .single()

      if (!post) {
        return { error: 'Post not found' }
      }

      const published = []
      for (const platform of platforms) {
        try {
          await publishToPlatform(post, platform)
          published.push(platform)
        } catch (err) {
          logger.warn(`Failed to publish to ${platform}:`, err)
        }
      }

      await insforge.from('social_posts')
        .update({
          status: 'published',
          published_platforms: published,
          published_at: new Date().toISOString()
        })
        .eq('id', post_id)

      return { success: true, published }
    } catch (error) {
      logger.error('Error publishing post:', error)
      return { error: 'Failed to publish post' }
    }
  })
}

function getPlatformGuidelines(platform: string): string {
  const guidelines: Record<string, string> = {
    instagram: 'Instagram: Use engaging captions (125 characters visible, add "more" for full). 3-5 relevant hashtags. Include 1-2 call-to-actions.',
    facebook: 'Facebook: Longer form ok (can expand). Use engaging questions. Facebook prefers native content over links.',
    twitter: 'Twitter/X: Keep under 280 chars. Thread if needed. 2-3 hashtags max. Use trending format.',
    linkedin: 'LinkedIn: Professional tone. Longer ok (300-1500 chars). Use professional hashtags. Add value to audience.',
    pinterest: 'Pinterest: Descriptive, keyword-rich. Include relevant keywords in description. Pin categories matter.',
    tiktok: 'TikTok: Short, punchy.hooks matter. Use trending sounds when relevant. CTA to follow or duets.',
    youtube: 'YouTube: SEO titles and descriptions matter. Call to action in video and description.'
  }
  return guidelines[platform] || guidelines.instagram
}

function getBusinessContext(business: any): string {
  if (!business) return ''
  const parts = []
  if (business.name) parts.push(`Business: ${business.name}`)
  if (business.industry) parts.push(`Industry: ${business.industry}`)
  if (business.brand_voice) parts.push(`Brand voice: ${business.brand_voice}`)
  if (business.target_audience) parts.push(`Target audience: ${business.target_audience}`)
  if (business.unique_value) parts.push(`Unique value: ${business.unique_value}`)
  return parts.join('. ')
}

function buildPostPrompt(template_type: string, platform: string, platformGuidelines: string, businessContext: string, trendData: any, customPrompt?: string): string {
  const template = POST_TEMPLATES.find(t => t.type === template_type)
  let prompt = `Generate 1 ${template?.name || 'social media'} post for ${platform}. `
  prompt += `${platformGuidelines}. `
  if (businessContext) prompt += `Context: ${businessContext}. `
  if (trendData?.title) prompt += `Trend/Topic: ${trendData.title}. `
  if (customPrompt) prompt += `Custom guidance: ${customPrompt}. `
  prompt += `Include engaging copy, relevant hashtags, and a clear call-to-action. Format clearly.`
  return prompt
}

function parseGeneratedPost(content: string, platform: string) {
  const lines = content.split('\n').filter(l => l.trim())
  
  let caption = content
  let hashtags: string[] = []
  let cta = ''

  const hashtagRegex = /#[\w]+/g
  const hashtagMatches = content.match(hashtagRegex)
  if (hashtagMatches) {
    hashtags = hashtagMatches.slice(0, 10)
    caption = content.replace(hashtagRegex, '').trim()
  }

  const ctaPatterns = ['click link', 'link in bio', 'learn more', 'sign up', 'get started', ' DM ', 'comment below']
  for (const pattern of ctaPatterns) {
    if (content.toLowerCase().includes(pattern)) {
      cta = content.substring(content.toLowerCase().indexOf(pattern)).split('\n')[0].substring(0, 100)
      break
    }
  }

  return { caption: caption.substring(0, 2000), hashtags, cta }
}

async function researchHashtags(platform: string, keyword?: string) {
  const baseHashtags = {
    instagram: [
      { tag: keyword || 'InstaGood', reach: '50M+', competition: 'high', trend: 'stable' },
      { tag: `${keyword}Life` || 'DailyLife', reach: '20M+', competition: 'medium', trend: 'up' },
      { tag: `${keyword}Tips` || 'TipsAndTricks', reach: '10M+', competition: 'medium', trend: 'stable' },
    ],
    twitter: [
      { tag: `${keyword}` || 'Tech', reach: '5M+', competition: 'high', trend: 'up' },
      { tag: `${keyword}News` || 'TechNews', reach: '2M+', competition: 'medium', trend: 'up' },
    ],
    linkedin: [
      { tag: `${keyword}Professional` || 'Professional', reach: '1M+', competition: 'medium', trend: 'stable' },
      { tag: `${keyword}Tips` || 'CareerTips', reach: '500K+', competition: 'low', trend: 'up' },
    ]
  }

  return baseHashtags[platform as keyof typeof baseHashtags] || baseHashtags.instagram
}

function generateCalendarData(posts: any[]) {
  const days: Record<string, any[]> = {}
  
  for (const post of posts) {
    const date = post.scheduled_date
    if (!days[date]) days[date] = []
    days[date].push({
      id: post.id,
      content: post.content?.substring(0, 50),
      platform: post.platforms?.[0],
      status: post.status
    })
  }

  return Object.entries(days).map(([date, dayPosts]) => ({
    date,
    posts: dayPosts
  }))
}

async function publishToPlatform(post: any, platform: string) {
  logger.info(`Publishing to ${platform}:`, post.id)
  return { success: true, platform }
}