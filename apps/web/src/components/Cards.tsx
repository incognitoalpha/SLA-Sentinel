'use client'

export function StatusDot({ status }: { status: 'success' | 'error' | 'unknown' }) {
  const colors = {
    success: 'bg-success shadow-[0_0_10px_rgba(var(--success),0.5)]',
    error: 'bg-error shadow-[0_0_10px_rgba(var(--error),0.6)] animate-pulse',
    unknown: 'bg-muted-text/80 shadow-[0_0_8px_rgba(var(--muted-text),0.3)]'
  }

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-300 ${colors[status]}`}
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
      className="group w-full text-left p-6 glass-panel rounded-panel hover:-translate-y-1 hover:shadow-2xl hover:border-link/40 transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-link/5 rounded-full filter blur-xl group-hover:bg-link/10 transition-colors duration-300 -mr-10 -mt-10"></div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <h3 className="text-xl font-bold text-ink tracking-tight group-hover:text-link transition-colors duration-300">{name}</h3>
        <div className="mt-1.5"><StatusDot status={status} /></div>
      </div>

      {baseUrl && (
        <p className="text-sm font-mono text-muted-text mb-6 truncate relative z-10">{baseUrl}</p>
      )}

      <div className="flex items-center space-x-4 text-xs font-semibold tracking-wider text-muted-text uppercase relative z-10">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-canvas/60 border border-hairline-border/80 shadow-sm backdrop-blur-sm group-hover:border-hairline-border transition-colors duration-300">
          <svg className="w-3.5 h-3.5 mr-1.5 text-muted-text/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {endpointCount} Endpoint{endpointCount !== 1 ? 's' : ''}
        </span>
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
    breached: 'bg-error/10 text-error border-error/20 shadow-[0_0_10px_rgba(var(--error),0.1)]',
    settled: 'bg-muted-text/10 text-muted-text border-muted-text/20',
    cancelled: 'bg-muted-text/10 text-muted-text border-muted-text/20'
  }

  return (
    <button
      onClick={onClick}
      className="group w-full text-left p-6 glass-panel rounded-panel hover:-translate-y-1 hover:shadow-2xl hover:border-link/40 transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-xl opacity-30 transition-colors duration-300 -mr-10 -mt-10 ${status === 'breached' ? 'bg-error/15' : status === 'active' ? 'bg-success/15' : 'bg-link/10'}`}></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-ink tracking-tight mb-1 group-hover:text-link transition-colors duration-300">{name}</h3>
          <p className="text-sm text-muted-text font-medium">{providerName}</p>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-pill border ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center space-x-6 text-xs font-mono uppercase text-muted-text mt-6 pt-4 border-t border-hairline-border/50 relative z-10">
        <div>
          <span className="block mb-1 text-[10px] tracking-wider text-muted-text/80">Uptime SLA</span>
          <span className="text-ink font-bold text-sm tracking-tight">{slaUptimePct}%</span>
        </div>
        {slaLatencyMs && (
          <div>
            <span className="block mb-1 text-[10px] tracking-wider text-muted-text/80">P95 Latency</span>
            <span className="text-ink font-bold text-sm tracking-tight">{slaLatencyMs}ms</span>
          </div>
        )}
      </div>
    </button>
  )
}
