---
title: apps\api\src\evaluator · evaluateAgreement
community_id: community-11
symbols: 19
files: 3
---

# apps\api\src\evaluator · evaluateAgreement

19 symbols across 3 files | 92% cohesion | Community `community-11`

## Files

| File | Symbols |
|------|---------|
| `apps\api\src\evaluator\aggregation.ts` | AggregationResult, aggregateProbes, computeP95Latency, computeUptimePct, latencies, p95Index, probes, probes, ... |
| `apps\api\src\evaluator\evaluation-job.ts` | result |
| `apps\api\src\evaluator\evaluation.ts` | Agreement, EvaluationResult, agreement, breached, evaluateAgreement, metrics, probes, reasons |

## Entry Points

- `apps\api\src\evaluator\evaluation.ts::evaluateAgreement`
- `apps\api\src\evaluator\aggregation.ts::computeP95Latency`
- `apps\api\src\evaluator\aggregation.ts::aggregateProbes`

## Execution Flows

- [main execution](../processes/process-15-main-execution.md) — 38 steps from `apps\api\src\evaluator\index.ts::main`
- [runEvaluations flow](../processes/process-11-runevaluations-flow.md) — 36 steps from `apps\api\src\evaluator\evaluation-job.ts::runEvaluations`
- [evaluateAgreement flow](../processes/process-31-evaluateagreement-flow.md) — 12 steps from `apps\api\src\evaluator\evaluation.ts::evaluateAgreement`
- [aggregateProbes flow](../processes/process-43-aggregateprobes-flow.md) — 8 steps from `apps\api\src\evaluator\aggregation.ts::aggregateProbes`
- [computeP95Latency flow](../processes/process-33-computep95latency-flow.md) — 5 steps from `apps\api\src\evaluator\aggregation.ts::computeP95Latency`

## How to Explore

```
get_communities with id: "community-11"
smart_context with task: "understand apps\api\src\evaluator · evaluateAgreement"
find_usages with id: "apps\\api\\src\\evaluator\\evaluation.ts::evaluateAgreement"
```
