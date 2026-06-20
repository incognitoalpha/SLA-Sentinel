---
title: withdraw flow
process_id: process-39
steps: 2
---

# Process: withdraw flow

2 steps across 1 files. Entry: `contracts\contracts\SLAEscrow.sol::withdraw` (score 3.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_contracts\contracts_·_FundsReleased as contracts\contracts · FundsReleased

  Note over c_contracts\contracts_·_FundsReleased: entry → withdraw
  c_contracts\contracts_·_FundsReleased->>c_contracts\contracts_·_FundsReleased: FundsReleased
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `withdraw` | `contracts\contracts\SLAEscrow.sol` |
| 2 | 1 | `FundsReleased` | `contracts\contracts\SLAEscrow.sol` |

## Files Touched

- `contracts\contracts\SLAEscrow.sol`

