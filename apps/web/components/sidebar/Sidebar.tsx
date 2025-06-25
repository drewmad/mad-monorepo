'use client';
import { useSidebar } from './context';
import { Folder, Users, Calendar, MessageSquare, Settings } from 'lucide-react';
import React from 'react';
import { SubNav, type SubNavItem } from '@ui';
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher';
import Link from 'next/link';
import clsx from 'clsx';

export interface SidebarItem extends Omit<SubNavItem, 'icon'> {
  icon: React.ComponentType<{ className?: string }>;
}

const defaultNav: SidebarItem[] = [
  { href: '/dashboard', label: 'Projects', icon: Folder, shortcut: '1' },
  { href: '/directory', label: 'Directory', icon: Users, shortcut: '2' },
  { href: '/calendar', label: 'Calendar', icon: Calendar, shortcut: '3' },
  { href: '/messages', label: 'Messages', icon: MessageSquare, shortcut: '4' }
];

export interface SidebarProps {
  items?: SidebarItem[];
}

export default function Sidebar({ items = defaultNav }: SidebarProps) {
  const { expanded, setExpanded } = useSidebar();

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={clsx(
        'fixed left-0 top-0 z-30 h-screen border-r bg-white transition-all duration-300 ease-in-out dark:bg-gray-800',
        expanded ? 'w-64' : 'w-20'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
          {expanded ? 'Stratus' : 'S'}
        </Link>
      </div>

      {/* Workspace Switcher */}
      {expanded && <WorkspaceSwitcher />}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <SubNav
          items={items.map(n => ({
            href: n.href,
            label: n.label,
            icon: <n.icon className="h-5 w-5" />,
            badge: n.badge,
            shortcut: n.shortcut
          }))}
          orientation="vertical"
          collapsed={!expanded}
          iconOnly={!expanded}
          className="w-full"
        />
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className={clsx(
            "group flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200",
            "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-700",
            "text-gray-700 dark:text-gray-300"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {expanded && (
            <span className="ml-3 transition-opacity duration-200">
              Settings
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
} 