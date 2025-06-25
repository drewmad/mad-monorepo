import { Badge, Progress, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@ui';
import type { Project } from '@mad/db';

interface ProjectsListProps {
  projects?: Project[];
}

export function ProjectsList({ projects = [] }: ProjectsListProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects found. Create your first project to get started.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'on_hold':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow className="text-left">
            <TableHeaderCell>Project</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Progress</TableHeaderCell>
            <TableHeaderCell className="text-right">Budget</TableHeaderCell>
            <TableHeaderCell className="text-right">Spent</TableHeaderCell>
            <TableHeaderCell className="text-right">Updated</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell>
                <a href={`/projects/${project.id}`} className="font-medium text-indigo-600 hover:underline">
                  {project.name}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(project.status) as 'default' | 'primary' | 'success' | 'warning' | 'danger'} size="sm">
                  {project.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span>{project.progress}%</span>
                  <Progress value={project.progress} className="w-24" size="sm" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                {(project.budget / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </TableCell>
              <TableCell className="text-right">
                {(project.spent / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </TableCell>
              <TableCell className="text-right">{new Date(project.updated_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
