import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

async function runMigration(filename: string) {
  const sql = readFileSync(join(__dirname, '..', 'migrations', filename), 'utf-8')

  const { error } = await supabase.rpc('exec_sql', { sql_string: sql })

  if (error) {
    console.error(`Migration ${filename} failed:`, error)
    throw error
  }

  console.log(`✓ Migration ${filename} applied`)
}

async function main() {
  console.log('Running migrations...')
  console.log('Note: First run 000_exec_sql_helper.sql manually in Supabase SQL editor\n')

  await runMigration('001_initial_schema.sql')
  await runMigration('002_rls_policies.sql')
  await runMigration('003_add_evaluated_at.sql')

  console.log('All migrations applied successfully')
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
