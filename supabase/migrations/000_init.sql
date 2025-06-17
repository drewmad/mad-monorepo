-- Workspaces
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  status text default 'Active',
  progress int default 0,
  budget numeric default 0,
  created_at timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  description text,
  status text default 'Todo',
  priority text default 'Medium',
  assignee uuid,
  due_date date,
  time_tracked numeric default 0,
  created_at timestamptz not null default now()
);

-- Activity feed
create table if not exists public.activity_feed (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  actor_id uuid,
  action text not null,
  target text,
  created_at timestamptz not null default now()
);

-- Materialized view for KPI
create materialized view if not exists public.time_tracked_last_30_days as
select
  t.project_id,
  sum(t.time_tracked) as total_hours
from public.tasks t
where t.created_at > now() - interval '30 days'
group by t.project_id;

-- RLS
alter table public.workspaces enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_feed enable row level security;

-- workspace ownership
create policy "Workspace owners"
on public.workspaces
for all
using (auth.uid() = id); -- simplistic example; refine in later migrations 