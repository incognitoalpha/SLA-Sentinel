---
title: evaluateAgreement flow
process_id: process-31
steps: 12
---

# Process: evaluateAgreement flow

12 steps across 2 files. Entry: `apps\api\src\evaluator\evaluation.ts::evaluateAgreement` (score 4.88).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\evaluator_·_evaluateAgreement as apps\api\src\evaluator · evaluateAgreement
  participant n_builtin_ts_array_filter as builtin::ts::array::filter
  participant n_builtin_ts_array_map as builtin::ts::array::map
  participant n_builtin_ts_array_sort as builtin::ts::array::sort
  participant n_unresolved___ceil as unresolved::*.ceil
  participant n_unresolved___max as unresolved::*.max
  participant n_builtin_ts_array_push as builtin::ts::array::push
  participant n_builtin_ts_number_toFixed as builtin::ts::number::toFixed
  participant n_unresolved___join as unresolved::*.join

  Note over c_apps\api\src\evaluator_·_evaluateAgreement: entry → evaluateAgreement
  c_apps\api\src\evaluator_·_evaluateAgreement->>c_apps\api\src\evaluator_·_evaluateAgreement: aggregateProbes
  c_apps\api\src\evaluator_·_evaluateAgreement->>c_apps\api\src\evaluator_·_evaluateAgreement: computeUptimePct
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_filter: filter
  c_apps\api\src\evaluator_·_evaluateAgreement->>c_apps\api\src\evaluator_·_evaluateAgreement: computeP95Latency
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_map: map
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_sort: sort
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_unresolved___ceil: *.ceil
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_unresolved___max: *.max
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_push: push
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_number_toFixed: toFixed
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_unresolved___join: *.join
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `evaluateAgreement` | `apps\api\src\evaluator\evaluation.ts` |
| 2 | 1 | `aggregateProbes` | `apps\api\src\evaluator\aggregation.ts` |
| 3 | 2 | `computeUptimePct` | `apps\api\src\evaluator\aggregation.ts` |
| 4 | 3 | `builtin::ts::array::filter` | `` |
| 5 | 2 | `computeP95Latency` | `apps\api\src\evaluator\aggregation.ts` |
| 6 | 3 | `builtin::ts::array::map` | `` |
| 7 | 3 | `builtin::ts::array::sort` | `` |
| 8 | 3 | `unresolved::*.ceil` | `` |
| 9 | 3 | `unresolved::*.max` | `` |
| 10 | 1 | `builtin::ts::array::push` | `` |
| 11 | 1 | `builtin::ts::number::toFixed` | `` |
| 12 | 1 | `unresolved::*.join` | `` |

## Files Touched

- `apps\api\src\evaluator\aggregation.ts`
- `apps\api\src\evaluator\evaluation.ts`

