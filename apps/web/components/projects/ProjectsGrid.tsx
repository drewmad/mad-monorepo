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
      {projects.map(p => (
        <ProjectCard
          key={p.id}
          id={p.id}
          name={p.name}
          progress={p.progress ?? 0}
          status={p.status ?? 'active'}
          tasks_count={p.tasks?.length ?? null}
        />
      ))}
    </div>
  );
} 