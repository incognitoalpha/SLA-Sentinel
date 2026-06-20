'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { apiClient, type AgreementDetail, type Evaluation, type Breach } from '@/lib/api'

export default function AgreementDetailPage() {
  const router = useRouter()
  const params = useParams()
  const agreementId = params.id as string

  const [agreement, setAgreement] = useState<AgreementDetail | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [breaches, setBreaches] = useState<Breach[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('Demo Corp')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      try {
        // Fetch org name
        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id, organizations(name)')
          .eq('id', session.user.id)
          .single()

        if (profile?.organizations) {
          setOrgName((profile.organizations as any).name || 'Demo Corp')
        }

        // Fetch agreement detail
        const agreementData = await apiClient.getAgreement(agreementId)
        setAgreement(agreementData)

        // Fetch evaluations
        const evaluationsData = await apiClient.getAgreementEvaluations(agreementId)
        setEvaluations(evaluationsData)

        // Fetch breaches
        const breachesData = await apiClient.getAgreementBreaches(agreementId)
        setBreaches(breachesData)
      } catch (err: any) {
        setError(err.message || 'Failed to load agreement')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, agreementId])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success'
      case 'breached': return 'text-error'
      case 'settled': return 'text-muted-text'
      case 'pending': return 'text-warning'
      default: return 'text-body-text'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar orgName={orgName} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-muted-text">Loading agreement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !agreement) {
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar orgName={orgName} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-error mb-4">{error || 'Agreement not found'}</p>
            <button
              onClick={() => router.push('/agreements')}
              className="text-link hover:underline"
            >
              ← Back to Agreements
            </button>
          </div>
        </div>
      </div>
    )
  }

  const latestEval = agreement.latest_evaluation || evaluations[0]

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName={orgName} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/agreements')}
            className="text-sm text-muted-text hover:text-ink mb-4 inline-flex items-center"
          >
            ← Back to Agreements
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-ink tracking-tight mb-2">
                {agreement.name}
              </h1>
              <p className="text-muted-text">
                {agreement.provider?.name || 'Provider'}
              </p>
            </div>
            <span className={`text-xs font-mono uppercase font-medium ${getStatusColor(agreement.status)}`}>
              {agreement.status}
            </span>
          </div>
        </div>

        {/* SLA Thresholds Panel */}
        <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-ink tracking-tight mb-6">
            SLA Thresholds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-mono uppercase text-muted-text mb-2">
                UPTIME THRESHOLD
              </div>
              <div className="text-3xl font-semibold text-ink tracking-tight">
                {agreement.sla_uptime_pct}%
              </div>
              {latestEval && (
                <div className={`text-sm mt-1 ${
                  latestEval.computed_uptime_pct >= agreement.sla_uptime_pct
                    ? 'text-success'
                    : 'text-error'
                }`}>
                  Current: {latestEval.computed_uptime_pct.toFixed(2)}%
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-muted-text mb-2">
                P95 LATENCY LIMIT
              </div>
              <div className="text-3xl font-semibold text-ink tracking-tight">
                {agreement.sla_latency_p95_ms}ms
              </div>
              {latestEval && (
                <div className={`text-sm mt-1 ${
                  latestEval.computed_p95_latency_ms <= agreement.sla_latency_p95_ms
                    ? 'text-success'
                    : 'text-error'
                }`}>
                  Current: {latestEval.computed_p95_latency_ms}ms
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-muted-text mb-2">
                EVALUATION PERIOD
              </div>
              <div className="text-3xl font-semibold text-ink tracking-tight capitalize">
                {agreement.period_type}
              </div>
              <div className="text-sm text-muted-text mt-1">
                {new Date(agreement.period_start).toLocaleDateString()} →{' '}
                {new Date(agreement.period_end).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Escrow Info Panel */}
        {agreement.escrow_contract_address && (
          <div className="bg-canvas-elevated border border-hairline-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Escrow Details
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-mono uppercase text-muted-text mb-1">
                  CONTRACT ADDRESS (SEPOLIA TESTNET)
                </div>
                <a
                  href={`https://sepolia.etherscan.io/address/${agreement.escrow_contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-link hover:underline break-all"
                >
                  {agreement.escrow_contract_address}
                </a>
              </div>
              {agreement.deposit_tx_hash && (
                <div>
                  <div className="text-xs font-mono uppercase text-muted-text mb-1">
                    DEPOSIT TRANSACTION
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${agreement.deposit_tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-link hover:underline break-all"
                  >
                    {agreement.deposit_tx_hash}
                  </a>
                </div>
              )}
              <div className="pt-2 text-xs text-faint-text">
                ⚠️ Testnet only — Not real funds
              </div>
            </div>
          </div>
        )}

        {/* Breach Timeline */}
        {breaches.length > 0 && (
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Breach History
            </h2>
            <div className="space-y-4">
              {breaches.map((breach) => (
                <div
                  key={breach.id}
                  className="border-l-4 border-error pl-4 py-2"
                >
                  <div className="text-xs font-mono uppercase text-muted-text mb-1">
                    {new Date(breach.notified_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-body-text mb-1">
                    {breach.reason}
                  </div>
                  {breach.on_chain_tx_hash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${breach.on_chain_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-link hover:underline font-mono"
                    >
                      View on-chain transaction →
                    </a>
                  )}
                  {breach.resolved && (
                    <span className="ml-2 text-xs text-success">✓ Resolved</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluation History */}
        {evaluations.length > 0 && (
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Evaluation History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline-border">
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Period
                    </th>
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Uptime
                    </th>
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      P95 Latency
                    </th>
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Samples
                    </th>
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((evaluation) => (
                    <tr key={evaluation.id} className="border-b border-hairline-border">
                      <td className="py-2 px-3 text-xs text-body-text">
                        {new Date(evaluation.period_start).toLocaleDateString()} →{' '}
                        {new Date(evaluation.period_end).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 font-mono text-xs">
                        <span className={
                          evaluation.computed_uptime_pct >= agreement.sla_uptime_pct
                            ? 'text-success'
                            : 'text-error'
                        }>
                          {evaluation.computed_uptime_pct.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-xs">
                        <span className={
                          evaluation.computed_p95_latency_ms <= agreement.sla_latency_p95_ms
                            ? 'text-success'
                            : 'text-error'
                        }>
                          {evaluation.computed_p95_latency_ms}ms
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-text">
                        {evaluation.sample_size}
                      </td>
                      <td className="py-2 px-3">
                        {evaluation.breached ? (
                          <span className="text-xs font-medium text-error">BREACH</span>
                        ) : (
                          <span className="text-xs font-medium text-success">PASS</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
