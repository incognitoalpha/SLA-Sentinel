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
    <div className="relative min-h-screen bg-canvas overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-link/5 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-10 w-[400px] h-[400px] bg-success/5 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar orgName={orgName} onLogout={handleLogout} />

        <div className="flex-grow max-w-7xl w-full mx-auto px-6 lg:px-8 py-12">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-3">
                Monitored Providers
              </h1>
              <p className="text-body-text text-lg max-w-2xl font-medium">
                Track uptime and latency for your third-party API dependencies.
              </p>
            </div>
            <button
              onClick={() => router.push('/providers/new')}
              className="inline-flex items-center justify-center px-6 py-3.5 bg-ink text-on-primary font-bold text-sm rounded-pill hover:opacity-90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas shadow-sm"
            >
              <svg className="w-4 h-4 mr-2 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Provider
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

          {providers.length === 0 ? (
            <div className="text-center py-24 glass-panel rounded-panel border border-hairline-border/80 shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-link/10 mb-6">
                <svg className="w-8 h-8 text-link" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-ink tracking-tight mb-3">
                No providers yet
              </h2>
              <p className="text-body-text font-medium max-w-md mx-auto mb-8 leading-relaxed">
                Connect your first third-party API provider to start monitoring SLAs and enforcing testnet escrow.
              </p>
              <button
                onClick={() => router.push('/providers/new')}
                className="px-8 py-3.5 bg-ink text-on-primary font-bold text-sm rounded-pill hover:opacity-90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas shadow-sm"
              >
                Add Provider
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  )
}
