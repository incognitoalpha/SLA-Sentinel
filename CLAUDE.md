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

Refer to PRD.md §12 for the complete implementation plan and checklist.
