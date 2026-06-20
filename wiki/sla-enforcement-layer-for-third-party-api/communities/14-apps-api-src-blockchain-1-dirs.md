---
title: apps\api\src\blockchain +1 dirs
community_id: community-35
symbols: 10
files: 2
---

# apps\api\src\blockchain +1 dirs

10 symbols across 2 files | 87% cohesion | Community `community-35`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\blockchain\escrow-client.ts` | agreementId, agreementIdHash, breached, contract, error, receipt, recordOutcomeOnChain, tx |
| `contracts\contracts\SLAEscrow.sol` | OutcomeRecorded, recordOutcome |

## Entry Points

- `apps\api\src\blockchain\escrow-client.ts::recordOutcomeOnChain`
- `contracts\contracts\SLAEscrow.sol::recordOutcome`

## Execution Flows

- [recordOutcomeOnChain flow](../processes/process-13-recordoutcomeonchain-flow.md) — 11 steps from `apps\api\src\blockchain\escrow-client.ts::recordOutcomeOnChain`
- [recordOutcome flow](../processes/process-38-recordoutcome-flow.md) — 2 steps from `contracts\contracts\SLAEscrow.sol::recordOutcome`

## Connected Communities

| Community | Cross-edges |
|-----------|-------------|
| [apps\api\src\blockchain](../communities/9-apps-api-src-blockchain.md) | 1 |

## How to Explore

```
get_communities with id: "community-35"
smart_context with task: "understand apps\api\src\blockchain +1 dirs"
find_usages with id: "apps\\api\\src\\blockchain\\escrow-client.ts::recordOutcomeOnChain"
```
