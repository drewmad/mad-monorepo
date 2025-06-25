-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, email)
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on_hold', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL DEFAULT 0,
  spent DECIMAL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID,
  due_date DATE,
  estimated_hours DECIMAL,
  time_tracked DECIMAL DEFAULT 0,
  section TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER, -- minutes
  type TEXT DEFAULT 'meeting',
  location TEXT,
  meeting_url TEXT,
  attendees TEXT[],
  recorded BOOLEAN DEFAULT FALSE,
  recording_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channels table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'public' CHECK (type IN ('public', 'private', 'direct', 'project')),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channel members table
CREATE TABLE IF NOT EXISTS public.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  member_id UUID NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, member_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  parent_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  edited_at TIMESTAMPTZ,
  reactions JSONB,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_workspace_id ON public.team_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON public.team_members(email);
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON public.projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_events_workspace_id ON public.events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_channels_workspace_id ON public.channels(workspace_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_channel_id ON public.channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_member_id ON public.channel_members(member_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON public.messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp);

-- Enable Row Level Security
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Workspaces: Users can see workspaces they are members of
CREATE POLICY "Users can view their workspaces" ON public.workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = workspaces.id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

-- Team members: Users can see members in their workspaces
CREATE POLICY "Users can view team members in their workspaces" ON public.team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.workspace_id = team_members.workspace_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- Projects: Users can see projects in their workspaces
CREATE POLICY "Users can view projects in their workspaces" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = projects.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

-- Tasks: Users can see tasks in projects they have access to
CREATE POLICY "Users can view tasks in their projects" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON tm.workspace_id = p.workspace_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- Events: Users can see events in their workspaces
CREATE POLICY "Users can view events in their workspaces" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = events.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

-- Channels: Users can see channels in their workspaces
CREATE POLICY "Users can view channels in their workspaces" ON public.channels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = channels.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

-- Channel members: Users can see channel members
CREATE POLICY "Users can view channel members" ON public.channel_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.channels c
      INNER JOIN public.team_members tm ON tm.workspace_id = c.workspace_id
      WHERE c.id = channel_members.channel_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- Messages: Users can see messages in channels they have access to
CREATE POLICY "Users can view messages in their channels" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.channels c
      INNER JOIN public.team_members tm ON tm.workspace_id = c.workspace_id
      WHERE c.id = messages.channel_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- Profiles: Users can view all profiles
CREATE POLICY "Users can view profiles" ON public.profiles
  FOR SELECT USING (true);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert policies for authenticated users
CREATE POLICY "Authenticated users can create workspaces" ON public.workspaces
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can create projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = projects.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Project members can create tasks" ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON tm.workspace_id = p.workspace_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
      AND tm.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Workspace members can create events" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = events.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Workspace members can create channels" ON public.channels
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = channels.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Channel members can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.channel_members cm
      WHERE cm.channel_id = messages.channel_id
      AND cm.member_id = auth.uid()
    )
  );

-- Update policies
CREATE POLICY "Workspace owners and admins can update workspaces" ON public.workspaces
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = workspaces.id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Project members can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = projects.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Task assignees and project members can update tasks" ON public.tasks
  FOR UPDATE USING (
    tasks.assignee_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON tm.workspace_id = p.workspace_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
      AND tm.role IN ('owner', 'admin', 'member')
    )
  );

-- Delete policies
CREATE POLICY "Workspace owners can delete workspaces" ON public.workspaces
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = workspaces.id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.role = 'owner'
    )
  );

CREATE POLICY "Project admins can delete projects" ON public.projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.workspace_id = projects.workspace_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
      AND team_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Task creators and admins can delete tasks" ON public.tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON tm.workspace_id = p.workspace_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at triggers for all tables
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
