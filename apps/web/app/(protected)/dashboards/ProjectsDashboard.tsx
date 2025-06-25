import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { getProjects } from '@/actions/projects';
import { ProjectsGrid } from '@/components/projects';

export default async function ProjectsDashboard() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const workspaceId = session.user?.user_metadata?.current_workspace_id;
  const { projects } = await getProjects(workspaceId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
