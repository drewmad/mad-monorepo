import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { TimerControls } from '@/components/time/TimerControls';

export default async function TimePage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const workspaceId =
    (session.user.user_metadata as { current_workspace_id?: string })
      .current_workspace_id || 'default-workspace';
  const userId = session.user.id;

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Time</h1>
        <p className="text-gray-600 mt-1">Track and review time entries</p>
      </div>
      <TimerControls workspaceId={workspaceId} userId={userId} />
    </main>
  );
}
