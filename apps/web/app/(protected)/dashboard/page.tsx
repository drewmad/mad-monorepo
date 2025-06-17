import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { listProjects } from '@/actions/projects';
import { KpiCard } from '@ui/KpiCard';
import { Folder, List, CheckCircle, Users } from 'lucide-react';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  // simplistic workspace selection: first workspace
  const workspaceId = session.user.id; // replace with workspace logic later
  const projects = await listProjects(workspaceId);

  return (
    <>
      <Sidebar />
      <Header user={session.user.user_metadata as any} />
      <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
        <h1 className="text-3xl font-bold">Overview</h1>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Projects" value={projects.length} icon={<Folder />} />
          <KpiCard
            title="Tasks"
            value={projects.reduce((acc, p) => acc + (p.tasks?.length ?? 0), 0)}
            icon={<List />}
          />
          <KpiCard title="Completion" value="–" icon={<CheckCircle />} />
          <KpiCard title="Team" value="–" icon={<Users />} />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Projects</h2>
          <ProjectsGrid projects={projects} />
        </section>
      </main>
    </>
  );
} 