import { getSession } from '@/lib/user';
import { redirect } from 'next/navigation';
import { SubNav } from '@ui';
import type { ReactNode } from 'react';

interface ProjectLayoutProps {
  children: ReactNode;
  params: { id: string };
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const navItems = [
    { href: `/projects/${params.id}`, label: 'Overview' },
    { href: `/projects/${params.id}/templates`, label: 'Templates' },
    { href: `/projects/${params.id}/files`, label: 'Files' },
    { href: `/projects/${params.id}/team`, label: 'Team' },
    { href: `/projects/${params.id}/activity`, label: 'Activity' }
  ];

  return (
    <div className="space-y-6">
      <SubNav items={navItems} />
      {children}
    </div>
  );
}
