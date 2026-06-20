---
title: generateHmacSignature flow
process_id: process-45
steps: 4
---

# Process: generateHmacSignature flow

4 steps across 2 files. Entry: `apps\api\src\notifications\webhook.ts::generateHmacSignature` (score 1.95).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c___+1_dirs as . +1 dirs
  participant n_unresolved___update as unresolved::*.update
  participant n_unresolved___digest as unresolved::*.digest

  Note over c___+1_dirs: entry → generateHmacSignature
  c___+1_dirs->>c___+1_dirs: createHmac
  c___+1_dirs->>n_unresolved___update: *.update
  c___+1_dirs->>n_unresolved___digest: *.digest
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `generateHmacSignature` | `apps\api\src\notifications\webhook.ts` |
| 2 | 1 | `createHmac` | `` |
| 3 | 1 | `unresolved::*.update` | `` |
| 4 | 1 | `unresolved::*.digest` | `` |

## Files Touched

- ``
- `apps\api\src\notifications\webhook.ts`

