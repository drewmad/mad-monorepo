import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { getProjects } from '@/actions/projects';
import { ProjectsGrid, ProjectsList } from '@/components/projects';
import { IconButton } from '@ui';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import Link from 'next/link';

interface ProjectsPageProps {
  searchParams: {
    filter?: string;
    view?: string;
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const workspaceId = session.user?.user_metadata?.current_workspace_id || 'default-workspace';
  const { projects } = await getProjects(workspaceId);

  let filtered = projects;
  if (searchParams.filter === 'archived') {
    filtered = projects.filter(p => p.status === 'cancelled');
  }
  // TODO: filter "mine" when project members are implemented

  const view = searchParams.view === 'list' ? 'list' : 'grid';

  const buildUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams({ ...searchParams, ...params });
    return `/projects${sp.toString() ? `?${sp.toString()}` : ''}`;
  };

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your projects</p>
        </div>
        <div className="flex space-x-2">
          <Link href={buildUrl({ view: 'grid' })} className="inline-block">
            <IconButton variant={view === 'grid' ? 'primary' : 'ghost'} size="sm">
              <LayoutGrid className="h-4 w-4" />
            </IconButton>
          </Link>
          <Link href={buildUrl({ view: 'list' })} className="inline-block">
            <IconButton variant={view === 'list' ? 'primary' : 'ghost'} size="sm">
              <ListIcon className="h-4 w-4" />
            </IconButton>
          </Link>
        </div>
      </div>

      {view === 'grid' ? (
        <ProjectsGrid projects={filtered} />
      ) : (
        <ProjectsList projects={filtered} />
      )}
    </main>
  );
}
