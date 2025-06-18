'use client';

import { useState } from 'react';
import { Card, KpiCard, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Modal, Input, Textarea, Select, Toast } from '@ui';
import { ProjectsGrid } from '@/components/projects';
import { TaskTable } from '@/components/tasks';
import { TaskSuggestions } from '@/components/ai/TaskSuggestions';
import { SmartAnalytics } from '@/components/ai/SmartAnalytics';
import { Plus, Download, Calendar, Users } from 'lucide-react';
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
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Form states
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    budget: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });
  
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    project_id: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    due_date: '',
    estimated_hours: ''
  });
  
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    attendees: ''
  });
  
  const [inviteEmail, setInviteEmail] = useState('');

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

  const handleTaskCreate = (task: Partial<{
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimated_hours: number;
    assignee: string;
  }>) => {
    console.log('Creating new task:', task);
    showNotification('Task created successfully!');
  };

  const handleSubtaskGenerate = (parentTaskId: string, subtasks: Partial<{
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimated_hours: number;
    assignee: string;
  }>[]) => {
    console.log('Generating subtasks for:', parentTaskId, subtasks);
    showNotification(`${subtasks.length} subtasks generated!`);
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExportReport = () => {
    showNotification('Generating report... This will download shortly.');
    // In a real app, this would generate and download a report
    setTimeout(() => {
      const data = {
        projects: mockProjects,
        tasks: mockTasks,
        kpis: mockKpis,
        generated_at: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleCreateProject = () => {
    console.log('Creating project:', newProject);
    showNotification('Project created successfully!');
    setShowCreateProject(false);
    setNewProject({
      name: '',
      description: '',
      budget: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    });
    // In a real app, this would create a project via API
  };

  const handleCreateTask = () => {
    console.log('Creating task:', newTask);
    showNotification('Task created successfully!');
    setShowCreateTask(false);
    setNewTask({
      name: '',
      description: '',
      project_id: '',
      priority: 'medium',
      due_date: '',
      estimated_hours: ''
    });
    // In a real app, this would create a task via API
  };

  const handleScheduleMeeting = () => {
    console.log('Scheduling meeting:', newMeeting);
    showNotification('Meeting scheduled successfully!');
    setShowScheduleMeeting(false);
    setNewMeeting({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '60',
      attendees: ''
    });
    // In a real app, this would create a calendar event
  };

  const handleInviteMember = () => {
    console.log('Inviting member:', inviteEmail);
    showNotification(`Invitation sent to ${inviteEmail}`);
    setShowInviteMember(false);
    setInviteEmail('');
    // In a real app, this would send an invitation email
  };

  return (
    <main className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary" onClick={() => setShowCreateProject(true)}>
            <Plus className="w-4 h-4 mr-2" />
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
                  <Button variant="ghost" onClick={() => window.location.href = '/projects'}>View All</Button>
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
                <Button variant="primary" onClick={() => setShowCreateProject(true)}>
                  <Plus className="w-4 h-4 mr-2" />
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
                <Button variant="primary" onClick={() => setShowCreateTask(true)}>
                  <Plus className="w-4 h-4 mr-2" />
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
              <Button variant="ghost" onClick={() => setShowCreateTask(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Task
              </Button>
              <Button variant="ghost" onClick={() => setShowScheduleMeeting(true)}>
                <Calendar className="w-4 h-4 mr-1" />
                Schedule Meeting
              </Button>
              <Button variant="ghost" onClick={() => setShowInviteMember(true)}>
                <Users className="w-4 h-4 mr-1" />
                Invite Member
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        title="Create New Project"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="Enter project name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Describe your project..."
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget"
              type="number"
              placeholder="Enter budget"
              value={newProject.budget}
              onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
                <option>Planning</option>
                <option>Active</option>
                <option>On Hold</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={newProject.start_date}
              onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={newProject.end_date}
              onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowCreateProject(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              disabled={!newProject.name.trim()}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        title="Create New Task"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Task Name"
            placeholder="Enter task name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Describe the task..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows={3}
          />
          <Select
            label="Project"
            options={[
              { value: '', label: 'Select a project' },
              ...mockProjects.map(p => ({ value: p.id, label: p.name }))
            ]}
            value={newTask.project_id}
            onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
            />
            <Input
              label="Estimated Hours"
              type="number"
              placeholder="Hours"
              value={newTask.estimated_hours}
              onChange={(e) => setNewTask({ ...newTask, estimated_hours: e.target.value })}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          />
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowCreateTask(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTask}
              disabled={!newTask.name.trim()}
            >
              Create Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Meeting Modal */}
      <Modal
        isOpen={showScheduleMeeting}
        onClose={() => setShowScheduleMeeting(false)}
        title="Schedule Meeting"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Meeting Title"
            placeholder="Enter meeting title"
            value={newMeeting.title}
            onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Meeting agenda..."
            value={newMeeting.description}
            onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={newMeeting.date}
              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
            />
            <Input
              label="Time"
              type="time"
              value={newMeeting.time}
              onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
            />
          </div>
          <Select
            label="Duration"
            options={[
              { value: '30', label: '30 minutes' },
              { value: '60', label: '1 hour' },
              { value: '90', label: '1.5 hours' },
              { value: '120', label: '2 hours' }
            ]}
            value={newMeeting.duration}
            onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
          />
          <Textarea
            label="Attendees"
            placeholder="Enter email addresses separated by commas"
            value={newMeeting.attendees}
            onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
            rows={2}
          />
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowScheduleMeeting(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleScheduleMeeting}
              disabled={!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time}
            >
              Schedule Meeting
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteMember}
        onClose={() => setShowInviteMember(false)}
        title="Invite Team Member"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send an invitation to join your workspace. They&apos;ll receive an email with instructions to get started.
          </p>
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowInviteMember(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleInviteMember}
              disabled={!inviteEmail.includes('@')}
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          id="dashboard-toast"
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
} 