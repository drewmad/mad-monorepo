'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@mad/db';

type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type MessageUpdate = Database['public']['Tables']['messages']['Update'];

type ChannelInsert = Database['public']['Tables']['channels']['Insert'];
type ChannelUpdate = Database['public']['Tables']['channels']['Update'];

// Channel operations
export async function getChannels(workspaceId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching channels:', error);
      return { channels: [], error: error.message };
    }
    
    return { channels: data || [], error: null };
  } catch (error) {
    console.error('Error in getChannels:', error);
    return { channels: [], error: 'Failed to fetch channels' };
  }
}

export async function getChannel(id: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching channel:', error);
      return { channel: null, error: error.message };
    }
    
    return { channel: data, error: null };
  } catch (error) {
    console.error('Error in getChannel:', error);
    return { channel: null, error: 'Failed to fetch channel' };
  }
}

export async function createChannel(data: Omit<ChannelInsert, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  try {
    const { data: channel, error } = await supabase
      .from('channels')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating channel:', error);
      return { channel: null, error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { channel, error: null };
  } catch (error) {
    console.error('Error in createChannel:', error);
    return { channel: null, error: 'Failed to create channel' };
  }
}

export async function updateChannel(id: string, data: ChannelUpdate) {
  const supabase = createClient();
  
  try {
    const { data: channel, error } = await supabase
      .from('channels')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating channel:', error);
      return { channel: null, error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { channel, error: null };
  } catch (error) {
    console.error('Error in updateChannel:', error);
    return { channel: null, error: 'Failed to update channel' };
  }
}

export async function deleteChannel(id: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting channel:', error);
      return { error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteChannel:', error);
    return { error: 'Failed to delete channel' };
  }
}

// Message operations
export async function getMessages(channelId: string, limit: number = 50) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .is('parent_id', null) // Only top-level messages
      .order('timestamp', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching messages:', error);
      return { messages: [], error: error.message };
    }
    
    return { messages: data || [], error: null };
  } catch (error) {
    console.error('Error in getMessages:', error);
    return { messages: [], error: 'Failed to fetch messages' };
  }
}

export async function getMessage(id: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching message:', error);
      return { message: null, error: error.message };
    }
    
    return { message: data, error: null };
  } catch (error) {
    console.error('Error in getMessage:', error);
    return { message: null, error: 'Failed to fetch message' };
  }
}

export async function createMessage(data: Omit<MessageInsert, 'id'>) {
  const supabase = createClient();
  
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert(data)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating message:', error);
      return { message: null, error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { message, error: null };
  } catch (error) {
    console.error('Error in createMessage:', error);
    return { message: null, error: 'Failed to create message' };
  }
}

export async function updateMessage(id: string, data: MessageUpdate) {
  const supabase = createClient();
  
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating message:', error);
      return { message: null, error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { message, error: null };
  } catch (error) {
    console.error('Error in updateMessage:', error);
    return { message: null, error: 'Failed to update message' };
  }
}

export async function deleteMessage(id: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting message:', error);
      return { error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    return { error: 'Failed to delete message' };
  }
}

export async function getRecentMessages(workspaceId: string, limit: number = 10) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent messages:', error);
      return { messages: [], error: error.message };
    }
    
    return { messages: data || [], error: null };
  } catch (error) {
    console.error('Error in getRecentMessages:', error);
    return { messages: [], error: 'Failed to fetch recent messages' };
  }
}

export async function getMessageStats(workspaceId?: string, channelId?: string) {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('messages')
      .select('timestamp, user_id');
    
    if (channelId) {
      query = query.eq('channel_id', channelId);
    } else if (workspaceId) {
      query = query.eq('channels.workspace_id', workspaceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching message stats:', error);
      return { stats: null, error: error.message };
    }
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const stats = {
      total: data?.length || 0,
      today: data?.filter(m => m.timestamp >= startOfDay).length || 0,
      thisWeek: data?.filter(m => m.timestamp >= startOfWeek).length || 0,
      uniqueUsers: new Set(data?.map(m => m.user_id)).size || 0,
    };
    
    return { stats, error: null };
  } catch (error) {
    console.error('Error in getMessageStats:', error);
    return { stats: null, error: 'Failed to fetch message stats' };
  }
} 