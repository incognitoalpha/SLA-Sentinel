export function computeUptimePct(probes: Array<{ success: boolean }>): number {
  if (probes.length === 0) return 0

  const successCount = probes.filter(p => p.success).length
  return (successCount / probes.length) * 100
}

export function computeP95Latency(probes: Array<{ latency_ms: number }>): number {
  if (probes.length === 0) return 0

  const latencies = probes.map(p => p.latency_ms).sort((a, b) => a - b)
  const p95Index = Math.ceil(latencies.length * 0.95) - 1

  return latencies[Math.max(0, p95Index)]
}

export interface AggregationResult {
  uptimePct: number
  p95LatencyMs: number
  sampleSize: number
}

export function aggregateProbes(probes: Array<{ success: boolean, latency_ms: number }>): AggregationResult {
  return {
    uptimePct: computeUptimePct(probes),
    p95LatencyMs: computeP95Latency(probes),
    sampleSize: probes.length
  }
}
