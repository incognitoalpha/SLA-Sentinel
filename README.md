# SLA Sentinel

**Automated Third-Party API SLA Monitoring & Testnet Escrow Enforcement Platform**

A portfolio/resume project demonstrating end-to-end full-stack and Web3 engineering: continuous API monitoring, SLA breach detection, smart contract escrow enforcement, and real-time dashboard updates.

---

## Problem

Companies integrate dozens of third-party APIs (payment gateways, KYC providers, SMS/email services) with contractually promised uptime % and latency ceilings. In practice:
- Nobody continuously measures the *actual* uptime/latency delivered
- SLA credits/penalties are negotiated on paper but enforced manually, slowly, inconsistently
- There's no neutral, tamper-evident record of "the vendor was down on this date for this long"

**SLA Sentinel** automates the measurement, the breach decision, and — for the demo scope — a programmatic, on-chain enforcement of the financial consequence.

---

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ Next.js (Vercel)│◀────────│ Supabase         │────────▶│ Fastify (Render) │
│ Dashboard       │  REST   │ Postgres + Auth  │  read   │ API + Workers    │
└─────────────────┘         └──────────────────┘         └────────┬─────────┘
                                     ▲                             │
                                     │ write                       │ ethers.js
                            ┌────────┴────────┐                    ▼
                            │ Render: Workers │         ┌──────────────────┐
                            │ Probe + Evaluate│         │ Sepolia Testnet  │
                            └─────────────────┘         │ SLAEscrow.sol    │
                                                        └──────────────────┘
```

**Tech stack:**
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind (Geist design system)
- Backend: Fastify + TypeScript
- Database: Supabase (Postgres + Auth + RLS + Realtime)
- Smart contract: Solidity + Hardhat, deployed to Sepolia testnet
- Testing: Vitest, Hardhat + Chai, Playwright

---

## Features (planned)

- ✅ Continuous endpoint probing with configurable intervals
- ✅ Uptime % and p95 latency aggregation per period (daily/weekly/monthly)
- ✅ SLA breach detection with 2-consecutive-failures policy (avoid false positives)
- ✅ Smart contract escrow: releases funds to provider on success, refunds payer on breach
- ✅ Email + webhook notifications on breach
- ✅ Real-time dashboard with live status dots (Supabase Realtime)
- ✅ Row-level security scoping all data by organization

---

## Local Setup

**Prerequisites:**
- Node.js 18+
- pnpm 8+
- Supabase account (free tier)
- Sepolia testnet wallet with test ETH ([Sepolia faucet](https://sepoliafaucet.com/))

**1. Install dependencies:**
```bash
pnpm install
```

**2. Configure environment:**
```bash
# Copy example env files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp contracts/.env.example contracts/.env

# Fill in your Supabase URL, keys, RPC URL, etc.
```

**3. Run migrations:**
```bash
# Apply Supabase migrations (Phase 1+)
cd apps/api
pnpm db:migrate
```

**4. Deploy smart contract (Phase 4+):**
```bash
cd contracts
pnpm deploy:sepolia
# Record the deployed address in apps/api/.env as SLA_ESCROW_CONTRACT_ADDRESS
```

**5. Start dev servers:**
```bash
# Terminal 1 — API
cd apps/api && pnpm dev

# Terminal 2 — Frontend
cd apps/web && pnpm dev

# Terminal 3 — Worker (Phase 2+)
cd apps/api && pnpm worker
```

**6. Open:** http://localhost:3000

---

## Testing

```bash
# All tests
pnpm test

# Specific workspace
pnpm --filter api test
pnpm --filter web test
pnpm --filter contracts test

# Contract tests
cd contracts && pnpm test
```

---

## Deployment

- **Frontend**: Vercel (auto-deploy from `main`)
- **API**: Render Web Service
- **Workers**: Render Cron Jobs (probe worker every 5min, evaluator daily)
- **Database**: Supabase production project
- **Smart contract**: Sepolia testnet (one-time Hardhat deploy)

See `PRD.md` §16 for the full deployment checklist.

---

## Project Status

**Current phase:** Phase 0 — Project Setup & Scaffolding ✅

See `PRD.md` §12 for the complete implementation plan.

---

## Documentation

- `PRD.md` — Full product requirements and implementation plan
- `DESIGN-vercel.md` — Frontend design system specification
- `ARCHITECTURE.md` — Key architectural decisions and trade-offs
- `CLAUDE.md` — Agent working agreement and project context

---

## License

MIT (portfolio/demo project)

---

## Demo Recording

_[Link to recorded demo will go here after Phase 9]_

3-minute walkthrough: simulate a failing endpoint → breach detected → email sent → escrow withdrawal blocked, visible on Sepolia Etherscan.
