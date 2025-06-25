'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Home,
  Folder,
  CheckCircle,
  MessageSquare,
  Calendar,
  Users
} from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: Folder },
  { href: '/tasks', label: 'Tasks', icon: CheckCircle },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/directory?view=members', label: 'Directory', icon: Users }
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t bg-white dark:bg-gray-900 md:hidden">
      {items.map(item => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href.split('?')[0]);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx('flex flex-col items-center py-2 text-xs', active ? 'text-indigo-600' : 'text-gray-500')}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
