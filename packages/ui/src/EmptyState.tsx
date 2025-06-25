import clsx from 'clsx';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  cta?: ReactNode;
  className?: string;
}

export function EmptyState({ message, cta, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'py-8 text-center text-gray-500 flex flex-col items-center space-y-4',
        className
      )}
    >
      <p>{message}</p>
      {cta && <div>{cta}</div>}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
