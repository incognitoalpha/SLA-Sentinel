import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { authMiddleware } from '../middleware/auth.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const createEndpointSchema = z.object({
  provider_id: z.string().uuid(),
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']).default('GET'),
  expected_status: z.number().int().min(100).max(599).default(200),
  timeout_ms: z.number().int().min(100).max(30000).default(5000),
  probe_interval_seconds: z.number().int().min(60).max(86400).default(300),
  is_active: z.boolean().default(true)
})

const updateEndpointSchema = createEndpointSchema.partial()

const endpointsRoutes: FastifyPluginAsync = async (fastify) => {
  // List endpoints (optionally filtered by provider_id)
  fastify.get('/endpoints', {
    onRequest: authMiddleware
  }, async (request) => {
    const { provider_id } = request.query as { provider_id?: string }

    let query = supabase
      .from('endpoints')
      .select('*, providers!inner(org_id)')
      .eq('providers.org_id', request.auth!.orgId)

    if (provider_id) {
      query = query.eq('provider_id', provider_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    // Strip join data
    const endpoints = data?.map(({ providers: _providers, ...endpoint }) => endpoint) || []

    return { endpoints }
  })

  // Get endpoint by ID
  fastify.get('/endpoints/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { data, error } = await supabase
      .from('endpoints')
      .select('*, providers!inner(org_id)')
      .eq('id', id)
      .eq('providers.org_id', request.auth!.orgId)
      .single()

    if (error || !data) {
      return reply.code(404).send({ error: 'Endpoint not found' })
    }

    const { providers: _providers2, ...endpoint } = data
    return endpoint
  })

  // Create endpoint
  fastify.post('/endpoints', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const result = createEndpointSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: result.error.flatten()
      })
    }

    // Verify provider belongs to user's org
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('id', result.data.provider_id)
      .eq('org_id', request.auth!.orgId)
      .single()

    if (!provider) {
      return reply.code(400).send({ error: 'Provider not found or access denied' })
    }

    const { data, error } = await supabase
      .from('endpoints')
      .insert(result.data)
      .select()
      .single()

    if (error) throw error

    return reply.code(201).send(data)
  })

  // Update endpoint
  fastify.put('/endpoints/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = updateEndpointSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: result.error.flatten()
      })
    }

    const { data, error } = await supabase
      .from('endpoints')
      .update(result.data)
      .eq('id', id)
      .select('*, providers!inner(org_id)')
      .eq('providers.org_id', request.auth!.orgId)
      .single()

    if (error || !data) {
      return reply.code(404).send({ error: 'Endpoint not found' })
    }

    const { providers: _providers, ...endpoint } = data
    return endpoint
  })

  // Delete endpoint
  fastify.delete('/endpoints/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    // Use subquery to check org ownership
    const { data: endpoint } = await supabase
      .from('endpoints')
      .select('id, providers!inner(org_id)')
      .eq('id', id)
      .eq('providers.org_id', request.auth!.orgId)
      .single()

    if (!endpoint) {
      return reply.code(404).send({ error: 'Endpoint not found' })
    }

    const { error } = await supabase
      .from('endpoints')
      .delete()
      .eq('id', id)

    if (error) throw error

    return reply.code(204).send()
  })
}

export default endpointsRoutes
