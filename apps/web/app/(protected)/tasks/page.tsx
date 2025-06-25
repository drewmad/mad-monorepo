import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { Card } from '@ui';
import { TaskTable } from '@/components/tasks';
import { getTasks } from '@/actions/tasks';

export default async function TasksPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const workspaceId = session.user?.user_metadata?.current_workspace_id || '';
  const { tasks } = await getTasks(undefined, workspaceId);

  return (
    <section className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-600 mt-1">View and manage tasks</p>
      </div>
      <Card className="p-6">
        <TaskTable tasks={tasks} />
      </Card>
    </section>
  );
}
