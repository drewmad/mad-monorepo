'use client';

import clsx from 'clsx';
import { useWorkspaces, useApp, useUser } from '@/contexts/AppContext';
import { Dropdown, DropdownItem, Avatar } from '@ui';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { createWorkspace } from '@/actions/workspace';

export function WorkspaceSwitcher() {
    const { workspaces, currentWorkspace } = useWorkspaces();
    const { dispatch } = useApp();
    const user = useUser();
    const router = useRouter();
    const [, startTransition] = useTransition();

    const handleWorkspaceChange = (workspaceId: string) => {
        const workspace = workspaces.find(w => w.id === workspaceId);
        if (!workspace) return;

        dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace });
        if (typeof window !== 'undefined') {
            localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
        }
        router.push('/dashboard');
    };

    const trigger = (
        <div className={clsx(
            "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "glass:hover:bg-white/10 glass:hover:shadow-[0_8px_16px_0_rgba(255,255,255,0.1)]"
        )}>
            <Avatar
                src={currentWorkspace?.logo_url}
                initials={currentWorkspace?.name.charAt(0) || 'W'}
                size="sm"
                className="glass:ring-2 glass:ring-white/20"
            />
            <div className="flex-1 min-w-0">
                <div className={clsx(
                    "text-sm font-medium truncate",
                    "text-gray-900 dark:text-gray-100",
                    "glass:text-white glass:drop-shadow-md"
                )}>
                    {currentWorkspace?.name || 'Select Workspace'}
                </div>
                <div className={clsx(
                    "text-xs",
                    "text-gray-500 dark:text-gray-400",
                    "glass:text-white/60"
                )}>
                    {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                </div>
            </div>
            <svg
                className={clsx(
                    "w-4 h-4",
                    "text-gray-500 dark:text-gray-400",
                    "glass:text-white/60"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );

    return (
        <div className={clsx(
            "p-2",
            "border-b border-gray-200 dark:border-gray-700",
            "glass:border-white/10"
        )}>
            <Dropdown 
                trigger={trigger} 
                align="left"
                className={clsx(
                    "glass:bg-black/60 glass:backdrop-blur-2xl",
                    "glass:border glass:border-white/20"
                )}
            >
                <div className="py-1">
                    {workspaces.map((workspace) => (
                        <DropdownItem
                            key={workspace.id}
                            onClick={() => handleWorkspaceChange(workspace.id)}
                            className={clsx(
                                "flex items-center space-x-3 px-3 py-2",
                                currentWorkspace?.id === workspace.id 
                                    ? clsx(
                                        "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
                                        "glass:bg-white/20 glass:text-white"
                                      )
                                    : clsx(
                                        "hover:bg-gray-50 dark:hover:bg-gray-700",
                                        "glass:hover:bg-white/10 glass:text-white/80"
                                      )
                            )}
                        >
                            <Avatar
                                src={workspace.logo_url}
                                initials={workspace.name.charAt(0)}
                                size="xs"
                                className="glass:ring-1 glass:ring-white/20"
                            />
                            <div className="flex-1">
                                <div className={clsx(
                                    "text-sm font-medium",
                                    "glass:text-white glass:drop-shadow-sm"
                                )}>{workspace.name}</div>
                                <div className={clsx(
                                    "text-xs",
                                    "text-gray-500 dark:text-gray-400",
                                    "glass:text-white/60"
                                )}>{workspace.slug}</div>
                            </div>
                            {currentWorkspace?.id === workspace.id && (
                                <svg className={clsx(
                                    "w-4 h-4",
                                    "text-indigo-600 dark:text-indigo-400",
                                    "glass:text-white glass:drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                                )} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </DropdownItem>
                    ))}
                    <div className={clsx(
                        "border-t mt-1 pt-1",
                        "border-gray-100 dark:border-gray-700",
                        "glass:border-white/10"
                    )}>
                        <DropdownItem
                            onClick={() => {
                                const name = prompt('Workspace name');
                                if (!name || !user?.id) return;
                                const slug = name
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, '-')
                                    .replace(/(^-|-$)/g, '');

                                startTransition(async () => {
                                    const { workspace } = await createWorkspace(
                                        { name, slug, logo_url: null },
                                        user.id
                                    );
                                    if (!workspace) return;
                                    dispatch({
                                        type: 'SET_WORKSPACES',
                                        payload: [...workspaces, workspace],
                                    });
                                    dispatch({
                                        type: 'SET_CURRENT_WORKSPACE',
                                        payload: workspace,
                                    });
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem(
                                            'currentWorkspace',
                                            JSON.stringify(workspace)
                                        );
                                    }
                                    router.push('/dashboard');
                                });
                            }}
                            className={clsx(
                                "flex items-center space-x-3 px-3 py-2",
                                "text-indigo-600 dark:text-indigo-400",
                                "glass:text-white/80 glass:hover:text-white",
                                "hover:bg-gray-50 dark:hover:bg-gray-700",
                                "glass:hover:bg-white/10"
                            )}
                        >
                            <div className={clsx(
                                "w-6 h-6 rounded-full flex items-center justify-center",
                                "bg-indigo-100 dark:bg-indigo-900/30",
                                "glass:bg-white/20 glass:backdrop-blur-sm"
                            )}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Create workspace</span>
                        </DropdownItem>
                    </div>
                </div>
            </Dropdown>
        </div>
    );
}
