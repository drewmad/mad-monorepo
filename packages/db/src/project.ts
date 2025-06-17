import { supabaseClient } from './client';
import { z } from 'zod';

const createProjectSchema = z.object({
  workspace_id: z.string().uuid(),
  name: z.string().min(1),
  status: z.string().default('Active'),
  progress: z.number().min(0).max(100).default(0),
  budget: z.number().min(0).optional()
});

export async function createProject(input: z.infer<typeof createProjectSchema>) {
  const data = createProjectSchema.parse(input);
  const { data: project, error } = await supabaseClient
    .from('projects')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return project;
}

export async function listProjects(workspaceId: string) {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .eq('workspace_id', workspaceId);
  if (error) throw error;
  return data;
} 