'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavigationItem, NavigationGroup as NavigationGroupType } from '@/config/navigation';
import { NavigationBadge } from './NavigationBadge';
import { NavigationTooltip } from './NavigationTooltip';

export interface NavigationRailProps {
    groups: NavigationGroupType[];
    settingsItem: NavigationItem;
    activeItem: string;
    isTransitioning: boolean;
    onItemClick: (itemId: string) => void;
    className?: string;
}

export const NavigationRail = memo(function NavigationRail({
    groups,
    settingsItem,
    activeItem,
    isTransitioning,
    onItemClick,
    className
}: NavigationRailProps) {
    return (
        <nav
            className={cn(
                "fixed left-0 top-0 z-30 w-20 h-screen bg-gray-950 flex flex-col border-r border-gray-800",
                className
            )}
            role="navigation"
            aria-label="Main navigation"
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <Link href="/dashboard" className="text-2xl font-bold text-indigo-500 hover:text-indigo-400 transition-colors">
                    S
                </Link>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto py-6">
                {groups.map((group) => (
                    <NavigationGroup
                        key={group.id}
                        group={group}
                        activeItem={activeItem}
                        isTransitioning={isTransitioning}
                        onItemClick={onItemClick}
                    />
                ))}
            </div>

            {/* Settings */}
            <div className="p-3 border-t border-gray-800">
                <NavigationItemComponent
                    item={settingsItem}
                    isActive={activeItem === settingsItem.id}
                    isTransitioning={isTransitioning}
                    onItemClick={onItemClick}
                />
            </div>
        </nav>
    );
});

interface NavigationGroupProps {
    group: NavigationGroupType;
    activeItem: string;
    isTransitioning: boolean;
    onItemClick: (itemId: string) => void;
}

const NavigationGroup = memo(function NavigationGroup({
    group,
    activeItem,
    isTransitioning,
    onItemClick
}: NavigationGroupProps) {
    return (
        <div className="mb-4">
            {/* Group separator line */}
            {group.id !== 'workspace' && (
                <div className="mx-3 mb-4 h-px bg-gray-800" />
            )}

            <ul role="list" aria-label={group.label}>
                {group.items.map((item) => (
                    <li key={item.id} role="listitem">
                        <NavigationItemComponent
                            item={item}
                            isActive={activeItem === item.id}
                            isTransitioning={isTransitioning}
                            onItemClick={onItemClick}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
});

interface NavigationItemProps {
    item: NavigationItem;
    isActive: boolean;
    isTransitioning: boolean;
    onItemClick: (itemId: string) => void;
}

const NavigationItemComponent = memo(function NavigationItemComponent({
    item,
    isActive,
    isTransitioning,
    onItemClick
}: NavigationItemProps) {
    const Icon = item.icon;

    return (
        <div className="relative px-3 mb-2">
            {/* Active Indicator */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-500 rounded-r-full"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                )}
            </AnimatePresence>

            <button
                onClick={() => onItemClick(item.id)}
                className={cn(
                    'relative w-full h-14 flex items-center justify-center rounded-xl',
                    'transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                    isActive
                        ? 'text-blue-400 bg-gray-800/50'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50',
                    isTransitioning && isActive && 'animate-pulse'
                )}
                aria-label={`${item.label}${item.badge?.type === 'count' ? `, ${item.badge.value} new items` : ''}`}
                aria-current={isActive ? 'page' : undefined}
                data-shortcut={item.shortcut}
            >
                <div className="relative">
                    <Icon className={cn(
                        "w-6 h-6 transition-transform group-hover:scale-110",
                        isActive && "drop-shadow-sm"
                    )} />

                    {/* Badge */}
                    {item.badge && (
                        <NavigationBadge
                            badge={item.badge}
                            className="absolute -top-1 -right-1"
                        />
                    )}
                </div>

                {/* Tooltip */}
                <NavigationTooltip
                    content={item.label}
                    shortcut={item.shortcut}
                    className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                />
            </button>
        </div>
    );
});

NavigationRail.displayName = 'NavigationRail'; 