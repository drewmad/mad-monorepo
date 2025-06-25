// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../next.d.ts" />
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Badge } from '../../../Badge';
import './SubNav.css';

export interface SubNavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  shortcut?: string;
}

interface SubNavProps {
  items: SubNavItem[];
  orientation?: 'horizontal' | 'vertical';
  collapsed?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export const SubNav = ({
  items,
  orientation = 'horizontal',
  collapsed = false,
  iconOnly = false,
  className
}: SubNavProps) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && items.some(i => i.shortcut === e.key)) {
        const item = items.find(i => i.shortcut === e.key);
        if (item) {
          e.preventDefault();
          router.push(item.href);
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [items, router]);
  return (
    <nav
      className={clsx(
        orientation === 'horizontal'
          ? 'mb-4 flex space-x-4 border-b'
          : 'space-y-1',
        className
      )}
    >
      {items.map(item => {
        const current = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;
        const isActive = current === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              orientation === 'horizontal'
                ? 'subnav-link'
                : 'group flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-700',
              orientation === 'vertical' && (isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'),
              orientation === 'horizontal' && isActive && 'subnav-link-active'
            )}
          >
            {item.icon && <span className="h-5 w-5 flex-shrink-0">{item.icon}</span>}
            {!iconOnly && (orientation === 'vertical' ? (
              !collapsed && <span className="ml-3">{item.label}</span>
            ) : (
              <span>{item.label}</span>
            ))}
            {item.badge !== undefined && item.badge > 0 && (
              <Badge size="sm" variant="primary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

SubNav.displayName = 'SubNav';
