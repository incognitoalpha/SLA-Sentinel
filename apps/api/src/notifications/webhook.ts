import crypto from 'crypto'

export function generateHmacSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

export function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = generateHmacSignature(payload, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

export interface WebhookPayload {
  event: 'breach.created'
  timestamp: string
  data: {
    breach_id: string
    agreement_id: string
    agreement_name: string
    provider_name: string
    reason: string
    computed_uptime_pct: number
    computed_p95_latency_ms: number
  }
}

export async function deliverWebhook(
  url: string,
  payload: WebhookPayload,
  secret: string,
  retries = 3
): Promise<{ success: boolean; attempts: number; error?: string }> {
  const payloadStr = JSON.stringify(payload)
  const signature = generateHmacSignature(payloadStr, secret)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SLA-Sentinel-Signature': signature,
          'X-SLA-Sentinel-Timestamp': payload.timestamp,
          'User-Agent': 'SLA-Sentinel-Webhook/1.0'
        },
        body: payloadStr,
        signal: AbortSignal.timeout(10000)
      })

      if (response.ok) {
        console.log(`Webhook delivered to ${url} on attempt ${attempt}`)
        return { success: true, attempts: attempt }
      }

      console.warn(`Webhook attempt ${attempt} failed: HTTP ${response.status}`)

      if (attempt < retries) {
        const backoffMs = Math.pow(2, attempt) * 1000
        console.log(`Retrying in ${backoffMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
      }
    } catch (error: any) {
      console.error(`Webhook attempt ${attempt} error:`, error.message)

      if (attempt < retries) {
        const backoffMs = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, backoffMs))
      }
    }
  }

  return {
    success: false,
    attempts: retries,
    error: `Failed after ${retries} attempts`
  }
}
