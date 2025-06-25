import clsx from 'clsx';

interface Task {
  id: string;
  name: string;
  due_date: string | null;
}

interface TaskCalendarProps {
  tasks: Task[];
  className?: string;
}

export function TaskCalendar({ tasks, className }: TaskCalendarProps) {
  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const date = task.due_date ? task.due_date.split('T')[0] : 'No due date';
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <div className={clsx('space-y-6', className)}>
      {Object.entries(grouped).map(([date, list]) => (
        <div key={date}>
          <h3 className="mb-2 text-sm font-medium text-gray-700">{date}</h3>
          <ul className="space-y-2">
            {list.map(task => (
              <li key={task.id} className="rounded-md bg-white p-2 text-sm shadow">
                {task.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

TaskCalendar.displayName = 'TaskCalendar';
