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

  // Create demo user via Supabase Auth
  const demoEmail = 'demo@democorp.com'
  const demoPassword = 'demo123456'
  let demoUserId = '00000000-0000-0000-0000-000000000002'

  // Check if demo user already exists
  const { data: existingUser } = await supabase.auth.admin.listUsers()
  const demoUser = existingUser?.users.find(u => u.email === demoEmail)

  if (demoUser) {
    console.log('✓ Demo user already exists:', demoEmail)
    demoUserId = demoUser.id
  } else {
    // Create new demo user
    const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: { name: 'Demo User' }
    })

    if (userError) {
      console.error('Failed to create demo user:', userError)
      console.log('Skipping user creation, you can create manually via Supabase dashboard')
    } else {
      demoUserId = newUser.user.id
      console.log('✓ Created demo user:', demoEmail)
      console.log('  Password:', demoPassword)
    }
  }

  // Create profile for demo user
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: demoUserId,
      org_id: org.id,
      role: 'owner'
    }, { onConflict: 'id' })

  if (profileError) {
    console.error('Failed to create profile:', profileError)
  } else {
    console.log('✓ Created profile for demo user')
  }

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

  console.log('\n✅ Seed complete! Demo data created.')
  console.log('\nDemo Login Credentials:')
  console.log('  Email:', demoEmail)
  console.log('  Password:', demoPassword)
  console.log('  Organization:', org.name)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
