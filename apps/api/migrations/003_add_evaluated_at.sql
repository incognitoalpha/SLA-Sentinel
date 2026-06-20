-- Add evaluated_at column to agreements table
alter table agreements add column evaluated_at timestamptz;

-- Index for finding due agreements
create index agreements_due_evaluation_idx on agreements(status, period_end, evaluated_at)
where status = 'active' and evaluated_at is null;
