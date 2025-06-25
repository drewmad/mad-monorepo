import clsx from 'clsx';

interface Task {
  id: string;
  name: string;
  due_date: string | null;
  estimated_hours: number | null;
}

interface GanttChartProps {
  tasks: Task[];
  className?: string;
}

export function GanttChart({ tasks, className }: GanttChartProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {tasks.map(task => (
        <div key={task.id} className="flex items-center space-x-2">
          <span className="w-40 truncate text-sm text-gray-700">{task.name}</span>
          <div className="flex-1 bg-gray-100 h-4 rounded relative">
            <div
              className="h-4 rounded bg-indigo-600"
              style={{ width: `${(task.estimated_hours || 1) * 10}%` }}
            />
          </div>
          <span className="w-24 text-right text-xs text-gray-500">
            {task.due_date ? task.due_date.split('T')[0] : '-'}
          </span>
        </div>
      ))}
    </div>
  );
}

GanttChart.displayName = 'GanttChart';
