'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaces, useApp } from '@/contexts/AppContext';
import { Card, Button, Avatar, Badge, Modal, Input } from '@ui';

export default function WorkspaceSelectionPage() {
    const router = useRouter();
    const { workspaces } = useWorkspaces();
    const { dispatch } = useApp();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: '',
        slug: '',
        description: ''
    });
    const [joinCode, setJoinCode] = useState('');

    const handleWorkspaceSelect = (workspace: { id: string; name: string; slug: string; logo_url: string | null; created_at: string; updated_at: string; }) => {
        // Set current workspace and redirect to dashboard
        dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace });
        router.push('/dashboard');
    };

    const handleCreateWorkspace = async () => {
        // TODO: Implement workspace creation API call
        console.log('Creating workspace:', createForm);

        // Mock workspace creation
        const newWorkspace = {
            id: `ws_${Date.now()}`,
            name: createForm.name,
            slug: createForm.slug,
            logo_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        dispatch({ type: 'SET_WORKSPACES', payload: [...workspaces, newWorkspace] });
        dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: newWorkspace });

        setShowCreateModal(false);
        setCreateForm({ name: '', slug: '', description: '' });
        router.push('/dashboard');
    };

    const handleJoinWorkspace = async () => {
        // TODO: Implement workspace joining API call
        console.log('Joining workspace with code:', joinCode);
        setShowJoinModal(false);
        setJoinCode('');
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose your workspace
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Select a workspace to continue, or create a new one to get started with your projects.
                    </p>
                </div>

                {/* Workspaces Grid */}
                {workspaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {workspaces.map((workspace) => (
                            <Card
                                key={workspace.id}
                                className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-indigo-200 group"
                                onClick={() => handleWorkspaceSelect(workspace)}
                            >
                                <div className="flex items-start space-x-4">
                                    <Avatar
                                        src={workspace.logo_url}
                                        initials={workspace.name.charAt(0)}
                                        size="lg"
                                        className="group-hover:ring-4 group-hover:ring-indigo-100 transition-all"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                            {workspace.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            @{workspace.slug}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="default" size="sm">
                                                Active
                                            </Badge>
                                            <span className="text-xs text-gray-400">
                                                •
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Last accessed 2 days ago
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>5 projects</span>
                                        <span>12 members</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 mb-8">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m10 0v-2c0-.552-.448-1-1-1s-1 .448-1 1v2m0 0H9m0 0v-2c0-.552-.448-1-1-1s-1 .448-1 1v2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces yet</h3>
                        <p className="text-gray-500 mb-6">Create your first workspace to start collaborating with your team.</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        variant="primary"
                        className="px-8 py-3"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create workspace
                    </Button>
                    <Button
                        onClick={() => setShowJoinModal(true)}
                        variant="secondary"
                        className="px-8 py-3"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Join workspace
                    </Button>
                </div>
            </div>

            {/* Create Workspace Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create new workspace"
                size="md"
            >
                <div className="space-y-6">
                    <div>
                        <p className="text-gray-600 mb-6">
                            Create a new workspace to organize your projects and collaborate with your team.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Workspace name"
                            placeholder="My Company"
                            value={createForm.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setCreateForm({
                                    ...createForm,
                                    name,
                                    slug: generateSlug(name)
                                });
                            }}
                            required
                        />

                        <Input
                            label="Workspace URL"
                            placeholder="my-company"
                            value={createForm.slug}
                            onChange={(e) => setCreateForm({ ...createForm, slug: generateSlug(e.target.value) })}
                            required
                        />

                        <div className="text-sm text-gray-500">
                            Your workspace will be available at: <strong>app.yourapp.com/{createForm.slug || 'your-workspace'}</strong>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateWorkspace}
                            disabled={!createForm.name.trim() || !createForm.slug.trim()}
                        >
                            Create workspace
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Join Workspace Modal */}
            <Modal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                title="Join workspace"
                size="md"
            >
                <div className="space-y-6">
                    <div>
                        <p className="text-gray-600 mb-6">
                            Enter the invitation code or link provided by your workspace administrator.
                        </p>
                    </div>

                    <Input
                        label="Invitation code or workspace URL"
                        placeholder="abc123 or my-company"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        required
                    />

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleJoinWorkspace}
                            disabled={!joinCode.trim()}
                        >
                            Join workspace
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 