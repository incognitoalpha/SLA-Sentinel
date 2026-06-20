# Supabase Auth Configuration Guide

## Enable Email/Password Auth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider:
   - Toggle ON
   - Enable "Confirm email" (recommended for production, can disable for dev)
   - Save

## Enable Magic Link (Email OTP)

Already enabled by default with Email provider. Users can sign in without password via magic link sent to email.

## Test Auth Setup

After migrations applied, test auth:

```bash
# In Supabase Dashboard → Authentication → Users
# Click "Add user" → Create test user manually
# OR use signup flow in the app once frontend built

# Test user example:
# Email: demo@example.com
# Password: TestPass123!
```

## Link User to Organization

After creating a user in Supabase Auth:

1. Get user UUID from Dashboard → Authentication → Users
2. Run in SQL Editor:

```sql
-- Replace with actual user UUID
INSERT INTO profiles (id, org_id, role)
VALUES (
  'USER_UUID_HERE',
  '00000000-0000-0000-0000-000000000001', -- Demo Corp org_id from seed
  'owner'
);
```

## Environment Variables

Already configured in `.env`:
- `SUPABASE_URL` - Project URL
- `SUPABASE_SERVICE_ROLE_KEY` - For backend operations
- `SUPABASE_ANON_KEY` - For frontend auth (in apps/web/.env.local)

Auth is ready once migrations applied.
