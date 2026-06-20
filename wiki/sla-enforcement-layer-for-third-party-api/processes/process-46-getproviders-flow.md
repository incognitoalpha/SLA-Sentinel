---
title: getProviders flow
process_id: process-46
steps: 7
---

# Process: getProviders flow

7 steps across 1 files. Entry: `apps\web\src\lib\api.ts::APIClient.getProviders` (score 1.50).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\web\src\lib as apps\web\src\lib
  participant n_unresolved___getSession as unresolved::*.getSession
  participant n_unresolved_fetch as unresolved::fetch
  participant n_unresolved___json as unresolved::*.json
  participant n_builtin_ts_promise_catch as builtin::ts::promise::catch

  Note over c_apps\web\src\lib: entry → getProviders
  c_apps\web\src\lib->>c_apps\web\src\lib: request
  c_apps\web\src\lib->>c_apps\web\src\lib: getAuthToken
  c_apps\web\src\lib->>n_unresolved___getSession: *.getSession
  c_apps\web\src\lib->>n_unresolved_fetch: fetch
  c_apps\web\src\lib->>n_unresolved___json: *.json
  c_apps\web\src\lib->>n_builtin_ts_promise_catch: catch
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `getProviders` | `apps\web\src\lib\api.ts` |
| 2 | 1 | `request` | `apps\web\src\lib\api.ts` |
| 3 | 2 | `getAuthToken` | `apps\web\src\lib\api.ts` |
| 4 | 3 | `unresolved::*.getSession` | `` |
| 5 | 2 | `unresolved::fetch` | `` |
| 6 | 2 | `unresolved::*.json` | `` |
| 7 | 2 | `builtin::ts::promise::catch` | `` |

## Files Touched

- `apps\web\src\lib\api.ts`

