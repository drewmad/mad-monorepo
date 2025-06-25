'use client';

import { usePathname } from 'next/navigation';
import Sidebar, { type SidebarItem } from '@/components/sidebar/Sidebar';
import { SubNav, type SubNavItem, Button } from '@ui';

interface NavRailLayoutProps {
  nav: (SidebarItem & { subItems?: SubNavItem[]; fabLabel?: string })[];
  children: React.ReactNode;
}

export default function NavRailLayout({ nav, children }: NavRailLayoutProps) {
  const pathname = usePathname();
  const current = nav.find(n => pathname.startsWith(n.href)) ?? nav[0];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={nav} />
      {current?.subItems && (
        <div className="hidden md:block w-48 border-r bg-white p-3">
          <SubNav items={current.subItems} orientation="vertical" />
        </div>
      )}
      <div className="flex-1 relative p-6 md:p-8">
        {children}
        {current?.fabLabel && (
          <Button variant="primary" className="fixed bottom-6 right-6 z-20">
            {current.fabLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
