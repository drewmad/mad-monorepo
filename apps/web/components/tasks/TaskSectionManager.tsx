'use client';

import { useState } from 'react';
import { Card, Button, Badge, Input, Modal, Select, Dropdown, DropdownItem, IconButton, Textarea, Toast } from '@ui';
import { useModal } from '@/contexts/AppContext';

interface Task {
    id: string;
    project_id: string;
    parent_task_id: string | null;
    name: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee_id: string | null;
    due_date: string | null;
    time_tracked: number;
    estimated_hours: number | null;
    section: string | null;
    created_at: string;
    updated_at: string;
}

interface TaskSectionManagerProps {
    projectId: string;
    tasks: Task[];
    onTaskUpdate?: (task: Task) => void;
    onTaskCreate?: (task: Partial<Task>) => void;
    onSectionCreate?: (section: string) => void;
}

export function TaskSectionManager({
    projectId,
    tasks,
    onTaskUpdate,
    onTaskCreate,
    onSectionCreate
}: TaskSectionManagerProps) {
    const { openModal } = useModal();
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [showCreateSection, setShowCreateSection] = useState(false);
    const [showEditTask, setShowEditTask] = useState(false);
    const [showCreateSubtask, setShowCreateSubtask] = useState(false);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [parentTask, setParentTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const [newTask, setNewTask] = useState<{
        name: string;
        description: string;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        section: string;
        estimated_hours: string;
        due_date: string;
    }>({
        name: '',
        description: '',
        priority: 'medium',
        section: '',
        estimated_hours: '',
        due_date: ''
    });
    const [newSection, setNewSection] = useState('');

    // Group tasks by section
    const sections = tasks.reduce((acc, task) => {
        const section = task.section || 'No Section';
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'todo': return 'default';
            case 'in_progress': return 'primary';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'default';
            case 'medium': return 'warning';
            case 'high': return 'primary';
            case 'urgent': return 'danger';
            default: return 'default';
        }
    };

    const handleCreateTask = () => {
        const taskData = {
            project_id: projectId,
            name: newTask.name,
            description: newTask.description || null,
            priority: newTask.priority,
            section: newTask.section || selectedSection || null,
            estimated_hours: newTask.estimated_hours ? parseFloat(newTask.estimated_hours) : null,
            due_date: newTask.due_date || null,
            status: 'todo' as const,
            parent_task_id: null,
            assignee_id: null,
            time_tracked: 0
        };

        onTaskCreate?.(taskData);
        setShowCreateTask(false);
        setNewTask({
            name: '',
            description: '',
            priority: 'medium',
            section: '',
            estimated_hours: '',
            due_date: ''
        });
        setSelectedSection(null);
    };

    const handleCreateSection = () => {
        if (newSection.trim()) {
            onSectionCreate?.(newSection.trim());
            setNewSection('');
            setShowCreateSection(false);
        }
    };

    const handleTaskStatusChange = (task: Task, newStatus: Task['status']) => {
        onTaskUpdate?.({ ...task, status: newStatus });
    };

    const handleDeleteTask = (task: Task) => {
        openModal('confirmation', {
            title: 'Delete Task',
            message: `Are you sure you want to delete "${task.name}"? This action cannot be undone.`,
            confirmText: 'Delete',
            onConfirm: () => {
                // TODO: Implement task deletion
                console.log('Deleting task:', task.id);
            }
        });
    };

    const showNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setNewTask({
            name: task.name,
            description: task.description || '',
            priority: task.priority,
            section: task.section || '',
            estimated_hours: task.estimated_hours?.toString() || '',
            due_date: task.due_date || ''
        });
        setShowEditTask(true);
    };

    const handleUpdateTask = () => {
        if (!editingTask) return;
        
        const updatedTask = {
            ...editingTask,
            name: newTask.name,
            description: newTask.description || null,
            priority: newTask.priority,
            section: newTask.section || null,
            estimated_hours: newTask.estimated_hours ? parseFloat(newTask.estimated_hours) : null,
            due_date: newTask.due_date || null
        };

        onTaskUpdate?.(updatedTask);
        showNotification(`Task "${updatedTask.name}" updated successfully!`);
        setShowEditTask(false);
        setEditingTask(null);
        setNewTask({
            name: '',
            description: '',
            priority: 'medium',
            section: '',
            estimated_hours: '',
            due_date: ''
        });
    };

    const handleCreateSubtask = (parent: Task) => {
        setParentTask(parent);
        setNewTask({
            name: '',
            description: '',
            priority: parent.priority,
            section: parent.section || '',
            estimated_hours: '',
            due_date: ''
        });
        setShowCreateSubtask(true);
    };

    const handleSaveSubtask = () => {
        if (!parentTask) return;

        const subtaskData = {
            project_id: projectId,
            name: newTask.name,
            description: newTask.description || null,
            priority: newTask.priority,
            section: parentTask.section,
            estimated_hours: newTask.estimated_hours ? parseFloat(newTask.estimated_hours) : null,
            due_date: newTask.due_date || null,
            status: 'todo' as const,
            parent_task_id: parentTask.id,
            assignee_id: null,
            time_tracked: 0
        };

        onTaskCreate?.(subtaskData);
        showNotification(`Subtask created for "${parentTask.name}"`);
        setShowCreateSubtask(false);
        setParentTask(null);
        setNewTask({
            name: '',
            description: '',
            priority: 'medium',
            section: '',
            estimated_hours: '',
            due_date: ''
        });
    };

    const handleDuplicateTask = (task: Task) => {
        const duplicatedTask = {
            project_id: task.project_id,
            name: `${task.name} (copy)`,
            description: task.description,
            priority: task.priority,
            section: task.section,
            estimated_hours: task.estimated_hours,
            due_date: task.due_date,
            status: 'todo' as const,
            parent_task_id: task.parent_task_id,
            assignee_id: null,
            time_tracked: 0
        };

        onTaskCreate?.(duplicatedTask);
        showNotification(`Task "${task.name}" duplicated successfully!`);
    };

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    const sectionOptions = Object.keys(sections)
        .filter(section => section !== 'No Section')
        .map(section => ({ value: section, label: section }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                <div className="flex space-x-3">
                    <Button
                        onClick={() => setShowCreateSection(true)}
                        variant="secondary"
                        className="px-4 py-2"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Add Section
                    </Button>
                    <Button
                        onClick={() => setShowCreateTask(true)}
                        variant="primary"
                        className="px-4 py-2"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Task
                    </Button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {Object.entries(sections).map(([sectionName, sectionTasks]) => (
                    <Card key={sectionName} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold text-gray-900">{sectionName}</h3>
                                <Badge variant="default" size="sm">
                                    {sectionTasks.length} tasks
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={() => {
                                        setSelectedSection(sectionName === 'No Section' ? null : sectionName);
                                        setShowCreateTask(true);
                                    }}
                                    variant="ghost"
                                    className="px-3 py-1 text-sm"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Task
                                </Button>
                            </div>
                        </div>

                        {/* Tasks in Section */}
                        <div className="space-y-3">
                            {sectionTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                    No tasks in this section yet
                                </div>
                            ) : (
                                sectionTasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-4 flex-1">
                                            {/* Task Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'completed'}
                                                onChange={(e) => handleTaskStatusChange(task, e.target.checked ? 'completed' : 'todo')}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />

                                            {/* Task Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                    {task.name}
                                                </div>
                                                {task.description && (
                                                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {task.description}
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge
                                                        variant={getStatusColor(task.status) as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
                                                        size="sm"
                                                    >
                                                        {task.status.replace('_', ' ')}
                                                    </Badge>
                                                    <Badge
                                                        variant={getPriorityColor(task.priority) as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
                                                        size="sm"
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                    {task.due_date && (
                                                        <span className="text-xs text-gray-500">
                                                            Due: {new Date(task.due_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {task.estimated_hours && (
                                                        <span className="text-xs text-gray-500">
                                                            Est: {task.estimated_hours}h
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sub-tasks indicator */}
                                            {tasks.some(t => t.parent_task_id === task.id) && (
                                                <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                    {tasks.filter(t => t.parent_task_id === task.id).length} sub-tasks
                                                </div>
                                            )}
                                        </div>

                                        {/* Task Actions */}
                                        <div className="flex items-center space-x-2 ml-4">
                                            <Dropdown
                                                trigger={
                                                    <IconButton variant="ghost" size="sm">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                        </svg>
                                                    </IconButton>
                                                }
                                                align="right"
                                            >
                                                <DropdownItem onClick={() => handleEditTask(task)}>
                                                    Edit task
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleCreateSubtask(task)}>
                                                    Add sub-task
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleDuplicateTask(task)}>
                                                    Duplicate
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => handleDeleteTask(task)}
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Task Modal */}
            <Modal
                isOpen={showCreateTask}
                onClose={() => {
                    setShowCreateTask(false);
                    setSelectedSection(null);
                    setNewTask({
                        name: '',
                        description: '',
                        priority: 'medium',
                        section: '',
                        estimated_hours: '',
                        due_date: ''
                    });
                }}
                title="Create New Task"
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Task Name"
                        placeholder="What needs to be done?"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Description (optional)"
                        placeholder="Additional details about this task"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Priority"
                            options={priorityOptions}
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                        />

                        <Select
                            label="Section"
                            options={[
                                { value: '', label: 'No Section' },
                                ...sectionOptions
                            ]}
                            value={selectedSection || newTask.section}
                            onChange={(e) => setNewTask({ ...newTask, section: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Estimated Hours (optional)"
                            type="number"
                            step="0.5"
                            placeholder="2.5"
                            value={newTask.estimated_hours}
                            onChange={(e) => setNewTask({ ...newTask, estimated_hours: e.target.value })}
                        />

                        <Input
                            label="Due Date (optional)"
                            type="date"
                            value={newTask.due_date}
                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowCreateTask(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateTask}
                            disabled={!newTask.name.trim()}
                        >
                            Create Task
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Create Section Modal */}
            <Modal
                isOpen={showCreateSection}
                onClose={() => {
                    setShowCreateSection(false);
                    setNewSection('');
                }}
                title="Create New Section"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Section Name"
                        placeholder="e.g., Design, Development, Testing"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        required
                    />

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowCreateSection(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateSection}
                            disabled={!newSection.trim()}
                        >
                            Create Section
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Task Modal */}
            <Modal
                isOpen={showEditTask}
                onClose={() => {
                    setShowEditTask(false);
                    setEditingTask(null);
                    setNewTask({
                        name: '',
                        description: '',
                        priority: 'medium',
                        section: '',
                        estimated_hours: '',
                        due_date: ''
                    });
                }}
                title="Edit Task"
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Task Name"
                        placeholder="What needs to be done?"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Description (optional)"
                        placeholder="Additional details about this task"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Priority"
                            options={priorityOptions}
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                        />

                        <Select
                            label="Section"
                            options={[
                                { value: '', label: 'No Section' },
                                ...sectionOptions
                            ]}
                            value={newTask.section}
                            onChange={(e) => setNewTask({ ...newTask, section: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Estimated Hours (optional)"
                            type="number"
                            step="0.5"
                            placeholder="2.5"
                            value={newTask.estimated_hours}
                            onChange={(e) => setNewTask({ ...newTask, estimated_hours: e.target.value })}
                        />

                        <Input
                            label="Due Date (optional)"
                            type="date"
                            value={newTask.due_date}
                            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowEditTask(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleUpdateTask}
                            disabled={!newTask.name.trim()}
                        >
                            Update Task
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Create Subtask Modal */}
            <Modal
                isOpen={showCreateSubtask}
                onClose={() => {
                    setShowCreateSubtask(false);
                    setParentTask(null);
                    setNewTask({
                        name: '',
                        description: '',
                        priority: 'medium',
                        section: '',
                        estimated_hours: '',
                        due_date: ''
                    });
                }}
                title={`Create Subtask for "${parentTask?.name || ''}"`}
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Subtask Name"
                        placeholder="What needs to be done?"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Description (optional)"
                        placeholder="Additional details about this subtask"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Priority"
                            options={priorityOptions}
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                        />

                        <Input
                            label="Estimated Hours (optional)"
                            type="number"
                            step="0.5"
                            placeholder="2.5"
                            value={newTask.estimated_hours}
                            onChange={(e) => setNewTask({ ...newTask, estimated_hours: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Due Date (optional)"
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowCreateSubtask(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSaveSubtask}
                            disabled={!newTask.name.trim()}
                        >
                            Create Subtask
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast Notification */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
} 