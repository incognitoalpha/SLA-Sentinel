---
title: Semantic analysis
---

# Semantic Analysis

Edge confidence distribution across the indexed graph. Higher tiers come from compiler-verified providers (go-types, LSP, SCIP); lower tiers fall back to AST heuristics.

## Edge Confidence Distribution

| Origin | Edges | Percentage |
|--------|-------|------------|
| ast_inferred | 374 | 14.8% |
| ast_resolved | 268 | 10.6% |
| speculative | 12 | 0.5% |
| unlabeled | 1873 | 74.1% |
| **total** | **2527** | 100% |

