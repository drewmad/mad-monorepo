'use server';
import { createClient } from '@/lib/supabase-server';
import type { Project } from '@mad/db';

/** list projects for given workspace (server‑only) */
export async function listProjects(): Promise<Project[]> {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return projects || [];
}

/** get single project + tasks */
export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return project;
} 