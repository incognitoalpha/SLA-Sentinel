---
title: seed flow
process_id: process-3
steps: 7
---

# Process: seed flow

7 steps across 1 files. Entry: `apps\api\src\seed.ts::seed` (score 99.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src_·_seed as apps\api\src · seed
  participant n_builtin_ts_console_log as builtin::ts::console::log
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___upsert as unresolved::*.upsert
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___single as unresolved::*.single
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src_·_seed: entry → seed
  c_apps\api\src_·_seed->>n_builtin_ts_console_log: log
  c_apps\api\src_·_seed->>n_builtin_ts_array_static_from: from
  c_apps\api\src_·_seed->>n_unresolved___upsert: *.upsert
  c_apps\api\src_·_seed->>n_unresolved___select: *.select
  c_apps\api\src_·_seed->>n_unresolved___single: *.single
  c_apps\api\src_·_seed->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `seed` | `apps\api\src\seed.ts` |
| 2 | 1 | `builtin::ts::console::log` | `` |
| 3 | 1 | `builtin::ts::array.static::from` | `` |
| 4 | 1 | `unresolved::*.upsert` | `` |
| 5 | 1 | `unresolved::*.select` | `` |
| 6 | 1 | `unresolved::*.single` | `` |
| 7 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\seed.ts`

