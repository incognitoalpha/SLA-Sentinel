import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse, delay } from 'msw'
import { probeEndpoint } from './probe-runner.js'

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('probeEndpoint', () => {
  it('records success + latency for healthy endpoint', async () => {
    server.use(
      http.get('https://api.example.com/health', () => {
        return HttpResponse.json({ status: 'ok' }, { status: 200 })
      })
    )

    const result = await probeEndpoint(
      'endpoint-1',
      'https://api.example.com/health',
      'GET',
      200,
      5000
    )

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)
    expect(result.latencyMs).toBeGreaterThan(0)
    expect(result.latencyMs).toBeLessThan(1000)
    expect(result.errorMessage).toBeNull()
    expect(result.endpointId).toBe('endpoint-1')
  })

  it('records failure with correct error_message for timeout', async () => {
    server.use(
      http.get('https://api.slow.com/endpoint', async () => {
        await delay(6000)
        return HttpResponse.json({})
      })
    )

    const result = await probeEndpoint(
      'endpoint-2',
      'https://api.slow.com/endpoint',
      'GET',
      200,
      1000
    )

    expect(result.success).toBe(false)
    expect(result.statusCode).toBeNull()
    expect(result.errorMessage).toContain('Timeout after 1000ms')
    expect(result.latencyMs).toBeGreaterThanOrEqual(1000)
  })

  it('records failure with correct error_message for 500 response', async () => {
    server.use(
      http.get('https://api.broken.com/endpoint', () => {
        return HttpResponse.json({ error: 'Internal error' }, { status: 500 })
      })
    )

    const result = await probeEndpoint(
      'endpoint-3',
      'https://api.broken.com/endpoint',
      'GET',
      200,
      5000
    )

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(500)
    expect(result.errorMessage).toBe('Expected 200, got 500')
    expect(result.latencyMs).toBeGreaterThan(0)
  })

  it('records failure for non-expected status code', async () => {
    server.use(
      http.post('https://api.example.com/resource', () => {
        return HttpResponse.json({ id: 123 }, { status: 200 })
      })
    )

    const result = await probeEndpoint(
      'endpoint-4',
      'https://api.example.com/resource',
      'POST',
      201,
      5000
    )

    expect(result.success).toBe(false)
    expect(result.statusCode).toBe(200)
    expect(result.errorMessage).toBe('Expected 201, got 200')
  })

  it('distinguishes DNS failure in error_message', async () => {
    const result = await probeEndpoint(
      'endpoint-5',
      'https://definitely-does-not-exist-domain-12345.com/api',
      'GET',
      200,
      5000
    )

    expect(result.success).toBe(false)
    expect(result.statusCode).toBeNull()
    expect(result.errorMessage).toMatch(/DNS resolution failed|Network error|getaddrinfo/)
  })

  it('handles connection refused error', async () => {
    const result = await probeEndpoint(
      'endpoint-6',
      'http://localhost:99999/api',
      'GET',
      200,
      5000
    )

    expect(result.success).toBe(false)
    expect(result.statusCode).toBeNull()
    expect(result.errorMessage).toMatch(/Connection refused|Network error|ECONNREFUSED/)
  })
})
