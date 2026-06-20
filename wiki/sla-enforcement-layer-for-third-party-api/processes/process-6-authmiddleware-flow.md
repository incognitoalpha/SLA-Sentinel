---
title: authMiddleware flow
process_id: process-6
steps: 10
---

# Process: authMiddleware flow

10 steps across 1 files. Entry: `apps\api\src\middleware\auth.ts::authMiddleware` (score 67.50).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\middleware as apps\api\src\middleware
  participant n_builtin_ts_string_startsWith as builtin::ts::string::startsWith
  participant n_unresolved___code as unresolved::*.code
  participant n_unresolved___send as unresolved::*.send
  participant n_builtin_ts_string_substring as builtin::ts::string::substring
  participant n_unresolved___getUser as unresolved::*.getUser
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from
  participant n_unresolved___select as unresolved::*.select
  participant n_unresolved___eq as unresolved::*.eq
  participant n_unresolved___single as unresolved::*.single

  Note over c_apps\api\src\middleware: entry → authMiddleware
  c_apps\api\src\middleware->>n_builtin_ts_string_startsWith: startsWith
  c_apps\api\src\middleware->>n_unresolved___code: *.code
  c_apps\api\src\middleware->>n_unresolved___send: *.send
  c_apps\api\src\middleware->>n_builtin_ts_string_substring: substring
  c_apps\api\src\middleware->>n_unresolved___getUser: *.getUser
  c_apps\api\src\middleware->>n_builtin_ts_array_static_from: from
  c_apps\api\src\middleware->>n_unresolved___select: *.select
  c_apps\api\src\middleware->>n_unresolved___eq: *.eq
  c_apps\api\src\middleware->>n_unresolved___single: *.single
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `authMiddleware` | `apps\api\src\middleware\auth.ts` |
| 2 | 1 | `builtin::ts::string::startsWith` | `` |
| 3 | 1 | `unresolved::*.code` | `` |
| 4 | 1 | `unresolved::*.send` | `` |
| 5 | 1 | `builtin::ts::string::substring` | `` |
| 6 | 1 | `unresolved::*.getUser` | `` |
| 7 | 1 | `builtin::ts::array.static::from` | `` |
| 8 | 1 | `unresolved::*.select` | `` |
| 9 | 1 | `unresolved::*.eq` | `` |
| 10 | 1 | `unresolved::*.single` | `` |

## Files Touched

- `apps\api\src\middleware\auth.ts`

