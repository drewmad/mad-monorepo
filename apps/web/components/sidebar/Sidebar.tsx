'use client';
import { useSidebar } from './context';
import { Folder, Users, Calendar, MessageSquare, Settings } from 'lucide-react';
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher';
import Link from 'next/link';
import clsx from 'clsx';
import { SidebarMenuItem } from './SidebarMenuItem';

import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: { label: string; href: string }[];
}
const nav: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Projects',
    icon: Folder,
    subItems: [
      { label: 'Active Projects', href: '/dashboard/active' },
      { label: 'Archived Projects', href: '/dashboard/archived' }
    ]
  },
  { href: '/directory', label: 'Directory', icon: Users },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/messages', label: 'Messages', icon: MessageSquare }
];

export default function Sidebar() {
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
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {nav.map(item => (
            <li key={item.href}>
              {item.subItems ? (
                <SidebarMenuItem {...item} subItems={item.subItems} expanded={expanded} />
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    'group flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200',
                    'hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-700',
                    'text-gray-700 dark:text-gray-300'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {expanded && (
                    <span className="ml-3 transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Quick Actions Section - Only when expanded */}
        {expanded && (
          <div className="mt-8 px-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center rounded-lg p-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="ml-3">New Project</span>
              </button>
              <button className="w-full flex items-center rounded-lg p-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="ml-3">New Task</span>
              </button>
            </div>
          </div>
        )}
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