---
title: apps\api\src\worker · getLastNProbes
community_id: community-25
symbols: 9
files: 2
---

# apps\api\src\worker · getLastNProbes

9 symbols across 2 files | 93% cohesion | Community `community-25`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\worker\downtime-policy.ts` | endpointId, isEndpointDown, lastTwo |
| `apps\api\src\worker\probe-runner.ts` | data, endpointId, error, getLastNProbes, n, supabase |

## Entry Points

- `apps\api\src\worker\probe-runner.ts::getLastNProbes`
- `apps\api\src\worker\downtime-policy.ts::isEndpointDown`

## Execution Flows

- [isEndpointDown flow](../processes/process-48-isendpointdown-flow.md) — 10 steps from `apps\api\src\worker\downtime-policy.ts::isEndpointDown`
- [getLastNProbes flow](../processes/process-36-getlastnprobes-flow.md) — 9 steps from `apps\api\src\worker\probe-runner.ts::getLastNProbes`

## Connected Communities

| Community | Cross-edges |
|-----------|-------------|
| [apps\api\src\worker · probeEndpoint](../communities/2-apps-api-src-worker-probeendpoint.md) | 1 |

## How to Explore

```
get_communities with id: "community-25"
smart_context with task: "understand apps\api\src\worker · getLastNProbes"
find_usages with id: "apps\\api\\src\\worker\\probe-runner.ts::getLastNProbes"
```
