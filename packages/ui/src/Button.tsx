import clsx from 'clsx';
import { forwardRef } from 'react';

/** Re‑usable button */
export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  }
>(({ className, variant = 'primary', ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ghost: 'text-gray-800 hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700'
      }[variant],
      className
    )}
    {...props}
  />
));
Button.displayName = 'Button'; 