import clsx from 'clsx';

interface Task {
  id: string;
  name: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
}

interface KanbanBoardProps {
  tasks: Task[];
  className?: string;
}

export function KanbanBoard({ tasks, className }: KanbanBoardProps) {
  const columns: Record<Task['status'], string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <div className={clsx('grid grid-cols-4 gap-4', className)}>
      {Object.entries(columns).map(([key, label]) => (
        <div key={key} className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">{label}</h3>
          <div className="space-y-2">
            {tasks
              .filter(task => task.status === key)
              .map(task => (
                <div
                  key={task.id}
                  className="rounded-md bg-white p-2 text-sm shadow"
                >
                  {task.name}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

KanbanBoard.displayName = 'KanbanBoard';
