---
title: getEscrowStatus flow
process_id: process-24
steps: 10
---

# Process: getEscrowStatus flow

10 steps across 1 files. Entry: `apps\api\src\blockchain\escrow-client.ts::getEscrowStatus` (score 10.50).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\blockchain as apps\api\src\blockchain
  participant n_unresolved___toBigInt as unresolved::*.toBigInt
  participant n_unresolved___keccak256 as unresolved::*.keccak256
  participant n_unresolved___toUtf8Bytes as unresolved::*.toUtf8Bytes
  participant n_unresolved___escrows as unresolved::*.escrows
  participant n_unresolved___formatEther as unresolved::*.formatEther
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src\blockchain: entry → getEscrowStatus
  c_apps\api\src\blockchain->>c_apps\api\src\blockchain: getContract
  c_apps\api\src\blockchain->>c_apps\api\src\blockchain: getWallet
  c_apps\api\src\blockchain->>c_apps\api\src\blockchain: getProvider
  c_apps\api\src\blockchain->>n_unresolved___toBigInt: *.toBigInt
  c_apps\api\src\blockchain->>n_unresolved___keccak256: *.keccak256
  c_apps\api\src\blockchain->>n_unresolved___toUtf8Bytes: *.toUtf8Bytes
  c_apps\api\src\blockchain->>n_unresolved___escrows: *.escrows
  c_apps\api\src\blockchain->>n_unresolved___formatEther: *.formatEther
  c_apps\api\src\blockchain->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `getEscrowStatus` | `apps\api\src\blockchain\escrow-client.ts` |
| 2 | 1 | `getContract` | `apps\api\src\blockchain\escrow-client.ts` |
| 3 | 2 | `getWallet` | `apps\api\src\blockchain\escrow-client.ts` |
| 4 | 3 | `getProvider` | `apps\api\src\blockchain\escrow-client.ts` |
| 5 | 1 | `unresolved::*.toBigInt` | `` |
| 6 | 1 | `unresolved::*.keccak256` | `` |
| 7 | 1 | `unresolved::*.toUtf8Bytes` | `` |
| 8 | 1 | `unresolved::*.escrows` | `` |
| 9 | 1 | `unresolved::*.formatEther` | `` |
| 10 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\blockchain\escrow-client.ts`

