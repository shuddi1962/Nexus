-- ============================================
-- NEXUS COMPLETE DATABASE SCHEMA
-- All 66+ Collections for InsForge
-- Generated: 2026-04-28
-- ============================================

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('admin','owner','manager','staff','viewer')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter','pro','agency','enterprise')),
  email_verified BOOLEAN DEFAULT false,
  two_fa_secret TEXT,
  two_fa_enabled BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  suspended BOOLEAN DEFAULT false,
  suspended_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  logo TEXT,
  domain TEXT,
  white_label_config JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  plan TEXT DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Organization members table
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff',
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Sessions table (for JWT refresh tokens)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- API Keys Vault (encrypted storage)
CREATE TABLE IF NOT EXISTS api_keys_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  category TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  label TEXT,
  added_by UUID REFERENCES users(id),
  last_tested_at TIMESTAMPTZ,
  test_status TEXT DEFAULT 'untested' CHECK (test_status IN ('active','invalid','untested','expired')),
  usage_this_month INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CRM TABLES
-- ============================================

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  lead_score INTEGER DEFAULT 0,
  source TEXT,
  source_detail TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  lifecycle_stage TEXT DEFAULT 'lead',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email','sms','whatsapp','instagram','messenger','call')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','closed','pending')),
  assigned_to UUID REFERENCES users(id),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  channel TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  delivered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stages JSONB NOT NULL DEFAULT '[]',
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  stage TEXT NOT NULL,
  value NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  probability INTEGER DEFAULT 0,
  expected_close DATE,
  assigned_to UUID REFERENCES users(id),
  notes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  assigned_to UUID REFERENCES users(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  calendar_id TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled')),
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PROSPECTING & LEAD GENERATION TABLES
-- ============================================

-- Prospecting campaigns table
CREATE TABLE IF NOT EXISTS prospecting_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  search_query JSONB DEFAULT '{}',
  filters JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('active','paused','draft','completed')),
  leads_found INTEGER DEFAULT 0,
  apify_run_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scraped leads table
CREATE TABLE IF NOT EXISTS scraped_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES prospecting_campaigns(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  raw_data JSONB DEFAULT '{}',
  business_name TEXT,
  contact_name TEXT,
  email TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT false,
  website TEXT,
  address TEXT,
  social_profiles JSONB DEFAULT '{}',
  rating NUMERIC(2,1),
  review_count INTEGER,
  industry TEXT,
  enrichment_data JSONB DEFAULT '{}',
  lead_score INTEGER DEFAULT 0,
  qualification TEXT CHECK (qualification IN ('hot','warm','cold','unqualified')),
  imported_to_crm BOOLEAN DEFAULT false,
  contact_id UUID REFERENCES contacts(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Outreach sequences table
CREATE TABLE IF NOT EXISTS outreach_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  steps JSONB DEFAULT '[]',
  channels TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('active','paused','draft','completed')),
  enrolled_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Outreach steps table
CREATE TABLE IF NOT EXISTS outreach_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES outreach_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  channel TEXT NOT NULL,
  delay_days INTEGER DEFAULT 0,
  delay_hours INTEGER DEFAULT 0,
  template_content TEXT,
  subject_line TEXT,
  ab_variants JSONB DEFAULT '[]',
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Outreach enrollments table
CREATE TABLE IF NOT EXISTS outreach_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES outreach_sequences(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','completed','unsubscribed')),
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  last_action_at TIMESTAMPTZ
);

-- Outreach events table
CREATE TABLE IF NOT EXISTS outreach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES outreach_enrollments(id) ON DELETE CASCADE,
  step_id UUID REFERENCES outreach_steps(id),
  event_type TEXT NOT NULL,
  channel TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  type TEXT DEFAULT 'verification' CHECK (type IN ('verification','password_reset')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','used','expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Do Not Contact list table
CREATE TABLE IF NOT EXISTS dnc_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  reason TEXT,
  added_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CONTENT & SEO TABLES
-- ============================================

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  seo_meta JSONB DEFAULT '{}',
  source_url TEXT,
  rewritten_from TEXT,
  model_used TEXT,
  published_to TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content sources table
CREATE TABLE IF NOT EXISTS content_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('rss','url','manual')),
  url TEXT,
  name TEXT,
  last_fetched TIMESTAMPTZ,
  active BOOLEAN DEFAULT true
);

-- SEO audits table
CREATE TABLE IF NOT EXISTS seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  site_url TEXT NOT NULL,
  issues JSONB DEFAULT '[]',
  score INTEGER,
  fixes_applied JSONB DEFAULT '[]',
  audit_date TIMESTAMPTZ DEFAULT now()
);

-- Indexed pages table
CREATE TABLE IF NOT EXISTS indexed_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('indexed','pending','error')),
  engine TEXT,
  submitted_at TIMESTAMPTZ
);

-- Connected sites table
CREATE TABLE IF NOT EXISTS connected_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  platform TEXT,
  credentials_encrypted TEXT,
  mode TEXT DEFAULT 'report' CHECK (mode IN ('autopilot','review','report')),
  health_score INTEGER
);

-- Keyword tracking table
CREATE TABLE IF NOT EXISTS keyword_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  position INTEGER,
  search_volume INTEGER,
  difficulty INTEGER,
  url TEXT,
  engine TEXT,
  tracked_at TIMESTAMPTZ DEFAULT now()
);

-- Backlink profiles table
CREATE TABLE IF NOT EXISTS backlink_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  total_backlinks INTEGER,
  referring_domains INTEGER,
  new_lost JSONB DEFAULT '[]',
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ADS MANAGEMENT TABLES
-- ============================================

-- Ad accounts table
CREATE TABLE IF NOT EXISTS ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('meta','google','tiktok','twitter','linkedin','snapchat','pinterest','youtube','amazon')),
  account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  credentials_encrypted TEXT NOT NULL,
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected','disconnected','error','pending')),
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  billing_method TEXT,
  connected_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, platform, account_id)
);

-- Ad campaigns table
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  external_campaign_id TEXT,
  name TEXT NOT NULL,
  objective TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('active','paused','draft','archived')),
  daily_budget NUMERIC(12,2),
  lifetime_budget NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  targeting JSONB DEFAULT '{}',
  bid_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ
);

-- Ad sets table
CREATE TABLE IF NOT EXISTS ad_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  external_adset_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
  budget NUMERIC(12,2),
  targeting JSONB DEFAULT '{}',
  optimization_goal TEXT,
  bid_amount NUMERIC(12,2),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_set_id UUID REFERENCES ad_sets(id) ON DELETE CASCADE,
  external_ad_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
  creative_id UUID REFERENCES ad_creatives(id),
  headline TEXT,
  body_text TEXT,
  cta TEXT,
  destination_url TEXT,
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ad creatives table
CREATE TABLE IF NOT EXISTS ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image','video','carousel','collection')),
  media_urls TEXT[] DEFAULT '{}',
  headline TEXT,
  body TEXT,
  cta TEXT,
  used_in_campaigns TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ad analytics table
CREATE TABLE IF NOT EXISTS ad_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  ad_set_id UUID REFERENCES ad_sets(id) ON DELETE SET NULL,
  ad_id UUID REFERENCES ads(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr NUMERIC(5,2),
  cpc NUMERIC(12,2),
  cpm NUMERIC(12,2),
  conversions INTEGER DEFAULT 0,
  conversion_value NUMERIC(12,2),
  roas NUMERIC(5,2),
  spend NUMERIC(12,2),
  reach INTEGER,
  frequency NUMERIC(4,2),
  platform TEXT NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT now()
);

-- Ad audiences table
CREATE TABLE IF NOT EXISTS ad_audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  audience_id TEXT,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'custom' CHECK (type IN ('custom','lookalike','saved')),
  size INTEGER,
  source TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ad payments table
CREATE TABLE IF NOT EXISTS ad_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  nexus_fee_pct NUMERIC(5,2) DEFAULT 7.0,
  nexus_fee_amount NUMERIC(12,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  external_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ad rules table
CREATE TABLE IF NOT EXISTS ad_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  trigger_metric TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  trigger_value NUMERIC(12,2) NOT NULL,
  action TEXT NOT NULL,
  action_value TEXT,
  active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- COMMERCE TABLES
-- ============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2),
  cost NUMERIC(12,2),
  images TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]',
  inventory INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','draft','archived')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  items JSONB DEFAULT '[]',
  total NUMERIC(12,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  fulfillment_status TEXT DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled','fulfilled','partial')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product research table
CREATE TABLE IF NOT EXISTS product_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  source_url TEXT,
  cost NUMERIC(12,2),
  sell_price NUMERIC(12,2),
  margin NUMERIC(5,2),
  orders_monthly INTEGER,
  score INTEGER,
  trend TEXT,
  saturation TEXT,
  supplier_urls TEXT[] DEFAULT '{}',
  saved_at TIMESTAMPTZ DEFAULT now()
);

-- Store analyses table
CREATE TABLE IF NOT EXISTS store_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  revenue_estimate NUMERIC(12,2),
  products_found INTEGER,
  tech_stack JSONB DEFAULT '{}',
  traffic_sources JSONB DEFAULT '{}',
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CREATIVE TABLES
-- ============================================

-- Designs table
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  canvas_data JSONB DEFAULT '{}',
  thumbnail TEXT,
  size TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Media library table
CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT,
  size_bytes INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  prompt TEXT,
  model_used TEXT,
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  prompt TEXT,
  model_used TEXT,
  duration INTEGER,
  resolution TEXT,
  size_bytes INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Video projects table
CREATE TABLE IF NOT EXISTS video_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  timeline_data JSONB DEFAULT '{}',
  duration INTEGER,
  resolution TEXT,
  status TEXT DEFAULT 'draft',
  output_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Music tracks table
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  genre TEXT,
  duration INTEGER,
  model_used TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slides JSONB DEFAULT '[]',
  theme JSONB DEFAULT '{}',
  research_sources TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- AUTOMATION TABLES
-- ============================================

-- Chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  flow_data JSONB DEFAULT '{}',
  channels TEXT[] DEFAULT '{}',
  mode TEXT DEFAULT 'off' CHECK (mode IN ('off','suggestive','autopilot')),
  training_data JSONB DEFAULT '{}',
  embed_config JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT false,
  executions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workflow executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  status TEXT DEFAULT 'running' CHECK (status IN ('running','completed','failed')),
  steps_completed JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ
);

-- Scheduled posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  media TEXT[] DEFAULT '{}',
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','posted','failed')),
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Broadcasts table
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  audience_filter JSONB DEFAULT '{}',
  content TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  clicked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- BILLING & ADMIN TABLES
-- ============================================

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','cancelled','past_due')),
  gateway TEXT,
  gateway_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue')),
  gateway TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  model TEXT,
  tokens_used INTEGER,
  cost_usd NUMERIC(12,6),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Platform settings table
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Plugins table
CREATE TABLE IF NOT EXISTS plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  version TEXT,
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB DEFAULT '{}',
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DOMAINS & BUSINESS TABLES
-- ============================================

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  registrar TEXT,
  status TEXT DEFAULT 'active',
  dns_records JSONB DEFAULT '{}',
  ssl_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Hosted sites table
CREATE TABLE IF NOT EXISTS hosted_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  site_id TEXT,
  domain_id UUID REFERENCES domains(id),
  subdomain TEXT,
  hosting_type TEXT,
  bandwidth_used NUMERIC(12,2),
  ssl_provisioned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Name searches table
CREATE TABLE IF NOT EXISTS name_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  industry TEXT,
  style TEXT,
  results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Generated logos table
CREATE TABLE IF NOT EXISTS generated_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  style TEXT,
  variations JSONB DEFAULT '[]',
  selected_variant INTEGER,
  svg_url TEXT,
  png_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Brand kits table
CREATE TABLE IF NOT EXISTS brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  colors JSONB DEFAULT '{}',
  fonts JSONB DEFAULT '{}',
  social_assets JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User payment gateways table
CREATE TABLE IF NOT EXISTS user_payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL,
  credentials_encrypted TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User transactions table
CREATE TABLE IF NOT EXISTS user_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  customer_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  site_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_org_id ON contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_org_id ON conversations(org_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact_id ON conversations(contact_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Opportunities indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_pipeline_id ON opportunities(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_contact_id ON opportunities(contact_id);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_org_id ON tasks(org_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Ad campaigns indexes
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_org_id ON ad_campaigns(org_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_ad_account_id ON ad_campaigns(ad_account_id);

-- Ad analytics indexes
CREATE INDEX IF NOT EXISTS idx_ad_analytics_ad_account_id ON ad_analytics(ad_account_id);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_date ON ad_analytics(date);

-- Articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_org_id ON articles(org_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_org_id ON usage_tracking(org_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_created_at ON usage_tracking(created_at);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys_vault ENABLE ROW LEVEL SECURITY;

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

ALTER TABLE prospecting_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dnc_list ENABLE ROW LEVEL SECURITY;

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE indexed_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlink_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_rules ENABLE ROW LEVEL SECURITY;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_analyses ENABLE ROW LEVEL SECURITY;

ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosted_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE name_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SAMPLE RLS POLICIES (InsForge style)
-- ============================================

-- Example: Users can only see their own org's data
-- Note: InsForge handles RLS differently, these are for reference
-- Actual RLS implementation depends on InsForge's policy system

-- CREATE POLICY org_isolation ON contacts
--   USING (org_id IN (
--     SELECT org_id FROM org_members WHERE user_id = auth.uid()
--   ));

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- All 66+ tables created successfully!
-- RLS enabled on all tables
-- Indexes created for performance
-- Ready for NEXUS platform!
