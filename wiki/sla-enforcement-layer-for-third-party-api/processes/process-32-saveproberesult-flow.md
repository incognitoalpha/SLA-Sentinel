---
title: saveProbeResult flow
process_id: process-32
steps: 7
---

# Process: saveProbeResult flow

7 steps across 1 files. Entry: `apps\api\src\worker\probe-runner.ts::saveProbeResult` (score 4.88).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\worker_·_probeEndpoint as apps\api\src\worker · probeEndpoint
  participant n_unresolved_createClient as unresolved::createClient
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___insert as unresolved::*.insert
  participant n_unresolved___toISOString as unresolved::*.toISOString
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src\worker_·_probeEndpoint: entry → saveProbeResult
  c_apps\api\src\worker_·_probeEndpoint->>c_apps\api\src\worker_·_probeEndpoint: getSupabaseClient
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_createClient: createClient
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_array_static_from: from
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___insert: *.insert
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___toISOString: *.toISOString
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `saveProbeResult` | `apps\api\src\worker\probe-runner.ts` |
| 2 | 1 | `getSupabaseClient` | `apps\api\src\worker\probe-runner.ts` |
| 3 | 2 | `unresolved::createClient` | `` |
| 4 | 1 | `builtin::ts::array.static::from` | `` |
| 5 | 1 | `unresolved::*.insert` | `` |
| 6 | 1 | `unresolved::*.toISOString` | `` |
| 7 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\worker\probe-runner.ts`

