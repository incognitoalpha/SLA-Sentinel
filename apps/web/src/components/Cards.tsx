'use client'

export function StatusDot({ status }: { status: 'success' | 'error' | 'unknown' }) {
  const colors = {
    success: 'bg-success',
    error: 'bg-error',
    unknown: 'bg-muted-text'
  }

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[status]}`}
      aria-label={`Status: ${status}`}
    />
  )
}

export function ProviderCard({
  name,
  baseUrl,
  endpointCount,
  status,
  onClick
}: {
  name: string
  baseUrl?: string
  endpointCount: number
  status: 'success' | 'error' | 'unknown'
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-6 bg-canvas-elevated border border-hairline-border rounded-card hover:border-ink/20 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-ink tracking-tight">{name}</h3>
        <StatusDot status={status} />
      </div>

      {baseUrl && (
        <p className="text-sm font-mono text-muted-text mb-3 truncate">{baseUrl}</p>
      )}

      <div className="flex items-center space-x-4 text-xs text-muted-text">
        <span className="font-mono uppercase">{endpointCount} Endpoint{endpointCount !== 1 ? 's' : ''}</span>
      </div>
    </button>
  )
}

export function AgreementCard({
  name,
  providerName,
  status,
  slaUptimePct,
  slaLatencyMs,
  onClick
}: {
  name: string
  providerName: string
  status: 'pending' | 'active' | 'breached' | 'settled' | 'cancelled'
  slaUptimePct: number
  slaLatencyMs?: number
  onClick?: () => void
}) {
  const statusColors = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    active: 'bg-success/10 text-success border-success/20',
    breached: 'bg-error/10 text-error border-error/20',
    settled: 'bg-muted-text/10 text-muted-text border-muted-text/20',
    cancelled: 'bg-muted-text/10 text-muted-text border-muted-text/20'
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-6 bg-canvas-elevated border border-hairline-border rounded-card hover:border-ink/20 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-ink tracking-tight mb-1">{name}</h3>
          <p className="text-sm text-muted-text">{providerName}</p>
        </div>
        {status === 'breached' && (
          <span className={`px-3 py-1 text-xs font-medium rounded border ${statusColors.breached}`}>
            BREACH
          </span>
        )}
      </div>

      <div className="flex items-center space-x-6 text-xs font-mono uppercase text-muted-text">
        <div>
          <span className="block">Uptime</span>
          <span className="text-ink font-semibold">{slaUptimePct}%</span>
        </div>
        {slaLatencyMs && (
          <div>
            <span className="block">P95 Latency</span>
            <span className="text-ink font-semibold">{slaLatencyMs}ms</span>
          </div>
        )}
      </div>
    </button>
  )
}
