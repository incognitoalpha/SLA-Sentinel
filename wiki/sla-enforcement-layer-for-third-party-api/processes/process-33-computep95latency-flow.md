---
title: computeP95Latency flow
process_id: process-33
steps: 5
---

# Process: computeP95Latency flow

5 steps across 1 files. Entry: `apps\api\src\evaluator\aggregation.ts::computeP95Latency` (score 3.90).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\evaluator_·_evaluateAgreement as apps\api\src\evaluator · evaluateAgreement
  participant n_builtin_ts_array_map as builtin::ts::array::map
  participant n_builtin_ts_array_sort as builtin::ts::array::sort
  participant n_unresolved___ceil as unresolved::*.ceil
  participant n_unresolved___max as unresolved::*.max

  Note over c_apps\api\src\evaluator_·_evaluateAgreement: entry → computeP95Latency
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_map: map
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_builtin_ts_array_sort: sort
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_unresolved___ceil: *.ceil
  c_apps\api\src\evaluator_·_evaluateAgreement->>n_unresolved___max: *.max
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `computeP95Latency` | `apps\api\src\evaluator\aggregation.ts` |
| 2 | 1 | `builtin::ts::array::map` | `` |
| 3 | 1 | `builtin::ts::array::sort` | `` |
| 4 | 1 | `unresolved::*.ceil` | `` |
| 5 | 1 | `unresolved::*.max` | `` |

## Files Touched

- `apps\api\src\evaluator\aggregation.ts`

