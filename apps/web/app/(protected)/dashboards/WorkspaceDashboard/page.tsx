import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { KpiCard } from '@ui';

export default async function WorkspaceDashboardPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const metrics = [
    { title: 'Projects', value: '0' },
    { title: 'Tasks', value: '0' },
    { title: 'Team Members', value: '0' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Workspace Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {metrics.map(metric => (
          <KpiCard key={metric.title} title={metric.title} value={metric.value} />
        ))}
      </div>
    </div>
  );
}
