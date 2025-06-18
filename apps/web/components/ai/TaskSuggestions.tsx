'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, IconButton } from '@ui';
import { useProjects } from '@/contexts/AppContext';

interface TaskSuggestion {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimatedHours: number;
    category: string;
    reasoning: string;
    confidence: number; // 0-100
    relatedProject?: string;
    suggestedAssignee?: string;
}

interface TaskSuggestionsProps {
    projectId?: string;
    limit?: number;
    onAcceptSuggestion?: (suggestion: TaskSuggestion) => void;
    onDismissSuggestion?: (suggestionId: string) => void;
}

export function TaskSuggestions({
    projectId,
    limit = 5,
    onAcceptSuggestion,
    onDismissSuggestion
}: TaskSuggestionsProps) {
    const projects = useProjects();
    const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

    // Generate AI-powered task suggestions based on project data
    useEffect(() => {
        const generateSuggestions = () => {
            setIsLoading(true);

            // Simulate AI analysis delay
            setTimeout(() => {
                const mockSuggestions: TaskSuggestion[] = [
                    {
                        id: 'sugg-1',
                        title: 'Set up automated testing pipeline',
                        description: 'Configure CI/CD pipeline with automated test execution for faster deployment cycles',
                        priority: 'high',
                        estimatedHours: 8,
                        category: 'DevOps',
                        reasoning: 'Based on recent commits and project complexity, automated testing would reduce manual QA time by 60%',
                        confidence: 85,
                        relatedProject: projectId || projects[0]?.id,
                        suggestedAssignee: 'DevOps Team'
                    },
                    {
                        id: 'sugg-2',
                        title: 'Implement user feedback collection',
                        description: 'Add in-app feedback widget and analytics to gather user insights',
                        priority: 'medium',
                        estimatedHours: 4,
                        category: 'Product',
                        reasoning: 'Similar projects show 40% better user retention when feedback is collected early',
                        confidence: 78,
                        relatedProject: projectId || projects[0]?.id,
                        suggestedAssignee: 'Product Team'
                    },
                    {
                        id: 'sugg-3',
                        title: 'Database optimization audit',
                        description: 'Review and optimize database queries for better performance',
                        priority: 'medium',
                        estimatedHours: 6,
                        category: 'Backend',
                        reasoning: 'Query analysis suggests 30% performance improvement potential with index optimization',
                        confidence: 92,
                        relatedProject: projectId || projects[0]?.id,
                        suggestedAssignee: 'Backend Team'
                    },
                    {
                        id: 'sugg-4',
                        title: 'Security vulnerability assessment',
                        description: 'Conduct comprehensive security audit and penetration testing',
                        priority: 'high',
                        estimatedHours: 12,
                        category: 'Security',
                        reasoning: 'Based on dependencies analysis, 3 medium-risk vulnerabilities detected',
                        confidence: 88,
                        relatedProject: projectId || projects[0]?.id,
                        suggestedAssignee: 'Security Team'
                    },
                    {
                        id: 'sugg-5',
                        title: 'Mobile responsiveness improvements',
                        description: 'Enhance mobile user experience with responsive design updates',
                        priority: 'medium',
                        estimatedHours: 10,
                        category: 'Frontend',
                        reasoning: 'Analytics show 65% mobile traffic with 25% higher bounce rate than desktop',
                        confidence: 82,
                        relatedProject: projectId || projects[0]?.id,
                        suggestedAssignee: 'Frontend Team'
                    },
                    {
                        id: 'sugg-6',
                        title: 'API documentation update',
                        description: 'Update and standardize API documentation with interactive examples',
                        priority: 'low',
                        estimatedHours: 3,
                        category: 'Documentation',
                        reasoning: 'Developer onboarding time could be reduced by 50% with better API docs',
                        confidence: 70,
                        relatedProject: projectId || projects[0]?.id,
                        suggestedAssignee: 'Technical Writer'
                    }
                ];

                // Filter by project if specified and apply limit
                const filteredSuggestions = mockSuggestions
                    .filter(sugg => !projectId || sugg.relatedProject === projectId)
                    .filter(sugg => !dismissedSuggestions.has(sugg.id))
                    .slice(0, limit);

                setSuggestions(filteredSuggestions);
                setIsLoading(false);
            }, 1500);
        };

        generateSuggestions();
    }, [projectId, limit, projects, dismissedSuggestions]);

    const handleAcceptSuggestion = (suggestion: TaskSuggestion) => {
        onAcceptSuggestion?.(suggestion);
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    };

    const handleDismissSuggestion = (suggestionId: string) => {
        setDismissedSuggestions(prev => new Set(prev).add(suggestionId));
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
        onDismissSuggestion?.(suggestionId);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'danger';
            case 'high':
                return 'warning';
            case 'medium':
                return 'primary';
            case 'low':
                return 'default';
            default:
                return 'default';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 85) return 'text-green-600';
        if (confidence >= 70) return 'text-yellow-600';
        return 'text-gray-600';
    };

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Analyzing project data...</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (suggestions.length === 0) {
        return (
            <Card className="p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No new task suggestions at the moment. Keep up the great work!</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">AI Task Suggestions</h3>
                        <p className="text-sm text-gray-600">Smart recommendations based on your project data</p>
                    </div>
                </div>
                <Badge variant="primary">{suggestions.length} suggestions</Badge>
            </div>

            <div className="space-y-4">
                {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                                    <Badge variant={getPriorityColor(suggestion.priority)} size="sm">
                                        {suggestion.priority}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {suggestion.estimatedHours}h
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span>{suggestion.category}</span>
                                    </span>
                                    {suggestion.suggestedAssignee && (
                                        <span className="flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>{suggestion.suggestedAssignee}</span>
                                        </span>
                                    )}
                                    <span className={`flex items-center space-x-1 ${getConfidenceColor(suggestion.confidence)}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <span>{suggestion.confidence}% confidence</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                                <IconButton
                                    onClick={() => handleDismissSuggestion(suggestion.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </IconButton>
                                <Button
                                    onClick={() => handleAcceptSuggestion(suggestion)}
                                    variant="primary"
                                >
                                    Add Task
                                </Button>
                            </div>
                        </div>

                        {/* AI Reasoning */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-800 mb-1">AI Analysis</p>
                                    <p className="text-xs text-blue-700">{suggestion.reasoning}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Suggestions updated based on recent project activity</span>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Refresh suggestions
                    </button>
                </div>
            </div>
        </Card>
    );
} 