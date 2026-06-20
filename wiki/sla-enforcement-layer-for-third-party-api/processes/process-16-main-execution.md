---
title: main execution
process_id: process-16
steps: 30
---

# Process: main execution

30 steps across 3 files. Entry: `apps\api\src\worker\index.ts::main` (score 22.50).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\worker_·_probeEndpoint as apps\api\src\worker · probeEndpoint
  participant n_builtin_ts_console_log as builtin::ts::console::log
  participant n_unresolved___toISOString as unresolved::*.toISOString
  participant n_unresolved_createClient as unresolved::createClient
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___eq as unresolved::*.eq
  participant n_builtin_ts_console_error as builtin::ts::console::error
  participant n_builtin_ts_array_map as builtin::ts::array::map
  participant c_apps\api\src\worker_·_getLastProbeTime as apps\api\src\worker · getLastProbeTime
  participant n_unresolved___order as unresolved::*.order
  participant n_unresolved___limit as unresolved::*.limit
  participant n_unresolved___single as unresolved::*.single
  participant n_unresolved___getTime as unresolved::*.getTime
  participant n_unresolved___now as unresolved::*.now
  participant n_unresolved_setTimeout as unresolved::setTimeout
  participant n_unresolved___abort as unresolved::*.abort
  participant n_unresolved_fetch as unresolved::fetch
  participant n_unresolved_clearTimeout as unresolved::clearTimeout
  participant n_unresolved___round as unresolved::*.round
  participant n_builtin_ts_array_string_includes as builtin::ts::array/string::includes
  participant n_unresolved___insert as unresolved::*.insert
  participant n_builtin_ts_promise_static_allSettled as builtin::ts::promise.static::allSettled
  participant n_unresolved___exit as unresolved::*.exit

  Note over c_apps\api\src\worker_·_probeEndpoint: entry → main
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_console_log: log
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___toISOString: *.toISOString
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_probeEndpoint: runProbes
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_probeEndpoint: getActiveEndpoints
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_probeEndpoint: getSupabaseClient
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_createClient: createClient
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_array_static_from: from
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___select: *.select
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___eq: *.eq
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_console_error: error
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_array_map: map
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_getLastProbeTime: shouldProbeEndpoint
  c_apps\api\src\worker_·_getLastProbeTime->>c_apps\api\src\worker_·_getLastProbeTime: getLastProbeTime
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___order: *.order
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___limit: *.limit
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___single: *.single
  c_apps\api\src\worker_·_getLastProbeTime->>n_unresolved___getTime: *.getTime
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_probeEndpoint: probeEndpoint
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___now: *.now
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_setTimeout: setTimeout
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___abort: *.abort
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_fetch: fetch
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_clearTimeout: clearTimeout
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___round: *.round
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_array_string_includes: includes
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_probeEndpoint: saveProbeResult
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___insert: *.insert
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_promise_static_allSettled: allSettled
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___exit: *.exit
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `main` | `apps\api\src\worker\index.ts` |
| 2 | 1 | `builtin::ts::console::log` | `` |
| 3 | 1 | `unresolved::*.toISOString` | `` |
| 4 | 1 | `runProbes` | `apps\api\src\worker\scheduler.ts` |
| 5 | 2 | `getActiveEndpoints` | `apps\api\src\worker\scheduler.ts` |
| 6 | 3 | `getSupabaseClient` | `apps\api\src\worker\probe-runner.ts` |
| 7 | 4 | `unresolved::createClient` | `` |
| 8 | 3 | `builtin::ts::array.static::from` | `` |
| 9 | 3 | `unresolved::*.select` | `` |
| 10 | 3 | `unresolved::*.eq` | `` |
| 11 | 3 | `builtin::ts::console::error` | `` |
| 12 | 2 | `builtin::ts::array::map` | `` |
| 13 | 2 | `shouldProbeEndpoint` | `apps\api\src\worker\scheduler.ts` |
| 14 | 3 | `getLastProbeTime` | `apps\api\src\worker\probe-runner.ts` |
| 15 | 4 | `unresolved::*.order` | `` |
| 16 | 4 | `unresolved::*.limit` | `` |
| 17 | 4 | `unresolved::*.single` | `` |
| 18 | 3 | `unresolved::*.getTime` | `` |
| 19 | 2 | `probeEndpoint` | `apps\api\src\worker\probe-runner.ts` |
| 20 | 3 | `unresolved::*.now` | `` |
| 21 | 3 | `unresolved::setTimeout` | `` |
| 22 | 3 | `unresolved::*.abort` | `` |
| 23 | 3 | `unresolved::fetch` | `` |
| 24 | 3 | `unresolved::clearTimeout` | `` |
| 25 | 3 | `unresolved::*.round` | `` |
| 26 | 3 | `builtin::ts::array/string::includes` | `` |
| 27 | 2 | `saveProbeResult` | `apps\api\src\worker\probe-runner.ts` |
| 28 | 3 | `unresolved::*.insert` | `` |
| 29 | 2 | `builtin::ts::promise.static::allSettled` | `` |
| 30 | 1 | `unresolved::*.exit` | `` |

## Files Touched

- `apps\api\src\worker\index.ts`
- `apps\api\src\worker\probe-runner.ts`
- `apps\api\src\worker\scheduler.ts`

