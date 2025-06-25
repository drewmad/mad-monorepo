import { supabaseClient } from './client';
import { z } from 'zod';
import type { Database } from '../types';

export type TimeEntry = Database['public']['Tables']['time_entries']['Row'];

const createTimeEntrySchema = z.object({
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid(),
  description: z.string().optional().nullable(),
  start_time: z.string(),
  end_time: z.string(),
  duration_minutes: z.number(),
});

export async function createTimeEntry(input: z.infer<typeof createTimeEntrySchema>) {
  const data = createTimeEntrySchema.parse(input);
  const { data: entry, error } = await supabaseClient
    .from('time_entries')
    .insert({ ...data })
    .select()
    .single();
  if (error) throw error;
  return entry;
}

export async function listTimeEntries(workspaceId: string, userId: string) {
  const { data, error } = await supabaseClient
    .from('time_entries')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .order('start_time', { ascending: false });
  if (error) throw error;
  return data as TimeEntry[];
}
