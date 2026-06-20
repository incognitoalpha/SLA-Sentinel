---
title: main execution
process_id: process-5
steps: 9
---

# Process: main execution

9 steps across 1 files. Entry: `contracts\scripts\deploy.ts::main` (score 72.00).

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant c_contracts\scripts as contracts\scripts
  participant n_unresolved___getSigners as unresolved::*.getSigners
  participant n_builtin_ts_console_log as builtin::ts::console::log
  participant n_unresolved___formatEther as unresolved::*.formatEther
  participant n_unresolved___getBalance as unresolved::*.getBalance
  participant n_unresolved___getContractFactory as unresolved::*.getContractFactory
  participant n_unresolved___deploy as unresolved::*.deploy
  participant n_unresolved___waitForDeployment as unresolved::*.waitForDeployment
  participant n_unresolved___getAddress as unresolved::*.getAddress

  Note over c_contracts\scripts: entry → main
  c_contracts\scripts->>n_unresolved___getSigners: *.getSigners
  c_contracts\scripts->>n_builtin_ts_console_log: log
  c_contracts\scripts->>n_unresolved___formatEther: *.formatEther
  c_contracts\scripts->>n_unresolved___getBalance: *.getBalance
  c_contracts\scripts->>n_unresolved___getContractFactory: *.getContractFactory
  c_contracts\scripts->>n_unresolved___deploy: *.deploy
  c_contracts\scripts->>n_unresolved___waitForDeployment: *.waitForDeployment
  c_contracts\scripts->>n_unresolved___getAddress: *.getAddress
```

## Steps

| # | Depth | Symbol | File |
|---|-------|--------|------|
| 1 | 0 | `main` | `contracts\scripts\deploy.ts` |
| 2 | 1 | `unresolved::*.getSigners` | `` |
| 3 | 1 | `builtin::ts::console::log` | `` |
| 4 | 1 | `unresolved::*.formatEther` | `` |
| 5 | 1 | `unresolved::*.getBalance` | `` |
| 6 | 1 | `unresolved::*.getContractFactory` | `` |
| 7 | 1 | `unresolved::*.deploy` | `` |
| 8 | 1 | `unresolved::*.waitForDeployment` | `` |
| 9 | 1 | `unresolved::*.getAddress` | `` |

## Files Touched

- `contracts\scripts\deploy.ts`

