---
title: getLastProbeTime flow
process_id: process-35
steps: 10
---

# Process: getLastProbeTime flow

10 steps across 1 files. Entry: `apps\api\src\worker\probe-runner.ts::getLastProbeTime` (score 3.90).

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

  Note over c_apps\api\src\worker_·_getLastProbeTime: entry → getLastProbeTime
  c_apps\api\src\worker_·_getLastProbeTime->>c_apps\api\src\worker_·_probeEndpoint: getSupabaseClient
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_createClient: createClient
  c_apps\api\src\worker_·_getLastProbeTime->>n_builtin_ts_array_static_from: from
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___select: *.select
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___eq: *.eq
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___order: *.order
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___limit: *.limit
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___single: *.single
  c_apps\api\src\worker_·_getLastProbeTime->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `getLastProbeTime` | `apps\api\src\worker\probe-runner.ts` |
| 2 | 1 | `getSupabaseClient` | `apps\api\src\worker\probe-runner.ts` |
| 3 | 2 | `unresolved::createClient` | `` |
| 4 | 1 | `builtin::ts::array.static::from` | `` |
| 5 | 1 | `unresolved::*.select` | `` |
| 6 | 1 | `unresolved::*.eq` | `` |
| 7 | 1 | `unresolved::*.order` | `` |
| 8 | 1 | `unresolved::*.limit` | `` |
| 9 | 1 | `unresolved::*.single` | `` |
| 10 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\worker\probe-runner.ts`

