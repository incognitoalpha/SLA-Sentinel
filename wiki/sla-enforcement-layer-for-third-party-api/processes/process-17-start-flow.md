---
title: start flow
process_id: process-17
steps: 5
---

# Process: start flow

5 steps across 1 files. Entry: `apps\api\src\index.ts::start` (score 18.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src_·_start as apps\api\src · start
  participant n_unresolved_Number as unresolved::Number
  participant n_unresolved___listen as unresolved::*.listen
  participant n_builtin_ts_console_error as builtin::ts::console::error
  participant n_unresolved___exit as unresolved::*.exit

  Note over c_apps\api\src_·_start: entry → start
  c_apps\api\src_·_start->>n_unresolved_Number: Number
  c_apps\api\src_·_start->>n_unresolved___listen: *.listen
  c_apps\api\src_·_start->>n_builtin_ts_console_error: error
  c_apps\api\src_·_start->>n_unresolved___exit: *.exit
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `start` | `apps\api\src\index.ts` |
| 2 | 1 | `unresolved::Number` | `` |
| 3 | 1 | `unresolved::*.listen` | `` |
| 4 | 1 | `builtin::ts::console::error` | `` |
| 5 | 1 | `unresolved::*.exit` | `` |

## Files Touched

- `apps\api\src\index.ts`

