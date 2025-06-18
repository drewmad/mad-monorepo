'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@mad/db';

type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];
type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];


// Workspace Management
export async function getWorkspaces(userId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        workspace_id,
        role,
        workspaces:workspace_id (
          id,
          name,
          slug,
          logo_url,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (error) {
      console.error('Error fetching workspaces:', error);
      return { workspaces: [], error: error.message };
    }
    
    const workspaces = data?.map(item => ({
      ...item.workspaces,
      userRole: item.role
    })) || [];
    
    return { workspaces, error: null };
  } catch (error) {
    console.error('Error in getWorkspaces:', error);
    return { workspaces: [], error: 'Failed to fetch workspaces' };
  }
}

export async function createWorkspace(data: Omit<WorkspaceInsert, 'id'>, ownerId: string) {
  const supabase = createClient();
  
  try {
    // Create workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert(data)
      .select()
      .single();
    
    if (workspaceError) {
      throw workspaceError;
    }
    
    // Add creator as owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        workspace_id: workspace.id,
        user_id: ownerId,
        name: 'Workspace Owner', // This would typically come from user profile
        email: 'owner@example.com', // This would come from user profile
        role: 'owner',
        status: 'active'
      });
    
    if (memberError) {
      // Rollback workspace creation if member insertion fails
      await supabase.from('workspaces').delete().eq('id', workspace.id);
      throw memberError;
    }
    
    revalidatePath('/workspace-selection');
    revalidatePath('/dashboard');
    
    return { workspace, error: null };
  } catch (error) {
    console.error('Error creating workspace:', error);
    return { workspace: null, error: 'Failed to create workspace' };
  }
}

// Team Member Management
export async function getTeamMembers(workspaceId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching team members:', error);
      return { members: [], error: error.message };
    }
    
    return { members: data || [], error: null };
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    return { members: [], error: 'Failed to fetch team members' };
  }
}

export async function inviteTeamMember(data: Omit<TeamMemberInsert, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  
  try {
    // Check if user is already a member
    const { data: existing, error: checkError } = await supabase
      .from('team_members')
      .select('id')
      .eq('workspace_id', data.workspace_id)
      .eq('email', data.email)
      .single();
    
    if (existing && !checkError) {
      return { member: null, error: 'User is already a member of this workspace' };
    }
    
    const { data: member, error } = await supabase
      .from('team_members')
      .insert({
        ...data,
        status: 'pending', // Set as pending until they accept invitation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inviting team member:', error);
      return { member: null, error: error.message };
    }
    
    // Here you would typically send an invitation email
    // await sendInvitationEmail(member.email, data.workspace_id);
    
    revalidatePath('/directory');
    
    return { member, error: null };
  } catch (error) {
    console.error('Error in inviteTeamMember:', error);
    return { member: null, error: 'Failed to invite team member' };
  }
}

export async function updateTeamMember(id: string, data: TeamMemberUpdate) {
  const supabase = createClient();
  
  try {
    const { data: member, error } = await supabase
      .from('team_members')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating team member:', error);
      return { member: null, error: error.message };
    }
    
    revalidatePath('/directory');
    
    return { member, error: null };
  } catch (error) {
    console.error('Error in updateTeamMember:', error);
    return { member: null, error: 'Failed to update team member' };
  }
}

export async function removeTeamMember(id: string) {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error removing team member:', error);
      return { error: error.message };
    }
    
    revalidatePath('/directory');
    
    return { error: null };
  } catch (error) {
    console.error('Error in removeTeamMember:', error);
    return { error: 'Failed to remove team member' };
  }
}

export async function acceptInvitation(memberId: string, userId: string) {
  const supabase = createClient();
  
  try {
    const { data: member, error } = await supabase
      .from('team_members')
      .update({
        user_id: userId,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', memberId)
      .eq('status', 'pending')
      .select()
      .single();
    
    if (error) {
      console.error('Error accepting invitation:', error);
      return { member: null, error: error.message };
    }
    
    revalidatePath('/workspace-selection');
    revalidatePath('/directory');
    
    return { member, error: null };
  } catch (error) {
    console.error('Error in acceptInvitation:', error);
    return { member: null, error: 'Failed to accept invitation' };
  }
}

export async function getWorkspaceStats(workspaceId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('status, role')
      .eq('workspace_id', workspaceId);
    
    if (error) {
      console.error('Error fetching workspace stats:', error);
      return { stats: null, error: error.message };
    }
    
    const stats = {
      totalMembers: data?.length || 0,
      activeMembers: data?.filter(m => m.status === 'active').length || 0,
      pendingMembers: data?.filter(m => m.status === 'pending').length || 0,
      admins: data?.filter(m => m.role === 'admin' || m.role === 'owner').length || 0,
    };
    
    return { stats, error: null };
  } catch (error) {
    console.error('Error in getWorkspaceStats:', error);
    return { stats: null, error: 'Failed to fetch workspace stats' };
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  
  try {
    // In a real app, this might query a profiles table
    // For now, we'll get user info from team_members table
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching user profile:', error);
      return { profile: null, error: error.message };
    }
    
    return { profile: data, error: null };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { profile: null, error: 'Failed to fetch user profile' };
  }
}

export async function searchUsers(workspaceId: string, query: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error searching users:', error);
      return { users: [], error: error.message };
    }
    
    return { users: data || [], error: null };
  } catch (error) {
    console.error('Error in searchUsers:', error);
    return { users: [], error: 'Failed to search users' };
  }
}

export async function getWorkspaceBySlugOrCode(identifier: string) {
  const supabase = createClient();
  
  try {
    // Try to find workspace by slug first
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('slug', identifier)
      .single();
    
    if (workspace && !workspaceError) {
      return { workspace, error: null };
    }
    
    // If not found by slug, try to find by invitation code
    // For now, we'll treat the identifier as a workspace slug
    // In a real implementation, you might have a separate invitations table
    
    return { workspace: null, error: 'Workspace not found' };
  } catch (error) {
    console.error('Error in getWorkspaceBySlugOrCode:', error);
    return { workspace: null, error: 'Failed to find workspace' };
  }
}

export async function joinWorkspaceByCode(identifier: string, userId: string) {
  const supabase = createClient();
  
  try {
    // First, try to find the workspace
    const { workspace, error: findError } = await getWorkspaceBySlugOrCode(identifier);
    
    if (findError || !workspace) {
      return { workspace: null, error: 'Invalid invitation code or workspace not found' };
    }
    
    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from('team_members')
      .select('id, status')
      .eq('workspace_id', workspace.id)
      .eq('user_id', userId)
      .single();
    
    if (existingMember && !checkError) {
      if (existingMember.status === 'active') {
        return { workspace: null, error: 'You are already a member of this workspace' };
      } else if (existingMember.status === 'pending') {
        // Accept the existing invitation
        const { error: acceptError } = await acceptInvitation(existingMember.id, userId);
        if (acceptError) {
          return { workspace: null, error: acceptError };
        }
        return { workspace, error: null };
      }
    }
    
    // Get user profile to get name and email
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { workspace: null, error: 'Failed to get user information' };
    }
    
    // Create new team member record
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        workspace_id: workspace.id,
        user_id: userId,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Member',
        email: user.email || '',
        role: 'member',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (memberError) {
      console.error('Error creating team member:', memberError);
      return { workspace: null, error: 'Failed to join workspace' };
    }
    
    revalidatePath('/workspace-selection');
    revalidatePath('/dashboard');
    
    return { workspace, error: null };
  } catch (error) {
    console.error('Error in joinWorkspaceByCode:', error);
    return { workspace: null, error: 'Failed to join workspace' };
  }
}

export async function getPendingInvitations(userId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        id,
        role,
        created_at,
        workspaces:workspace_id (
          id,
          name,
          slug,
          logo_url
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending invitations:', error);
      return { invitations: [], error: error.message };
    }
    
    const invitations = data?.map(item => ({
      id: item.id,
      role: item.role,
      created_at: item.created_at,
      workspace: item.workspaces
    })) || [];
    
    return { invitations, error: null };
  } catch (error) {
    console.error('Error in getPendingInvitations:', error);
    return { invitations: [], error: 'Failed to fetch pending invitations' };
  }
}

export async function createInvitationCode(workspaceId: string) {
  const supabase = createClient();
  
  try {
    // In a full implementation, you'd store this in an invitations table
    // For now, we'll just return the workspace slug as the "invitation code"
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('slug')
      .eq('id', workspaceId)
      .single();
    
    if (error) {
      console.error('Error getting workspace:', error);
      return { code: null, error: error.message };
    }
    
    // Return the workspace slug as the invitation code
    return { code: workspace.slug, error: null };
  } catch (error) {
    console.error('Error in createInvitationCode:', error);
    return { code: null, error: 'Failed to create invitation code' };
  }
} 