import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { getProjects } from '@/actions/projects';
import { ProjectsPageClient } from '@/components/projects';

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const userId = session.user.id;
  const { projects } = await getProjects();

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600 mt-1">Manage your projects</p>
      </div>
      <ProjectsPageClient projects={projects} userId={userId} />
    </main>
  );
}
