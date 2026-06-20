---
title: deliverWebhook flow
process_id: process-12
steps: 13
---

# Process: deliverWebhook flow

13 steps across 2 files. Entry: `apps\api\src\notifications\webhook.ts::deliverWebhook` (score 36.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c___+1_dirs as . +1 dirs
  participant n_builtin_ts_json_stringify as builtin::ts::json::stringify
  participant n_unresolved___update as unresolved::*.update
  participant n_unresolved___digest as unresolved::*.digest
  participant n_unresolved_fetch as unresolved::fetch
  participant n_unresolved___timeout as unresolved::*.timeout
  participant n_builtin_ts_console_log as builtin::ts::console::log
  participant n_builtin_ts_console_warn as builtin::ts::console::warn
  participant n_unresolved___pow as unresolved::*.pow
  participant n_unresolved_setTimeout as unresolved::setTimeout
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c___+1_dirs: entry → deliverWebhook
  c___+1_dirs->>n_builtin_ts_json_stringify: stringify
  c___+1_dirs->>c___+1_dirs: generateHmacSignature
  c___+1_dirs->>c___+1_dirs: createHmac
  c___+1_dirs->>n_unresolved___update: *.update
  c___+1_dirs->>n_unresolved___digest: *.digest
  c___+1_dirs->>n_unresolved_fetch: fetch
  c___+1_dirs->>n_unresolved___timeout: *.timeout
  c___+1_dirs->>n_builtin_ts_console_log: log
  c___+1_dirs->>n_builtin_ts_console_warn: warn
  c___+1_dirs->>n_unresolved___pow: *.pow
  c___+1_dirs->>n_unresolved_setTimeout: setTimeout
  c___+1_dirs->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `deliverWebhook` | `apps\api\src\notifications\webhook.ts` |
| 2 | 1 | `builtin::ts::json::stringify` | `` |
| 3 | 1 | `generateHmacSignature` | `apps\api\src\notifications\webhook.ts` |
| 4 | 2 | `createHmac` | `` |
| 5 | 2 | `unresolved::*.update` | `` |
| 6 | 2 | `unresolved::*.digest` | `` |
| 7 | 1 | `unresolved::fetch` | `` |
| 8 | 1 | `unresolved::*.timeout` | `` |
| 9 | 1 | `builtin::ts::console::log` | `` |
| 10 | 1 | `builtin::ts::console::warn` | `` |
| 11 | 1 | `unresolved::*.pow` | `` |
| 12 | 1 | `unresolved::setTimeout` | `` |
| 13 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- ``
- `apps\api\src\notifications\webhook.ts`

