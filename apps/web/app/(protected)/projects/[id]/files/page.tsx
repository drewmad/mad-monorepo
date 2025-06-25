import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

interface ProjectFilesPageProps {
  params: { id: string };
}

export default async function ProjectFilesPage({ params }: ProjectFilesPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Files</h1>
        <p className="text-gray-600 mt-1">Manage files for project {params.id}</p>
      </div>
      {/* TODO: Add file management UI */}
    </main>
  );
}
