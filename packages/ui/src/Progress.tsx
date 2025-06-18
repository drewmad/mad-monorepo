import clsx from 'clsx';

interface Props {
    value: number; // 0-100
    max?: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    showValue?: boolean;
}

export const Progress = ({
    value,
    max = 100,
    className,
    size = 'md',
    variant = 'default',
    showValue = false
}: Props) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={clsx('w-full', className)}>
            <div
                className={clsx(
                    'overflow-hidden rounded-full bg-gray-200',
                    {
                        sm: 'h-1',
                        md: 'h-2',
                        lg: 'h-3'
                    }[size]
                )}
            >
                <div
                    className={clsx(
                        'h-full transition-all duration-300 ease-out',
                        {
                            default: 'bg-indigo-600',
                            success: 'bg-green-600',
                            warning: 'bg-yellow-600',
                            danger: 'bg-red-600'
                        }[variant]
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showValue && (
                <div className="mt-1 text-sm text-gray-600">
                    {value}/{max} ({Math.round(percentage)}%)
                </div>
            )}
        </div>
    );
}; 