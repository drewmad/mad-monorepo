'use client';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface ToastProps {
    id: string;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, title, message, type = 'info', duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => {
                setIsVisible(false);
                onClose(id);
            }, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div
            className={clsx(
                'flex items-start p-4 border rounded-lg shadow-lg transition-all duration-300 max-w-sm',
                getColors(),
                isLeaving ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
            )}
        >
            <div className="flex-shrink-0 mr-3">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className="text-sm font-medium mb-1">{title}</h4>
                )}
                <p className="text-sm">{message}</p>
            </div>
            <button
                onClick={() => {
                    setIsLeaving(true);
                    setTimeout(() => {
                        setIsVisible(false);
                        onClose(id);
                    }, 300);
                }}
                className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

// Toast Container Component
interface ToastContainerProps {
    toasts: Array<{
        id: string;
        title?: string;
        message: string;
        type?: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
    }>;
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    title={toast.title}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={onRemove}
                />
            ))}
        </div>
    );
}

// Hook for managing toasts
export function useToast() {
    const [toasts, setToasts] = useState<Array<{
        id: string;
        title?: string;
        message: string;
        type?: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
    }>>([]);

    const addToast = (toast: {
        title?: string;
        message: string;
        type?: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
    }) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return {
        toasts,
        addToast,
        removeToast,
        success: (message: string, title?: string) => addToast({ message, title, type: 'success' }),
        error: (message: string, title?: string) => addToast({ message, title, type: 'error' }),
        warning: (message: string, title?: string) => addToast({ message, title, type: 'warning' }),
        info: (message: string, title?: string) => addToast({ message, title, type: 'info' }),
    };
} 