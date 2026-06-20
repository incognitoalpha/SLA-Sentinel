---
title: apps\api\src\worker · probeEndpoint
community_id: community-26
symbols: 32
files: 3
---

# apps\api\src\worker · probeEndpoint

32 symbols across 3 files | 94% cohesion | Community `community-26`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\worker\index.ts` | error, main |
| `apps\api\src\worker\probe-runner.ts` | ProbeResult, checkedAt, controller, endpointId, error, error, errorMessage, errorMessage, ... |
| `apps\api\src\worker\scheduler.ts` | data, endpoints, error, getActiveEndpoints, probePromises, runProbes, supabase |

## Entry Points

- `apps\api\src\worker\index.ts::main`
- `apps\api\src\worker\scheduler.ts::runProbes`
- `apps\api\src\worker\probe-runner.ts::probeEndpoint`
- `apps\api\src\worker\probe-runner.ts::saveProbeResult`
- `apps\api\src\worker\scheduler.ts::getActiveEndpoints`

## Execution Flows

- [main execution](../processes/process-16-main-execution.md) — 30 steps from `apps\api\src\worker\index.ts::main`
- [runProbes flow](../processes/process-18-runprobes-flow.md) — 28 steps from `apps\api\src\worker\scheduler.ts::runProbes`
- [shouldProbeEndpoint flow](../processes/process-40-shouldprobeendpoint-flow.md) — 12 steps from `apps\api\src\worker\scheduler.ts::shouldProbeEndpoint`
- [getLastProbeTime flow](../processes/process-35-getlastprobetime-flow.md) — 10 steps from `apps\api\src\worker\probe-runner.ts::getLastProbeTime`
- [isEndpointDown flow](../processes/process-48-isendpointdown-flow.md) — 10 steps from `apps\api\src\worker\downtime-policy.ts::isEndpointDown`
- [getLastNProbes flow](../processes/process-36-getlastnprobes-flow.md) — 9 steps from `apps\api\src\worker\probe-runner.ts::getLastNProbes`
- [probeEndpoint flow](../processes/process-20-probeendpoint-flow.md) — 8 steps from `apps\api\src\worker\probe-runner.ts::probeEndpoint`
- [saveProbeResult flow](../processes/process-32-saveproberesult-flow.md) — 7 steps from `apps\api\src\worker\probe-runner.ts::saveProbeResult`
- [getActiveEndpoints flow](../processes/process-41-getactiveendpoints-flow.md) — 7 steps from `apps\api\src\worker\scheduler.ts::getActiveEndpoints`

## Connected Communities

| Community | Cross-edges |
|-----------|-------------|
| [apps\api\src\worker · getLastProbeTime](../communities/13-apps-api-src-worker-getlastprobetime.md) | 1 |

## How to Explore

```
get_communities with id: "community-26"
smart_context with task: "understand apps\api\src\worker · probeEndpoint"
find_usages with id: "apps\\api\\src\\worker\\index.ts::main"
```
