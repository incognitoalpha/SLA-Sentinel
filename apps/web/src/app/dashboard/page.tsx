'use client'

import { NavBar } from '@/components/NavBar'
import { ProviderCard } from '@/components/Cards'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  // TODO: Fetch real data from API
  const mockProviders = [
    { id: '1', name: 'Stripe API', baseUrl: 'https://api.stripe.com', endpointCount: 3, status: 'success' as const },
    { id: '2', name: 'SendGrid API', baseUrl: 'https://api.sendgrid.com', endpointCount: 2, status: 'success' as const },
  ]

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar orgName="Demo Corp" onLogout={() => router.push('/login')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink tracking-tight mb-2">
            Monitored Providers
          </h1>
          <p className="text-muted-text">
            Track uptime and latency for your third-party API dependencies
          </p>
        </div>

        {mockProviders.length === 0 ? (
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
            {mockProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                name={provider.name}
                baseUrl={provider.baseUrl}
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
