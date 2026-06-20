# Deployment Guide — SLA Sentinel

This guide walks through deploying SLA Sentinel to production infrastructure.

## Prerequisites

- [ ] GitHub repository pushed to `main` branch
- [ ] Supabase production project created
- [ ] Render account created
- [ ] Vercel account created
- [ ] Sepolia testnet wallet funded (oracle wallet)
- [ ] Smart contract deployed to Sepolia

## 1. Supabase Production Setup

### 1.1 Create Production Project

1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Name: `sla-sentinel-prod`
4. Region: Choose closest to your users
5. Generate strong database password
6. Wait for project to initialize

### 1.2 Apply Migrations

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each migration file in order:
   - `apps/api/migrations/001_initial_schema.sql`
   - `apps/api/migrations/002_add_rls_policies.sql`
   - `apps/api/migrations/003_add_evaluated_at.sql`
3. Verify tables exist in **Table Editor**

### 1.3 Run Seed Script

```bash
cd apps/api
# Update .env with production Supabase credentials temporarily
SUPABASE_URL=https://your-prod-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
pnpm seed
```

### 1.4 Create Production User

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Email: your production admin email
4. Password: strong password
5. Copy the User UUID
6. Run SQL to link user to demo org:

```sql
insert into profiles (id, org_id, role)
values (
  'YOUR_USER_UUID_HERE',
  '00000000-0000-0000-0000-000000000001',
  'owner'
);
```

### 1.5 Collect Production Credentials

- **Supabase URL**: `https://yourproject.supabase.co`
- **Supabase Anon Key**: Found in **Settings** → **API**
- **Supabase Service Role Key**: Found in **Settings** → **API** (⚠️ never commit this)

---

## 2. Render Deployment

### 2.1 Connect Repository

1. Go to https://render.com/dashboard
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Select the repository with `render.yaml`

### 2.2 Configure Environment Variables

For **sla-sentinel-api** service, add:

```
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ORACLE_PRIVATE_KEY=0x...
SLA_ESCROW_CONTRACT_ADDRESS=0x...
RESEND_API_KEY=re_...
WEBHOOK_SIGNING_SECRET=your-secret-here
CORS_ORIGIN=https://your-app.vercel.app
```

For **sla-sentinel-worker**, add:
```
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

For **sla-sentinel-evaluator**, add all the API env vars (needs blockchain access).

### 2.3 Deploy

1. Click **Apply**
2. Render will build and deploy all 3 services
3. Wait for all services to show **Live** status
4. Copy the API service URL: `https://sla-sentinel-api.onrender.com`

### 2.4 Verify API Health

```bash
curl https://sla-sentinel-api.onrender.com/api/healthz
# Expected: {"status":"ok","timestamp":"..."}
```

---

## 3. Vercel Deployment

### 3.1 Connect Repository

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework Preset: **Next.js**
4. Root Directory: `apps/web`
5. Build Command: `cd apps/web && pnpm build`
6. Output Directory: `apps/web/.next`

### 3.2 Configure Environment Variables

Add these in **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_BASE_URL=https://sla-sentinel-api.onrender.com
```

⚠️ Set for **Production**, **Preview**, and **Development** environments.

### 3.3 Deploy

1. Click **Deploy**
2. Vercel will build and deploy automatically
3. Copy the production URL: `https://your-app.vercel.app`
4. **Update Render CORS_ORIGIN** to this URL

### 3.4 Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

---

## 4. Update CORS Configuration

Now that you have the Vercel URL, update Render:

1. Go to Render Dashboard → **sla-sentinel-api**
2. Navigate to **Environment**
3. Update `CORS_ORIGIN` to your Vercel URL
4. Save (this will trigger a redeploy)

---

## 5. Post-Deployment Smoke Tests

### 5.1 API Health Check

```bash
curl https://sla-sentinel-api.onrender.com/api/healthz
```

**Expected:** `{"status":"ok","timestamp":"..."}`

### 5.2 Frontend Loads

1. Open `https://your-app.vercel.app` in browser
2. Should see login page
3. Check browser console for errors (should be none)

### 5.3 Login Flow

1. Login with your production user credentials
2. Should redirect to `/dashboard`
3. Should see "Demo Corp" in nav bar
4. Should see Stripe API and SendGrid API provider cards

### 5.4 Provider Detail

1. Click on "Stripe API" card
2. Should see endpoint list
3. Should see recent probes table (may be empty if worker hasn't run yet)
4. Check Network tab: API requests should return 200

### 5.5 Worker Execution

Worker runs every 5 minutes. To verify:

1. Go to Render Dashboard → **sla-sentinel-worker**
2. Check **Logs** tab
3. Wait for next scheduled run (or manually trigger)
4. Should see: "Starting probe run..." and "Probe run complete"

### 5.6 Check Probes in Database

```sql
-- Run in Supabase SQL Editor
select * from probes order by checked_at desc limit 10;
```

Should see recent probe records.

### 5.7 Evaluator Execution

Evaluator runs every hour. To verify:

1. Go to Render Dashboard → **sla-sentinel-evaluator**
2. Check **Logs** tab
3. Should see: "Found 0 agreements due for evaluation" (expected if no active agreements with passed periods)

---

## 6. Create a Demo Agreement (Optional)

To test the full flow:

1. Create an agreement via the API (use Postman or curl)
2. Set `period_end` to a date in the past
3. Wait for evaluator to run (or trigger manually)
4. Check for evaluation in database
5. If breach occurred, check for email sent and on-chain transaction

---

## 7. GitHub Actions CI/CD

Already configured in `.github/workflows/ci.yml`. This workflow:

- Runs on every PR to `main`
- Lints and typechecks all workspaces
- Runs unit tests
- Runs contract tests
- Blocks merge if any job fails

To verify it's working:

1. Create a feature branch
2. Make a small change
3. Open a PR to `main`
4. Check the **Checks** tab on the PR
5. All checks should pass before merge is allowed

---

## 8. Monitoring & Alerts

### 8.1 Render Logs

- API logs: https://dashboard.render.com/web/YOUR_SERVICE_ID/logs
- Worker logs: Check cron job logs after each run
- Evaluator logs: Check cron job logs after each run

### 8.2 Vercel Logs

- Go to your deployment → **Functions** tab
- Monitor for runtime errors

### 8.3 Supabase Monitoring

- **Database** → **Reports**: Monitor query performance
- **Auth** → **Logs**: Monitor login attempts

### 8.4 Uptime Monitoring (Recommended)

Set up external monitoring for:
- API health endpoint: `https://sla-sentinel-api.onrender.com/api/healthz`
- Frontend: `https://your-app.vercel.app`

Tools: UptimeRobot, Better Uptime, Pingdom

---

## 9. Cost Breakdown (Free Tier)

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| Render Web Service | Free | $0 | Sleeps after 15min inactivity |
| Render Cron Jobs (2) | Free | $0 | Limited execution time |
| Vercel | Hobby | $0 | 100GB bandwidth/month |
| Supabase | Free | $0 | 500MB database, 2GB bandwidth |
| Alchemy (Sepolia RPC) | Free | $0 | 300M compute units/month |
| Resend | Free | $0 | 100 emails/day |

**Note:** Render free tier services sleep after 15 minutes of inactivity. First request after sleep takes ~30s to wake up.

---

## 10. Production Considerations

### Security

- [ ] Rotate all secrets before going live
- [ ] Enable 2FA on all service accounts
- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Review Supabase RLS policies

### Backup

- [ ] Enable Supabase daily backups (paid feature)
- [ ] Export database schema regularly
- [ ] Keep copy of contract ABI and deployment address

### Scaling

Current free tier limits:
- API: Auto-scales on Render free tier (with sleep)
- Database: 500MB (upgrade to Supabase Pro if needed)
- Worker: 5-minute interval sufficient for demo

### Monitoring

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor API response times
- [ ] Track worker success/failure rate
- [ ] Monitor probe failure patterns

---

## Troubleshooting

### API returns 500

- Check Render logs for error details
- Verify all environment variables are set
- Check Supabase connection

### Worker not running

- Check Render cron job logs
- Verify schedule syntax in `render.yaml`
- Manually trigger via Render dashboard

### Frontend shows CORS errors

- Verify `CORS_ORIGIN` matches Vercel URL exactly
- Check for trailing slashes
- Wait for Render redeploy after changing env var

### Login fails

- Verify Supabase URL and anon key are correct
- Check user exists in Supabase Auth
- Check browser console for error details

### Probes not appearing

- Check worker logs for errors
- Verify Supabase service role key has write access
- Check if endpoints are marked `is_active = true`

---

## Rollback Procedure

If production deployment fails:

1. Revert to previous Vercel deployment (one-click in dashboard)
2. Revert Render service to previous build
3. Check environment variables haven't changed
4. Review recent commits for breaking changes

---

## Next Steps After Deployment

1. Test full breach flow end-to-end
2. Add more providers and agreements
3. Monitor for 24 hours to ensure stability
4. Document any production-specific learnings
5. Create runbook for common operational tasks

---

**Deployment checklist saved. See PRD.md Phase 8 for task tracking.**
