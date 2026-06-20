---
title: probeEndpoint flow
process_id: process-20
steps: 8
---

# Process: probeEndpoint flow

8 steps across 1 files. Entry: `apps\api\src\worker\probe-runner.ts::probeEndpoint` (score 14.62).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\worker_·_probeEndpoint as apps\api\src\worker · probeEndpoint
  participant n_unresolved___now as unresolved::*.now
  participant n_unresolved_setTimeout as unresolved::setTimeout
  participant n_unresolved___abort as unresolved::*.abort
  participant n_unresolved_fetch as unresolved::fetch
  participant n_unresolved_clearTimeout as unresolved::clearTimeout
  participant n_unresolved___round as unresolved::*.round
  participant n_builtin_ts_array_string_includes as builtin::ts::array/string::includes

  Note over c_apps\api\src\worker_·_probeEndpoint: entry → probeEndpoint
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___now: *.now
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_setTimeout: setTimeout
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___abort: *.abort
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_fetch: fetch
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved_clearTimeout: clearTimeout
  c_apps\api\src\worker_·_probeEndpoint->>n_unresolved___round: *.round
  c_apps\api\src\worker_·_probeEndpoint->>n_builtin_ts_array_string_includes: includes
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `probeEndpoint` | `apps\api\src\worker\probe-runner.ts` |
| 2 | 1 | `unresolved::*.now` | `` |
| 3 | 1 | `unresolved::setTimeout` | `` |
| 4 | 1 | `unresolved::*.abort` | `` |
| 5 | 1 | `unresolved::fetch` | `` |
| 6 | 1 | `unresolved::clearTimeout` | `` |
| 7 | 1 | `unresolved::*.round` | `` |
| 8 | 1 | `builtin::ts::array/string::includes` | `` |

## Files Touched

- `apps\api\src\worker\probe-runner.ts`

