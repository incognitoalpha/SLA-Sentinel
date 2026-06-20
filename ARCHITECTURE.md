# Architecture Decisions — SLA Sentinel

## Overview

This document records key architectural decisions and trade-offs made during the build. It complements the PRD by explaining *why* certain choices were made when alternatives existed.

---

## ADR-001: Monorepo with pnpm Workspaces

**Decision:** Use a monorepo structure with pnpm workspaces for apps/web, apps/api, and contracts.

**Rationale:**
- Shared TypeScript types and zod schemas between frontend and backend
- Single dependency installation and CI pipeline
- Simplifies local development (one repo to clone)
- pnpm is faster and more disk-efficient than npm/yarn

**Alternatives considered:**
- Separate repos per app: rejected due to type-sharing complexity and deploy coordination overhead

---

## ADR-002: Single Escrow Contract with Mapping

**Decision:** Deploy one `SLAEscrow.sol` contract with a `mapping(uint256 => Escrow)` keyed by agreement ID, rather than deploying a separate contract instance per agreement.

**Rationale:**
- Simpler deployment (one address to manage)
- Lower gas cost for org (no factory-pattern deploy costs per agreement)
- Adequate for v1 scope (demo/portfolio project, not production-scale multi-tenant)

**Alternatives considered:**
- Factory pattern deploying one contract per agreement: more isolated but higher complexity and gas cost

---

## ADR-003: Geist Design System + Single Success Color Extension

**Decision:** Implement the Vercel/Geist design system per `DESIGN-vercel.md`, with one project-specific color addition: `success: #17c964` for status indicators.

**Rationale:**
- Geist spec has no semantic "success" color (it's a marketing site palette)
- This project needs live-status dots and breach/no-breach badges
- Adding exactly one color maintains the spec's restraint while serving a clear functional need

**Why not more colors:**
- Scope creep risk: every "just one more" color breaks the design system's coherence
- The grey ladder + link blue + error red + warning amber already cover most UI states

---

## ADR-004: 2-Consecutive-Failures Downtime Policy

**Decision:** A probe window counts as downtime only if 2 consecutive probes fail, not on a single failure.

**Rationale:**
- Avoids false positives from transient network blips or a single packet loss
- Aligns with real-world SRE practices (most alerting systems require sustained failure before paging)

**Trade-off:**
- Slightly delays breach detection if a real outage starts exactly at probe N and probe N-1 succeeded
- Accepted: the improved false-positive rate outweighs the ~5min delay in detection

**Implementation note:**
- The probe worker must persist the "last probe state" per endpoint to implement this correctly

---

## ADR-005: Supabase for Database + Auth + Realtime

**Decision:** Use Supabase instead of a self-hosted Postgres + separate auth service.

**Rationale:**
- Supabase bundles Postgres + Auth + Row Level Security + Realtime subscriptions in one service
- Free tier sufficient for demo/portfolio use
- Realtime subscription enables live status dots on the dashboard without polling

**Alternatives considered:**
- Self-hosted Postgres + Auth0/Clerk: more flexible but higher operational complexity
- Firebase: ruled out due to preference for SQL and better Postgres ecosystem tooling

---

## Future Decisions (to be documented as they arise)

- Zero-probe window handling policy (Phase 3)
- Pagination strategy for evaluations and breaches (Phase 5)
- Email template design choices (Phase 6)

---

_This document is a living record. Add new ADRs as non-obvious decisions are made during implementation._
