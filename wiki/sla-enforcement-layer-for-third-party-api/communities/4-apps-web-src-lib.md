---
title: apps\web\src\lib
community_id: community-33
symbols: 22
files: 1
---

# apps\web\src\lib

22 symbols across 1 files | 98% cohesion | Community `community-33`

## Files

| File | Symbols |
|------|---------|
| `apps\web\src\lib\api.ts` | APIClient, Endpoint, Provider, ProviderWithEndpoints, T, createEndpoint, createProvider, data, ... |

## Entry Points

- `apps\web\src\lib\api.ts::APIClient.createEndpoint`
- `apps\web\src\lib\api.ts::APIClient.createProvider`
- `apps\web\src\lib\api.ts::APIClient.getProviders`
- `apps\web\src\lib\api.ts::APIClient.request`

## Execution Flows

- [createEndpoint flow](../processes/process-25-createendpoint-flow.md) — 8 steps from `apps\web\src\lib\api.ts::APIClient.createEndpoint`
- [createProvider flow](../processes/process-29-createprovider-flow.md) — 8 steps from `apps\web\src\lib\api.ts::APIClient.createProvider`
- [getProviders flow](../processes/process-46-getproviders-flow.md) — 7 steps from `apps\web\src\lib\api.ts::APIClient.getProviders`
- [request flow](../processes/process-47-request-flow.md) — 6 steps from `apps\web\src\lib\api.ts::APIClient.request`

## How to Explore

```
get_communities with id: "community-33"
smart_context with task: "understand apps\web\src\lib"
find_usages with id: "apps\\web\\src\\lib\\api.ts::APIClient.createEndpoint"
```
