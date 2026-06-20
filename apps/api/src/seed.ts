import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function seed() {
  console.log('Seeding database...')

  // Create demo organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .upsert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Corp'
    }, { onConflict: 'id' })
    .select()
    .single()

  if (orgError) {
    console.error('Failed to create org:', orgError)
    throw orgError
  }
  console.log('✓ Created organization:', org.name)

  // Create demo user (note: this requires the user to exist in auth.users first)
  // For now, we'll create a profile placeholder that can be linked later
  const demoUserId = '00000000-0000-0000-0000-000000000002'

  // Create demo providers
  const { data: provider1, error: p1Error } = await supabase
    .from('providers')
    .upsert({
      id: '00000000-0000-0000-0000-000000000010',
      org_id: org.id,
      name: 'Stripe API',
      base_url: 'https://api.stripe.com',
      description: 'Payment processing API'
    }, { onConflict: 'id' })
    .select()
    .single()

  if (p1Error) {
    console.error('Failed to create provider 1:', p1Error)
    throw p1Error
  }
  console.log('✓ Created provider:', provider1.name)

  const { data: provider2, error: p2Error } = await supabase
    .from('providers')
    .upsert({
      id: '00000000-0000-0000-0000-000000000011',
      org_id: org.id,
      name: 'SendGrid API',
      base_url: 'https://api.sendgrid.com',
      description: 'Email delivery service'
    }, { onConflict: 'id' })
    .select()
    .single()

  if (p2Error) {
    console.error('Failed to create provider 2:', p2Error)
    throw p2Error
  }
  console.log('✓ Created provider:', provider2.name)

  // Create endpoints for provider 1
  const { data: endpoint1, error: e1Error } = await supabase
    .from('endpoints')
    .upsert({
      id: '00000000-0000-0000-0000-000000000020',
      provider_id: provider1.id,
      url: 'https://api.stripe.com/v1/charges',
      method: 'GET',
      expected_status: 200,
      timeout_ms: 5000,
      probe_interval_seconds: 300,
      is_active: true
    }, { onConflict: 'id' })
    .select()
    .single()

  if (e1Error) {
    console.error('Failed to create endpoint 1:', e1Error)
    throw e1Error
  }
  console.log('✓ Created endpoint:', endpoint1.url)

  // Create endpoints for provider 2
  const { data: endpoint2, error: e2Error } = await supabase
    .from('endpoints')
    .upsert({
      id: '00000000-0000-0000-0000-000000000021',
      provider_id: provider2.id,
      url: 'https://api.sendgrid.com/v3/mail/send',
      method: 'POST',
      expected_status: 202,
      timeout_ms: 3000,
      probe_interval_seconds: 300,
      is_active: true
    }, { onConflict: 'id' })
    .select()
    .single()

  if (e2Error) {
    console.error('Failed to create endpoint 2:', e2Error)
    throw e2Error
  }
  console.log('✓ Created endpoint:', endpoint2.url)

  console.log('\nSeed complete! Demo data created.')
  console.log('Note: Create a user via Supabase Auth UI and manually link to org_id:', org.id)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
