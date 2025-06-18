'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@mad/db';

type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export async function getProjects(workspaceId?: string) {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching projects:', error);
      return { projects: [], error: error.message };
    }
    
    return { projects: data || [], error: null };
  } catch (error) {
    console.error('Error in getProjects:', error);
    return { projects: [], error: 'Failed to fetch projects' };
  }
}

export async function getProject(id: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      return { project: null, error: error.message };
    }
    
    return { project: data, error: null };
  } catch (error) {
    console.error('Error in getProject:', error);
    return { project: null, error: 'Failed to fetch project' };
  }
}

export async function createProject(data: Omit<ProjectInsert, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      return { project: null, error: error.message };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/projects');
    
    return { project, error: null };
  } catch (error) {
    console.error('Error in createProject:', error);
    return { project: null, error: 'Failed to create project' };
  }
}

export async function updateProject(id: string, data: ProjectUpdate) {
  const supabase = createClient();
  
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return { project: null, error: error.message };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    
    return { project, error: null };
  } catch (error) {
    console.error('Error in updateProject:', error);
    return { project: null, error: 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      return { error: error.message };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/projects');
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteProject:', error);
    return { error: 'Failed to delete project' };
  }
}

export async function getProjectStats(workspaceId?: string) {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('projects')
      .select('status, progress');
    
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching project stats:', error);
      return { stats: null, error: error.message };
    }
    
    const stats = {
      total: data?.length || 0,
      active: data?.filter(p => p.status === 'active').length || 0,
      completed: data?.filter(p => p.status === 'completed').length || 0,
      onHold: data?.filter(p => p.status === 'on_hold').length || 0,
      averageProgress: data?.length ? 
        data.reduce((sum, p) => sum + (p.progress || 0), 0) / data.length : 0
    };
    
    return { stats, error: null };
  } catch (error) {
    console.error('Error in getProjectStats:', error);
    return { stats: null, error: 'Failed to fetch project stats' };
  }
} 