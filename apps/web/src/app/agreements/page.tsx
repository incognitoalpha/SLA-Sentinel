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

  const getStatusColor = (status: Agreement['status']) => {
    switch (status) {
      case 'active':
        return 'text-success'
      case 'breached':
        return 'text-error'
      case 'settled':
        return 'text-muted-text'
      case 'pending':
        return 'text-warning'
      default:
        return 'text-body-text'
    }
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink tracking-tight mb-2">
            SLA Agreements
          </h1>
          <p className="text-muted-text">
            Manage uptime and latency agreements with automated escrow enforcement
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded text-sm text-error">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'breached', 'settled'] as const).map((f) => (
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

        {filteredAgreements.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-ink tracking-tight mb-2">
              No agreements yet
            </p>
            <p className="text-muted-text mb-6">
              Create an SLA agreement to start monitoring with escrow enforcement
            </p>
            <button
              onClick={() => router.push('/agreements/new')}
              className="px-6 py-3 bg-ink text-on-primary font-medium text-sm rounded-pill hover:opacity-90 transition-opacity"
            >
              Create Agreement
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAgreements.map((agreement) => (
              <div
                key={agreement.id}
                onClick={() => router.push(`/agreements/${agreement.id}`)}
                className="bg-canvas-elevated border border-hairline-border rounded-card p-6 hover:border-ink transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink tracking-tight mb-1">
                      {agreement.name}
                    </h3>
                    <p className="text-sm text-muted-text">
                      {agreement.provider?.name || 'Unknown Provider'}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono uppercase font-medium ${getStatusColor(
                      agreement.status
                    )}`}
                  >
                    {agreement.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-mono uppercase text-muted-text mb-1">
                      UPTIME SLA
                    </div>
                    <div className="text-sm font-medium text-ink">
                      {agreement.sla_uptime_pct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-muted-text mb-1">
                      P95 LATENCY
                    </div>
                    <div className="text-sm font-medium text-ink">
                      {agreement.sla_latency_p95_ms}ms
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-muted-text mb-1">
                      PERIOD
                    </div>
                    <div className="text-sm font-medium text-ink capitalize">
                      {agreement.period_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-muted-text mb-1">
                      ESCROW
                    </div>
                    <div className="text-sm font-medium text-ink">
                      {agreement.escrow_contract_address ? '✓ Active' : '— None'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-text">
                  Period: {new Date(agreement.period_start).toLocaleDateString()} →{' '}
                  {new Date(agreement.period_end).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
