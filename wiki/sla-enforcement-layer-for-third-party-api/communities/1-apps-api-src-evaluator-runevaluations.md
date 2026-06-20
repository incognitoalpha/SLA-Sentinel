---
title: apps\api\src\evaluator · runEvaluations
community_id: community-12
symbols: 48
files: 2
---

# apps\api\src\evaluator · runEvaluations

48 symbols across 2 files | 95% cohesion | Community `community-12`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\evaluator\evaluation-job.ts` | agreement, agreementId, agreementId, agreements, data, data, emailResult, endpointIds, ... |
| `apps\api\src\evaluator\index.ts` | error, main |

## Entry Points

- `apps\api\src\evaluator\evaluation-job.ts::runEvaluations`
- `apps\api\src\evaluator\index.ts::main`
- `apps\api\src\evaluator\evaluation-job.ts::fetchProbesForPeriod`
- `apps\api\src\evaluator\evaluation-job.ts::findDueAgreements`
- `apps\api\src\evaluator\evaluation-job.ts::saveEvaluation`

## Execution Flows

- [main execution](../processes/process-15-main-execution.md) — 38 steps from `apps\api\src\evaluator\index.ts::main`
- [runEvaluations flow](../processes/process-11-runevaluations-flow.md) — 36 steps from `apps\api\src\evaluator\evaluation-job.ts::runEvaluations`
- [fetchProbesForPeriod flow](../processes/process-21-fetchprobesforperiod-flow.md) — 12 steps from `apps\api\src\evaluator\evaluation-job.ts::fetchProbesForPeriod`
- [findDueAgreements flow](../processes/process-26-finddueagreements-flow.md) — 11 steps from `apps\api\src\evaluator\evaluation-job.ts::findDueAgreements`
- [saveEvaluation flow](../processes/process-27-saveevaluation-flow.md) — 9 steps from `apps\api\src\evaluator\evaluation-job.ts::saveEvaluation`
- [markAgreementEvaluated flow](../processes/process-30-markagreementevaluated-flow.md) — 8 steps from `apps\api\src\evaluator\evaluation-job.ts::markAgreementEvaluated`
- [saveBreach flow](../processes/process-34-savebreach-flow.md) — 6 steps from `apps\api\src\evaluator\evaluation-job.ts::saveBreach`

## Connected Communities

| Community | Cross-edges |
|-----------|-------------|
| [apps\api\src\evaluator · evaluateAgreement](../communities/5-apps-api-src-evaluator-evaluateagreement.md) | 1 |

## How to Explore

```
get_communities with id: "community-12"
smart_context with task: "understand apps\api\src\evaluator · runEvaluations"
find_usages with id: "apps\\api\\src\\evaluator\\evaluation-job.ts::runEvaluations"
```
