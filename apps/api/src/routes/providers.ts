import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { authMiddleware } from '../middleware/auth.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const createProviderSchema = z.object({
  name: z.string().min(1).max(255),
  base_url: z.string().url().optional(),
  description: z.string().max(1000).optional()
})

const updateProviderSchema = createProviderSchema.partial()

const createEndpointSchema = z.object({
  url: z.string().min(1), // Can be relative path (e.g., /health) or full URL
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']).default('GET'),
  expected_status: z.number().int().min(100).max(599).default(200),
  timeout_ms: z.number().int().min(100).max(30000).default(5000),
  probe_interval_seconds: z.number().int().min(60).max(86400).default(300),
  is_active: z.boolean().default(true)
})

const providersRoutes: FastifyPluginAsync = async (fastify) => {
  // List providers
  fastify.get('/providers', {
    onRequest: authMiddleware
  }, async (request) => {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('org_id', request.auth!.orgId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  })

  // Get provider by ID with endpoints
  fastify.get('/providers/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { data, error } = await supabase
      .from('providers')
      .select('*, endpoints(*)')
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)
      .single()

    if (error || !data) {
      return reply.code(404).send({ error: 'Provider not found' })
    }

    return data
  })

  // Create provider
  fastify.post('/providers', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const result = createProviderSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: result.error.flatten()
      })
    }

    const { data, error } = await supabase
      .from('providers')
      .insert({
        ...result.data,
        org_id: request.auth!.orgId
      })
      .select()
      .single()

    if (error) throw error

    return reply.code(201).send(data)
  })

  // Update provider
  fastify.put('/providers/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = updateProviderSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: result.error.flatten()
      })
    }

    const { data, error } = await supabase
      .from('providers')
      .update(result.data)
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)
      .select()
      .single()

    if (error || !data) {
      return reply.code(404).send({ error: 'Provider not found' })
    }

    return data
  })

  // Delete provider
  fastify.delete('/providers/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { error } = await supabase
      .from('providers')
      .delete()
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)

    if (error) {
      return reply.code(404).send({ error: 'Provider not found' })
    }

    return reply.code(204).send()
  })

  // Create endpoint for a specific provider (nested route)
  fastify.post('/providers/:id/endpoints', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = createEndpointSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: result.error.flatten()
      })
    }

    // Verify provider exists and belongs to user's org
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)
      .single()

    if (!provider) {
      return reply.code(404).send({ error: 'Provider not found' })
    }

    // Create endpoint with provider_id
    const { data, error } = await supabase
      .from('endpoints')
      .insert({
        ...result.data,
        provider_id: id
      })
      .select()
      .single()

    if (error) throw error

    return reply.code(201).send(data)
  })
}

export default providersRoutes
