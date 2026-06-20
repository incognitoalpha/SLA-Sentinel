---
title: apps\api\src\worker · getLastProbeTime
community_id: community-27
symbols: 11
files: 2
---

# apps\api\src\worker · getLastProbeTime

11 symbols across 2 files | 86% cohesion | Community `community-27`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\worker\probe-runner.ts` | data, endpointId, error, getLastProbeTime, supabase |
| `apps\api\src\worker\scheduler.ts` | Endpoint, elapsedSeconds, endpoint, lastProbeTime, now, shouldProbeEndpoint |

## Entry Points

- `apps\api\src\worker\probe-runner.ts::getLastProbeTime`
- `apps\api\src\worker\scheduler.ts::shouldProbeEndpoint`

## Execution Flows

- [main execution](../processes/process-16-main-execution.md) — 30 steps from `apps\api\src\worker\index.ts::main`
- [runProbes flow](../processes/process-18-runprobes-flow.md) — 28 steps from `apps\api\src\worker\scheduler.ts::runProbes`
- [shouldProbeEndpoint flow](../processes/process-40-shouldprobeendpoint-flow.md) — 12 steps from `apps\api\src\worker\scheduler.ts::shouldProbeEndpoint`
- [getLastProbeTime flow](../processes/process-35-getlastprobetime-flow.md) — 10 steps from `apps\api\src\worker\probe-runner.ts::getLastProbeTime`

## Connected Communities

| Community | Cross-edges |
|-----------|-------------|
| [apps\api\src\worker · probeEndpoint](../communities/2-apps-api-src-worker-probeendpoint.md) | 1 |

## How to Explore

```
get_communities with id: "community-27"
smart_context with task: "understand apps\api\src\worker · getLastProbeTime"
find_usages with id: "apps\\api\\src\\worker\\probe-runner.ts::getLastProbeTime"
```
