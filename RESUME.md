# Resume & Interview Talking Points

## Project Summary (Elevator Pitch)

**SLA Sentinel** is a full-stack production-ready platform for automated third-party API monitoring with blockchain-based escrow enforcement. Built as a portfolio project demonstrating end-to-end Web3 engineering: continuous monitoring, SLA breach detection, smart contract integration, and real-time dashboard.

---

## Resume Bullet Points

### Option 1: Technical Architecture Focus
> Built a full-stack SLA monitoring platform with automated blockchain-based escrow enforcement, architecting a distributed system using Next.js 14, Fastify, Supabase (Postgres + RLS), and Solidity smart contracts deployed to Sepolia testnet, demonstrating end-to-end Web3 engineering from probe workers to on-chain settlement.

### Option 2: Engineering Rigor Focus
> Designed and implemented an SLA breach detection pipeline requiring consecutive probe failures before flagging outages (avoiding false positives from transient network issues), with 96+ tests across unit/integration/E2E levels, comprehensive RLS policies for multi-tenant isolation, and production-ready deployment configurations for Vercel + Render.

### Option 3: Smart Contract Focus
> Developed an access-controlled Solidity escrow contract (oracle pattern with reentrancy guards) for automated SLA penalty settlement, deployed to Sepolia testnet with full Hardhat test coverage, Etherscan verification, and integration with ethers.js for programmatic breach-to-consequence workflows.

### Option 4: Product Impact Focus
> Created an automated SLA monitoring platform that continuously probes third-party APIs (uptime % and P95 latency), aggregates time-series data, evaluates breach conditions, and programmatically settles testnet escrow contracts—eliminating manual SLA enforcement with a tamper-evident, on-chain record of violations.

---

## Detailed Interview Talking Points

### 1. Architecture & Design Decisions

**Topic:** "Tell me about the system architecture"

**Response:**
- "I built SLA Sentinel as a distributed system with four main layers: Next.js frontend, Fastify REST API, Supabase for database/auth/realtime, and background workers for monitoring."
- "The key architectural decision was using **Row-Level Security (RLS)** in Postgres for multi-tenant isolation instead of application-level filtering—this meant even if I had a bug in my API code, users couldn't access each other's data because the database enforces isolation."
- "I chose a **monorepo with pnpm workspaces** so I could share TypeScript types between frontend and backend, ensuring type safety across the entire stack."
- "For the blockchain layer, I deployed a single Solidity contract with a mapping of agreement IDs to deposits, rather than a factory pattern deploying one contract per agreement—this reduced gas costs and simplified deployment while being adequate for the demo scope."

**Follow-up:** "What would you change for production?"
- "I'd migrate from cron jobs to a message queue like SQS for better job distribution, add Redis caching for dashboard metrics, and partition the probes table by month since it grows unbounded right now."

---

### 2. SLA Breach Detection Logic

**Topic:** "Walk me through how breach detection works"

**Response:**
- "The system has two stages: continuous probing and periodic evaluation."
- "**Probe workers** run every 5 minutes, making HTTP requests to monitored endpoints and recording success/failure + latency. I implemented a **2-consecutive-failures policy** before marking an endpoint as down—this avoids false positives from transient network blips, which is a real reliability engineering trade-off."
- "**Evaluation workers** run daily (or weekly/monthly depending on the agreement), aggregating all probes in that period to compute uptime % and P95 latency. The breach logic is simple: `if (computed_uptime < threshold || computed_p95 > threshold) → breach`."
- "Once a breach is detected, it triggers a notification pipeline: email via Resend, webhook with HMAC signatures and exponential backoff retry, and if an escrow contract is configured, it calls `settleBreach()` to transfer the penalty on-chain."

**Follow-up:** "Why P95 and not P99?"
- "P95 is the industry standard for SLA metrics—it captures the 'typical bad case' without being skewed by extreme outliers. P99 would be more sensitive to one-off spikes. For this project, P95 balances sensitivity and reliability."

---

### 3. Smart Contract Design

**Topic:** "Tell me about the smart contract"

**Response:**
- "I built `SLAEscrow.sol` using the oracle pattern—only a designated oracle address can trigger `settleBreach()`. This is a centralized trust assumption, but it's appropriate for the demo scope and avoids gas wars or race conditions."
- "Security-wise, I used the **Checks-Effects-Interactions pattern** to prevent reentrancy, added `onlyOracle` modifiers for access control, and wrote comprehensive tests covering happy paths, access control violations, and double-withdrawal attempts."
- "The contract uses a `mapping(bytes32 => Deposit)` keyed by agreement ID, allowing multiple agreements to share one deployed contract. Each deposit tracks the amount, depositor, and status."
- "Deployed to Sepolia testnet with Hardhat, verified on Etherscan so anyone can read the source code, and integrated with ethers.js v6 for programmatic interaction from the backend."

**Follow-up:** "What would you change for mainnet?"
- "Get a professional security audit (Trail of Bits or OpenZeppelin), implement a multi-sig for the oracle role instead of a single private key, add a dispute resolution mechanism with a 48-hour window before settlement, and implement an emergency pause function."

---

### 4. Multi-Tenant Isolation (Security)

**Topic:** "How did you handle multi-tenant security?"

**Response:**
- "I used Supabase's **Row-Level Security (RLS)** policies to enforce data isolation at the database level. Every table with `org_id` has a policy like: `USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()))`."
- "This means Postgres filters rows automatically based on the authenticated user's organization. Even if I had a SQL injection or forgot a WHERE clause in my API code, users still can't see other orgs' data."
- "I wrote cross-org isolation tests that create two users in different organizations and verify user1 cannot read, update, or delete user2's providers—these tests actually create real Supabase auth users and profiles to ensure the RLS policies work end-to-end."

**Follow-up:** "How does authentication work?"
- "Supabase Auth handles user signup/login and returns JWT tokens. The frontend includes the token in API requests via the Authorization header. My Fastify middleware validates the JWT, extracts the user ID, and queries the profiles table to get their org_id, which Supabase then uses for RLS filtering."

---

### 5. Testing Strategy

**Topic:** "Tell me about your testing approach"

**Response:**
- "I have 96+ tests across three levels: unit tests for business logic, integration tests for API/database interactions, and E2E tests for user flows."
- "**Unit tests** (Vitest) cover the evaluation engine (uptime/latency calculations), probe runner logic, and smart contract functions (Hardhat + Chai)."
- "**Integration tests** verify the API returns correct response formats—I actually found and fixed critical bugs where the API was returning wrapped objects like `{agreements: [...]}` instead of arrays, which crashed the frontend with `.map is not a function` errors."
- "**E2E tests** (Playwright) verify complete user flows: signup, create provider, create agreement, view dashboard. These tests also check for console errors to catch bugs like the .map crashes."
- "For the smart contract, I have tests covering access control (non-oracle cannot settle), payout correctness, and reentrancy protection."

**Follow-up:** "What would you add for production?"
- "Load testing with k6 to verify it can handle 10k+ concurrent probes, more comprehensive E2E scenarios covering error states, and automated visual regression tests for UI changes."

---

### 6. Challenges & Learning

**Topic:** "What was the hardest part of this project?"

**Response:**
- "The hardest part was debugging cross-stack issues where the frontend would make a request, the API would process it, but the response format didn't match what the frontend expected. I eventually added response format validation tests to catch these mismatches early."
- "Another challenge was the 2-consecutive-failures downtime policy—I had to persist the 'last probe state' per endpoint to implement this correctly, which required careful state management in the probe worker."
- "On the blockchain side, understanding gas optimization and reentrancy protection patterns was a learning curve. I spent time studying OpenZeppelin's contract patterns and running Slither static analysis."

**What I learned:**
- "How to architect a production-grade multi-tenant system with proper isolation"
- "Smart contract security patterns and testing strategies"
- "The importance of end-to-end type safety (monorepo with shared types prevented so many bugs)"
- "Real-world SRE practices like consecutive-failure policies and exponential backoff retries"

---

### 7. Production Readiness

**Topic:** "Is this production-ready?"

**Response:**
- "The architecture is production-ready, but there are scope limitations for the demo/portfolio context."
- "**Production-ready aspects:** Multi-tenant RLS, JWT auth, rate limiting, comprehensive tests, deployment configs for Vercel/Render, error handling, input validation."
- "**Demo scope limitations:** Deployed to Sepolia testnet (not mainnet), single-region monitoring, no advanced analytics, cron jobs instead of message queues."
- "I documented all of this in LIMITATIONS.md with a clear upgrade path—for example, migrating to mainnet would require a security audit, multi-sig oracle, and dispute resolution mechanism."
- "The code follows production patterns (separation of concerns, clean architecture, comprehensive logging), so it's more of a 'feature scope' limitation than a 'code quality' one."

**Follow-up:** "How long to make it production-ready?"
- "Assuming we have security audit budget and infrastructure budget, I'd estimate 3-6 months: 1 month for security hardening + audit, 1 month for scaling infrastructure (message queues, caching), 1 month for advanced features (multi-region, analytics), and remaining time for compliance/legal."

---

## Key Metrics to Highlight

- **96+ tests** across unit, integration, and E2E levels
- **10 architectural decisions** documented in ARCHITECTURE.md
- **4 deployment targets** (Vercel, Render, Supabase, Sepolia)
- **8 core tables** with RLS policies for multi-tenant isolation
- **2-consecutive-failures** downtime detection policy
- **P95 latency** as the SLA metric (industry standard)
- **Zero security vulnerabilities** (Slither static analysis, manual review)

---

## Technical Keywords for ATS

**Languages:** TypeScript, Solidity, SQL, JavaScript, Bash

**Frameworks:** Next.js 14 (App Router), React 18, Fastify, Hardhat, Ethers.js

**Databases:** PostgreSQL, Supabase (RLS, Realtime, Auth)

**Blockchain:** Ethereum, Solidity 0.8.24, Sepolia Testnet, Smart Contracts, Etherscan

**DevOps:** Vercel, Render, Git, GitHub, pnpm, Monorepo, Docker

**Testing:** Vitest, Playwright, Hardhat + Chai, E2E Testing, Integration Testing

**Design Patterns:** Oracle Pattern, Checks-Effects-Interactions, Multi-Tenant Architecture, Row-Level Security, Microservices

**Tools:** Tailwind CSS, Geist Design System, Zod (validation), Resend (email), Webhooks

---

## Questions to Ask Interviewer

1. "How does your team handle multi-tenant data isolation in production?"
2. "What's your approach to smart contract security audits?"
3. "Do you use any specific patterns for blockchain oracle design?"
4. "How do you balance feature velocity with production reliability?"
5. "What's the most interesting scaling challenge your platform has faced?"

---

*These talking points are designed for technical interviews (L3-L5 software engineer) at Web3 startups, SaaS companies, or fintech firms.*
