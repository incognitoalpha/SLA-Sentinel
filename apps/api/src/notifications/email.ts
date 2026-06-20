import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface BreachEmailData {
  agreementName: string
  providerName: string
  breachReason: string
  periodStart: string
  periodEnd: string
  computedUptimePct: number
  computedP95LatencyMs: number
  slaUptimePct: number
  slaLatencyP95Ms: number | null
  breachTimestamp: string
}

export async function sendBreachEmail(
  to: string,
  data: BreachEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { data: result, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'SLA Sentinel <noreply@sla-sentinel.dev>',
      to,
      subject: `SLA Breach: ${data.agreementName}`,
      text: buildEmailText(data),
      html: buildEmailHtml(data)
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: result?.id }
  } catch (error: any) {
    console.error('Failed to send email:', error)
    return { success: false, error: error.message }
  }
}

function buildEmailText(data: BreachEmailData): string {
  return `
SLA BREACH DETECTED

Agreement: ${data.agreementName}
Provider: ${data.providerName}
Period: ${data.periodStart} to ${data.periodEnd}
Detected: ${data.breachTimestamp}

BREACH REASON
${data.breachReason}

MEASURED PERFORMANCE
Uptime: ${data.computedUptimePct.toFixed(2)}% (SLA: ${data.slaUptimePct}%)
P95 Latency: ${data.computedP95LatencyMs}ms${data.slaLatencyP95Ms ? ` (SLA: ${data.slaLatencyP95Ms}ms)` : ''}

This breach has been recorded on-chain. Check your SLA Sentinel dashboard for details.

---
SLA Sentinel - Automated SLA Monitoring
  `.trim()
}

function buildEmailHtml(data: BreachEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #171717; background: #fafafa; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; }
    .header { background: #171717; color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
    .content { padding: 24px; }
    .badge { display: inline-block; background: #dc2626; color: #ffffff; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 16px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 14px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; color: #737373; }
    .section p { margin: 0; }
    .metric { background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 8px; }
    .metric-label { font-size: 12px; color: #737373; text-transform: uppercase; }
    .metric-value { font-size: 18px; font-weight: 600; color: #171717; }
    .footer { padding: 24px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 12px; color: #737373; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SLA Sentinel</h1>
    </div>
    <div class="content">
      <div class="badge">SLA Breach</div>

      <div class="section">
        <h2>Agreement</h2>
        <p><strong>${data.agreementName}</strong></p>
        <p>Provider: ${data.providerName}</p>
        <p>Period: ${data.periodStart} to ${data.periodEnd}</p>
        <p>Detected: ${data.breachTimestamp}</p>
      </div>

      <div class="section">
        <h2>Breach Reason</h2>
        <p>${data.breachReason}</p>
      </div>

      <div class="section">
        <h2>Measured Performance</h2>
        <div class="metric">
          <div class="metric-label">Uptime</div>
          <div class="metric-value">${data.computedUptimePct.toFixed(2)}%</div>
          <div class="metric-label">SLA Threshold: ${data.slaUptimePct}%</div>
        </div>
        ${data.slaLatencyP95Ms ? `
        <div class="metric">
          <div class="metric-label">P95 Latency</div>
          <div class="metric-value">${data.computedP95LatencyMs}ms</div>
          <div class="metric-label">SLA Threshold: ${data.slaLatencyP95Ms}ms</div>
        </div>
        ` : ''}
      </div>

      <p style="margin-top: 24px;">This breach has been recorded on-chain. Check your SLA Sentinel dashboard for details.</p>
    </div>
    <div class="footer">
      SLA Sentinel - Automated SLA Monitoring<br>
      Testnet only - Sepolia deployment
    </div>
  </div>
</body>
</html>
  `.trim()
}
