---
title: NavBar flow
process_id: process-22
steps: 3
---

# Process: NavBar flow

3 steps across 1 files. Entry: `apps\web\src\components\NavBar.tsx::NavBar` (score 12.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\web\src\components_·_NavBar as apps\web\src\components · NavBar
  participant n_unresolved_usePathname as unresolved::usePathname

  Note over c_apps\web\src\components_·_NavBar: entry → NavBar
  c_apps\web\src\components_·_NavBar->>n_unresolved_usePathname: usePathname
  c_apps\web\src\components_·_NavBar->>c_apps\web\src\components_·_NavBar: isActive
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `NavBar` | `apps\web\src\components\NavBar.tsx` |
| 2 | 1 | `unresolved::usePathname` | `` |
| 3 | 1 | `isActive` | `apps\web\src\components\NavBar.tsx` |

## Files Touched

- `apps\web\src\components\NavBar.tsx`

