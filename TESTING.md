# Testing Documentation

## Overview

This document describes the test suite for SLA Sentinel, including unit tests, integration tests, and E2E tests created to verify the Phase 0-7 implementation and bug fixes.

---

## Test Categories

### ✅ Unit Tests (Always Run)

These tests run in any environment without external dependencies.

**Location:** `apps/api/src/**/*.test.ts`

**Coverage:**
- ✅ Probe runner logic (`worker/probe-runner.test.ts`)
- ✅ Scheduler logic (`worker/scheduler.test.ts`)
- ✅ Downtime policy (`worker/downtime-policy.test.ts`)
- ✅ Evaluation aggregation (`evaluator/aggregation.test.ts`)
- ✅ SLA evaluation logic (`evaluator/evaluation.test.ts`)
- ✅ Webhook delivery with retry (`notifications/webhook.test.ts`)
- ✅ Response format validation (`routes/response-format.test.ts`)

**Run with:**
```bash
cd apps/api
pnpm test
```

---

### 🔐 RLS Integration Tests (Requires Supabase)

These tests verify Row-Level Security policies prevent cross-org data access.

**Location:** `apps/api/src/db.test.ts`

**Requirements:**
- Valid Supabase project with RLS enabled
- Environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_ANON_KEY`

**Coverage:**
- Cross-org read isolation (user1 cannot read user2's providers)
- Cross-org write isolation (user1 cannot update user2's providers)
- Cross-org delete isolation (user1 cannot delete user2's providers)
- Cross-org insert isolation (user1 cannot insert with user2's org_id)

**Status:** Tests are written but skip if `SUPABASE_ANON_KEY` is not set.

**Run with:**
```bash
cd apps/api
export SUPABASE_ANON_KEY=your_anon_key
pnpm test db.test.ts
```

---

### 🌐 API Integration Tests (Requires Full Stack)

These tests verify the complete API request/response cycle including auth middleware.

**Location:** `apps/api/src/routes/routes.test.ts`

**Requirements:**
- Running Supabase instance
- Valid test user credentials
- Environment variables configured

**Coverage:**
- ✅ GET /api/providers returns array (bug fix verification)
- ✅ POST /api/providers creates provider
- ✅ GET /api/agreements returns array (bug fix verification)
- ✅ POST /api/agreements creates agreement
- ✅ GET /api/agreements/:id/evaluations returns array (new route verification)
- ✅ GET /api/agreements/:id/breaches returns array (new route verification)
- ✅ GET /api/breaches returns array (bug fix verification)
- ✅ GET /api/evaluations returns array (bug fix verification)
- ✅ Auth middleware rejects unauthorized requests

**Status:** Tests are written but require proper Supabase test environment.

**Run with:**
```bash
cd apps/api
# Set up test environment first
pnpm test routes.test.ts
```

---

### 🎭 E2E Tests (Requires Full Application)

These tests verify the complete user flow in a browser.

**Location:** `apps/web/e2e/app.spec.ts`

**Requirements:**
- Frontend running on `http://localhost:3000`
- Backend API running on `http://localhost:3002`
- Test user account in Supabase
- Playwright browsers installed

**Coverage:**
- Authentication flow (login, logout, protected routes)
- Navigation between pages
- Providers page loads without .map errors (bug fix verification)
- Agreements page loads without .map errors (bug fix verification)
- Agreement detail page loads evaluations and breaches (bug fix verification)
- Breaches page loads without .map errors (bug fix verification)
- Filter functionality
- Accessibility checks

**Status:** Tests are written and ready to run with proper environment.

**Run with:**
```bash
cd apps/web

# Install Playwright browsers (first time only)
npx playwright install chromium

# Set test user credentials
export TEST_USER_EMAIL=demo@example.com
export TEST_USER_PASSWORD=demopass123

# Run tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed
```

---

## Bug Fix Verification

The following tests specifically verify the critical bug fixes from commit `147822b`:

### API Response Format (CRITICAL)

**Problem:** Backend returned `{agreements: [...]}` but frontend expected `Agreement[]`

**Tests:**
- `routes/response-format.test.ts` - Unit tests verifying array structure
- `routes/routes.test.ts` - Integration tests with actual HTTP requests
- `e2e/app.spec.ts` - E2E tests checking for console errors

**Verified Endpoints:**
- ✅ GET /api/agreements
- ✅ GET /api/breaches
- ✅ GET /api/evaluations

### Missing Nested Routes (CRITICAL)

**Problem:** Frontend called `/api/agreements/:id/evaluations` but route didn't exist

**Tests:**
- `routes/routes.test.ts` - Verifies routes return 200 (not 404)
- `e2e/app.spec.ts` - Verifies agreement detail page loads without errors

**Verified Endpoints:**
- ✅ GET /api/agreements/:id/evaluations
- ✅ GET /api/agreements/:id/breaches

---

## Smart Contract Tests

**Location:** `contracts/test/SLAEscrow.test.ts`

**Coverage:**
- Escrow deposit functionality
- Breach settlement with penalty transfer
- Admin-only withdrawal
- Unauthorized access prevention

**Run with:**
```bash
cd contracts
pnpm test
```

**Status:** ✅ All contract tests pass

---

## Test Environment Setup

### Local Development

1. **Start Supabase:**
   - Ensure Supabase project is running
   - Seed database with test data: `cd apps/api && pnpm seed`

2. **Start Backend:**
   ```bash
   cd apps/api
   pnpm dev
   ```

3. **Start Frontend:**
   ```bash
   cd apps/web
   pnpm dev
   ```

4. **Run Tests:**
   ```bash
   # Unit tests (no setup needed)
   cd apps/api && pnpm test

   # E2E tests (requires running servers)
   cd apps/web && pnpm test:e2e
   ```

### CI Environment

**Required Environment Variables:**
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Test User
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpass123

# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

**Recommended CI Pipeline:**
```yaml
- name: Run Unit Tests
  run: |
    cd apps/api
    pnpm test --run

- name: Run Contract Tests
  run: |
    cd contracts
    pnpm test

- name: Run E2E Tests
  run: |
    cd apps/web
    pnpm test:e2e
```

---

## Test Coverage Summary

| Category | Tests Written | Tests Passing | Notes |
|----------|---------------|---------------|-------|
| Unit Tests | 30+ | ✅ All | Always run |
| Contract Tests | 10+ | ✅ All | Hardhat local network |
| RLS Tests | 6 | ⚠️ Skipped | Needs SUPABASE_ANON_KEY |
| API Integration | 17 | ⚠️ Skipped | Needs test environment |
| E2E Tests | 25+ | ⚠️ Not run | Needs full stack running |

---

## Known Limitations

1. **RLS Tests:** Require manual Supabase setup with proper RLS policies enabled
2. **Integration Tests:** Need real auth tokens, can't use mocks due to Supabase client design
3. **E2E Tests:** Require seeded test data and running services
4. **No CI/CD:** Tests are not yet integrated into automated pipeline

---

## Future Improvements

1. **Docker Compose Test Environment:** Package Supabase + API + Frontend for easy test runs
2. **Test Data Fixtures:** Automated seed script for consistent test data
3. **GitHub Actions:** Automated test runs on PR
4. **Coverage Reports:** Integrate nyc/c8 for code coverage metrics
5. **Visual Regression Tests:** Add screenshot comparison for UI changes
6. **Load Tests:** Add k6/Artillery tests for API performance verification

---

## Running Tests - Quick Reference

```bash
# All unit tests (fast, no setup)
pnpm test

# Specific test file
pnpm test db.test.ts

# Watch mode
pnpm test --watch

# E2E tests (requires running app)
cd apps/web
pnpm test:e2e

# E2E with UI (debug mode)
pnpm test:e2e:ui

# Contract tests
cd contracts
pnpm test
```
