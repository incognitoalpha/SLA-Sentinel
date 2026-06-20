# Phase 1 Migration Guide

Supabase doesn't allow running raw SQL via API by default. Two options:

## Option 1: Supabase Dashboard (Quick)

1. Go to Supabase dashboard → SQL Editor
2. Copy/paste each migration file in order:
   - `migrations/000_exec_sql_helper.sql` (creates helper function)
   - `migrations/001_initial_schema.sql`
   - `migrations/002_rls_policies.sql`
3. Run each one
4. Then run: `pnpm db:seed`

## Option 2: Supabase CLI (Proper)

```bash
# Install Supabase CLI
npm i -g supabase

# Link to your project
supabase link --project-ref ohxwtkskkjuvzzyboxaa

# Apply migrations (future use)
supabase db push
```

For now, use **Option 1** (dashboard) to unblock Phase 1.

After migrations applied, run seed:
```bash
cd apps/api
pnpm db:seed
```
