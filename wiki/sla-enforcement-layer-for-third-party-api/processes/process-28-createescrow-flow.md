---
title: createEscrow flow
process_id: process-28
steps: 3
---

# Process: createEscrow flow

3 steps across 1 files. Entry: `contracts\contracts\SLAEscrow.sol::createEscrow` (score 6.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_contracts\contracts_·_EscrowCreated as contracts\contracts · EscrowCreated
  participant n_unresolved_Escrow as unresolved::Escrow

  Note over c_contracts\contracts_·_EscrowCreated: entry → createEscrow
  c_contracts\contracts_·_EscrowCreated->>n_unresolved_Escrow: Escrow
  c_contracts\contracts_·_EscrowCreated->>c_contracts\contracts_·_EscrowCreated: EscrowCreated
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `createEscrow` | `contracts\contracts\SLAEscrow.sol` |
| 2 | 1 | `unresolved::Escrow` | `` |
| 3 | 1 | `EscrowCreated` | `contracts\contracts\SLAEscrow.sol` |

## Files Touched

- `contracts\contracts\SLAEscrow.sol`

