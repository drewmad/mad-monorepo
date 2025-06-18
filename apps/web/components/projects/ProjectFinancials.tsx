'use client';

import { useState } from 'react';
import { Card, Button, Badge, Progress, Modal, Input, Select } from '@ui';

interface Transaction {
    id: string;
    project_id: string;
    workspace_id: string;
    item: string;
    description: string | null;
    category: 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other';
    amount: number; // in cents
    currency: string;
    transaction_date: string;
    receipt_url: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface ProjectFinancialsProps {
    projectId: string;
    budget: number;
    spent: number;
    transactions: Transaction[];
}

export function ProjectFinancials({
    projectId,
    budget,
    spent,
    transactions
}: ProjectFinancialsProps) {

    const [showCreateTransaction, setShowCreateTransaction] = useState(false);
    const [newTransaction, setNewTransaction] = useState<{
        item: string;
        description: string;
        category: 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other';
        amount: string;
        transaction_date: string;
    }>({
        item: '',
        description: '',
        category: 'materials',
        amount: '',
        transaction_date: new Date().toISOString().split('T')[0]
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount / 100);
    };

    const budgetUsedPercentage = budget > 0 ? (spent / budget) * 100 : 0;
    const remainingBudget = budget - spent;

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'materials': return 'primary';
            case 'labor': return 'success';
            case 'equipment': return 'warning';
            case 'software': return 'default';
            case 'services': return 'danger';
            default: return 'default';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'materials':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            case 'labor':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'equipment':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'software':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                );
            case 'services':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                );
        }
    };

    const categoryBreakdown = transactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
    }, {} as Record<string, number>);

    const handleCreateTransaction = () => {
        // TODO: Implement transaction creation API call
        console.log('Creating transaction:', {
            ...newTransaction,
            amount: parseFloat(newTransaction.amount) * 100, // Convert to cents
            project_id: projectId
        });

        setShowCreateTransaction(false);
        setNewTransaction({
            item: '',
            description: '',
            category: 'materials',
            amount: '',
            transaction_date: new Date().toISOString().split('T')[0]
        });
    };

    const categoryOptions = [
        { value: 'materials', label: 'Materials' },
        { value: 'labor', label: 'Labor' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'software', label: 'Software' },
        { value: 'services', label: 'Services' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <div className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Total Budget</h3>
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(budget)}</div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Spent</h3>
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(spent)}</div>
                    <div className="text-sm text-gray-500 mt-1">
                        {budgetUsedPercentage.toFixed(1)}% of budget
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Remaining</h3>
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatCurrency(Math.abs(remainingBudget))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        {remainingBudget < 0 ? 'Over budget' : 'Available'}
                    </div>
                </Card>
            </div>

            {/* Budget Progress */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Budget Usage</h3>
                    <span className="text-sm font-medium text-gray-600">
                        {budgetUsedPercentage.toFixed(1)}%
                    </span>
                </div>
                <Progress
                    value={budgetUsedPercentage}
                    variant={budgetUsedPercentage > 90 ? 'danger' : budgetUsedPercentage > 75 ? 'warning' : 'success'}
                    size="lg"
                    showValue={false}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{formatCurrency(spent)} spent</span>
                    <span>{formatCurrency(budget)} budget</span>
                </div>
            </Card>

            {/* Category Breakdown */}
            {Object.keys(categoryBreakdown).length > 0 && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(categoryBreakdown).map(([category, amount]) => (
                            <div key={category} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="text-gray-600">
                                    {getCategoryIcon(category)}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 capitalize">{category}</div>
                                    <div className="text-lg font-semibold text-gray-700">{formatCurrency(amount)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Transactions */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <Button onClick={() => setShowCreateTransaction(true)} variant="primary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Transaction
                    </Button>
                </div>

                {transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No transactions yet. Add your first expense to start tracking.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.slice(0, 10).map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="text-gray-600">
                                        {getCategoryIcon(transaction.category)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{transaction.item}</div>
                                        {transaction.description && (
                                            <div className="text-sm text-gray-500">{transaction.description}</div>
                                        )}
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge
                                                variant={getCategoryColor(transaction.category) as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
                                                size="sm"
                                            >
                                                {transaction.category}
                                            </Badge>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(transaction.transaction_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                    {transaction.receipt_url && (
                                        <button className="text-sm text-indigo-600 hover:text-indigo-700">
                                            View receipt
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Create Transaction Modal */}
            <Modal
                isOpen={showCreateTransaction}
                onClose={() => setShowCreateTransaction(false)}
                title="Add Transaction"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Item/Description"
                        placeholder="Office supplies, contractor payment, etc."
                        value={newTransaction.item}
                        onChange={(e) => setNewTransaction({ ...newTransaction, item: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            options={categoryOptions}
                            value={newTransaction.category}
                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value as 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other' })}
                        />

                        <Input
                            label="Amount ($)"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Date"
                        type="date"
                        value={newTransaction.transaction_date}
                        onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                        required
                    />

                    <Input
                        label="Notes (optional)"
                        placeholder="Additional details about this expense"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    />

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowCreateTransaction(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateTransaction}
                            disabled={!newTransaction.item.trim() || !newTransaction.amount.trim()}
                        >
                            Add Transaction
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 