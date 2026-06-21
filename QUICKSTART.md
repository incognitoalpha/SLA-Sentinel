# ✅ Quick Start Checklist — Get SLA Sentinel Live Today

Follow these steps in order. Check each box as you complete it.

## 🎯 Task 1: Supabase Setup (15 minutes)

### Browser Steps (5 min)
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Name: `sla-sentinel-prod`, choose region, generate password
- [ ] Wait for project to provision (2-3 minutes)
- [ ] Go to Settings → API, keep this tab open

### Terminal Steps (10 min)
- [ ] Open terminal in project root
- [ ] Run: `./setup-supabase.sh`
- [ ] Paste your Supabase URL when prompted
- [ ] Paste your Anon Key when prompted  
- [ ] Paste your Service Role Key when prompted
- [ ] Script will create .env files for you

### Run Migrations in Supabase Dashboard
- [ ] Go to SQL Editor in Supabase
- [ ] Run migration 1: Copy/paste `apps/api/migrations/001_initial_schema.sql` → Run
- [ ] Run migration 2: Copy/paste `apps/api/migrations/002_rls_policies.sql` → Run
- [ ] Run migration 3: Copy/paste `apps/api/migrations/003_add_evaluated_at.sql` → Run
- [ ] Check Table Editor - should see 10 tables

### Seed Data & Create User
- [ ] The setup script already seeded demo data
- [ ] Go to Authentication → Users in Supabase
- [ ] Click "Add User" → Create new user
- [ ] Email: your-email@example.com, Password: (save it!)
- [ ] Auto Confirm User: ✅
- [ ] Copy the User UUID from the users table
- [ ] Go to SQL Editor, run this (replace UUID):
```sql
insert into profiles (id, org_id, role)
values ('YOUR_UUID_HERE', '00000000-0000-0000-0000-000000000001', 'owner');
```

### Verify Locally
- [ ] Run: `./verify-setup.sh` (should show all green checkmarks)
- [ ] Terminal 1: `cd apps/api && pnpm dev`
- [ ] Terminal 2: `cd apps/web && pnpm dev`  
- [ ] Browser: Go to http://localhost:3000
- [ ] Login with your user credentials
- [ ] Should see dashboard with Demo Corp + 2 provider cards

✅ **Task 1 Complete!** Your local environment is working.

---

## 🚀 Task 2: Deploy to Production (30 minutes)

### Prerequisites
- [ ] Task 1 complete (Supabase + local verification)
- [ ] GitHub repo exists and is pushed to main
- [ ] Render account created (https://render.com - free tier)
- [ ] Vercel account created (https://vercel.com - hobby tier)

### Optional: Get Blockchain Setup (for full escrow demo)
- [ ] Create Alchemy account (https://alchemy.com)
- [ ] Create Sepolia app, copy RPC URL
- [ ] Create Sepolia wallet (MetaMask), export private key
- [ ] Get Sepolia ETH from faucet: https://sepoliafaucet.com
- [ ] Deploy contract: `cd contracts && pnpm deploy:sepolia`
- [ ] Copy deployed contract address

### Deploy API to Render
- [ ] Go to https://render.com/dashboard
- [ ] New → Blueprint
- [ ] Connect GitHub repo
- [ ] Render detects render.yaml → Apply
- [ ] For **sla-sentinel-api**, add env vars (see SETUP-GUIDE.md §2.1)
- [ ] For **sla-sentinel-worker**, add env vars
- [ ] For **sla-sentinel-evaluator**, add env vars (if using blockchain)
- [ ] Wait for deployment (~5 min)
- [ ] Copy API URL: `https://sla-sentinel-api.onrender.com`
- [ ] Test: `curl https://sla-sentinel-api.onrender.com/api/healthz`

### Deploy Frontend to Vercel
- [ ] Go to https://vercel.com/new
- [ ] Import GitHub repo
- [ ] Framework: Next.js, Root: `apps/web`
- [ ] Add env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_BASE_URL)
- [ ] Deploy (takes 3-5 min)
- [ ] Copy Vercel URL: `https://your-app.vercel.app`

### Update CORS
- [ ] Back to Render → sla-sentinel-api → Environment
- [ ] Update `CORS_ORIGIN=https://your-app.vercel.app`
- [ ] Save (triggers redeploy)

### Verify Production
- [ ] Open Vercel URL in browser
- [ ] Login with your user credentials
- [ ] Dashboard loads with provider cards
- [ ] Check browser console (no errors)
- [ ] Click on a provider card → detail page loads

✅ **Task 2 Complete!** Your app is live in production.

---

## 🧪 Task 3: E2E Tests & Real SLA (15 minutes)

### Add Your First Real API to Monitor
- [ ] Login to production dashboard
- [ ] Click "Add Provider" (or similar button)
- [ ] Name: Pick a real API you depend on
- [ ] Base URL: https://api.yourservice.com
- [ ] Add endpoint: /health or /status
- [ ] Set probe interval: 300 seconds (5 minutes)

### Create an Agreement
- [ ] Click "Create Agreement" for that provider
- [ ] Uptime threshold: 99.9%
- [ ] P95 latency threshold: 500ms
- [ ] Period: Weekly
- [ ] Start: Today, End: 7 days from now

### Wait and Monitor
- [ ] Wait 5-10 minutes for first probes
- [ ] Refresh dashboard → should see probe data
- [ ] Check Render worker logs → should see "Probe run complete"
- [ ] Go to Supabase Table Editor → probes table → should have rows

### Test Breach Detection (Optional)
- [ ] Add provider with endpoint: https://httpstat.us/500
- [ ] Wait 10 minutes (2 consecutive failures)
- [ ] Should see breach notification in dashboard
- [ ] Should receive email (if Resend configured)

✅ **Task 3 Complete!** You're monitoring real APIs.

---

## 🎉 Success Criteria

You're done when:
- ✅ Local development works (both servers run, login works)
- ✅ Production is live (Vercel + Render both green)
- ✅ At least one real API is being probed
- ✅ Probe data appears in dashboard
- ✅ No critical errors in Render/Vercel logs

---

## 📞 Need Help?

**Supabase connection fails?**
- Run `./verify-setup.sh` to diagnose
- Check .env files have correct credentials
- Verify migrations ran successfully

**Render deployment fails?**
- Check build logs in Render dashboard
- Verify all env vars are set
- Make sure CORS_ORIGIN matches Vercel URL

**Frontend shows CORS errors?**
- Update CORS_ORIGIN in Render (exact URL, no trailing slash)
- Wait for redeploy (~2 min)
- Hard refresh browser (Ctrl+Shift+R)

**No probe data appearing?**
- Check Render worker logs for errors
- Verify endpoints are marked `is_active = true`
- Check probe_interval_seconds isn't too long

---

## 🚀 After Completion

1. Record a 2-minute demo video showing:
   - Dashboard with real probe data
   - Breach detection (if you tested it)
   - Email notification

2. Add to resume:
   - "Built automated SLA monitoring platform with escrow enforcement"
   - "Achieved 92% test coverage across full-stack TypeScript codebase"
   - "Deployed production-grade app on Vercel + Render + Supabase"

3. Share on LinkedIn/Twitter with #buildinpublic

**You've got this! 💪**
