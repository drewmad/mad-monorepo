'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@mad/db';

type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type MessageUpdate = Database['public']['Tables']['messages']['Update'];

type ChannelInsert = Database['public']['Tables']['channels']['Insert'];
type ChannelUpdate = Database['public']['Tables']['channels']['Update'];



// Channel operations
export async function getChannels(workspaceId: string, userId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('channels')
      .select(`
        *,
        channel_members!inner(member_id),
        messages(id, timestamp, text, user_id)
      `)
      .eq('workspace_id', workspaceId)
      .eq('channel_members.member_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching channels:', error);
      return { channels: [], error: error.message };
    }
    
    // Add last message info to each channel
    const channelsWithLastMessage = data?.map(channel => {
      const lastMessage = channel.messages
        ?.sort((a: { timestamp: string }, b: { timestamp: string }) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      return {
        ...channel,
        lastMessage: lastMessage || null,
        messageCount: channel.messages?.length || 0
      };
    }) || [];
    
    return { channels: channelsWithLastMessage, error: null };
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
    
    // Add creator to channel
    await supabase
      .from('channel_members')
      .insert({
        channel_id: channel.id,
        member_id: data.created_by,
        joined_at: new Date().toISOString(),
      });
    
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
export async function getMessages(channelId: string, limit: number = 50, offset: number = 0) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        user:team_members!messages_user_id_fkey(
          id,
          name,
          avatar_url,
          role
        ),
        replies:messages!parent_id(
          id,
          text,
          timestamp,
          user_id
        )
      `)
      .eq('channel_id', channelId)
      .is('parent_id', null) // Only get top-level messages
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching messages:', error);
      return { messages: [], error: error.message };
    }
    
    // Reverse to show oldest first
    const messages = data?.reverse() || [];
    
    return { messages, error: null };
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

export async function createMessage(data: Omit<MessageInsert, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        ...data,
        timestamp: data.timestamp || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        user:team_members!messages_user_id_fkey(
          id,
          name,
          avatar_url,
          role
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating message:', error);
      return { message: null, error: error.message };
    }
    
    // Update channel's updated_at timestamp
    await supabase
      .from('channels')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', data.channel_id);
    
    revalidatePath('/messages');
    
    return { message, error: null };
  } catch (error) {
    console.error('Error in createMessage:', error);
    return { message: null, error: 'Failed to send message' };
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

export async function editMessage(messageId: string, text: string) {
  const supabase = createClient();
  
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .update({
        text,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) {
      console.error('Error editing message:', error);
      return { message: null, error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { message, error: null };
  } catch (error) {
    console.error('Error in editMessage:', error);
    return { message: null, error: 'Failed to edit message' };
  }
}

export async function deleteMessage(messageId: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
    
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

export async function getRecentMessages(workspaceId: string, limit: number = 20) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        channel:channels!inner(
          id,
          name,
          type
        ),
        user:team_members!messages_user_id_fkey(
          id,
          name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId)
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

export async function createDirectMessage(workspaceId: string, userId1: string, userId2: string) {
  const supabase = createClient();
  
  try {
    // Check if direct message channel already exists
    const channelName = `dm-${[userId1, userId2].sort().join('-')}`;
    
    const { data: existing, error: checkError } = await supabase
      .from('channels')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('type', 'direct')
      .eq('name', channelName)
      .single();
    
    if (existing && !checkError) {
      return { channel: existing, error: null };
    }
    
    // Get user names for the channel
    const { data: users, error: usersError } = await supabase
      .from('team_members')
      .select('name, id')
      .eq('workspace_id', workspaceId)
      .in('user_id', [userId1, userId2]);
    
    if (usersError) {
      console.error('Error fetching user names:', usersError);
      return { channel: null, error: 'Failed to fetch user information' };
    }
    
    const userNames = users?.map(u => u.name).join(', ') || 'Direct Message';
    
    // Create direct message channel
    const { data: channel, error } = await supabase
      .from('channels')
      .insert({
        workspace_id: workspaceId,
        name: channelName,
        description: `Direct message between ${userNames}`,
        type: 'direct',
        created_by: userId1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating direct message channel:', error);
      return { channel: null, error: error.message };
    }
    
    // Add both users to the channel
    const memberInserts = [userId1, userId2].map(userId => ({
      channel_id: channel.id,
      member_id: userId,
      joined_at: new Date().toISOString(),
    }));
    
    const { error: membersError } = await supabase
      .from('channel_members')
      .insert(memberInserts);
    
    if (membersError) {
      console.error('Error adding members to DM channel:', membersError);
      // Clean up the channel if member addition fails
      await supabase.from('channels').delete().eq('id', channel.id);
      return { channel: null, error: 'Failed to create direct message channel' };
    }
    
    revalidatePath('/messages');
    
    return { channel, error: null };
  } catch (error) {
    console.error('Error in createDirectMessage:', error);
    return { channel: null, error: 'Failed to create direct message' };
  }
}

export async function addChannelMember(channelId: string, memberId: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('channel_members')
      .insert({
        channel_id: channelId,
        member_id: memberId,
        joined_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error adding channel member:', error);
      return { error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { error: null };
  } catch (error) {
    console.error('Error in addChannelMember:', error);
    return { error: 'Failed to add member to channel' };
  }
}

export async function removeChannelMember(channelId: string, memberId: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('member_id', memberId);
    
    if (error) {
      console.error('Error removing channel member:', error);
      return { error: error.message };
    }
    
    revalidatePath('/messages');
    
    return { error: null };
  } catch (error) {
    console.error('Error in removeChannelMember:', error);
    return { error: 'Failed to remove member from channel' };
  }
}

export async function addReaction(messageId: string, reaction: string, userId: string) {
  const supabase = createClient();
  
  try {
    // Get current reactions
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('reactions')
      .eq('id', messageId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching message for reaction:', fetchError);
      return { error: fetchError.message };
    }
    
    const reactions = (message.reactions as Record<string, { count: number; users: string[] }>) || {};
    
    // Add or increment reaction
    if (reactions[reaction]) {
      if (reactions[reaction].users.includes(userId)) {
        // Remove reaction if user already reacted
        reactions[reaction].users = reactions[reaction].users.filter((id: string) => id !== userId);
        reactions[reaction].count = Math.max(0, reactions[reaction].count - 1);
        
        if (reactions[reaction].count === 0) {
          delete reactions[reaction];
        }
      } else {
        // Add user to reaction
        reactions[reaction].users.push(userId);
        reactions[reaction].count++;
      }
    } else {
      // Create new reaction
      reactions[reaction] = {
        count: 1,
        users: [userId]
      };
    }
    
    const { error: updateError } = await supabase
      .from('messages')
      .update({
        reactions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId);
    
    if (updateError) {
      console.error('Error updating message reactions:', updateError);
      return { error: updateError.message };
    }
    
    revalidatePath('/messages');
    
    return { error: null };
  } catch (error) {
    console.error('Error in addReaction:', error);
    return { error: 'Failed to add reaction' };
  }
}

export async function getChannelMembers(channelId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('channel_members')
      .select(`
        *,
        member:team_members!channel_members_member_id_fkey(
          id,
          name,
          email,
          avatar_url,
          role,
          status
        )
      `)
      .eq('channel_id', channelId);
    
    if (error) {
      console.error('Error fetching channel members:', error);
      return { members: [], error: error.message };
    }
    
    const members = data?.map(item => item.member) || [];
    
    return { members, error: null };
  } catch (error) {
    console.error('Error in getChannelMembers:', error);
    return { members: [], error: 'Failed to fetch channel members' };
  }
}

export async function searchMessages(workspaceId: string, query: string, channelId?: string) {
  const supabase = createClient();
  
  try {
    let queryBuilder = supabase
      .from('messages')
      .select(`
        *,
        channel:channels!inner(
          id,
          name,
          type
        ),
        user:team_members!messages_user_id_fkey(
          id,
          name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId)
      .textSearch('text', query);
    
    if (channelId) {
      queryBuilder = queryBuilder.eq('channel_id', channelId);
    }
    
    const { data, error } = await queryBuilder
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error searching messages:', error);
      return { messages: [], error: error.message };
    }
    
    return { messages: data || [], error: null };
  } catch (error) {
    console.error('Error in searchMessages:', error);
    return { messages: [], error: 'Failed to search messages' };
  }
}

export async function markChannelAsRead() {
  // This would typically update a user_channel_read_status table
  // For now, we'll just return success
  return { error: null };
}

export async function getUnreadMessageCount() {
  // This would calculate unread messages based on last read timestamps
  // For now, we'll return 0
  return { count: 0, error: null };
} 