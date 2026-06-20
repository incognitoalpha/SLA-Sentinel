import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { authMiddleware } from '../middleware/auth.js'
import { createClient } from '@supabase/supabase-js'
import { runEvaluations } from '../evaluator/evaluation-job.js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const evaluateNowSchema = z.object({
  agreement_id: z.string().uuid()
})

const demoRoutes: FastifyPluginAsync = async (fastify) => {
  // Evaluate now (demo convenience - bypasses cron wait)
  fastify.post('/evaluate-now', {
    onRequest: authMiddleware
  }, async (request, reply) => {
    const result = evaluateNowSchema.safeParse(request.body)

    if (!result.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: result.error.flatten()
      })
    }

    const { agreement_id } = result.data

    // Verify agreement belongs to user's org
    const { data: agreement, error: agreementError } = await supabase
      .from('agreements')
      .select('id, status')
      .eq('id', agreement_id)
      .eq('org_id', request.auth!.orgId)
      .single()

    if (agreementError || !agreement) {
      return reply.code(404).send({ error: 'Agreement not found' })
    }

    if (agreement.status !== 'active') {
      return reply.code(400).send({ error: 'Agreement must be active to evaluate' })
    }

    // Trigger evaluation in background
    setImmediate(async () => {
      try {
        await runEvaluations()
      } catch (error) {
        fastify.log.error({ error }, 'Evaluation failed')
      }
    })

    // Fetch latest evaluation
    const { data: evaluation } = await supabase
      .from('evaluations')
      .select('*')
      .eq('agreement_id', agreement_id)
      .order('evaluated_at', { ascending: false })
      .limit(1)
      .single()

    return {
      message: 'Evaluation triggered',
      latest_evaluation: evaluation || null
    }
  })
}

export default demoRoutes
