import { requireAuth } from '@/lib/user';
import { getTimeReports } from '@/actions/time';

export default async function ReportsPage() {
  const session = await requireAuth();
  const workspaceId = session.user?.user_metadata?.current_workspace_id || '';
  const { reports } = await getTimeReports(workspaceId);

  return (
    <section className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Time Reports</h1>
        <p className="text-gray-600 mt-1">Summary of time spent by project</p>
      </div>
      {/* TODO: Render reports */}
      <pre className="text-xs text-gray-500">{JSON.stringify(reports, null, 2)}</pre>
    </section>
  );
}
