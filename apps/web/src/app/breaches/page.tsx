'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { apiClient, type Breach } from '@/lib/api'

type BreachWithDetails = Breach & {
  agreement?: {
    id: string
    name: string
    provider_name: string
  }
}

export default function BreachesPage() {
  const router = useRouter()
  const [breaches, setBreaches] = useState<BreachWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('Demo Corp')
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all')

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

        // Fetch breaches
        const breachesData = await apiClient.getBreaches()

        // Fetch agreement details for each breach
        const breachesWithDetails = await Promise.all(
          breachesData.map(async (breach) => {
            try {
              // Fetch agreement
              const { data: agreement } = await supabase
                .from('agreements')
                .select('id, name, provider_id')
                .eq('id', breach.agreement_id)
                .single()

              if (agreement) {
                // Fetch provider name
                const { data: provider } = await supabase
                  .from('providers')
                  .select('name')
                  .eq('id', agreement.provider_id)
                  .single()

                return {
                  ...breach,
                  agreement: {
                    id: agreement.id,
                    name: agreement.name,
                    provider_name: provider?.name || 'Unknown Provider',
                  },
                }
              }

              return breach
            } catch {
              return breach
            }
          })
        )

        setBreaches(breachesWithDetails)
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Failed to load breaches')
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

  const filteredBreaches = breaches.filter((breach) => {
    if (filter === 'all') return true
    if (filter === 'resolved') return breach.resolved
    if (filter === 'unresolved') return !breach.resolved
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar orgName={orgName} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-muted-text">Loading breaches...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName={orgName} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-3">
            SLA Breaches
          </h1>
          <p className="text-body-text text-lg max-w-2xl font-medium">
            Track all detected breaches across your monitored agreements.
          </p>
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
          {(['all', 'unresolved', 'resolved'] as const).map((f) => (
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

        {filteredBreaches.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-panel border border-hairline-border/80 shadow-md">
            <h2 className="text-2xl font-bold text-ink tracking-tight mb-3">
              {filter === 'all' ? 'No breaches detected' : `No ${filter} breaches`}
            </h2>
            <p className="text-body-text font-medium max-w-md mx-auto leading-relaxed">
              {filter === 'all'
                ? 'All SLA agreements are currently meeting their uptime and latency thresholds.'
                : 'Check the other filter tabs to see breaches.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBreaches.map((breach) => (
              <div
                key={breach.id}
                className="glass-panel border-l-4 border-error border-y border-r border-hairline-border/80 rounded-panel p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-text mb-2">
                      {new Date(breach.notified_at).toLocaleDateString()} &bull;{' '}
                      {new Date(breach.notified_at).toLocaleTimeString()}
                    </div>
                    {breach.agreement && (
                      <button
                        onClick={() => router.push(`/agreements/${breach.agreement!.id}`)}
                        className="text-xl font-bold text-ink tracking-tight hover:text-link transition-colors duration-250 text-left"
                      >
                        {breach.agreement.name}
                      </button>
                    )}
                    <p className="text-sm font-semibold text-muted-text mt-1.5">
                      {breach.agreement?.provider_name || 'Unknown Provider'}
                    </p>
                  </div>
                  {breach.resolved && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-success bg-success/10 border border-success/20 px-3 py-1 rounded-full">
                      Resolved
                    </span>
                  )}
                </div>

                <div className="mb-4 relative z-10">
                  <p className="text-sm font-medium text-body-text leading-relaxed">{breach.reason}</p>
                </div>

                {breach.on_chain_tx_hash && (
                  <div className="pt-4 border-t border-hairline-border/50 relative z-10">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-text/80 mb-2">
                      ON-CHAIN SETTLEMENT (SEPOLIA TESTNET)
                    </div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${breach.on_chain_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-link hover:underline font-mono font-semibold break-all inline-block"
                    >
                      {breach.on_chain_tx_hash}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
