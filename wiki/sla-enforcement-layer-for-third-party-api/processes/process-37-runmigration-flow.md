---
title: runMigration flow
process_id: process-37
steps: 7
---

# Process: runMigration flow

7 steps across 1 files. Entry: `apps\api\src\migrate.ts::runMigration` (score 3.38).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src_·_runMigration as apps\api\src · runMigration
  participant n_unresolved_readFileSync as unresolved::readFileSync
  participant n_unresolved_join as unresolved::join
  participant n_unresolved___rpc as unresolved::*.rpc
  participant n_builtin_ts_console_error as builtin::ts::console::error
  participant n_builtin_ts_console_log as builtin::ts::console::log
  participant n_unresolved_sqlfn_exec_sql as unresolved::sqlfn::exec_sql

  Note over c_apps\api\src_·_runMigration: entry → runMigration
  c_apps\api\src_·_runMigration->>n_unresolved_readFileSync: readFileSync
  c_apps\api\src_·_runMigration->>n_unresolved_join: join
  c_apps\api\src_·_runMigration->>n_unresolved___rpc: *.rpc
  c_apps\api\src_·_runMigration->>n_builtin_ts_console_error: error
  c_apps\api\src_·_runMigration->>n_builtin_ts_console_log: log
  c_apps\api\src_·_runMigration->>n_unresolved_sqlfn_exec_sql: exec_sql
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `runMigration` | `apps\api\src\migrate.ts` |
| 2 | 1 | `unresolved::readFileSync` | `` |
| 3 | 1 | `unresolved::join` | `` |
| 4 | 1 | `unresolved::*.rpc` | `` |
| 5 | 1 | `builtin::ts::console::error` | `` |
| 6 | 1 | `builtin::ts::console::log` | `` |
| 7 | 1 | `unresolved::sqlfn::exec_sql` | `` |

## Files Touched

- `apps\api\src\migrate.ts`

