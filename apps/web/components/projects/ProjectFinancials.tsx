'use client';

import { useState } from 'react';
import { Card, Button, Badge, Progress, Modal, Input, Select, Tabs, TabsList, TabsTrigger, TabsContent } from '@ui';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Plus, Download, Receipt } from 'lucide-react';

interface Transaction {
    id: string;
    item: string;
    description?: string;
    category: 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other';
    amount: number; // in cents
    currency: string;
    transaction_date: string;
    receipt_url?: string;
    created_by: string;
}

interface ProjectFinancialsProps {
    project: {
        id: string;
        name: string;
        budget: number;
        spent: number;
    };
    transactions?: Transaction[];
    timeTracked?: number; // in hours
    onTransactionAdd?: (transaction: Partial<Transaction>) => void;
}

export function ProjectFinancials({
    project,
    transactions = [],
    timeTracked = 0,
    onTransactionAdd
}: ProjectFinancialsProps) {
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [newTransaction, setNewTransaction] = useState<{
        item: string;
        description: string;
        category: 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other';
        amount: string;
        currency: string;
        transaction_date: string;
        receipt_url: string;
    }>({
        item: '',
        description: '',
        category: 'materials',
        amount: '',
        currency: 'USD',
        transaction_date: new Date().toISOString().split('T')[0],
        receipt_url: ''
    });

    const formatCurrency = (amount: number, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount / 100);
    };

    const budgetUsedPercentage = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
    const remainingBudget = project.budget - project.spent;
    const isOverBudget = remainingBudget < 0;

    // Calculate category breakdown
    const categoryTotals = transactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
    }, {} as Record<string, number>);

    const totalTransactionAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Mock data for demonstration
    const monthlySpending = [
        { month: 'Jan', amount: 15000 },
        { month: 'Feb', amount: 23000 },
        { month: 'Mar', amount: 18000 },
        { month: 'Apr', amount: 31000 },
        { month: 'May', amount: 27000 },
        { month: 'Jun', amount: 35000 }
    ];

    const handleAddTransaction = () => {
        const transactionData = {
            item: newTransaction.item,
            description: newTransaction.description || undefined,
            category: newTransaction.category,
            amount: Math.round(parseFloat(newTransaction.amount) * 100), // convert to cents
            currency: newTransaction.currency,
            transaction_date: newTransaction.transaction_date,
            receipt_url: newTransaction.receipt_url || undefined,
            created_by: 'current_user'
        };

        onTransactionAdd?.(transactionData);
        setShowAddTransaction(false);
        setNewTransaction({
            item: '',
            description: '',
            category: 'materials',
            amount: '',
            currency: 'USD',
            transaction_date: new Date().toISOString().split('T')[0],
            receipt_url: ''
        });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'materials': return '🏗️';
            case 'labor': return '👷';
            case 'equipment': return '⚙️';
            case 'software': return '💻';
            case 'services': return '🔧';
            default: return '📦';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'materials': return 'text-blue-600 bg-blue-50';
            case 'labor': return 'text-green-600 bg-green-50';
            case 'equipment': return 'text-purple-600 bg-purple-50';
            case 'software': return 'text-indigo-600 bg-indigo-50';
            case 'services': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            content: (
                <div className="space-y-6">
                    {/* Budget Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget)}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}>
                                    {isOverBudget ?
                                        <TrendingDown className="h-5 w-5 text-red-600" /> :
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Spent</p>
                                    <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                                        {formatCurrency(project.spent)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${isOverBudget ? 'bg-red-100' : 'bg-gray-100'}`}>
                                    {isOverBudget ?
                                        <AlertTriangle className="h-5 w-5 text-red-600" /> :
                                        <DollarSign className="h-5 w-5 text-gray-600" />
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {isOverBudget ? 'Over Budget' : 'Remaining'}
                                    </p>
                                    <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                                        {formatCurrency(Math.abs(remainingBudget))}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Budget Progress */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Usage</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {budgetUsedPercentage.toFixed(1)}% used
                                </span>
                            </div>
                            <Progress
                                value={Math.min(budgetUsedPercentage, 100)}
                                variant={budgetUsedPercentage > 100 ? 'danger' : budgetUsedPercentage > 80 ? 'warning' : 'default'}
                                size="lg"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{formatCurrency(project.spent)} spent</span>
                                <span>{formatCurrency(project.budget)} budget</span>
                            </div>
                            {isOverBudget && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-medium text-red-800">
                                            This project is over budget by {formatCurrency(Math.abs(remainingBudget))}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Category Breakdown */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(categoryTotals).map(([category, amount]) => {
                                const percentage = totalTransactionAmount > 0 ? (amount / totalTransactionAmount) * 100 : 0;
                                return (
                                    <div key={category} className={`p-4 rounded-lg ${getCategoryColor(category)}`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-lg">{getCategoryIcon(category)}</span>
                                            <h4 className="font-medium capitalize">{category}</h4>
                                        </div>
                                        <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
                                        <p className="text-sm opacity-75">{percentage.toFixed(1)}% of total</p>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Monthly Spending Trend */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
                        <div className="grid grid-cols-6 gap-4">
                            {monthlySpending.map((month) => {
                                const maxAmount = Math.max(...monthlySpending.map(m => m.amount));
                                const height = (month.amount / maxAmount) * 100;

                                return (
                                    <div key={month.month} className="text-center">
                                        <div className="h-32 flex items-end justify-center mb-2">
                                            <div
                                                className="w-8 bg-indigo-500 rounded-t transition-all duration-300 hover:bg-indigo-600"
                                                style={{ height: `${height}%` }}
                                                title={formatCurrency(month.amount)}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-600">{month.month}</div>
                                        <div className="text-xs font-medium text-gray-900">
                                            {formatCurrency(month.amount)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            )
        },
        {
            id: 'transactions',
            label: 'Transactions',
            content: (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <Button onClick={() => setShowAddTransaction(true)} variant="primary">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Transaction
                            </Button>
                        </div>
                    </div>

                    {transactions.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                            <p className="text-gray-500 mb-4">Start tracking your project expenses by adding your first transaction.</p>
                            <Button onClick={() => setShowAddTransaction(true)} variant="primary">
                                Add Transaction
                            </Button>
                        </Card>
                    ) : (
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Receipt
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{transaction.item}</div>
                                                        {transaction.description && (
                                                            <div className="text-sm text-gray-500">{transaction.description}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge variant="default" size="sm">
                                                        {getCategoryIcon(transaction.category)} {transaction.category}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(transaction.amount, transaction.currency)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(transaction.transaction_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {transaction.receipt_url ? (
                                                        <Button variant="ghost" size="sm">
                                                            <Receipt className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            )
        },
        {
            id: 'reports',
            label: 'Reports',
            content: (
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Cost per Hour</h4>
                                <p className="text-2xl font-bold text-gray-900">
                                    {timeTracked > 0 ? formatCurrency((project.spent / timeTracked) * 100) : '—'}
                                </p>
                                <p className="text-sm text-gray-500">Based on {timeTracked} hours tracked</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Burn Rate</h4>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(project.spent / 6)} {/* Assuming 6 months */}
                                </p>
                                <p className="text-sm text-gray-500">Average monthly spending</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                        <div className="space-y-4">
                            {Object.entries(categoryTotals)
                                .sort(([, a], [, b]) => b - a)
                                .map(([category, amount]) => {
                                    const percentage = project.spent > 0 ? (amount / project.spent) * 100 : 0;
                                    return (
                                        <div key={category} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">{getCategoryIcon(category)}</span>
                                                <span className="font-medium capitalize">{category}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{formatCurrency(amount)}</div>
                                                <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-2">Projected Completion Cost</h4>
                                <p className="text-lg font-bold text-blue-900">
                                    {formatCurrency(project.spent * 1.2)} {/* Simple 20% buffer */}
                                </p>
                                <p className="text-sm text-blue-700">
                                    Based on current spending patterns and 20% buffer
                                </p>
                            </div>

                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h4 className="font-medium text-yellow-900 mb-2">Budget Alert</h4>
                                <p className="text-sm text-yellow-800">
                                    {budgetUsedPercentage > 80
                                        ? 'High spending alert: Consider reviewing expenses'
                                        : 'Spending is within acceptable limits'
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    {tabs[0].content}
                </TabsContent>

                <TabsContent value="transactions">
                    {tabs[1].content}
                </TabsContent>

                <TabsContent value="reports">
                    {tabs[2].content}
                </TabsContent>
            </Tabs>

            {/* Add Transaction Modal */}
            <Modal
                isOpen={showAddTransaction}
                onClose={() => setShowAddTransaction(false)}
                title="Add Transaction"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Item/Service"
                        placeholder="Office supplies, developer hours, etc."
                        value={newTransaction.item}
                        onChange={(e) => setNewTransaction({ ...newTransaction, item: e.target.value })}
                        required
                    />

                    <Input
                        label="Description (optional)"
                        placeholder="Additional details about this expense"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    />

                    <Select
                        label="Category"
                        options={[
                            { value: 'materials', label: '🏗️ Materials' },
                            { value: 'labor', label: '👷 Labor' },
                            { value: 'equipment', label: '⚙️ Equipment' },
                            { value: 'software', label: '💻 Software' },
                            { value: 'services', label: '🔧 Services' },
                            { value: 'other', label: '📦 Other' }
                        ]}
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value as 'materials' | 'labor' | 'equipment' | 'software' | 'services' | 'other' })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                            required
                        />
                        <Select
                            label="Currency"
                            options={[
                                { value: 'USD', label: 'USD ($)' },
                                { value: 'EUR', label: 'EUR (€)' },
                                { value: 'GBP', label: 'GBP (£)' }
                            ]}
                            value={newTransaction.currency}
                            onChange={(e) => setNewTransaction({ ...newTransaction, currency: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Date"
                            type="date"
                            value={newTransaction.transaction_date}
                            onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                            required
                        />
                        <Input
                            label="Receipt URL (optional)"
                            placeholder="https://example.com/receipt.pdf"
                            value={newTransaction.receipt_url}
                            onChange={(e) => setNewTransaction({ ...newTransaction, receipt_url: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowAddTransaction(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddTransaction}
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