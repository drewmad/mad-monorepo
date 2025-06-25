'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@mad/db';

type TimeEntryInsert = Database['public']['Tables']['time_entries']['Insert'];

export async function createTimeEntry(
  data: Omit<TimeEntryInsert, 'id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient();
  try {
    const { data: entry, error } = await supabase
      .from('time_entries')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating time entry:', error);
      return { entry: null, error: error.message };
    }

    revalidatePath('/time');
    revalidatePath('/time/timesheet');

    return { entry, error: null };
  } catch (error) {
    console.error('Error in createTimeEntry:', error);
    return { entry: null, error: 'Failed to create time entry' };
  }
}

export async function getTimeEntries(workspaceId?: string, userId?: string) {
  const supabase = createClient();
  try {
    let query = supabase
      .from('time_entries')
      .select('*')
      .order('start_time', { ascending: false });

    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching time entries:', error);
      return { entries: [], error: error.message };
    }

    return { entries: data || [], error: null };
  } catch (error) {
    console.error('Error in getTimeEntries:', error);
    return { entries: [], error: 'Failed to fetch time entries' };
  }
}
