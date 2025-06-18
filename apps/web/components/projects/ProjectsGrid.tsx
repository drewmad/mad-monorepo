import { ProjectCard } from './ProjectCard';

interface Project {
  id: string;
  name: string;
  progress?: number;
  status?: string;
  tasks?: unknown[];
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map(p => (
        <ProjectCard
          key={p.id}
          id={p.id}
          name={p.name}
          progress={p.progress}
          status={p.status}
          tasks_count={p.tasks?.length ?? 0}
        />
      ))}
    </div>
  );
} 