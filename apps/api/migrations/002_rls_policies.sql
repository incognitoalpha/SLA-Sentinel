-- Enable Row Level Security on all tables
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table providers enable row level security;
alter table endpoints enable row level security;
alter table probes enable row level security;
alter table agreements enable row level security;
alter table evaluations enable row level security;
alter table breaches enable row level security;
alter table alerts enable row level security;
alter table audit_log enable row level security;

-- Helper function to get user's org_id
create or replace function auth.user_org_id()
returns uuid
language sql
security definer
stable
as $$
  select org_id from profiles where id = auth.uid()
$$;

-- Organizations: users can only see their own org
create policy "Users can view their own organization"
  on organizations for select
  using (id = auth.user_org_id());

create policy "Users can update their own organization"
  on organizations for update
  using (id = auth.user_org_id());

-- Profiles: users can view profiles in their org
create policy "Users can view profiles in their org"
  on profiles for select
  using (org_id = auth.user_org_id());

create policy "Users can insert their own profile"
  on profiles for insert
  with check (id = auth.uid());

-- Providers: scoped by org_id
create policy "Users can view providers in their org"
  on providers for select
  using (org_id = auth.user_org_id());

create policy "Users can insert providers in their org"
  on providers for insert
  with check (org_id = auth.user_org_id());

create policy "Users can update providers in their org"
  on providers for update
  using (org_id = auth.user_org_id());

create policy "Users can delete providers in their org"
  on providers for delete
  using (org_id = auth.user_org_id());

-- Endpoints: scoped via provider → org_id
create policy "Users can view endpoints in their org"
  on endpoints for select
  using (
    exists (
      select 1 from providers
      where providers.id = endpoints.provider_id
      and providers.org_id = auth.user_org_id()
    )
  );

create policy "Users can insert endpoints in their org"
  on endpoints for insert
  with check (
    exists (
      select 1 from providers
      where providers.id = endpoints.provider_id
      and providers.org_id = auth.user_org_id()
    )
  );

create policy "Users can update endpoints in their org"
  on endpoints for update
  using (
    exists (
      select 1 from providers
      where providers.id = endpoints.provider_id
      and providers.org_id = auth.user_org_id()
    )
  );

create policy "Users can delete endpoints in their org"
  on endpoints for delete
  using (
    exists (
      select 1 from providers
      where providers.id = endpoints.provider_id
      and providers.org_id = auth.user_org_id()
    )
  );

-- Probes: scoped via endpoint → provider → org_id
create policy "Users can view probes in their org"
  on probes for select
  using (
    exists (
      select 1 from endpoints
      join providers on providers.id = endpoints.provider_id
      where endpoints.id = probes.endpoint_id
      and providers.org_id = auth.user_org_id()
    )
  );

-- Service role can insert probes (worker writes these)
create policy "Service role can insert probes"
  on probes for insert
  with check (true);

-- Agreements: scoped by org_id
create policy "Users can view agreements in their org"
  on agreements for select
  using (org_id = auth.user_org_id());

create policy "Users can insert agreements in their org"
  on agreements for insert
  with check (org_id = auth.user_org_id());

create policy "Users can update agreements in their org"
  on agreements for update
  using (org_id = auth.user_org_id());

-- Evaluations: scoped via agreement → org_id
create policy "Users can view evaluations in their org"
  on evaluations for select
  using (
    exists (
      select 1 from agreements
      where agreements.id = evaluations.agreement_id
      and agreements.org_id = auth.user_org_id()
    )
  );

-- Service role can insert evaluations (evaluator writes these)
create policy "Service role can insert evaluations"
  on evaluations for insert
  with check (true);

-- Breaches: scoped via agreement → org_id
create policy "Users can view breaches in their org"
  on breaches for select
  using (
    exists (
      select 1 from agreements
      where agreements.id = breaches.agreement_id
      and agreements.org_id = auth.user_org_id()
    )
  );

-- Service role can insert breaches
create policy "Service role can insert breaches"
  on breaches for insert
  with check (true);

-- Alerts: scoped via breach → agreement → org_id
create policy "Users can view alerts in their org"
  on alerts for select
  using (
    exists (
      select 1 from breaches
      join agreements on agreements.id = breaches.agreement_id
      where breaches.id = alerts.breach_id
      and agreements.org_id = auth.user_org_id()
    )
  );

-- Service role can insert alerts
create policy "Service role can insert alerts"
  on alerts for insert
  with check (true);

-- Audit log: scoped by org_id
create policy "Users can view audit log in their org"
  on audit_log for select
  using (org_id = auth.user_org_id());

-- Service role can insert audit log entries
create policy "Service role can insert audit log"
  on audit_log for insert
  with check (true);
