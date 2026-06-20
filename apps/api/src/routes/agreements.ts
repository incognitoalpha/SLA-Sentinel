import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { authMiddleware } from '../middleware/auth.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const createAgreementSchema = z.object({
  provider_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  sla_uptime_pct: z.number().min(0).max(100),
  sla_latency_p95_ms: z.number().int().min(1).optional(),
  period_type: z.enum(['daily', 'weekly', 'monthly']),
  period_start: z.string().datetime(),
  period_end: z.string().datetime(),
  penalty_amount_wei: z.string().optional(),
  escrow_contract_address: z.string().optional()
})

const updateAgreementSchema = createAgreementSchema.partial()

const agreementsRoutes: FastifyPluginAsync = async (fastify) => {
  // List agreements
  fastify.get('/agreements', {
    onRequest: authMiddleware
  }, async (request) => {
    const { provider_id, status } = request.query as { provider_id?: string, status?: string }

    let query = supabase
      .from('agreements')
      .select('*')
      .eq('org_id', request.auth!.orgId)

    if (provider_id) {
      query = query.eq('provider_id', provider_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  })

  // Get agreement by ID
  fastify.get('/agreements/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { data, error } = await supabase
      .from('agreements')
      .select('*')
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)
      .single()

    if (error || !data) {
      return reply.code(404).send({ error: 'Agreement not found' })
    }

    return data
  })

  // Create agreement
  fastify.post('/agreements', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const result = createAgreementSchema.safeParse(request.body)

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
      .from('agreements')
      .insert({
        ...result.data,
        org_id: request.auth!.orgId,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return reply.code(201).send(data)
  })

  // Update agreement
  fastify.put('/agreements/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = updateAgreementSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: result.error.flatten()
      })
    }

    const { data, error } = await supabase
      .from('agreements')
      .update(result.data)
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)
      .select()
      .single()

    if (error || !data) {
      return reply.code(404).send({ error: 'Agreement not found' })
    }

    return data
  })

  // Delete agreement
  fastify.delete('/agreements/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { error } = await supabase
      .from('agreements')
      .delete()
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)

    if (error) {
      return reply.code(404).send({ error: 'Agreement not found' })
    }

    return reply.code(204).send()
  })

  // Get evaluations for a specific agreement
  fastify.get('/agreements/:id/evaluations', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    // Verify agreement belongs to user's org
    const { data: agreement } = await supabase
      .from('agreements')
      .select('id')
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)
      .single()

    if (!agreement) {
      return reply.code(404).send({ error: 'Agreement not found' })
    }

    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('agreement_id', id)
      .order('evaluated_at', { ascending: false })

    if (error) throw error

    return data || []
  })

  // Get breaches for a specific agreement
  fastify.get('/agreements/:id/breaches', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    // Verify agreement belongs to user's org
    const { data: agreement } = await supabase
      .from('agreements')
      .select('id')
      .eq('id', id)
      .eq('org_id', request.auth!.orgId)
      .single()

    if (!agreement) {
      return reply.code(404).send({ error: 'Agreement not found' })
    }

    const { data, error } = await supabase
      .from('breaches')
      .select('*')
      .eq('agreement_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  })
}

export default agreementsRoutes
