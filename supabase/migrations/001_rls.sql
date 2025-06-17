-- ownership table to map users ↔ workspaces
create table if not exists public.workspace_members (
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  role text default 'member',
  primary key (workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

-- Policy: users can select their own memberships
create policy "Members can view their workspace memberships"
on public.workspace_members
for select using (auth.uid() = user_id);

-- Allow workspace members to see their workspace
create or replace function public.is_member(workspace uuid)
returns boolean
language sql stable
as $$
  select exists (
    select 1 from public.workspaces w
    join auth.users u on u.id = auth.uid()
    where w.id = workspace
  );
$$;

create policy "Members can read workspace"
on public.workspaces
for select
using (public.is_member(id));

create policy "Members can read projects"
on public.projects
for select
using (public.is_member(workspace_id));

create policy "Members can read tasks"
on public.tasks
for select
using (
  public.is_member((select p.workspace_id from public.projects p where p.id = project_id))
); 