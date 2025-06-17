import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function Messages() {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  return (
    <>
      <Sidebar />
      <Header user={session.user.user_metadata as any} />
      <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
        <h1 className="text-3xl font-bold text-gray-400">Messages – coming soon</h1>
      </main>
    </>
  );
} 