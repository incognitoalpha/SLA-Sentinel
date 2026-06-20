---
title: apps\api\src\notifications
community_id: community-16
symbols: 11
files: 1
---

# apps\api\src\notifications

11 symbols across 1 files | 94% cohesion | Community `community-16`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\notifications\email.ts` | BreachEmailData, buildEmailHtml, buildEmailText, data, data, data, error, error, ... |

## Entry Points

- `apps\api\src\notifications\email.ts::sendBreachEmail`
- `apps\api\src\notifications\email.ts::buildEmailText`
- `apps\api\src\notifications\email.ts::buildEmailHtml`

## Execution Flows

- [sendBreachEmail flow](../processes/process-19-sendbreachemail-flow.md) — 7 steps from `apps\api\src\notifications\email.ts::sendBreachEmail`
- [buildEmailText flow](../processes/process-42-buildemailtext-flow.md) — 3 steps from `apps\api\src\notifications\email.ts::buildEmailText`
- [buildEmailHtml flow](../processes/process-44-buildemailhtml-flow.md) — 3 steps from `apps\api\src\notifications\email.ts::buildEmailHtml`

## How to Explore

```
get_communities with id: "community-16"
smart_context with task: "understand apps\api\src\notifications"
find_usages with id: "apps\\api\\src\\notifications\\email.ts::sendBreachEmail"
```
