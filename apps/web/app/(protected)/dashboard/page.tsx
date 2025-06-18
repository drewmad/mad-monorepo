'use client';

import { Card, KpiCard, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@ui';
import { ProjectsGrid } from '@/components/projects';
import { TaskTable } from '@/components/tasks';
import { TaskSuggestions } from '@/components/ai/TaskSuggestions';
import { SmartAnalytics } from '@/components/ai/SmartAnalytics';
import type { Database } from '@mad/db';

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'] & {
  assignee?: {
    id: string;
    name: string;
    avatar_url?: string | null;
  };
  project?: {
    id: string;
    name: string;
  };
};

// Mock data for demonstration
const mockKpis = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+2 this month',
    trend: 'up' as const,
    icon: '📁'
  },
  {
    title: 'Completed Tasks',
    value: '847',
    change: '+23% from last month',
    trend: 'up' as const,
    icon: '✅'
  },
  {
    title: 'Team Members',
    value: '28',
    change: '+4 new hires',
    trend: 'up' as const,
    icon: '👥'
  },
  {
    title: 'Budget Utilization',
    value: '67%',
    change: 'On track',
    trend: 'stable' as const,
    icon: '💰'
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    workspace_id: 'ws1',
    name: 'Project Alpha',
    description: 'Next-generation mobile app with AI features',
    status: 'active',
    progress: 65,
    budget: 150000,
    spent: 89000,
    start_date: '2024-01-15',
    end_date: '2024-04-30',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    workspace_id: 'ws1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'active',
    progress: 15,
    budget: 75000,
    spent: 12000,
    start_date: '2024-02-01',
    end_date: '2024-05-15',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-05T00:00:00Z'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    project_id: '1',
    parent_task_id: null,
    name: 'Implement user authentication',
    description: 'Set up secure login and registration system',
    status: 'in_progress',
    priority: 'high',
    assignee_id: 'user1',
    due_date: '2024-02-15',
    time_tracked: 12,
    estimated_hours: 16,
    section: null,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
    assignee: {
      id: 'user1',
      name: 'John Doe',
      avatar_url: null
    },
    project: {
      id: '1',
      name: 'Project Alpha'
    }
  },
  {
    id: '2',
    project_id: '1',
    parent_task_id: null,
    name: 'Design dashboard UI',
    description: 'Create wireframes and mockups for the dashboard',
    status: 'completed',
    priority: 'medium',
    assignee_id: 'user2',
    due_date: '2024-02-10',
    time_tracked: 9,
    estimated_hours: 8,
    section: null,
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
    assignee: {
      id: 'user2',
      name: 'Alice Smith',
      avatar_url: null
    },
    project: {
      id: '1',
      name: 'Project Alpha'
    }
  }
];

export default function DashboardPage() {
  const upcomingTasks = mockTasks.filter(task =>
    task.status !== 'completed' &&
    task.due_date &&
    new Date(task.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const recentActivity = [
    {
      id: '1',
      type: 'task_completed',
      message: 'Alice Smith completed "Design dashboard UI"',
      timestamp: '2 hours ago',
      icon: '✅',
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'project_updated',
      message: 'Project Alpha budget updated to $150,000',
      timestamp: '4 hours ago',
      icon: '💰',
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'team_member_added',
      message: 'New team member joined Website Redesign',
      timestamp: '1 day ago',
      icon: '👥',
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'milestone_reached',
      message: 'Project Alpha reached 65% completion',
      timestamp: '2 days ago',
      icon: '🎯',
      color: 'text-orange-600'
    }
  ];

  const handleTaskCreate = (task: Partial<Task>) => {
    console.log('Creating new task:', task);
    // In a real app, this would create a new task
  };

  const handleSubtaskGenerate = (parentTaskId: string, subtasks: Partial<Task>[]) => {
    console.log('Generating subtasks for:', parentTaskId, subtasks);
    // In a real app, this would create subtasks
  };

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
                  <Button variant="ghost">View All</Button>
                </div>
                <ProjectsGrid projects={mockProjects} />
              </Card>
            </div>

            {/* Sidebar with Activity and Upcoming Tasks */}
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No upcoming deadlines</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
                          <p className="text-xs text-gray-500">Due {task.due_date}</p>
                        </div>
                        <Badge variant={task.priority === 'high' ? 'danger' : 'default'}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Suggestions */}
            <div>
              <TaskSuggestions
                projectId="dashboard"
                projectName="All Projects"
                projectDescription="AI-powered task suggestions for all your projects"
                onTaskCreate={handleTaskCreate}
                onSubtaskGenerate={handleSubtaskGenerate}
              />
            </div>

            {/* Smart Analytics */}
            <div>
              <SmartAnalytics />
            </div>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
              <div className="flex items-center space-x-3">
                <select className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <option>All Status</option>
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <Button variant="primary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Project
                </Button>
              </div>
            </div>
            <ProjectsGrid projects={mockProjects} />
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
              <div className="flex items-center space-x-3">
                <select className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <option>All Tasks</option>
                  <option>My Tasks</option>
                  <option>Overdue</option>
                  <option>Completed</option>
                </select>
                <Button variant="primary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Task
                </Button>
              </div>
            </div>
            <TaskTable tasks={mockTasks} />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Footer */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Quick Actions:</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </Button>
              <Button variant="ghost">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Meeting
              </Button>
              <Button variant="ghost">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Invite Member
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </main>
  );
} 