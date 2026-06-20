---
title: getActiveEndpoints flow
process_id: process-41
steps: 7
---

# Process: getActiveEndpoints flow

7 steps across 2 files. Entry: `apps\api\src\worker\scheduler.ts::getActiveEndpoints` (score 2.44).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\worker_·_probeEndpoint as apps\api\src\worker · probeEndpoint
  participant n_unresolved_createClient as unresolved::createClient
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___eq as unresolved::*.eq
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src\worker_·_probeEndpoint: entry → getActiveEndpoints
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_probeEndpoint: getSupabaseClient
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_createClient: createClient
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_array_static_from: from
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___select: *.select
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___eq: *.eq
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `getActiveEndpoints` | `apps\api\src\worker\scheduler.ts` |
| 2 | 1 | `getSupabaseClient` | `apps\api\src\worker\probe-runner.ts` |
| 3 | 2 | `unresolved::createClient` | `` |
| 4 | 1 | `builtin::ts::array.static::from` | `` |
| 5 | 1 | `unresolved::*.select` | `` |
| 6 | 1 | `unresolved::*.eq` | `` |
| 7 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\worker\probe-runner.ts`
- `apps\api\src\worker\scheduler.ts`

