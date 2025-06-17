import { getSession } from '@/lib/user';
import { getProject } from '@/actions/projects';
import { redirect } from 'next/navigation';
import { TaskTable } from '@/components/tasks/TaskTable';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const project = await getProject(params.id);

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-indigo-600 hover:underline"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-gray-500">{project.status}</p>
      </div>

      <TaskTable tasks={project.tasks ?? []} />
    </div>
  );
} 