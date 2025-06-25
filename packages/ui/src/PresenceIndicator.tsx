import clsx from 'clsx';

interface PresenceIndicatorProps {
  online?: boolean;
  className?: string;
}

export const PresenceIndicator = ({ online = false, className }: PresenceIndicatorProps) => (
  <span
    className={clsx(
      'inline-block w-2 h-2 rounded-full',
      online ? 'bg-green-500' : 'bg-gray-400',
      className
    )}
  />
);

PresenceIndicator.displayName = 'PresenceIndicator';
