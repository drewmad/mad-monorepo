import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { getTasks } from '@/actions/tasks';
import { TaskTable } from '@/components/tasks';
import { KanbanBoard, TaskCalendar, GanttChart } from '@ui';

interface TasksPageProps {
  searchParams: { view?: string };
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const { tasks } = await getTasks();
  const view = searchParams.view || 'table';

  let content: React.ReactNode;
  switch (view) {
    case 'kanban':
      content = <KanbanBoard tasks={tasks} />;
      break;
    case 'calendar':
      content = <TaskCalendar tasks={tasks} />;
      break;
    case 'gantt':
      content = <GanttChart tasks={tasks} />;
      break;
    default:
      content = <TaskTable tasks={tasks} />;
  }

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
      </div>
      {content}
    </main>
  );
}
