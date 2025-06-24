'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './SubNav.module.css';

const subNav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/directory', label: 'Directory' }
] as const;

export default function SubNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.subNav}>
      <ul className="space-y-1 px-3">
        {subNav.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                styles.link,
                pathname === item.href && styles.active
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
