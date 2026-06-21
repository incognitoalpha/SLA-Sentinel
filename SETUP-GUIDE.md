# 🚀 Quick Setup Guide — SLA Sentinel

Complete these three tasks to get SLA Sentinel live in production.

---

## ✅ Task 1: Supabase Setup (Today — 15 min)

### Step 1: Create Supabase Project

1. Go to **https://supabase.com/dashboard**
2. Click **New Project**
3. Fill in:
   - **Name:** `sla-sentinel-prod`
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
4. Click **Create new project**
5. ⏳ Wait 2-3 minutes for provisioning

### Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API** in the left sidebar
2. Copy these three values:

```bash
# Project URL
https://xxxxxxxxxxxxx.supabase.co

# Anon (public) key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (⚠️ SECRET — never commit this)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Update Your Local .env File

1. Copy the example env file:
```bash
cd apps/api
cp .env.example .env
```

2. Open `apps/api/.env` and update:
```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service role key)
SUPABASE_ANON_KEY=eyJhbGci... (your anon key)
```

3. Do the same for the web app:
```bash
cd ../web
cp .env.example .env
```

4. Open `apps/web/.env.local` and update:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your anon key)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

### Step 4: Run Migrations

Go back to your Supabase dashboard:

1. Click **SQL Editor** in the left sidebar
2. Click **New query**
3. Run each migration file in order:

#### Migration 1: Initial Schema
```bash
# Copy the contents of: apps/api/migrations/001_initial_schema.sql
# Paste into SQL Editor and click "Run"
```

#### Migration 2: RLS Policies
```bash
# Copy the contents of: apps/api/migrations/002_rls_policies.sql
# Paste into SQL Editor and click "Run"
```

#### Migration 3: Add evaluated_at
```bash
# Copy the contents of: apps/api/migrations/003_add_evaluated_at.sql
# Paste into SQL Editor and click "Run"
```

### Step 5: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ organizations
   - ✅ profiles
   - ✅ providers
   - ✅ endpoints
   - ✅ probes
   - ✅ agreements
   - ✅ evaluations
   - ✅ breaches
   - ✅ alerts
   - ✅ audit_log

### Step 6: Seed Demo Data

Run the seed script locally:

```bash
cd apps/api
pnpm seed
```

**Expected output:**
```
✓ Seeded demo organization
✓ Seeded demo providers
✓ Seeded demo endpoints
✓ Seed completed successfully
```

### Step 7: Create Your Production User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - **Email:** your-email@example.com
   - **Password:** strong-password (save it!)
   - **Auto Confirm User:** ✅ checked
4. Click **Create user**
5. Copy the User UUID shown in the users table

6. Link this user to the demo org:
   - Go back to **SQL Editor**
   - Run this query (replace YOUR_USER_UUID):

```sql
insert into profiles (id, org_id, role)
values (
  'YOUR_USER_UUID_HERE',
  '00000000-0000-0000-0000-000000000001',
  'owner'
);
```

### Step 8: Verify Locally

Start the API server:

```bash
cd apps/api
pnpm dev
```

In another terminal, start the web app:

```bash
cd apps/web
pnpm dev
```

Open http://localhost:3000 and:
1. ✅ Login page loads
2. ✅ Log in with your user credentials
3. ✅ Dashboard shows "Demo Corp" org
4. ✅ See Stripe API and SendGrid API provider cards

**✨ Task 1 Complete! Supabase is set up and verified locally.**

---

## 🚀 Task 2: Deploy to Vercel + Render (This Week)

### Prerequisites
- [ ] Supabase setup complete (Task 1 above)
- [ ] GitHub repository pushed to main
- [ ] Render account created (https://render.com)
- [ ] Vercel account created (https://vercel.com)

### Step 1: Deploy API to Render

1. Go to https://render.com/dashboard
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and show 3 services:
   - sla-sentinel-api (Web Service)
   - sla-sentinel-worker (Cron Job)
   - sla-sentinel-evaluator (Cron Job)

5. Click **Apply**

6. For each service, add environment variables:

**For sla-sentinel-api:**
```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ORACLE_PRIVATE_KEY=0x... (your funded Sepolia wallet)
SLA_ESCROW_CONTRACT_ADDRESS=0x... (your deployed contract)
RESEND_API_KEY=re_... (get from resend.com)
WEBHOOK_SIGNING_SECRET=generate-random-32-char-string
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production
```

**For sla-sentinel-worker:**
```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NODE_ENV=production
```

**For sla-sentinel-evaluator:**
```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ORACLE_PRIVATE_KEY=0x...
SLA_ESCROW_CONTRACT_ADDRESS=0x...
RESEND_API_KEY=re_...
NODE_ENV=production
```

7. Wait for deployment (5-10 minutes)
8. Copy your API URL: `https://sla-sentinel-api.onrender.com`

9. Test the health endpoint:
```bash
curl https://sla-sentinel-api.onrender.com/api/healthz
```

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `pnpm build`
   - **Install Command:** `pnpm install`

4. Add environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_BASE_URL=https://sla-sentinel-api.onrender.com
```

5. Click **Deploy**
6. Wait for deployment (3-5 minutes)
7. Copy your Vercel URL: `https://your-app.vercel.app`

### Step 3: Update CORS

Go back to Render:
1. Click on **sla-sentinel-api** service
2. Go to **Environment**
3. Update `CORS_ORIGIN` to your Vercel URL:
```bash
CORS_ORIGIN=https://your-app.vercel.app
```
4. Save (this triggers a redeploy)

### Step 4: Verify Production

1. Open your Vercel URL in a browser
2. ✅ Login page loads
3. ✅ Log in with your production user
4. ✅ Dashboard loads
5. ✅ Provider cards display
6. ✅ Check browser console (no errors)

**✨ Task 2 Complete! Your app is live in production.**

---

## 🧪 Task 3: Run E2E Tests & Create Real SLA (After Deployment)

### Step 1: Run E2E Tests Against Production

1. Update your E2E test config with production URLs:

```bash
# Create apps/web/playwright.config.prod.ts
```

2. Run the tests:
```bash
cd apps/web
PLAYWRIGHT_BASE_URL=https://your-app.vercel.app pnpm test:e2e
```

3. Review results:
   - ✅ All critical flows work
   - ✅ Login/logout
   - ✅ Provider creation
   - ✅ Dashboard navigation

### Step 2: Create Your First Real SLA Agreement

Now for the fun part — monitor a real API!

1. Log into your production dashboard
2. Click **"Add Provider"**
3. Create a provider for a real API you use:
   - **Name:** "My Production API"
   - **Base URL:** https://api.yourservice.com
   - **Description:** "Production API we depend on"

4. Add an endpoint:
   - **URL:** https://api.yourservice.com/health
   - **Method:** GET
   - **Expected Status:** 200
   - **Timeout:** 5000ms
   - **Probe Interval:** 300s (5 minutes)

5. Create an agreement:
   - **Name:** "Production SLA - June 2026"
   - **Uptime Threshold:** 99.9%
   - **P95 Latency Threshold:** 500ms
   - **Period Type:** Weekly
   - **Start Date:** Today
   - **End Date:** 7 days from now

6. Wait 5-10 minutes and refresh — you should see probe data!

### Step 3: Test Breach Detection (Optional)

To test the breach flow with a guaranteed failure:

1. Create a provider with a bad endpoint:
   - **URL:** https://httpstat.us/500 (always returns 500)
   
2. Wait for 2 consecutive probe failures
3. Check the dashboard for breach notification
4. Check your email for breach alert

### Step 4: Monitor in Production

Check your production services:

1. **Render Worker Logs:**
   - Go to Render → sla-sentinel-worker → Logs
   - Should see probe runs every 5 minutes

2. **Render Evaluator Logs:**
   - Go to Render → sla-sentinel-evaluator → Logs  
   - Should see evaluation checks every hour

3. **Supabase Database:**
   - Go to Supabase → Table Editor → probes
   - Should see new probe records appearing

**✨ Task 3 Complete! Your SLA monitoring is live and tracking real APIs.**

---

## 📊 What You've Built

You now have a production-grade SLA monitoring platform that:

- ✅ Probes third-party APIs every 5 minutes
- ✅ Stores uptime and latency metrics
- ✅ Detects SLA breaches automatically
- ✅ Sends email notifications on breach
- ✅ Enforces consequences via Sepolia testnet escrow
- ✅ Displays everything in a beautiful Vercel-style dashboard

## 🎯 Next Steps

1. Add more real APIs to monitor
2. Create meaningful SLA agreements
3. Record a demo video for your portfolio
4. Add this to your resume (see PRD.md §17 for bullet points)

---

**Need help?** Check DEPLOYMENT.md for detailed troubleshooting, or check the logs in Render/Vercel dashboards.
