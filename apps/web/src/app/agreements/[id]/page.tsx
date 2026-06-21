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
          const orgs = profile.organizations as unknown as { name: string }[]
          setOrgName(orgs[0]?.name || 'Demo Corp')
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
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Failed to load agreement')
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push('/agreements')}
            className="text-sm font-semibold text-muted-text hover:text-ink mb-6 inline-flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span> Back to Agreements
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-2">
                {agreement.name}
              </h1>
              <p className="text-muted-text font-medium">
                {agreement.provider?.name || 'Provider'}
              </p>
            </div>
            <span className={`self-start sm:self-center px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-pill border ${
              agreement.status === 'active'
                ? 'bg-success/10 text-success border-success/20'
                : agreement.status === 'breached'
                ? 'bg-error/10 text-error border-error/20 shadow-[0_0_10px_rgba(var(--error),0.1)]'
                : 'bg-muted-text/10 text-muted-text border-muted-text/20'
            }`}>
              {agreement.status}
            </span>
          </div>
        </div>

        {/* SLA Thresholds Panel */}
        <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 mb-8 shadow-md">
          <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            SLA Thresholds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4 rounded bg-canvas/30 border border-hairline-border/40">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-text mb-2">
                Uptime Threshold
              </div>
              <div className="text-4xl font-extrabold text-ink tracking-tight mb-2">
                {agreement.sla_uptime_pct}%
              </div>
              {latestEval && (
                <div className={`text-xs font-semibold ${
                  latestEval.computed_uptime_pct >= agreement.sla_uptime_pct
                    ? 'text-success'
                    : 'text-error'
                }`}>
                  Current: {latestEval.computed_uptime_pct.toFixed(2)}%
                </div>
              )}
            </div>
            <div className="p-4 rounded bg-canvas/30 border border-hairline-border/40">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-text mb-2">
                P95 Latency Limit
              </div>
              <div className="text-4xl font-extrabold text-ink tracking-tight mb-2">
                {agreement.sla_latency_p95_ms}ms
              </div>
              {latestEval && (
                <div className={`text-xs font-semibold ${
                  latestEval.computed_p95_latency_ms <= agreement.sla_latency_p95_ms
                    ? 'text-success'
                    : 'text-error'
                }`}>
                  Current: {latestEval.computed_p95_latency_ms}ms
                </div>
              )}
            </div>
            <div className="p-4 rounded bg-canvas/30 border border-hairline-border/40">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-text mb-2">
                Evaluation Period
              </div>
              <div className="text-4xl font-extrabold text-ink tracking-tight mb-2 capitalize">
                {agreement.period_type}
              </div>
              <div className="text-xs font-semibold text-muted-text">
                {new Date(agreement.period_start).toLocaleDateString()} &rarr;{' '}
                {new Date(agreement.period_end).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Escrow Info Panel */}
        {agreement.escrow_contract_address && (
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 mb-8 shadow-md">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Escrow Details
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-text mb-1.5">
                  CONTRACT ADDRESS (SEPOLIA TESTNET)
                </div>
                <a
                  href={`https://sepolia.etherscan.io/address/${agreement.escrow_contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-link hover:underline break-all inline-block font-semibold"
                >
                  {agreement.escrow_contract_address}
                </a>
              </div>
              {agreement.deposit_tx_hash && (
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-text mb-1.5">
                    DEPOSIT TRANSACTION
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${agreement.deposit_tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-link hover:underline break-all inline-block font-semibold"
                  >
                    {agreement.deposit_tx_hash}
                  </a>
                </div>
              )}
              <div className="pt-2 text-xs font-semibold text-muted-text flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
                <span>Sepolia Testnet Deployment Only &bull; Sandbox Escrow</span>
              </div>
            </div>
          </div>
        )}

        {/* Breach Timeline */}
        {breaches.length > 0 && (
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 mb-8 shadow-md">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Breach History
            </h2>
            <div className="space-y-6">
              {breaches.map((breach) => (
                <div
                  key={breach.id}
                  className="border-l-4 border-error pl-5 py-2 relative"
                >
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-text mb-1">
                    {new Date(breach.notified_at).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-body-text mb-2 leading-relaxed">
                    {breach.reason}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {breach.on_chain_tx_hash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${breach.on_chain_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-link hover:underline font-mono font-semibold"
                      >
                        View on-chain transaction &rarr;
                      </a>
                    )}
                    {breach.resolved && (
                      <span className="text-xs font-bold text-success flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluation History */}
        {evaluations.length > 0 && (
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 shadow-md">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Evaluation History
            </h2>
            <div className="overflow-x-auto border border-hairline-border/60 rounded-card bg-canvas/20">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-hairline-border/80 bg-canvas-elevated/40">
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Period
                    </th>
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Uptime
                    </th>
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      P95 Latency
                    </th>
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Samples
                    </th>
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((evaluation) => (
                    <tr key={evaluation.id} className="border-b border-hairline-border/40 hover:bg-canvas-elevated/30 transition-colors duration-150">
                      <td className="py-3 px-4 text-xs font-medium text-body-text">
                        {new Date(evaluation.period_start).toLocaleDateString()} &mdash;{' '}
                        {new Date(evaluation.period_end).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold">
                        <span className={
                          evaluation.computed_uptime_pct >= agreement.sla_uptime_pct
                            ? 'text-success'
                            : 'text-error'
                        }>
                          {evaluation.computed_uptime_pct.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold">
                        <span className={
                          evaluation.computed_p95_latency_ms <= agreement.sla_latency_p95_ms
                            ? 'text-success'
                            : 'text-error'
                        }>
                          {evaluation.computed_p95_latency_ms}ms
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-muted-text">
                        {evaluation.sample_size}
                      </td>
                      <td className="py-3 px-4">
                        {evaluation.breached ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-error bg-error/10 border border-error/20 px-2 py-0.5 rounded">BREACH</span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded">PASS</span>
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
