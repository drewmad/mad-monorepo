import clsx from 'clsx';

interface Props {
    src?: string | null;
    alt?: string;
    initials?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar = ({
    src,
    alt = '',
    initials,
    size = 'md',
    className
}: Props) => {
    const sizeClasses = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl'
    };

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={clsx(
                    'rounded-full object-cover',
                    sizeClasses[size],
                    className
                )}
            />
        );
    }

    return (
        <div
            className={clsx(
                'inline-flex items-center justify-center rounded-full bg-gray-500 font-medium text-white',
                sizeClasses[size],
                className
            )}
        >
            {initials || '?'}
        </div>
    );
};
