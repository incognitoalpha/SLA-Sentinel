---
title: . +1 dirs
community_id: community-38
symbols: 24
files: 2
---

# . +1 dirs

24 symbols across 2 files | 100% cohesion | Community `community-38`

## Files

| File | Symbols |
|------|---------|
| `` | createHmac, crypto, timingSafeEqual |
| `apps\api\src\notifications\webhook.ts` | WebhookPayload, attempt, backoffMs, backoffMs, deliverWebhook, error, expected, generateHmacSignature, ... |

## Entry Points

- `apps\api\src\notifications\webhook.ts::deliverWebhook`
- `apps\api\src\notifications\webhook.ts::verifyHmacSignature`
- `apps\api\src\notifications\webhook.ts::generateHmacSignature`

## Execution Flows

- [deliverWebhook flow](../processes/process-12-deliverwebhook-flow.md) — 13 steps from `apps\api\src\notifications\webhook.ts::deliverWebhook`
- [verifyHmacSignature flow](../processes/process-23-verifyhmacsignature-flow.md) — 7 steps from `apps\api\src\notifications\webhook.ts::verifyHmacSignature`
- [generateHmacSignature flow](../processes/process-45-generatehmacsignature-flow.md) — 4 steps from `apps\api\src\notifications\webhook.ts::generateHmacSignature`

## How to Explore

```
get_communities with id: "community-38"
smart_context with task: "understand . +1 dirs"
find_usages with id: "apps\\api\\src\\notifications\\webhook.ts::deliverWebhook"
```
