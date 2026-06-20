---
title: verifyHmacSignature flow
process_id: process-23
steps: 7
---

# Process: verifyHmacSignature flow

7 steps across 2 files. Entry: `apps\api\src\notifications\webhook.ts::verifyHmacSignature` (score 12.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c___+1_dirs as . +1 dirs
  participant n_unresolved___update as unresolved::*.update
  participant n_unresolved___digest as unresolved::*.digest
  participant n_builtin_ts_array_static_from as builtin::ts::array.static::from

  Note over c___+1_dirs: entry → verifyHmacSignature
  c___+1_dirs->>c___+1_dirs: generateHmacSignature
  c___+1_dirs->>c___+1_dirs: createHmac
  c___+1_dirs->>n_unresolved___update: *.update
  c___+1_dirs->>n_unresolved___digest: *.digest
  c___+1_dirs->>c___+1_dirs: timingSafeEqual
  c___+1_dirs->>n_builtin_ts_array_static_from: from
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `verifyHmacSignature` | `apps\api\src\notifications\webhook.ts` |
| 2 | 1 | `generateHmacSignature` | `apps\api\src\notifications\webhook.ts` |
| 3 | 2 | `createHmac` | `` |
| 4 | 2 | `unresolved::*.update` | `` |
| 5 | 2 | `unresolved::*.digest` | `` |
| 6 | 1 | `timingSafeEqual` | `` |
| 7 | 1 | `builtin::ts::array.static::from` | `` |

## Files Touched

- ``
- `apps\api\src\notifications\webhook.ts`

