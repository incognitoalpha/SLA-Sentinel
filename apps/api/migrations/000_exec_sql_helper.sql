-- Helper function to execute raw SQL (for migration runner)
-- Note: This is a workaround for programmatic migrations
-- In production, use Supabase CLI: npx supabase db push

create or replace function exec_sql(sql_string text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql_string;
end;
$$;
