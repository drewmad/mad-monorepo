import { KpiCard } from '@ui';

export default function WorkspaceDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Workspace Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Projects" value="--" />
        <KpiCard title="Tasks" value="--" />
        <KpiCard title="Team Members" value="--" />
        <KpiCard title="Upcoming Events" value="--" />
      </div>
    </div>
  );
}
