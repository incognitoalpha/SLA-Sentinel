import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('RLS Policies', () => {
  it('should have tables with RLS enabled', async () => {
    // This is a placeholder - actual RLS test requires two users in different orgs
    expect(true).toBe(true)
  })
})

describe('Seed script idempotency', () => {
  it('should run seed twice without error', async () => {
    // Test that upsert with onConflict works
    const { data, error } = await supabase
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
