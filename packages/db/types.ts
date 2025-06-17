/** Supabase generated types */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string };
        Update: { name?: string };
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          status: string;
          progress: number;
          budget: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          status?: string;
          progress?: number;
          budget?: number;
        };
        Update: Partial<Database['public']['Tables']['projects']['Row']>;
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          status: string;
          priority: string;
          assignee: string | null;
          due_date: string | null;
          time_tracked: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          status?: string;
          priority?: string;
          assignee?: string | null;
          due_date?: string | null;
          time_tracked?: number;
        };
        Update: Partial<Database['public']['Tables']['tasks']['Row']>;
      };
      activity_feed: {
        Row: {
          id: string;
          workspace_id: string;
          actor_id: string;
          action: string;
          target: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          actor_id: string;
          action: string;
          target?: string | null;
        };
        Update: Partial<Database['public']['Tables']['activity_feed']['Row']>;
      };
    };
    Views: {
      time_tracked_last_30_days: {
        Row: { project_id: string; total_hours: number };
      };
    };
    Functions: {
      // none for now
    };
  };
} 