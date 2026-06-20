---
title: recordOutcome flow
process_id: process-38
steps: 2
---

# Process: recordOutcome flow

2 steps across 1 files. Entry: `contracts\contracts\SLAEscrow.sol::recordOutcome` (score 3.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\blockchain_+1_dirs as apps\api\src\blockchain +1 dirs

  Note over c_apps\api\src\blockchain_+1_dirs: entry → recordOutcome
  c_apps\api\src\blockchain_+1_dirs->>c_apps\api\src\blockchain_+1_dirs: OutcomeRecorded
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `recordOutcome` | `contracts\contracts\SLAEscrow.sol` |
| 2 | 1 | `OutcomeRecorded` | `contracts\contracts\SLAEscrow.sol` |

## Files Touched

- `contracts\contracts\SLAEscrow.sol`

