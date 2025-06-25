'use server';

import { createClient } from '@/lib/supabase-server';
import type { Database } from '@mad/db';

export type TimesheetEntry = Database['public']['Tables']['tasks']['Row'] & {
  project?: Database['public']['Tables']['projects']['Row'];
};

export interface TimeReport {
  projectId: string;
  projectName: string;
  totalHours: number;
}

export async function getTimesheetEntries(workspaceId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(
        `id, name, time_tracked, updated_at, project:projects(id, name, workspace_id)`
      )
      .eq('projects.workspace_id', workspaceId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching timesheet entries:', error);
      return { entries: [] as TimesheetEntry[], error: error.message };
    }

    return { entries: (data as unknown as TimesheetEntry[]) || [], error: null };
  } catch (error) {
    console.error('Error in getTimesheetEntries:', error);
    return { entries: [] as TimesheetEntry[], error: 'Failed to fetch timesheet entries' };
  }
}

export async function getTimeReports(workspaceId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(
        `project_id, time_tracked, project:projects(id, name, workspace_id)`
      )
      .eq('projects.workspace_id', workspaceId);

    if (error) {
      console.error('Error fetching time reports:', error);
      return { reports: [] as TimeReport[], error: error.message };
    }

    const totals: Record<string, number> = {};
    const names: Record<string, string> = {};

    for (const task of (data as unknown as TimesheetEntry[]) || []) {
      if (!task.project_id) continue;
      totals[task.project_id] = (totals[task.project_id] || 0) + (task.time_tracked || 0);
      if (task.project?.name) names[task.project_id] = task.project.name;
    }

    const reports: TimeReport[] = Object.entries(totals).map(([projectId, total]) => ({
      projectId,
      projectName: names[projectId] || '',
      totalHours: total,
    }));

    return { reports, error: null };
  } catch (error) {
    console.error('Error in getTimeReports:', error);
    return { reports: [] as TimeReport[], error: 'Failed to fetch time reports' };
  }
}
