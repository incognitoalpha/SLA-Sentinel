import { getLastNProbes } from './probe-runner.js'

export async function isEndpointDown(endpointId: string): Promise<boolean> {
  const lastTwo = await getLastNProbes(endpointId, 2)

  if (lastTwo.length < 2) return false

  return !lastTwo[0].success && !lastTwo[1].success
}

export function countDowntimeWindows(probes: Array<{ success: boolean }>): number {
  let downCount = 0
  let consecutiveFails = 0

  for (const probe of probes) {
    if (!probe.success) {
      consecutiveFails++
      if (consecutiveFails === 2) {
        downCount++
      }
    } else {
      consecutiveFails = 0
    }
  }

  return downCount
}
