import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { DirectoryTabs } from '@/components/directory/DirectoryTabs';
import { getTeamMembers } from '@/actions/workspace';

interface DirectoryPageProps {
  searchParams: { view?: string };
}

export default async function Directory({ searchParams }: DirectoryPageProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const view = (searchParams.view ?? 'members') as 'members' | 'employees' | 'companies';

  // Get current workspace ID from session or cookies
  // For now, we'll use a hardcoded workspace ID - in production this would come from the session
  const workspaceId = session.user?.user_metadata?.current_workspace_id || 'default-workspace';

  // Load real team members from database
  const { members, error } = await getTeamMembers(workspaceId);

  // Map team members to the expected format
  const formattedMembers = members.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email,
    avatar_url: member.avatar_url,
    status: member.status,
    department: member.role, // Using role as department for now
    joined_date: member.created_at,
    last_active: member.updated_at,
    user_id: member.user_id,
  }));

  // Mock employees data - in a real app, this might come from a separate table
  const employees = [
    {
      id: 'emp1',
      name: 'Alex Johnson',
      position: 'Senior Developer',
      department: 'Engineering',
      email: 'alex@company.com',
      phone: '+1 (555) 123-4567',
      hire_date: '2023-01-15',
      status: 'active' as const,
    },
    {
      id: 'emp2',
      name: 'Lisa Rodriguez',
      position: 'UX Designer',
      department: 'Design',
      email: 'lisa@company.com',
      phone: '+1 (555) 987-6543',
      hire_date: '2023-02-28',
      status: 'active' as const,
    },
  ];

  // Mock companies data - in a real app, this would come from a companies table
  const companies = [
    {
      id: 'comp1',
      name: 'Acme Corp',
      industry: 'Technology',
      contact_name: 'John Smith',
      contact_email: 'john@acme.com',
      contact_phone: '+1 (555) 111-2222',
      relationship: 'Client',
      since: '2023-01-01',
    },
    {
      id: 'comp2',
      name: 'Beta Solutions',
      industry: 'Consulting',
      contact_name: 'Emma Davis',
      contact_email: 'emma@beta.com',
      contact_phone: '+1 (555) 333-4444',
      relationship: 'Partner',
      since: '2023-06-15',
    },
  ];

  if (error) {
    console.error('Error loading directory data:', error);
  }

  return (
    <section className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Directory</h1>
          <p className="text-gray-600 mt-1">
            Manage your workspace members, employees, and companies
          </p>
        </div>
      </div>

      <DirectoryTabs
        workspaceId={workspaceId}
        currentUserId={session.user?.id}
        members={formattedMembers}
        employees={employees}
        companies={companies}
        initialTab={view}
        showTabs={false}
      />
    </section>
  );
}
