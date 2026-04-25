-- CRM Collections
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  opportunity_id uuid REFERENCES opportunities(id),
  assigned_to uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  due_date timestamptz,
  priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  status text DEFAULT 'todo' CHECK (status IN ('todo','in_progress','completed','cancelled')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  content text NOT NULL,
  is_private boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  contact_id uuid REFERENCES contacts(id),
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
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft','active','paused','completed')),
  target_audience jsonb DEFAULT '{}',
  budget numeric(12,2),
  currency text DEFAULT 'USD',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scraped_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES prospecting_campaigns(id),
  source text NOT NULL,
  name text,
  email text,
  phone text,
  company text,
  position text,
  location text,
  website text,
  social_profiles jsonb DEFAULT '{}',
  custom_data jsonb DEFAULT '{}',
  status text DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','disqualified')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES outreach_sequences(id),
  step_number integer NOT NULL,
  channel text NOT NULL CHECK (channel IN ('email','sms','whatsapp','linkedin','twitter')),
  delay_days integer DEFAULT 0,
  delay_hours integer DEFAULT 0,
  template_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES outreach_sequences(id),
  lead_id uuid REFERENCES scraped_leads(id),
  current_step integer DEFAULT 1,
  status text DEFAULT 'active' CHECK (status IN ('active','completed','paused','cancelled')),
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS outreach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES outreach_enrollments(id),
  step_id uuid REFERENCES outreach_steps(id),
  status text CHECK (status IN ('sent','delivered','opened','clicked','replied','bounced')),
  metadata jsonb DEFAULT '{}',
  occurred_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  verification_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dnc_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  contact_info text NOT NULL,
  contact_type text CHECK (contact_type IN ('email','phone')),
  reason text,
  added_by uuid REFERENCES users(id),
  added_at timestamptz DEFAULT now()
);

-- Content & SEO Collections
CREATE TABLE IF NOT EXISTS content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_fetched_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  site_id uuid REFERENCES connected_sites(id),
  audit_date timestamptz DEFAULT now(),
  score integer CHECK (score >= 0 AND score <= 100),
  issues jsonb DEFAULT '[]',
  recommendations jsonb DEFAULT '{}',
  status text DEFAULT 'completed' CHECK (status IN ('pending','running','completed','failed'))
);

CREATE TABLE IF NOT EXISTS indexed_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES connected_sites(id),
  url text NOT NULL,
  title text,
  description text,
  keywords jsonb DEFAULT '[]',
  last_crawled_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active','removed','error'))
);

CREATE TABLE IF NOT EXISTS connected_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  url text NOT NULL,
  platform text,
  credentials_encrypted text,
  is_connected boolean DEFAULT false,
  last_synced_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS keyword_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  keyword text NOT NULL,
  search_engine text DEFAULT 'google',
  location text,
  device text DEFAULT 'desktop',
  current_position integer,
  previous_position integer,
  best_position integer,
  search_volume integer,
  competition text,
  tracked_since timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS backlink_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  domain text NOT NULL,
  total_backlinks integer DEFAULT 0,
  unique_domains integer DEFAULT 0,
  domain_authority integer,
  trust_flow integer,
  citation_flow integer,
  last_updated timestamptz DEFAULT now()
);

-- Ads Collections
CREATE TABLE IF NOT EXISTS ad_audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  ad_account_id uuid REFERENCES ad_accounts(id),
  name text NOT NULL,
  type text CHECK (type IN ('lookalike','custom','saved')),
  definition jsonb NOT NULL,
  size_estimate integer,
  status text DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
  created_at timestamptz DEFAULT now()
);

-- Commerce Collections
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  price numeric(12,2),
  currency text DEFAULT 'USD',
  images jsonb DEFAULT '[]',
  category text,
  tags jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  customer_id uuid REFERENCES contacts(id),
  items jsonb NOT NULL,
  total_amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  shipping_address jsonb,
  billing_address jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  order_id uuid REFERENCES orders(id),
  customer_id uuid REFERENCES contacts(id),
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  due_date date,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Creative Collections
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  type text CHECK (type IN ('social','web','print','presentation')),
  canvas_data jsonb NOT NULL,
  thumbnail text,
  is_template boolean DEFAULT false,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  url text NOT NULL,
  prompt text,
  model text,
  width integer,
  height integer,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  url text NOT NULL,
  duration integer,
  format text,
  prompt text,
  model text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Automation Collections
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  trigger jsonb NOT NULL,
  actions jsonb NOT NULL,
  is_active boolean DEFAULT true,
  last_run_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chatbots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  config jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Build Collections
CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  domain text,
  template text,
  pages jsonb NOT NULL,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hosting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  website_id uuid REFERENCES websites(id),
  provider text,
  config jsonb DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active','suspended','terminated')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  provider text,
  status text DEFAULT 'active' CHECK (status IN ('active','expired','transferred')),
  expires_at date,
  created_at timestamptz DEFAULT now()
);

-- Reports Collections
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  name text NOT NULL,
  type text NOT NULL,
  config jsonb NOT NULL,
  schedule jsonb,
  last_generated_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);