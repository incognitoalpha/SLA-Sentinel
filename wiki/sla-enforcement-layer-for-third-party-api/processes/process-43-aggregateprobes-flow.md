---
title: aggregateProbes flow
process_id: process-43
steps: 8
---

# Process: aggregateProbes flow

8 steps across 1 files. Entry: `apps\api\src\evaluator\aggregation.ts::aggregateProbes` (score 1.95).

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

  Note over c_apps\api\src\evaluator_·_evaluateAgreement: entry → aggregateProbes
  c_apps\api\src\evaluator_·_evaluateAgreement->>c_apps\api\src\evaluator_·_evaluateAgreement: computeUptimePct
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_filter: filter
  c_apps\api\src\evaluator_·_evaluateAgreement->>c_apps\api\src\evaluator_·_evaluateAgreement: computeP95Latency
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_map: map
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_sort: sort
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_unresolved___ceil: *.ceil
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_unresolved___max: *.max
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `aggregateProbes` | `apps\api\src\evaluator\aggregation.ts` |
| 2 | 1 | `computeUptimePct` | `apps\api\src\evaluator\aggregation.ts` |
| 3 | 2 | `builtin::ts::array::filter` | `` |
| 4 | 1 | `computeP95Latency` | `apps\api\src\evaluator\aggregation.ts` |
| 5 | 2 | `builtin::ts::array::map` | `` |
| 6 | 2 | `builtin::ts::array::sort` | `` |
| 7 | 2 | `unresolved::*.ceil` | `` |
| 8 | 2 | `unresolved::*.max` | `` |

## Files Touched

- `apps\api\src\evaluator\aggregation.ts`

