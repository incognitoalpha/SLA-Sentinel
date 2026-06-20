import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateHmacSignature, verifyHmacSignature, deliverWebhook, WebhookPayload } from './webhook.js'

describe('HMAC signature', () => {
  const secret = 'test-secret-key'
  const payload = JSON.stringify({ test: 'data' })

  it('generates consistent signatures for same input', () => {
    const sig1 = generateHmacSignature(payload, secret)
    const sig2 = generateHmacSignature(payload, secret)
    expect(sig1).toBe(sig2)
  })

  it('verifies valid signature', () => {
    const signature = generateHmacSignature(payload, secret)
    const valid = verifyHmacSignature(payload, signature, secret)
    expect(valid).toBe(true)
  })

  it('rejects invalid signature', () => {
    const signature = generateHmacSignature(payload, secret)
    const tampered = signature.slice(0, -1) + 'x'
    const valid = verifyHmacSignature(payload, tampered, secret)
    expect(valid).toBe(false)
  })

  it('rejects signature with wrong secret', () => {
    const signature = generateHmacSignature(payload, secret)
    const valid = verifyHmacSignature(payload, signature, 'wrong-secret')
    expect(valid).toBe(false)
  })
})

describe('deliverWebhook', () => {
  const mockPayload: WebhookPayload = {
    event: 'breach.created',
    timestamp: '2024-01-01T00:00:00Z',
    data: {
      breach_id: 'breach-1',
      agreement_id: 'agreement-1',
      agreement_name: 'Test SLA',
      provider_name: 'Test Provider',
      reason: 'Uptime 95% < SLA 99%',
      computed_uptime_pct: 95,
      computed_p95_latency_ms: 200
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('succeeds on first attempt with 200 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200
    })

    const result = await deliverWebhook('https://example.com/webhook', mockPayload, 'secret', 3)

    expect(result.success).toBe(true)
    expect(result.attempts).toBe(1)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('retries on 500 response and gives up after 3 attempts', async () => {
    vi.useFakeTimers()

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    })

    const deliveryPromise = deliverWebhook('https://example.com/webhook', mockPayload, 'secret', 3)

    // Fast-forward through all timeouts
    await vi.runAllTimersAsync()

    const result = await deliveryPromise

    expect(result.success).toBe(false)
    expect(result.attempts).toBe(3)
    expect(result.error).toContain('Failed after 3 attempts')
    expect(global.fetch).toHaveBeenCalledTimes(3)

    vi.useRealTimers()
  })

  it('includes correct HMAC signature in request headers', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200
    })
    global.fetch = fetchSpy

    await deliverWebhook('https://example.com/webhook', mockPayload, 'secret', 1)

    const callArgs = fetchSpy.mock.calls[0]
    const headers = callArgs[1].headers

    expect(headers['X-SLA-Sentinel-Signature']).toBeDefined()
    expect(headers['X-SLA-Sentinel-Timestamp']).toBe(mockPayload.timestamp)
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('retries with exponential backoff', async () => {
    vi.useFakeTimers()

    const delays: number[] = []
    const spySetTimeout = vi.spyOn(global, 'setTimeout')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    })

    const deliveryPromise = deliverWebhook('https://example.com/webhook', mockPayload, 'secret', 3)

    await vi.runAllTimersAsync()
    await deliveryPromise

    const timeoutCalls = spySetTimeout.mock.calls
      .filter(call => typeof call[1] === 'number')
      .map(call => call[1] as number)

    expect(timeoutCalls).toContain(2000) // 2^1 * 1000
    expect(timeoutCalls).toContain(4000) // 2^2 * 1000

    vi.useRealTimers()
  })
})
