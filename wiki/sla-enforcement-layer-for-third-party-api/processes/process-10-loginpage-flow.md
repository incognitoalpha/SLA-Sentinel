---
title: LoginPage flow
process_id: process-10
steps: 13
---

# Process: LoginPage flow

13 steps across 1 files. Entry: `apps\web\src\app\login\page.tsx::LoginPage` (score 54.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\web\src\app\login as apps\web\src\app\login
  participant n_unresolved_useRouter as unresolved::useRouter
  participant n_unresolved_useState as unresolved::useState
  participant n_unresolved_useEffect as unresolved::useEffect
  participant n_unresolved___getSession as unresolved::*.getSession
  participant n_builtin_ts_promise_then as builtin::ts::promise::then
  participant n_builtin_ts_array_push as builtin::ts::array::push
  participant n_unresolved___preventDefault as unresolved::*.preventDefault
  participant n_unresolved_setError as unresolved::setError
  participant n_unresolved_setLoading as unresolved::setLoading
  participant n_unresolved___signInWithPassword as unresolved::*.signInWithPassword
  participant n_unresolved_setEmail as unresolved::setEmail
  participant n_unresolved_setPassword as unresolved::setPassword

  Note over c_apps\web\src\app\login: entry → LoginPage
  c_apps\web\src\app\login->>n_unresolved_useRouter: useRouter
  c_apps\web\src\app\login->>n_unresolved_useState: useState
  c_apps\web\src\app\login->>n_unresolved_useEffect: useEffect
  c_apps\web\src\app\login->>n_unresolved___getSession: *.getSession
  c_apps\web\src\app\login->>n_builtin_ts_promise_then: then
  c_apps\web\src\app\login->>n_builtin_ts_array_push: push
  c_apps\web\src\app\login->>n_unresolved___preventDefault: *.preventDefault
  c_apps\web\src\app\login->>n_unresolved_setError: setError
  c_apps\web\src\app\login->>n_unresolved_setLoading: setLoading
  c_apps\web\src\app\login->>n_unresolved___signInWithPassword: *.signInWithPassword
  c_apps\web\src\app\login->>n_unresolved_setEmail: setEmail
  c_apps\web\src\app\login->>n_unresolved_setPassword: setPassword
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `LoginPage` | `apps\web\src\app\login\page.tsx` |
| 2 | 1 | `unresolved::useRouter` | `` |
| 3 | 1 | `unresolved::useState` | `` |
| 4 | 1 | `unresolved::useEffect` | `` |
| 5 | 1 | `unresolved::*.getSession` | `` |
| 6 | 1 | `builtin::ts::promise::then` | `` |
| 7 | 1 | `builtin::ts::array::push` | `` |
| 8 | 1 | `unresolved::*.preventDefault` | `` |
| 9 | 1 | `unresolved::setError` | `` |
| 10 | 1 | `unresolved::setLoading` | `` |
| 11 | 1 | `unresolved::*.signInWithPassword` | `` |
| 12 | 1 | `unresolved::setEmail` | `` |
| 13 | 1 | `unresolved::setPassword` | `` |

## Files Touched

- `apps\web\src\app\login\page.tsx`

