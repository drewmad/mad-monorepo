import clsx from 'clsx';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  /** Message to display */
  message: string;
  /** Optional call-to-action element */
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ message, action, className }: EmptyStateProps) => (
  <div className={clsx('flex flex-col items-center justify-center py-10 space-y-4 text-center', className)}>
    <p className="text-sm text-gray-500">{message}</p>
    {action}
  </div>
);

EmptyState.displayName = 'EmptyState';
