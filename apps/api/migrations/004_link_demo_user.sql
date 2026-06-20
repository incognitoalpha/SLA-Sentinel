-- Link demo user to Demo Corp organization
-- User ID: ea6dd570-0f36-489f-a07f-a2e44ae76c97
-- Org ID:  00000000-0000-0000-0000-000000000001

insert into profiles (id, org_id, role)
values (
  'ea6dd570-0f36-489f-a07f-a2e44ae76c97',
  '00000000-0000-0000-0000-000000000001',
  'owner'
)
on conflict (id) do update
set org_id = excluded.org_id,
    role = excluded.role;
