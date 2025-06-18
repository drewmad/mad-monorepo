'use server';
import { supabaseServer } from '@/lib/supabase-server';

/** list projects for given workspace (server‑only) */
export async function listProjects(workspaceId: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('projects')
    .select(
      `id,
       name,
       status,
       progress,
       budget,
       tasks:tasks(count),
       time_last_30:time_tracked_last_30_days(total_hours)`
    )
    .eq('workspace_id', workspaceId);
  if (error) throw error;
  return data;
}

/** get single project + tasks */
export async function getProject(id: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      status,
      progress,
      budget,
      tasks ( id, name, status, priority, assignee, due_date, time_tracked )
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
} 