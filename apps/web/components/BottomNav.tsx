'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Home,
  Folder,
  CheckCircle,
  Clock,
  MessageSquare,
  Calendar,
  Users,
} from 'lucide-react';

const navItems = [
  { id: 'home', href: '/dashboard', label: 'Home', icon: Home },
  { id: 'projects', href: '/projects', label: 'Projects', icon: Folder },
  { id: 'tasks', href: '/tasks', label: 'Tasks', icon: CheckCircle },
  { id: 'time', href: '/time', label: 'Time', icon: Clock },
  { id: 'messages', href: '/messages', label: 'Messages', icon: MessageSquare },
  { id: 'calendar', href: '/calendar', label: 'Calendar', icon: Calendar },
  { id: 'directory', href: '/directory?view=members', label: 'Directory', icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t bg-white dark:bg-gray-800 md:hidden">
      {navItems.map(item => {
        const isActive = pathname.startsWith(item.href.split('?')[0]);
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={clsx('flex flex-col items-center py-2 text-xs', isActive ? 'text-indigo-600' : 'text-gray-500')}
          >
            <Icon className="w-5 h-5 mb-1" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
