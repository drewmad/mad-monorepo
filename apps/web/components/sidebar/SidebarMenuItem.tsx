'use client';

import { Dropdown, DropdownItem } from '@ui';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface SubItem {
  label: string;
  href: string;
}

interface SidebarMenuItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems: SubItem[];
  expanded: boolean;
}

export function SidebarMenuItem({ href, label, icon: Icon, subItems, expanded }: SidebarMenuItemProps) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <Link
      href={href}
      className={clsx(
        'group flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200',
        'hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-700',
        'text-gray-700 dark:text-gray-300'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {expanded && <span className="ml-3 transition-opacity duration-200">{label}</span>}
    </Link>
  );

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Dropdown trigger={trigger} align="right" isOpen={open} onOpenChange={setOpen}>
        {subItems.map(sub => (
          <DropdownItem key={sub.href}>
            <Link href={sub.href} className="block w-full text-left">
              {sub.label}
            </Link>
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}
