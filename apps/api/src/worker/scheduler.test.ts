import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shouldProbeEndpoint } from './scheduler.js'
import * as probeRunner from './probe-runner.js'

vi.mock('./probe-runner.js', () => ({
  getLastProbeTime: vi.fn()
}))

describe('shouldProbeEndpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true if endpoint has never been probed', async () => {
    vi.mocked(probeRunner.getLastProbeTime).mockResolvedValue(null)

    const endpoint = {
      id: 'endpoint-1',
      url: 'https://api.example.com',
      method: 'GET',
      expected_status: 200,
      timeout_ms: 5000,
      probe_interval_seconds: 300
    }

    const should = await shouldProbeEndpoint(endpoint)
    expect(should).toBe(true)
  })

  it('returns false if interval has not elapsed', async () => {
    const now = new Date()
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000)
    vi.mocked(probeRunner.getLastProbeTime).mockResolvedValue(twoMinutesAgo)

    const endpoint = {
      id: 'endpoint-1',
      url: 'https://api.example.com',
      method: 'GET',
      expected_status: 200,
      timeout_ms: 5000,
      probe_interval_seconds: 300 // 5 minutes
    }

    const should = await shouldProbeEndpoint(endpoint)
    expect(should).toBe(false)
  })

  it('returns true if interval has elapsed', async () => {
    const now = new Date()
    const sixMinutesAgo = new Date(now.getTime() - 6 * 60 * 1000)
    vi.mocked(probeRunner.getLastProbeTime).mockResolvedValue(sixMinutesAgo)

    const endpoint = {
      id: 'endpoint-1',
      url: 'https://api.example.com',
      method: 'GET',
      expected_status: 200,
      timeout_ms: 5000,
      probe_interval_seconds: 300 // 5 minutes
    }

    const should = await shouldProbeEndpoint(endpoint)
    expect(should).toBe(true)
  })
})
