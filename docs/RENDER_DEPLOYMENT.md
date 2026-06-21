# Render Deployment Guide

## Overview

SLA Sentinel provides two deployment options for Render:

1. **Production Setup** (`render.yaml`) - Recommended
2. **Free Tier Setup** (`render-free.yaml`) - For testing/demos

## Option 1: Production Setup (render.yaml)

**Cost:** $14/month ($7/month × 2 cron jobs)

### Services Deployed:
- **API Web Service** (free tier) - Main API server
- **Worker Cron Job** (starter plan) - Runs probes every 5 minutes
- **Evaluator Cron Job** (starter plan) - Evaluates SLAs every hour

### Benefits:
- ✅ Isolated services (better reliability)
- ✅ Independent scaling and restarts
- ✅ True cron scheduling (guaranteed execution)
- ✅ Production-ready architecture

### Deployment Steps:

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/incognitoalpha/SLA-Sentinel.git
   ```

2. **Deploy via Render Dashboard**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New" → "Blueprint"**
   - Connect your GitHub repository
   - Select branch: `main`
   - Blueprint path: `render.yaml`
   - Click **"Apply"**

3. **Configure Environment Variables**
   
   For each service, add these secrets:
   
   **API Service:**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SEPOLIA_RPC_URL=your_alchemy_or_infura_url
   ORACLE_PRIVATE_KEY=0x...
   SLA_ESCROW_CONTRACT_ADDRESS=0x...
   RESEND_API_KEY=re_...
   WEBHOOK_SIGNING_SECRET=your_secret
   ```
   
   **Worker Cron:**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
   
   **Evaluator Cron:**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SEPOLIA_RPC_URL=your_alchemy_or_infura_url
   ORACLE_PRIVATE_KEY=0x...
   SLA_ESCROW_CONTRACT_ADDRESS=0x...
   RESEND_API_KEY=re_...
   WEBHOOK_SIGNING_SECRET=your_secret
   ```

4. **Verify Deployment**
   - Check API health: `https://your-api.onrender.com/api/healthz`
   - Monitor cron job logs in Render dashboard
   - First worker run: ~5 minutes after deployment
   - First evaluator run: Top of next hour

---

## Option 2: Free Tier Setup (render-free.yaml)

**Cost:** $0/month

### Services Deployed:
- **API Web Service** (free tier) - API + Worker + Evaluator in one process

### Benefits:
- ✅ Completely free
- ✅ Simpler setup (single service)
- ✅ Good for testing/demos

### Limitations:
- ⚠️ Background jobs share resources with API
- ⚠️ If API restarts, scheduled tasks restart
- ⚠️ Free tier: 750 hours/month limit (~31 days)
- ⚠️ May sleep after 15 min of inactivity (can use cron-job.org to ping)

### Deployment Steps:

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/incognitoalpha/SLA-Sentinel.git
   ```

2. **Deploy via Render Dashboard**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New" → "Blueprint"**
   - Connect your GitHub repository
   - Select branch: `main`
   - Blueprint path: `render-free.yaml`
   - Click **"Apply"**

3. **Configure Environment Variables**
   
   Same as Option 1 API service, plus:
   ```
   ENABLE_BACKGROUND_JOBS=true
   WORKER_SCHEDULE_CRON=*/5 * * * *
   EVALUATOR_SCHEDULE_CRON=0 * * * *
   ```

4. **Keep Service Awake (Optional)**
   
   Free tier services sleep after 15 minutes of inactivity.
   To prevent this, set up a ping service:
   
   - Go to [cron-job.org](https://cron-job.org)
   - Create job: `GET https://your-api.onrender.com/api/healthz`
   - Schedule: Every 10 minutes
   - This keeps your service active 24/7

---

## Architecture Comparison

### Production Setup (render.yaml)

```
┌─────────────────┐
│   API Service   │  ← Handles HTTP requests
│   (Free Tier)   │
└─────────────────┘

┌─────────────────┐
│  Worker Cron    │  ← Runs probes every 5 min
│ (Starter $7/mo) │
└─────────────────┘

┌─────────────────┐
│ Evaluator Cron  │  ← Evaluates SLAs hourly
│ (Starter $7/mo) │
└─────────────────┘
```

### Free Tier Setup (render-free.yaml)

```
┌──────────────────────────┐
│      API Service         │
│      (Free Tier)         │
│                          │
│  ┌────────────────────┐  │
│  │   HTTP Server      │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ Background Worker  │  │ ← Runs in-process
│  │  (every 5 min)     │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ Background Eval    │  │ ← Runs in-process
│  │   (every hour)     │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

---

## Troubleshooting

### Cron Jobs Not Running
- Check service logs in Render dashboard
- Verify environment variables are set
- Ensure `startCommand` points to compiled files (`dist/`)

### Build Failures
- Verify `pnpm` version matches `package.json` (10.x)
- Check that `pnpm-lock.yaml` is committed
- Review build logs for missing dependencies

### Free Tier Service Sleeping
- Set up ping service (cron-job.org)
- Or upgrade to Starter plan ($7/month for always-on)

### Database Connection Issues
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project is not paused
- Confirm RLS policies allow service role access

---

## Monitoring

### Health Checks
```bash
# API health
curl https://your-api.onrender.com/api/healthz

# Check specific services (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api.onrender.com/api/providers
```

### Logs
- View logs in Render dashboard for each service
- Worker logs: Shows probe executions
- Evaluator logs: Shows SLA evaluation results

### Metrics
- Monitor in Render dashboard
- Track CPU, memory, and request metrics
- Set up alerts for service failures

---

## Cost Summary

| Setup | Services | Monthly Cost |
|-------|----------|--------------|
| Production (`render.yaml`) | 1 web + 2 cron | $14 |
| Free Tier (`render-free.yaml`) | 1 web | $0 |

**Recommendation:** Start with free tier for testing, upgrade to production setup for serious use.

---

## Next Steps

After deployment:

1. ✅ Deploy frontend to Vercel (see `docs/VERCEL_DEPLOYMENT.md`)
2. ✅ Update `CORS_ORIGIN` in Render to match your Vercel URL
3. ✅ Configure Supabase RLS policies
4. ✅ Test end-to-end flow
5. ✅ Set up monitoring and alerts

For full deployment guide, see `DEPLOYMENT.md` in the root directory.
