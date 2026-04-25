-- CRM Collections
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  tags jsonb DEFAULT '[]',
  custom_fields jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email','sms','whatsapp','phone')),
  status text DEFAULT 'open' CHECK (status IN ('open','closed','pending')),
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('user','contact','system')),
  sender_id uuid,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',
  sent_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  stages jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  pipeline_id uuid REFERENCES pipelines(id) ON DELETE CASCADE,
  stage text NOT NULL,
  value numeric(12,2),
  close_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ads Manager Collections
CREATE TABLE IF NOT EXISTS ad_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('meta','google','tiktok','twitter','linkedin','snapchat','pinterest','youtube','amazon')),
  account_id text NOT NULL,
  account_name text NOT NULL,
  credentials_encrypted text NOT NULL,
  status text DEFAULT 'connected' CHECK (status IN ('connected','disconnected','error','pending')),
  currency text DEFAULT 'USD',
  timezone text DEFAULT 'UTC',
  billing_method text,
  connected_at timestamptz DEFAULT now(),
  UNIQUE(org_id, platform, account_id)
);

CREATE TABLE IF NOT EXISTS ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  ad_account_id uuid REFERENCES ad_accounts(id) ON DELETE CASCADE,
  platform text NOT NULL,
  external_campaign_id text,
  name text NOT NULL,
  objective text,
  status text DEFAULT 'draft' CHECK (status IN ('active','paused','draft','archived')),
  daily_budget numeric(12,2),
  lifetime_budget numeric(12,2),
  currency text DEFAULT 'USD',
  start_date date,
  end_date date,
  targeting jsonb DEFAULT '{}',
  bid_strategy text,
  created_at timestamptz DEFAULT now(),
  synced_at timestamptz
);

CREATE TABLE IF NOT EXISTS ad_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  external_adset_id text,
  name text NOT NULL,
  status text DEFAULT 'active',
  budget numeric(12,2),
  targeting jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  synced_at timestamptz
);

CREATE TABLE IF NOT EXISTS ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adset_id uuid REFERENCES ad_sets(id) ON DELETE CASCADE,
  external_ad_id text,
  name text NOT NULL,
  status text DEFAULT 'active',
  creative jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  synced_at timestamptz
);

CREATE TABLE IF NOT EXISTS ad_creatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('image','video','carousel','text')),
  content jsonb NOT NULL,
  tags jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ad_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid REFERENCES ads(id) ON DELETE CASCADE,
  date date NOT NULL,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  spend numeric(10,2) DEFAULT 0,
  conversions integer DEFAULT 0,
  ctr numeric(5,4) DEFAULT 0,
  cpc numeric(8,4) DEFAULT 0,
  cpm numeric(8,4) DEFAULT 0,
  roas numeric(8,4) DEFAULT 0,
  UNIQUE(ad_id, date)
);

CREATE TABLE IF NOT EXISTS ad_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  ad_account_id uuid REFERENCES ad_accounts(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  transaction_id text,
  payment_method jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ad_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  conditions jsonb NOT NULL,
  actions jsonb NOT NULL,
  active boolean DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Content & SEO Collections
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  status text DEFAULT 'draft' CHECK (status IN ('draft','published','scheduled')),
  seo_meta jsonb DEFAULT '{}',
  tags jsonb DEFAULT '[]',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Authentication & Core Collections
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  avatar text,
  role text NOT NULL DEFAULT 'owner' CHECK (role IN ('admin','owner','manager','staff','viewer')),
  plan text DEFAULT 'starter' CHECK (plan IN ('starter','pro','agency','enterprise')),
  email_verified boolean DEFAULT false,
  two_fa_secret text,
  two_fa_enabled boolean DEFAULT false,
  last_login_at timestamptz,
  suspended boolean DEFAULT false,
  suspended_reason text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES users(id),
  logo text,
  domain text,
  white_label_config jsonb DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  plan text DEFAULT 'starter',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'staff',
  permissions jsonb DEFAULT '{}',
  invited_by uuid REFERENCES users(id),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(org_id, user_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  ip text,
  user_agent text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys_vault (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  category text NOT NULL,
  encrypted_key text NOT NULL,
  label text,
  added_by uuid REFERENCES users(id),
  last_tested_at timestamptz,
  test_status text DEFAULT 'untested' CHECK (test_status IN ('active','invalid','untested','expired')),
  usage_this_month integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Additional CRM Collections
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  assigned_to uuid REFERENCES users(id),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  attendees jsonb DEFAULT '[]',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Prospecting Collections
CREATE TABLE IF NOT EXISTS prospecting_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active','paused','completed','draft')),
  target_criteria jsonb DEFAULT '{}',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scraped_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  source text NOT NULL,
  name text,
  email text,
  company text,
  linkedin_url text,
  raw_data jsonb DEFAULT '{}',
  scraped_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  steps jsonb NOT NULL,
  active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES outreach_sequences(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  type text NOT NULL CHECK (type IN ('email','linkedin','call','task')),
  template_id uuid,
  delay_hours integer DEFAULT 0,
  conditions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES outreach_sequences(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  current_step integer DEFAULT 1,
  status text DEFAULT 'active' CHECK (status IN ('active','completed','paused','cancelled')),
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS outreach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES outreach_enrollments(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('sent','opened','clicked','replied','completed')),
  event_data jsonb DEFAULT '{}',
  occurred_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  verification_code text NOT NULL,
  verified boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dnc_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  contact_info text NOT NULL,
  type text NOT NULL CHECK (type IN ('email','phone','company')),
  reason text,
  added_by uuid REFERENCES users(id),
  added_at timestamptz DEFAULT now()
);

-- Content & SEO Collections
CREATE TABLE IF NOT EXISTS content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('rss','api','website','social')),
  url text NOT NULL,
  config jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  last_fetched_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  site_url text NOT NULL,
  audit_data jsonb NOT NULL,
  score integer CHECK (score >= 0 AND score <= 100),
  issues_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS indexed_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text,
  description text,
  keywords jsonb DEFAULT '[]',
  indexed_at timestamptz,
  last_checked_at timestamptz DEFAULT now(),
  status text DEFAULT 'checking' CHECK (status IN ('indexed','not_indexed','checking','error'))
);

CREATE TABLE IF NOT EXISTS connected_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('wordpress','shopify','squarespace','wix','custom')),
  credentials_encrypted jsonb,
  connected_at timestamptz DEFAULT now(),
  last_synced_at timestamptz
);

CREATE TABLE IF NOT EXISTS keyword_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  search_volume integer,
  difficulty integer CHECK (difficulty >= 0 AND difficulty <= 100),
  position integer,
  previous_position integer,
  trend text CHECK (trend IN ('up','down','stable')),
  last_updated timestamptz DEFAULT now(),
  UNIQUE(org_id, keyword)
);

CREATE TABLE IF NOT EXISTS backlink_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  domain text NOT NULL,
  total_backlinks integer DEFAULT 0,
  domain_authority integer CHECK (domain_authority >= 0 AND domain_authority <= 100),
  page_authority integer CHECK (page_authority >= 0 AND page_authority <= 100),
  spam_score numeric(5,2) CHECK (spam_score >= 0 AND spam_score <= 100),
  last_updated timestamptz DEFAULT now()
);

-- Commerce Collections
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  sku text UNIQUE,
  stock_quantity integer DEFAULT 0,
  stock_status text DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock','out_of_stock','on_backorder')),
  images jsonb DEFAULT '[]',
  categories jsonb DEFAULT '[]',
  tags jsonb DEFAULT '[]',
  attributes jsonb DEFAULT '{}',
  seo_meta jsonb DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active','inactive','draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES contacts(id),
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled','refunded')),
  currency text DEFAULT 'USD',
  subtotal numeric(10,2) NOT NULL,
  tax_amount numeric(10,2) DEFAULT 0,
  shipping_amount numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  payment_method jsonb,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  ordered_at timestamptz DEFAULT now(),
  fulfilled_at timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_sku text,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  product_options jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  total_orders integer DEFAULT 0,
  total_spent numeric(12,2) DEFAULT 0,
  last_order_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Creative Collections
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('social','banner','logo','presentation','email')),
  canvas_data jsonb NOT NULL,
  thumbnail text,
  tags jsonb DEFAULT '[]',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  thumbnail text,
  size_bytes integer,
  dimensions jsonb,
  tags jsonb DEFAULT '[]',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  thumbnail text,
  duration_seconds integer,
  size_bytes integer,
  tags jsonb DEFAULT '[]',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Automation Collections
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('manual','event','schedule','webhook')),
  trigger_config jsonb DEFAULT '{}',
  steps jsonb NOT NULL,
  active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  status text DEFAULT 'running' CHECK (status IN ('running','completed','failed','cancelled')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  execution_data jsonb DEFAULT '{}',
  error_message text
);

-- Build Collections
CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  domain text,
  template text,
  content jsonb NOT NULL,
  settings jsonb DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_names (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  domain text,
  score integer CHECK (score >= 0 AND score <= 100),
  available boolean DEFAULT false,
  saved boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Platform Settings
CREATE TABLE IF NOT EXISTS platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);