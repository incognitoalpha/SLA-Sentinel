---
title: findDueAgreements flow
process_id: process-26
steps: 11
---

# Process: findDueAgreements flow

11 steps across 1 files. Entry: `apps\api\src\evaluator\evaluation-job.ts::findDueAgreements` (score 8.78).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\evaluator_·_runEvaluations as apps\api\src\evaluator · runEvaluations
  participant n_unresolved_createClient as unresolved::createClient
  participant n_unresolved___toISOString as unresolved::*.toISOString
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___eq as unresolved::*.eq
  participant n_unresolved___lt as unresolved::*.lt
  participant n_unresolved___is as unresolved::*.is
  participant n_builtin_ts_console_error as builtin::ts::console::error
  participant n_builtin_ts_array_map as builtin::ts::array::map

  Note over c_apps\api\src\evaluator_·_runEvaluations: entry → findDueAgreements
  c_apps\api\src\evaluator_·_runEvaluations->>c_apps\api\src\evaluator_·_runEvaluations: getSupabaseClient
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved_createClient: createClient
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___toISOString: *.toISOString
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_array_static_from: from
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___select: *.select
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___eq: *.eq
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___lt: *.lt
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___is: *.is
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_console_error: error
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_array_map: map
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `findDueAgreements` | `apps\api\src\evaluator\evaluation-job.ts` |
| 2 | 1 | `getSupabaseClient` | `apps\api\src\evaluator\evaluation-job.ts` |
| 3 | 2 | `unresolved::createClient` | `` |
| 4 | 1 | `unresolved::*.toISOString` | `` |
| 5 | 1 | `builtin::ts::array.static::from` | `` |
| 6 | 1 | `unresolved::*.select` | `` |
| 7 | 1 | `unresolved::*.eq` | `` |
| 8 | 1 | `unresolved::*.lt` | `` |
| 9 | 1 | `unresolved::*.is` | `` |
| 10 | 1 | `builtin::ts::console::error` | `` |
| 11 | 1 | `builtin::ts::array::map` | `` |

## Files Touched

- `apps\api\src\evaluator\evaluation-job.ts`

