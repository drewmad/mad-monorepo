'use client';
import { useState, useMemo } from 'react';
import { Button, Input, Select } from '@ui';
import { ProjectsGrid, ProjectsTable } from '@/components/projects';
import type { Project, ProjectMember } from '@mad/db';
import { useSearchParams } from 'next/navigation';

interface Props {
  projects: (Project & { members?: ProjectMember[] })[];
  userId: string;
}

export function ProjectsPageClient({ projects, userId }: Props) {
  const params = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>(params.get('view') === 'list' ? 'list' : 'grid');
  const [status, setStatus] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filterParam = params.get('filter');

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (filterParam === 'mine' && !p.members?.some(m => m.id === userId)) return false;
      if (filterParam === 'archived' && p.status === 'active') return false;
      if (status && p.status !== status) return false;
      if (start && new Date(p.start_date || p.created_at) < new Date(start)) return false;
      if (end && new Date(p.end_date || p.updated_at) > new Date(end)) return false;
      if (maxBudget && Number(maxBudget) > 0 && Number(p.budget || 0) > Number(maxBudget)) return false;
      return true;
    });
  }, [projects, filterParam, status, start, end, maxBudget, userId]);

  const handleBulkDelete = () => {
    // Placeholder for bulk delete action
    alert(`Deleting ${selected.length} projects`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Button variant={view === 'grid' ? 'primary' : 'secondary'} onClick={() => setView('grid')} size="sm">
            Grid
          </Button>
          <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')} size="sm">
            List
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            options={[
              { value: '', label: 'All' },
              { value: 'planning', label: 'Planning' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
          />
          <Input label="Start" type="date" value={start} onChange={e => setStart(e.target.value)} />
          <Input label="End" type="date" value={end} onChange={e => setEnd(e.target.value)} />
          <Input
            label="Max Budget"
            type="number"
            value={maxBudget}
            onChange={e => setMaxBudget(e.target.value)}
          />
        </div>
      </div>

      {view === 'grid' ? (
        <ProjectsGrid projects={filtered} />
      ) : (
        <ProjectsTable projects={filtered} onSelectionChange={setSelected} />
      )}

      {selected.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button variant="danger" onClick={handleBulkDelete} size="sm">
            Delete Selected ({selected.length})
          </Button>
        </div>
      )}
    </div>
  );
}

ProjectsPageClient.displayName = 'ProjectsPageClient';
