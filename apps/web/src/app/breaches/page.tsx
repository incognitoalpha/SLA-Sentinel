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
          setOrgName((profile.organizations as any).name || 'Demo Corp')
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
      } catch (err: any) {
        setError(err.message || 'Failed to load breaches')
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink tracking-tight mb-2">
            SLA Breaches
          </h1>
          <p className="text-muted-text">
            Track all detected breaches across your monitored agreements
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded text-sm text-error">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'unresolved', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                filter === f
                  ? 'bg-ink text-on-primary'
                  : 'bg-canvas-elevated border border-hairline-border text-body-text hover:border-ink'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredBreaches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-ink tracking-tight mb-2">
              {filter === 'all' ? 'No breaches detected' : `No ${filter} breaches`}
            </p>
            <p className="text-muted-text mb-6">
              {filter === 'all'
                ? 'All SLA agreements are currently meeting their thresholds'
                : 'Check the other filter tabs to see breaches'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBreaches.map((breach) => (
              <div
                key={breach.id}
                className="bg-canvas-elevated border-l-4 border-error rounded-card p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-mono uppercase text-muted-text mb-1">
                      {new Date(breach.notified_at).toLocaleDateString()} •{' '}
                      {new Date(breach.notified_at).toLocaleTimeString()}
                    </div>
                    {breach.agreement && (
                      <button
                        onClick={() => router.push(`/agreements/${breach.agreement!.id}`)}
                        className="text-lg font-semibold text-ink tracking-tight hover:text-link transition-colors"
                      >
                        {breach.agreement.name}
                      </button>
                    )}
                    <p className="text-sm text-muted-text mt-1">
                      {breach.agreement?.provider_name || 'Unknown Provider'}
                    </p>
                  </div>
                  {breach.resolved && (
                    <span className="text-xs font-medium text-success bg-success/10 px-3 py-1 rounded">
                      ✓ Resolved
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-sm text-body-text">{breach.reason}</p>
                </div>

                {breach.on_chain_tx_hash && (
                  <div className="pt-3 border-t border-hairline-border">
                    <div className="text-xs font-mono uppercase text-muted-text mb-1">
                      ON-CHAIN SETTLEMENT (SEPOLIA TESTNET)
                    </div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${breach.on_chain_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-link hover:underline font-mono break-all"
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
