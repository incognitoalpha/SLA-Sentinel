---
title: getSupabaseClient flow
process_id: process-49
steps: 2
---

# Process: getSupabaseClient flow

2 steps across 1 files. Entry: `apps\api\src\worker\scheduler.ts::getSupabaseClient` (score 1.50).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant f_apps\api\src\worker\scheduler_ts as apps\api\src\worker\scheduler.ts
  participant n_unresolved_createClient as unresolved::createClient

  Note over f_apps\api\src\worker\scheduler_ts: entry → getSupabaseClient
  f_apps\api\src\worker\scheduler_ts->>n_unresolved_createClient: createClient
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `getSupabaseClient` | `apps\api\src\worker\scheduler.ts` |
| 2 | 1 | `unresolved::createClient` | `` |

## Files Touched

- `apps\api\src\worker\scheduler.ts`

