'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface NavigationTooltipProps {
    content: string;
    shortcut?: string;
    className?: string;
}

export const NavigationTooltip = memo(function NavigationTooltip({
    content,
    shortcut,
    className
}: NavigationTooltipProps) {
    return (
        <div className={cn(
            "px-2 py-1 bg-gray-800 text-white text-sm rounded transition-opacity whitespace-nowrap pointer-events-none z-50",
            "before:absolute before:right-full before:top-1/2 before:-translate-y-1/2",
            "before:border-4 before:border-transparent before:border-r-gray-800",
            className
        )}>
            <div className="flex items-center gap-2">
                <span>{content}</span>
                {shortcut && (
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded border border-gray-600 font-mono">
                        {shortcut.length === 1 ? `⌘${shortcut}` : shortcut}
                    </kbd>
                )}
            </div>
        </div>
    );
});

NavigationTooltip.displayName = 'NavigationTooltip'; 