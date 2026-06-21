# 🎯 FINAL CHECKLIST — Deploy in 3 Steps

## Current Status: 100% Ready ✅

All preparation complete. You're about to deploy to production.

---

## ⚡ Quick Deploy (30 min total)

### Prerequisites Check
- [x] Local Supabase working
- [x] API running on localhost:3002
- [x] Code pushed to GitHub
- [x] CI fixed (pnpm v10)
- [x] Deployment guides created

### Your Repository
**GitHub:** https://github.com/incognitoalpha/SLA-Sentinel
**Latest Commit:** CI fix + deployment guides
**Status:** Check CI at: https://github.com/incognitoalpha/SLA-Sentinel/actions

---

## 🚀 3-Step Deployment

### STEP 1: Deploy Backend (15 min)

1. **Go to:** https://render.com/signup
2. **Sign up** with GitHub (free tier)
3. **New** → **Blueprint** → Select `incognitoalpha/SLA-Sentinel`
4. **Click Apply** (Render detects render.yaml)
5. **Add environment variables** for each service:

**Copy-paste these for all 3 services:**

**Service: sla-sentinel-api**
```
SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
RESEND_API_KEY=re_placeholder
WEBHOOK_SIGNING_SECRET=random-32-character-secret-key-placeholder
CORS_ORIGIN=http://localhost:3000
```

**Service: sla-sentinel-worker**
```
SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
```

**Service: sla-sentinel-evaluator**
```
SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeHd0a3Nra2p1dnp6eWJveGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NjcxNCwiZXhwIjoyMDk3NTIyNzE0fQ.RufecoZulxCrDNhihoHKQbohVIhp4jZe8Aj93B6CVTE
```

6. **Wait** for deployment (5-10 min)
7. **Copy** your API URL (example: `https://sla-sentinel-api-abcd.onrender.com`)
8. **Test:** Open terminal, run:
   ```bash
   curl https://YOUR-RENDER-URL.onrender.com/api/healthz
   ```
   Expected: `{"status":"ok","timestamp":"..."}`

✅ **Backend deployed!**

---

### STEP 2: Deploy Frontend (10 min)

1. **Get your Supabase Anon Key first:**
   - Go to: https://supabase.com/dashboard
   - Select project: `ohxwtkskkjuvzzyboxaa`
   - Settings → API → Copy the `anon` `public` key

2. **Go to:** https://vercel.com/signup
3. **Sign up** with GitHub (hobby tier free)
4. **Add New...** → **Project**
5. **Import** `incognitoalpha/SLA-Sentinel`
6. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `apps/web`
   - Build Command: (leave default)
   - Install Command: `pnpm install`

7. **Add Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://ohxwtkskkjuvzzyboxaa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[paste your anon key from step 1]
NEXT_PUBLIC_API_BASE_URL=[paste your Render URL from Step 1.7]
```

8. **Deploy** (3-5 min)
9. **Copy** your Vercel URL (example: `https://sla-sentinel-abc123.vercel.app`)

✅ **Frontend deployed!**

---

### STEP 3: Connect Them (2 min)

1. **Back to Render:** Dashboard → `sla-sentinel-api` → Environment
2. **Update** `CORS_ORIGIN` from `http://localhost:3000` to your Vercel URL:
   ```
   CORS_ORIGIN=https://your-actual-vercel-url.vercel.app
   ```
3. **Save** (triggers auto-redeploy, wait ~2 min)

✅ **Production ready!**

---

## ✅ Verify It Works

### Test 1: Open your Vercel URL
- Should see login page
- No console errors

### Test 2: Login
- Use your Supabase user credentials
- Should redirect to dashboard
- Should see "Demo Corp" in nav
- Should see 2 provider cards

### Test 3: Check Worker
- Render → sla-sentinel-worker → Logs
- Wait 5 minutes OR manually trigger
- Should see "Starting probe run..."

### Test 4: Check Probes
- Click a provider card in dashboard
- Should see probe data table (may be empty initially)
- OR check Supabase Table Editor → `probes` table

---

## 🎉 When You're Done

You'll have:
- ✅ Production API on Render (health endpoint working)
- ✅ Worker probing every 5 minutes
- ✅ Beautiful dashboard on Vercel
- ✅ Everything connected to Supabase production DB
- ✅ A portfolio-ready SLA monitoring platform

**Share your win:**
- Tweet your live URL
- Add to LinkedIn
- Update resume with this project

---

## 💡 Important Notes

**Render Free Tier:**
- Services sleep after 15 min inactivity
- First request after sleep takes ~30 seconds
- This is normal for free tier

**If CORS errors appear:**
- Make sure CORS_ORIGIN exactly matches Vercel URL
- No trailing slash
- Wait 2 min after updating for redeploy
- Hard refresh browser (Ctrl+Shift+R)

**Getting Anon Key:**
- Different from Service Role Key!
- Supabase → Settings → API → `anon` `public` (not `service_role`)

---

## 📚 Full Documentation Available

If you need more details at any step:
- **DEPLOY-STEP-BY-STEP.md** — Detailed walkthrough
- **READY-TO-DEPLOY.md** — This file with extended help
- **DEPLOYMENT.md** — Comprehensive deployment guide
- **QUICKSTART.md** — Checkbox-style checklist

---

## 🚀 Ready to Start?

**Right now, do this:**

1. Open https://render.com/signup in your browser
2. Sign up with GitHub
3. Follow Step 1 above

**Time commitment:** 30 minutes
**Result:** Live production app

---

**Questions before you start?** Ask me anything!

**Ready to deploy?** Start with Step 1 → Render signup.
