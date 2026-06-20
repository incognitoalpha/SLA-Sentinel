---
title: apps\api\src\blockchain
community_id: community-10
symbols: 12
files: 1
---

# apps\api\src\blockchain

12 symbols across 1 files | 94% cohesion | Community `community-10`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\blockchain\escrow-client.ts` | abi, agreementId, agreementIdHash, contract, error, escrow, getContract, getEscrowStatus, ... |

## Entry Points

- `apps\api\src\blockchain\escrow-client.ts::getEscrowStatus`

## Execution Flows

- [recordOutcomeOnChain flow](../processes/process-13-recordoutcomeonchain-flow.md) — 11 steps from `apps\api\src\blockchain\escrow-client.ts::recordOutcomeOnChain`
- [getEscrowStatus flow](../processes/process-24-getescrowstatus-flow.md) — 10 steps from `apps\api\src\blockchain\escrow-client.ts::getEscrowStatus`

## How to Explore

```
get_communities with id: "community-10"
smart_context with task: "understand apps\api\src\blockchain"
find_usages with id: "apps\\api\\src\\blockchain\\escrow-client.ts::getEscrowStatus"
```
