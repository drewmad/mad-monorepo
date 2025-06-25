// apps/web/components/sidebar/Sidebar.tsx
'use client';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
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
  Briefcase,
  Building
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
      { id: 'reports', href: '/time/reports', label: 'Reports' },
      { id: 'approvals', href: '/time/approvals', label: 'Approvals' }
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
    href: '/directory?view=members',
    label: 'Directory',
    icon: Users,
    subItems: [
      { id: 'members', href: '/directory?view=members', label: 'Members', icon: Users },
      { id: 'employees', href: '/directory?view=employees', label: 'Employees', icon: Briefcase },
      { id: 'companies', href: '/directory?view=companies', label: 'Companies', icon: Building }
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedMain, setSelectedMain] = useState(() => {
    const currentItem = navigation.find(item => 
      pathname.startsWith(item.href.split('?')[0])
    );
    return currentItem?.id || 'home';
  });

  const currentNavItem = navigation.find(item => item.id === selectedMain);
  const subNavItems = currentNavItem?.subItems || [];

  // Build full URL with search params for comparison
  const fullPathWithSearch = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');

  return (
    <>
      {/* Main Navigation Rail - Icons Only */}
      <nav className={clsx(
        "fixed left-0 top-0 z-30 w-20 h-screen flex flex-col",
        "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl",
        "border-r border-gray-200/50 dark:border-gray-800/50",
        "glass:bg-white/10 glass:backdrop-blur-2xl glass:border-white/20"
      )}>
        {/* Logo */}
        <div className={clsx(
          "h-16 flex items-center justify-center",
          "border-b border-gray-200/50 dark:border-gray-800/50",
          "glass:border-white/20"
        )}>
          <Link 
            href="/dashboard" 
            className={clsx(
              "text-2xl font-bold transition-all duration-300",
              "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300",
              "glass:text-white glass:hover:text-white/90 glass:drop-shadow-2xl"
            )}
          >
            S
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = selectedMain === item.id;
            
            return (
              <div key={item.id} className="relative px-3 mb-2">
                {/* Active Indicator */}
                {isActive && (
                  <div className={clsx(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full",
                    "bg-indigo-500 dark:bg-indigo-400",
                    "glass:bg-white/80 glass:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  )} />
                )}
                
                <Link
                  href={item.href}
                  onClick={() => setSelectedMain(item.id)}
                  className={clsx(
                    'w-full h-14 flex items-center justify-center rounded-xl group relative transition-all duration-300',
                    isActive
                      ? clsx(
                          'text-indigo-600 bg-gray-100/80 dark:text-indigo-400 dark:bg-gray-800/50',
                          'glass:text-white glass:bg-white/20 glass:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]'
                        )
                      : clsx(
                          'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
                          'hover:bg-gray-100/60 dark:hover:bg-gray-800/50',
                          'glass:text-white/70 glass:hover:text-white glass:hover:bg-white/10'
                        )
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="relative">
                    <Icon className={clsx(
                      "w-6 h-6 transition-all duration-300",
                      isActive && "glass:filter glass:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    )} />
                    {/* Badge */}
                    {item.badge && (
                      <div className={clsx(
                        'absolute -top-1 -right-1',
                        item.badge.type === 'count' 
                          ? clsx(
                              'min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center',
                              'bg-red-500 text-white text-xs font-bold',
                              'glass:bg-white/90 glass:text-red-600 glass:shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                            )
                          : clsx(
                              'w-2 h-2 rounded-full',
                              'bg-green-500',
                              'glass:bg-white glass:shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                            )
                      )}>
                        {item.badge.type === 'count' && item.badge.value}
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <span className={clsx(
                    "absolute left-full ml-2 px-3 py-2 rounded-lg",
                    "bg-gray-900 text-white dark:bg-gray-800",
                    "glass:bg-black/80 glass:backdrop-blur-xl glass:border glass:border-white/20",
                    "text-sm opacity-0 group-hover:opacity-100",
                    "transition-all duration-200 whitespace-nowrap pointer-events-none z-10",
                    "shadow-xl"
                  )}>
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Sub Navigation Panel */}
      <div className={clsx(
        "fixed left-20 top-0 z-20 w-72 h-screen overflow-hidden flex flex-col",
        "bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-xl",
        "border-r border-gray-200/50 dark:border-gray-800/50",
        "glass:bg-white/5 glass:backdrop-blur-2xl glass:border-white/10"
      )}>
        {/* Workspace Switcher */}
        <div className={clsx(
          "h-16 flex items-center px-4",
          "border-b border-gray-200/50 dark:border-gray-800/50",
          "glass:border-white/10"
        )}>
          <WorkspaceSwitcher />
        </div>

        {/* Sub Navigation Items */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto overflow-x-hidden">
          {currentNavItem && (
            <>
              <div className="mb-4">
                <h2 className={clsx(
                  "text-xl font-semibold",
                  "text-gray-900 dark:text-gray-200",
                  "glass:text-white glass:drop-shadow-xl"
                )}>
                  {currentNavItem.label}
                </h2>
              </div>
              
              <div className="flex-1 space-y-1">
                {subNavItems.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = pathname === subItem.href || fullPathWithSearch === subItem.href;
                  
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative',
                        isSubActive
                          ? clsx(
                              'bg-gray-200/80 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
                              'glass:bg-white/20 glass:text-white glass:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                            )
                          : clsx(
                              'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
                              'hover:bg-gray-200/50 dark:hover:bg-gray-800/50',
                              'glass:text-white/60 glass:hover:text-white glass:hover:bg-white/10'
                            )
                      )}
                    >
                      {SubIcon && <SubIcon className={clsx(
                        "w-5 h-5",
                        isSubActive && "glass:filter glass:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
                      )} />}
                      <span className="flex-1 text-sm font-medium">{subItem.label}</span>
                      {subItem.badge && (
                        <span className={clsx(
                          'text-xs',
                          subItem.badge.type === 'count'
                            ? clsx(
                                'min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center',
                                'bg-red-500 text-white',
                                'glass:bg-white/80 glass:text-red-600 glass:shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                              )
                            : clsx(
                                'w-2 h-2 rounded-full',
                                'bg-green-500',
                                'glass:bg-white glass:shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                              )
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
