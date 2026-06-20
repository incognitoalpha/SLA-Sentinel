---
title: isEndpointDown flow
process_id: process-48
steps: 10
---

# Process: isEndpointDown flow

10 steps across 2 files. Entry: `apps\api\src\worker\downtime-policy.ts::isEndpointDown` (score 1.50).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\worker_·_getLastNProbes as apps\api\src\worker · getLastNProbes
  participant c_apps\api\src\worker_·_probeEndpoint as apps\api\src\worker · probeEndpoint
  participant n_unresolved_createClient as unresolved::createClient
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___eq as unresolved::*.eq
  participant n_unresolved___order as unresolved::*.order
  participant n_unresolved___limit as unresolved::*.limit
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src\worker_·_getLastNProbes: entry → isEndpointDown
  c_apps\api\src\worker_·_getLastNProbes->>c_apps\api\src\worker_·_getLastNProbes: getLastNProbes
  c_apps\api\src\worker_·_getLastNProbes->>c_apps\api\src\worker_·_probeEndpoint: getSupabaseClient
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_createClient: createClient
  c_apps\api\src\worker_·_getLastNProbes->>n_builtin_ts_array_static_from: from
  c_apps\api\src\worker_·_getLastNProbes->>n_unresolved___select: *.select
  c_apps\api\src\worker_·_getLastNProbes->>n_unresolved___eq: *.eq
  c_apps\api\src\worker_·_getLastNProbes->>n_unresolved___order: *.order
  c_apps\api\src\worker_·_getLastNProbes->>n_unresolved___limit: *.limit
  c_apps\api\src\worker_·_getLastNProbes->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `isEndpointDown` | `apps\api\src\worker\downtime-policy.ts` |
| 2 | 1 | `getLastNProbes` | `apps\api\src\worker\probe-runner.ts` |
| 3 | 2 | `getSupabaseClient` | `apps\api\src\worker\probe-runner.ts` |
| 4 | 3 | `unresolved::createClient` | `` |
| 5 | 2 | `builtin::ts::array.static::from` | `` |
| 6 | 2 | `unresolved::*.select` | `` |
| 7 | 2 | `unresolved::*.eq` | `` |
| 8 | 2 | `unresolved::*.order` | `` |
| 9 | 2 | `unresolved::*.limit` | `` |
| 10 | 2 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\worker\downtime-policy.ts`
- `apps\api\src\worker\probe-runner.ts`

