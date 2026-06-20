# Architecture Documentation — SLA Sentinel

## Overview

SLA Sentinel is a distributed system for automated third-party API SLA monitoring with blockchain-based escrow enforcement. This document describes the system architecture, key design decisions, trade-offs, and rationale.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Model](#data-model)
3. [Core Components](#core-components)
4. [Architectural Decisions (ADRs)](#architectural-decisions-adrs)
5. [Security Model](#security-model)
6. [Scalability Considerations](#scalability-considerations)
7. [Trade-offs & Future Improvements](#trade-offs--future-improvements)

---

## System Architecture

### High-Level Overview

```
┌───────────────────────────────────────────────────────────────┐
│                         USER LAYER                             │
│  Next.js 14 (React) - Dashboard, Forms, Real-time Updates     │
└─────────────────────────┬─────────────────────────────────────┘
                          │ HTTPS + JWT Auth
                          ▼
┌───────────────────────────────────────────────────────────────┐
│                       API LAYER (Fastify)                      │
│  • REST endpoints (CRUD)                                       │
│  • Auth middleware (JWT validation)                            │
│  • Rate limiting                                               │
└─────────┬───────────────────────────────────────┬─────────────┘
          │                                       │
          ▼                                       ▼
┌─────────────────────┐              ┌──────────────────────────┐
│   DATABASE LAYER    │              │    WORKER LAYER          │
│   (Supabase)        │              │  • Probe Runner (5min)   │
│                     │              │  • SLA Evaluator (daily) │
│ • Postgres DB       │◀─────────────│  • Breach Handler        │
│ • Row-Level Security│              └────────┬─────────────────┘
│ • Realtime (WS)     │                       │
│ • Auth (JWT)        │                       │
└─────────────────────┘                       ▼
                                    ┌──────────────────────────┐
                                    │  NOTIFICATION LAYER      │
                                    │  • Email (Resend)        │
                                    │  • Webhooks (HTTP)       │
                                    └──────────────────────────┘
                                                │
                                                ▼
                                    ┌──────────────────────────┐
                                    │  BLOCKCHAIN LAYER        │
                                    │  Sepolia Testnet         │
                                    │  • SLAEscrow.sol         │
                                    │  • Ethers.js integration │
                                    └──────────────────────────┘
```

### Data Flow: Complete SLA Monitoring Cycle

```
1. Configuration Phase:
   User → Dashboard → API → DB
   • Create provider
   • Create agreement with SLA thresholds
   • (Optional) Deploy escrow contract

2. Monitoring Phase (continuous, every 5min):
   Worker → Third-party API → Record probe result → DB
   • HTTP request to monitored endpoint
   • Record: status, latency, timestamp
   • 2-consecutive-failures detection for downtime

3. Evaluation Phase (daily/weekly/monthly):
   Evaluator → DB → Aggregate probes → Compute metrics
   • Calculate uptime %
   • Calculate P95 latency
   • Compare against SLA thresholds

4. Breach Detection & Notification:
   Evaluator → Detect breach → Create breach record → Notifications
   • Insert breach record
   • Send email notification (Resend)
   • Deliver webhook (exponential backoff retry)
   • Trigger escrow settlement (if configured)

5. Escrow Settlement (on breach):
   Worker → Blockchain → SLAEscrow.settleBreach() → Transfer funds
   • Call smart contract method via ethers.js
   • Transfer penalty to beneficiary
   • Record transaction hash in breach record
```

---

## Data Model

### Entity-Relationship Diagram

```
organizations (1) ──┬── (N) profiles
                    ├── (N) providers ──── (N) endpoints ──── (N) probes
                    └── (N) agreements ──── (N) evaluations ──── (N) breaches
```

### Core Tables

**organizations** - Multi-tenant isolation root
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**profiles** - User-to-organization mapping
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**providers** - Third-party APIs to monitor
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id), -- RLS key
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**endpoints** - Specific URLs to probe
```sql
CREATE TABLE endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id),
  url TEXT NOT NULL,
  method TEXT DEFAULT 'GET',
  expected_status INTEGER DEFAULT 200,
  timeout_ms INTEGER DEFAULT 5000,
  probe_interval_seconds INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**probes** - Individual monitoring results (time-series data)
```sql
CREATE TABLE probes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint_id UUID REFERENCES endpoints(id),
  probed_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  error_message TEXT
);

CREATE INDEX idx_probes_endpoint_time ON probes(endpoint_id, probed_at DESC);
```

**agreements** - SLA contracts
```sql
CREATE TABLE agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id), -- RLS key
  provider_id UUID REFERENCES providers(id),
  name TEXT NOT NULL,
  sla_uptime_pct DECIMAL(5,2) NOT NULL,
  sla_latency_p95_ms INTEGER NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  penalty_amount_wei TEXT DEFAULT '0',
  escrow_contract_address TEXT,
  escrow_chain TEXT DEFAULT 'sepolia',
  deposit_tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'breached', 'settled', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**evaluations** - Periodic SLA computations
```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id UUID REFERENCES agreements(id),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  computed_uptime_pct DECIMAL(5,2) NOT NULL,
  computed_p95_latency_ms INTEGER NOT NULL,
  breached BOOLEAN NOT NULL,
  sample_size INTEGER NOT NULL,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**breaches** - SLA violations
```sql
CREATE TABLE breaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID REFERENCES evaluations(id),
  agreement_id UUID REFERENCES agreements(id),
  reason TEXT NOT NULL,
  on_chain_tx_hash TEXT,
  notified_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Core Components

### 1. Probe Runner (Worker)

**File:** `apps/api/src/worker/probe-runner.ts`

**Purpose:** Continuously monitor third-party API endpoints

**Scheduling:** Render Cron Job every 5 minutes

**Algorithm:**
```typescript
async function runProbesCycle() {
  const endpoints = await db.from('endpoints')
    .select('*, providers!inner(org_id)')
    .eq('is_active', true)

  for (const endpoint of endpoints) {
    const startTime = Date.now()
    
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        timeout: endpoint.timeout_ms
      })
      
      const latency = Date.now() - startTime
      
      await db.from('probes').insert({
        endpoint_id: endpoint.id,
        success: response.status === endpoint.expected_status,
        status_code: response.status,
        latency_ms: latency
      })
    } catch (error) {
      await db.from('probes').insert({
        endpoint_id: endpoint.id,
        success: false,
        error_message: error.message
      })
    }
  }
}
```

**Key Feature:** 2-consecutive-failures downtime policy (see ADR-004)

---

### 2. SLA Evaluator (Worker)

**File:** `apps/api/src/evaluator/evaluation.ts`

**Purpose:** Aggregate probe data and detect SLA breaches

**Scheduling:** Render Cron Job daily at midnight (configurable)

**Metrics Computed:**
1. **Uptime %** = (successful_probes / total_probes) × 100
2. **P95 Latency** = 95th percentile of latency_ms values

**Breach Detection Logic:**
```typescript
const breached = 
  computed_uptime_pct < agreement.sla_uptime_pct ||
  computed_p95_latency_ms > agreement.sla_latency_p95_ms
```

---

### 3. Breach Handler

**File:** `apps/api/src/evaluator/breach-handler.ts`

**Purpose:** Execute breach response workflow

**Steps:**
1. Insert breach record
2. Send email notification (Resend API)
3. Deliver webhook (HMAC-signed, exponential backoff)
4. Settle escrow (if `escrow_contract_address` exists)
5. Record `on_chain_tx_hash`

---

### 4. Smart Contract (SLAEscrow.sol)

**File:** `contracts/contracts/SLAEscrow.sol`

**Key Functions:**
```solidity
function deposit(bytes32 agreementId) external payable;
function settleBreach(bytes32 agreementId, address beneficiary) external onlyOracle;
function withdraw(bytes32 agreementId) external;
```

**Security:**
- Oracle-only settlement (prevents unauthorized transfers)
- Checks-Effects-Interactions pattern (prevents re-entrancy)
- Single deposit per agreement (simplifies state)

---

## Architectural Decisions (ADRs)

### ADR-001: Monorepo with pnpm Workspaces

**Decision:** Use monorepo structure for apps/web, apps/api, contracts

**Rationale:**
- Shared TypeScript types between frontend and backend
- Single dependency installation (`pnpm install`)
- Atomic commits for related changes
- pnpm faster and more disk-efficient than npm/yarn

**Alternatives:**
- Separate repos → Rejected due to type-sharing complexity

---

### ADR-002: Single Escrow Contract with Mapping

**Decision:** Deploy one `SLAEscrow.sol` contract with `mapping(bytes32 => Deposit)`

**Rationale:**
- Simpler deployment (one address)
- Lower gas cost (no factory pattern)
- Adequate for demo/portfolio scope

**Alternatives:**
- Factory pattern (one contract per agreement) → Higher complexity/cost

---

### ADR-003: Geist Design System + Success Color

**Decision:** Implement Vercel/Geist design system with ONE extension: `success: #17c964`

**Rationale:**
- Geist has no semantic "success" color
- Need for live status dots and pass/fail indicators
- Minimal extension maintains design coherence

**Why not more colors:**
- Every additional color breaks the system's restraint

---

### ADR-004: 2-Consecutive-Failures Downtime Policy

**Decision:** Endpoint marked down only after 2+ consecutive failures

**Rationale:**
- Prevents false positives from transient network issues
- Aligns with real-world SRE practices

**Trade-off:**
- ~5min delay in breach detection vs improved accuracy

---

### ADR-005: Supabase for Database + Auth + Realtime

**Decision:** Use Supabase instead of self-hosted Postgres

**Rationale:**
- Bundles Postgres + Auth + RLS + Realtime in one service
- Free tier sufficient for demo
- Realtime enables live dashboard without polling

**Alternatives:**
- Self-hosted Postgres + Auth0 → More complex
- Firebase → Preference for SQL

---

### ADR-006: Sepolia Testnet (Not Mainnet)

**Decision:** Deploy smart contract to Sepolia, not Ethereum mainnet

**Rationale:**
- Portfolio/demo scope (no real funds)
- Fast iteration (no gas costs)
- Code is mainnet-ready (just change network config)

**Trade-offs:**
- (+) Risk-free development
- (-) Not "production" (testnet only)

---

### ADR-007: REST API (Not GraphQL)

**Decision:** Use REST API with Fastify, not GraphQL

**Rationale:**
- Simple CRUD operations don't need GraphQL flexibility
- Faster development (no schema definition)
- Supabase has great REST integration

**When to reconsider:**
- Complex nested queries
- Mobile app with bandwidth constraints

---

### ADR-008: Render Cron Jobs (Not Message Queues)

**Decision:** Use Render Cron Jobs for workers, not RabbitMQ/SQS

**Rationale:**
- Simpler infrastructure (no queue management)
- Free tier includes cron jobs
- Probes are idempotent (safe to run periodically)

**When to upgrade:**
- 10k+ endpoints (need job queues)
- Variable probe intervals
- Complex retry logic

---

### ADR-009: Next.js App Router (Not Pages Router)

**Decision:** Use Next.js 14 App Router

**Rationale:**
- Modern approach (future of Next.js)
- Better performance with Server Components
- Cleaner layout composition

**Trade-offs:**
- (+) Better performance
- (-) Newer API (less documentation)

---

### ADR-010: Probe Storage in Postgres (Not Time-Series DB)

**Decision:** Store probes as Postgres rows, not TimescaleDB/InfluxDB

**Rationale:**
- Single database (no additional infrastructure)
- Flexible querying
- Sufficient for demo scale (~1M probes)

**Future optimization:**
- Partition probes table by month
- Migrate to TimescaleDB for 10M+ probes

---

## Security Model

### Multi-Tenant Isolation (Row-Level Security)

**Enforcement:** Postgres RLS policies on all org-scoped tables

**Example Policy:**
```sql
CREATE POLICY "providers_org_isolation" ON providers
  USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));
```

**Why RLS?**
- Enforced at database level (can't bypass via API bug)
- Automatic filtering on all queries
- Works with Supabase auth

**Testing:** Cross-org isolation tests in `apps/api/src/db.test.ts`

---

### Authentication Flow

```
1. User signs up/logs in → Supabase Auth
2. Supabase returns JWT token
3. Frontend stores token, includes in API requests
4. API middleware validates JWT → extracts user_id
5. Database queries filtered by org_id via RLS
```

---

### Smart Contract Security

**Measures:**
- Oracle-only settlement (`onlyOracle` modifier)
- No re-entrancy (CEI pattern)
- Single deposit per agreement
- Admin withdrawal restrictions

**Not Included (testnet demo):**
- Formal security audit
- Timelock for admin functions
- Pause mechanism

**For Production:**
- Professional audit (Trail of Bits, OpenZeppelin)
- Multi-sig oracle
- Emergency pause function

---

## Scalability Considerations

### Current Limits

| Component | Limit | Bottleneck |
|-----------|-------|------------|
| Endpoints | ~1,000 | Worker cycle time (5min) |
| Probes/day | ~300k | Postgres write throughput |
| Organizations | ~10,000 | Supabase free tier |
| Concurrent users | ~100 | Vercel serverless limits |

### Scaling Paths

**Horizontal Scaling (10k+ endpoints):**
1. Multiple worker instances
2. Partition endpoints by hash
3. Message queue (SQS) for coordination

**Database Optimization:**
1. Index: `probes(endpoint_id, probed_at DESC)`
2. Partition probes table by month
3. Materialized views for aggregations

**Caching Layer:**
1. Redis for dashboard metrics
2. CDN for static assets
3. Edge functions for API

**Time-Series Migration:**
1. Move probes to TimescaleDB
2. Keep agreements/evaluations in Postgres
3. Hybrid architecture

---

## Trade-offs & Future Improvements

### Architecture Trade-offs

**Chosen: Serverless + Cron Jobs**
- (+) Simple deployment
- (+) Pay-per-use pricing
- (-) Limited long-running tasks

**Alternative: Kubernetes**
- (+) Full control
- (-) Complex setup

---

### Smart Contract Trade-offs

**Chosen: Oracle-Based Escrow**
- (+) Automated settlement
- (+) Tamper-evident
- (-) Oracle trust assumption

**Alternative: Multisig**
- (+) No oracle needed
- (-) Manual settlement

---

### Future Improvements

1. **Multi-Chain Support** - Polygon, Optimism for lower gas
2. **GraphQL API** - For complex nested queries
3. **Advanced Analytics** - Trend analysis, provider rankings
4. **PagerDuty Integration** - SMS/phone call alerts
5. **Audit Logging** - Immutable compliance trail
6. **API Versioning** - /v1, /v2 for backward compatibility

---

## Conclusion

SLA Sentinel's architecture balances:
- **Simplicity:** Minimal infrastructure (3 services: Supabase, Vercel, Render)
- **Security:** RLS for isolation, oracle-controlled escrow
- **Scalability:** Clear path from 100 endpoints to 10k+
- **Modern Stack:** Next.js 14, TypeScript, Solidity 0.8.24

The design prioritizes **rapid iteration** for portfolio scope while maintaining **production-readiness** for real-world deployment.

---

_This document is a living record. Update as new architectural decisions are made._
