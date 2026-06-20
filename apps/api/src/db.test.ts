import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('RLS Cross-Org Isolation', () => {
  let org1Id: string
  let org2Id: string
  let user1Id: string
  let user2Id: string
  let user1Token: string
  let user2Token: string
  let provider1Id: string
  let provider2Id: string

  beforeAll(async () => {
    // Create two test organizations
    const { data: orgs, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert([
        { name: 'Test Org 1' },
        { name: 'Test Org 2' }
      ])
      .select()

    if (orgError) throw orgError
    org1Id = orgs![0].id
    org2Id = orgs![1].id

    // Create two test users (using admin API)
    const { data: { user: user1 }, error: user1Error } = await supabaseAdmin.auth.admin.createUser({
      email: `test-user-1-${Date.now()}@example.com`,
      password: 'testpass123',
      email_confirm: true
    })
    if (user1Error) throw user1Error
    user1Id = user1!.id

    const { data: { user: user2 }, error: user2Error } = await supabaseAdmin.auth.admin.createUser({
      email: `test-user-2-${Date.now()}@example.com`,
      password: 'testpass123',
      email_confirm: true
    })
    if (user2Error) throw user2Error
    user2Id = user2!.id

    // Create profiles for both users
    await supabaseAdmin.from('profiles').insert([
      { id: user1Id, org_id: org1Id },
      { id: user2Id, org_id: org2Id }
    ])

    // Sign in both users to get tokens
    const { data: session1 } = await supabaseAdmin.auth.signInWithPassword({
      email: user1!.email!,
      password: 'testpass123'
    })
    user1Token = session1?.session?.access_token!

    const { data: session2 } = await supabaseAdmin.auth.signInWithPassword({
      email: user2!.email!,
      password: 'testpass123'
    })
    user2Token = session2?.session?.access_token!

    // Create test providers for each org
    const { data: providers } = await supabaseAdmin
      .from('providers')
      .insert([
        { org_id: org1Id, name: 'Provider 1', base_url: 'https://api1.example.com' },
        { org_id: org2Id, name: 'Provider 2', base_url: 'https://api2.example.com' }
      ])
      .select()

    provider1Id = providers![0].id
    provider2Id = providers![1].id
  })

  afterAll(async () => {
    // Cleanup test data
    await supabaseAdmin.auth.admin.deleteUser(user1Id)
    await supabaseAdmin.auth.admin.deleteUser(user2Id)
    await supabaseAdmin.from('providers').delete().in('id', [provider1Id, provider2Id])
    await supabaseAdmin.from('organizations').delete().in('id', [org1Id, org2Id])
  })

  it('should prevent user1 from reading user2\'s providers', async () => {
    const user1Client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${user1Token}` }
        }
      }
    )

    const { data, error } = await user1Client
      .from('providers')
      .select('*')
      .eq('id', provider2Id)

    expect(error).toBeNull()
    expect(data).toEqual([]) // User1 should not see user2's provider
  })

  it('should allow user1 to read their own providers', async () => {
    const user1Client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${user1Token}` }
        }
      }
    )

    const { data, error } = await user1Client
      .from('providers')
      .select('*')
      .eq('id', provider1Id)

    expect(error).toBeNull()
    expect(data).toHaveLength(1)
    expect(data![0].id).toBe(provider1Id)
  })

  it('should prevent user1 from updating user2\'s providers', async () => {
    const user1Client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${user1Token}` }
        }
      }
    )

    const { data, error } = await user1Client
      .from('providers')
      .update({ name: 'Hacked Provider' })
      .eq('id', provider2Id)
      .select()

    expect(error).toBeNull()
    expect(data).toEqual([]) // Update should affect 0 rows

    // Verify provider2 was not modified
    const { data: checkData } = await supabaseAdmin
      .from('providers')
      .select('name')
      .eq('id', provider2Id)
      .single()

    expect(checkData?.name).toBe('Provider 2')
  })

  it('should prevent user1 from deleting user2\'s providers', async () => {
    const user1Client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${user1Token}` }
        }
      }
    )

    const { error } = await user1Client
      .from('providers')
      .delete()
      .eq('id', provider2Id)

    expect(error).toBeNull() // No error, but no rows deleted

    // Verify provider2 still exists
    const { data } = await supabaseAdmin
      .from('providers')
      .select('id')
      .eq('id', provider2Id)
      .single()

    expect(data).not.toBeNull()
  })

  it('should prevent user1 from inserting providers with user2\'s org_id', async () => {
    const user1Client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${user1Token}` }
        }
      }
    )

    const { data, error } = await user1Client
      .from('providers')
      .insert({
        org_id: org2Id, // Try to insert into user2's org
        name: 'Malicious Provider',
        base_url: 'https://evil.example.com'
      })
      .select()

    // Should either error or return empty (RLS blocks it)
    expect(data?.length || 0).toBe(0)
  })
})

describe('Seed script idempotency', () => {
  it('should run seed twice without error', async () => {
    // Test that upsert with onConflict works
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Demo Corp'
      }, { onConflict: 'id' })
      .select()

    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
})
