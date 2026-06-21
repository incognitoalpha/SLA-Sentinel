'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { apiClient, type ProviderWithEndpoints } from '@/lib/api'

type Probe = {
  id: string
  endpoint_id: string
  status_code: number | null
  latency_ms: number | null
  success: boolean
  error_message: string | null
  checked_at: string
}

export default function ProviderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const providerId = params.id as string

  const [provider, setProvider] = useState<ProviderWithEndpoints | null>(null)
  const [probes, setProbes] = useState<Probe[]>([])
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

        // Fetch provider with endpoints
        const providerData = await apiClient.getProvider(providerId)
        setProvider(providerData)

        // Fetch recent probes for all endpoints
        if (providerData.endpoints?.length > 0) {
          const endpointIds = providerData.endpoints.map(e => e.id)

          const { data: probesData } = await supabase
            .from('probes')
            .select('*')
            .in('endpoint_id', endpointIds)
            .order('checked_at', { ascending: false })
            .limit(50)

          if (probesData) {
            setProbes(probesData)
          }
        }
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Failed to load provider')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, providerId])

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
            <p className="text-muted-text">Loading provider...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar orgName={orgName} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-error mb-4">{error || 'Provider not found'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-link hover:underline"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName={orgName} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm font-semibold text-muted-text hover:text-ink mb-6 inline-flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span> Back to Dashboard
          </button>
          <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-2">
            {provider.name}
          </h1>
          <p className="text-muted-text font-mono text-sm">
            {provider.base_url}
          </p>
          {provider.description && (
            <p className="text-body-text mt-3 text-base leading-relaxed font-medium">{provider.description}</p>
          )}
        </div>

        {/* Endpoints Section */}
        <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 mb-8 shadow-md">
          <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Monitored Endpoints
          </h2>

          {provider.endpoints.length === 0 ? (
            <p className="text-muted-text font-semibold animate-pulse">No endpoints configured</p>
          ) : (
            <div className="space-y-5">
              {provider.endpoints.map((endpoint) => {
                const endpointProbes = probes.filter(p => p.endpoint_id === endpoint.id)
                const latestProbe = endpointProbes[0]
                const successRate = endpointProbes.length > 0
                  ? (endpointProbes.filter(p => p.success).length / Math.min(endpointProbes.length, 20) * 100).toFixed(1)
                  : 'N/A'

                return (
                  <div
                    key={endpoint.id}
                    className="bg-canvas/30 border border-hairline-border/60 rounded-card p-5 hover:border-link/30 hover:bg-canvas/50 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                            latestProbe?.success
                              ? 'bg-success shadow-[0_0_8px_rgba(var(--success),0.5)]'
                              : 'bg-error shadow-[0_0_8px_rgba(var(--error),0.5)] animate-pulse'
                          }`} />
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-ink/5 border border-hairline-border rounded text-ink">
                            {endpoint.method}
                          </span>
                          <code className="text-sm text-ink font-mono font-bold break-all">
                            {endpoint.url}
                          </code>
                        </div>
                        <div className="text-[10px] text-muted-text font-mono font-bold uppercase tracking-wider space-x-4">
                          <span>Expected Status: {endpoint.expected_status}</span>
                          <span>Timeout: {endpoint.timeout_ms}ms</span>
                          <span>Interval: {endpoint.probe_interval_seconds}s</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-lg font-bold text-ink tracking-tight">
                          {successRate}% uptime
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-text/80 mt-0.5">
                          (last {Math.min(endpointProbes.length, 20)} probes)
                        </div>
                      </div>
                    </div>

                    {latestProbe && (
                      <div className="mt-4 pt-3.5 border-t border-hairline-border/50 text-xs font-semibold text-body-text flex flex-wrap items-center gap-2">
                        <span className="text-muted-text">Latest Probe: </span>
                        {latestProbe.success ? (
                          <span className="text-success font-mono">
                            HTTP {latestProbe.status_code} &bull; {latestProbe.latency_ms}ms
                          </span>
                        ) : (
                          <span className="text-error font-mono">
                            {latestProbe.error_message || `HTTP ${latestProbe.status_code}`}
                          </span>
                        )}
                        <span className="text-muted-text/80 font-medium ml-auto">
                          &bull; {new Date(latestProbe.checked_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Probes Table */}
        {probes.length > 0 && (
          <div className="glass-panel border border-hairline-border/80 rounded-panel p-8 shadow-md">
            <h2 className="text-xl font-bold text-ink tracking-tight mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Recent Probes
            </h2>
            <div className="overflow-x-auto border border-hairline-border/60 rounded-card bg-canvas/20">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-hairline-border/80 bg-canvas-elevated/40">
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Status
                    </th>
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Endpoint
                    </th>
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Latency
                    </th>
                    <th className="text-left py-3.5 px-4 font-mono font-bold text-[10px] uppercase tracking-widest text-muted-text">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {probes.slice(0, 20).map((probe) => {
                    const endpoint = provider.endpoints.find(e => e.id === probe.endpoint_id)
                    return (
                      <tr key={probe.id} className="border-b border-hairline-border/40 hover:bg-canvas-elevated/30 transition-colors duration-150">
                        <td className="py-3 px-4">
                          {probe.success ? (
                            <span className="text-success font-bold font-mono text-xs">
                              {probe.status_code}
                            </span>
                          ) : (
                            <span className="text-error font-bold font-mono text-xs">
                              {probe.status_code || 'ERR'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-body-text font-mono">
                          {endpoint?.url.slice(0, 70)}{endpoint && endpoint.url.length > 70 ? '...' : ''}
                        </td>
                        <td className="py-3 px-4 text-xs font-bold text-body-text font-mono">
                          {probe.latency_ms ? `${probe.latency_ms}ms` : '—'}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-muted-text">
                          {new Date(probe.checked_at).toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
