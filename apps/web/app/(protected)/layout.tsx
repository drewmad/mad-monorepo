import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import ProtectedLayoutClient from './ProtectedLayoutClient';

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  const user = session.user.user_metadata as { name: string; avatar_url?: string };

  return <ProtectedLayoutClient user={user}>{children}</ProtectedLayoutClient>;
} 