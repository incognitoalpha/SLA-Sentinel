---
title: buildEmailText flow
process_id: process-42
steps: 3
---

# Process: buildEmailText flow

3 steps across 1 files. Entry: `apps\api\src\notifications\email.ts::buildEmailText` (score 1.95).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\notifications as apps\api\src\notifications
  participant n_builtin_ts_number_toFixed as builtin::ts::number::toFixed
  participant n_builtin_ts_string_trim as builtin::ts::string::trim

  Note over c_apps\api\src\notifications: entry → buildEmailText
  c_apps\api\src\notifications->>n_builtin_ts_number_toFixed: toFixed
  c_apps\api\src\notifications->>n_builtin_ts_string_trim: trim
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `buildEmailText` | `apps\api\src\notifications\email.ts` |
| 2 | 1 | `builtin::ts::number::toFixed` | `` |
| 3 | 1 | `builtin::ts::string::trim` | `` |

## Files Touched

- `apps\api\src\notifications\email.ts`

