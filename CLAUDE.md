# CLAUDE.md — SLA Sentinel

## Project Context

This is **SLA Sentinel**, an automated third-party API SLA monitoring and testnet escrow enforcement platform. The single source of truth for this build is `PRD.md`.

## Architecture

**Monorepo structure:**
```
apps/web/       — Next.js 14 dashboard (Vercel deployment)
apps/api/       — Fastify API + worker + evaluator (Render deployment)
contracts/      — Hardhat + SLAEscrow.sol (Sepolia testnet)
```

**Package manager:** pnpm with workspaces

**Key technologies:**
- Frontend: Next.js 14 App Router, TypeScript, Tailwind (Geist design system)
- Backend: Fastify, TypeScript
- Database: Supabase (Postgres + Auth + RLS + Realtime)
- Smart contract: Solidity 0.8.24, deployed to Sepolia testnet
- Testing: Vitest (unit/integration), Hardhat + Chai (contract), Playwright (E2E)

## Working Agreement

1. **Work phase-by-phase** as defined in PRD.md §12. Do not skip ahead.
2. **Check off tasks** (`- [x]`) in PRD.md only after code is written AND tests pass.
3. **Commit at end of each phase**: `feat(phase-N): <summary> + tests`
4. **Design system**: Read `DESIGN-vercel.md` in full before writing any UI code. This is a hard requirement.
5. **No mainnet**: All blockchain work is Sepolia testnet only. UI must label this clearly.

## Running Locally

```bash
# Install dependencies
pnpm install

# Terminal 1 — API server
cd apps/api
pnpm dev

# Terminal 2 — Frontend
cd apps/web
pnpm dev

# Terminal 3 — Worker (Phase 2+)
cd apps/api
pnpm worker
```

## Testing

```bash
# All tests
pnpm test

# Specific workspace
pnpm --filter api test
pnpm --filter web test
pnpm --filter contracts test

# Contract tests
cd contracts
pnpm test
```

## Deployment Targets

- **Frontend**: Vercel (auto-deploy from main)
- **API**: Render Web Service
- **Worker/Evaluator**: Render Cron Jobs
- **Database**: Supabase (production project)
- **Smart contract**: Sepolia testnet (via Hardhat deploy script)

## Current Phase

**Phase 0** — Project Setup & Scaffolding (in progress)


Recommended Claude Skills

**Already available in this Claude Code environment (use these directly, no install needed):**
- `engineering:architecture` — for the ADR-style decisions in `ARCHITECTURE.md` (Phase 9, and as you go)
- `engineering:system-design` — useful when sketching the probe/evaluator/contract interaction in §5 if you want to stress-test the design further
- `engineering:testing-strategy` — for planning coverage depth per phase beyond what's listed in §12/§13
- `engineering:code-review` — run before merging each phase's PR
- `engineering:debug` — structured debugging if a probe/evaluation/contract interaction misbehaves
- `engineering:deploy-checklist` — use directly for Phase 8
- `engineering:documentation` — for `README.md` / `ARCHITECTURE.md` polish in Phase 9
- `frontend-design` — already referenced in §10; re-consult it if extending the dashboard beyond what `DESIGN-vercel.md` specifies (e.g. the breach timeline, which isn't a Vercel marketing-site pattern)
- A **supabase-postgres-best-practices** skill for Phase 1
- A **playwright-e2e-testing** skill for Phase 7/8
- A **smart-contract-vulnerabilities** skill to sanity-check `SLAEscrow.sol` before calling it "audited-style" in your README (don't claim a real audit if you only ran a checklist)
Refer to PRD.md §12 for the complete implementation plan and checklist.
