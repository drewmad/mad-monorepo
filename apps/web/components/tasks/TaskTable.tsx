import { TableHTMLAttributes } from 'react';
import clsx from 'clsx';

export function TaskTable({
  tasks,
  className
}: {
  tasks: {
    id: string;
    name: string;
    status: string;
    priority: string;
    assignee: string | null;
    due_date: string | null;
    time_tracked: number;
  }[];
} & TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={clsx('w-full text-sm', className)}>
      <thead>
        <tr className="text-left text-xs uppercase text-gray-500">
          <th className="py-2">Task</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Assignee</th>
          <th className="text-right">Due</th>
          <th className="text-right">Time (h)</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {tasks.map(t => (
          <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
            <td className="py-3 font-medium">{t.name}</td>
            <td>{t.status}</td>
            <td>{t.priority}</td>
            <td>{t.assignee ?? '-'}</td>
            <td className="text-right">{t.due_date ?? '-'}</td>
            <td className="text-right">{t.time_tracked}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 