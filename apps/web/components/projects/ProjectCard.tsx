import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export function ProjectCard({
  id,
  name,
  progress,
  status,
  tasks_count
}: {
  id: string;
  name: string;
  progress: number;
  status: string;
  tasks_count: number | null;
}) {
  return (
    <Link
      href={`/projects/${id}`}
      className="flex flex-col rounded-lg border p-4 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/40"
    >
      <span className="font-semibold">{name}</span>
      <span className="mt-1 text-sm text-gray-500">{status}</span>
      <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className={clsx('h-2 rounded-full bg-indigo-600')}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
        <span>{tasks_count ?? 0} tasks</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
} 