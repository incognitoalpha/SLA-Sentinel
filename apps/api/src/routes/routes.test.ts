import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Import routes
import providersRoutes from './providers.js'
import agreementsRoutes from './agreements.js'
import breachesRoutes from './breaches.js'
import evaluationsRoutes from './evaluations.js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('API Integration Tests', () => {
  let app: any
  let orgId: string
  let userId: string
  let authToken: string
  let providerId: string
  let agreementId: string

  beforeAll(async () => {
    // Setup Fastify app
    app = Fastify()

    // Register auth middleware hook for all routes
    app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
      // Mock auth context for tests
      const authHeader = request.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)

        // Validate token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
        if (user && !error) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('org_id, role')
            .eq('id', user.id)
            .single()

          if (profile) {
            request.auth = {
              userId: user.id,
              orgId: profile.org_id,
              role: profile.role
            }
            return
          }
        }
      }

      // No valid auth - routes will handle 401
      return reply.code(401).send({ error: 'Unauthorized' })
    })

    // Register routes
    app.register(providersRoutes, { prefix: '/api' })
    app.register(agreementsRoutes, { prefix: '/api' })
    app.register(breachesRoutes, { prefix: '/api' })
    app.register(evaluationsRoutes, { prefix: '/api' })

    await app.ready()

    // Create test organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({ name: 'API Test Org' })
      .select()
      .single()

    if (orgError) throw orgError
    orgId = org.id

    // Create test user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: `api-test-${Date.now()}@example.com`,
      password: 'testpass123',
      email_confirm: true
    })
    if (userError) throw userError
    userId = user!.id

    // Create profile
    await supabaseAdmin.from('profiles').insert({
      id: userId,
      org_id: orgId,
      role: 'owner'
    })

    // Sign in to get token
    const { data: session } = await supabaseAdmin.auth.signInWithPassword({
      email: user!.email!,
      password: 'testpass123'
    })
    authToken = session?.session?.access_token!
  })

  afterAll(async () => {
    // Cleanup
    if (agreementId) {
      await supabaseAdmin.from('agreements').delete().eq('id', agreementId)
    }
    if (providerId) {
      await supabaseAdmin.from('providers').delete().eq('id', providerId)
    }
    await supabaseAdmin.auth.admin.deleteUser(userId)
    await supabaseAdmin.from('organizations').delete().eq('id', orgId)
    await app.close()
  })

  describe('Providers API', () => {
    it('GET /api/providers should return empty array initially', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/providers',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true)
    })

    it('POST /api/providers should create a provider', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/providers',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        payload: {
          name: 'Test Provider',
          base_url: 'https://api.example.com',
          description: 'Test provider description'
        }
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('id')
      expect(body.name).toBe('Test Provider')
      expect(body.org_id).toBe(orgId)
      providerId = body.id
    })

    it('GET /api/providers/:id should return provider with endpoints', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/providers/${providerId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.id).toBe(providerId)
      expect(body).toHaveProperty('endpoints')
      expect(Array.isArray(body.endpoints)).toBe(true)
    })

    it('POST /api/providers/:id/endpoints should create an endpoint', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/api/providers/${providerId}/endpoints`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        payload: {
          url: '/health',
          method: 'GET',
          expected_status: 200,
          timeout_ms: 5000,
          probe_interval_seconds: 60
        }
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('id')
      expect(body.provider_id).toBe(providerId)
      expect(body.url).toBe('/health')
    })

    it('PUT /api/providers/:id should update a provider', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/api/providers/${providerId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        payload: {
          name: 'Updated Provider Name'
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.name).toBe('Updated Provider Name')
    })
  })

  describe('Agreements API', () => {
    it('GET /api/agreements should return array (fixed bug)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/agreements',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true) // Should be array, not {agreements: [...]}
    })

    it('POST /api/agreements should create an agreement', async () => {
      const now = new Date()
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // +30 days

      const response = await app.inject({
        method: 'POST',
        url: '/api/agreements',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        payload: {
          provider_id: providerId,
          name: 'Test Agreement',
          sla_uptime_pct: 99.9,
          sla_latency_p95_ms: 200,
          period_type: 'monthly',
          period_start: now.toISOString(),
          period_end: endDate.toISOString(),
          penalty_amount_wei: '1000000000000000000' // 1 ETH
        }
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('id')
      expect(body.name).toBe('Test Agreement')
      expect(body.status).toBe('pending')
      agreementId = body.id
    })

    it('GET /api/agreements/:id should return agreement detail', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/agreements/${agreementId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.id).toBe(agreementId)
      expect(body.sla_uptime_pct).toBe(99.9)
    })

    it('GET /api/agreements/:id/evaluations should return array (new route)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/agreements/${agreementId}/evaluations`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true) // Should be array, not wrapped
    })

    it('GET /api/agreements/:id/breaches should return array (new route)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/agreements/${agreementId}/breaches`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true) // Should be array, not wrapped
    })

    it('PUT /api/agreements/:id should update agreement', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/api/agreements/${agreementId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        payload: {
          name: 'Updated Agreement Name'
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body.name).toBe('Updated Agreement Name')
    })
  })

  describe('Breaches API', () => {
    it('GET /api/breaches should return array (fixed bug)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/breaches',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true) // Should be array, not {breaches: [...], pagination}
    })

    it('GET /api/breaches?agreement_id=... should filter by agreement', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/breaches?agreement_id=${agreementId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true)
    })
  })

  describe('Evaluations API', () => {
    it('GET /api/evaluations should return array (fixed bug)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/evaluations',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true) // Should be array, not {evaluations: [...], pagination}
    })

    it('GET /api/evaluations?agreement_id=... should filter by agreement', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/evaluations?agreement_id=${agreementId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(Array.isArray(body)).toBe(true)
    })
  })

  describe('Auth Middleware', () => {
    it('should reject requests without auth token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/providers'
      })

      expect(response.statusCode).toBe(401)
    })

    it('should reject requests with invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/providers',
        headers: {
          Authorization: 'Bearer invalid-token-12345'
        }
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
