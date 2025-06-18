import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { getWorkspaces, getPendingInvitations } from '@/actions/workspace';
import { WorkspaceSelection } from '@/components/workspace/WorkspaceSelection';

export default async function WorkspaceSelectionPage() {
    const session = await getSession();
    if (!session) redirect('/sign-in');

    const userId = session.user?.id || '';

    // Load user's workspaces and pending invitations
    const [workspacesResult, invitationsResult] = await Promise.all([
        getWorkspaces(userId),
        getPendingInvitations(userId)
    ]);

      const { workspaces: rawWorkspaces, error: workspacesError } = workspacesResult;
  const { invitations, error: invitationsError } = invitationsResult;

  // Mock fallback data if database is unavailable
  const mockWorkspaces = [
    {
      id: 'mock-ws-1',
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      userRole: 'owner'
    }
  ];

  const finalWorkspaces = (rawWorkspaces && rawWorkspaces.length > 0 ? rawWorkspaces : mockWorkspaces) as Array<{
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
    userRole?: string;
  }>;

    if (workspacesError) {
        console.error('Error loading workspaces:', workspacesError);
    }

    if (invitationsError) {
        console.error('Error loading invitations:', invitationsError);
    }

    return (
        <WorkspaceSelection
            userId={userId}
            initialWorkspaces={finalWorkspaces}
            initialInvitations={(invitations || []) as Array<{
              id: string;
              role: string;
              created_at: string;
              workspace: {
                id: string;
                name: string;
                slug: string;
                logo_url: string | null;
              };
            }>}
        />
    );
} 