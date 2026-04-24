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

-- Add more tables as needed for the full schema
CREATE TABLE IF NOT EXISTS platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);