import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function ApprovalsPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve time entries</p>
      </div>
      <p className="text-gray-500 text-sm">Coming soon...</p>
    </main>
  );
}
