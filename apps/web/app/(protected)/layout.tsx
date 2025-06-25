import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import ProtectedLayoutClient from './ProtectedLayoutClient';
import { getWorkspaces } from '@/actions/workspace';
import { cookies } from 'next/headers';

type Workspace = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  userRole?: string;
};

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  const user = {
    id: session.user.id,
    email: session.user.email || '',
    name: (session.user.user_metadata as { name?: string }).name || '',
    avatar_url: (session.user.user_metadata as { avatar_url?: string }).avatar_url || undefined,
  };

  const userId = session.user.id;
  const { workspaces: rawWorkspaces } = await getWorkspaces(userId);
  const workspaces = rawWorkspaces as Workspace[];

  const cookieStore = cookies();
  const storedId = cookieStore.get('currentWorkspaceId')?.value;
  let currentWorkspace = workspaces[0] || null;
  if (storedId) {
    const found = workspaces.find(w => w.id === storedId);
    if (found) currentWorkspace = found;
  }

  return (
    <ProtectedLayoutClient
      user={user}
      initialWorkspaces={workspaces}
      initialCurrentWorkspace={currentWorkspace}
    >
      {children}
    </ProtectedLayoutClient>
  );
}
