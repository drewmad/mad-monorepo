insert into public.workspaces (id, name)
values
  ('00000000-0000-0000-0000-000000000001', 'TaskFlow');

insert into public.projects (workspace_id, name, status, progress, budget)
values
  ('00000000-0000-0000-0000-000000000001', 'E‑commerce Redesign', 'Active', 25, 20000);

insert into public.tasks (project_id, name, status, priority, time_tracked)
select p.id, 'User research', 'Completed', 'High', 16
from public.projects p
where p.name = 'E‑commerce Redesign'; 