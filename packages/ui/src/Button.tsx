import clsx from 'clsx';
import { forwardRef } from 'react';

/** Re‑usable button */
export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'primary', size = 'md', ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        // Size variants
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
      }[size],
      {
        // Color variants
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
