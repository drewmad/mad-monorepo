'use client';


import { useWorkspaces } from '@/contexts/AppContext';
import { Dropdown, DropdownItem, Avatar } from '@ui';

export function WorkspaceSwitcher() {
    const { workspaces, currentWorkspace } = useWorkspaces();

    const handleWorkspaceChange = (workspaceId: string) => {
        // TODO: Implement workspace switching logic
        console.log('Switching to workspace:', workspaceId);
    };

    const trigger = (
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <Avatar
                src={currentWorkspace?.logo_url}
                initials={currentWorkspace?.name.charAt(0) || 'W'}
                size="sm"
            />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                    {currentWorkspace?.name || 'Select Workspace'}
                </div>
                <div className="text-xs text-gray-500">
                    {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                </div>
            </div>
            <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );

    return (
        <div className="p-2 border-b border-gray-200">
            <Dropdown trigger={trigger} align="left">
                <div className="py-1">
                    {workspaces.map((workspace) => (
                        <DropdownItem
                            key={workspace.id}
                            onClick={() => handleWorkspaceChange(workspace.id)}
                            className={`flex items-center space-x-3 px-3 py-2 ${currentWorkspace?.id === workspace.id ? 'bg-indigo-50 text-indigo-700' : ''
                                }`}
                        >
                            <Avatar
                                src={workspace.logo_url}
                                initials={workspace.name.charAt(0)}
                                size="xs"
                            />
                            <div className="flex-1">
                                <div className="text-sm font-medium">{workspace.name}</div>
                                <div className="text-xs text-gray-500">{workspace.slug}</div>
                            </div>
                            {currentWorkspace?.id === workspace.id && (
                                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </DropdownItem>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                        <DropdownItem
                            onClick={() => {
                                // TODO: Implement workspace creation
                                console.log('Create new workspace');
                            }}
                            className="flex items-center space-x-3 px-3 py-2 text-indigo-600"
                        >
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
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