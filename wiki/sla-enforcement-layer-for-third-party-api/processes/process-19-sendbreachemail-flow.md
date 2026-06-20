---
title: sendBreachEmail flow
process_id: process-19
steps: 7
---

# Process: sendBreachEmail flow

7 steps across 1 files. Entry: `apps\api\src\notifications\email.ts::sendBreachEmail` (score 15.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\notifications as apps\api\src\notifications
  participant n_unresolved___send as unresolved::*.send
  participant n_builtin_ts_number_toFixed as builtin::ts::number::toFixed
  participant n_builtin_ts_string_trim as builtin::ts::string::trim
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src\notifications: entry → sendBreachEmail
  c_apps\api\src\notifications->>n_unresolved___send: *.send
  c_apps\api\src\notifications->>c_apps\api\src\notifications: buildEmailText
  c_apps\api\src\notifications->>n_builtin_ts_number_toFixed: toFixed
  c_apps\api\src\notifications->>n_builtin_ts_string_trim: trim
  c_apps\api\src\notifications->>c_apps\api\src\notifications: buildEmailHtml
  c_apps\api\src\notifications->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `sendBreachEmail` | `apps\api\src\notifications\email.ts` |
| 2 | 1 | `unresolved::*.send` | `` |
| 3 | 1 | `buildEmailText` | `apps\api\src\notifications\email.ts` |
| 4 | 2 | `builtin::ts::number::toFixed` | `` |
| 5 | 2 | `builtin::ts::string::trim` | `` |
| 6 | 1 | `buildEmailHtml` | `apps\api\src\notifications\email.ts` |
| 7 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\notifications\email.ts`

