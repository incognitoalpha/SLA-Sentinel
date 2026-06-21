# 🚀 Production Deployment Checklist — SLA Sentinel

Your local environment is ready. Let's get this live in production!

## Pre-Deployment Checklist

- [x] Supabase project configured
- [x] Local API server working
- [x] Local web app working
- [ ] GitHub repo pushed to main
- [ ] Render account created
- [ ] Vercel account created

---

## Step 1: Push to GitHub (5 min)

If you haven't already pushed to GitHub:

```bash
# Check current status
git status

# Add new files
git add .

# Commit
git commit -m "feat: add deployment guides and setup scripts"

# Push to GitHub
git push origin main
```

**Verify:** Your repository should be visible at github.com/yourusername/your-repo

---

## Step 2: Deploy Backend to Render (15 min)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (free tier)
3. Authorize Render to access your repositories

### 2.2 Deploy Using Blueprint

1. In Render Dashboard, click **New** → **Blueprint**
2. Select your repository
3. Render will detect `render.yaml` and show 3 services:
   - `sla-sentinel-api` (Web Service)
   - `sla-sentinel-worker` (Cron Job)
   - `sla-sentinel-evaluator` (Cron Job)

### 2.3 Configure Environment Variables

Click **Apply**, then for each service add these env vars:

#### For `sla-sentinel-api`:

```bash
SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
RESEND_API_KEY=re_placeholder
WEBHOOK_SIGNING_SECRET=your-webhook-secret-min-32-chars-long
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production
PORT=3002
```

**Note:** We'll update `CORS_ORIGIN` after Vercel deployment

#### For `sla-sentinel-worker`:

```bash
SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
NODE_ENV=production
```

#### For `sla-sentinel-evaluator` (optional for now):

```bash
SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
NODE_ENV=production
```

### 2.4 Wait for Deployment

- Watch the build logs
- Wait for "Build successful" and "Live" status (5-10 minutes)
- Copy your API URL from the service page

**Example:** `https://sla-sentinel-api-abcd.onrender.com`

### 2.5 Test Your API

```bash
curl https://YOUR-API-URL.onrender.com/api/healthz
```

**Expected:** `{"status":"ok","timestamp":"..."}`

✅ **Backend deployed!**

---

## Step 3: Deploy Frontend to Vercel (10 min)

### 3.1 Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub (hobby tier is free)
3. Authorize Vercel

### 3.2 Import Your Project

1. Click **Add New...** → **Project**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/web`
   - **Build Command:** `pnpm build`
   - **Install Command:** `pnpm install`

### 3.3 Add Environment Variables

Click **Environment Variables**, add these:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDY3MTQsImV4cCI6MjA5NzUyMjcxNH0.xyz...
NEXT_PUBLIC_API_BASE_URL=https://YOUR-RENDER-API-URL.onrender.com
```

**Important:** Replace `YOUR-RENDER-API-URL` with your actual Render URL from Step 2.4

**Note:** You'll need the ANON key (not service role). Get it from:
- Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

### 3.4 Deploy

1. Click **Deploy**
2. Wait 3-5 minutes
3. Copy your Vercel URL

**Example:** `https://sla-sentinel-abc123.vercel.app`

✅ **Frontend deployed!**

---

## Step 4: Update CORS Configuration (2 min)

Now that you have your Vercel URL, update the API's CORS setting:

1. Go back to **Render Dashboard**
2. Click on `sla-sentinel-api` service
3. Go to **Environment** tab
4. Find `CORS_ORIGIN` and update it:
   ```
   CORS_ORIGIN=https://your-actual-vercel-url.vercel.app
   ```
5. Click **Save Changes**
6. Wait for automatic redeploy (~2 min)

---

## Step 5: Verify Production Deployment (5 min)

### Test the API
```bash
curl https://YOUR-RENDER-URL.onrender.com/api/healthz
```
Expected: `{"status":"ok",...}`

### Test the Frontend

1. Open your Vercel URL in a browser
2. You should see the login page
3. Log in with your Supabase user credentials
4. You should see:
   - ✅ Dashboard loads
   - ✅ "Demo Corp" in the nav
   - ✅ Provider cards (Stripe API, SendGrid API)
   - ✅ No console errors

### Check Worker is Running

1. Go to Render → `sla-sentinel-worker` → Logs
2. Wait 5 minutes (cron schedule)
3. You should see: "Starting probe run..." and "Probe run complete"

**If you don't want to wait:** Manually trigger the cron job in Render dashboard

### Verify Probes Are Being Recorded

1. Go to your Vercel app
2. Click on a provider card
3. You should see probe data appearing in the table
4. Or check Supabase Table Editor → `probes` table

---

## ✅ Task 2 Complete!

Your production stack is live:
- ✅ API on Render
- ✅ Worker probing every 5 minutes
- ✅ Frontend on Vercel
- ✅ Connected to Supabase production DB

**Your URLs:**
- Frontend: https://your-app.vercel.app
- API: https://your-api.onrender.com

---

## 🎯 Ready for Task 3: Create Your First Real SLA

See QUICKSTART.md Task 3 for adding your first real API to monitor!
