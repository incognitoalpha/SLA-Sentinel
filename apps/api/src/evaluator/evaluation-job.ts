import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { evaluateAgreement, Agreement, EvaluationResult } from './evaluation.js'

let _supabase: SupabaseClient | null = null

function getSupabaseClient() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return _supabase
}

interface DueAgreement {
  id: string
  org_id: string
  provider_id: string
  name: string
  sla_uptime_pct: number
  sla_latency_p95_ms: number | null
  period_type: string
  period_start: string
  period_end: string
  escrow_contract_address: string | null
}

export async function findDueAgreements(): Promise<Agreement[]> {
  const supabase = getSupabaseClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('agreements')
    .select('id, org_id, provider_id, name, sla_uptime_pct, sla_latency_p95_ms, period_type, period_start, period_end, escrow_contract_address')
    .eq('status', 'active')
    .lt('period_end', now)
    .is('evaluated_at', null)

  if (error) {
    console.error('Failed to find due agreements:', error)
    throw error
  }

  return (data || []).map(a => ({
    id: a.id,
    org_id: a.org_id,
    provider_id: a.provider_id,
    name: a.name,
    sla_uptime_pct: a.sla_uptime_pct,
    sla_latency_p95_ms: a.sla_latency_p95_ms,
    period_type: a.period_type as 'daily' | 'weekly' | 'monthly',
    period_start: new Date(a.period_start),
    period_end: new Date(a.period_end),
    escrow_contract_address: a.escrow_contract_address
  }))
}

export async function fetchProbesForPeriod(
  providerId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<Array<{ success: boolean, latency_ms: number }>> {
  const supabase = getSupabaseClient()

  const { data: endpoints, error: endpointsError } = await supabase
    .from('endpoints')
    .select('id')
    .eq('provider_id', providerId)

  if (endpointsError) {
    console.error('Failed to fetch endpoints:', endpointsError)
    throw endpointsError
  }

  if (!endpoints || endpoints.length === 0) {
    return []
  }

  const endpointIds = endpoints.map(e => e.id)

  const { data: probes, error: probesError } = await supabase
    .from('probes')
    .select('success, latency_ms')
    .in('endpoint_id', endpointIds)
    .gte('checked_at', periodStart.toISOString())
    .lte('checked_at', periodEnd.toISOString())

  if (probesError) {
    console.error('Failed to fetch probes:', probesError)
    throw probesError
  }

  return probes || []
}

export async function saveEvaluation(result: EvaluationResult): Promise<string> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('evaluations')
    .insert({
      agreement_id: result.agreementId,
      period_start: result.periodStart.toISOString(),
      period_end: result.periodEnd.toISOString(),
      computed_uptime_pct: result.computedUptimePct,
      computed_p95_latency_ms: result.computedP95LatencyMs,
      breached: result.breached,
      sample_size: result.sampleSize
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to save evaluation:', error)
    throw error
  }

  return data.id
}

export async function saveBreach(
  evaluationId: string,
  agreementId: string,
  reason: string
): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('breaches')
    .insert({
      evaluation_id: evaluationId,
      agreement_id: agreementId,
      reason,
      resolved: false
    })

  if (error) {
    console.error('Failed to save breach:', error)
    throw error
  }
}

export async function markAgreementEvaluated(agreementId: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from('agreements')
    .update({ evaluated_at: new Date().toISOString() })
    .eq('id', agreementId)

  if (error) {
    console.error('Failed to mark agreement evaluated:', error)
    throw error
  }
}

export async function runEvaluations(): Promise<void> {
  console.log('Starting evaluation run...')

  const agreements = await findDueAgreements()
  console.log(`Found ${agreements.length} agreements due for evaluation`)

  for (const agreement of agreements) {
    console.log(`Evaluating agreement ${agreement.id}: ${agreement.name}`)

    const probes = await fetchProbesForPeriod(
      agreement.provider_id,
      agreement.period_start,
      agreement.period_end
    )

    console.log(`  Fetched ${probes.length} probes for period`)

    const result = evaluateAgreement(agreement, probes)

    const evaluationId = await saveEvaluation(result)
    console.log(`  Saved evaluation ${evaluationId}`)

    if (result.breached) {
      await saveBreach(evaluationId, agreement.id, result.breachReason!)
      console.log(`  ✗ BREACH: ${result.breachReason}`)

      // TODO Phase 5: Enqueue notification

      // Record breach on-chain if escrow exists
      if (agreement.escrow_contract_address) {
        try {
          const { recordOutcomeOnChain } = await import('../blockchain/escrow-client.js')
          const { txHash } = await recordOutcomeOnChain(agreement.id, true)
          console.log(`  ⛓ Recorded breach on-chain: ${txHash}`)

          // TODO: Save txHash to breaches.on_chain_tx_hash
        } catch (error) {
          console.error(`  Failed to record on-chain:`, error)
        }
      }
    } else {
      console.log(`  ✓ No breach`)

      // Record success on-chain if escrow exists
      if (agreement.escrow_contract_address) {
        try {
          const { recordOutcomeOnChain } = await import('../blockchain/escrow-client.js')
          const { txHash } = await recordOutcomeOnChain(agreement.id, false)
          console.log(`  ⛓ Recorded success on-chain: ${txHash}`)
        } catch (error) {
          console.error(`  Failed to record on-chain:`, error)
        }
      }
    }

    await markAgreementEvaluated(agreement.id)
  }

  console.log('Evaluation run complete')
}
