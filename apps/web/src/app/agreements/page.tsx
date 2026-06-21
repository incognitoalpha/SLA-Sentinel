'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { apiClient, type Agreement } from '@/lib/api'

type AgreementWithProvider = Agreement & {
  provider?: { name: string }
}

export default function AgreementsPage() {
  const router = useRouter()
  const [agreements, setAgreements] = useState<AgreementWithProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('Demo Corp')
  const [filter, setFilter] = useState<'all' | 'active' | 'breached' | 'settled'>('all')

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

        // Fetch agreements
        const agreementsData = await apiClient.getAgreements()

        // Fetch provider names
        const agreementsWithProviders = await Promise.all(
          agreementsData.map(async (agreement) => {
            try {
              const { data: provider } = await supabase
                .from('providers')
                .select('name')
                .eq('id', agreement.provider_id)
                .single()

              return {
                ...agreement,
                provider: provider || undefined,
              }
            } catch {
              return agreement
            }
          })
        )

        setAgreements(agreementsWithProviders)
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Failed to load agreements')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredAgreements = agreements.filter((agreement) => {
    if (filter === 'all') return true
    return agreement.status === filter
  })


  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar orgName={orgName} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-muted-text">Loading agreements...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName={orgName} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-3">
              SLA Agreements
            </h1>
            <p className="text-body-text text-lg max-w-2xl font-medium">
              Manage uptime and latency agreements with automated escrow enforcement.
            </p>
          </div>
          <button
            onClick={() => router.push('/agreements/new')}
            className="inline-flex items-center justify-center px-6 py-3.5 bg-ink text-on-primary font-bold text-sm rounded-pill hover:opacity-90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas shadow-sm"
          >
            Create Agreement
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-panel text-xs font-semibold text-error flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {(['all', 'active', 'breached', 'settled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-pill border transition-all ${
                filter === f
                  ? 'bg-ink border-transparent text-on-primary shadow-sm'
                  : 'bg-canvas-elevated/40 border-hairline-border/80 text-muted-text hover:text-ink hover:border-hairline-border hover:bg-canvas-elevated/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredAgreements.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-panel border border-hairline-border/80 shadow-md">
            <h2 className="text-2xl font-bold text-ink tracking-tight mb-3">
              No agreements yet
            </h2>
            <p className="text-body-text font-medium max-w-md mx-auto mb-8 leading-relaxed">
              Create an SLA agreement to start monitoring your API endpoints with escrow enforcement.
            </p>
            <button
              onClick={() => router.push('/agreements/new')}
              className="px-8 py-3.5 bg-ink text-on-primary font-bold text-sm rounded-pill hover:opacity-90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas shadow-sm"
            >
              Create Agreement
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAgreements.map((agreement) => (
              <div
                key={agreement.id}
                onClick={() => router.push(`/agreements/${agreement.id}`)}
                className="group p-6 glass-panel rounded-panel hover:-translate-y-0.5 hover:shadow-xl hover:border-link/35 transition-all duration-300 relative overflow-hidden cursor-pointer border border-hairline-border/80"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-ink tracking-tight mb-1 group-hover:text-link transition-colors duration-300">
                      {agreement.name}
                    </h3>
                    <p className="text-sm font-semibold text-muted-text">
                      {agreement.provider?.name || 'Unknown Provider'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-pill border ${
                      agreement.status === 'active'
                        ? 'bg-success/10 text-success border-success/20'
                        : agreement.status === 'breached'
                        ? 'bg-error/10 text-error border-error/20 shadow-[0_0_10px_rgba(var(--error),0.1)]'
                        : 'bg-muted-text/10 text-muted-text border-muted-text/20'
                    }`}
                  >
                    {agreement.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 pt-4 border-t border-hairline-border/50">
                  <div>
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-text/80 mb-1.5">
                      UPTIME SLA
                    </div>
                    <div className="text-base font-bold text-ink tracking-tight">
                      {agreement.sla_uptime_pct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-text/80 mb-1.5">
                      P95 LATENCY
                    </div>
                    <div className="text-base font-bold text-ink tracking-tight">
                      {agreement.sla_latency_p95_ms}ms
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-text/80 mb-1.5">
                      EVALUATION PERIOD
                    </div>
                    <div className="text-base font-bold text-ink capitalize tracking-tight">
                      {agreement.period_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-text/80 mb-1.5">
                      ESCROW CONTRACT
                    </div>
                    <div className="text-base font-bold text-ink tracking-tight flex items-center gap-1.5">
                      {agreement.escrow_contract_address ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                          <span>Active</span>
                        </>
                      ) : (
                        <span className="text-muted-text font-normal text-sm">— None</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-text font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(agreement.period_start).toLocaleDateString()} &mdash;{' '}
                    {new Date(agreement.period_end).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
