'use client';
import { useSidebar } from './context';
import { Folder, Users, Calendar, MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

const nav = [
  { href: '/dashboard', label: 'Projects', icon: Folder },
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
        'fixed left-0 top-0 z-30 h-screen border-r bg-white transition-all dark:bg-gray-800',
        expanded ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="text-xl font-bold">
          Stratus
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {nav.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center rounded-md p-2 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {expanded && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <Link
          href="/settings"
          className="group flex items-center rounded-md p-2 text-sm hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Settings className="h-5 w-5" />
          {expanded && <span className="ml-3">Settings</span>}
        </Link>
      </div>
    </aside>
  );
} 