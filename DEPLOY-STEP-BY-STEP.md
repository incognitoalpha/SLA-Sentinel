# 🚀 DEPLOY NOW — Copy & Paste Guide

## ✅ Prerequisites Complete
- [x] Supabase configured
- [x] Code pushed to GitHub
- [x] render.yaml ready
- [x] vercel.json ready

---

## 🎯 Step 2: Deploy Backend to Render (15 min)

### A. Create Render Account & Connect Repo

1. **Go to:** https://render.com/signup
2. **Sign up** with GitHub (free tier)
3. **Authorize** Render to access your repositories
4. Click **"New"** → **"Blueprint"**
5. **Select repository:** `incognitoalpha/SLA-Sentinel`
6. Render will detect `render.yaml` and show 3 services
7. Click **"Apply"**

### B. Add Environment Variables

After clicking Apply, you'll see 3 services being created. For each one, add the env vars below:

#### Service 1: `sla-sentinel-api` (Web Service)

Click on the service → **Environment** tab → Add these variables:

```bash
SUPABASE_URL
https://ohxwtkskkjuvzzyboxaa.supabase.co

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE

RESEND_API_KEY
re_placeholder_for_now

WEBHOOK_SIGNING_SECRET
generate-a-random-32-character-secret-key-here-12345678

CORS_ORIGIN
http://localhost:3000
```

**Note:** We'll update `CORS_ORIGIN` after Vercel deployment

#### Service 2: `sla-sentinel-worker` (Cron Job)

Click on the service → **Environment** tab → Add these:

```bash
SUPABASE_URL
https://ohxwtkskkjuvzzyboxaa.supabase.co

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
```

#### Service 3: `sla-sentinel-evaluator` (Cron Job)

Click on the service → **Environment** tab → Add these:

```bash
SUPABASE_URL
https://ohxwtkskkjuvzzyboxaa.supabase.co

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
```

### C. Wait for Deployment

- Watch the build logs (5-10 minutes)
- Wait for all 3 services to show **"Live"** status
- Green checkmark = success!

### D. Get Your API URL

1. Click on **sla-sentinel-api** service
2. Copy the URL at the top (looks like: `https://sla-sentinel-api-xxxx.onrender.com`)
3. **Save this URL** — you'll need it for Vercel

### E. Test Your API

Open a new terminal and run:

```bash
curl https://YOUR-RENDER-URL.onrender.com/api/healthz
```

**Expected response:** `{"status":"ok","timestamp":"2026-06-21T..."}`

✅ **Render deployment complete!**

---

## 🎯 Step 3: Deploy Frontend to Vercel (10 min)

### A. Get Your Supabase Anon Key

1. Go to: https://supabase.com/dashboard
2. Select your project: `ohxwtkskkjuvzzyboxaa`
3. Click **Settings** → **API**
4. Under "Project API keys", find the **`anon` `public`** key
5. Copy it (starts with `eyJ...`)

### B. Create Vercel Account & Import Project

1. **Go to:** https://vercel.com/signup
2. **Sign up** with GitHub (hobby tier is free)
3. **Authorize** Vercel
4. Click **"Add New..."** → **"Project"**
5. **Import** `incognitoalpha/SLA-Sentinel`

### C. Configure Build Settings

On the configuration page:

**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `apps/web`
**Build Command:** Leave default
**Install Command:** `pnpm install`

### D. Add Environment Variables

Click **"Environment Variables"** section and add these 3 variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
https://ohxwtkskkjuvzzyboxaa.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
[PASTE YOUR ANON KEY FROM STEP A]

NEXT_PUBLIC_API_BASE_URL
[PASTE YOUR RENDER URL FROM STEP 2D]
```

**Example of NEXT_PUBLIC_API_BASE_URL:**
```
https://sla-sentinel-api-xxxx.onrender.com
```

⚠️ **Important:** Make sure to add for **Production**, **Preview**, AND **Development** environments (checkboxes at the bottom)

### E. Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes for build
3. You'll see a success screen with your URL
4. Copy your Vercel URL (looks like: `https://sla-sentinel-xxxx.vercel.app`)

✅ **Vercel deployment complete!**

---

## 🎯 Step 4: Update CORS (Critical!)

Now that you have your Vercel URL, update the API's CORS:

1. Go back to **Render Dashboard**
2. Click **sla-sentinel-api** service
3. Go to **Environment** tab
4. Find `CORS_ORIGIN` variable
5. Change from `http://localhost:3000` to your **exact Vercel URL**
   ```
   https://sla-sentinel-xxxx.vercel.app
   ```
6. Click **"Save Changes"**
7. Wait ~2 minutes for automatic redeploy

---

## 🎯 Step 5: Test Production (5 min)

### Test 1: API Health
```bash
curl https://YOUR-RENDER-URL.onrender.com/api/healthz
```
Expected: `{"status":"ok",...}`

### Test 2: Frontend Loads

1. Open your Vercel URL in a browser
2. You should see the login page
3. **Log in** with your Supabase user credentials
4. You should see:
   - ✅ Dashboard with "Demo Corp" in nav
   - ✅ Two provider cards (Stripe API, SendGrid API)
   - ✅ No console errors

### Test 3: Worker is Running

1. Go to Render → **sla-sentinel-worker** → **Logs** tab
2. Wait 5 minutes (cron schedule)
3. You should see: `"Starting probe run..."` and `"Probe run complete"`

**Don't want to wait?** Manually trigger the cron job:
- Click the **"Trigger Run"** button in the worker's dashboard

### Test 4: Probes Are Being Recorded

1. Go to your Vercel app
2. Click on **"Stripe API"** provider card
3. You should see probe data in the table
4. Or check Supabase: **Table Editor** → `probes` table

---

## ✅ PRODUCTION DEPLOYMENT COMPLETE! 🎉

Your SLA Sentinel is now live:

- ✅ API: https://YOUR-RENDER-URL.onrender.com
- ✅ Frontend: https://YOUR-VERCEL-URL.vercel.app
- ✅ Database: Supabase production
- ✅ Worker: Probing every 5 minutes
- ✅ Evaluator: Checking SLAs every hour

---

## 🎯 Task 3: Create Your First Real SLA Agreement

Now that you're live, add a real API to monitor:

1. **Log into your production dashboard**
2. **Add a provider** for a real API you use
   - Example: Your own API, a partner API, any public API
3. **Add an endpoint** to monitor
   - URL: https://api.example.com/health
   - Probe interval: 300 seconds (5 min)
4. **Create an agreement**
   - Uptime: 99.9%
   - P95 Latency: 500ms
   - Period: Weekly
5. **Wait 10 minutes** and refresh → probe data appears!

---

## 🆘 Troubleshooting

**Build fails on Render?**
- Check the build logs for specific errors
- Verify all env vars are set correctly
- Make sure `pnpm` is available (it should be by default)

**Frontend shows CORS errors?**
- Update CORS_ORIGIN in Render to exact Vercel URL
- No trailing slash!
- Wait 2 minutes for redeploy
- Hard refresh browser (Ctrl+Shift+R)

**Worker not running?**
- Check logs for errors
- Manually trigger it
- Verify Supabase credentials

**Login fails?**
- Check Supabase URL and anon key in Vercel
- Verify user exists in Supabase Auth
- Check browser console for errors

---

## 🎉 You Did It!

You've deployed a production-grade SLA monitoring platform with:
- Automated API probing
- Breach detection
- Email notifications
- Beautiful dashboard
- Real-time data

**Add this to your resume!** 🚀
