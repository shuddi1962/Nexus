# Complete Feature & Functionality List

## 🔐 Authentication & User Management

### Authentication System
- User registration with email & password
- Email verification (verification link on register)
- Login with access token (15min) + refresh token (7 days)
- Token refresh rotation
- Logout with token revocation
- Password reset via time-limited email link (1 hour)
- Google OAuth login
- LinkedIn OAuth login
- Two-factor authentication (2FA) with secret
- Session management (active sessions, revocation)
- Account status management (active / suspended / unverified)

### User Roles & RBAC
- Admin role — full platform access
- Owner role
- Manager role
- Staff role
- Viewer role
- User role — own resources only
- Per-route permission enforcement via middleware
- Resource ownership enforcement (users only see own data)

### User Profile
- First name, last name, email, avatar
- Plan assignment (free / starter / pro / enterprise)
- Login count tracking
- Last login timestamp
- Total articles generated counter
- Total AI cost (USD) tracking
- Monthly article limit enforcement
- Monthly social post limit enforcement
- Update own profile
- Change own password

---

## 🏢 Business Profile Management

### Business Identity
- Business name, tagline, description
- Industry and sub-industries (multiple)
- Business type (product / service / hybrid)
- Country, state, city, full address
- Phone numbers (multiple)
- Email and website

### Business Branding
- Logo upload and storage
- Brand colors (hex, multiple)
- Brand voice selection (professional / casual / technical / friendly)
- Brand guidelines (free text)
- Brand kit generation (logo, colors, fonts, social assets)

### Target Audience & Strategy
- Target audience description
- Pain points list
- Unique value proposition
- Competitor keywords for monitoring

### Business Setup Wizard (Multi-step)
- Step 1: Business identity
- Step 2: Products & services + image upload
- Step 3: Brand & tone
- Step 4: Target audience
- Step 5: Social accounts connection
- Step 6: WordPress sites + Draft/Publish mode
- Step 7: Auto-post rules
- Step 8: Review & launch

### Business Intelligence Analyzer
- AI analysis of industry competitive landscape
- Best content topics for niche
- Optimal posting frequencies per platform
- Audience behavior patterns by location
- Seasonal trends relevant to the business
- Competitor social media analysis
- Niche analysis and competitor tracking
- Audience profiler

---

## 📦 Product & Service Catalog

### Product Management
- Product CRUD (create, read, update, delete)
- Product name, category, description
- Price and currency
- Product specifications (key-value pairs)
- Product keywords (for trend matching)
- Featured product flag
- New arrival flag
- In-stock flag

### Product Images
- Multiple image uploads per product
- Image alt text
- Primary image designation
- Format metadata (square / landscape / portrait)
- Width and height stored
- Product image priority for social post selection

### Services Management
- Service catalog per business

---

## 🔥 Trend Discovery & Intelligence

### Global Platform Trends
- Google Trends real-time integration
- News API live fetching
- Reddit hot topics and comments scraper
- X/Twitter trending hashtags
- Hacker News top stories
- YouTube trending by category
- Instagram trending hashtags
- LinkedIn trending topics
- Pinterest trending search terms
- Industry-specific trend aggregation
- Live keyword volume and momentum tracking
- Master trend aggregator with scoring
- Breaking trend detection
- Trend expiry management

### Business-Specific Trends
- Trend discovery per business profile
- Industry relevance scoring (0–100)
- Location relevance scoring
- Trend-to-product matching engine
- Trend-to-service matching
- Competitor keyword monitoring
- Related keyword suggestions
- Search volume estimation
- Momentum scoring
- Trend status tracking (new / used / expired)

---

## 🎨 Social Intelligence & Studio

### Business Post Engine
- Generate posts grounded in live trend data
- 12 post type templates:
  - Product Showcase
  - Educational
  - Promotional
  - Engagement (question / poll)
  - Testimonial / Trust
  - Behind the Scenes
  - News / Trend Reactive
  - How-To / Tips
  - Seasonal / Event
  - Comparison
  - FAQ
  - New Arrival Announcement
- Platform-specific caption generation
- CTA generation appropriate to business and platform
- Business context injection into AI prompts
- Post package output: caption + hashtags + image + time + CTA
- Batch post generation
- Post regeneration

### Live Image Selection (Priority Order)
- Business product catalog images (first priority)
- Manufacturer official website image search
- Unsplash API (licensed)
- Pexels API (licensed)
- Pixabay API (licensed)
- Google Image Search (reference only)
- AI image generation as last resort
- Image license verification
- Business logo / watermark overlay
- Platform-specific image resizing (1:1, 16:9, 2:3, 4:5, 9:16)

### Hashtag Researcher
- Live hashtag research per platform:
  - Instagram hashtag page scraping
  - Twitter/X trending hashtag analytics
  - LinkedIn pulse topics
  - Pinterest trends
  - TikTok discover page trends
  - Facebook/CrowdTangle + Google Trends
- Estimated monthly reach per hashtag
- Competition level (low / medium / high)
- Trending momentum indicator
- Relevance score to business
- Best days/times to use
- Banned/shadowbanned hashtag validation
- Hashtag Lab UI for manual research

### Content Calendar
- 30-day editorial calendar generation
- Mixed post types per day
- Platform-specific scheduling
- Optimal posting times per platform
- Holiday and local event awareness
- Balanced product/service coverage
- Visual week/month calendar grid
- Drag-and-drop calendar editing

### Social Studio UI
- Live trend feed per business
- One-click post generation from trend
- Post preview per platform
- Post type and platform selector
- Scheduling interface
- Queue manager
- Published posts history with engagement
- Image library (product + generated)
- Bulk scheduling

---

## 📤 Auto-Publisher

### Auto-Post Triggers
- New article fetched → auto social post + WordPress push
- Scheduled time from content calendar
- Trending topic detected → generate and schedule
- Manual trigger from Social Studio

### Social Platform Auto-Posting
- Facebook auto-posting
- Instagram auto-posting
- Twitter / X auto-posting
- LinkedIn auto-posting
- Pinterest auto-posting
- WhatsApp Business status auto-posting
- Telegram channel auto-posting
- Per-platform rate limit protection:
  - Twitter: max 17/day
  - LinkedIn: max 1/hour, 150/day
  - Facebook: max 5/day recommended
  - Instagram: max 25/day
  - Pinterest: max 25/day
- Deduplication (no duplicate posts within 24h)
- Auto-post enable/disable toggle
- Per-platform auto-post selection
- Per-day scheduling configuration
- Auto-post confirmation dialog

### WordPress Auto-Publishing
- Auto-push to WordPress on new article
- Per-site Draft / Publish mode setting
- Draft mode: article goes to WP drafts for review
- Publish mode: article goes live immediately
- Scheduled mode: future publish date via WordPress
- Per-article mode override before publish
- WordPress publish confirmation dialog
- Default mode: Draft (safety first)
- WordPress post ID and URL logging

### Auto-Post Management
- Auto-post queue view (upcoming)
- Auto-post history/logs
- Cancel scheduled post
- Reschedule post
- Retry failed auto-posts
- Auto-post status dashboard

---

## 📰 Content Pipeline

### RSS Feed Management
- RSS feed CRUD
- Feed polling (configurable interval)
- Feed health status monitoring
- Last polled and last successful poll timestamps
- Total items found counter
- Per-site feed assignment

### Content Extraction
- Full article extraction via @mozilla/readability + cheerio
- Original image extraction from source articles
- Author, publish date, categories extraction
- Content hash for deduplication
- Language detection
- Word count

### AI Rewrite Engine
- Multi-stage rewrite pipeline
- Title generation
- Summary / excerpt generation
- Outline builder
- Fact checker
- Plagiarism checker
- Content scorer
- SEO score
- Readability scorer
- Originality scorer
- Business context injection into rewrites
- Tone selection
- Target word count setting
- Multiple AI model support

### Image Processing
- Image analysis
- AI image prompt builder
- Image generation (multiple formats)
- Image resizing per output format:
  - Blog cover
  - Social square (1:1)
  - Pinterest (2:3)
  - Twitter card
  - Facebook (16:9)
  - OG image
  - Thumbnail
- Image optimizer
- Product image processor
- Web image search and fetch
- Sharp transforms on sourced images (crop ±5%, hue ±3°, saturation ×0.95, brightness ±2%)
- Original images from source articles modified (not identical pixel copies)
- WordPress media library upload with media ID storage

---

## 🔍 SEO Engine

- Full site audit (200+ checks)
- On-page SEO checker
- AI SEO Agent (auto-fix meta tags, schema, alt text, canonical URLs, heading hierarchy)
- Focus keyword and secondary keyword extraction
- Meta title and description generation
- Schema markup builder (JSON-LD)
- Internal linker
- Readability scorer
- LLM Brand Tracker (search ChatGPT, Perplexity, Gemini, Claude for brand mentions)
- White-label PDF SEO reports
- Position tracking (daily rankings, 130+ countries)
- Keyword research (DataForSEO)
- Backlink analysis (DataForSEO)
- Site audit scheduling (weekly)
- SEO plugin support: Yoast, RankMath, none

### Auto-Indexing
- Google Search Console API integration
- Bing IndexNow API integration
- Auto-submit on every publish event
- Bulk indexing tool
- Index status dashboard (indexed / pending / error / excluded)
- Scheduled re-index for updated content

### Site Manager
- WordPress plugin connection
- Shopify app connection
- Webflow API connection
- Custom FTP/SFTP connection
- AI crawl (200+ issue audit)
- Three automation modes: Autopilot / Review / Report Only
- Auto-fix: meta, schema, internal links, broken links, image optimization, page speed, canonical, hreflang, robots.txt, sitemap
- Content optimization: thin page rewrites, FAQ additions
- Action log with before/after diffs
- Site health score

---

## 📱 Social Media Management

### Platform Connections
- Facebook Page management
- Instagram management
- Twitter / X management
- LinkedIn management
- Pinterest management
- YouTube management
- WhatsApp Business API
- Telegram channel
- Threads (planned)

### Social Planner
- Schedule posts to all platforms
- Visual calendar view (week/month)
- Multi-platform post creation (one post → customize per platform)
- AI caption writer (model dropdown)
- First comment scheduling
- Media library integration
- Hashtag suggestions
- Best-time-to-post recommendations
- Analytics: reach, engagement, growth per platform

### Social Publishing
- Twitter thread generation
- LinkedIn post generation
- Facebook post generation
- Instagram caption generation
- Pinterest pin generation
- WhatsApp status posts
- Telegram channel posts
- Social post scheduling
- Bulk schedule multiple posts
- Publish now option
- Social engagement tracking (likes, shares, impressions)

### Social Analytics
- Per-platform analytics
- Impressions tracking
- Engagement tracking
- Reach tracking
- Social post performance history
- Post performance learning (AI learns from engagement data)
- Best posting times from own data
- Best hashtag performance from own data
- Top-performing post identification for re-posting

### Smart Re-posting
- Identify top-performing historical posts
- Re-schedule with fresh captions
- Rotation to avoid duplicate detection
- Configurable frequency (weekly / monthly)

---

## 💬 Communication Channels

### Email Marketing
- Campaign builder
- Template selection
- SendGrid integration
- Mailgun integration
- Custom SMTP integration
- Personalization
- Bulk sending
- Campaign tracking
- Drag-and-drop email builder
- Pre-built email template library
- Drip sequences / automated sequences
- Email open and click tracking

### SMS Marketing
- Twilio SMS integration
- Bulk messaging
- 160-character limit handling
- Personalization
- Delivery tracking

### WhatsApp Marketing
- Twilio WhatsApp Business API
- 360dialog integration
- Template-based messaging
- Personalization
- Delivery tracking
- Rate limiting
- WhatsApp broadcast to customer lists
- WhatsApp Business status posts

### Voice & Calling
- Twilio voice integration
- AI voice agents
- Bland.ai REST API integration
- Outbound calling
- Voicemail drops
- Call logging
- Call transcription
- CRM update from calls
- Personality configuration for voice agents
- FAQ training for voice agents

### Live Chat
- Real-time customer support chat
- Unified inbox (all channels)

---

## 🤖 Chatbots & Automation

### Chatbot Builder
- Visual drag-and-drop flow builder
- Deploy to: WhatsApp, Telegram, Instagram, Messenger, website, SMS
- Three modes: Off / Suggestive / Autopilot
- Training sources: web crawler (4,000 URLs), FAQ, file upload, URL scraping
- Embed export: JS snippet, iFrame, React component, WP plugin, Shopify app, REST API
- Widget customization (colors, position, avatar, welcome message)
- Analytics: conversations, conversions, drop-off, ratings

### Workflow Builder
- Visual workflow builder (drag-and-drop)
- 300+ pre-built workflow templates
- Triggers:
  - New contact
  - Form submission
  - Tag added
  - Deal stage change
  - Email opened
  - Appointment booked
  - Payment received
  - Ad conversion
  - Custom webhook
- Actions:
  - Send email
  - Send SMS
  - Send WhatsApp
  - Update contact
  - Create task
  - Move pipeline stage
  - Add tag
  - Wait / delay
  - Condition branch
  - Webhook
  - Run script
- Conditional branching
- Time delays
- Execution history and logs
- Trigger-based automation

### Pipeline & Queue System
- BullMQ + Redis queue
- Worker processes: trend, RSS, rewrite, image, publish, social, analytics
- Rate limiter
- Error recovery and retry logic
- Pipeline run logging (steps completed, failed, costs, duration)
- Pipeline statistics

### Scheduled Tasks (Cron)
- Process auto-post queue (every 1 min)
- Process content queue (every 2 min)
- Publish scheduled social posts (every 1 min)
- Publish scheduled articles (every 1 min)
- Poll RSS feeds (every 5 min)
- Discover business trends (every 15 min)
- Discover platform trends (every 15 min)
- Refresh hashtag data (every 30 min)
- Update cost tracker (every 5 min)
- Check budget limits (every 10 min)
- Generate business social posts (every 6 hours)
- Verify social connections (every 4 hours)
- Retry failed auto-posts (every 2 hours)
- Update pipeline stats (every hour)
- Generate editorial calendars (daily 7am)
- Generate analytics report (daily 8am)
- Sync rank tracker (daily 6am)
- Cleanup old raw content (daily 3am)
- Cleanup expired trends (daily 4am)
- Verify WordPress connections (daily 9am)
- Generate weekly report (Monday 9am)
- SEO site audit (Sunday 10am)
- Admin cost report (Monday 8am)

---

## 🛒 Commerce & E-commerce

### Online Store
- Product catalog management
- Order management
- Checkout
- Inventory tracking
- Product variants
- Product status management

### Product Research
- 10M+ product database (Shopify, Amazon, AliExpress, TikTok Shop, eBay, Walmart, Etsy, Temu)
- AI product score (0–100): demand, margin, saturation, trend
- URL Analyzer: extract products, revenue, tech stack, suppliers, ads, funnels
- Store spy and tracking
- Supplier comparison
- One-click import to store

### Ad Intelligence (Ad Spy)
- Search competitor ads: Facebook, TikTok, Instagram, Pinterest, Google, Snapchat
- Filters: keyword, domain, spend, engagement, date, platform, ad type
- Full creative + copy + CTA + landing page
- Save and monitor ads over time
- One-click AI recreation with user's product
- Landing page capture and funnel mapping

### Payments
- Stripe integration (global)
- Paystack integration (Africa)
- Flutterwave integration (Africa/global)
- NOWPayments integration (crypto)
- PayPal integration
- Square integration
- Multiple simultaneous payment gateways
- Transaction logging and reporting
- Invoice generation
- Payment at booking (calendar)
- User-connect-own gateway (Stripe Connect, etc.)

### Invoices & Estimates
- Invoice creation
- Estimate creation
- Billing management

### Affiliate Management
- Affiliate program CRUD
- Network support
- Tracking ID management
- Commission rate tracking
- Category and keyword targeting
- Click and revenue tracking
- Auto affiliate link injection into articles

### Courses & Memberships
- Course creation and management
- Membership management
- Paywall management
- Newsletter capture

---

## 📊 Ads Manager

### Ad Account Connection
- Meta (Facebook + Instagram) Ads — OAuth
- Google Ads — OAuth
- TikTok Ads — OAuth
- Twitter/X Ads — OAuth
- LinkedIn Ads — OAuth
- Snapchat Ads — OAuth
- Pinterest Ads — OAuth
- YouTube Ads — OAuth
- Amazon Ads — OAuth
- Import: all existing campaigns, ads, analytics (90 days), audiences, payment methods
- Sync frequency: every 15 minutes + real-time webhooks

### Campaign Management
- Campaign CRUD via platform APIs (bidirectional sync)
- Campaign objectives (dynamic per platform)
- Daily and lifetime budget management
- Campaign status toggle (active / paused / archived)
- Bid strategy selection
- Campaign duplication
- Clone campaign to another platform
- Campaign creation wizard (step-by-step)
- Filters: platform, status, objective, date, budget

### Ad Sets & Targeting
- Ad set CRUD
- Location targeting (countries, regions, cities, radius)
- Demographic targeting (age, gender)
- Interest targeting (searchable)
- Behavioral targeting
- Custom audience selection
- Lookalike audience selection
- Platform-specific options (Meta detailed targeting, Google keywords, TikTok creator categories)
- Placement selection (auto or manual)
- Ad set budget override
- Dayparting schedule

### Ad Creative Management
- Creative library (centralized, cross-platform)
- Ad types: single image, video, carousel, collection, dynamic
- Upload from device or media library
- AI ad copy generation (headline, primary text, description)
- Model selector for AI copy (OpenRouter)
- Tone options: professional, casual, urgent, benefit-focused, story-based
- A/B testing (multiple headline/copy/creative variants)
- Platform creative validation (resolution, aspect ratio, text %, video length)
- Real-time ad preview per platform and placement
- Preview placements: Facebook Feed, Instagram Feed, Instagram Stories, TikTok Feed, Twitter Timeline, etc.

### Audience Management
- Custom audiences (customer list CSV, website visitors pixel, app events, video viewers, page engagers)
- Lookalike audiences (1–10% similarity)
- Saved audiences (reusable targeting)
- Interest-based audiences
- CRM sync (import from CRM contacts by tags/lifecycle/fields)
- Export ad engagement data back to CRM

### Ad Analytics & Attribution
- Total spend (all platforms combined)
- Impressions, reach, frequency
- Clicks, CTR, CPC, CPM, CPR
- Conversions, conversion rate
- Revenue, ROAS, MER
- Video views, view rates, completion rates
- Breakdown by: campaign / ad set / ad / age / gender / device / placement / region / day / week / month
- Attribution models: last-click, first-click, linear, time-decay
- Cross-platform attribution (full customer journey)
- UTM parameter management
- Spend vs. ROAS dual-axis chart
- Conversion funnel per platform
- Geographic performance heatmap
- Creative performance comparison table (sorted by ROAS)

### Ad Payments from Platform
- Top-up ad account balance from dashboard
- Payment methods: Stripe, Paystack, Flutterwave, bank transfer
- Platform commission (admin-configurable, default 7%)
- Transaction history with downloadable PDF receipts
- Budget monitoring with alerts (email / SMS on low balance)

### Automated Rules
- Rule builder (visual)
- Trigger metrics: CPC, CTR, ROAS, Spend, Frequency, Conversions
- Conditions: greater than / less than / equals
- Time window configuration
- Actions: pause, resume, increase budget, decrease budget, notify, create alert
- Scope: specific campaign / ad set / ad, or all
- Active/inactive toggle

---

## 🎨 Creative Suite

### Design Studio (Fabric.js)
- All platform sizes pre-built
- Reference image upload → AI incorporates into design
- AI generation from text prompt
- Layers panel (reorder, lock, group, opacity)
- 1,000+ fonts, curved text, text effects
- Shapes and custom paths
- 100,000+ sticker library
- Brand Kit application across designs
- Smart resize (one design → all platform sizes)
- Animation → GIF/MP4 export
- Multi-page support (brochures, carousels, decks)
- Collaboration and comments
- Export: PNG, JPEG, WebP, SVG, PDF, GIF, MP4

### Image Studio
- Text-to-image generation
- Style presets
- Reference image upload → AI variations
- Photorealistic human model generation
- Image-to-image transformation
- Inpainting
- Outpainting
- Object removal
- Image blending
- Background removal
- Background replacement
- Video background removal and replacement (frame-by-frame)
- Watermark removal (images + video, batch)
- Upscaling to 8K
- Batch processing all operations
- Dynamic model dropdown (all Kie.ai models, auto-fetched)

### Video Editor (Custom Timeline)
- Multi-track timeline (video, audio, text, overlays)
- Trim, cut, split, merge
- 50+ transitions
- Text: titles, lower thirds, captions, animated text
- Audio: music, voiceover, SFX, volume control, fade
- Color: brightness, contrast, saturation, temperature, LUTs
- Speed control, slow motion, time-lapse
- Filters, blur, vignette, glow, grain
- Chroma key (green screen)
- AI background removal (no green screen)
- Background replacement
- Picture-in-picture (PiP)
- AI editing via natural language instructions
- Export: MP4/MOV/WebM/GIF, 720p/1080p/4K, 24/30/60fps
- Templates: TikTok, Reels, YouTube Shorts/Long, Stories, Ads
- Version history and auto-save
- ffmpeg backend (fluent-ffmpeg)

### Music Creator
- Text prompt → original tracks up to 8 minutes
- Genre presets + custom genre
- AI vocals with lyrics
- Instrumental only mode
- AI-generated lyrics
- Commercial licensing
- Export: MP3, WAV, FLAC, AAC
- Integration with Video Editor and UGC Ads
- Dynamic model dropdown (all Suno models via Kie.ai, auto-fetched)

### Presentations
- Topic or uploaded content → AI research → deck
- Live web search for latest statistics
- AI writes slides with proper hierarchy
- Real images from Unsplash/Pexels (not AI-generated where possible)
- Customizable themes
- Slide editor
- Export: PPTX, PDF, Google Slides compatible
- Present mode with animations

### Logo Creator
- AI logo from name + industry + style
- Style presets: modern, minimal, vintage, playful, corporate, geometric, hand-drawn, abstract, mascot, lettermark, wordmark, emblem
- Auto-suggest color palettes by industry
- 8–12 variations per generation
- Edit in Design Studio
- Export: SVG, PNG (transparent + white), PDF, ICO
- Auto-generate: favicon, social profile images, business card, email signature, watermark

### UGC Ads
- URL-to-Video (paste product URL → AI generates UGC-style video)
- 1,500+ AI avatars
- Custom avatar creation
- AI scriptwriter (AIDA, PAS, BAB frameworks)
- TTS: 140+ voices, 29+ languages
- Batch mode
- Formats: 9:16, 16:9, 1:1, 4:5 — up to 4K
- Push to connected ad accounts (Meta, TikTok, YouTube)
- Dynamic model dropdown (all Kie.ai video models, auto-fetched)

### Article-to-Video
- Select published article or paste URL
- AI extracts key points → creates video
- Uses original article images where available
- AI voiceover (voice + language selectable)
- Animated text overlays for quotes and stats
- Background music
- Output: 9:16, 16:9, 1:1
- Batch conversion
- Auto-publish to connected social accounts
- Dynamic model dropdown (all Kie.ai models, auto-fetched)

### Chat Hub (AI Chat Interface)
- All OpenRouter models in dynamic dropdown (auto-fetched, never hardcoded)
- Single model mode
- Side-by-side compare mode (2 models)
- Compare-all mode
- File upload: PDFs, images, spreadsheets, code
- Conversation history and search
- Custom system prompts
- Team sharing
- Code execution within chat

### Code Builder
- Natural language → complete working applications
- Supported outputs: React, Next.js, Python, Node.js, WordPress plugins, Shopify themes, Chrome extensions, APIs, scripts, dashboards, bots
- Monaco editor (syntax highlighting, auto-complete, error detection)
- Live preview / sandbox
- Version control with diff and rollback
- Deploy to InsForge Cloud or download
- Templates: landing page, REST API, browser extension, SaaS app scaffold

---

## 👥 CRM & Customer Management

### Contacts
- Contact CRUD
- Import/export
- Custom fields
- Tags
- AI lead scoring
- Activity timeline
- Email and phone verification
- Lifecycle stage management
- Source and source detail tracking
- Assigned to (team member)
- Company association

### Unified Inbox
- All channels in one inbox (email, SMS, WhatsApp, Instagram, Messenger, call)
- Message threading
- Conversation status management
- Assigned-to management
- Inbound/outbound message tracking
- Attachment support
- Read/delivered status

### Pipelines & Deals
- Pipeline CRUD (Kanban)
- Custom pipeline stages
- Deal/opportunity CRUD
- Deal value and currency
- Deal probability
- Expected close date
- Deal notes
- Drag-and-drop stage changes

### Tasks & Notes
- Task CRUD
- Due date and priority
- Task assignment
- Task completion tracking
- Note CRUD
- Note pinning
- Created-by tracking

### Appointments & Calendar
- Appointment booking
- Google Calendar sync
- Outlook Calendar sync
- Zoom meeting link generation
- Appointment reminders
- Online scheduling / booking page
- Payment at booking

### Lead Management (Kanban + Table)
- Drag-and-drop status changes
- Bulk qualification
- Search and filter
- Hot / Warm / Cold / Unqualified tiers
- Bulk actions

### Smart Lists & Segmentation
- Advanced filtering
- Saved segments
- Bulk actions on segments

### Forms & Surveys
- Form builder
- Lead capture forms
- Survey builder
- Form submission tracking

### Reputation Management
- Review requests (automated)
- Review widget (embeddable)
- Online reputation monitoring
- Reviews AI management

### Reviews
- Review request automation
- Review display widget

---

## 🔍 Prospecting & Lead Generation

### Lead Discovery Sources
- Google Maps (via Apify)
- LinkedIn (via Apify)
- Instagram (via Apify)
- TikTok (via Apify)
- Facebook Pages (via Apify)
- Website scraping (via Apify)
- Amazon/Shopify store scraping
- CSV/Excel import
- B2B lead discovery (VibeProspecting)
- Advanced B2B filters (industry, company size, title)

### Lead Enrichment
- Email finder (Hunter.io / pattern guessing)
- Email verification (ZeroBounce / NeverBounce / built-in SMTP)
- Phone validation
- Company enrichment (Clearbit)
- Social profile discovery

### Lead Qualification
- AI scoring (0–100)
- Auto-qualification on scraping
- Manual re-qualification
- Fallback scoring
- Qualification tags: Hot / Warm / Cold / Unqualified
- Duplicate detection

### Outreach Sequences
- Multi-step email drip with AI personalization per lead
- A/B testing
- SMS follow-up
- WhatsApp template messages
- LinkedIn connection + follow-up (Playwright automation)
- Voicemail drops (Twilio)
- Multi-channel sequences with conditional logic
- Sequence enrollment management
- Outreach event logging

### Compliance
- CAN-SPAM / GDPR compliance
- Rate limiting
- DNC (Do Not Contact) list management
- Proxy rotation (via Apify)
- Unsubscribe handling

---

## 📈 Analytics & Reporting

### User Analytics
- Traffic analyzer
- Rank tracker
- Performance reports
- Social analytics
- A/B tester
- Attribution dashboard (cross-channel: organic, email, SMS, ads, social)
- Attribution models: last-click, first-click, linear, time-decay
- Pipeline reports (conversion rates, deal velocity, revenue forecast)
- Content performance (articles, social posts, videos)
- Ad performance summary
- Email/SMS performance
- Chatbot analytics
- Agency rollup view (all clients in one dashboard)
- Export: CSV, PDF (branded)
- Scheduled email reports (daily / weekly / monthly)

### AI Cost Tracking
- Per-call cost logging
- Cost by provider and model
- Daily and monthly totals
- Budget enforcement (hard stop at limit — 429 response)
- Budget warning at configurable threshold
- Cost gauge in sidebar UI
- Net ROI calculation

### Admin Analytics
- Platform-wide user metrics
- Platform-wide article metrics
- Platform-wide AI cost breakdown (by user, model, date)
- Platform-wide revenue metrics
- Pipeline run statistics
- System health monitoring
- Error logs

---

## 🌐 Website & Funnel Builder

### Website & Funnel Builder
- Drag-and-drop website builder
- Funnel builder
- Pre-built website templates
- Pre-built funnel templates
- Website hosting with free subdomain
- Custom domain with auto SSL
- Cloudflare CDN
- Analytics: page views, visitors, bounce rate, traffic sources
- Uptime monitoring with alerts

### Business Name Generator & Domain Finder
- AI generates 50+ name suggestions from business description
- Availability check on 60+ TLDs
- Social handle availability (Instagram, Twitter, TikTok, Facebook, LinkedIn, YouTube, Pinterest, Threads, Reddit)
- Trademark conflict check (USPTO/EUIPO)
- One-click domain purchase (Namecheap / GoDaddy / Cloudflare)
- Auto-generate brand kit on domain purchase

### Domains Management
- Domain registrar integration (Namecheap, GoDaddy, Cloudflare)
- DNS records management
- SSL status tracking
- Domain hosting management
- Bandwidth tracking
- SSL provisioning

### Content Publishing Platforms
- WordPress publisher
- Ghost publisher
- Medium publisher
- Substack publisher

---

## 🔧 Admin Dashboard

### Admin Overview
- Platform-wide statistics dashboard
- Real-time activity feed
- Total users, active today
- Total articles generated
- Platform AI cost today
- Platform revenue

### User Management
- All users table (name, email, plan, articles, AI cost, status, joined)
- User detail page (businesses, sites, articles, social posts, AI cost, activity log)
- Create / edit / suspend / activate / delete user
- Change user plan
- Send message to user
- Impersonate user

### Organization Management
- All organizations/businesses on platform
- Multi-tenant workspace management
- White-label configuration per org
- Org member management

### API Keys Vault (Admin Only, AES-256 Encrypted)
- Language Models: OpenRouter API key
- Multi-Modal: Kie.ai API key
- SEO & Data: DataForSEO API key + email, Google Search Console JSON, Bing Webmaster API key
- Email: Mailgun API key + domain, SendGrid API key, Custom SMTP
- SMS & Voice: Twilio Account SID, Auth Token, phone numbers
- Messaging: WhatsApp Business API, 360dialog, Telegram Bot, Facebook Page token, Instagram token
- Social Platforms: Facebook, TikTok, LinkedIn, Twitter/X, Pinterest, Snapchat, YouTube credentials
- Ads Platforms: Meta Ads, Google Ads, TikTok Ads, Twitter/X Ads, LinkedIn Ads, Snapchat Ads, Pinterest Ads, Amazon Ads credentials
- Platform Payments: Stripe, Paystack, Flutterwave, NOWPayments keys + webhook secrets
- Storage & CDN: Cloudflare R2, Cloudflare API token
- Scraping & Enrichment: Apify, ZeroBounce, NeverBounce, Hunter.io, Clearbit
- Calendar & Communication: Google Calendar, Outlook OAuth, Zoom
- Domain Management: Namecheap, GoDaddy, Cloudflare Registrar
- Analytics & Stock Images: Google Analytics, Facebook Pixel, GTM, Unsplash, Pexels
- Misc: Google Maps API, Yext API, Custom (any key)
- Per-key: status badge (active / invalid / untested / expired), last tested timestamp, usage this month, "Test Connection" button, encrypted-at-rest badge
- Keys never returned in plaintext via any API endpoint

### Module & Plan Management
- Module toggle per plan
- Plan CRUD (name, article limit, social post limit, image limit, max businesses, max WP sites, max RSS feeds, feature flags, pricing)
- Plan assignment to users
- Plan enforcement at API level

### Revenue Management
- Billing overview
- Transaction history
- Subscription management
- Promo codes
- Revenue analytics

### Platform Settings
- White-label settings (custom domain, logo, colors)
- Email template management
- System settings (security, timezone, maintenance mode)
- Maintenance mode toggle
- Cache management (clear platform cache)

### Monitoring & Logs
- System health dashboard (DB, Redis, LLM APIs, Image API)
- Error logs
- API usage monitoring
- Audit log (user, action, resource, IP, timestamp)
- Pipeline runs overview (all users)
- Broadcast to all users

---

## 🔄 Dynamic Model Loading (Critical Infrastructure)

- OpenRouter model sync (background job, every 6 hours)
- Kie.ai model sync (background job, every 6 hours)
- Models cached in Redis (6-hour TTL)
- Frontend model dropdowns always populated from live cache
- Never hardcoded model names anywhere
- New models appear automatically when added by provider
- ModelSelector reusable component (type: llm / image / video / music)
- Model display: name + context window + pricing per token

---

## 🔒 Security & Infrastructure

### Security
- AES-256-GCM encryption for all stored API keys (salt + IV per key)
- Row Level Security (RLS) on all database tables
- JWT access tokens (15 min) + refresh tokens (7 days)
- Refresh token rotation on every use
- Revoked token list
- bcrypt password hashing (12 rounds)
- RBAC middleware on all routes
- Resource ownership enforcement
- Rate limiting on all routes
- CSRF protection
- SQL injection prevention
- OWASP Top 10 compliance
- Environment variable validation at startup (Zod schema)
- API key vault (admin-only, never exposed to users)
- Two-factor authentication (2FA)

### Infrastructure
- Node.js 22 LTS runtime
- TypeScript strict mode
- Fastify 5 framework
- BullMQ + Redis 7 queue
- node-cron scheduler
- Socket.io 4 WebSockets
- Pino logger (pino-pretty in dev)
- Zod validation
- Cloudflare R2 CDN storage
- InsForge S3 primary storage

### Real-Time (WebSocket Events)
- Pipeline started / step / completed / failed
- Article created / published / WordPress draft / WordPress published / failed
- Auto-post triggered / success / failed / queued
- Business trend discovered
- Business posts generated
- Social post published
- Trend discovered / breaking trend
- Cost update
- Budget warning / exceeded
- Queue update (pending / processing / completed)
- Admin: user registered, platform stats, cost spike

---

## 🌍 Multi-Language & Localization

- Multi-language post generation: English, French, Spanish, Portuguese, Arabic, Yoruba, Igbo, Hausa
- Auto-detect target language from business location
- Auto-translate generated content
- Language detection on imported content

---

## 🏷️ White-Label & Multi-Tenant

- White-label SaaS mode (custom domain, logo, colors)
- Multi-tenant architecture (per-org data isolation)
- Sub-account management (Agency plan: 20 workspaces)
- Client reporting dashboards
- Staff roles per organization (up to 20 team members)
- Embedded widgets export
- White-label PDF reports
- Custom branded mobile app (Whitelabel / Greylabel)

---

## 🌐 Marketing Homepage (Public-Facing)

### Pages
- Main landing page (/)
- Pricing page (/pricing)
- Features overview (/features)
- Individual feature deep-dive pages (/features/[slug])
- Use case pages: Agency, E-commerce, Creator, SaaS (/use-cases/[slug])
- Blog (/blog)
- Changelog (/changelog)
- About (/about)
- Contact / demo booking (/contact)
- Login (/login)
- Register (/register)
- Privacy Policy (/legal/privacy)
- Terms of Service (/legal/terms)

### Homepage Sections
- Sticky navigation bar with glass blur on scroll
- Products mega-menu (4 columns with icons and descriptions)
- Solutions dropdown (5 use cases)
- Resources dropdown (blog, docs, API, changelog, status)
- Hero section (Three.js particle field, 3D dashboard preview, animated floating stat cards)
- Social proof bar (testimonial + review ratings)
- Feature highlights bento grid (6 cells with animated UI previews)
- Ads Management featured section (dark navy, animated chart)
- Animated stats counter section (4 counters, count-up on viewport)
- Module showcase (tabbed: CRM / Marketing / Creative / Ads / Automation / Commerce)
- How It Works (3 steps with animated SVG flow)
- Testimonials grid (6 cards, masonry layout, Unsplash avatars)
- Pricing preview (3 plan cards inline)
- Integration logos marquee (infinite scroll, 2 rows)
- CTA section (dark navy)
- Footer (4-column: Products, Company, Legal & Support, social links)

### Pricing Page
- Annual / monthly toggle (20% annual discount)
- Starter: $49/mo ($39 annual)
- Pro: $149/mo ($119 annual)
- Agency: $349/mo ($279 annual)
- Enterprise: Custom pricing
- Full feature comparison table (matrix with ✓/✗ or quantity)

---

## 📂 Document & Content Management

- Document management (file organization, sharing, storage)
- Blogging system (post creation, publishing, management)
- Content AI tools
- Courses and memberships (LMS)
- Communities (forums, posts, replies, member management)
- Saved content viewer

---

## ⚙️ Settings & Configuration

### User Settings
- Profile (name, email, avatar, timezone)
- API keys (masked, per-user)
- WordPress sites list with publish mode toggle
- Connected social accounts with auth status
- Auto-post rules (global)
- Notification preferences (email / in-app)
- Plan & billing (current plan, usage meters, upgrade)
- Danger zone (delete account, export data)

### Competitor Monitoring
- Monitor competitor social accounts and websites
- Alert when competitor posts about same topics
- Track competitor hashtag usage
- Suggest counter-content opportunities

---

*Total documented features across all three platform specifications (ClipGenius, NEXUS, AutoBlog AI)*
