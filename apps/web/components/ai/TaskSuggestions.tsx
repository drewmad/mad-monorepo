'use client';

import { useState } from 'react';
import { Card, Button, Badge, Modal, Textarea } from '@ui';
import { Sparkles, Plus, Clock, User, Target, Zap } from 'lucide-react';

interface Task {
    id: string;
    name: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimated_hours?: number;
    assignee?: string;
}

interface TaskSuggestionsProps {
    projectId: string;
    projectName: string;
    projectDescription?: string;
    onTaskCreate?: (task: Partial<Task>) => void;
    onSubtaskGenerate?: (parentTaskId: string, subtasks: Partial<Task>[]) => void;
}

export function TaskSuggestions({
    projectName,
    onTaskCreate,
    onSubtaskGenerate
}: TaskSuggestionsProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<Task[]>([]);
    const [selectedParentTask, setSelectedParentTask] = useState<string | null>(null);

    // Mock AI suggestions based on project type
    const generateSmartSuggestions = async () => {
        setIsGenerating(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockSuggestions: Task[] = [
            {
                id: 'ai-1',
                name: 'Set up project repository',
                description: 'Initialize Git repository with proper branching strategy and CI/CD pipeline',
                priority: 'high',
                estimated_hours: 2,
                assignee: 'Lead Developer'
            },
            {
                id: 'ai-2',
                name: 'Design system architecture',
                description: 'Create high-level architecture diagrams and define component structure',
                priority: 'high',
                estimated_hours: 8,
                assignee: 'Senior Architect'
            },
            {
                id: 'ai-3',
                name: 'Create wireframes and mockups',
                description: 'Design user interface wireframes and interactive prototypes',
                priority: 'medium',
                estimated_hours: 12,
                assignee: 'UX Designer'
            },
            {
                id: 'ai-4',
                name: 'Implement authentication system',
                description: 'Build secure user authentication with JWT tokens and password reset',
                priority: 'high',
                estimated_hours: 16,
                assignee: 'Backend Developer'
            },
            {
                id: 'ai-5',
                name: 'Set up testing framework',
                description: 'Configure unit, integration, and e2e testing with coverage reports',
                priority: 'medium',
                estimated_hours: 6,
                assignee: 'QA Engineer'
            }
        ];

        setSuggestions(mockSuggestions);
        setIsGenerating(false);
    };

    const generateSubtasks = async (parentTaskId: string, taskName: string) => {
        setIsGenerating(true);
        setSelectedParentTask(parentTaskId);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock subtask generation based on parent task
        const mockSubtasks: Partial<Task>[] = [];

        if (taskName.toLowerCase().includes('authentication')) {
            mockSubtasks.push(
                {
                    name: 'Design authentication database schema',
                    description: 'Create user, session, and token tables with proper relationships',
                    priority: 'high',
                    estimated_hours: 3
                },
                {
                    name: 'Implement user registration endpoint',
                    description: 'Create API endpoint for new user registration with validation',
                    priority: 'high',
                    estimated_hours: 4
                },
                {
                    name: 'Build login/logout functionality',
                    description: 'Implement secure login and logout with session management',
                    priority: 'high',
                    estimated_hours: 4
                },
                {
                    name: 'Add password reset feature',
                    description: 'Create password reset flow with email verification',
                    priority: 'medium',
                    estimated_hours: 5
                }
            );
        } else if (taskName.toLowerCase().includes('wireframe') || taskName.toLowerCase().includes('design')) {
            mockSubtasks.push(
                {
                    name: 'User research and personas',
                    description: 'Conduct user research and create detailed user personas',
                    priority: 'high',
                    estimated_hours: 8
                },
                {
                    name: 'Information architecture',
                    description: 'Define site map and information hierarchy',
                    priority: 'high',
                    estimated_hours: 4
                },
                {
                    name: 'Low-fidelity wireframes',
                    description: 'Create basic wireframes for all main pages',
                    priority: 'medium',
                    estimated_hours: 6
                },
                {
                    name: 'High-fidelity mockups',
                    description: 'Design detailed mockups with colors, typography, and imagery',
                    priority: 'medium',
                    estimated_hours: 12
                },
                {
                    name: 'Interactive prototype',
                    description: 'Build clickable prototype for user testing',
                    priority: 'low',
                    estimated_hours: 8
                }
            );
        } else {
            mockSubtasks.push(
                {
                    name: 'Research and planning',
                    description: 'Research requirements and create implementation plan',
                    priority: 'high',
                    estimated_hours: 2
                },
                {
                    name: 'Core implementation',
                    description: 'Implement the main functionality',
                    priority: 'high',
                    estimated_hours: 6
                },
                {
                    name: 'Testing and validation',
                    description: 'Write tests and validate functionality',
                    priority: 'medium',
                    estimated_hours: 3
                },
                {
                    name: 'Documentation',
                    description: 'Create technical documentation',
                    priority: 'low',
                    estimated_hours: 2
                }
            );
        }

        onSubtaskGenerate?.(parentTaskId, mockSubtasks);
        setIsGenerating(false);
        setSelectedParentTask(null);
    };

    const generateCustomTasks = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const customSuggestions: Task[] = [
            {
                id: 'custom-1',
                name: `Analyze ${aiPrompt}`,
                description: `Deep dive analysis of ${aiPrompt} with actionable insights`,
                priority: 'medium',
                estimated_hours: 4
            },
            {
                id: 'custom-2',
                name: `Implement ${aiPrompt} solution`,
                description: `Build and deploy solution for ${aiPrompt}`,
                priority: 'high',
                estimated_hours: 8
            },
            {
                id: 'custom-3',
                name: `Test ${aiPrompt} functionality`,
                description: `Comprehensive testing of ${aiPrompt} features`,
                priority: 'medium',
                estimated_hours: 3
            }
        ];

        setSuggestions(customSuggestions);
        setIsGenerating(false);
        setShowAIModal(false);
        setAiPrompt('');
    };

    const acceptSuggestion = (suggestion: Task) => {
        onTaskCreate?.(suggestion);
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'danger';
            case 'high': return 'primary';
            case 'medium': return 'warning';
            case 'low': return 'default';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* AI Controls */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">AI Task Assistant</h3>
                        <p className="text-sm text-gray-600">Let AI help you break down your project into manageable tasks</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={generateSmartSuggestions}
                        disabled={isGenerating}
                        variant="primary"
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Zap className="h-4 w-4 mr-2" />
                                Smart Suggestions
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={() => setShowAIModal(true)}
                        variant="secondary"
                        disabled={isGenerating}
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Custom AI Prompt
                    </Button>
                </div>

                {isGenerating && (
                    <div className="mt-4 flex items-center space-x-2 text-purple-600">
                        <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full"></div>
                        <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full animation-delay-75"></div>
                        <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full animation-delay-150"></div>
                        <span className="text-sm">AI is analyzing your project...</span>
                    </div>
                )}
            </Card>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
                        <Badge variant="primary" size="sm">
                            {suggestions.length} tasks
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        {suggestions.map((suggestion) => (
                            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                                            <Badge variant={getPriorityColor(suggestion.priority) as 'default' | 'primary' | 'success' | 'warning' | 'danger'} size="sm">
                                                {suggestion.priority}
                                            </Badge>
                                        </div>

                                        {suggestion.description && (
                                            <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                                        )}

                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            {suggestion.estimated_hours && (
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{suggestion.estimated_hours}h</span>
                                                </div>
                                            )}
                                            {suggestion.assignee && (
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{suggestion.assignee}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <Button
                                            onClick={() => generateSubtasks(suggestion.id, suggestion.name)}
                                            variant="ghost"
                                            size="sm"
                                            disabled={isGenerating && selectedParentTask === suggestion.id}
                                        >
                                            {isGenerating && selectedParentTask === suggestion.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-indigo-600"></div>
                                            ) : (
                                                <Target className="h-4 w-4" />
                                            )}
                                            Subtasks
                                        </Button>
                                        <Button
                                            onClick={() => acceptSuggestion(suggestion)}
                                            variant="primary"
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                AI analyzed your project &ldquo;{projectName}&rdquo; to generate these suggestions
                            </p>
                            <Button
                                onClick={() => setSuggestions([])}
                                variant="ghost"
                                size="sm"
                                className="text-gray-500"
                            >
                                Clear all
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Custom AI Prompt Modal */}
            <Modal
                isOpen={showAIModal}
                onClose={() => {
                    setShowAIModal(false);
                    setAiPrompt('');
                }}
                title="Custom AI Task Generation"
                size="md"
            >
                <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-purple-900">AI Task Assistant</h4>
                            <p className="text-sm text-purple-800 mt-1">
                                Describe what you want to accomplish and AI will generate relevant tasks for your project.
                            </p>
                        </div>
                    </div>

                    <Textarea
                        label="Describe your goal or feature"
                        placeholder="e.g., 'Create a user dashboard with analytics', 'Build a payment system', 'Implement real-time chat'..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={4}
                    />

                    <div className="text-sm text-gray-500">
                        <p className="mb-2">Examples:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>&ldquo;Build a responsive e-commerce checkout flow&rdquo;</li>
                            <li>&ldquo;Create a data visualization dashboard&rdquo;</li>
                            <li>&ldquo;Implement advanced search functionality&rdquo;</li>
                        </ul>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowAIModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={generateCustomTasks}
                            disabled={!aiPrompt.trim() || isGenerating}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Tasks
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 