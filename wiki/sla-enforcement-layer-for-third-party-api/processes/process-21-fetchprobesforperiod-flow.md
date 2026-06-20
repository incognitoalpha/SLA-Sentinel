---
title: fetchProbesForPeriod flow
process_id: process-21
steps: 12
---

# Process: fetchProbesForPeriod flow

12 steps across 1 files. Entry: `apps\api\src\evaluator\evaluation-job.ts::fetchProbesForPeriod` (score 13.65).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\evaluator_·_runEvaluations as apps\api\src\evaluator · runEvaluations
  participant n_unresolved_createClient as unresolved::createClient
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___eq as unresolved::*.eq
  participant n_builtin_ts_console_error as builtin::ts::console::error
  participant n_builtin_ts_array_map as builtin::ts::array::map
  participant n_unresolved___in as unresolved::*.in
  participant n_unresolved___gte as unresolved::*.gte
  participant n_unresolved___toISOString as unresolved::*.toISOString
  participant n_unresolved___lte as unresolved::*.lte

  Note over c_apps\api\src\evaluator_·_runEvaluations: entry → fetchProbesForPeriod
  c_apps\api\src\evaluator_·_runEvaluations->>c_apps\api\src\evaluator_·_runEvaluations: getSupabaseClient
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved_createClient: createClient
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_array_static_from: from
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___select: *.select
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___eq: *.eq
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_console_error: error
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_array_map: map
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___in: *.in
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___gte: *.gte
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___toISOString: *.toISOString
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___lte: *.lte
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `fetchProbesForPeriod` | `apps\api\src\evaluator\evaluation-job.ts` |
| 2 | 1 | `getSupabaseClient` | `apps\api\src\evaluator\evaluation-job.ts` |
| 3 | 2 | `unresolved::createClient` | `` |
| 4 | 1 | `builtin::ts::array.static::from` | `` |
| 5 | 1 | `unresolved::*.select` | `` |
| 6 | 1 | `unresolved::*.eq` | `` |
| 7 | 1 | `builtin::ts::console::error` | `` |
| 8 | 1 | `builtin::ts::array::map` | `` |
| 9 | 1 | `unresolved::*.in` | `` |
| 10 | 1 | `unresolved::*.gte` | `` |
| 11 | 1 | `unresolved::*.toISOString` | `` |
| 12 | 1 | `unresolved::*.lte` | `` |

## Files Touched

- `apps\api\src\evaluator\evaluation-job.ts`

