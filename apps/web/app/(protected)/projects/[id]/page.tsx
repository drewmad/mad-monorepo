import { getSession } from '@/lib/user';
import { getProject } from '@/actions/projects';
import { redirect, notFound } from 'next/navigation';
import { TaskTable } from '@/components/tasks/TaskTable';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const { project, error } = await getProject(params.id);

  if (error || !project) {
    notFound();
  }

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

      <TaskTable tasks={[]} />
    </div>
  );
} 