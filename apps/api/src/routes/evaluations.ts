import { FastifyPluginAsync } from 'fastify'
import { authMiddleware } from '../middleware/auth.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const evaluationsRoutes: FastifyPluginAsync = async (fastify) => {
  // List evaluations (paginated)
  fastify.get('/evaluations', {
    onRequest: authMiddleware
  }, async (request) => {
    const { agreement_id, page = '1', limit = '50' } = request.query as {
      agreement_id?: string
      page?: string
      limit?: string
    }

    const pageNum = Math.max(1, parseInt(page, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)))
    const offset = (pageNum - 1) * limitNum

    let query = supabase
      .from('evaluations')
      .select('*, agreements!inner(org_id)', { count: 'exact' })
      .eq('agreements.org_id', request.auth!.orgId)

    if (agreement_id) {
      query = query.eq('agreement_id', agreement_id)
    }

    const { data, error, count } = await query
      .order('evaluated_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (error) throw error

    const evaluations = data?.map(({ agreements, ...evaluation }) => evaluation) || []

    return evaluations
  })

  // Get evaluation by ID
  fastify.get('/evaluations/:id', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { data, error } = await supabase
      .from('evaluations')
      .select('*, agreements!inner(org_id)')
      .eq('id', id)
      .eq('agreements.org_id', request.auth!.orgId)
      .single()

    if (error || !data) {
      return reply.code(404).send({ error: 'Evaluation not found' })
    }

    const { agreements, ...evaluation } = data
    return evaluation
  })
}

export default evaluationsRoutes
