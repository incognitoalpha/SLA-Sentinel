'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/NavBar'
import { ProviderCard } from '@/components/Cards'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { apiClient, type Provider } from '@/lib/api'

type ProviderWithStatus = Provider & {
  endpointCount: number
  status: 'success' | 'error' | 'unknown'
}

export default function DashboardPage() {
  const router = useRouter()
  const [providers, setProviders] = useState<ProviderWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('Loading...')

  // Check auth and fetch data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      try {
        // Fetch organization name from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id, organizations(name)')
          .eq('id', session.user.id)
          .single()

        if (profile?.organizations) {
          const orgs = profile.organizations as unknown as { name: string }[]
          setOrgName(orgs[0]?.name || 'Demo Corp')
        }

        // Fetch providers from API
        const providersData = await apiClient.getProviders()

        // Fetch endpoint counts for each provider
        const providersWithCounts = await Promise.all(
          providersData.map(async (provider) => {
            try {
              const details = await apiClient.getProvider(provider.id)
              return {
                ...provider,
                endpointCount: details.endpoints?.length || 0,
                status: 'success' as const, // TODO: Calculate from recent probes
              }
            } catch {
              return {
                ...provider,
                endpointCount: 0,
                status: 'unknown' as const,
              }
            }
          })
        )

        setProviders(providersWithCounts)
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Failed to load providers')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router])

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
            <p className="text-muted-text">Loading providers...</p>
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
            Monitored Providers
          </h1>
          <p className="text-muted-text">
            Track uptime and latency for your third-party API dependencies
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded text-sm text-error">
            {error}
          </div>
        )}

        {providers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-ink tracking-tight mb-2">
              No providers yet
            </p>
            <p className="text-muted-text mb-6">
              Connect a provider to get started monitoring SLAs
            </p>
            <button
              onClick={() => router.push('/providers/new')}
              className="px-6 py-3 bg-ink text-on-primary font-medium text-sm rounded-pill hover:opacity-90 transition-opacity"
            >
              Add Provider
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                name={provider.name}
                baseUrl={provider.base_url}
                endpointCount={provider.endpointCount}
                status={provider.status}
                onClick={() => router.push(`/providers/${provider.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
