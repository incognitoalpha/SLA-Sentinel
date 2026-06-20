---
title: saveEvaluation flow
process_id: process-27
steps: 9
---

# Process: saveEvaluation flow

9 steps across 1 files. Entry: `apps\api\src\evaluator\evaluation-job.ts::saveEvaluation` (score 7.80).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\evaluator_·_runEvaluations as apps\api\src\evaluator · runEvaluations
  participant n_unresolved_createClient as unresolved::createClient
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___insert as unresolved::*.insert
  participant n_unresolved___toISOString as unresolved::*.toISOString
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___single as unresolved::*.single
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src\evaluator_·_runEvaluations: entry → saveEvaluation
  c_apps\api\src\evaluator_·_runEvaluations->>c_apps\api\src\evaluator_·_runEvaluations: getSupabaseClient
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved_createClient: createClient
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_array_static_from: from
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___insert: *.insert
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___toISOString: *.toISOString
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___select: *.select
  c_apps\api\src\evaluator_·_runEvaluations->>n_unresolved___single: *.single
  c_apps\api\src\evaluator_·_runEvaluations->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `saveEvaluation` | `apps\api\src\evaluator\evaluation-job.ts` |
| 2 | 1 | `getSupabaseClient` | `apps\api\src\evaluator\evaluation-job.ts` |
| 3 | 2 | `unresolved::createClient` | `` |
| 4 | 1 | `builtin::ts::array.static::from` | `` |
| 5 | 1 | `unresolved::*.insert` | `` |
| 6 | 1 | `unresolved::*.toISOString` | `` |
| 7 | 1 | `unresolved::*.select` | `` |
| 8 | 1 | `unresolved::*.single` | `` |
| 9 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\evaluator\evaluation-job.ts`

