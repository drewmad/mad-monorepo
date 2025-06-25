// apps/web/components/sidebar/Sidebar.tsx
'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher';
import { 
  Home, 
  Folder, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Calendar, 
  Users, 
  Settings 
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: { type: 'count' | 'dot'; value?: number; color: string };
  subItems?: SubNavItem[];
}

export interface SubNavItem {
  id: string;
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: { type: 'count' | 'dot'; value?: number; color: string };
}

const navigation: SidebarItem[] = [
  { 
    id: 'home',
    href: '/dashboard',
    label: 'Home',
    icon: Home,
    subItems: [
      { id: 'overview', href: '/dashboard', label: 'Overview', icon: Home },
      { id: 'activity', href: '/dashboard?view=activity', label: 'Recent Activity' },
      { id: 'analytics', href: '/dashboard?view=analytics', label: 'Analytics' }
    ]
  },
  { 
    id: 'projects',
    href: '/projects',
    label: 'Projects',
    icon: Folder,
    badge: { type: 'count', value: 8, color: 'blue' },
    subItems: [
      { id: 'all-projects', href: '/projects', label: 'All Projects', icon: Folder },
      { id: 'my-projects', href: '/projects?filter=mine', label: 'My Projects' },
      { id: 'archived', href: '/projects?filter=archived', label: 'Archived' }
    ]
  },
  { 
    id: 'tasks',
    href: '/tasks',
    label: 'Tasks',
    icon: CheckCircle,
    badge: { type: 'count', value: 5, color: 'red' },
    subItems: [
      { id: 'my-tasks', href: '/tasks', label: 'My Tasks', icon: CheckCircle },
      { id: 'all-tasks', href: '/tasks?view=all', label: 'All Tasks' },
      { id: 'completed', href: '/tasks?filter=completed', label: 'Completed' }
    ]
  },
  { 
    id: 'time',
    href: '/time',
    label: 'Time',
    icon: Clock,
    subItems: [
      { id: 'timer', href: '/time', label: 'Timer', icon: Clock },
      { id: 'timesheet', href: '/time/timesheet', label: 'Timesheet' },
      { id: 'reports', href: '/time/reports', label: 'Reports' }
    ]
  },
  { 
    id: 'messages',
    href: '/messages',
    label: 'Messages',
    icon: MessageSquare,
    badge: { type: 'count', value: 3, color: 'blue' },
    subItems: [
      { id: 'channels', href: '/messages', label: 'Channels', icon: MessageSquare },
      { id: 'direct', href: '/messages?view=direct', label: 'Direct Messages' },
      { id: 'threads', href: '/messages?view=threads', label: 'Threads' }
    ]
  },
  { 
    id: 'calendar',
    href: '/calendar',
    label: 'Calendar',
    icon: Calendar,
    subItems: [
      { id: 'month', href: '/calendar', label: 'Month View', icon: Calendar },
      { id: 'week', href: '/calendar?view=week', label: 'Week View' },
      { id: 'agenda', href: '/calendar?view=agenda', label: 'Agenda' }
    ]
  },
  { 
    id: 'directory',
    href: '/directory',
    label: 'Directory',
    icon: Users,
    subItems: [
      { id: 'people', href: '/directory', label: 'People', icon: Users },
      { id: 'teams', href: '/directory?view=teams', label: 'Teams' },
      { id: 'companies', href: '/directory?view=companies', label: 'Companies' }
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [selectedMain, setSelectedMain] = useState(() => {
    const currentItem = navigation.find(item => 
      pathname.startsWith(item.href.split('?')[0])
    );
    return currentItem?.id || 'home';
  });

  const currentNavItem = navigation.find(item => item.id === selectedMain);
  const subNavItems = currentNavItem?.subItems || [];

  return (
    <>
      {/* Main Navigation Rail - Icons Only */}
      <nav className="fixed left-0 top-0 z-30 w-20 h-screen bg-gray-950 flex flex-col border-r border-gray-800">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-500">
            S
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = selectedMain === item.id;
            
            return (
              <div key={item.id} className="relative px-3 mb-2">
                {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-indigo-500 rounded-r-full" />
                  )}
                
                <Link
                  href={item.href}
                  onClick={() => setSelectedMain(item.id)}
                  className={clsx(
                    'w-full h-14 flex items-center justify-center rounded-xl transition-all duration-150 group relative',
                    isActive 
                      ? 'text-indigo-400 bg-gray-800/50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    {/* Badge */}
                    {item.badge && (
                      <div className={clsx(
                        'absolute -top-1 -right-1',
                        item.badge.type === 'count' 
                          ? 'min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center'
                          : 'w-2 h-2 bg-green-500 rounded-full'
                      )}>
                        {item.badge.type === 'count' && item.badge.value}
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Settings */}
        <div className="p-3 border-t border-gray-800">
          <Link
            href="/settings"
            className={clsx(
              'w-full h-14 flex items-center justify-center rounded-xl transition-all duration-150 group',
              pathname.startsWith('/settings')
                  ? 'text-indigo-400 bg-gray-800/50'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            )}
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 transition-transform group-hover:scale-110" />
          </Link>
        </div>
      </nav>

      {/* Sub Navigation Panel */}
      <div className="fixed left-20 top-0 z-20 w-72 h-screen bg-gray-900 border-r border-gray-800 overflow-hidden flex flex-col">
        {/* Workspace Switcher */}
        <div className="h-16 border-b border-gray-800 flex items-center px-4">
          <WorkspaceSwitcher />
        </div>

        {/* Sub Navigation Items */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {currentNavItem && (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-200">
                  {currentNavItem.label}
                </h2>
              </div>
              
              <div className="flex-1 space-y-1">
                {subNavItems.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = pathname === subItem.href || 
                    (pathname + location.search) === subItem.href;
                  
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative',
                        isSubActive
                          ? 'bg-gray-800 text-gray-100'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      )}
                    >
                      {SubIcon && <SubIcon className="w-5 h-5" />}
                      <span className="flex-1 text-sm">{subItem.label}</span>
                      {subItem.badge && (
                        <span className={clsx(
                          'text-xs',
                          subItem.badge.type === 'count'
                            ? 'min-w-[20px] h-5 px-1 bg-red-500 text-white rounded-full flex items-center justify-center'
                            : 'w-2 h-2 bg-green-500 rounded-full'
                        )}>
                          {subItem.badge.type === 'count' && subItem.badge.value}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
