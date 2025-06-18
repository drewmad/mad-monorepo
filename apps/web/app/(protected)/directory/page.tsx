import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { DirectoryGrid } from '@/components/directory/DirectoryGrid';

export default async function Directory() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  // mock members for now
  const members = [
    { id: '1', name: 'Joe Romanos', role: 'Owner', email: 'joe@example.com' },
    { id: '2', name: 'Jane Doe', role: 'Admin', email: 'jane@example.com' }
  ];

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <h1 className="mb-8 text-3xl font-bold">Directory</h1>
      <DirectoryGrid members={members} />
    </main>
  );
} 