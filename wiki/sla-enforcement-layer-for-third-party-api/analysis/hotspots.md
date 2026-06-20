---
title: Hotspots
---

# Hotspots — High-Coupling Symbols

Symbols ranked by `(fan_in * 2) + (fan_out * 1.5) + (community_crossings * 3)`, normalised to 0..100.

| # | Symbol | Kind | Fan-in | Fan-out | Crossings | Score |
|---|--------|------|--------|---------|-----------|-------|
| 1 | runEvaluations — `apps\api\src\evaluator\evaluation-job.ts:164` | function | 1 | 27 | 1 | 100.00 |
| 2 | endpointsRoutes — `apps\api\src\routes\endpoints.ts:23` | function | 0 | 55 | 0 | 96.49 |
| 3 | agreementsRoutes — `apps\api\src\routes\agreements.ts:25` | function | 0 | 51 | 0 | 89.47 |
| 4 | providersRoutes — `apps\api\src\routes\providers.ts:19` | function | 0 | 43 | 0 | 75.44 |

Use `verify_change` before modifying any of these signatures — their blast radius is wide.
