import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function TimesheetPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Timesheet</h1>
        <p className="text-gray-600 mt-1">Review and edit logged time</p>
      </div>
      {/* TODO: Add timesheet table */}
    </main>
  );
}
