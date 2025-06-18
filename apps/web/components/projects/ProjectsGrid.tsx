import { ProjectCard } from './ProjectCard';
import type { Project } from '@mad/db';

interface ProjectsGridProps {
  projects?: Project[];
}

export function ProjectsGrid({ projects = [] }: ProjectsGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects found. Create your first project to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={{
            id: project.id,
            name: project.name,
            description: project.description || undefined,
            status: (project.status as 'active' | 'completed' | 'on_hold' | 'cancelled') || 'active',
            progress: project.progress ?? 0,
            budget: project.budget ?? 0,
            spent: project.spent ?? 0,
            workspace_id: project.workspace_id,
            created_at: project.created_at,
            updated_at: project.updated_at || project.created_at,
          }}
          taskCount={project.tasks?.length ?? 0}
          completedTasks={project.tasks?.filter(t => t.status === 'completed').length ?? 0}
          members={[]} // TODO: Add project members when available
        />
      ))}
    </div>
  );
} 