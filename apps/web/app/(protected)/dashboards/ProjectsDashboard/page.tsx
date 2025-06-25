import type { Database } from '@mad/db';
import { ProjectsGrid } from '@/components/projects';

export default function ProjectsDashboard() {
  const mockProjects: Database['public']['Tables']['projects']['Row'][] = [
    {
      id: 'demo',
      workspace_id: 'ws1',
      name: 'Demo Project',
      description: 'Example description',
      status: 'active',
      progress: 0,
      budget: 0,
      spent: 0,
      start_date: null,
      end_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Projects Dashboard</h1>
      <ProjectsGrid projects={mockProjects} />
    </div>
  );
}
