import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { DirectoryTabs } from '@/components/directory/DirectoryTabs';

export default async function Directory() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  // Mock data - in real app, this would come from your database
  const members = [
    {
      id: '1',
      name: 'Joe Romanos',
      role: 'Owner',
      email: 'joe@example.com',
      avatar_url: null,
      status: 'active' as const,
      department: 'Leadership',
      joined_date: '2023-01-15',
      last_active: '2024-01-20'
    },
    {
      id: '2',
      name: 'Jane Doe',
      role: 'Admin',
      email: 'jane@example.com',
      avatar_url: null,
      status: 'active' as const,
      department: 'Engineering',
      joined_date: '2023-02-20',
      last_active: '2024-01-19'
    },
    {
      id: '3',
      name: 'Mike Chen',
      role: 'Member',
      email: 'mike@example.com',
      avatar_url: null,
      status: 'active' as const,
      department: 'Design',
      joined_date: '2023-03-10',
      last_active: '2024-01-18'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      role: 'Member',
      email: 'sarah@example.com',
      avatar_url: null,
      status: 'inactive' as const,
      department: 'Marketing',
      joined_date: '2023-04-05',
      last_active: '2024-01-10'
    }
  ];

  const employees = [
    {
      id: 'emp1',
      name: 'Alex Johnson',
      position: 'Senior Developer',
      department: 'Engineering',
      email: 'alex@company.com',
      phone: '+1 (555) 123-4567',
      hire_date: '2023-01-15',
      status: 'active' as const
    },
    {
      id: 'emp2',
      name: 'Lisa Rodriguez',
      position: 'UX Designer',
      department: 'Design',
      email: 'lisa@company.com',
      phone: '+1 (555) 987-6543',
      hire_date: '2023-02-28',
      status: 'active' as const
    }
  ];

  const companies = [
    {
      id: 'comp1',
      name: 'Acme Corp',
      industry: 'Technology',
      contact_name: 'John Smith',
      contact_email: 'john@acme.com',
      contact_phone: '+1 (555) 111-2222',
      relationship: 'Client',
      since: '2023-01-01'
    },
    {
      id: 'comp2',
      name: 'Beta Solutions',
      industry: 'Consulting',
      contact_name: 'Emma Davis',
      contact_email: 'emma@beta.com',
      contact_phone: '+1 (555) 333-4444',
      relationship: 'Partner',
      since: '2023-06-15'
    }
  ];

  return (
    <main className="flex-1 p-6 pt-24 md:p-8 md:pt-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Directory</h1>
          <p className="text-gray-600 mt-1">Manage your workspace members, employees, and companies</p>
        </div>
      </div>

      <DirectoryTabs
        members={members}
        employees={employees}
        companies={companies}
      />
    </main>
  );
} 