'use client';

import { useState, useEffect } from 'react';
import { Card, KpiCard, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Modal, Input, Textarea, Select, Toast } from '@ui';
import { ProjectsGrid } from '@/components/projects';
import { TaskTable } from '@/components/tasks';
import { TaskSuggestions } from '@/components/ai/TaskSuggestions';
import { SmartAnalytics } from '@/components/ai/SmartAnalytics';
import { Plus, Download } from 'lucide-react';
import type { Database } from '@mad/db';
import { getProjects, createProject, getProjectStats } from '@/actions/projects';
import { getTasks, createTask, getTaskStats } from '@/actions/tasks';
import { createEvent } from '@/actions/events';

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
// Removed mockKpis - now using real data from state

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
  const [loading, setLoading] = useState(false);
  
  // Real data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [kpis, setKpis] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
    teamMembers: 0
  });
  
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

  const upcomingTasks = tasks.filter(task =>
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

  // Load real data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch projects and project stats
        const { projects: fetchedProjects, error: projectsError } = await getProjects();
        if (!projectsError && fetchedProjects) {
          setProjects(fetchedProjects);
        } else if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          // Use mock data as fallback if database isn't available
          setProjects(mockProjects);
        }

        // Fetch tasks and task stats
        const { tasks: fetchedTasks, error: tasksError } = await getTasks();
        if (!tasksError && fetchedTasks) {
          setTasks(fetchedTasks);
        } else if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
          // Use mock data as fallback if database isn't available
          setTasks(mockTasks);
        }

        // Update KPIs with real data or fallback to mock
        const { stats: projectStats } = await getProjectStats();
        const { stats: taskStats } = await getTaskStats();
        
        if (projectStats && taskStats) {
          setKpis({
            projects: projectStats.total || 0,
            tasks: taskStats.total || 0,
            completedTasks: taskStats.completed || 0,
            teamMembers: 12 // This would come from user management
          });
        } else {
          // Fallback to mock data if stats aren't available
          setKpis({
            projects: mockProjects.length,
            tasks: mockTasks.length,
            completedTasks: mockTasks.filter(t => t.status === 'completed').length,
            teamMembers: 28
          });
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use mock data as fallback
        setProjects(mockProjects);
        setTasks(mockTasks);
        setKpis({
          projects: mockProjects.length,
          tasks: mockTasks.length,
          completedTasks: mockTasks.filter(t => t.status === 'completed').length,
          teamMembers: 28
        });
        showNotification('Using offline data - check your connection');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleExportReport = () => {
    showNotification('Generating report... This will download shortly.');
    // Generate and download a report with real data
    setTimeout(() => {
      const data = {
        projects: projects,
        tasks: tasks,
        kpis: [
          { title: 'Active Projects', value: kpis.projects.toString(), icon: '📁' },
          { title: 'Total Tasks', value: kpis.tasks.toString(), icon: '📋' },
          { title: 'Completed Tasks', value: kpis.completedTasks.toString(), icon: '✅' },
          { title: 'Team Members', value: kpis.teamMembers.toString(), icon: '👥' }
        ],
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

  const handleCreateProject = async () => {
    setLoading(true);
    try {
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        budget: newProject.budget ? parseFloat(newProject.budget) : undefined,
        start_date: newProject.start_date,
        end_date: newProject.end_date,
        status: 'active' as const,
        progress: 0,
        workspace_id: 'default-workspace' // This would come from user context
      };

      const { project, error } = await createProject(projectData);
      
      if (error) {
        showNotification(`Error creating project: ${error}`);
      } else if (project) {
        showNotification('Project created successfully!');
        setProjects(prev => [project, ...prev]);
        setShowCreateProject(false);
        setNewProject({
          name: '',
          description: '',
          budget: '',
          start_date: new Date().toISOString().split('T')[0],
          end_date: ''
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showNotification('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    setLoading(true);
    try {
      const taskData = {
        name: newTask.name,
        description: newTask.description,
        project_id: newTask.project_id || projects[0]?.id || '',
        priority: newTask.priority,
        due_date: newTask.due_date || undefined,
        estimated_hours: newTask.estimated_hours ? parseFloat(newTask.estimated_hours) : undefined,
        status: 'todo' as const,
        assignee_id: undefined, // This would come from user selection
        parent_task_id: undefined,
        section: undefined
      };

      const { task, error } = await createTask(taskData);
      
      if (error) {
        showNotification(`Error creating task: ${error}`);
      } else if (task) {
        showNotification('Task created successfully!');
        setTasks(prev => [task, ...prev]);
        setShowCreateTask(false);
        setNewTask({
          name: '',
          description: '',
          project_id: '',
          priority: 'medium',
          due_date: '',
          estimated_hours: ''
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showNotification('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    setLoading(true);
    try {
      const eventData = {
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        time: newMeeting.time,
        duration: parseInt(newMeeting.duration),
        workspace_id: 'default-workspace', // This would come from user context
        created_by: 'current-user-id', // This would come from auth
        recorded: false
      };

      const { event, error } = await createEvent(eventData);
      
      if (error) {
        showNotification(`Error scheduling meeting: ${error}`);
      } else if (event) {
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
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      showNotification('Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = () => {
    console.log('Inviting member:', inviteEmail);
    showNotification(`Invitation sent to ${inviteEmail}`);
    setShowInviteMember(false);
    setInviteEmail('');
    // In a real app, this would send an invitation email
  };

  if (loading && projects.length === 0 && tasks.length === 0) {
    return (
      <main className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </main>
    );
  }

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
        <KpiCard
          title="Active Projects"
          value={kpis.projects.toString()}
          change={`${projects.filter(p => p.status === 'active').length} active`}
          icon="📁"
        />
        <KpiCard
          title="Total Tasks"
          value={kpis.tasks.toString()}
          change={`${tasks.filter(t => t.status === 'in_progress').length} in progress`}
          icon="📋"
        />
        <KpiCard
          title="Completed Tasks"
          value={kpis.completedTasks.toString()}
          change={`${Math.round((kpis.completedTasks / Math.max(kpis.tasks, 1)) * 100)}% completion rate`}
          icon="✅"
        />
        <KpiCard
          title="Team Members"
          value={kpis.teamMembers.toString()}
          change="Active contributors"
          icon="👥"
        />
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
                  <Button variant="ghost" onClick={() => window.location.href = '/dashboards/projects'}>View All</Button>
                </div>
                <ProjectsGrid projects={projects} />
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
            <ProjectsGrid projects={projects} />
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
            <TaskTable tasks={tasks} />
          </Card>
        </TabsContent>
      </Tabs>

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
              disabled={!newProject.name.trim() || loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Project'
              )}
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
              ...projects.map(p => ({ value: p.id, label: p.name }))
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
              disabled={!newTask.name.trim() || loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Task'
              )}
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
              disabled={!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time || loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Scheduling...</span>
                </div>
              ) : (
                'Schedule Meeting'
              )}
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
