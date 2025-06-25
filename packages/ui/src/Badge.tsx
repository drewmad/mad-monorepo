import clsx from 'clsx';

interface Props {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className
}: Props) => (
    <span
        className={clsx(
            'inline-flex items-center rounded-full font-medium',
            {
                // Size variants
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-1 text-sm',
                lg: 'px-3 py-1.5 text-base'
            }[size],
            {
                // Color variants
                default: 'bg-gray-100 text-gray-800',
                primary: 'bg-indigo-100 text-indigo-800',
                success: 'bg-green-100 text-green-800',
                warning: 'bg-yellow-100 text-yellow-800',
                danger: 'bg-red-100 text-red-800'
            }[variant],
            className
        )}
    >
        {children}
    </span>
);
