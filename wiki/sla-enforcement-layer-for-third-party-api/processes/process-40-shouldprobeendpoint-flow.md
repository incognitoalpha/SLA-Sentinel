---
title: shouldProbeEndpoint flow
process_id: process-40
steps: 12
---

# Process: shouldProbeEndpoint flow

12 steps across 2 files. Entry: `apps\api\src\worker\scheduler.ts::shouldProbeEndpoint` (score 2.93).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\worker_·_getLastProbeTime as apps\api\src\worker · getLastProbeTime
  participant c_apps\api\src\worker_·_probeEndpoint as apps\api\src\worker · probeEndpoint
  participant n_unresolved_createClient as unresolved::createClient
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___eq as unresolved::*.eq
  participant n_unresolved___order as unresolved::*.order
  participant n_unresolved___limit as unresolved::*.limit
  participant n_unresolved___single as unresolved::*.single
  participant n_builtin_ts_console_error as builtin::ts::console::error
  participant n_unresolved___getTime as unresolved::*.getTime

  Note over c_apps\api\src\worker_·_getLastProbeTime: entry → shouldProbeEndpoint
  c_apps\api\src\worker_·_getLastProbeTime->>c_apps\api\src\worker_·_getLastProbeTime: getLastProbeTime
  c_apps\api\src\worker_·_getLastProbeTime->>c_apps\api\src\worker_·_probeEndpoint: getSupabaseClient
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_createClient: createClient
  c_apps\api\src\worker_·_getLastProbeTime->>n_builtin_ts_array_static_from: from
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___select: *.select
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___eq: *.eq
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___order: *.order
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___limit: *.limit
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___single: *.single
  c_apps\api\src\worker_·_getLastProbeTime->>n_builtin_ts_console_error: error
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___getTime: *.getTime
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `shouldProbeEndpoint` | `apps\api\src\worker\scheduler.ts` |
| 2 | 1 | `getLastProbeTime` | `apps\api\src\worker\probe-runner.ts` |
| 3 | 2 | `getSupabaseClient` | `apps\api\src\worker\probe-runner.ts` |
| 4 | 3 | `unresolved::createClient` | `` |
| 5 | 2 | `builtin::ts::array.static::from` | `` |
| 6 | 2 | `unresolved::*.select` | `` |
| 7 | 2 | `unresolved::*.eq` | `` |
| 8 | 2 | `unresolved::*.order` | `` |
| 9 | 2 | `unresolved::*.limit` | `` |
| 10 | 2 | `unresolved::*.single` | `` |
| 11 | 2 | `builtin::ts::console::error` | `` |
| 12 | 1 | `unresolved::*.getTime` | `` |

## Files Touched

- `apps\api\src\worker\probe-runner.ts`
- `apps\api\src\worker\scheduler.ts`

