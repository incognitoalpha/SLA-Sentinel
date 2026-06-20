import { describe, it, expect } from 'vitest'
import { computeUptimePct, computeP95Latency, aggregateProbes } from './aggregation.js'

describe('computeUptimePct', () => {
  it('returns 100 for all successful probes', () => {
    const probes = [
      { success: true },
      { success: true },
      { success: true }
    ]
    expect(computeUptimePct(probes)).toBe(100)
  })

  it('returns 0 for all failed probes', () => {
    const probes = [
      { success: false },
      { success: false },
      { success: false }
    ]
    expect(computeUptimePct(probes)).toBe(0)
  })

  it('returns 95.0 for 95/100 successful probes', () => {
    const probes = Array(95).fill({ success: true })
      .concat(Array(5).fill({ success: false }))

    expect(computeUptimePct(probes)).toBe(95)
  })

  it('returns 0 for empty array', () => {
    expect(computeUptimePct([])).toBe(0)
  })

  it('handles fractional percentages', () => {
    const probes = [
      { success: true },
      { success: true },
      { success: false }
    ]
    expect(computeUptimePct(probes)).toBeCloseTo(66.67, 1)
  })
})

describe('computeP95Latency', () => {
  it('returns correct p95 for fixture array', () => {
    const probes = [
      { latency_ms: 10 },
      { latency_ms: 20 },
      { latency_ms: 30 },
      { latency_ms: 40 },
      { latency_ms: 50 },
      { latency_ms: 60 },
      { latency_ms: 70 },
      { latency_ms: 80 },
      { latency_ms: 90 },
      { latency_ms: 100 },
      { latency_ms: 200 },
      { latency_ms: 300 },
      { latency_ms: 400 },
      { latency_ms: 500 },
      { latency_ms: 1000 },
      { latency_ms: 2000 },
      { latency_ms: 3000 },
      { latency_ms: 4000 },
      { latency_ms: 5000 },
      { latency_ms: 10000 }
    ]

    // 20 values, p95 = 95th percentile = ceil(20 * 0.95) = 19th value (0-indexed: 18)
    // After sort: [..., 5000, 10000], so p95 = 5000
    expect(computeP95Latency(probes)).toBe(5000)
  })

  it('returns 0 for empty array', () => {
    expect(computeP95Latency([])).toBe(0)
  })

  it('returns only value for single probe', () => {
    expect(computeP95Latency([{ latency_ms: 150 }])).toBe(150)
  })

  it('handles unsorted input', () => {
    const probes = [
      { latency_ms: 500 },
      { latency_ms: 100 },
      { latency_ms: 300 },
      { latency_ms: 200 },
      { latency_ms: 400 }
    ]
    expect(computeP95Latency(probes)).toBe(500)
  })
})

describe('aggregateProbes', () => {
  it('combines uptime and latency metrics', () => {
    const probes = [
      { success: true, latency_ms: 100 },
      { success: true, latency_ms: 200 },
      { success: false, latency_ms: 5000 },
      { success: true, latency_ms: 150 }
    ]

    const result = aggregateProbes(probes)

    expect(result.uptimePct).toBe(75)
    expect(result.p95LatencyMs).toBe(5000)
    expect(result.sampleSize).toBe(4)
  })

  it('returns zero metrics for empty input', () => {
    const result = aggregateProbes([])

    expect(result.uptimePct).toBe(0)
    expect(result.p95LatencyMs).toBe(0)
    expect(result.sampleSize).toBe(0)
  })
})
