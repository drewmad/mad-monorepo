import clsx from 'clsx';
import { forwardRef } from 'react';

export const IconButton = forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: 'default' | 'primary' | 'ghost' | 'danger';
        size?: 'sm' | 'md' | 'lg';
    }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <button
        ref={ref}
        className={clsx(
            'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            {
                // Size variants
                sm: 'h-8 w-8',
                md: 'h-10 w-10',
                lg: 'h-12 w-12'
            }[size],
            {
                // Color variants
                default: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
                ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                danger: 'text-red-600 hover:bg-red-50 hover:text-red-700'
            }[variant],
            className
        )}
        {...props}
    />
));
IconButton.displayName = 'IconButton';
