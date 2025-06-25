import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

interface ProjectTeamPageProps {
  params: { id: string };
}

export default async function ProjectTeamPage({ params }: ProjectTeamPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Team</h1>
        <p className="text-gray-600 mt-1">Manage team members for project {params.id}</p>
      </div>
      {/* TODO: Add team management UI */}
    </main>
  );
}
