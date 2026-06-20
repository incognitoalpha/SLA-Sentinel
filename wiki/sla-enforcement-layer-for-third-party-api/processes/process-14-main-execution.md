---
title: main execution
process_id: process-14
steps: 8
---

# Process: main execution

8 steps across 1 files. Entry: `apps\api\src\migrate.ts::main` (score 27.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src_·_runMigration as apps\api\src · runMigration
  participant n_builtin_ts_console_log as builtin::ts::console::log
  participant n_unresolved_readFileSync as unresolved::readFileSync
  participant n_unresolved_join as unresolved::join
  participant n_unresolved___rpc as unresolved::*.rpc
  participant n_builtin_ts_console_error as builtin::ts::console::error
  participant n_unresolved_sqlfn_exec_sql as unresolved::sqlfn::exec_sql

  Note over c_apps\api\src_·_runMigration: entry → main
  c_apps\api\src_·_runMigration->>n_builtin_ts_console_log: log
  c_apps\api\src_·_runMigration->>c_apps\api\src_·_runMigration: runMigration
  c_apps\api\src_·_runMigration->>n_unresolved_readFileSync: readFileSync
  c_apps\api\src_·_runMigration->>n_unresolved_join: join
  c_apps\api\src_·_runMigration->>n_unresolved___rpc: *.rpc
  c_apps\api\src_·_runMigration->>n_builtin_ts_console_error: error
  c_apps\api\src_·_runMigration->>n_unresolved_sqlfn_exec_sql: exec_sql
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `main` | `apps\api\src\migrate.ts` |
| 2 | 1 | `builtin::ts::console::log` | `` |
| 3 | 1 | `runMigration` | `apps\api\src\migrate.ts` |
| 4 | 2 | `unresolved::readFileSync` | `` |
| 5 | 2 | `unresolved::join` | `` |
| 6 | 2 | `unresolved::*.rpc` | `` |
| 7 | 2 | `builtin::ts::console::error` | `` |
| 8 | 2 | `unresolved::sqlfn::exec_sql` | `` |

## Files Touched

- `apps\api\src\migrate.ts`

