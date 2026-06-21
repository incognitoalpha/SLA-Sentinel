import { aggregateProbes } from './aggregation.js'

export interface Agreement {
  id: string
  org_id: string
  provider_id: string
  name: string
  sla_uptime_pct: number
  sla_latency_p95_ms: number | null
  period_type: 'daily' | 'weekly' | 'monthly'
  period_start: Date
  period_end: Date
  escrow_contract_address: string | null
}

export interface EvaluationResult {
  agreementId: string
  periodStart: Date
  periodEnd: Date
  computedUptimePct: number
  computedP95LatencyMs: number
  breached: boolean
  breachReason: string | null
  sampleSize: number
}

export function evaluateAgreement(
  agreement: Agreement,
  probes: Array<{ success: boolean, latency_ms: number }>
): EvaluationResult {
  const metrics = aggregateProbes(probes)

  // Zero-probe window: never auto-breach on no data
  if (metrics.sampleSize === 0) {
    return {
      agreementId: agreement.id,
      periodStart: agreement.period_start,
      periodEnd: agreement.period_end,
      computedUptimePct: 0,
      computedP95LatencyMs: 0,
      breached: false,
      breachReason: null,
      sampleSize: 0
    }
  }

  let breached = false
  const reasons: string[] = []

  // Check uptime breach
  if (metrics.uptimePct < agreement.sla_uptime_pct) {
    breached = true
    reasons.push(`Uptime ${metrics.uptimePct.toFixed(2)}% < SLA ${agreement.sla_uptime_pct}%`)
  }

  // Check latency breach (if SLA defines latency threshold)
  if (agreement.sla_latency_p95_ms !== null && metrics.p95LatencyMs > agreement.sla_latency_p95_ms) {
    breached = true
    reasons.push(`P95 latency ${metrics.p95LatencyMs}ms > SLA ${agreement.sla_latency_p95_ms}ms`)
  }

  return {
    agreementId: agreement.id,
    periodStart: agreement.period_start,
    periodEnd: agreement.period_end,
    computedUptimePct: metrics.uptimePct,
    computedP95LatencyMs: metrics.p95LatencyMs,
    breached,
    breachReason: reasons.length > 0 ? reasons.join('; ') : null,
    sampleSize: metrics.sampleSize
  }
}
