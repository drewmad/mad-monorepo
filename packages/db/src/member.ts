import type { Database } from '../types';

export type TeamMember = Database['public']['Tables']['team_members']['Row'];

export type ProjectMember = {
  id: string;
  name: string;
  avatar_url: string | null;
  role: 'lead' | 'member' | 'viewer';
};
