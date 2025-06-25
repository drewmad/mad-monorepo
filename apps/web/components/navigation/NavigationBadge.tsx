'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavigationBadge as NavigationBadgeType } from '@/config/navigation';

interface NavigationBadgeProps {
    badge: NavigationBadgeType;
    className?: string;
}

export const NavigationBadge = memo(function NavigationBadge({
    badge,
    className
}: NavigationBadgeProps) {
    const getBadgeStyles = () => {
        const baseStyles = 'flex items-center justify-center text-xs font-bold rounded-full';

        switch (badge.type) {
            case 'count':
                return cn(
                    baseStyles,
                    'min-w-[20px] h-5 px-1 text-white',
                    {
                        'bg-red-500': badge.color === 'red',
                        'bg-blue-500': badge.color === 'blue',
                        'bg-green-500': badge.color === 'green',
                        'bg-yellow-500': badge.color === 'yellow',
                        'bg-purple-500': badge.color === 'purple',
                    }
                );
            case 'dot':
                return cn(
                    'w-2 h-2 rounded-full',
                    {
                        'bg-red-500': badge.color === 'red',
                        'bg-blue-500': badge.color === 'blue',
                        'bg-green-500': badge.color === 'green',
                        'bg-yellow-500': badge.color === 'yellow',
                        'bg-purple-500': badge.color === 'purple',
                    }
                );
            case 'new':
                return cn(
                    baseStyles,
                    'h-4 px-1.5 text-white bg-gradient-to-r from-purple-500 to-pink-500'
                );
            default:
                return baseStyles;
        }
    };

    const badgeContent = () => {
        switch (badge.type) {
            case 'count':
                return badge.value && badge.value > 99 ? '99+' : badge.value;
            case 'new':
                return 'NEW';
            case 'dot':
                return null;
            default:
                return null;
        }
    };

    if (badge.type === 'count' && (!badge.value || badge.value === 0)) {
        return null;
    }

    return (
        <motion.div
            className={cn(getBadgeStyles(), className)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                animation: badge.pulse ? 'pulse 2s infinite' : undefined
            }}
        >
            {badgeContent()}
        </motion.div>
    );
});

NavigationBadge.displayName = 'NavigationBadge'; 