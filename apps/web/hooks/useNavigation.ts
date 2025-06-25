'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    navigationConfig,
    settingsNavigation,
    findNavigationItemByPath,
    findActiveSubNavigationItem,
    findNavigationItemById,
    getAllNavigationItems,
    type NavigationItem,
    type NavigationSubItem
} from '@/config/navigation';

export interface NavigationState {
    selectedSection: string;
    activeSubItem: NavigationSubItem | undefined;
    isTransitioning: boolean;
    lastVisited: { [key: string]: string };
}

export function useNavigation() {
    const pathname = usePathname();
    const router = useRouter();

    const [navigationState, setNavigationState] = useState<NavigationState>(() => {
        const activeItem = findNavigationItemByPath(pathname);
        const selectedSection = activeItem?.id || 'home';
        const activeSubItem = activeItem ? findActiveSubNavigationItem(activeItem.id, pathname) : undefined;

        return {
            selectedSection,
            activeSubItem,
            isTransitioning: false,
            lastVisited: {}
        };
    });

    // Auto-detect active section based on pathname
    useEffect(() => {
        const activeItem = findNavigationItemByPath(pathname);
        if (activeItem && activeItem.id !== navigationState.selectedSection) {
            const activeSubItem = findActiveSubNavigationItem(activeItem.id, pathname);

            setNavigationState(prev => ({
                ...prev,
                selectedSection: activeItem.id,
                activeSubItem,
                lastVisited: {
                    ...prev.lastVisited,
                    [activeItem.id]: pathname
                }
            }));
        } else if (activeItem) {
            // Update active sub item if section hasn't changed
            const activeSubItem = findActiveSubNavigationItem(activeItem.id, pathname);
            if (activeSubItem?.id !== navigationState.activeSubItem?.id) {
                setNavigationState(prev => ({
                    ...prev,
                    activeSubItem
                }));
            }
        }
    }, [pathname, navigationState.selectedSection, navigationState.activeSubItem?.id]);

    // Handle section change with transition
    const setSelectedSection = useCallback((sectionId: string) => {
        if (sectionId === navigationState.selectedSection) return;

        setNavigationState(prev => {
            const newItem = findNavigationItemById(sectionId);
            const newActiveSubItem = newItem ? findActiveSubNavigationItem(sectionId, pathname) : undefined;

            return {
                ...prev,
                selectedSection: sectionId,
                activeSubItem: newActiveSubItem,
                isTransitioning: true
            };
        });

        // Clear transition state after animation
        setTimeout(() => {
            setNavigationState(prev => ({
                ...prev,
                isTransitioning: false
            }));
        }, 150);
    }, [navigationState.selectedSection, pathname]);

    // Navigate to item programmatically
    const navigateToItem = useCallback((item: NavigationItem) => {
        const targetPath = navigationState.lastVisited[item.id] || item.href;
        setSelectedSection(item.id);
        router.push(targetPath);
    }, [router, setSelectedSection, navigationState.lastVisited]);

    // Navigate to sub item
    const navigateToSubItem = useCallback((subItem: NavigationSubItem) => {
        router.push(subItem.href);
    }, [router]);

    // Get current navigation context
    const currentNavItem = useMemo(() =>
        findNavigationItemById(navigationState.selectedSection),
        [navigationState.selectedSection]
    );

    const subNavItems = useMemo(() =>
        currentNavItem?.subNav?.items || [],
        [currentNavItem]
    );

    const quickActions = useMemo(() =>
        currentNavItem?.subNav?.quickActions,
        [currentNavItem]
    );

    return {
        // State
        selectedSection: navigationState.selectedSection,
        activeSubItem: navigationState.activeSubItem,
        isTransitioning: navigationState.isTransitioning,

        // Current context
        currentNavItem,
        subNavItems,
        quickActions,

        // Actions
        setSelectedSection,
        navigateToItem,
        navigateToSubItem,

        // Utilities
        isItemActive: (itemId: string) => navigationState.selectedSection === itemId,
        isSubItemActive: (subItemId: string) => navigationState.activeSubItem?.id === subItemId,
        getLastVisitedPath: (itemId: string) => navigationState.lastVisited[itemId]
    };
}

export function useKeyboardNavigation() {
    const { navigateToItem, navigateToSubItem, currentNavItem } = useNavigation();
    const allNavItems = useMemo(() => getAllNavigationItems(), []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Global navigation shortcuts (Alt/Cmd + key)
            if (e.altKey || e.metaKey) {
                const navItem = allNavItems.find(item => item.shortcut.toLowerCase() === e.key.toLowerCase());
                if (navItem) {
                    e.preventDefault();
                    navigateToItem(navItem);
                    return;
                }
            }

            // Sub-navigation shortcuts (number keys when focused)
            if (currentNavItem?.subNav && /^[1-9]$/.test(e.key)) {
                const index = parseInt(e.key) - 1;
                const subItem = currentNavItem.subNav.items[index];
                if (subItem && subItem.shortcut === e.key) {
                    e.preventDefault();
                    navigateToSubItem(subItem);
                    return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [allNavItems, navigateToItem, navigateToSubItem, currentNavItem]);
}

export function useNavigationSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<(NavigationItem | NavigationSubItem)[]>([]);
    const allNavItems = useMemo(() => getAllNavigationItems(), []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results: (NavigationItem | NavigationSubItem)[] = [];

        // Search main navigation items
        allNavItems.forEach(item => {
            if (item.label.toLowerCase().includes(query)) {
                results.push(item);
            }

            // Search sub navigation items
            item.subNav?.items.forEach(subItem => {
                if (subItem.label.toLowerCase().includes(query) ||
                    subItem.description?.toLowerCase().includes(query)) {
                    results.push(subItem);
                }
            });
        });

        setSearchResults(results.slice(0, 10)); // Limit results
    }, [searchQuery, allNavItems]);

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        clearSearch: () => {
            setSearchQuery('');
            setSearchResults([]);
        }
    };
}

export function useNavigationGroups() {
    return useMemo(() => {
        const groups = Object.values(navigationConfig);
        return {
            groups,
            workspace: navigationConfig.workspace,
            collaboration: navigationConfig.collaboration,
            settings: settingsNavigation
        };
    }, []);
}

export function useNavigationAnalytics() {
    const { selectedSection, activeSubItem } = useNavigation();

    useEffect(() => {
        // Track navigation events
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'navigation_change', {
                section: selectedSection,
                sub_item: activeSubItem?.id,
                timestamp: Date.now()
            });
        }
    }, [selectedSection, activeSubItem]);

    const trackQuickAction = useCallback((actionType: string, context: string) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'quick_action', {
                action_type: actionType,
                context,
                timestamp: Date.now()
            });
        }
    }, []);

    return { trackQuickAction };
} 