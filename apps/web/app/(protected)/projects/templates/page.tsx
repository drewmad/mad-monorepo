import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function ProjectTemplatesPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Templates</h1>
        <p className="text-gray-600 mt-1">Browse and manage project templates</p>
      </div>
      {/* TODO: Add templates listing */}
    </main>
  );
}
