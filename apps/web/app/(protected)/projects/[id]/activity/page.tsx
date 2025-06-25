import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

interface ActivityPageProps {
  params: { id: string };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  const { id } = params;

  return (
    <section className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Activity</h1>
        <p className="text-gray-600 mt-1">Recent project events for {id}</p>
      </div>
      {/* TODO: Implement activity feed */}
    </section>
  );
}
