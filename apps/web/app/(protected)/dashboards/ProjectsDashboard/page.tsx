import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { ProjectCard } from '@/components/projects';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  progress: number;
  budget: number;
  spent: number;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export default async function ProjectsDashboardPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const projects: Array<Project> = [
    {
      id: 'demo1',
      workspace_id: 'demo-ws',
      name: 'Demo Project One',
      description: 'Sample project',
      status: 'active',
      progress: 0,
      budget: 0,
      spent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
