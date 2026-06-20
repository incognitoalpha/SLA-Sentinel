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
  }

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName={orgName} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-muted-text hover:text-ink mb-4 inline-flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-semibold text-ink tracking-tight mb-2">
            {provider.name}
          </h1>
          <p className="text-muted-text font-mono text-sm">
            {provider.base_url}
          </p>
          {provider.description && (
            <p className="text-body-text mt-2">{provider.description}</p>
          )}
        </div>

        {/* Endpoints Section */}
        <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
            Monitored Endpoints
          </h2>

          {provider.endpoints.length === 0 ? (
            <p className="text-muted-text">No endpoints configured</p>
          ) : (
            <div className="space-y-4">
              {provider.endpoints.map((endpoint) => {
                const endpointProbes = probes.filter(p => p.endpoint_id === endpoint.id)
                const latestProbe = endpointProbes[0]
                const successRate = endpointProbes.length > 0
                  ? (endpointProbes.filter(p => p.success).length / Math.min(endpointProbes.length, 20) * 100).toFixed(1)
                  : 'N/A'

                return (
                  <div
                    key={endpoint.id}
                    className="border border-hairline-border rounded p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            latestProbe?.success ? 'bg-success' : 'bg-error'
                          }`} />
                          <code className="text-sm text-ink font-mono">
                            {endpoint.method} {endpoint.url}
                          </code>
                        </div>
                        <div className="text-xs text-muted-text font-mono space-x-4">
                          <span>Expected: {endpoint.expected_status}</span>
                          <span>Timeout: {endpoint.timeout_ms}ms</span>
                          <span>Interval: {endpoint.probe_interval_seconds}s</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-ink">
                          {successRate}% uptime
                        </div>
                        <div className="text-xs text-muted-text">
                          (last {Math.min(endpointProbes.length, 20)} probes)
                        </div>
                      </div>
                    </div>

                    {latestProbe && (
                      <div className="mt-3 pt-3 border-t border-hairline-border text-xs text-body-text">
                        <span>Latest: </span>
                        {latestProbe.success ? (
                          <span className="text-success">
                            {latestProbe.status_code} • {latestProbe.latency_ms}ms
                          </span>
                        ) : (
                          <span className="text-error">
                            {latestProbe.error_message || `HTTP ${latestProbe.status_code}`}
                          </span>
                        )}
                        <span className="text-muted-text ml-2">
                          • {new Date(latestProbe.checked_at).toLocaleString()}
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
          <div className="bg-canvas-elevated border border-hairline-border rounded-card p-6">
            <h2 className="text-xl font-semibold text-ink tracking-tight mb-4">
              Recent Probes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline-border">
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Status
                    </th>
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Endpoint
                    </th>
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Latency
                    </th>
                    <th className="text-left py-2 px-3 font-mono font-medium text-xs uppercase text-muted-text">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {probes.slice(0, 20).map((probe) => {
                    const endpoint = provider.endpoints.find(e => e.id === probe.endpoint_id)
                    return (
                      <tr key={probe.id} className="border-b border-hairline-border">
                        <td className="py-2 px-3">
                          {probe.success ? (
                            <span className="text-success font-mono text-xs">
                              {probe.status_code}
                            </span>
                          ) : (
                            <span className="text-error font-mono text-xs">
                              {probe.status_code || 'ERR'}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-body-text font-mono text-xs">
                          {endpoint?.url.slice(0, 50)}{endpoint && endpoint.url.length > 50 ? '...' : ''}
                        </td>
                        <td className="py-2 px-3 text-body-text font-mono text-xs">
                          {probe.latency_ms ? `${probe.latency_ms}ms` : '—'}
                        </td>
                        <td className="py-2 px-3 text-muted-text text-xs">
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
