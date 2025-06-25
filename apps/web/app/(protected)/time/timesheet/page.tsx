import { requireAuth } from '@/lib/user';
import { getTimesheetEntries } from '@/actions/time';

export default async function TimesheetPage() {
  const session = await requireAuth();
  const workspaceId = session.user?.user_metadata?.current_workspace_id || '';
  const { entries } = await getTimesheetEntries(workspaceId);

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Timesheet</h1>
        <p className="text-gray-600 mt-1">Review your tracked time</p>
      </div>
      {/* TODO: Render timesheet entries */}
      <pre className="text-xs text-gray-500">{JSON.stringify(entries, null, 2)}</pre>
    </main>
  );
}
