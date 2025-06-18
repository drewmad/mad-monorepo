'use client';

import Link from 'next/link';
import { Card, Badge, Progress, Avatar } from '@ui';
import { useModal } from '@/contexts/AppContext';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  progress: number;
  budget: number;
  spent: number;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectMember {
  id: string;
  name: string;
  avatar_url?: string;
  role: 'lead' | 'member' | 'viewer';
}

interface ProjectCardProps {
  project: Project;
  members?: ProjectMember[];
  taskCount?: number;
  completedTasks?: number;
}

export function ProjectCard({
  project,
  members = [],
  taskCount = 0,
  completedTasks = 0
}: ProjectCardProps) {
  const { openModal } = useModal();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'on_hold': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'on_hold': return 'On Hold';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100); // assuming amount is in cents
  };

  const budgetUsedPercentage = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const remainingBudget = project.budget - project.spent;

  const handleDeleteProject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openModal('confirmation', {
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: () => {
        // TODO: Implement project deletion
        console.log('Deleting project:', project.id);
      }
    });
  };

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500 group-hover:border-l-indigo-600">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Badge variant={getStatusColor(project.status) as 'default' | 'primary' | 'success' | 'warning' | 'danger'} size="sm">
                {getStatusText(project.status)}
              </Badge>
              <button
                onClick={handleDeleteProject}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{project.progress}%</span>
            </div>
            <Progress
              value={project.progress}
              variant={project.progress === 100 ? 'success' : 'default'}
              size="sm"
            />
          </div>

          {/* Tasks Summary */}
          {taskCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tasks</span>
              <span className="font-medium text-gray-900">
                {completedTasks} of {taskCount} completed
              </span>
            </div>
          )}

          {/* Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Budget</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
              </span>
            </div>
            {project.budget > 0 && (
              <Progress
                value={budgetUsedPercentage}
                variant={budgetUsedPercentage > 90 ? 'danger' : budgetUsedPercentage > 75 ? 'warning' : 'default'}
                size="sm"
              />
            )}
            <div className="flex items-center justify-between text-xs">
              <span className={`${remainingBudget < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {remainingBudget < 0 ? 'Over budget by ' : 'Remaining: '}
                {formatCurrency(Math.abs(remainingBudget))}
              </span>
              <span className="text-gray-500">
                {budgetUsedPercentage.toFixed(1)}% used
              </span>
            </div>
          </div>

          {/* Team Members */}
          {members.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Team</span>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {members.slice(0, 4).map((member) => (
                    <Avatar
                      key={member.id}
                      src={member.avatar_url}
                      initials={member.name.split(' ').map(n => n[0]).join('')}
                      size="sm"
                      className="ring-2 ring-white"
                    />
                  ))}
                  {members.length > 4 && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-medium text-gray-600 ring-2 ring-white">
                      +{members.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
} 