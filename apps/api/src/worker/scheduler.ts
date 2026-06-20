import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { probeEndpoint, saveProbeResult, getLastProbeTime } from './probe-runner.js'

let _supabase: SupabaseClient | null = null

function getSupabaseClient() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return _supabase
}

interface Endpoint {
  id: string
  url: string
  method: string
  expected_status: number
  timeout_ms: number
  probe_interval_seconds: number
}

export async function getActiveEndpoints(): Promise<Endpoint[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('endpoints')
    .select('id, url, method, expected_status, timeout_ms, probe_interval_seconds')
    .eq('is_active', true)

  if (error) {
    console.error('Failed to fetch active endpoints:', error)
    throw error
  }

  return data || []
}

export async function shouldProbeEndpoint(endpoint: Endpoint): Promise<boolean> {
  const lastProbeTime = await getLastProbeTime(endpoint.id)

  if (!lastProbeTime) return true

  const now = new Date()
  const elapsedSeconds = (now.getTime() - lastProbeTime.getTime()) / 1000

  return elapsedSeconds >= endpoint.probe_interval_seconds
}

export async function runProbes(): Promise<void> {
  console.log('Starting probe run...')

  const endpoints = await getActiveEndpoints()
  console.log(`Found ${endpoints.length} active endpoints`)

  const probePromises = endpoints.map(async (endpoint) => {
    const shouldProbe = await shouldProbeEndpoint(endpoint)

    if (!shouldProbe) {
      console.log(`Skipping endpoint ${endpoint.id} - interval not elapsed`)
      return
    }

    console.log(`Probing ${endpoint.url}`)
    const result = await probeEndpoint(
      endpoint.id,
      endpoint.url,
      endpoint.method,
      endpoint.expected_status,
      endpoint.timeout_ms
    )

    await saveProbeResult(result)

    const status = result.success ? '✓' : '✗'
    console.log(`${status} ${endpoint.url} - ${result.latencyMs}ms ${result.errorMessage || ''}`)
  })

  await Promise.allSettled(probePromises)
  console.log('Probe run complete')
}
