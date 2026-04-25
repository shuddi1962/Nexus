-- Demo accounts seeding
INSERT INTO users (email, password_hash, name, role, plan, email_verified, two_fa_enabled, suspended, created_at)
VALUES
  ('admin@nexus.demo', '$2b$10$dummy.hash.for.demo', 'Platform Admin', 'admin', 'agency', true, false, false, NOW()),
  ('owner@nexus.demo', '$2b$10$dummy.hash.for.demo', 'Agency Owner', 'owner', 'agency', true, false, false, NOW()),
  ('pro@nexus.demo', '$2b$10$dummy.hash.for.demo', 'Pro User', 'owner', 'pro', true, false, false, NOW()),
  ('starter@nexus.demo', '$2b$10$dummy.hash.for.demo', 'Starter User', 'owner', 'starter', true, false, false, NOW()),
  ('staff@nexus.demo', '$2b$10$dummy.hash.for.demo', 'Team Member', 'staff', 'pro', true, false, false, NOW())
ON CONFLICT (email) DO NOTHING;