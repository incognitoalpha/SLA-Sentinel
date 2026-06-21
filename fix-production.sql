-- ═══════════════════════════════════════════════════════
-- PRODUCTION DATABASE SETUP SCRIPT
-- Run this in Supabase SQL Editor to fix 401 errors
-- ═══════════════════════════════════════════════════════

-- Step 1: Get your user ID (will be used below)
-- First run this query to see your user ID:
SELECT id, email FROM auth.users;

-- Copy your user ID, then replace 'YOUR_USER_ID_HERE' below with it


-- ═══════════════════════════════════════════════════════
-- Step 2: Create demo organization (if doesn't exist)
-- ═══════════════════════════════════════════════════════

INSERT INTO organizations (id, name, billing_email, stripe_customer_id, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Corp',
  'demo@example.com',
  NULL,
  NOW()
)
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════════════════════
-- Step 3: Create your user profile (REPLACE YOUR_USER_ID_HERE)
-- ═══════════════════════════════════════════════════════

-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID from Step 1
INSERT INTO profiles (id, org_id, role, created_at)
VALUES (
  'YOUR_USER_ID_HERE',  -- ← REPLACE THIS
  '00000000-0000-0000-0000-000000000001',
  'owner',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  org_id = EXCLUDED.org_id,
  role = EXCLUDED.role;


-- ═══════════════════════════════════════════════════════
-- Step 4: Seed demo providers
-- ═══════════════════════════════════════════════════════

-- Stripe API Provider
INSERT INTO providers (id, org_id, name, base_url, description, created_at)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Stripe API',
  'https://api.stripe.com',
  'Payment processing API',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- SendGrid API Provider
INSERT INTO providers (id, org_id, name, base_url, description, created_at)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'SendGrid API',
  'https://api.sendgrid.com',
  'Email delivery API',
  NOW()
)
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════════════════════
-- Step 5: Add demo endpoints for Stripe
-- ═══════════════════════════════════════════════════════

INSERT INTO endpoints (id, provider_id, url, method, expected_status, timeout_ms, probe_interval_seconds, is_active, created_at)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '/v1/customers',
    'GET',
    401,  -- Stripe returns 401 without auth (expected)
    5000,
    300,  -- 5 minutes
    true,
    NOW()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '/v1/charges',
    'GET',
    401,
    5000,
    300,
    true,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════════════════════
-- Step 6: Add demo endpoints for SendGrid
-- ═══════════════════════════════════════════════════════

INSERT INTO endpoints (id, provider_id, url, method, expected_status, timeout_ms, probe_interval_seconds, is_active, created_at)
VALUES
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    '/v3/user/profile',
    'GET',
    401,  -- SendGrid returns 401 without auth (expected)
    5000,
    300,
    true,
    NOW()
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    '/v3/marketing/contacts',
    'GET',
    401,
    5000,
    300,
    true,
    NOW()
  )
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════════════════════
-- Step 7: Verify everything was created
-- ═══════════════════════════════════════════════════════

SELECT
  'organizations' as table_name,
  COUNT(*) as row_count
FROM organizations
UNION ALL
SELECT
  'profiles' as table_name,
  COUNT(*) as row_count
FROM profiles
UNION ALL
SELECT
  'providers' as table_name,
  COUNT(*) as row_count
FROM providers
UNION ALL
SELECT
  'endpoints' as table_name,
  COUNT(*) as row_count
FROM endpoints;

-- Expected results:
-- organizations: 1
-- profiles: 1 (or more if you have multiple users)
-- providers: 2
-- endpoints: 4
