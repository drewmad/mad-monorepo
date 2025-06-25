import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import ProtectedLayoutClient from './ProtectedLayoutClient';
import { getWorkspaces } from '@/actions/workspace';

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
  const currentWorkspace = workspaces[0] || null;

  return (
    <div className="min-h-screen bg-app-light">
      <ProtectedLayoutClient
        user={user}
        initialWorkspaces={workspaces}
        initialCurrentWorkspace={currentWorkspace}
      >
        {children}
      </ProtectedLayoutClient>
    </div>
  );
}
