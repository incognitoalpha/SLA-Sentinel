import { describe, it, expect } from 'vitest'
import { evaluateAgreement, Agreement } from './evaluation.js'

const baseAgreement: Agreement = {
  id: 'agreement-1',
  org_id: 'org-1',
  provider_id: 'provider-1',
  name: 'Test SLA',
  sla_uptime_pct: 99.5,
  sla_latency_p95_ms: 500,
  period_type: 'daily',
  period_start: new Date('2024-01-01T00:00:00Z'),
  period_end: new Date('2024-01-01T23:59:59Z'),
  escrow_contract_address: null
}

describe('evaluateAgreement', () => {
  it('returns no breach when metrics meet SLA', () => {
    const probes = Array(100).fill(null).map((_, i) => ({
      success: true,
      latency_ms: 100 + i
    }))

    const result = evaluateAgreement(baseAgreement, probes)

    expect(result.breached).toBe(false)
    expect(result.breachReason).toBeNull()
    expect(result.computedUptimePct).toBe(100)
    expect(result.sampleSize).toBe(100)
  })

  it('detects uptime breach', () => {
    const probes = [
      ...Array(98).fill({ success: true, latency_ms: 100 }),
      ...Array(2).fill({ success: false, latency_ms: 5000 })
    ]

    const result = evaluateAgreement(baseAgreement, probes)

    expect(result.breached).toBe(true)
    expect(result.breachReason).toContain('Uptime 98.00% < SLA 99.5%')
    expect(result.computedUptimePct).toBe(98)
  })

  it('detects latency breach', () => {
    const probes = Array(100).fill(null).map((_, i) => ({
      success: true,
      latency_ms: i < 94 ? 100 : 1000 // 94 at 100ms, 6 at 1000ms → p95 at index 94 = 1000ms
    }))

    const result = evaluateAgreement(baseAgreement, probes)

    expect(result.breached).toBe(true)
    expect(result.breachReason).toContain('P95 latency 1000ms > SLA 500ms')
    expect(result.computedP95LatencyMs).toBe(1000)
  })

  it('detects both uptime and latency breach', () => {
    const probes = [
      ...Array(90).fill({ success: true, latency_ms: 100 }),
      ...Array(10).fill({ success: false, latency_ms: 10000 })
    ]

    const result = evaluateAgreement(baseAgreement, probes)

    expect(result.breached).toBe(true)
    expect(result.breachReason).toContain('Uptime')
    expect(result.breachReason).toContain('P95 latency')
  })

  it('handles zero-probe window without breaching', () => {
    const result = evaluateAgreement(baseAgreement, [])

    expect(result.breached).toBe(false)
    expect(result.breachReason).toBeNull()
    expect(result.sampleSize).toBe(0)
    expect(result.computedUptimePct).toBe(0)
  })

  it('handles agreement with no latency SLA', () => {
    const agreement = { ...baseAgreement, sla_latency_p95_ms: null }
    const probes = Array(100).fill({ success: true, latency_ms: 10000 })

    const result = evaluateAgreement(agreement, probes)

    expect(result.breached).toBe(false)
    expect(result.breachReason).toBeNull()
  })

  it('includes correct period dates in result', () => {
    const probes = [{ success: true, latency_ms: 100 }]
    const result = evaluateAgreement(baseAgreement, probes)

    expect(result.periodStart).toEqual(baseAgreement.period_start)
    expect(result.periodEnd).toEqual(baseAgreement.period_end)
  })
})
