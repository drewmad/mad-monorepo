import { Card } from '@ui';

interface ProjectCardProps {
  id: string;
  name: string;
  progress?: number;
  status?: string;
  tasks_count: number | null;
}

export function ProjectCard({
  name,
  progress = 0,
  status = 'active',
  tasks_count
}: ProjectCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Progress: {progress}%</span>
          <span className={`px-2 py-1 rounded text-xs ${status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
            {status}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Tasks: {tasks_count ?? 0}
        </div>
      </div>
    </Card>
  );
} 