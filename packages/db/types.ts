/** Supabase generated types */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          logo_url?: string | null;
        };
      };
      team_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          name: string;
          email: string;
          role: 'owner' | 'admin' | 'member' | 'guest';
          avatar_url: string | null;
          status: 'active' | 'inactive' | 'pending';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          name: string;
          email: string;
          role?: 'owner' | 'admin' | 'member' | 'guest';
          avatar_url?: string | null;
          status?: 'active' | 'inactive' | 'pending';
        };
        Update: Partial<Database['public']['Tables']['team_members']['Row']>;
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          status: 'active' | 'completed' | 'on_hold' | 'cancelled';
          progress: number;
          budget: number;
          spent: number;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
          progress?: number;
          budget?: number;
          spent?: number;
          start_date?: string | null;
          end_date?: string | null;
        };
        Update: Partial<Database['public']['Tables']['projects']['Row']>;
      };
      project_members: {
        Row: {
          project_id: string;
          member_id: string;
          role: 'lead' | 'member' | 'viewer';
          created_at: string;
        };
        Insert: {
          project_id: string;
          member_id: string;
          role?: 'lead' | 'member' | 'viewer';
        };
        Update: {
          role?: 'lead' | 'member' | 'viewer';
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          parent_task_id: string | null; // For sub-tasks
          name: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assignee_id: string | null;
          due_date: string | null;
          time_tracked: number;
          estimated_hours: number | null;
          section: string | null; // For task sections/categories
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          parent_task_id?: string | null;
          name: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assignee_id?: string | null;
          due_date?: string | null;
          time_tracked?: number;
          estimated_hours?: number | null;
          section?: string | null;
        };
        Update: Partial<Database['public']['Tables']['tasks']['Row']>;
      };
      events: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          description: string | null;
          date: string; // YYYY-MM-DD
          time: string; // HH:MM format
          duration: number | null; // minutes
          location: string | null;
          meeting_url: string | null;
          recorded: boolean;
          recording_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          description?: string | null;
          date: string;
          time: string;
          duration?: number | null;
          location?: string | null;
          meeting_url?: string | null;
          recorded?: boolean;
          recording_url?: string | null;
          created_by: string;
        };
        Update: Partial<Database['public']['Tables']['events']['Row']>;
      };
      event_attendees: {
        Row: {
          event_id: string;
          member_id: string;
          status: 'attending' | 'maybe' | 'not_attending' | 'pending';
          created_at: string;
        };
        Insert: {
          event_id: string;
          member_id: string;
          status?: 'attending' | 'maybe' | 'not_attending' | 'pending';
        };
        Update: {
          status?: 'attending' | 'maybe' | 'not_attending' | 'pending';
        };
      };
      messages: {
        Row: {
          id: string;
          workspace_id: string;
          channel_id: string; // could be 'general', 'random', or project-specific
          user_id: string;
          text: string;
          timestamp: string;
          parent_id: string | null; // For threaded messages
          edited_at: string | null;
          reactions: Json | null; // JSON object of reactions
          attachments: Json | null; // JSON array of file attachments
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          channel_id: string;
          user_id: string;
          text: string;
          timestamp: string;
          parent_id?: string | null;
          edited_at?: string | null;
          reactions?: Json | null;
          attachments?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Row']>;
      };
      channels: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          type: 'public' | 'private' | 'direct' | 'project';
          project_id: string | null; // For project-specific channels
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          type?: 'public' | 'private' | 'direct' | 'project';
          project_id?: string | null;
          created_by: string;
        };
        Update: Partial<Database['public']['Tables']['channels']['Row']>;
      };
      channel_members: {
        Row: {
          channel_id: string;
          member_id: string;
          joined_at: string;
        };
        Insert: {
          channel_id: string;
          member_id: string;
        };
        Update: Record<string, never>; // No updates for this table
      };
      transactions: {
        Row: {
          id: string;
          project_id: string;
          workspace_id: string;
          item: string;
          description: string | null;
          category: 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other';
          amount: number; // in cents
          currency: string; // e.g., 'USD'
          transaction_date: string;
          receipt_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          workspace_id: string;
          item: string;
          description?: string | null;
          category: 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other';
          amount: number;
          currency?: string;
          transaction_date: string;
          receipt_url?: string | null;
          created_by: string;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Row']>;
      };
      workspace_roles: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          permissions: Json; // JSON object of permissions
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          permissions: Json;
          is_default?: boolean;
        };
        Update: Partial<Database['public']['Tables']['workspace_roles']['Row']>;
      };
      activity_feed: {
        Row: {
          id: string;
          workspace_id: string;
          actor_id: string;
          action: string;
          target_type: 'project' | 'task' | 'event' | 'message' | 'member';
          target_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          actor_id: string;
          action: string;
          target_type: 'project' | 'task' | 'event' | 'message' | 'member';
          target_id?: string | null;
          metadata?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['activity_feed']['Row']>;
      };
    };
    Views: {
      time_tracked_last_30_days: {
        Row: { project_id: string; total_hours: number };
      };
      project_financials: {
        Row: {
          project_id: string;
          total_budget: number;
          total_spent: number;
          remaining_budget: number;
          transaction_count: number;
        };
      };
      workspace_members_count: {
        Row: {
          workspace_id: string;
          total_members: number;
          active_members: number;
        };
      };
    };
    Functions: {
      get_project_progress: {
        Args: { project_id: string };
        Returns: number;
      };
      get_user_workspaces: {
        Args: { user_id: string };
        Returns: Database['public']['Tables']['workspaces']['Row'][];
      };
    };
  };
} 