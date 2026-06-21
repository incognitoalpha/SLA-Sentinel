'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { apiClient, type Provider } from '@/lib/api'

export default function NewAgreementPage() {
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('Demo Corp')

  // Form fields
  const [providerId, setProviderId] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [slaUptimePct, setSlaUptimePct] = useState<string>('99.9')
  const [slaLatencyP95Ms, setSlaLatencyP95Ms] = useState<string>('200')
  const [periodType, setPeriodType] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [periodStart, setPeriodStart] = useState<string>('')
  const [periodEnd, setPeriodEnd] = useState<string>('')
  const [penaltyAmountWei, setPenaltyAmountWei] = useState<string>('1000000000000000000') // 1 ETH
  const [escrowContractAddress, setEscrowContractAddress] = useState<string>('')

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

        // Fetch providers
        const providersData = await apiClient.getProviders()
        setProviders(providersData)

        // Set default dates (current date to 30 days from now)
        const now = new Date()
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        setPeriodStart(now.toISOString().split('T')[0])
        setPeriodEnd(thirtyDaysLater.toISOString().split('T')[0])
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Failed to load providers')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Validate inputs
      if (!providerId) {
        throw new Error('Please select a provider')
      }
      if (!name.trim()) {
        throw new Error('Please enter an agreement name')
      }
      if (parseFloat(slaUptimePct) < 0 || parseFloat(slaUptimePct) > 100) {
        throw new Error('Uptime SLA must be between 0 and 100')
      }
      if (parseInt(slaLatencyP95Ms) < 1) {
        throw new Error('Latency SLA must be at least 1ms')
      }
      if (!periodStart || !periodEnd) {
        throw new Error('Please select period start and end dates')
      }
      if (new Date(periodStart) >= new Date(periodEnd)) {
        throw new Error('Period end must be after period start')
      }

      // Create agreement
      const token = await supabase.auth.getSession()
      if (!token.data.session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/api/agreements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.data.session.access_token}`
        },
        body: JSON.stringify({
          provider_id: providerId,
          name: name.trim(),
          sla_uptime_pct: parseFloat(slaUptimePct),
          sla_latency_p95_ms: parseInt(slaLatencyP95Ms),
          period_type: periodType,
          period_start: new Date(periodStart).toISOString(),
          period_end: new Date(periodEnd).toISOString(),
          penalty_amount_wei: penaltyAmountWei || '0',
          escrow_contract_address: escrowContractAddress || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create agreement' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const agreement = await response.json()

      // Redirect to the new agreement's detail page
      router.push(`/agreements/${agreement.id}`)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to create agreement')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar orgName={orgName} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center py-20 glass-panel rounded-panel border border-hairline-border/80 shadow-md">
            <p className="text-muted-text font-semibold animate-pulse">Loading creation interface...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName={orgName} onLogout={handleLogout} />

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
        <div className="mb-10">
          <button
            onClick={() => router.push('/agreements')}
            className="text-sm font-semibold text-muted-text hover:text-ink mb-6 inline-flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span> Back to Agreements
          </button>
          <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-2">
            Create SLA Agreement
          </h1>
          <p className="text-body-text text-lg max-w-2xl font-medium">
            Define uptime and latency thresholds with automated escrow enforcement.
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Provider Selection */}
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Provider Selection
            </h2>

            <div>
              <label htmlFor="provider" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                Select Provider *
              </label>
              <select
                id="provider"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs cursor-pointer"
              >
                <option value="">Choose a provider...</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} ({provider.base_url})
                  </option>
                ))}
              </select>
              {providers.length === 0 && (
                <p className="mt-3 text-xs font-semibold text-muted-text">
                  No providers found.{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/providers')}
                    className="text-link hover:underline"
                  >
                    Create a provider first
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Agreement Details */}
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Agreement Details
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                  Agreement Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Production API SLA"
                  className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* SLA Thresholds */}
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              SLA Thresholds
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="uptime" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                  Uptime Threshold (%) *
                </label>
                <input
                  id="uptime"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={slaUptimePct}
                  onChange={(e) => setSlaUptimePct(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs"
                />
                <p className="mt-2 text-xs font-semibold text-muted-text">Provider must maintain this uptime or higher</p>
              </div>

              <div>
                <label htmlFor="latency" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                  P95 Latency Limit (ms) *
                </label>
                <input
                  id="latency"
                  type="number"
                  min="1"
                  value={slaLatencyP95Ms}
                  onChange={(e) => setSlaLatencyP95Ms(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs"
                />
                <p className="mt-2 text-xs font-semibold text-muted-text">95th percentile response time must be below this</p>
              </div>
            </div>
          </div>

          {/* Evaluation Period */}
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Evaluation Period
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="periodType" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                  Period Type *
                </label>
                <select
                  id="periodType"
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  required
                  className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs cursor-pointer"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p className="mt-2 text-xs font-semibold text-muted-text">How often the SLA is evaluated</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="periodStart" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                    Period Start *
                  </label>
                  <input
                    id="periodStart"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs cursor-pointer"
                  />
                </div>

                <div>
                  <label htmlFor="periodEnd" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                    Period End *
                  </label>
                  <input
                    id="periodEnd"
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Escrow Details (Optional) */}
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 shadow-sm">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Escrow Details (Optional)
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="penalty" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                  Penalty Amount (Wei)
                </label>
                <input
                  id="penalty"
                  type="text"
                  value={penaltyAmountWei}
                  onChange={(e) => setPenaltyAmountWei(e.target.value)}
                  placeholder="1000000000000000000"
                  className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs"
                />
                <p className="mt-2 text-xs font-semibold text-muted-text">
                  1 ETH = 1000000000000000000 Wei (1e18). Leave default for 1 ETH.
                </p>
              </div>

              <div>
                <label htmlFor="escrow" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2.5">
                  Escrow Contract Address (Sepolia)
                </label>
                <input
                  id="escrow"
                  type="text"
                  value={escrowContractAddress}
                  onChange={(e) => setEscrowContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-canvas-elevated border border-hairline-border/80 rounded-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-xs"
                />
                <p className="mt-2 text-xs font-semibold text-muted-text flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span>
                  <span>Sepolia testnet only &bull; Sandbox Escrow</span>
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/agreements')}
              className="px-6 py-3.5 bg-canvas-elevated border border-hairline-border/80 text-body-text font-bold text-sm rounded-pill hover:border-ink hover:text-ink transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || providers.length === 0}
              className="flex-1 px-6 py-3.5 bg-ink text-on-primary font-bold text-sm rounded-pill hover:opacity-90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Agreement...' : 'Create Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
