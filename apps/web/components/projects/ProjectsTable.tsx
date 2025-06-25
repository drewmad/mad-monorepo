'use client';
import { useState } from 'react';
import { Badge, Progress } from '@ui';
import type { Project, ProjectMember } from '@mad/db';

interface ProjectsTableProps {
  projects: (Project & { members?: ProjectMember[] })[];
  onSelectionChange?(ids: string[]): void;
}

export function ProjectsTable({ projects, onSelectionChange }: ProjectsTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      onSelectionChange?.(next);
      return next;
    });
  };

  const selectAll = () => {
    const all = projects.map(p => p.id);
    setSelected(all);
    onSelectionChange?.(all);
  };

  const clearAll = () => {
    setSelected([]);
    onSelectionChange?.([]);
  };

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
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
            <th className="py-3 px-2">
              <input
                type="checkbox"
                aria-label="select all"
                checked={selected.length === projects.length && projects.length > 0}
                onChange={e => (e.target.checked ? selectAll() : clearAll())}
              />
            </th>
            <th className="py-3 px-2">Project</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2">Progress</th>
            <th className="py-3 px-2">Budget</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-500">
                No projects found
              </td>
            </tr>
          ) : (
            projects.map(project => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="py-3 px-2">
                  <input
                    type="checkbox"
                    aria-label="select row"
                    checked={selected.includes(project.id)}
                    onChange={() => toggle(project.id)}
                  />
                </td>
                <td className="py-3 px-2">
                  <span className="font-medium text-gray-900">{project.name}</span>
                </td>
                <td className="py-3 px-2">
                  <Badge
                    variant={getStatusColor(project.status) as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
                    size="sm"
                  >
                    {project.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <Progress value={project.progress || 0} size="sm" />
                </td>
                <td className="py-3 px-2">
                  {project.budget ? `$${project.budget}` : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

ProjectsTable.displayName = 'ProjectsTable';
