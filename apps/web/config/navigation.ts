import {
    Home,
    Folder,
    CheckCircle,
    Clock,
    MessageSquare,
    Calendar,
    Users,
    Settings,
    Activity,
    TrendingUp,
    Sparkles,
    Plus,
    Search,
    Filter,
    Archive,
    Timer,
    FileText,
    BarChart3,
    Hash,
    Send,
    MessageCircle,
    CalendarDays,
    CalendarClock,
    CalendarCheck,
    UserCheck,
    Building,
    Briefcase
} from 'lucide-react';

export interface NavigationBadge {
    type: 'count' | 'dot' | 'new';
    value?: number;
    color: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
    pulse?: boolean;
}

export interface NavigationSubItem {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    description?: string;
    badge?: NavigationBadge;
    shortcut?: string;
    isNew?: boolean;
    isPro?: boolean;
}

export interface NavigationItem {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    shortcut: string;
    badge?: NavigationBadge;
    subNav?: {
        title: string;
        description: string;
        items: NavigationSubItem[];
        quickActions?: {
            primary: {
                label: string;
                icon: React.ComponentType<{ className?: string }>;
            };
            secondary?: {
                label: string;
                icon: React.ComponentType<{ className?: string }>;
            };
        };
    };
}

export interface NavigationGroup {
    id: string;
    label: string;
    items: NavigationItem[];
}

export const navigationConfig: { [key: string]: NavigationGroup } = {
    workspace: {
        id: 'workspace',
        label: 'Workspace',
        items: [
            {
                id: 'home',
                icon: Home,
                label: 'Home',
                href: '/dashboard',
                shortcut: 'H',
                subNav: {
                    title: 'Home',
                    description: 'Dashboard and overview',
                    items: [
                        {
                            id: 'overview',
                            icon: Home,
                            label: 'Overview',
                            href: '/dashboard',
                            description: 'Main dashboard with key metrics',
                            shortcut: '1'
                        },
                        {
                            id: 'activity',
                            icon: Activity,
                            label: 'Recent Activity',
                            href: '/dashboard?view=activity',
                            description: 'Latest updates and changes',
                            shortcut: '2'
                        },
                        {
                            id: 'analytics',
                            icon: TrendingUp,
                            label: 'Analytics',
                            href: '/dashboard?view=analytics',
                            description: 'Performance metrics and insights',
                            shortcut: '3'
                        },
                        {
                            id: 'insights',
                            icon: Sparkles,
                            label: 'AI Insights',
                            href: '/dashboard?view=insights',
                            description: 'Smart recommendations and predictions',
                            shortcut: '4',
                            isNew: true
                        }
                    ],
                    quickActions: {
                        primary: {
                            label: 'New Project',
                            icon: Plus
                        }
                    }
                }
            },
            {
                id: 'projects',
                icon: Folder,
                label: 'Projects',
                href: '/projects',
                shortcut: 'P',
                badge: { type: 'count', value: 8, color: 'blue' },
                subNav: {
                    title: 'Projects',
                    description: 'Manage and organize your projects',
                    items: [
                        {
                            id: 'all-projects',
                            icon: Folder,
                            label: 'All Projects',
                            href: '/projects',
                            description: 'View all active projects',
                            shortcut: '1'
                        },
                        {
                            id: 'my-projects',
                            icon: UserCheck,
                            label: 'My Projects',
                            href: '/projects?filter=mine',
                            description: 'Projects you own or lead',
                            badge: { type: 'count', value: 3, color: 'blue' },
                            shortcut: '2'
                        },
                        {
                            id: 'shared',
                            icon: Users,
                            label: 'Shared with Me',
                            href: '/projects?filter=shared',
                            description: 'Projects shared by teammates',
                            shortcut: '3'
                        },
                        {
                            id: 'archived',
                            icon: Archive,
                            label: 'Archived',
                            href: '/projects?filter=archived',
                            description: 'Completed and archived projects',
                            shortcut: '4'
                        }
                    ],
                    quickActions: {
                        primary: {
                            label: 'New Project',
                            icon: Plus
                        },
                        secondary: {
                            label: 'Import Project',
                            icon: Search
                        }
                    }
                }
            },
            {
                id: 'tasks',
                icon: CheckCircle,
                label: 'Tasks',
                href: '/tasks',
                shortcut: 'T',
                badge: { type: 'count', value: 5, color: 'red', pulse: true },
                subNav: {
                    title: 'Tasks',
                    description: 'Track and manage your tasks',
                    items: [
                        {
                            id: 'my-tasks',
                            icon: CheckCircle,
                            label: 'My Tasks',
                            href: '/tasks',
                            description: 'Tasks assigned to you',
                            badge: { type: 'count', value: 5, color: 'red' },
                            shortcut: '1'
                        },
                        {
                            id: 'all-tasks',
                            icon: Users,
                            label: 'Team Tasks',
                            href: '/tasks?view=team',
                            description: 'All team tasks and assignments',
                            shortcut: '2'
                        },
                        {
                            id: 'completed',
                            icon: CheckCircle,
                            label: 'Completed',
                            href: '/tasks?filter=completed',
                            description: 'Recently completed tasks',
                            shortcut: '3'
                        },
                        {
                            id: 'overdue',
                            icon: Clock,
                            label: 'Overdue',
                            href: '/tasks?filter=overdue',
                            description: 'Tasks that need attention',
                            badge: { type: 'count', value: 2, color: 'red' },
                            shortcut: '4'
                        }
                    ],
                    quickActions: {
                        primary: {
                            label: 'New Task',
                            icon: Plus
                        },
                        secondary: {
                            label: 'Bulk Actions',
                            icon: Filter
                        }
                    }
                }
            },
            {
                id: 'time',
                icon: Clock,
                label: 'Time',
                href: '/time',
                shortcut: 'I',
                subNav: {
                    title: 'Time Tracking',
                    description: 'Track time and manage schedules',
                    items: [
                        {
                            id: 'timer',
                            icon: Timer,
                            label: 'Timer',
                            href: '/time',
                            description: 'Start and stop time tracking',
                            shortcut: '1'
                        },
                        {
                            id: 'timesheet',
                            icon: FileText,
                            label: 'Timesheet',
                            href: '/time/timesheet',
                            description: 'View and edit time entries',
                            shortcut: '2'
                        },
                        {
                            id: 'reports',
                            icon: BarChart3,
                            label: 'Reports',
                            href: '/time/reports',
                            description: 'Time tracking analytics',
                            shortcut: '3'
                        }
                    ],
                    quickActions: {
                        primary: {
                            label: 'Start Timer',
                            icon: Timer
                        }
                    }
                }
            }
        ]
    },
    collaboration: {
        id: 'collaboration',
        label: 'Collaboration',
        items: [
            {
                id: 'messages',
                icon: MessageSquare,
                label: 'Messages',
                href: '/messages',
                shortcut: 'M',
                badge: { type: 'count', value: 3, color: 'blue' },
                subNav: {
                    title: 'Messages',
                    description: 'Team communication and chat',
                    items: [
                        {
                            id: 'channels',
                            icon: Hash,
                            label: 'Channels',
                            href: '/messages',
                            description: 'Team channels and discussions',
                            badge: { type: 'count', value: 2, color: 'blue' },
                            shortcut: '1'
                        },
                        {
                            id: 'direct',
                            icon: Send,
                            label: 'Direct Messages',
                            href: '/messages?view=direct',
                            description: 'Private conversations',
                            badge: { type: 'count', value: 1, color: 'green' },
                            shortcut: '2'
                        },
                        {
                            id: 'threads',
                            icon: MessageCircle,
                            label: 'Threads',
                            href: '/messages?view=threads',
                            description: 'Message threads and replies',
                            shortcut: '3'
                        }
                    ],
                    quickActions: {
                        primary: {
                            label: 'New Message',
                            icon: Plus
                        },
                        secondary: {
                            label: 'New Channel',
                            icon: Hash
                        }
                    }
                }
            },
            {
                id: 'calendar',
                icon: Calendar,
                label: 'Calendar',
                href: '/calendar',
                shortcut: 'C',
                subNav: {
                    title: 'Calendar',
                    description: 'Schedule and manage events',
                    items: [
                        {
                            id: 'month',
                            icon: CalendarDays,
                            label: 'Month View',
                            href: '/calendar',
                            description: 'Monthly calendar overview',
                            shortcut: '1'
                        },
                        {
                            id: 'week',
                            icon: CalendarClock,
                            label: 'Week View',
                            href: '/calendar?view=week',
                            description: 'Weekly schedule details',
                            shortcut: '2'
                        },
                        {
                            id: 'agenda',
                            icon: CalendarCheck,
                            label: 'Agenda',
                            href: '/calendar?view=agenda',
                            description: 'Upcoming events and meetings',
                            shortcut: '3'
                        }
                    ],
                    quickActions: {
                        primary: {
                            label: 'New Event',
                            icon: Plus
                        }
                    }
                }
            },
            {
                id: 'directory',
                icon: Users,
                label: 'Directory',
                href: '/directory',
                shortcut: 'D',
                subNav: {
                    title: 'Directory',
                    description: 'Team members and contacts',
                    items: [
                        {
                            id: 'people',
                            icon: Users,
                            label: 'People',
                            href: '/directory',
                            description: 'Team members and contacts',
                            shortcut: '1'
                        },
                        {
                            id: 'teams',
                            icon: UserCheck,
                            label: 'Teams',
                            href: '/directory?view=teams',
                            description: 'Organizational teams',
                            shortcut: '2'
                        },
                        {
                            id: 'companies',
                            icon: Building,
                            label: 'Companies',
                            href: '/directory?view=companies',
                            description: 'Client and partner companies',
                            shortcut: '3'
                        }
                    ],
                    quickActions: {
                        primary: {
                            label: 'Invite Member',
                            icon: Plus
                        }
                    }
                }
            }
        ]
    }
};

export const settingsNavigation: NavigationItem = {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    shortcut: 'S',
    subNav: {
        title: 'Settings',
        description: 'Configure your workspace',
        items: [
            {
                id: 'profile',
                icon: UserCheck,
                label: 'Profile',
                href: '/settings',
                description: 'Personal settings and preferences',
                shortcut: '1'
            },
            {
                id: 'workspace',
                icon: Briefcase,
                label: 'Workspace',
                href: '/settings/workspace',
                description: 'Workspace configuration',
                shortcut: '2'
            },
            {
                id: 'integrations',
                icon: Settings,
                label: 'Integrations',
                href: '/settings/integrations',
                description: 'Third-party app connections',
                shortcut: '3'
            }
        ]
    }
};

// Helper functions
export function getAllNavigationItems(): NavigationItem[] {
    const items: NavigationItem[] = [];
    Object.values(navigationConfig).forEach(group => {
        items.push(...group.items);
    });
    items.push(settingsNavigation);
    return items;
}

export function findNavigationItemById(id: string): NavigationItem | undefined {
    return getAllNavigationItems().find(item => item.id === id);
}

export function findNavigationItemByPath(pathname: string): NavigationItem | undefined {
    return getAllNavigationItems().find(item =>
        pathname.startsWith(item.href.split('?')[0])
    );
}

export function findSubNavigationItem(itemId: string, subItemId: string): NavigationSubItem | undefined {
    const item = findNavigationItemById(itemId);
    return item?.subNav?.items.find(subItem => subItem.id === subItemId);
}

export function findActiveSubNavigationItem(itemId: string, pathname: string): NavigationSubItem | undefined {
    const item = findNavigationItemById(itemId);
    if (!item?.subNav) return undefined;

    return item.subNav.items.find(subItem => {
        const subPath = subItem.href.split('?')[0];
        const subQuery = subItem.href.split('?')[1];

        if (subQuery) {
            return pathname === subItem.href ||
                (pathname + window.location.search) === subItem.href;
        }
        return pathname === subPath;
    });
}

export function getContextualActions(context: string) {
    const item = findNavigationItemById(context);
    return item?.subNav?.quickActions;
}

export function getContextLabel(context: string): string {
    const labels: { [key: string]: string } = {
        'home': 'Dashboard',
        'projects': 'Project',
        'tasks': 'Task',
        'time': 'Timer',
        'messages': 'Message',
        'calendar': 'Event',
        'directory': 'Contact'
    };
    return labels[context] || 'Item';
} 