import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { listProjects } from '@/actions/projects';
import { KpiCard } from '@ui';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import type { Project } from '@mad/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Projects"
          value={projects.length}
        />
        <KpiCard
          title="Active Tasks"
          value={projects.reduce((acc: number, p: Project) => acc + (p.tasks?.length ?? 0), 0)}
        />
        <KpiCard
          title="Completed This Month"
          value={projects.filter((p: Project) => p.status === 'completed').length}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
        <ProjectsGrid projects={projects} />
      </div>
    </div>
  );
} 