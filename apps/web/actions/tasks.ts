'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@mad/db';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export async function getTasks(projectId?: string, workspaceId?: string) {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    // If filtering by workspace, join with projects table
    if (workspaceId && !projectId) {
      query = query.eq('projects.workspace_id', workspaceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return { tasks: [], error: error.message };
    }
    
    return { tasks: data || [], error: null };
  } catch (error) {
    console.error('Error in getTasks:', error);
    return { tasks: [], error: 'Failed to fetch tasks' };
  }
}

export async function getTask(id: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles(id, name, avatar_url),
        project:projects(id, name),
        subtasks:tasks!parent_task_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching task:', error);
      return { task: null, error: error.message };
    }
    
    return { task: data, error: null };
  } catch (error) {
    console.error('Error in getTask:', error);
    return { task: null, error: 'Failed to fetch task' };
  }
}

export async function createTask(data: Omit<TaskInsert, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        assignee:profiles(id, name, avatar_url),
        project:projects(id, name)
      `)
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      return { task: null, error: error.message };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/projects');
    if (data.project_id) {
      revalidatePath(`/projects/${data.project_id}`);
    }
    
    return { task, error: null };
  } catch (error) {
    console.error('Error in createTask:', error);
    return { task: null, error: 'Failed to create task' };
  }
}

export async function updateTask(id: string, data: TaskUpdate) {
  const supabase = createClient();
  
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        assignee:profiles(id, name, avatar_url),
        project:projects(id, name)
      `)
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      return { task: null, error: error.message };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/projects');
    if (task.project_id) {
      revalidatePath(`/projects/${task.project_id}`);
    }
    
    return { task, error: null };
  } catch (error) {
    console.error('Error in updateTask:', error);
    return { task: null, error: 'Failed to update task' };
  }
}

export async function deleteTask(id: string) {
  const supabase = createClient();
  
  try {
    // Get task info for revalidation
    const { data: taskInfo } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      return { error: error.message };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/projects');
    if (taskInfo?.project_id) {
      revalidatePath(`/projects/${taskInfo.project_id}`);
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteTask:', error);
    return { error: 'Failed to delete task' };
  }
}

export async function getTaskStats(projectId?: string) {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('tasks')
      .select('status, priority, estimated_hours, time_tracked');
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching task stats:', error);
      return { stats: null, error: error.message };
    }
    
    const stats = {
      total: data?.length || 0,
      todo: data?.filter(t => t.status === 'todo').length || 0,
      inProgress: data?.filter(t => t.status === 'in_progress').length || 0,
      completed: data?.filter(t => t.status === 'completed').length || 0,
      cancelled: data?.filter(t => t.status === 'cancelled').length || 0,
      totalEstimated: data?.reduce((sum, t) => sum + (t.estimated_hours || 0), 0) || 0,
      totalTracked: data?.reduce((sum, t) => sum + (t.time_tracked || 0), 0) || 0,
      highPriority: data?.filter(t => t.priority === 'high' || t.priority === 'urgent').length || 0,
    };
    
    return { stats, error: null };
  } catch (error) {
    console.error('Error in getTaskStats:', error);
    return { stats: null, error: 'Failed to fetch task stats' };
  }
}

export async function createSubtasks(parentTaskId: string, subtasks: Array<Omit<TaskInsert, 'id' | 'created_at' | 'updated_at' | 'parent_task_id'>>) {
  const supabase = createClient();
  
  try {
    const subtaskData = subtasks.map(subtask => ({
      ...subtask,
      parent_task_id: parentTaskId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(subtaskData)
      .select(`
        *,
        assignee:profiles(id, name, avatar_url),
        project:projects(id, name)
      `);
    
    if (error) {
      console.error('Error creating subtasks:', error);
      return { subtasks: [], error: error.message };
    }
    
    // Get project_id for revalidation
    const { data: parentTask } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', parentTaskId)
      .single();
    
    revalidatePath('/dashboard');
    revalidatePath('/projects');
    if (parentTask?.project_id) {
      revalidatePath(`/projects/${parentTask.project_id}`);
    }
    
    return { subtasks: data || [], error: null };
  } catch (error) {
    console.error('Error in createSubtasks:', error);
    return { subtasks: [], error: 'Failed to create subtasks' };
  }
} 