import clsx from 'clsx';

interface ToggleProps {
  enabled: boolean;
  onChange(v: boolean): void;
}

export const Toggle = ({ enabled, onChange }: ToggleProps) => (
  <button
    onClick={() => onChange(!enabled)}
    className={clsx(
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
      enabled ? 'bg-indigo-600' : 'bg-gray-300'
    )}
  >
    <span
      className={clsx(
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        enabled ? 'translate-x-6' : 'translate-x-1'
      )}
    />
  </button>
);
