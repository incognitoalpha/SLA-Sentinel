import { createClient, SupabaseClient } from '@supabase/supabase-js'

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

export interface ProbeResult {
  endpointId: string
  statusCode: number | null
  latencyMs: number
  success: boolean
  errorMessage: string | null
  checkedAt: Date
}

export async function probeEndpoint(
  endpointId: string,
  url: string,
  method: string,
  expectedStatus: number,
  timeoutMs: number
): Promise<ProbeResult> {
  const startTime = performance.now()
  const checkedAt = new Date()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        'User-Agent': 'SLA-Sentinel-Probe/1.0'
      }
    })

    clearTimeout(timeoutId)
    const latencyMs = Math.round(performance.now() - startTime)

    const success = response.status === expectedStatus
    const errorMessage = success ? null : `Expected ${expectedStatus}, got ${response.status}`

    return {
      endpointId,
      statusCode: response.status,
      latencyMs,
      success,
      errorMessage,
      checkedAt
    }
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - startTime)

    let errorMessage: string
    if (error.name === 'AbortError') {
      errorMessage = `Timeout after ${timeoutMs}ms`
    } else if (error.code === 'ENOTFOUND' || error.cause?.code === 'ENOTFOUND') {
      errorMessage = `DNS resolution failed: ${error.cause?.hostname || 'unknown'}`
    } else if (error.message?.includes('certificate') || error.message?.includes('TLS') || error.message?.includes('SSL')) {
      errorMessage = `TLS/SSL error: ${error.message}`
    } else if (error.cause?.code === 'ECONNREFUSED') {
      errorMessage = `Connection refused`
    } else if (error.cause?.code === 'ECONNRESET') {
      errorMessage = `Connection reset`
    } else {
      errorMessage = `Network error: ${error.message}`
    }

    return {
      endpointId,
      statusCode: null,
      latencyMs,
      success: false,
      errorMessage,
      checkedAt
    }
  }
}

export async function saveProbeResult(result: ProbeResult): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('probes').insert({
    endpoint_id: result.endpointId,
    status_code: result.statusCode,
    latency_ms: result.latencyMs,
    success: result.success,
    error_message: result.errorMessage,
    checked_at: result.checkedAt.toISOString()
  })

  if (error) {
    console.error('Failed to save probe result:', error)
    throw error
  }
}

export async function getLastProbeTime(endpointId: string): Promise<Date | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('probes')
    .select('checked_at')
    .eq('endpoint_id', endpointId)
    .order('checked_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Failed to get last probe time:', error)
    throw error
  }

  return data ? new Date(data.checked_at) : null
}

export async function getLastNProbes(endpointId: string, n: number): Promise<Array<{ success: boolean, checked_at: string }>> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('probes')
    .select('success, checked_at')
    .eq('endpoint_id', endpointId)
    .order('checked_at', { ascending: false })
    .limit(n)

  if (error) {
    console.error('Failed to get last probes:', error)
    throw error
  }

  return data || []
}
