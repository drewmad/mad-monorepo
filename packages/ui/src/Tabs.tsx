'use client';

import clsx from 'clsx';
import { createContext, useContext, useState } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
    onValueChange?: (value: string) => void;
}

export const Tabs = ({ defaultValue, children, className, onValueChange }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        onValueChange?.(tab);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className={clsx('w-full', className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export const TabsList = ({ children, className }: TabsListProps) => (
    <div
        className={clsx(
            'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
            className
        )}
    >
        {children}
    </div>
);

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={clsx(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
                isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900',
                className
            )}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsContent = ({ value, children, className }: TabsContentProps) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    const { activeTab } = context;
    if (activeTab !== value) return null;

    return (
        <div
            className={clsx(
                'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
                className
            )}
        >
            {children}
        </div>
    );
};
