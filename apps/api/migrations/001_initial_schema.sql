-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations table
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Profiles table (links auth.users to organizations)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  org_id uuid not null references organizations on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now()
);

-- Providers table
create table providers (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations on delete cascade,
  name text not null,
  base_url text,
  description text,
  created_at timestamptz not null default now()
);

-- Endpoints table
create table endpoints (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references providers on delete cascade,
  url text not null,
  method text not null default 'GET',
  expected_status int not null default 200,
  timeout_ms int not null default 5000,
  probe_interval_seconds int not null default 300,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Probes table
create table probes (
  id uuid primary key default uuid_generate_v4(),
  endpoint_id uuid not null references endpoints on delete cascade,
  status_code int,
  latency_ms int,
  success boolean not null,
  error_message text,
  checked_at timestamptz not null default now()
);

-- Index for probe queries
create index probes_endpoint_checked_idx on probes(endpoint_id, checked_at desc);

-- Agreements table
create table agreements (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations on delete cascade,
  provider_id uuid not null references providers on delete cascade,
  name text not null,
  sla_uptime_pct numeric(5,2) not null,
  sla_latency_p95_ms int,
  period_type text not null check (period_type in ('daily', 'weekly', 'monthly')),
  penalty_amount_wei numeric,
  escrow_contract_address text,
  escrow_chain text not null default 'sepolia',
  deposit_tx_hash text,
  status text not null default 'pending' check (status in ('pending', 'active', 'breached', 'settled', 'cancelled')),
  period_start timestamptz,
  period_end timestamptz,
  created_at timestamptz not null default now()
);

-- Evaluations table
create table evaluations (
  id uuid primary key default uuid_generate_v4(),
  agreement_id uuid not null references agreements on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  computed_uptime_pct numeric(5,2),
  computed_p95_latency_ms int,
  breached boolean not null,
  sample_size int not null,
  evaluated_at timestamptz not null default now()
);

-- Breaches table
create table breaches (
  id uuid primary key default uuid_generate_v4(),
  evaluation_id uuid not null references evaluations on delete cascade,
  agreement_id uuid not null references agreements on delete cascade,
  reason text not null,
  on_chain_tx_hash text,
  notified_at timestamptz,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Alerts table
create table alerts (
  id uuid primary key default uuid_generate_v4(),
  breach_id uuid not null references breaches on delete cascade,
  channel text not null check (channel in ('email', 'webhook')),
  recipient text not null,
  sent_at timestamptz,
  status text not null,
  created_at timestamptz not null default now()
);

-- Audit log table
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations on delete cascade,
  actor uuid references auth.users on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  created_at timestamptz not null default now()
);
