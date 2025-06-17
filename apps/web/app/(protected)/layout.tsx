import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  const user = session.user.user_metadata as { name: string; avatar_url?: string };

  return (
    <>
      <Sidebar />
      <Header user={user} />
      <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">{children}</main>
    </>
  );
} 