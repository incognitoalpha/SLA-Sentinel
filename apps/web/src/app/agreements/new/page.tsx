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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-muted-text">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName={orgName} onLogout={handleLogout} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/agreements')}
            className="text-sm text-muted-text hover:text-ink mb-4 inline-flex items-center"
          >
            ← Back to Agreements
          </button>
          <h1 className="text-3xl font-semibold text-ink tracking-tight mb-2">
            Create SLA Agreement
          </h1>
          <p className="text-muted-text">
            Define uptime and latency thresholds with automated escrow enforcement
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded text-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provider Selection */}
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Provider
            </h2>

            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-body-text mb-2">
                Select Provider *
              </label>
              <select
                id="provider"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
              >
                <option value="">Choose a provider...</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} ({provider.base_url})
                  </option>
                ))}
              </select>
              {providers.length === 0 && (
                <p className="mt-2 text-sm text-muted-text">
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
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Agreement Details
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-body-text mb-2">
                  Agreement Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Production API SLA"
                  className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* SLA Thresholds */}
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              SLA Thresholds
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="uptime" className="block text-sm font-medium text-body-text mb-2">
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
                  className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                />
                <p className="mt-1 text-xs text-muted-text">Provider must maintain this uptime or higher</p>
              </div>

              <div>
                <label htmlFor="latency" className="block text-sm font-medium text-body-text mb-2">
                  P95 Latency Limit (ms) *
                </label>
                <input
                  id="latency"
                  type="number"
                  min="1"
                  value={slaLatencyP95Ms}
                  onChange={(e) => setSlaLatencyP95Ms(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                />
                <p className="mt-1 text-xs text-muted-text">95th percentile response time must be below this</p>
              </div>
            </div>
          </div>

          {/* Evaluation Period */}
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Evaluation Period
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="periodType" className="block text-sm font-medium text-body-text mb-2">
                  Period Type *
                </label>
                <select
                  id="periodType"
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  required
                  className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p className="mt-1 text-xs text-muted-text">How often the SLA is evaluated</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="periodStart" className="block text-sm font-medium text-body-text mb-2">
                    Period Start *
                  </label>
                  <input
                    id="periodStart"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="periodEnd" className="block text-sm font-medium text-body-text mb-2">
                    Period End *
                  </label>
                  <input
                    id="periodEnd"
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Escrow Details (Optional) */}
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Escrow Details (Optional)
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="penalty" className="block text-sm font-medium text-body-text mb-2">
                  Penalty Amount (Wei)
                </label>
                <input
                  id="penalty"
                  type="text"
                  value={penaltyAmountWei}
                  onChange={(e) => setPenaltyAmountWei(e.target.value)}
                  placeholder="1000000000000000000"
                  className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                />
                <p className="mt-1 text-xs text-muted-text">
                  1 ETH = 1000000000000000000 Wei (1e18). Leave default for 1 ETH.
                </p>
              </div>

              <div>
                <label htmlFor="escrow" className="block text-sm font-medium text-body-text mb-2">
                  Escrow Contract Address (Sepolia)
                </label>
                <input
                  id="escrow"
                  type="text"
                  value={escrowContractAddress}
                  onChange={(e) => setEscrowContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
                />
                <p className="mt-1 text-xs text-faint-text">
                  ⚠️ Sepolia testnet only — Not real funds
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/agreements')}
              className="px-6 py-3 bg-canvas-elevated border border-hairline-border text-body-text font-medium text-sm rounded hover:border-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || providers.length === 0}
              className="flex-1 px-6 py-3 bg-ink text-on-primary font-medium text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Agreement...' : 'Create Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
