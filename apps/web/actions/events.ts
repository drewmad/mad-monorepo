'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@mad/db';

type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

export async function getEvents(workspaceId?: string, startDate?: string, endDate?: string) {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      return { events: [], error: error.message };
    }
    
    return { events: data || [], error: null };
  } catch (error) {
    console.error('Error in getEvents:', error);
    return { events: [], error: 'Failed to fetch events' };
  }
}

export async function getEvent(id: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching event:', error);
      return { event: null, error: error.message };
    }
    
    return { event: data, error: null };
  } catch (error) {
    console.error('Error in getEvent:', error);
    return { event: null, error: 'Failed to fetch event' };
  }
}

export async function createEvent(data: Omit<EventInsert, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  try {
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      return { event: null, error: error.message };
    }
    
    revalidatePath('/calendar');
    revalidatePath('/dashboard');
    
    return { event, error: null };
  } catch (error) {
    console.error('Error in createEvent:', error);
    return { event: null, error: 'Failed to create event' };
  }
}

export async function updateEvent(id: string, data: EventUpdate) {
  const supabase = createClient();
  
  try {
    const { data: event, error } = await supabase
      .from('events')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event:', error);
      return { event: null, error: error.message };
    }
    
    revalidatePath('/calendar');
    revalidatePath('/dashboard');
    
    return { event, error: null };
  } catch (error) {
    console.error('Error in updateEvent:', error);
    return { event: null, error: 'Failed to update event' };
  }
}

export async function deleteEvent(id: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting event:', error);
      return { error: error.message };
    }
    
    revalidatePath('/calendar');
    revalidatePath('/dashboard');
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    return { error: 'Failed to delete event' };
  }
}

export async function getUpcomingEvents(workspaceId?: string, limit: number = 5) {
  const supabase = createClient();
  
  try {
    const now = new Date().toISOString();
    
    let query = supabase
      .from('events')
      .select('*')
      .gte('date', now.split('T')[0]) // Today or later
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .limit(limit);
    
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      return { events: [], error: error.message };
    }
    
    return { events: data || [], error: null };
  } catch (error) {
    console.error('Error in getUpcomingEvents:', error);
    return { events: [], error: 'Failed to fetch upcoming events' };
  }
}

export async function getEventStats(workspaceId?: string) {
  const supabase = createClient();
  
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    let query = supabase
      .from('events')
      .select('date, recorded');
    
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching event stats:', error);
      return { stats: null, error: error.message };
    }
    
    const thisMonth = data?.filter(e => 
      e.date >= startOfMonth && e.date <= endOfMonth
    ) || [];
    
    const stats = {
      total: data?.length || 0,
      thisMonth: thisMonth.length,
      recorded: data?.filter(e => e.recorded).length || 0,
      upcoming: data?.filter(e => e.date >= now.toISOString().split('T')[0]).length || 0,
    };
    
    return { stats, error: null };
  } catch (error) {
    console.error('Error in getEventStats:', error);
    return { stats: null, error: 'Failed to fetch event stats' };
  }
}

export async function markEventAsRecorded(id: string) {
  const supabase = createClient();
  
  try {
    const { data: event, error } = await supabase
      .from('events')
      .update({
        recorded: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error marking event as recorded:', error);
      return { event: null, error: error.message };
    }
    
    revalidatePath('/calendar');
    revalidatePath('/dashboard');
    
    return { event, error: null };
  } catch (error) {
    console.error('Error in markEventAsRecorded:', error);
    return { event: null, error: 'Failed to mark event as recorded' };
  }
} 