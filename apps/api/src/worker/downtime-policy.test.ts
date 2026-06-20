import { describe, it, expect } from 'vitest'
import { countDowntimeWindows } from './downtime-policy.js'

describe('Downtime Policy: 2 consecutive failures', () => {
  it('does not flag single isolated failure as downtime', () => {
    const probes = [
      { success: true },
      { success: false },
      { success: true }
    ]

    const downCount = countDowntimeWindows(probes)
    expect(downCount).toBe(0)
  })

  it('flags two consecutive failures as downtime', () => {
    const probes = [
      { success: true },
      { success: false },
      { success: false },
      { success: true }
    ]

    const downCount = countDowntimeWindows(probes)
    expect(downCount).toBe(1)
  })

  it('counts multiple downtime windows correctly', () => {
    const probes = [
      { success: false },
      { success: false },
      { success: true },
      { success: false },
      { success: false },
      { success: false },
      { success: true }
    ]

    const downCount = countDowntimeWindows(probes)
    expect(downCount).toBe(2)
  })

  it('handles all failures correctly', () => {
    const probes = [
      { success: false },
      { success: false },
      { success: false },
      { success: false }
    ]

    const downCount = countDowntimeWindows(probes)
    expect(downCount).toBe(1)
  })

  it('handles no failures', () => {
    const probes = [
      { success: true },
      { success: true },
      { success: true }
    ]

    const downCount = countDowntimeWindows(probes)
    expect(downCount).toBe(0)
  })
})
