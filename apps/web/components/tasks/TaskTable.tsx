import { TableHTMLAttributes } from 'react';
import { Badge } from '@ui';
import clsx from 'clsx';

interface Task {
  id: string;
  project_id: string;
  parent_task_id: string | null;
  name: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  due_date: string | null;
  time_tracked: number;
  estimated_hours: number | null;
  section: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskTableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'tasks'> {
  tasks: Task[];
}

export function TaskTable({ tasks, className, ...props }: TaskTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'default';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'default';
      case 'medium': return 'warning';
      case 'high': return 'primary';
      case 'urgent': return 'danger';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatHours = (minutes: number) => {
    const hours = minutes / 60;
    return hours.toFixed(1);
  };

  return (
    <div className="overflow-x-auto">
      <table className={clsx('w-full text-sm', className)} {...props}>
        <thead>
          <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
            <th className="py-3 px-2">Task</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2">Priority</th>
            <th className="py-3 px-2">Section</th>
            <th className="py-3 px-2">Assignee</th>
            <th className="py-3 px-2 text-right">Due Date</th>
            <th className="py-3 px-2 text-right">Progress</th>
            <th className="py-3 px-2 text-right">Time (h)</th>
            <th className="py-3 px-2 text-right">Estimated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-gray-500">
                No tasks found
              </td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{task.name}</span>
                    {task.description && (
                      <span className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                      </span>
                    )}
                    {task.parent_task_id && (
                      <span className="text-xs text-indigo-600 mt-1">
                        Sub-task
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <Badge
                    variant={getStatusColor(task.status) as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
                    size="sm"
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <Badge
                    variant={getPriorityColor(task.priority) as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
                    size="sm"
                  >
                    {task.priority}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <span className="text-gray-600">{task.section || '-'}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="text-gray-600">
                    {task.assignee_id ? 'Assigned' : 'Unassigned'}
                  </span>
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {formatDate(task.due_date)}
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {task.estimated_hours && task.time_tracked > 0 && (
                      <div className="text-xs text-gray-500">
                        {Math.round((task.time_tracked / (task.estimated_hours * 60)) * 100)}%
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-gray-900 font-medium">
                  {formatHours(task.time_tracked)}
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {task.estimated_hours ? `${task.estimated_hours}h` : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 