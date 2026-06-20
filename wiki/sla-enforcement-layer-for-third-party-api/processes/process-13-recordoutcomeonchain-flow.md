---
title: recordOutcomeOnChain flow
process_id: process-13
steps: 11
---

# Process: recordOutcomeOnChain flow

11 steps across 1 files. Entry: `apps\api\src\blockchain\escrow-client.ts::recordOutcomeOnChain` (score 30.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_apps\api\src\blockchain_+1_dirs as apps\api\src\blockchain +1 dirs
  participant c_apps\api\src\blockchain as apps\api\src\blockchain
  participant n_unresolved___toBigInt as unresolved::*.toBigInt
  participant n_unresolved___keccak256 as unresolved::*.keccak256
  participant n_unresolved___toUtf8Bytes as unresolved::*.toUtf8Bytes
  participant n_builtin_ts_console_log as builtin::ts::console::log
  participant n_unresolved___recordOutcome as unresolved::*.recordOutcome
  participant n_unresolved___wait as unresolved::*.wait
  participant n_builtin_ts_console_error as builtin::ts::console::error

  Note over c_apps\api\src\blockchain_+1_dirs: entry → recordOutcomeOnChain
  c_apps\api\src\blockchain_+1_dirs->>c_apps\api\src\blockchain: getContract
  c_apps\api\src\blockchain->>c_apps\api\src\blockchain: getWallet
  c_apps\api\src\blockchain->>c_apps\api\src\blockchain: getProvider
  c_apps\api\src\blockchain_+1_dirs->>n_unresolved___toBigInt: *.toBigInt
  c_apps\api\src\blockchain_+1_dirs->>n_unresolved___keccak256: *.keccak256
  c_apps\api\src\blockchain_+1_dirs->>n_unresolved___toUtf8Bytes: *.toUtf8Bytes
  c_apps\api\src\blockchain_+1_dirs->>n_builtin_ts_console_log: log
  c_apps\api\src\blockchain_+1_dirs->>n_unresolved___recordOutcome: *.recordOutcome
  c_apps\api\src\blockchain_+1_dirs->>n_unresolved___wait: *.wait
  c_apps\api\src\blockchain_+1_dirs->>n_builtin_ts_console_error: error
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `recordOutcomeOnChain` | `apps\api\src\blockchain\escrow-client.ts` |
| 2 | 1 | `getContract` | `apps\api\src\blockchain\escrow-client.ts` |
| 3 | 2 | `getWallet` | `apps\api\src\blockchain\escrow-client.ts` |
| 4 | 3 | `getProvider` | `apps\api\src\blockchain\escrow-client.ts` |
| 5 | 1 | `unresolved::*.toBigInt` | `` |
| 6 | 1 | `unresolved::*.keccak256` | `` |
| 7 | 1 | `unresolved::*.toUtf8Bytes` | `` |
| 8 | 1 | `builtin::ts::console::log` | `` |
| 9 | 1 | `unresolved::*.recordOutcome` | `` |
| 10 | 1 | `unresolved::*.wait` | `` |
| 11 | 1 | `builtin::ts::console::error` | `` |

## Files Touched

- `apps\api\src\blockchain\escrow-client.ts`

