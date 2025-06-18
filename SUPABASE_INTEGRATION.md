# Supabase Integration Guide

This guide explains how to set up and use Supabase with this Next.js project management application.

## Overview

The application now uses **real Supabase database operations** instead of mock data. All CRUD operations (Create, Read, Update, Delete) are implemented using Supabase server actions.

## Features Implemented

### ✅ Real Database Operations
- **Projects**: Create, read, update, delete projects with real persistence
- **Tasks**: Full task management with assignees and project relationships
- **Events**: Calendar events and meeting scheduling
- **Messages**: Team communication with channels and threading
- **User Profiles**: User management and authentication

### ✅ Server Actions
- `/actions/projects.ts` - Complete project CRUD operations
- `/actions/tasks.ts` - Task management with subtasks and relationships
- `/actions/events.ts` - Calendar and event management
- `/actions/messages.ts` - Messaging and channel operations

### ✅ Dashboard Integration
- Real-time KPI calculations based on actual data
- Dynamic project and task listings
- Fallback to mock data when database is unavailable
- Loading states and error handling

## Setup Instructions

### 1. Environment Variables

Create `apps/web/.env.local` with your Supabase credentials:

```bash
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Database Setup

Ensure your Supabase database has the required tables:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  progress INTEGER DEFAULT 0,
  budget DECIMAL,
  spent DECIMAL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assignee_id UUID,
  due_date DATE,
  estimated_hours DECIMAL,
  time_tracked DECIMAL DEFAULT 0,
  section TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  type TEXT DEFAULT 'meeting',
  attendees TEXT[],
  recorded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channels table
CREATE TABLE channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parent_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  edited BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (for user management)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  workspace_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Row Level Security (RLS)

Enable RLS and create policies for each table. Example for projects:

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy examples (adjust based on your needs)
CREATE POLICY "Users can view projects in their workspace" ON projects
  FOR SELECT USING (workspace_id = current_setting('app.current_workspace'));

CREATE POLICY "Users can insert projects in their workspace" ON projects
  FOR INSERT WITH CHECK (workspace_id = current_setting('app.current_workspace'));

CREATE POLICY "Users can update projects in their workspace" ON projects
  FOR UPDATE USING (workspace_id = current_setting('app.current_workspace'));

CREATE POLICY "Users can delete projects in their workspace" ON projects
  FOR DELETE USING (workspace_id = current_setting('app.current_workspace'));
```

### 4. Test Your Setup

Run the test script to verify everything is working:

```bash
npx tsx scripts/test-supabase.ts
```

This will test:
- Environment variables
- Database connectivity
- Table access
- CRUD operations
- Server actions structure

## Usage Examples

### Creating a Project

```typescript
import { createProject } from '@/actions/projects';

const newProject = await createProject({
  name: 'My New Project',
  description: 'Project description',
  workspace_id: 'my-workspace',
  status: 'planning',
  budget: 50000,
  start_date: '2024-01-01',
  end_date: '2024-06-01'
});
```

### Fetching Tasks

```typescript
import { getTasks } from '@/actions/tasks';

const { tasks, error } = await getTasks('project-id');
if (!error) {
  console.log('Tasks:', tasks);
}
```

### Creating an Event

```typescript
import { createEvent } from '@/actions/events';

const event = await createEvent({
  title: 'Team Meeting',
  description: 'Weekly sync',
  date: '2024-02-15',
  time: '10:00',
  workspace_id: 'my-workspace',
  user_id: 'user-id',
  attendees: ['user1@example.com', 'user2@example.com']
});
```

## Dashboard Integration

The dashboard automatically:

1. **Loads real data** on component mount
2. **Falls back to mock data** if database is unavailable
3. **Shows loading states** during operations
4. **Displays error messages** with retry options
5. **Updates KPIs** based on actual project/task statistics

### Key Features:

- **Real-time stats**: Project counts, task completion rates, etc.
- **Dynamic project lists**: Shows actual projects from database
- **Working quick actions**: Create projects, tasks, and events that persist
- **Export functionality**: Downloads real data instead of mock data

## Error Handling

The integration includes comprehensive error handling:

### Database Connection Issues
- Fallback to mock data for offline development
- User-friendly error messages
- Retry mechanisms for failed operations

### Validation Errors
- Form validation before server actions
- Detailed error messages from Supabase
- Loading states to prevent duplicate submissions

### Permission Errors
- RLS policy compliance
- Workspace-based access control
- User role validation

## Development vs Production

### Development Mode
- Uses mock data as fallback
- Extensive logging for debugging
- Graceful degradation when database is unavailable

### Production Mode
- Requires working Supabase connection
- Real-time data synchronization
- Performance optimized queries

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure all imports use the correct paths
   - Verify server actions are in `/actions/` folder

2. **"Permission denied" errors**
   - Check RLS policies in Supabase dashboard
   - Verify user authentication status
   - Ensure workspace_id is correctly set

3. **"Table does not exist"**
   - Run database migrations: `supabase db push`
   - Check table names match exactly
   - Verify Supabase connection

4. **Loading never completes**
   - Check browser network tab for failed requests
   - Verify environment variables are set
   - Test database connection with the test script

### Debug Steps

1. Run the test script: `npx tsx scripts/test-supabase.ts`
2. Check browser console for errors
3. Verify environment variables in `.env.local`
4. Test database queries in Supabase SQL editor
5. Check RLS policies allow your operations

## Performance Considerations

### Optimizations Implemented

1. **Efficient queries**: Only fetch required fields
2. **Pagination**: Limit results for large datasets
3. **Caching**: Next.js route caching for server actions
4. **Loading states**: Prevent multiple simultaneous requests
5. **Error boundaries**: Graceful error handling

### Best Practices

- Use `revalidatePath()` after mutations
- Implement optimistic updates where appropriate
- Use database indexes for frequently queried fields
- Consider real-time subscriptions for collaborative features

## Next Steps

### Recommended Enhancements

1. **Real-time subscriptions** using Supabase Realtime
2. **File upload** for project attachments
3. **User roles and permissions** system
4. **Audit logging** for important operations
5. **Backup and recovery** procedures

### Migration from Mock Data

If you have existing mock data usage:

1. Replace direct mock data arrays with server action calls
2. Add loading states to components
3. Implement error handling for failed operations
4. Update forms to call server actions instead of console.log
5. Test all CRUD operations thoroughly

## Support

If you encounter issues:

1. Check this documentation first
2. Run the test script to identify problems
3. Review Supabase dashboard for errors
4. Check browser console and network tab
5. Verify all environment variables are correct

The integration provides a solid foundation for a production-ready project management application with real database persistence and comprehensive error handling. 