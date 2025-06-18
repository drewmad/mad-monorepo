'use client';

import { useState, useEffect } from 'react';
import { Card, Badge, Progress, Button, Modal, Toast } from '@ui';
import { useProjects, useTasks } from '@/contexts/AppContext';

interface Insight {
    id: string;
    type: 'performance' | 'prediction' | 'recommendation' | 'trend' | 'risk';
    title: string;
    description: string;
    value?: number;
    trend?: 'up' | 'down' | 'stable';
    severity?: 'info' | 'warning' | 'critical';
    actionable?: boolean;
    action?: string;
}

interface SmartAnalyticsProps {
    projectId?: string;
    timeframe?: '7d' | '30d' | '90d' | '1y';
}

export function SmartAnalytics({ projectId, timeframe = '30d' }: SmartAnalyticsProps) {
    const projects = useProjects();
    const tasks = useTasks();
    const [insights, setInsights] = useState<Insight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInsightType, setSelectedInsightType] = useState<string>('all');
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const generateInsights = () => {
            setIsLoading(true);

            // Simulate AI analysis
            setTimeout(() => {
                const mockInsights: Insight[] = [
                    {
                        id: 'perf-1',
                        type: 'performance',
                        title: 'Team Velocity Increasing',
                        description: 'Your team completed 23% more tasks this week compared to last week. The trend suggests improved workflow efficiency.',
                        value: 23,
                        trend: 'up',
                        severity: 'info',
                        actionable: false
                    },
                    {
                        id: 'pred-1',
                        type: 'prediction',
                        title: 'Project Completion Forecast',
                        description: 'Based on current velocity, Project Alpha is predicted to complete 4 days ahead of schedule with 89% confidence.',
                        value: 89,
                        trend: 'up',
                        severity: 'info',
                        actionable: true,
                        action: 'Consider allocating resources to other projects'
                    },
                    {
                        id: 'risk-1',
                        type: 'risk',
                        title: 'Potential Burnout Risk Detected',
                        description: 'Sarah Chen has been consistently working 15% above average hours. Consider redistributing workload to prevent burnout.',
                        value: 15,
                        trend: 'up',
                        severity: 'warning',
                        actionable: true,
                        action: 'Redistribute workload or schedule time off'
                    },
                    {
                        id: 'trend-1',
                        type: 'trend',
                        title: 'Bug Report Trend',
                        description: 'Bug reports have decreased by 35% over the past month, indicating improved code quality and testing processes.',
                        value: 35,
                        trend: 'down',
                        severity: 'info',
                        actionable: false
                    },
                    {
                        id: 'rec-1',
                        type: 'recommendation',
                        title: 'Optimize Sprint Planning',
                        description: 'Tasks with "high" priority are completed 40% faster than "medium" priority. Consider restructuring priority assignments.',
                        value: 40,
                        trend: 'stable',
                        severity: 'info',
                        actionable: true,
                        action: 'Review and adjust task prioritization strategy'
                    },
                    {
                        id: 'perf-2',
                        type: 'performance',
                        title: 'Meeting Efficiency',
                        description: 'Average meeting duration decreased by 12 minutes this month, saving approximately 8 hours of team time weekly.',
                        value: 12,
                        trend: 'down',
                        severity: 'info',
                        actionable: false
                    },
                    {
                        id: 'risk-2',
                        type: 'risk',
                        title: 'Dependency Vulnerability',
                        description: 'Critical security vulnerability detected in 3 project dependencies. Immediate attention required.',
                        value: 3,
                        trend: 'stable',
                        severity: 'critical',
                        actionable: true,
                        action: 'Update dependencies immediately'
                    },
                    {
                        id: 'trend-2',
                        type: 'trend',
                        title: 'Code Review Turnaround',
                        description: 'Code review approval time has improved by 18% this month, accelerating deployment cycles.',
                        value: 18,
                        trend: 'up',
                        severity: 'info',
                        actionable: false
                    }
                ];

                setInsights(mockInsights);
                setIsLoading(false);
            }, 2000);
        };

        generateInsights();
    }, [projectId, timeframe, projects, tasks]);

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'performance':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                );
            case 'prediction':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                );
            case 'recommendation':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            case 'trend':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                );
            case 'risk':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getSeverityColor = (severity?: string) => {
        switch (severity) {
            case 'critical':
                return 'text-red-600 bg-red-100';
            case 'warning':
                return 'text-yellow-600 bg-yellow-100';
            case 'info':
            default:
                return 'text-blue-600 bg-blue-100';
        }
    };

    const getTrendIcon = (trend?: string) => {
        switch (trend) {
            case 'up':
                return (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                );
            case 'down':
                return (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l9.2 9.2M17 7v10H7" />
                    </svg>
                );
            case 'stable':
                return (
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const showNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleTakeAction = (insight: Insight) => {
        setSelectedInsight(insight);
        setShowActionModal(true);
    };

    const executeAction = () => {
        if (!selectedInsight) return;

        // Simulate taking action based on insight type
        switch (selectedInsight.type) {
            case 'risk':
                if (selectedInsight.id === 'risk-1') {
                    showNotification('Workload redistribution initiated. Sarah Chen\'s tasks are being reviewed.');
                } else if (selectedInsight.id === 'risk-2') {
                    showNotification('Dependencies update process started. Security patches will be applied.');
                }
                break;
            case 'prediction':
                showNotification('Resource allocation optimization scheduled for next sprint.');
                break;
            case 'recommendation':
                showNotification('Task prioritization strategy review added to next team meeting agenda.');
                break;
            default:
                showNotification(`Action executed for: ${selectedInsight.title}`);
        }

        setShowActionModal(false);
        setSelectedInsight(null);
    };

    const filteredInsights = selectedInsightType === 'all'
        ? insights
        : insights.filter(insight => insight.type === selectedInsightType);

    const insightTypes = [
        { key: 'all', label: 'All Insights', count: insights.length },
        { key: 'performance', label: 'Performance', count: insights.filter(i => i.type === 'performance').length },
        { key: 'prediction', label: 'Predictions', count: insights.filter(i => i.type === 'prediction').length },
        { key: 'risk', label: 'Risks', count: insights.filter(i => i.type === 'risk').length },
        { key: 'trend', label: 'Trends', count: insights.filter(i => i.type === 'trend').length },
        { key: 'recommendation', label: 'Recommendations', count: insights.filter(i => i.type === 'recommendation').length }
    ];

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <h3 className="text-xl font-semibold text-gray-900">Generating AI Insights...</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Smart Analytics</h2>
                            <p className="text-sm text-gray-600">AI-powered insights about your project performance</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={timeframe}
                            onChange={(e) => console.log('Timeframe changed:', e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                    </div>
                </div>

                {/* Insight Type Filters */}
                <div className="flex flex-wrap gap-2">
                    {insightTypes.map((type) => (
                        <button
                            key={type.key}
                            onClick={() => setSelectedInsightType(type.key)}
                            className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedInsightType === type.key
                                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                                }
              `}
                        >
                            <span>{type.label}</span>
                            <Badge variant={selectedInsightType === type.key ? 'primary' : 'default'} size="sm">
                                {type.count}
                            </Badge>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Insights */}
            <div className="space-y-4">
                {filteredInsights.map((insight) => (
                    <Card key={insight.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(insight.severity)}`}>
                                {getInsightIcon(insight.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                                    {insight.trend && getTrendIcon(insight.trend)}
                                    {insight.value && (
                                        <Badge variant="default" size="sm">
                                            {insight.type === 'prediction' ? `${insight.value}%` :
                                                insight.type === 'performance' || insight.type === 'trend' ? `${insight.value}%` :
                                                    insight.value}
                                        </Badge>
                                    )}
                                    <Badge
                                        variant={insight.type === 'risk' ? 'danger' : 'default'}
                                        size="sm"
                                        className="capitalize"
                                    >
                                        {insight.type}
                                    </Badge>
                                </div>

                                <p className="text-gray-600 mb-3">{insight.description}</p>

                                {/* Progress bar for prediction confidence */}
                                {insight.type === 'prediction' && insight.value && (
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-500">Confidence Level</span>
                                            <span className="font-medium">{insight.value}%</span>
                                        </div>
                                        <Progress value={insight.value} className="h-2" />
                                    </div>
                                )}

                                {/* Action button */}
                                {insight.actionable && insight.action && (
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                        <span className="text-sm text-gray-600">Recommended Action: {insight.action}</span>
                                        <Button
                                            variant={insight.severity === 'critical' ? 'danger' : 'primary'}
                                            onClick={() => handleTakeAction(insight)}
                                        >
                                            Take Action
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredInsights.length === 0 && (
                <Card className="p-12">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No insights available</h3>
                        <p className="text-gray-500">
                            {selectedInsightType === 'all'
                                ? 'We\'re still gathering data to provide meaningful insights.'
                                : `No ${selectedInsightType} insights available for the selected timeframe.`
                            }
                        </p>
                    </div>
                </Card>
            )}

            {/* Action Modal */}
            <Modal
                isOpen={showActionModal}
                onClose={() => {
                    setShowActionModal(false);
                    setSelectedInsight(null);
                }}
                title="Confirm Action"
                size="md"
            >
                {selectedInsight && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">{selectedInsight.title}</h4>
                            <p className="text-sm text-gray-600">{selectedInsight.description}</p>
                        </div>

                        {selectedInsight.action && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-1">Recommended Action:</p>
                                <p className="text-sm text-blue-700">{selectedInsight.action}</p>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-600">
                                {selectedInsight.type === 'risk' && 'This will initiate the risk mitigation process.'}
                                {selectedInsight.type === 'prediction' && 'This will schedule resource optimization for your team.'}
                                {selectedInsight.type === 'recommendation' && 'This will add the recommendation to your action items.'}
                                {(selectedInsight.type === 'performance' || selectedInsight.type === 'trend') && 'This will log the insight for future reference.'}
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="secondary" onClick={() => setShowActionModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant={selectedInsight.severity === 'critical' ? 'danger' : 'primary'}
                                onClick={executeAction}
                            >
                                Execute Action
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Toast Notification */}
            {showToast && (
                <Toast
                    id="smart-analytics-toast"
                    message={toastMessage}
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
} 